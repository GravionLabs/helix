# Back-merge of `main` into `release/next`

Needed after a hotfix on `main` (`defaultIsAncestor` false). A squash drops the ancestry and the release PR conflicts again, so it must be a real merge commit via PR:

1. Branch `chore/<nr>-back-merge-main` from `origin/release/next`, `git merge origin/main`; on conflicts take the content of `release/next`, commit the merge.
2. PR into `release/next` with `github-pull-request`, body `Closes #<issue>` (the `pr-checks` readiness check demands it; open a chore issue if none exists).
3. Merge with `gh pr merge <nr> --merge`. The ruleset of `release/next` allows only `squash`: the owner allows `merge` for this one PR and sets it back to `squash` afterwards. Decision: per back-merge, not permanent; the skill never changes the ruleset, it names this manual step.
4. Run `Get-ReleaseState.ps1 -Mode finish` again: `defaultIsAncestor` true, then `finish` continues.
