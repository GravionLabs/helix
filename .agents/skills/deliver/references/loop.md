# Loop: a fresh session per PBI

```powershell
pwsh <skill-dir>/scripts/Invoke-DeliverLoop.ps1 -Milestone M4 -Max 5
pwsh <skill-dir>/scripts/Invoke-DeliverLoop.ps1 -Target 860,870 -Model opus
```

Or with the shell command `deliver-loop` (`skills-manage` offers it after the `delivery` group): `deliver-loop -Milestone M4 -Max 5`. It resolves the installed script (project, `~/.claude/skills`, `~/.agents/skills`), passes all arguments through and exits 1 with a message when none is installed. In herdr (`HERDR_ENV=1`) it starts the loop in its own workspace `<repo> · deliver` (tab `deliver-loop`, `scripts/Start-LoopWorkspace.ps1`), because the herdr sidebar shows one state per workspace by the selected tab; outside herdr it runs in the current terminal.

`-Milestone` takes `M<n>` (legacy: the title): the `github-milestone` lookup (`Get-Milestones.ps1 -Mode issues -Name <name>`) resolves `M4` to the title `M4` or, after `/github-milestone close`, `M4 (0.2.0)` (also `M4 Topic`), and the loop passes `--milestone M4` unchanged, so a run started before the rename keeps working after it. The release-review state file `release-review-<key>.json` (`references/release-review.md`) is keyed by `M<n>` as well.

Run `Invoke-DeliverLoop.ps1` from the repository root; the shim `deliver-loop` does that itself from any directory of the repository (it changes to the git toplevel, so state, logs and the herdr workspace are the same everywhere; outside a git repository it keeps the current directory). It starts `claude -p "/deliver <targets> --unattended --max 1" --model <model> --permission-mode auto --output-format stream-json --verbose` once per PBI (`-Model` default `sonnet`, `-Harness claude` is the default). The allowlist is `references/permissions.md`; the script checks nothing more.

## Harness

| `-Harness`         | Command per PBI                                                                                                                                                                            |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claude` (default) | `claude -p "/deliver <targets> --unattended --max 1" --model <model> --permission-mode auto --output-format stream-json --verbose`                                                         |
| `copilot`          | `copilot -p "/deliver <targets> --unattended --max 1" --model <model> --allow-all-tools --allow-all-paths --allow-all-urls --no-ask-user --output-format json` (JSONL, one event per line) |

Any other value fails with exit 64 and the list of supported harnesses before the first iteration. Stop rules and exit codes read GitHub only and are the same for both. `-Model` is passed as given. Without `-Model`, `-Harness copilot` uses `auto` (Copilot picks the model of the plan); `sonnet` is a Claude name and Copilot rejects an unavailable `--model` with exit 1 (`Model "x" from --model flag is not available`), so pass a Copilot model of your plan only when you want a fixed one. For long runs set `COPILOT_TASK_WAIT_TIMEOUT_SECONDS=3600` (`references/permissions.md`, Copilot CLI).

Copilot's JSONL (verified live against Copilot CLI 1.0.105, recorded in `test/skills/delivery/fixtures/copilot-cli-1.0.105.jsonl`) feeds the step log, the colored log, the herdr tokens and the notifications from `tool.execution_start` (`data.toolName`, `data.arguments`: tool step), `assistant.message` (`data.content`: text and the `#<nr> <step>: <result>` progress lines; empty while the message only carries `toolRequests`) and `tool.execution_complete` with `success: false` (`data.error.message`: `✗`). Subagents: `subagent.started` (`data.toolCallId`, `data.agentDisplayName`) names the subagent, and every event of its tools carries `data.parentToolCallId` of that call, so steps get the prefix `[<agentDisplayName>]`. The final `result` event carries `exitCode`. Other event types (deltas, reasoning, usage) are written to the jsonl, not to the log. Unverified: the format of other Copilot versions, and events of a `/deliver` run itself (the fixture is a small tool/subagent session).

Permissions on a live `-p` run: `--allow-all-tools` alone denies file access outside the cwd (`view /tmp/…` fails with `Permission denied because no interactive user response was available`, also inside subagents), and URLs in shell commands are denied the same way. The loop therefore passes `--allow-all-tools --allow-all-paths --allow-all-urls` (what `--allow-all` / `--yolo` combine), so subagent worktrees and `gh`/`curl` URLs work. This replaces the per-tool allowlist of `references/permissions.md`.

## Loop or one session

