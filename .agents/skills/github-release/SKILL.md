---
name: github-release
description: 'Cut the rolling release/next branch or finish it with the release PR and changelog. Use for "cut a release", "finish the release" or when no release branch exists.'
context: fork
---

Owns the lifecycle of the rolling `release/next` branch (explicit `release/<x.y>` only in parallel lines). The model and the base-branch resolver are in the `github-issue` skill's `references/release-branches.md`. No dialogue, tool calls only; on Claude Code this runs in a forked context without the session history.

`help` (or `--help`, `-h`): print `references/help.md` unchanged, nothing else.

Prerequisites: `gh` authenticated, repo root, clean `git status`. Mode: `cut [--feature <nr>]` or `finish [major] [--yes] [release/next|release/<x.y>]`; `finish` takes optional `release_review_notes` (lines from the release review of `deliver`).

## Check the state first

```powershell
pwsh scripts/Get-ReleaseState.ps1 -Mode cut            # or: -Mode finish [-Branch release/next]
```

The script is read-only and prints JSON: `default`, `branch`, `state`, `openPrs`, `localAhead`, `staleLines`, `fastForwardAllowed`, `action`, `hasMajorCommit`, `deleteOnMerge`, `deletionRule`, `retargetedPrs`, `releaseWorkflow`, `releasePr`, `defaultIsAncestor`, `mergeConflicts`, `releaseTest`, `olderReleaseTests`, `gate`, `warning`. Exit 1 with a message on stderr (invalid branch name, no release branch) means stop and report. Do what `action` says; `stop: ...` means report the text and change nothing.

| `state`                     | cut                                                                      | finish                                                                                                     |
| :-------------------------- | :----------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| `absent`                    | `create`                                                                 | stop                                                                                                       |
| `fresh` (equals default)    | no-op                                                                    | stop: nothing to release                                                                                   |
| `unreleased`                | no-op                                                                    | continue below                                                                                             |
| `behind` (default moved on) | no-op                                                                    | stop, merge default in first                                                                               |
| `merged`, `released`        | `fast-forward` when `fastForwardAllowed`, else stop and name the blocker | `merged` with `fastForwardAllowed`: `fast-forward`; else stop "already released; cut a new release branch" |
| `released-continued`        | no-op                                                                    | stop "already released; cut a new release branch"                                                          |

## cut

