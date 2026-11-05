# Definition of ready per level

`refine <nr>` checks the issue against the list of its level. A point is met when the body (or, for children, the sub-issues) states it concretely; only the missing points go to `grill-me`. Facts the code answers are looked up, not asked.

with `governance`: also `references/governance.md`

## Epic

- Outcome: what is true when the Epic is done.
- Scope and out of scope.
- Features as sub-issues.

## Feature

- Goal.
- Acceptance criteria, testable.
- PBIs as sub-issues with blocked-by links.
- Milestone set.

## PBI

- Testable acceptance criteria.
- Files and symbols named.
- Where the tests go.
- Out of scope.
- Size S or M (size L: split, see `## Refine` in `SKILL.md`).
- A `Tier: <tier> — <reason>` line.

## Bug

All PBI points, plus repro steps or a failing test to write first.
