---
name: impl-issue
description: >
  Implement a GitHub issue or epic (e.g., "impl #85", "implement epic #85",
  "implement issue #42"). Creates a feature branch, implements sub-tasks in
  order, commits each sub-task when build and tests pass, pushes the branch,
  creates a PR, requests a GitHub Copilot review, and auto-merges when all
  checks pass. Use this skill whenever the user says "impl", "implement", or
  "close" followed by an issue or epic number.
---

# impl-issue — Issue / Epic Implementation Workflow

## 1. Read the issue

```bash
gh issue view <number>
```

If the issue contains sub-tasks (checklist items linking to other issues), read
each sub-issue too:

```bash
gh issue view <sub-issue-number>
```

Understand the full scope before writing any code.

---

## 2. Git Setup

### Stash any uncommitted work

```bash
git status --short
git stash push -m "wip before impl #<number>" # only if there are changes
```

### Ensure you start from a clean main

```bash
git checkout main
git pull --rebase
```

### Derive the branch name

- **Epic issues** (`[EPIC]` in title) → `epic/<number>-<slug>`
- **All others** → use the conventional-commit type from the issue title as
  prefix:
  - `feat(...)` → `feat/<number>-<slug>`
  - `refactor(...)` → `refactor/<number>-<slug>`
  - `fix(...)` → `fix/<number>-<slug>`
  - `chore(...)` → `chore/<number>-<slug>`

Derive `<slug>` from the issue title: lowercase, spaces replaced with `-`,
remove parenthetical scope, max ~40 chars.

```bash
git checkout -b <branch-name>
```

---

## 3. Implement sub-tasks in order

For each sub-task (linked issue or checklist item) in the order listed in the
epic:

### a. Read the sub-task issue

```bash
gh issue view <sub-issue-number>
```

### b. Implement the changes

- Follow the exact file changes described in the issue body.
- Keep commits focused: one sub-task per commit.
- Never delete old files that are explicitly marked for a later sub-task.

### c. Verify: Build

```bash
pnpm run build:lib        # must exit 0
```

If the issue also touches the demo app:

```bash
pnpm run build            # full workspace build
```

### d. Verify: Lint

```bash
pnpm run lint             # must exit 0
```

### e. Verify: Tests

```bash
pnpm test                 # must exit 0, all tests pass
```

Only proceed to the commit if all three verification commands exit
successfully.

### f. Commit

```bash
git add <changed files>
git commit -m "<type>(<scope>): <short description> (#<sub-issue-number>)

<optional body explaining what changed and why>

Part of epic #<epic-number>"
```

Use the conventional-commit type from the sub-issue title. Include the
sub-issue number in the commit title. For standalone issues (no parent epic),
omit the "Part of epic" line.

---

## 4. Push the branch

After all sub-tasks are committed:

```bash
git push -u origin <branch-name>
```

---

## 5. Create the PR

```bash
gh pr create \
  --title "<issue-title> (#<epic-or-issue-number>)" \
  --base main \
  --head <branch-name> \
  --label "<labels-from-issue>" \
  --body "## Summary

Closes #<epic-or-issue-number>.

## Sub-tasks completed

- [x] #<sub-1>
- [x] #<sub-2>
...

## Verification

- \`pnpm test\` — <N> test files, <N> tests, all passed
- \`pnpm run build:lib\` — no errors
- \`pnpm run lint\` — no errors"
```

---

## 6. Request Copilot review

```bash
gh pr edit <pr-number> --add-reviewer "github-copilot[bot]"
```

---

## 7. Enable auto-merge

```bash
gh pr merge <pr-number> --auto --squash
```

Auto-merge will trigger once all required status checks pass (CI build, tests,
lint) and — if Copilot review is a required check — once the Copilot review
is approved.

---

## 8. Monitor until done

```bash
gh pr checks <pr-number> --watch
```

When the merge completes, confirm by running:

```bash
gh pr view <pr-number> --json state,mergedAt
```

---

## Notes

- **Do not auto-merge** if the user says "just create the PR" or "don't merge"
  — skip step 7 in that case.
- If the build or tests fail at any sub-task, fix the issue before committing.
  Do not commit a broken state.
- If a sub-task issue says "do not delete the old files yet", follow that
  instruction exactly — the deletion happens in a later sub-task.
- For standalone issues (no sub-tasks), the whole issue counts as one sub-task.
  Implement, verify, commit, push, PR.
