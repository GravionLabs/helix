# Release Branches

`main` is released code: a push to `main` builds the platform matrices and publishes. To keep those
builds rare, day-to-day work never targets `main` directly.

| Branch                                                            | Cut from               | Merged into                                             | Strategy                                                                                                                | CI                                                                    |
| ----------------------------------------------------------------- | ---------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `release/next` (rolling; `release/<x.y>` only for parallel lines) | `main`                 | `main`, once per release, by the `github-release` skill | merge commit (`gh pr merge --merge`), never squash: GitVersion and git-cliff need the individual `feat:`/`fix:` commits | Linux checks on the PR, platform builds after the merge               |
| `<type>/<nr>-<slug>`                                              | the integration branch | the integration branch                                  | squash (the `release/**` ruleset allows only squash; commit title = PR title, a Conventional Commit)                    | none: local build, tests and `code-review` before the PR are the gate |
| `fix/<nr>-<slug>` hotfix                                          | `main`                 | `main`                                                  | merge commit (the `main` ruleset allows only merge)                                                                     | Linux checks on the PR                                                |

The release PR to `main` is created and refreshed by the caller of the reusable `release-branch.yml` (GravionLabs/ci, step `versioning/release-pr`) on every push to the release branch; the owner only merges it.

One rolling branch, `release/next`, serves every release. `github-release cut` creates it from `main`, or
deletes and recreates it from `main` when it is released, i.e. its head is an ancestor of `main` and not equal to it (no force push; the git guardrail allows the remote delete of exactly `release/next`). A head equal to `main` is fresh and usable: `cut` is a no-op. While it holds unreleased work (not an ancestor of `main`), `cut` never resets it. `cut --feature` always only records `Release branch: release/next` when the branch is fresh or unreleased. After its
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
  After the merge the branch is deleted, never continued: `finish` only names `git push origin --delete <branch>`
  and never waits; a later `finish` on the merged branch returns `delete-branch` from `Get-ReleaseState.ps1` and deletes `release/next`.
- **Known limitation:** GravionLabs/ci `versioning/release-pr` may title the release PR with the branch name
  (`release/next`) rather than the computed version; the tag and GitHub Release carry the real version.

## Resolve the integration branch `<base>`

Every skill that creates a branch or a PR resolves `<base>` once, in this order, and stops at the
first hit:

1. An explicit `base_branch` input.
2. A `Release branch: release/next` (or `release/<x.y>`) line in the issue body, else in the body of its parent (follow
   `Parent Feature: #N` / `Parent Epic: #N` lines, one level at a time).
3. The current branch, if it is `release/*`.
4. `release/next` on origin if it exists, else the highest `release/<x.y>` whose tag `v<x.y>.0` is not on origin
   (released, the branch is stale: `github-release cut` reports it; other `release/*` names are legacy, ignore them).
   A `release/next` whose head is an ancestor of `main` but not equal to it is released, not yet reset, and
   must not receive new work: run `github-release cut` first. A head equal to `main` is fresh and usable.

   Steps 2-4 are one call; it prints `{ "base", "source": "input|issue|current|origin|none", "warning" }`,
   `none` (base `null`, exit 0) means step 5, a non-null `warning` means run `github-release cut` first:

   ```powershell
   pwsh <github-release dir>/scripts/Get-ReleaseState.ps1 -Mode base [-Issue <nr>] [-Branch <base_branch>]
   ```

5. None exists → cut one with `github-release cut` (it records the line from step 2 in the Feature
   issue) and use it. Target `main` only when the user explicitly asks for a hotfix.

A PR whose base would be `main` while the head is not `release/*` is a mistake unless the user asked
for a hotfix: stop and report instead of creating it.

`<default>` (the repo default branch, `git symbolic-ref refs/remotes/origin/HEAD --short` minus
`origin/`, fallback `main`) is only used by `github-release` itself.

Issues merged into a release branch carry the label `merged` until the release closes them (`github-release` `references/merged-label.md`).
