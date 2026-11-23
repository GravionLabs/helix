# Create issues from a plan

Input: the `plan.json` of `planner` (its `references/plan-schema.md`). The plan has no issue
numbers of its own; this procedure creates the issues, links them to the parent and sets the
blocked-by links. Link calls and their gotchas: `sub-issues.md`.

## 1. Before anything is created

- `status` is `ok`; on `fail` show `summary` and stop.
- Show every entry of `questions[]` (question, options, recommended, why, blocked items) to the
  user and wait for the answers. Fold the answers into the affected item bodies; create nothing
  before that.
- Show the items (id, title, size, `blocked_by`, `repo`) for approval.
- Repositories: an item without `repo` goes to the current repository. Every `repo`, `parent_repo` and repository of `blocked_by` and `requires[]` has the owner of the plan; another owner → stop, create nothing.

## 2. Create each item, in plan order

| `level`   | Title               | Label     |
| :-------- | :------------------ | :-------- |
| `feature` | `[Feature] <title>` | `feature` |
| `pbi`     | `[PBI] <title>`     | `pbi`     |

There is no `task` level: no `[Task]` issue is created.

Each entry of `items[].labels` is added with one more `--label` (`interactive`: create the label with `gh label create` when the repository lacks it).

The body is used as given; its first line is already `Parent …: #N` (none for a split of an issue without parent).

A split of a PBI or Bug (`input_type` `pbi` or `bug`): `p1` is not created, it replaces the title and body of `parent_issue` (`gh issue edit <parent_issue> --title "<its level prefix> <title>" --body-file -`, `$created['p1'] = <parent_issue>`); the other items are created as `[PBI]`s.

```powershell
$url = $item.body | gh issue create --label <level> --title "[<Level>] <title>" --body-file -
$nr  = [int]($url -split '/')[-1]   # remember: $created[<plan id>] = $nr
```

An item with `repo` (an `objective` plan): `gh issue create --repo <repo> …` and `$created[<plan id>] = '<repo>#<nr>'`. Each `requires[]` entry the body lacks is added under `## Requires` as `Requires: <entry>` (`objectives.md`).

## 3. Link to the parent

Link every created issue to `parent_issue` (`sub-issues.md`, "Link a child to a
parent"); with `parent_repo` (the Objective) the child's database id comes from its own repository and the POST goes to the foreign parent: `gh api -X POST repos/<parent_repo>/issues/<parent_issue>/sub_issues -F sub_issue_id=$childId`; in a split, to the Feature of the body's first line (no line: no link). A plan from a
description creates no issues.

Milestone: a created PBI or Bug gets the milestone of the plan with `github-milestone assign M<nnn> #<nr> …` (`milestones.md`, "Setting a milestone"), never `gh issue edit --milestone`; a Feature only when all its PBIs are in it. A Feature of an `objective` plan gets one only when the user names a milestone of its target repository: `github-milestone assign` there (`Get-Milestones.ps1 -Mode assign -Repo <repo> -Name M<nnn> -Issues <nr>`); never the Objective.

## 4. Blocked-by links

For every item and every entry of its `blocked_by`: a plan id (string) resolves to
`$created[<id>]`, an integer is an existing issue number of the item's repository, `owner/repo#n` an issue of another repository; both stay. Across repositories the blocker id comes from the blocker's repository (`gh api repos/<blocker-repo>/issues/<n> --jq .id`) and the POST goes to the item's repository. Then add the link per
`sub-issues.md`, "Blocked-by links" (database id of the blocker, `-F issue_id=`).

## 5. Verify

Per `sub-issues.md`, "Verify": the parent's `sub_issues` count equals the item count (a split: they include every created number), each body's
first line names the parent, and each issue's `dependencies/blocked_by` entries, read with their repository (`owner/repo#n`), equal its resolved
`blocked_by`. Across repositories every read uses the issue's own repository (the parent's in `parent_repo`). Fix gaps instead of reporting success; report the created numbers by plan id.
