---
name: github-milestone
description: 'Show the milestones (releases) of a repository: the current one with the state of its issues, all with progress, or one by name; create M<n>; insert M<n> between two; close M<n> after its release tag (the title becomes M<n> (x.y.z)). Use for "/github-milestone current", "list the milestones" or "show milestone M3".'
---

Shows the milestones of the repository as tables in the chat. A milestone is a release. Open, its title is `M<n>` or `M<n> <Topic>` (a number, optional topic, no version; `M3 Market data`); a sub-number `M1.1` (`M<n>.<m>[.<k>…]`) sorts between `M1` and `M2`; on `close` the version is added at the end (`M3 Market data (x.y.z)`) with the version of the release tag `v<x.y.z>`. Legacy titles `x.y.z` stay valid (no flag day); they are closed without renaming. `deliver --milestone <name>` delivers one, `github-release` owns the branches and the release PR. Paths are relative to this skill's directory.

Prerequisites: `gh` authenticated, run from the repository root. Usage: `/github-milestone current|list|<name>|rename <name> <new title>|create [M<n>[.<m>] [<Topic>]]|insert M<n> [--dry-run]|close M<n> [--version <x.y.z>] [--move-to M<m>]`; no argument means `current`.

## Instructions

1. Run the script for the mode; it prints JSON (`schema/milestones.schema.json`). `current`, `list` and `<name>` are read-only and use only `gh api` GET calls; only `create`, `close`, `rename` and `insert` write.

   ```powershell
   pwsh scripts/Get-Milestones.ps1 -Mode current            # or: -Mode list | -Mode show -Name <M<n>|x.y.z> | -Mode create [-Name "M<n>[.<m>] [<Topic>]"] | -Mode insert -Name M<n> [-DryRun] | -Mode rename -Name <name> -To "M<n> [<Topic>] [(x.y.z)]" | -Mode close -Name M<n> [-Version <x.y.z>] [-MoveTo M<m>]
   pwsh scripts/Get-Milestones.ps1 -Mode issues -Name <title> [-State open|closed|all]   # all issues of a milestone in one REST call (deliver)
   ```

   Exit 1 with a message on stderr (not found, invalid name, `gh` failed): report the message and stop.

2. `current` → the lowest open `M<n>` (legacy: an open `x.y.z` title above `latestTag` comes first). `current: null` → print `hint` and stop. Otherwise render it as in step 3.
3. `current` and `<name>` (a milestone detail): one header line `<title> (<state>) · due <dueOn or —> · <closed>/<open + closed> closed (<progress> %)`, then one table of the open issues:

   | Group            | Issue     | Note                    |
   | :--------------- | :-------- | :---------------------- |
   | ready            | #12 title |                         |
   | blocked          | #13 title | blocked by #11, o/ci#10 |
   | needs-decision   | #14 title |                         |
   | needs-refinement | #15 title |                         |
   | claimed          | #16 title | @login                  |

   Order the rows ready, blocked, needs-decision, needs-refinement, claimed; a blocker with `repository` is written `<repository>#<number>`, else `#<number>`; omit empty groups, and write `no open issues` instead of an empty table. `releasePr` set → end with `Release PR: #<number> <url>`.

4. `list` → one table `Milestone | State | Open | Closed | Progress | Due | Tag`, in the script's order (legacy semver, then M number, other titles last); `Tag` is `v<version>` (the version in the parentheses, legacy: the title) when `tagged`, else `—`. Below it `Latest release: <latestTag>`.
5. `create [M<n> [<Topic>]]` → without a name the next free number. `created: true` reports `created milestone <title>`; `created: false` reports `milestone <title> exists (<state>)` and changes nothing.
6. `insert M<n> [--dry-run]` puts a new milestone before `M<n>`: every open `M<k>` with k ≥ n (and its sub-numbered ones, topic and version kept) is renamed to `M<k+1>`, from the highest down so no title collides, then `M<n>` is created. Run `--dry-run` (`-DryRun`) first: it prints `renames[]` and writes nothing. Closed milestones are never touched; a closed or unmoved milestone at a target number is exit 1 before the first write. Everyday alternative without renaming: `create M1.1`. Report the renames and every entry of `references[]` (old names in issue bodies of the shifted milestones, `ROADMAP.md`, `release-review-M<n>.json` state files): nothing is rewritten, the user decides.
7. Release routine: tag, `create` the next milestone if missing, then `close M<n> [--version <x.y.z>] [--move-to M<m>]` (`--move-to` needs a target that already exists and is open) → without `--version` the newest release tag not yet assigned to a milestone; that tag must exist. `closed: true` reports `closed milestone <title>` (the new `M<n> (x.y.z)`) and, for `moved[]`, `moved #a, #b to <M<m>>`. `closed: false` with `state: closed` reports `milestone <title> was already closed`. `closed: false` with `openIssues[]` closed and renamed nothing: list them and ask whether to rerun with `--move-to M<m>` (the target must exist and be open; create it first with `create`). `--move-to` is checked first, also without open issues: an invalid, missing, closed or same target is exit 1 and nothing changes. A failed move or close exits 1 and leaves the milestone open, nothing is rolled back; the message lists what moved so far. Rerun the same command: moved issues are no longer open there, so it continues.
8. `rename <name> <new title>` (open milestones only, e.g. migrating legacy `0.2.0` to `M2 (0.1.1)`, the version taken from the new title) → `renamed: true` reports `renamed <previousTitle> to <title>`. The new title must be `M<n> [<Topic>] [(x.y.z)]`; an unknown or closed milestone, a taken title, an invalid title and a changed `M<n>` number are exit 1 and nothing changes.

## Gotchas

- Each open issue appears in one group only, in the precedence `needs-decision`, `needs-refinement`, blocked (open blockers), claimed (any assignee), ready. Pull requests are never listed.
- Valid titles: `M<n>[.<m>…] [<Topic>] [(x.y.z)]` (topic without parentheses, ignored for the order; sorted numerically per part: 1, 1.1, 1.2, 2, 10) and legacy `x.y.z`; any other title is listed, but never `current`. `<name>` finds a milestone by exact title, by `M<n>` (exact: `M1` never finds `M1.1`; also when the title has a topic and/or the parentheses; `M3` and `M3 Market data` find the same milestone) or by the version in the parentheses. Open milestones at or below the latest tag are stale: they show in `list`, not as `current`.
- `rename` changes only the title of one open milestone (never the number of an `M<n>`, the due date or its issues). `create` never renames, edits or closes a milestone, and drops a leading `v` from the name. `close` renames only `M<n> [<Topic>]` to `M<n> [<Topic>] (x.y.z)`, in the one request that closes it (open issues without `--move-to` leave the title as it is); it never edits the due date or deletes a milestone, needs the tag `v<x.y.z>`, and moves only open issues (never pull requests) and only with `--move-to` to an existing open milestone, never created implicitly. Nothing else moves issues.
- The release PR comes from `github-release` (`scripts/Get-ReleaseState.ps1`); without that skill installed `releasePr` is null.

Report: the table(s) of the mode, or the `create` or `close` line.
