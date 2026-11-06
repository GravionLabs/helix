# Proposal and milestone assignment

Used by `/roadmap` steps Propose, Decide and Set. State comes from `scripts/Get-RoadmapState.ps1`.

## Propose

1. Take `issues[]` (Epics, Features, PBIs, Bugs) and `milestones[]`. Candidates are issues without a milestone; an issue already in an open milestone keeps it unless the user asks to move it.
2. Order by the blocked-by DAG (`blockedBy`): a blocker lands in the same or an earlier milestone than the issues it blocks. A cycle is an open decision. A blocker in another repository (`owner/repo#n` string) does not take part in the DAG: it never matches a local issue; show it as an external blocker in the Blockers column.
3. Children follow their parent (`parent`).
4. Fill by size within each milestone (S small, M medium, L large; weights, not hours). Ask the user for the capacity per release when it is unknown.
5. Use existing open `M<n>` first in ascending order; propose a new `M<n>` (next free number) only when they are full or the DAG needs a later one.
6. Print one table, ordered by milestone and DAG:

| Issue | Title | Size | Blockers | Proposed M<n> |
| :---- | :---- | :--- | :------- | :------------ |

Mark new milestones as `M4 (new)`.

## Decide

Collect before the table is final and hand them to `grill-me` as `questions[]`: scope per release, issues without size, issues with `needs-decision`, dependency cycles. Unresolved issues stay out of the assignment. Nothing is set before the user approves the final table.

## Set

After approval run, from the project root:

```powershell
pwsh <skill-dir>/scripts/Set-IssueMilestones.ps1 -Assignment '[{ "issue": 12, "milestone": "M3" }, { "issue": 13, "milestone": "M4" }]'
```

`-Assignment` is a JSON array of `{ "issue": <int>, "milestone": "<name>" }` or the path of a file holding it. `milestone` is `M<n>`, `M<n> <Topic>` or legacy `x.y.z` (resolved as in `github-milestone`: `M3` finds `M3 Market data`); an issue appears once.

- All checks run before the first write. A closed milestone, an unknown issue or invalid input exits 1 and changes nothing.
- A missing `M<n>` is created with `Get-Milestones.ps1 -Mode create` of `github-milestone`.
- An issue already in the target milestone is skipped, so a re-run is safe.
- Output follows `schema/set-issue-milestones.schema.json`: `created[]` and `results[]` (`issue`, `milestone`, `status` `set` or `unchanged`).

`planner` sets no milestone; only this step does.
