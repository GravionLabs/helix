# ROADMAP.md: markers and rules

Used by `/roadmap` step Write. `scripts/New-Roadmap.ps1` renders the generated parts from the state of `scripts/Get-RoadmapState.ps1`; the structure comes from `templates/ROADMAP.md`.

```powershell
pwsh <skill-dir>/scripts/Get-RoadmapState.ps1 > state.json
pwsh <skill-dir>/scripts/New-Roadmap.ps1 -State state.json -Path ROADMAP.md           # diff only
pwsh <skill-dir>/scripts/New-Roadmap.ps1 -State state.json -Path ROADMAP.md -Write    # after approval
```

`-State` is the JSON itself or a file path. A missing `ROADMAP.md` starts from the template.

## Approval

Show the diff first (the default run writes nothing). Write only after the user approved that diff, then run again with `-Write`. Nothing else edits `ROADMAP.md` in this step.

## Markers

Generated text sits between `<!-- roadmap:begin <key> -->` and `<!-- roadmap:end -->`. Everything outside is hand-written and never changed. Do not edit inside a block; the next run overwrites it.

| Key         | Content                                                                                       |
| :---------- | :-------------------------------------------------------------------------------------------- |
| `intro`     | date and last release tag                                                                     |
| `where`     | open Epics and Features: open children, milestone                                             |
| `plan M<n>` | heading, progress, table of the open issues: order, issue, title, size, depends on / decision |
| `done M<n>` | heading `Done in M<n> (x.y.z)` and the table of the closed issues of the milestone            |
| `later`     | open issues without milestone and why (`needs-decision`, blockers)                            |

Legacy `x.y.z` milestones use their title as key (`plan 1.3.0`).

## Rules

- Plan order follows the blocked-by DAG inside the milestone, then the issue number. An issue with an open child is listed through the child.
- A closed milestone `M<n> (x.y.z)` leaves the plan sections: its `plan` block is removed and a `done` block with its closed issues (`milestones[].issues[]` of the state) is added.
- New `plan` and `done` blocks go to the comments `<!-- roadmap:slot plan -->` and `<!-- roadmap:slot done -->`. A file without slots gets them before `## Later`, else at the end. Existing blocks keep their place, so hand-written notes next to them stay.
- A fixed block (`intro`, `where`, `later`) missing from an existing file is not added: the script warns on stderr.
- Tables are padded to the widest cell with dashes to column width, as Biome formats Markdown tables (wide characters count 2, `\|` counts 2), so `biome check` leaves a generated file unchanged and a second run changes nothing.
- The run is idempotent: unchanged state prints `ROADMAP.md is current`.
- Out of scope: release PR text and changelog (`github-release`).
