# herdr progress display

Only when `printenv HERDR_ENV` prints `1` (the session runs in a herdr pane). Without herdr nothing here runs.

When `scripts/Invoke-DeliverLoop.ps1` started this session it owns the pane display: it runs the harness with `HERDR_ENV` empty (so `printenv HERDR_ENV` prints nothing and this file is skipped), reports the same tokens per progress line with the loop position in the step (`deliver_step=3/7 review: clean`) and clears them at the end (`references/loop.md`).

## Start

`printenv HERDR_PANE_ID` once and keep the pane id. Every later call carries the id as a literal: Claude Code denies any command with `$HERDR_PANE_ID` in it, quoted or not (checked headless with `--permission-mode default`, 2026-10-29).

## Per step

After the progress line of a step, report it as pane tokens:

```powershell
herdr pane report-metadata <pane> --source deliver --token deliver=#12 --token "deliver_step=review: 1 blocking" --token deliver_pr=#55 --ttl-ms 3600000
```

- `deliver=#<nr>`: the PBI or Bug of the progress line.
- `deliver_step=<step>[: <result>]`: the step and its result from the progress line, at most 80 characters (cut longer ones).
- `deliver_pr=#<pr>`: only once the PR exists (from the `pr` step on).

The tokens never replace the agent name: the sidebar keeps showing the harness (`claude`, `opencode`). herdr keeps them per source for the TTL (one hour), so a crashed run does not leave them forever. Token names are 1–32 ASCII letters, digits, `_` or `-`; at most 16 per report.

## End

After the report:

```powershell
herdr pane report-metadata <pane> --source deliver --clear-token deliver --clear-token deliver_step --clear-token deliver_pr
```

## Sidebar layout

The Agent sidebar shows a token only where one of its rows names it as `$<name>`. Every repository is its own herdr space (`workspace`) with the tabs `agent` and `terminal`. The proposed layout starts with the space and its state, then the agent and its terminal title (Claude Code writes its current topic there), and the `deliver` tokens last (propose it, never write it):

```
● herdr-plugins · idle
  claude · Fix login race
  #121 · merged · #139
```

```toml
[ui.sidebar.agents]
rows = [
  ["state_icon", { token = "workspace", bold = true }, { token = "state_text", rules = [{ equals = "done", fg = "#5f5" }, { equals = "blocked", fg = "#f55" }] }],
  [{ token = "agent", dim = true }, "terminal_title_stripped"],
  [{ token = "$deliver", bold = true }, { token = "$deliver_step", rules = [{ contains = "blocked", fg = "#f55" }, { contains = "merged", fg = "#5f5" }] }, "$deliver_pr"],
]
```

Alternatives: `["agent", "pane"]` in row 2 when a space holds several agent panes, a compact two-line layout (the `$deliver` tokens share row 2 with `agent`, no terminal title), the `deliver` line first (move the third row to the top), or `row_gap = 1` under `[ui.sidebar.agents]` for air between the rows.

A herdr plugin can filter panes on the `deliver` token of source `deliver`.

## Agent state

Besides the tokens, `Invoke-DeliverLoop.ps1` reports the pane state (`herdr pane report-agent --source deliver-loop --agent deliver --state working|blocked|idle`, then `release-agent`), so the sidebar does not show `idle` while the loop delivers. Details in `loop.md` "Observability". Start the loop in its own pane: in a pane with another agent the loop reports nothing (see below).

## Log pane toggle

`scripts/Switch-LogPane.ps1` toggles the `deliver-log` pane of the active tab. The loop opens that pane itself only with `-LogPane`; by default it colors its own console output, and this toggle shows the log from another pane. herdr has no hide, so it closes the pane, and opens it again below the active pane (last 40 lines of `.agents/deliver-loop.ansi.log` under the pane's cwd, else `.agents/deliver-loop.log`). Never two in one tab; no log or outside herdr: no pane, exit 0. A keybinding for the user's herdr config (propose it, never write it; `<skill dir>` is the installed `deliver` skill):

```toml
[[keys.command]]
key = "prefix+l"
type = "shell"
command = "pwsh -NoProfile -File <skill dir>/scripts/Switch-LogPane.ps1"
description = "toggle deliver log"
```

`type = "shell"` runs detached from the focused pane's cwd with `HERDR_ACTIVE_TAB_ID`, `HERDR_ACTIVE_PANE_ID` and `HERDR_ACTIVE_PANE_CWD` set; these count as in herdr even without `HERDR_ENV`. With a herdr plugin, `type = "plugin_action"` takes its place and the script reads `HERDR_TAB_ID` and `HERDR_PANE_ID` (with `HERDR_ENV=1`).

The allowlist entries (`printenv HERDR_ENV`, `printenv HERDR_PANE_ID`, `herdr pane report-metadata`) are in `references/permissions.md`.

## Verified against a live herdr

Checked 2026-11-04 in a spare workspace (closed afterwards) with the herdr CLI of this machine:

- `herdr workspace create --cwd <dir> --label <l> --no-focus` returns `result.tab.tab_id` and `result.root_pane.pane_id` (also `workspace.workspace_id`); `Start-LoopWorkspace.ps1` reads exactly these. `herdr tab rename <tab> <label>` and `herdr pane run <pane> "<command line>"` work as used.
- `report-agent` and `release-agent` take the pane id as a positional. `report-agent --source … --agent … --state … <pane>` works, but `release-agent --source … --agent … <pane>` fails with `unknown option: deliver-loop`; `release-agent <pane> --source … --agent …` works. The loop therefore puts the pane id right after the subcommand for both.
- Another agent in the pane: `report-agent` from a second source replaces the shown agent and state, and `release-agent` of that source does not restore the first one (the pane showed `unknown`). So the two compete. `herdr pane get <pane>` has an `agent` field; the loop reports only when it is empty or `deliver`, otherwise it prints one step line and stays silent.
- Not verified: a real agent process detected by herdr (a second `report-agent` source stood in for it), and Ctrl+C of a live loop (covered by `finally` and the error-path test).

## Quoting for the pane shell

`Start-LoopWorkspace.ps1` quotes the command line for the shell of the new pane: POSIX single quotes for sh, bash, zsh, dash, ksh and fish; doubled single quotes for pwsh and powershell. The shell is `-PaneShell`, else `DELIVER_LOOP_PANE_SHELL`, else the name of `$SHELL` (Windows: pwsh, elsewhere unset: sh). Any other shell (cmd, nu, …) fails before herdr is called with a message, and the shim then runs the loop in the current terminal.
