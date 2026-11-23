# Definition of ready per level

`refine <nr>` checks the issue against the list of its level. A point is met when the body (or, for children, the sub-issues) states it concretely; only the missing points go to `grill-me`. Facts the code answers are looked up, not asked.

with `governance`: also `references/governance.md`

## Objective

`refine <owner/repo#nr>` of an `[Objective]` (`github-issue` `references/objectives.md`); the children are read across the affected repositories.

- Outcome present (`## Outcome`).
- Every repository of `## Affected repos` has at least one child (Feature or Epic) as sub-issue.
- Acceptance criteria present as a checklist a human verifies.
- No implementation details in the body.
- Every child issue that pulls in a pin (`SOURCE.txt`, a tag in a dependency) has a `Requires: <owner>/<repo>@<milestone> released|rc` edge, in the child or in the Objective's `## Requires` (a code dependency stays a native `blocked-by` link). A pin without an edge is a gap.
- No milestone on the Objective.

## Epic

- Outcome: what is true when the Epic is done.
- Scope and out of scope.
- Features as sub-issues.

## Feature

- Goal.
- Acceptance criteria, testable.
- PBIs as sub-issues with blocked-by links.
- Milestone: none, or the one all its PBIs are in (`github-issue` `references/milestones.md`).

## PBI

- Milestone set.
- Testable acceptance criteria.
- Files and symbols named.
- Where the tests go.
- Out of scope.
- Size S or M (size L: split, see `## Refine` in `SKILL.md`).
- A `Tier: <tier> — <reason>` line (`refine` adds a missing one, `SKILL.md` `## Refine`).

## Bug

All PBI points (milestone included), plus repro steps or a failing test to write first.

## Milestone

`refine M<nnn>`: read the open PBIs and Bugs of the milestone (`github-milestone` `Get-Milestones.ps1 -Mode issues`). Per item without a `Tier:` line add `Tier: <tier> — <reason>` (size table of `plan-schema.md`), then report `#<nr> Tier: <tier> — <reason>` for each changed item and `unchanged` for the rest.
