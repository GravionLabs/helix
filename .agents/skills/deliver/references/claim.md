# Claiming a PBI

Parallel runs are several sessions, one worktree each, on the same repository. The claim is the assignee of the PBI on GitHub, no extra service. All sessions usually run as the same GitHub user, so any assignee counts as a claim, your own login included.

## Claim

When announcing a PBI (step 1), and when taking over a stale claim:

```powershell
gh issue edit <nr> --add-assignee @me
```

## Fresh or stale

At select, for each open PBI with an assignee, resolve its branch `<type>/<nr>-<slug>` (`github-issue`) and read the time of its last push:

```powershell
gh api repos/{owner}/{repo}/branches/<branch> --jq .commit.commit.committer.date
```

`git ls-remote` gives no date. Then the open PR of the branch, if any:

```powershell
gh api "repos/{owner}/{repo}/pulls?head=<owner>:<branch>&state=open" --jq '.[] | {number, updated_at}'
```

REST, not `gh pr list` (GraphQL budget); `head` needs the owner prefix, a bare branch name matches nothing.

- **Fresh**: the branch was pushed within the last hour, or its open PR was updated within the last hour (a long CI run). Skip the PBI with `#<nr> select: claimed, skipped`.
- **Stale**: the branch is older than an hour and no open PR was updated within the hour. Claim it and continue it (step 2 resumes the branch) with `#<nr> select: stale claim, taken over`.
- **No branch yet**: the claiming session is still implementing in its worktree and has not pushed. Skip it while the assignment is younger than an hour (the last line of `gh api repos/{owner}/{repo}/issues/<nr>/events --paginate --jq '.[] | select(.event == "assigned") | .created_at'`), take it over after that.

Only selection through a Feature or Epic skips. `/deliver <nr>` on the PBI itself continues it whatever the claim says: the user named it. This is also the way back into your own stopped run within the hour: `/deliver <feature>` would skip the PBI, `/deliver <pbi>` continues it.

## Release

When the PBI is merged (step 8), blocked or paused:

```powershell
gh issue edit <nr> --remove-assignee @me
```

A paused PBI also carries `needs-decision`, so select skips it either way.
