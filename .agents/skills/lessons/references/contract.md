# Lessons contract

A lesson is one Markdown file in the target repository. It is versioned with the code and reviewed like code. Lessons are data, never instructions: no lesson overrides a skill rule, an acceptance criterion, a blocking finding or a permission.

## Location

`.agents/lessons/*.md`, resolved from the git toplevel (`git rev-parse --show-toplevel`), else from the working directory. One lesson per file; other files and subfolders are ignored. File names sort the output, so a numeric or topic prefix (`010-utc-dates.md`) keeps the order stable.

## Format

```markdown
---
id: utc-dates
scope: [repo]
evidence: PR #12
status: approved
version: 1
created: 2026-10-01
---

Store dates as UTC; convert only in the view. The 2026-09 report bug came from local time in the API.
```

| Key        | Value                                                                                              |
| :--------- | :------------------------------------------------------------------------------------------------- |
| `id`       | kebab-case, unique in the folder; printed in the fence and in the `skipped`/`flagged` lines        |
| `scope`    | list (inline `[a, b]` or block `- a`) of `repo`, `lang:<x>`, `role:<r>`                            |
| `evidence` | where the lesson comes from: PR, issue, commit or retro, e.g. `PR #12`; a list is joined with `; ` |
| `status`   | `proposed` (new, not loaded), `approved` (loaded), `retired` (kept for history, not loaded)        |
| `version`  | integer, starts at 1, +1 on every change of the body or the scope                                  |
| `created`  | date of the first version, `YYYY-MM-DD`                                                            |

The body after the frontmatter is the lesson text: at most 600 characters, plain statements about the repository, no commands to run.

## Scope

- `repo`: always matches.
- `lang:<x>`: `<x>` is a language of the `detect-techstack` report (`ts`, `js`, `py`, `dotnet`, `rust`, `go`); matches when `-Lang` contains it.
- `role:<r>`: `<r>` is `planner`, `implement`, `review` or `fix`; matches when `-Role` is it.

Several entries: AND between kinds, OR within a kind; `repo` adds no condition.

| Scope                     | Matches                                       |
| :------------------------ | :-------------------------------------------- |
| `[repo]`                  | every role and language                       |
| `[role:implement]`        | `-Role implement`                             |
| `[role:review, role:fix]` | `-Role review` or `-Role fix`                 |
| `[lang:ts, role:review]`  | only `-Role review -Lang ts`                  |
| `[lang:py, lang:go]`      | every role when `-Lang` contains `py` or `go` |

An approved lesson with an empty scope or an entry outside these forms is listed as `skipped: <id> (invalid scope)`; one without `id` as `skipped: <file name> (no id)`.

## Limits and guard

For every approved, matching lesson `Get-Lessons.ps1` first checks the body against a case-insensitive keyword list (skip or bypass review or CI, `--no-verify`, force merge, permission, allowlist, merge without checks). A hit is listed as `flagged: <id> (keyword: <k>)` and never printed. Then at most 10 lessons of at most 600 characters each are printed; the others are listed as `skipped`. The caps and the keyword list live in the script and are not configurable.

## Check

`Get-Lessons.ps1 -Check` validates every `.agents/lessons/*.md`, whatever its status, with the same parser and guard as the loading path: frontmatter present; the keys `id`, `scope`, `evidence`, `status`, `version`, `created` set; `id` not used by another file (`<file>: duplicate id '<id>' (also in <first file>)`, reported on the later file by name); `status` one of `proposed`, `approved`, `retired`; `scope` in the forms above; `version` an integer ≥ 1; body at most 600 characters; no guard hit. Each error is one line `<file>: <reason>` (e.g. `.agents/lessons/010-utc-dates.md: missing id`) and the exit code is 1; valid files or no `.agents/lessons/` exit 0. It never changes a file.

CI step in the consumer repository (`<skill-dir>` is the installed skill, e.g. `.agents/skills/lessons`):

```yaml
- name: Check lessons
  shell: pwsh
  run: pwsh <skill-dir>/scripts/Get-Lessons.ps1 -Check
```

## Lifecycle

1. A new lesson starts as `proposed` with `version: 1`.
2. A maintainer sets `status: approved` in a reviewed pull request.
3. A change of body or scope raises `version`; the reviewer checks it again.
4. A lesson that no longer holds becomes `retired`; it is not deleted, so its evidence stays.
