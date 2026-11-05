# /retro

Retrospective on a finished run: measures it, ranks improvements to the agent environment (steering, checks, review rules, agents, models), drafts PBIs and lessons. Nothing is created without your approval.

## Usage

```
/retro [#<issue> | <session-id>]
/retro help
```

## Arguments and flags

- `#<issue>` (or the bare number): analyse the PRs of that issue.
- `<session-id>`: analyse that session.
- nothing: the newest run; without a source the skill asks for the issue number.
- `help` (also `--help`, `-h`): print this text.

What it measures (seven columns, `n/a` when there is no source, never estimated; `~` stays an estimate): cost, main peak (context), requests, roles by cost, review rounds, fix rounds, CI / duration. Sources: `agentlens` and `gh`.

Output: a report of at most 40 lines (metrics table, candidates ranked by severity with evidence, escalation lines) plus a separate Mermaid flow diagram of the agent calls per PBI (order, round numbers, results; "flow not measured" without a source; it does not count towards the 40 lines), then on request:

- draft PBIs in the `github-issue` format, each naming the skill file and rule to change;
- lesson drafts with `status: proposed` for repository-, language- or role-specific candidates;
- proposals to retire approved lessons that did not help.

Drafts are shown as text. No issue, PR, file or lesson is created, edited or pushed until you approve.

## Examples

```
/retro #197
/retro 197
/retro
/retro help
```

## Config

none

## See also

- `deliver`, whose run report supplies the escalation lines
- `github-issue`, which creates approved PBIs
- `lessons`, the contract of lesson drafts
