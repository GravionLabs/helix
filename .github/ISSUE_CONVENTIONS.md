# Issue Conventions

This document defines how issues are structured, titled, labeled, and linked in this repository.

## Hierarchy

```
Epic
└── Feature
    └── PBI (Product Backlog Item)
        └── Task (optional)

Bug
└── Task (optional)
```

- An **Epic** groups related Features toward one larger outcome.
- A **Feature** groups the PBIs that deliver one user-facing capability.
- A **PBI** is a shippable increment: one PR-sized (or few-PR-sized) unit of value.
- A **Task** is a concrete technical step; use tasks only when a PBI or Bug needs to be split.
- A **Bug** lives outside the epic hierarchy but may reference an Epic/Feature in its Background.

## Titles & labels

| Type    | Label     | Title convention    |
| ------- | --------- | ------------------- |
| Epic    | `epic`    | `[Epic] <name>`     |
| Feature | `feature` | `[Feature] <name>`  |
| PBI     | `pbi`     | `[PBI] <name>`      |
| Task    | `task`    | `[Task] <name>`     |
| Bug     | `bug`     | `[Bug] <symptom>`   |

The issue forms in `.github/ISSUE_TEMPLATE/` pre-fill the prefix and the label. Commits and PR titles stay
conventional (`feat: …`, `fix: …`, `chore: …`).

Additional area labels (`library`, `demo`, `form`, `navigation`, `design-system`, …) may be added on top of the type label.

## Linking rules

Every issue that has sub-issues must link them **both** ways:

1. **Native sub-issue relationship** — add each child as a GitHub sub-issue of the parent:

   ```bash
   # child_id is the issue's numeric database ID, not its number:
   child_id=$(gh api repos/{owner}/{repo}/issues/<child-number> --jq .id)
   gh api repos/{owner}/{repo}/issues/<parent-number>/sub_issues \
     -X POST -F sub_issue_id="$child_id"
   ```

2. **`Sub-issues` field** in the parent body, one line per child (kept in sync by hand; the native panel is
   the source of truth for progress):

   ```markdown
   ### Sub-issues

   - #346 [PBI] Section headings from top-level menu items
   - #347 [PBI] Single collapse control
   ```

Each child names its parent in its **Parent** field (`#NNN`). Closing PRs reference the PBI/Task/Bug they resolve with `Closes #NNN`.

## Fields per issue type

The issue forms in `.github/ISSUE_TEMPLATE/` define these fields. An issue created with `gh` (no form) uses the
same fields as `### <Label>` headings, in this order, so it reads the same as one created in the browser.

### Epic (`epic.yml`)

| Field            | Required | Content                                                   |
| ---------------- | -------- | --------------------------------------------------------- |
| Goal             | yes      | What outcome the epic delivers                            |
| Related spec/ADR | no       | Link to a doc under `docs/` (e.g. `docs/ROADMAP.md`)      |
| Sub-issues       | no       | One Feature per line (`- #12 Feature title`)              |

### Feature (`feature.yml`)

| Field       | Required | Content                                  |
| ----------- | -------- | ---------------------------------------- |
| Parent Epic | yes      | `#<number>` (or "None" for a standalone) |
| Description | yes      | What the feature delivers and why        |
| Sub-issues  | no       | One PBI per line                         |

### PBI (`pbi.yml`)

| Field               | Required | Content                                                                         |
| ------------------- | -------- | ------------------------------------------------------------------------------- |
| Parent Feature      | yes      | `#<number>`                                                                     |
| Acceptance criteria | yes      | Testable bullets or Given/When/Then                                             |
| Depends on          | yes      | PBIs that must close first (also as native "blocked by"), or "Nothing"          |
| Verification        | yes      | Commands that prove it works (default `pnpm format:check && pnpm lint && pnpm test:ci && pnpm build`) |
| Sub-issues          | no       | One Task per line                                                               |

### Task (`task.yml`)

| Field                | Required | Content                                                              |
| -------------------- | -------- | -------------------------------------------------------------------- |
| Parent PBI or Bug    | yes      | `#<number>`                                                          |
| Implementation notes | no       | How/where                                                            |
| Files                | yes      | Files the task creates or changes, one per line                      |
| Done when            | yes      | Checkboxes, ending with the parent PBI's verification commands       |

### Bug (`bug.yml`)

| Field              | Required | Content                                             |
| ------------------ | -------- | --------------------------------------------------- |
| Steps to reproduce | yes      | Numbered steps                                      |
| Expected vs actual | yes      | What should happen, what happens instead            |
| Area               | no       | `core` / `shell` / `zod` / `ag-grid` / `demo` / `docs` / `ci` |
| Sub-issues         | no       | One Task per line, only if the fix is split up      |

## Creating issues with `gh`

```bash
# Epic
gh issue create --label epic --title "[Epic] <name>" --body-file epic.md

# Feature under epic #10
gh issue create --label feature --title "[Feature] <name>" --body-file feature.md
child_id=$(gh api repos/{owner}/{repo}/issues/<feature-number> --jq .id)
gh api repos/{owner}/{repo}/issues/10/sub_issues -X POST -F sub_issue_id="$child_id"
# …then add "- #<feature-number> <title>" to epic #10's Sub-issues field.
```