- One `/deliver` session: a few PBIs, you watch, interactive questions are welcome.
- The loop: a whole release or a Feature overnight. Each PBI starts with an empty context, a dead session (sleep, crash, rate limit) costs one PBI, and `deliver` keeps all state in GitHub, so there is no queue file.

## Stop rules

Checked from GitHub (not from the output) before and after each iteration, on the open PBIs of the targets without `needs-decision` / `needs-refinement` / `interactive` (unattended, `deliver` skips `interactive` PBIs; they count as held):

| Result      | When                                                                                | Exit |
| :---------- | :---------------------------------------------------------------------------------- | :--- |
| done        | no open PBI left                                                                    | 0    |
| max reached | `-Max` iterations ran (delivered, blocked or paused PBIs in total)                  | 0    |
| blocked     | open PBIs remain, all wait on an open blocker or a label                            | 2    |
| no progress | the set did not change after an iteration; prints the last log lines, never retries | 1    |

## Observability

- `.agents/deliver-loop/<run>/<nr>.jsonl`: every stream record as it arrives (git-ignored). `<nr>` is the first ready PBI at the start of the iteration.
- `.agents/deliver-loop.log` (plain) and stdout (colored like the `.ansi.log` when stdout is a terminal and neither `-NoColor` nor `NO_COLOR` is set, else plain): `HH:MM:SS <tool> <description or file>`, short assistant text, tool errors with `✗`; subagent steps carry the agent description as prefix (`[Review PBI #401 diff] Bash …`). Long text is cut to the terminal width (minus 40 for time, prefix and tool, at least 120), to 120 characters when stdout is redirected.
- `.agents/deliver-loop.ansi.log`: the same lines with ANSI colors (time dim, tool name cyan, `✗` and tool errors red; paused, blocked, CI red, no progress yellow; PR opened, merged, done green). `.agents/deliver-loop.log` stays plain text. `-NoColor` or a non-empty `NO_COLOR` writes no `.ansi.log` and colors no stdout.
- Log pane (opt-in with `-LogPane`; herdr, `HERDR_ENV=1`, stdout a terminal): before the first iteration the loop splits a pane labeled `deliver-log` below the session (`herdr pane split --current --direction down --ratio 0.7 --no-focus`) that runs `pwsh -NoProfile -Command "Get-Content -Tail 40 -Wait <log>"` on the `.ansi.log` (on the plain log with `-NoColor`/`NO_COLOR`). A `deliver-log` pane already in the tab is reused, any herdr failure is ignored, the loop never closes the pane, so the last lines stay readable after the run. Without `-LogPane` no pane opens (the console already shows the colored lines); `-NoPane` is a deprecated no-op. The function is `Open-LogPane` in `scripts/LogPane.ps1`. To see the log from another pane, a herdr key toggles it (`scripts/Switch-LogPane.ps1`, `references/herdr.md` "Log pane toggle").
- Notifications (macOS `osascript`, Windows toast, else none): PR opened, review fix round, CI red, paused, blocked, merged, and the loop result.
- herdr (`HERDR_ENV=1`): the loop reports the pane tokens of `references/herdr.md` for the PBI it runs (`deliver=#401`, `deliver_step=3/7 review: clean` with the loop position, `deliver_pr=#55` once the PR exists, TTL one hour) and clears them on exit, Ctrl+C or error. The harness it starts runs with `HERDR_ENV` empty and reports nothing itself.
- herdr agent state (`HERDR_ENV=1`): herdr tracks the agent of the pane, not the `claude -p` children, so a bare loop shows `idle`. The loop reports its own lifecycle with `herdr pane report-agent <pane> --state <s> --source deliver-loop --agent deliver`: `working` at the start of each iteration, `blocked` on a `paused` or `blocked` progress line and when the loop ends `blocked` or `no progress`, otherwise `idle` at the end; then `herdr pane release-agent <pane> --source deliver-loop --agent deliver` in the `finally` (also on Ctrl+C and error). The pane id follows the subcommand directly (live herdr rejects it as trailing positional for `release-agent`). Any herdr failure is ignored; without herdr nothing is called. Another agent in the pane would compete (verified live, `herdr.md` "Verified against a live herdr"): before the first iteration the loop reads `herdr pane get <pane>` and, when it names an agent other than `deliver`, reports nothing and prints one step line saying so. Best run in its own pane. "Terminal" (colors, log pane) is `Test-LoopTerminal` in `scripts/LogPane.ps1`: stdout not redirected, or `DELIVER_LOOP_ASSUME_TTY=1` (tests only). `-NoPane` prints a one-line deprecation warning.
