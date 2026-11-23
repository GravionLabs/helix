---
name: check-prerequisites
description: 'Check that the tools the GravionLabs skills need (pwsh 7+, Git, Node.js, npm; optionally gh, jq, yq, ast-grep, Python 3) are installed, and install missing ones. Use when setting up an environment.'
---

Verify the environment for the GravionLabs skills. Paths to `scripts/` are relative to this skill's directory.

- Run `pnpm run check` to execute the local build, formatting, manifest, skill-report, and test checks.
- **Core/runtime** (always): PowerShell 7+, Git, Node.js, npm
- **Required with `sgconfig.yml`** (git toplevel or working directory, even without `-Full`): `ast-grep`; a missing one exits 1 and `-AutoInstall` installs it. The binary is `ast-grep`, never `sg` (shadow-utils on Linux).
- **Required with `.github/workflows/`** (git toplevel or working directory, even without `-Full`): `actionlint`, `zizmor`, `shellcheck`; a missing one exits 1 with an install hint and `-AutoInstall` installs it (zizmor via `pipx` or `brew`, actionlint via `brew` or `go install`). Without the directory they are not checked.
- **Required with `.gitleaks.toml`** (git toplevel or working directory, even without `-Full`): `gitleaks`; a missing one exits 1 with an install hint (winget, brew, a release download on Linux) and `-AutoInstall` installs it with winget or brew. Without the file it is optional (`-Full`).
- **Optional** (`-Full`): `gh`, `curl`, `jq`, `yq`, `ast-grep` (without `sgconfig.yml`), `gitleaks` (without `.gitleaks.toml`), Python 3.

```powershell
pwsh scripts/Check-Prerequisites.ps1 [-Full] [-AutoInstall]
```

The script prints each tool with its version or ✗ and installation instructions per platform. `-AutoInstall` uses `winget` (Windows), `brew` (macOS) or `apt-get`/`dnf` (Linux).

## Gotchas

- Must run under PowerShell 7+ (`pwsh`), not `sh`
- `-AutoInstall` may need administrator rights on Windows and needs internet access
- Custom package managers are not supported; install those tools manually
