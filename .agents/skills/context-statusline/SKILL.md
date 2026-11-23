---
name: context-statusline
description: '/context-statusline: install a status line (model, context %, git branch, limits) for Claude Code or Copilot CLI, plus a context warning hook. Use for "show context usage in the status line".'
disable-model-invocation: true
metadata:
  opencode/autoinvoke: 'false'
---

# context-statusline

`help` (or `--help`, `-h`): print `references/help.md` unchanged, nothing else.

Claude Code (status line, context warning hook) and GitHub Copilot CLI (status line and context warning hook, experimental). A Node script (Node >= 22, no dependencies) and an installer (PowerShell 7+) that points the client settings at them.

## Install

```powershell
pwsh scripts/Install-Statusline.ps1 -WhatIf     # show what would change
pwsh scripts/Install-Statusline.ps1             # install for Claude Code (default)
pwsh scripts/Install-Statusline.ps1 -Client copilot   # or: all
pwsh scripts/Install-Statusline.ps1 -NoContextWarning   # without the context warning hook
pwsh scripts/Install-Statusline.ps1 -Force      # replace a statusLine you set yourself
pwsh scripts/Install-Statusline.ps1 -Uninstall  # remove only our entries (and copies of older versions)
```

The installer points `statusLine` at the skill's own script (it removes our own `subagentStatusLine` of an older version: Claude Code 2.1.323 dropped that setting) and registers the context warning hook (`UserPromptSubmit` for Claude Code, `postToolUse` for Copilot CLI with `-Client copilot|all`; `npx skills` installs no hooks), with no copy, so `npx skills update` refreshes them, keeps every other settings key, writes a backup first and is idempotent. A foreign entry is refused without `-Force`. Restart Claude Code to see the line. Details (paths, `-Client copilot`, migration, `-Uninstall`): https://github.com/GravionLabs/skills/blob/main/site/usage/statusline.md.

## What you get

| Script           | Output                                                                                                                                                                                                                                                                                                                                  |
| :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `statusline.mjs` | `user@host:dir`, model, `ctx:<pct>% (<used>k/<size>k)` (no size part without a window size), `(git branch)`, `5h:<pct>% 7d:<pct>%` (each limit green below 50 %, yellow below 80 %, red above; `ctx` yellow from min(50 %, 250k tokens), red from min(80 %, 500k), 50/80 % without a size). Fields that are null or missing are skipped |

## Context warning hook

`scripts/context-warning.sh` (bash) warns once the session context reaches `CONTEXT_WARN_TOKENS` (default: `min(50 %, 250k)` of the window size when known (Copilot `maxPromptTokens`, Claude model id `[1m]`), else 150000; an explicit value wins): the user sees a `systemMessage`, the model gets the same text as `additionalContext`: finish the step, write a short hand-off, then `/clear` (or `/compact`). `CONTEXT_WARN_STEP` (default 100000) is the growth before the next warning. `CONTEXT_WARN_DEBUG=1` prints notes on stderr. Never blocks, no network.

## Rules

- The script runs on every refresh: no network, always exit 0. Use the installer, never hand-edit `settings.json`.
- Copilot CLI sends no `rate_limits` (the `5h`/`7d` part stays empty); its payload fields are from community guides, not official docs. OpenCode has no equivalent.
