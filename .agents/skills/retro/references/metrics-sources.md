# Metrics sources

The metrics table has seven columns. Each has one source; a column without a value is `n/a`, never estimated. Values that agentlens marks `~` are estimates and stay marked `~` in the report.

| Column              | Source                                                                                                                     |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| cost                | `agentlens cost --by issue --format json`, row of the issue                                                                |
| main peak (context) | agentlens, same row or `agentlens` session view; `n/a` if it carries none                                                  |
| requests            | agentlens, same row                                                                                                        |
| roles by cost       | agentlens, subagent share of the issue (`deliver` labels its steps `implement #<nr>`, `gate`, `review`, `fix`, `pr`, `ci`) |
| review rounds       | `gh pr view <pr> --json reviews,comments`: `review #<nr>` findings posted on the PR; `n/a` if the PR carries none          |
| fix rounds          | `gh pr view <pr> --json commits`: commits after the first review                                                           |
| CI / duration       | `gh pr view <pr> --json statusCheckRollup,createdAt,mergedAt`: result of the checks, opened to merged                      |

PRs of an issue: `gh pr list --state all --search "<nr> in:body" --json number,title,url,state`; Epics and Features: the PBIs among their sub-issues.

## Flow of agent calls

Source of the order in the flow diagram (`references/flow.md`), never inferred: the `Agent`/`Task` tool calls of the session transcript (tool input role or description, timestamps of the call and its result), or an `agentlens` timeline of subagent calls (role, start, end) if the installed version exposes one. Results come from `gh` (review findings, checks, merge) and the `deliver` report. No source: "flow not measured".

## Escalation lines

Blocked and skipped PBIs come from the final report of `deliver` (blocked: PBI, reason, open PR; skipped: issue, reason). Use the report in the session or the one the user gives you. None available: the section says "no run report".

## Repeated findings

List the review findings of every analysed PR (file and finding title). The same file and title in two or more PRs is a repeated finding: a missing review rule or check (categories 2, 3).

## agentlens missing or failing

Say so in the report, show cost, main peak, requests and roles as `n/a (not measured)`, and continue with the GitHub data and the review findings.
