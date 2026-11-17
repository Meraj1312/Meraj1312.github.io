---
type: challenge
platform: Hack The Box
category: "hardware"
difficulty: "very_easy"
status: Documents
date_started: 2026-09-08
date_completed: 2026-09-08
tags:
  - htb
  - challenge
  - ics
  - scada
  - modbus
  - forensics
  - pcap
---

# Watch Tower

## Overview

**Category:** hardware
**Difficulty:** very easy
**Platform:** Hack The Box
**Date:** 2026-09-08

> [!note] Challenge Scenario
>
> > Our infrastructure monitoring system detected some abnormal behavior in the network and initiated a network capture. We need to identify information the intruders collected and altered in the network.
>
> English summary: Given a `tower_logs.pcapng` capture of Modbus/TCP traffic. An attacker issued `Write Multiple Registers` (Function Code 0x10) commands to a Modbus slave. Goal is to identify what was written and recover the embedded flag.

## Enumeration

I loaded the capture in Wireshark and confirmed the entire traffic was **Modbus/TCP**. I enumerated which function codes were present:

```bash
tshark -r tower_logs.pcapng -T fields -e modbus.func_code | sort -u -g
```

Output: `1`, `15`, `16`.

| Function Code | Meaning                |
| ------------- | ---------------------- |
| 1  (0x01)     | Read Coils             |
| 15 (0x0F)     | Write Multiple Coils   |
| 16 (0x10)     | Write Multiple Registers |

A quick look at the interesting fields:

- The `Write Multiple Coils` (15) write nine bytes `8b7a15...` to coils 1-21 — high entropy, but no ASCII in those bytes.
- `Write Multiple Registers` (16) is where the flag lives.

## Vulnerability

The twist in this challenge: the **ASCII characters of the flag are hidden in the Register Number (Reference Number) field** of the FC 0x10 writes — **not** in the register values / data payload. That mirrors a covert channel: encoding data in a protocol field nobody is looking at.

## Exploitation

I inspected every FC 0x10 write request and pulled the target register of each:

```bash
tshark -r tower_logs.pcapng -Y "modbus.func_code == 16 and tcp.dstport == 502" -T fields -e modbus.reference_num -e modbus.regval_uint16
```

The `reference_num` values lined up with printable ASCII. I piped them to ASCII:

```bash
tshark -r tower_logs.pcapng -Y "modbus.func_code == 16" -T fields -e modbus.reference_num | awk '{printf "%c", $1}'
```

Done — the registers decoded straight into the flag.

> [!note] Initial pitfall
> I first tried to decode the written **values** (register data), which returned gibberish. The flag is deliberately in the **register numbers** (addresses being written to), an unusual / non-standard placement.

### Alternative (Python)

```python
import pandas as pd

df = pd.read_csv("Watchtower.csv")                       # Wireshark "Export Packet Dissections > As CSV" of reference_num
vals = pd.to_numeric(df['Register Number'], errors='coerce').dropna().astype(int)

flag = ""
for v in vals:
    if 32 <= v <= 126:
        flag += chr(v)
        if chr(v) == "}":
            break
print("Flag:", flag)
```

> [!info] Tools Used
>
> - `wireshark` / `tshark` (`modbus.func_code == 16`, `modbus.reference_num`)
> - `awk` / `python3`

## Flag

`HTB{...}`

## References

- https://medium.com/@thenuclearunicorn/htb-ics-and-scada-exploitation-track-watch-tower-write-up-5d9b1571b70c
- https://sud0ru.ghost.io/ics-security-series-part-1/
- https://medium.com/@orbalog9/watch-tower-modbus-protocol-forensics-htb-challenge-write-up-b2288b45368c
- https://medium.com/@biero-llagas/htb-ics-tracks-write-up-factory-watch-tower-and-intrusion-13065c1b0e93