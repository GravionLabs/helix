# Slicing rules

Adapted from `to-tickets` in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License, Matt Pocock). Reworded for this hub.

## Vertical slices

- Each item delivers one thin end-to-end behavior and is verifiable alone: a test, command or visible result proves it without the other items.
- Each item fits one fresh session: a reader can finish it from its body without re-exploring. Too big for that → split; too small to verify alone → merge.
- Slice by behavior, not by layer. "Add column", "add endpoint", "add UI" as three items is a horizontal split; one item per user-visible behavior is the target.
- Order by risk and dependency: unknowns and shared foundations first, each `blocked_by` only what it truly needs, so independent items can run in parallel.

## Wide refactors

A change touching many call sites is never one item. Plan it as:

1. **Expand**: add the new API or shape next to the old one; everything still passes.
2. **Migrate**: batches of call sites, each batch one item (`blocked_by` the expand item), each green on its own.
3. **Contract**: remove the old API once the last batch landed (`blocked_by` every migrate batch).

## Sizing

| Size | Meaning                                                        |
| :--- | :------------------------------------------------------------- |
| S    | a few files, one concern, minutes of work                      |
| M    | one module or component with its tests, one session            |
| L    | at the edge of one session; split it unless it cannot be split |

## Protected paths

`deliver-loop.mts` never merges a pull request that changes a protected path; a person merges it, and every PBI blocked by it waits too. Do not let ordinary work wait on that.

1. Read the list: `deliver.protectedPaths` of `.agents/config.json` (it replaces the default), else the default list in `protected-paths.json` of the `deliver` skill (`.claude/skills/deliver/`, `~/.claude/skills/deliver/`, `.agents/skills/deliver/`; in this repository `skills/delivery/deliver/`). `dir/` is a directory at the root, anything else a file name anywhere, compared without regard to case.
2. Per planned item check from its `files` and the exploration whether it will probably change a protected path (a CI workflow, an agent setting, a script or dependency in a package manifest).
3. Such a change is cut into its own PBI, as small as possible: only the files that trigger the guard, nothing else. The label `interactive` goes in `labels`; the rest of the work is not in it.
4. A following item gets the `interactive` PBI in `blocked_by` only when it needs the change; otherwise it stays independent and the loop delivers it.
5. The plan names the `interactive` PBIs (ids and titles) in the summary and the reply and advises delivering them first, in a session: `/deliver <nr>`.