1. `action: create`: create `release/next` from the default branch and push it with upstream. Without a checkout to switch: `pwsh scripts/New-ReleaseNext.ps1` pushes the default branch to `refs/heads/release/next` (JSON `status`: created, present, refused, unreachable); `deliver` calls it when the branch is missing.
2. `action: fast-forward`: move `release/next` to the default branch without deleting it (#528): `git push origin origin/<default>:refs/heads/release/next` (the release merge commit makes it a fast-forward; no force push, no `+semver` commit), then `git fetch origin` and `git checkout -B release/next origin/release/next`. Open PRs into `release/next` keep their base. The push to `release/**` triggers `release-branch.yml` as before.
3. Each `staleLines` entry was released and is never reused. Report it with `git push origin --delete release/<x.y>`; the owner runs it (the guardrail blocks it in a session). Continue with the cut.
4. `releaseWorkflow` false: tell the user the repo does not close issues at merge into `release/*` and offer to copy `templates/release-branch.yml` to `.github/workflows/release-branch.yml` (never silently, one PR per repo, `references/closing.md`).
5. With `--feature <nr>`: insert `Release branch: release/next` as the second line of that issue's body (`gh issue view <nr> --json body`, then `gh issue edit <nr> --body-file -`), the `Parent ...` line stays first.

## finish

1. `state` `unreleased`, `openPrs` empty: continue. `defaultIsAncestor` false (`state` `behind`) stops `finish` before any release PR: report `mergeConflicts` and the back-merge in `references/back-merge.md`; `deliver` step 9 stops the same way. Otherwise `action` already says stop; list `openPrs` when they block.
2. Bump: no commit by default, on `release/next` and on `release/<x.y>`. GitVersion derives it from the Conventional Commits on the branch: `fix:` → patch, `feat:` → minor, `<type>!:` or `BREAKING CHANGE:` → major; a release with only fixes is a patch release. Only the argument `major` (deliberate escape hatch, e.g. batched renames; never ask in a fork) adds `git commit --allow-empty -m "chore: release major" -m "+semver: major"` and a push, and only when `hasMajorCommit` is false.
3. `releasePr` set: CI keeps it current, report it. None: open it with `github-pull-request` in release mode (`branch`, `base_branch: <default>`, `title: release: <branch>`, `merged_prs` per its default, `feature_number` only when recorded, `release_review_notes` when the caller passes them, plus the line `RC test open: <issue URL>` when `releaseTest` is set, `auto_merge: false`). Never use a direct `gh pr create`; when `github-pull-request` stops, stop and report. Do not touch `CHANGELOG.md`: the release job on `main` regenerates it with git-cliff, tags, publishes and closes the issues the release's PRs reference. Pass the milestone: `Get-ReleaseState.ps1 -Mode finish -Milestone <name>`. An open `release-test` issue sets `releaseTest` and `warning` (`RC test open: <url>`): print the warning, add the line to the release PR body. With `release.test.gate: true` in `.agents/config.json` the script returns `action: stop: ...`: report it, no release PR.
4. Report the PR URL, `gh pr merge <nr> --merge` (merge commit, never squash: a squash hides the `feat:`/`fix:` commits from GitVersion and git-cliff) then stop; never wait for the merge. The cleanup after the merge is a later `finish` on the merged branch: `Get-ReleaseState.ps1` returns `fast-forward` and that run moves `release/next` to the default branch (`git push origin origin/<default>:refs/heads/release/next`), it never deletes `release/next`. Only a `release/<x.y>` line is deleted (`git push origin --delete <branch>`).
5. The release job of GravionLabs/ci closes the shipped milestone after the tag. That later run, after the release PR is merged and the tag `v<x.y.z>` exists, only repairs a milestone the job left open: it ends with the milestone hint (no hint when none is open). Read the milestones once: `pwsh ../github-milestone/scripts/Get-Milestones.ps1 -Mode list` (read-only). The release routine is tag, then `create` the next milestone (if missing), then `close`; `--move-to` needs an existing open target, so `create` comes first:
   - An open `M<nnn>` (the lowest, as `current`): `/github-milestone create` (the next free `M<nnn+1>`) first, then `/github-milestone close M<nnn> --move-to M<nnn+1>` (the version comes from the tag; the title becomes `M<nnn> (x.y.z)`; without open issues a plain `close M<nnn>` is enough).
   - Legacy, an open `x.y.z` milestone with `tagged: true`: `create` the next `x.y.z` milestone first, then `/github-milestone close <x.y.z> [--move-to <next>]`.
   - Neither, or `github-milestone` not installed: no hint.

   With `github-milestone` installed `finish` does this itself (`--yes`: no question): `scripts/Test-ReleaseVersion.ps1` first (tag against the commits, a mismatch stops), then create, close unclosed PBIs ("Released in v<x.y.z>"), `close --move-to`, report with the next milestone's ready count. Steps: `references/close-milestone.md`.

## Gotchas

- A `warning` about a missing `deletion` rule (with `delete_branch_on_merge`, merging the release PR deletes `release/next`) or `retargetedPrs` (PRs GitHub moved to the default branch): print it, tell the owner to add the rule (`site/guides/release.md`) before the merge, and retarget those PRs with `gh pr edit <nr> --base release/next`. Never merge the release PR yourself; the push to `main` builds, regenerates the changelog and closes the delivered issues.
- Issues close at merge into `release/next`: `references/closing.md`. A repo without `cliff.toml` gets no changelog from CI: `references/cliff-setup.md`.
- Hotfixes bypass this skill (`fix/<nr>-<slug>` from `main`, merge commit into `main`); afterwards run the back-merge (`references/back-merge.md`: merge commit PR, never squash).
- Workflows reference `GravionLabs/ci` at the major tag `@v<major>` (today `@v1`, as `templates/release-branch.yml`), never `@main` or a commit SHA; third-party actions stay SHA-pinned where the repository requires it.
- A release branch is never continued after its merge. The CI release PR title may show the branch name, not the version (`release-branches.md`).

Report: mode, branch, PR URL (finish) or the Feature issue updated (cut).
