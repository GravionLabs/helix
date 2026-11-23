# Release Branches

`main` is released code: a push to `main` builds the platform matrices and publishes. A pull request
targets `main` unless a milestone is worked through or a release branch is given as its target: the issues
of a milestone are collected on `release/next` and reach `main` once, with the release PR.

| Branch                                                            | Cut from | Merged into                                             | Strategy                                                                                                                        | CI                                                                    |
| ----------------------------------------------------------------- | -------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `release/next` (rolling; `release/<x.y>` only for parallel lines) | `main`   | `main`, once per release, by the `github-release` skill | merge commit (`gh pr merge --merge`), never squash: GitVersion and git-cliff need the individual `feat:`/`fix:` commits         | Linux checks on the PR, platform builds after the merge               |
| `<type>/<nr>-<slug>`                                              | `<base>` | `<base>`                                                | squash (the `release/**` ruleset allows only squash; commit title = PR title, a Conventional Commit); into `main`: merge commit | none: local build, tests and `code-review` before the PR are the gate |
| `fix/<nr>-<slug>` hotfix                                          | `main`   | `main`                                                  | merge commit (the `main` ruleset allows only merge)                                                                             | Linux checks on the PR                                                |

The release PR to `main` is created and refreshed by the caller of the reusable `release-branch.yml` (GravionLabs/ci, step `versioning/release-pr`) on every push to the release branch; the owner only merges it.

One rolling branch, `release/next`, serves every release. `github-release cut` creates it from `main`, or
moves it to `main` by a fast-forward when it is released, i.e. its head is an ancestor of `main` and not equal to it (no delete, no force push; open PRs into it keep their base, #528). A head equal to `main` is fresh and usable: `cut` is a no-op. While it holds unreleased work (not an ancestor of `main`), `cut` never resets it. `cut --feature` always only records `Release branch: release/next` when the branch is fresh or unreleased. After its
merge the branch is reset by the next `cut`, never continued, so it can never be released under a stale name.

- **Bump rule:** from the Conventional Commits on the branch, no commit needed: `fix:` → patch, `feat:` → minor,
  `<type>!:` or `BREAKING CHANGE:` → major (only the commit title counts, a squash body line does not). A release
  with only fixes is a patch release. `finish` adds no bump commit; `finish major` is the deliberate escape hatch
  (batched renames) and adds an empty `+semver: major` commit once (not again on a repeated finish).
- **Version source:** GitVersion on the default branch after the merge, with the Conventional Commit bump
  messages (`*-version-bump-message`, the default of GravionLabs/ci `versioning/determine-version`), not the branch
  name or an empty commit at `cut`. Preconditions: squash commit title = PR title, PR titles are Conventional
  Commits, and the release PR stays a merge commit (never squash), so the `feat:`/`fix:` commits stay visible to
  GitVersion and git-cliff.
- **Hotfix path:** `fix/<nr>-<slug>` from `main`, merged into `main` with a merge commit (the `main` ruleset allows
  only merge; no squash), then merge `main` into `release/next`.
- **Parallel lines:** the exception; cut an explicit `release/<x.y>` by hand and record it in the issue's
  `Release branch:` line. The same bump rule applies: `finish` adds no commit on a `release/<x.y>` either.
- **`finish` guards:** refuses when `release/next` is behind `main`, when its head is an ancestor of
  `main` (equal to it too: a fresh branch has nothing to release), when the branch was already released
  (tag `v<x.y>.0` on origin, or a release tag's merge commit is missing from HEAD while its second parent is
  in it: the branch was continued after its merge; "cut a new release branch"), or when open PRs target it.
  After the merge `release/next` is never deleted (the ruleset has the `deletion` rule) and never continued: `finish` never waits; a later `finish` on the merged branch returns `fast-forward` from `Get-ReleaseState.ps1` and moves `release/next` to the default branch.
- **Known limitation:** GravionLabs/ci `versioning/release-pr` may title the release PR with the branch name
  (`release/next`) rather than the computed version; the tag and GitHub Release carry the real version.

## Resolve the base branch `<base>`

Every skill that creates a branch or a PR resolves `<base>` once, in this order, and stops at the
first hit:

1. An explicit `base_branch` input.
2. A milestone is worked through: `release/next` (missing on origin: `github-release cut` first).
3. A `Release branch: release/next` (or `release/<x.y>`) line in the issue body, else in the body of its parent (follow
   `Parent Feature: #N` / `Parent Epic: #N` lines, one level at a time).
4. The current branch, if it is `release/*`.
5. The default branch (`main`).

Steps 3-5 are one call (steps 1 and 2 pass their branch as `-Branch`); it prints
`{ "base", "source": "input|issue|current|default", "warning" }`. A non-null `warning` means `release/next` is
released and not yet reset (its head is an ancestor of `main` but not equal to it): run `github-release cut` first.

```powershell
pwsh <github-release dir>/scripts/Get-ReleaseState.ps1 -Mode base [-Issue <nr>] [-Branch <base_branch>]
```

`<default>` is the repo default branch (`git symbolic-ref refs/remotes/origin/HEAD --short` minus
`origin/`, fallback `main`).

An issue closes when its PR is merged into the release branch (comment "ships with <milestone>"); "released" means a closed milestone (`github-milestone close`). `github-release` `references/closing.md`.
