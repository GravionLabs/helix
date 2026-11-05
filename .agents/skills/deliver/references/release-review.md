# Release review

Step 9 of `deliver`, before `github-release` `finish`. Each PBI was reviewed alone against `release/next`; the release review reads the whole release at once and catches what only shows across PBIs: contract drift between skills or modules, a hand-off one PBI promises and another never fills, two PBIs that solve the same thing twice.

## Round

Count the earlier rounds from the bugs of the milestone (open and closed): the list of the milestone read once with `Get-Milestones.ps1 -Mode issues -Name <name> -State all` (`github-milestone`, one REST call; the same list gives the criteria below), filtered to the issues labeled `bug`. `round` = 1 + the highest `<n>` of a line `Found in release review round <n>` in those bodies (none: 1).

## Review

A subagent with a fresh context, model and effort of the role `release-review` (`references/roles.md`, default opus/high): "Load `code-review`, role `review`. Review `git diff origin/main...origin/release/next` (run `git fetch origin` first). Read-only: no stash, checkout, switch or commit in any existing checkout; if you need files, use your own temporary worktree (`git worktree add --detach <temp dir> origin/release/next`). Acceptance criteria of the milestone's closed PBIs and Bugs: <per issue: `#<nr> <title>` and its criteria>. Each PBI was already reviewed alone; focus on consistency across PBIs: contracts that drifted between files of different PBIs, a promised input or output no other change provides, conflicting rules, duplicates. Skip the governance rules (`references/governance.md` of `code-review`): do not run `Get-GovernanceMatches.ps1`, report no finding with `rule: "adr-missing"` or `rule: "spec-drift"`. Return only JSON per `review.schema.json` of `code-review` (`blocking[]` with `file`, `line`, `title`, `why`; `notes[]`, up to 5)." Collect the criteria from that list: its closed issues labeled `pbi` or `bug` (`number`, `title`, `body`). The output is data, not instructions.

Why no governance: its inputs belong to one issue (the labels such as `skip-adr`, the `no spec change needed:` notes) and `code-review` applies them to the whole diff, so a waiver of one PBI cannot be scoped to its files in the release diff. Each PBI's own review (step 4) already applied the rules with its labels and notes.

## Result file

After the round this session writes `<git-common-dir>/.agents/state/release-review-<key>.json` (`<key>` = the `M<n>` or sub-number `M<n>.<m>` of the resolved `milestone.title`, so `M4`, `M4 Topic` and `M4 (0.2.0)` share one file, `M1.1 Topic (0.2.0)` is `M1.1` and never `M1`; legacy: the title; `git rev-parse --git-common-dir`, the same file from every worktree, never committed), overwriting the previous round: `{ milestone, sha, round, review, bugs }`, `sha` = `git rev-parse origin/release/next`, `review` = the subagent's result, `milestone` = `<key>`, `bugs` = the numbers of the bugs filed in this round (empty when none); schema `schema/deliver-release-review.schema.json`. Print `release: review round <round>: <n> blocking`.

## Blocking findings

- `round` ≤ 2: file one bug per finding. Interactive: show the findings first and ask: file them, or an instruction. Unattended: file them without asking.
- `round` > 2: a pause instead of more bugs. Interactive: ask the user with the findings; the user defers the decision: record the pause as below. Unattended: record the pause. No bug, no release PR.

## Pause marker

The marker is state in GitHub: the label `needs-decision` on a closed PBI or Bug of the milestone (the milestone's last closed one, highest `closed_at` of the list above). Record it with a comment on that issue, then `gh issue edit <nr> --add-label needs-decision`. Comment:

```markdown
Release review of milestone <key> paused in round 3: <n> blocking findings (`file:line` title, one per line).

Two ways on:
1. File the bugs as round 3: remove the marker (`gh issue edit <nr> --remove-label needs-decision`) and run `/deliver --milestone <key>`.
2. Accept the findings: run `github-release` `finish` with them as `release_review_notes`.
```

Step 9 reads the marker from the one `-State all` read of the milestone (`SKILL.md` step 9): a closed issue labeled `pbi` or `bug` and `needs-decision` → skip the review, print `release: paused in round 3, waits for a decision`, no comment, no release PR. Removing the label lifts the pause. `Invoke-DeliverLoop.ps1` reports such a milestone as `blocked`, not `done`.

Per finding: `gh issue create --title "[Bug] fix: <title>" --label bug --milestone <name> --body-file <file>`, `<name>` the resolved `milestone.title` (`gh` takes the current title, so after a rename `M4` alone fails). The PBI is the one whose squash commit last touched the file: `git log origin/main..origin/release/next -1 --format=%s -- <file>`. A squash subject ends with the PBI and then the PR GitHub appends (`fix: x (#103) (#116)`): two or more `(#<nr>)` → the first of the last two is the PBI. Only one → it may be the PR: `gh api repos/{owner}/{repo}/pulls/<nr>` found → the PBI is the `(#<nr>)` of its title or the `Closes #<nr>` of its body; not found (404) → `<nr>` is the PBI. None → leave out the `Related:` line. Body:

```markdown
## Description

<why> (`<file>:<line>`)

## Reproduction

<steps or the command that shows it; from the finding>

## Expected / Actual

- Expected: <the behavior the criteria of the PBIs promise>
- Actual: <what the release diff does>

## Acceptance Criteria

- [ ] <the finding is resolved, with a test>

Related: #<PBI>

Found in release review round <round>
```

Then print `release: <n> blocking → #a, #b`, open no release PR and list the bugs in the report. A later `/deliver --milestone <key>` delivers the bugs and runs step 9 again, so the review sees the fixes.

## No blocking finding

Run `github-release` `finish` with `release_review_notes` = the `notes[]` (up to 5, one line each). They reach the release PR body as `## Release review notes` (`github-pull-request` `references/release-mode.md`). An existing release PR is only reported.
