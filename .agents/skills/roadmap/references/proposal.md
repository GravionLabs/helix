# Proposal and milestone assignment

Used by `/roadmap` steps Propose, Decide and Set. State comes from `scripts/Get-RoadmapState.ps1`.

## Propose

1. Take `issues[]` (Epics, Features, PBIs, Bugs) and `milestones[]`. Candidates are issues without a milestone; an issue already in an open milestone keeps it unless the user asks to move it.
2. Order by the blocked-by DAG (`blockedBy`): a blocker lands in the same or an earlier milestone than the issues it blocks. A cycle is an open decision. A blocker in another repository (`owner/repo#n` string) does not take part in the DAG: it never matches a local issue; show it as an external blocker in the Blockers column.
3. Milestones go to PBIs and Bugs (`github-issue` `references/milestones.md`). A Feature gets one only when all its open PBIs land in the same milestone, otherwise none; an Epic never. Children no longer follow the parent: a Feature with PBIs in two milestones stays without one.
4. Fill by size within each milestone (S small, M medium, L large; weights, not hours). Ask the user for the capacity per release when it is unknown.
5. Use existing open `M<nnn>` first in ascending order; propose a new `M<nnn>` (next free number) only when they are full or the DAG needs a later one.
6. Print one table, ordered by milestone and DAG:

| Issue | Title | Size | Blockers | Proposed M<nnn> |
| :---- | :---- | :--- | :------- | :-------------- |

Mark new milestones as `M004 (new)`. Epics and split Features show `none` in the last column.

## Decide

Collect before the table is final and hand them to `grill-me` as `questions[]`: scope per release, issues without size, issues with `needs-decision`, dependency cycles. Unresolved issues stay out of the assignment. Nothing is set before the user approves the final table.

## Set

After approval run, from the project root:

```powershell
pwsh <skill-dir>/scripts/Set-IssueMilestones.ps1 -Assignment '[{ "issue": 12, "milestone": "M003" }, { "issue": 13, "milestone": "M004" }]'
```

`-Assignment` is a JSON array of `{ "issue": <int>, "milestone": "<name>" }` or the path of a file holding it. `milestone` is `M<nnn>`, `M<nnn> <Topic>` or legacy `x.y.z` (resolved as in `github-milestone`: `M003` finds `M003 Market data`); an issue appears once.

- All checks run before the first write. A closed milestone, an unknown issue or invalid input exits 1 and changes nothing.
- A missing `M<nnn>` is created with `Get-Milestones.ps1 -Mode create` of `github-milestone`.
- An issue already in the target milestone is skipped, so a re-run is safe.
- Output follows `schema/set-issue-milestones.schema.json`: `created[]` and `results[]` (`issue`, `milestone`, `status` `set` or `unchanged`).

- An Epic, or a Feature whose open PBIs would not all be in its milestone (assigned in the same call or already there), exits 1 and changes nothing.

`planner` sets the milestone only on the PBIs it creates; this step assigns the rest.
