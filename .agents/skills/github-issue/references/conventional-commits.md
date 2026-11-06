# Conventional Commits

Always use conventional commit format.

## Format

```
<type>[(<scope>)]: <description>
```

## Types

| Type       | When to use                              |
| ---------- | ---------------------------------------- |
| `feat`     | New feature or capability                |
| `fix`      | Bug fix                                  |
| `docs`     | Documentation only                       |
| `perf`     | Performance improvement                  |
| `refactor` | Code restructure without behavior change |
| `revert`   | Reverts a previous commit                |
| `chore`    | Maintenance, deps, housekeeping          |
| `ci`       | CI/CD changes                            |
| `style`    | Formatting, whitespace                   |
| `test`     | Test additions or fixes                  |
| `build`    | Build system changes                     |

## Rules

- Imperative mood: "add feature" not "added feature"
- Lowercase type and description
- No period at the end
- Max 72 characters for subject line
- Optional scope in parentheses

## Branch Naming

`<type>/<issue-nr>-<slug>` — `<type>` is the conventional-commit type of the issue title after stripping the level prefix `^\[(Epic|Feature|PBI|Task|Bug)\] ` (case-insensitive) and the legacy `Epic: ` / `Feature: ` (`feat`, `fix`, `docs`, `refactor`, `chore`, …). Epics and Features have no commit type in their title: use `feat`. A batch over several epics: `feat/epics-<nrs>-<slug>`.

Examples: `[Bug] fix: x` → `fix/<nr>-x`, `[PBI] feat(github): y` → `feat/<nr>-y`, `feat/42-add-pr-skill`, `fix/43-pr-title`, `chore/44-update-deps`.

## Issue footer

A commit for a PBI or Bug ends with `Refs #<nr>`, not `Closes`: PRs target `release/next` (or `release/x.y`), so `Closes` would not fire there; the PR carries `Closes #<nr>`. Subject keeps `(#<nr>)`; the footer is its own last line, matched by `git log -E --grep "^Refs #<nr>$"`.
