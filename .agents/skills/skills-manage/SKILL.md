---
name: skills-manage
description: '/skills-manage: detect the stack, install the matching GravionLabs skill groups into this project or globally (-g) with npx skills, or update installed skills and pick up new group members. Use for "install the skills", "update the skills".'
disable-model-invocation: true
metadata:
  opencode/autoinvoke: 'false'
---

# skills-manage

`help` (or `--help`, `-h`): print `references/help.md` unchanged, nothing else.

`scripts/Install-Skills.ps1` resolves the skill groups a project needs and installs their skills with `npx skills add GravionLabs/skills --skill …`. PowerShell 7+ and Node.js 22+ (`npx`) are required; the script exits 1 with a hint otherwise. Run from the project root.

## Slash usage

`/skills-manage` (detect and propose), `/skills-manage ts py` (named groups, no detection), `/skills-manage core -g` (user-wide), `/skills-manage dry-run ...` (print the commands only), `/skills-manage update [-g]` (update installed skills, then propose new group members). Mapping: `dry-run` is `-DryRun`, `-g` is `-Global`, remaining words are `-Groups` (comma-separated on the command line: `-Groups ts,py`). Valid: `shared`, `github`, `delivery`, `statusline`, `ts`, `py`, `ng`, `dotnet`, `rust`, `go` and the presets `core`, `all`; anything else makes the script exit 1. What each group brings: [groups](references/groups.md).

## Steps

1. Always run a dry run first and show the user the proposal (`groups`, `wouldInstall`, `skipped`, `commands`, `notes`):

   ```powershell
   pwsh scripts/Install-Skills.ps1 -DryRun                    # detect, propose
   pwsh scripts/Install-Skills.ps1 -DryRun -Groups ts,py      # explicit groups
   pwsh scripts/Install-Skills.ps1 -DryRun -Groups core -Global
   ```

2. Ask for confirmation. Never install without it, even when the groups were named in the slash command.
3. Run the same command without `-DryRun`. The result lists `installed`, `skipped` (already present in the target scope), `failed`, `dependencies` (`angular/skills` for `ng`, `dotnet/skills` for `dotnet`) and `notes`. Tell the user what was installed, which dependencies came along, and any failure.
4. Relay the `notes` and follow [after install](references/after-install.md): what to commit, and the allowlist of the harness with the verify commands of the repository's `AGENTS.md` for `/deliver`.

5. After the `delivery` group was installed (project or global): offer the `deliver-loop` shell command. Ask first; show `pwsh scripts/Install-LoopShim.ps1 -DryRun` (profile and block), then run it without `-DryRun` on a yes. A second run reports `unchanged`. It never touches a profile unasked; `-Shell zsh|bash|pwsh`, `-ProfilePath <file>`.

## Update

`/skills-manage update [dry-run] [<group>...] [-g]` (`-Update`): `pwsh scripts/Install-Skills.ps1 -Update -DryRun [-Global]` runs `npx skills check` and shows its output as `check`. Ask for confirmation, then run it without `-DryRun`: `npx skills update` runs, then the script starts itself in a new process (refreshed `groups.json`) and lists the skills new in the installed groups as `newMembers`. Offer them: dry run and confirmation as for an install, `-Groups <groups>` without `-Update`.

## Script inputs and output

- Inputs: `-Groups` (comma-separated; skips detection), `-Global`, `-DryRun`, `-Ref <tag|sha>` (installs `GravionLabs/skills#<ref>`; without it the default branch), `-Agents` (default `claude-code,opencode,github-copilot`), `-Copy` (on by default on Windows), `-TrustProject`.
- Without `-Groups` the script runs `detect-techstack` (also under `-DryRun`) from your home skill directories. A copy found only in the project is repository code and is not run unless `-TrustProject` is passed; ask the user before doing so in a repository they do not trust.
- Output is JSON on stdout: `dryRun`, `groups`, `wouldInstall` or `installed`, `skipped`, `failed`, `commands`, `dependencies`, `notes`. A failing `npx skills add` stops the run with exit 1.

## Missing prerequisites

`npx` missing: install Node.js 22+ (`winget install OpenJS.NodeJS`, `brew install node`). Do not install tools for the user without asking. The skills CLI sends anonymous telemetry; `DISABLE_TELEMETRY=1` turns it off.
