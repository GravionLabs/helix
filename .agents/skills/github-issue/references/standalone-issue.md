# Standalone Issue Workflow

Full lifecycle for a single issue without child issues: read → branch → implement → verify → PR.

Applies to: **PBI**, **Bug**, **Feature** (no PBIs). A legacy `[Task]` sub-issue is not worked alone: work its PBI (`sub-issues.md`, "Legacy Task issues").

## Phase 1 — Read + Branch

1. Read issue: `gh issue view <nr> --json title,body,labels`
2. Derive the branch name `<type>/<nr>-<slug>` per `conventional-commits.md` (type from the issue title after stripping the level prefix)
3. Resolve the integration branch `<base>` once per `release-branches.md`: `pwsh <github-release dir>/scripts/Get-ReleaseState.ps1 -Mode base -Issue <nr>` (`release/next`, else a `release/<x.y>`; source `none` or a `warning`: cut one with `github-release` first). Create branch: `git fetch origin <base>; git checkout -b <branch> origin/<base>`
4. Note the parent from the body's first line (`Parent Epic: #N` / `Parent Feature: #N`), if present. Closing this issue updates the parent's progress automatically via its native sub-issue link — there is nothing to tick afterwards.

## Phase 2 — Implement

5. Identify "done" from the issue's type-specific sections:
   - **PBI**: Acceptance Criteria + Definition of Done
   - **Bug**: Expected Behavior must be restored; Definition of Done requires a regression test
   - **Feature**: Definition of Done (scope)
6. Explore: read the files the issue names and their direct neighbours before changing anything.
7. Write code + tests per project conventions (load the `implementation` skill or its language sub-skill)
8. Atomic commits per the conventional-commits reference

## Phase 3 — Verify + PR

9. Verify per `implementation`: targeted tests per commit, ONE full build + test suite run before the review, and again after the last fix round. Fix failures; never commit red.
10. Run the `code-review` skill once on `git diff origin/<base>...HEAD`; fix every blocking finding before the pull request.
11. Push: `git push -u origin HEAD`
12. Create the PR with the `github-pull-request` skill (`base_branch: <base>`); the skill owns title and footer
13. If the issue has a parent: confirm it is actually linked as a native sub-issue —
    `gh api repos/{owner}/{repo}/issues/<parent-nr>/sub_issues --jq '.[].number'` should include `<nr>`.
    If it is missing, link it per `sub-issues.md`. An unlinked child looks normal in `gh issue list`,
    so this check is the only thing that catches it.

## Constraints

- CI does not run on PRs into a release branch: the local build, tests and `code-review` are the gate
- Bug issues require a regression test in the PR — do not close without one
- If asked to also merge: `gh pr merge <nr> --squash` into `release/**`; `gh pr merge <nr> --merge` into `main` (the `main` ruleset allows only merge commits, never squashed; `gh pr checks <nr> --watch --interval 60` first; each poll is a GraphQL query, the default 10 s drains the budget)
