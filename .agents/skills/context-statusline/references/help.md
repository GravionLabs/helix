# /context-statusline

## Usage

`/context-statusline [-Client claude|copilot|all] [-Force] [-Uninstall] [-NoContextWarning] [-WhatIf]`

Runs `pwsh scripts/Install-Statusline.ps1` with the given parameters. Without arguments it installs for Claude Code.

## Arguments and flags

- `-Client claude|copilot|all`: client to configure (default `claude`). Copilot CLI gets the status line and, unless `-NoContextWarning`, the `postToolUse` context warning hook.
- `-Force`: replace a `statusLine` / `subagentStatusLine` you set yourself.
- `-NoContextWarning`: do not register the context warning hook.
- `-Uninstall`: remove only the entries of this skill (status lines, hook, copies of older versions).
- `-WhatIf`: show what would change, write nothing.
- `help` (or `--help`, `-h`): print this text.

What you get:

- Status line (`statusline.mjs`): `user@host:dir`, model, `ctx:<pct>% (<used>k/<size>k)`, `(git branch)`, `5h:<pct>% 7d:<pct>%`. Null or missing fields are skipped.
- Subagent line (`subagent-statusline.mjs`, Claude Code only): one row per subagent with type, model, `ctx:<pct>%` and label.

- Context warning hook (`context-warning.sh`, bash): `UserPromptSubmit` on Claude Code, `postToolUse` on Copilot CLI. At `CONTEXT_WARN_TOKENS` (default 150000) the user sees a hint and the model is told to hand off and `/clear` (or `/compact`); the next warning needs `CONTEXT_WARN_STEP` (default 100000) more tokens. `CONTEXT_WARN_DEBUG=1` prints notes on stderr.

Requires Node >= 22 and PowerShell 7+. Both scripts run on every refresh: no network, always exit 0.

## Examples

- `/context-statusline -WhatIf`: preview the change for Claude Code.
- `/context-statusline`: install for Claude Code.
- `/context-statusline -Client all`: install for Claude Code and Copilot CLI.
- `/context-statusline -Force`: replace your own status line entries.
- `/context-statusline -Uninstall`: remove the entries again.

## Config

Settings (status lines and the hook) are written, not read from `.agents/config.json`: Claude Code `~/.claude/settings.json`; Copilot CLI `~/.copilot/settings.json` (or `$COPILOT_HOME/settings.json`). A `settings.json.bak-<timestamp>` is written first, other keys are kept. Restart the client to see the lines.

## See also

- `npx skills update` refreshes the scripts (the settings point at the installed skill, no copy).
- Docs: https://github.com/GravionLabs/skills/blob/main/docs/usage/statusline.md
