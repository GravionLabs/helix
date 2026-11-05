<#
.SYNOPSIS
  Remove the worktrees and local branches a merged PBI left behind; prints one JSON object.
.DESCRIPTION
  Subagents work in worktrees of their own. A harness keeps a worktree whose HEAD left its start commit (Claude Code
  removes an isolated worktree only when the agent left it unchanged), and its `worktree-<name>` branch stays even when
  the worktree goes. After the merge of PR -Pr this script removes, in the repository of the current directory:
  - worktrees on the head branch of the PR or on `wip-<Issue>`, and detached worktrees at a commit of the PR,
    when they have no uncommitted changes (the main worktree and the current one are never touched);
  - the local branches `<head branch>` and `wip-<Issue>` when no worktree has them checked out;
  - `worktree-<name>` branches whose worktree `<name>` is gone and whose commits are all on a remote
    branch (`git branch -r --contains`); a branch with local-only commits is listed in `left`.
  Deletion order: `worktree-<name>` branches first get `git branch -d` (a user git hook may block `-D`) and `git branch -D`
  only when `-d` fails; the head branch and `wip-<Issue>` always get `-D` (a squash merge does not mark them merged).
  A worktree with uncommitted changes or a branch still checked out is listed in `left` with the command to remove it.
  A `git branch -D` that fails is listed in `left` with reason `git branch -D failed: <first stderr line>`.
  Output: {removed[], branchesDeleted[], left[{path|branch, reason, command}]}. Exit 1 when the PR cannot be read (REST `pulls/<pr>` and `pulls/<pr>/commits`).
.PARAMETER Pr
  Number of the merged pull request.
.PARAMETER Issue
  Number of the PBI (for the `wip-<Issue>` branch).
#>
param(
  [Parameter(Mandatory)][int]$Pr,
  [Parameter(Mandatory)][int]$Issue
)
$ErrorActionPreference = 'Stop'

function Fail([string]$m) { Write-Error $m -ErrorAction Continue; exit 1 }

function Remove-Branch([string]$b, [switch]$TrySafe) {
  if ($TrySafe) {
    & git branch -d $b 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { $deleted.Add($b); return }
  }
  $lines = @(& git branch -D $b 2>&1 | ForEach-Object { "$_" })
  if ($LASTEXITCODE -eq 0) { $deleted.Add($b); return }
  $line = $lines | Where-Object { $_.Trim() } | Select-Object -First 1
  if (-not $line) { $line = 'unknown error' }
  $left.Add([ordered]@{ branch = $b; reason = "git branch -D failed: $line"; command = "git branch -D $b" })
}

# REST, not `gh pr view`: porcelain reads run on the GraphQL budget (#117)
function Get-Rest([string]$endpoint) {
  $out = & gh api $endpoint 2>$null
  if ($LASTEXITCODE -ne 0 -or -not $out) { Fail "gh api $endpoint failed" }
  return ($out -join "`n") | ConvertFrom-Json
}
$head = (Get-Rest "repos/{owner}/{repo}/pulls/$Pr").head.ref
$shas = @(Get-Rest "repos/{owner}/{repo}/pulls/$Pr/commits?per_page=100" | ForEach-Object { $_.sha })
$branches = @($head, "wip-$Issue")

$self = (& git rev-parse --show-toplevel 2>$null)
if ($LASTEXITCODE -ne 0) { Fail 'not inside a git repository' }
$self = [IO.Path]::GetFullPath($self)

# git worktree list --porcelain: blocks of `worktree <path>`, `HEAD <sha>`, `branch refs/heads/<b>` or `detached`
function Get-Worktrees {
  $list = @()
  $cur = $null
  foreach ($line in (& git worktree list --porcelain)) {
    if ($line -like 'worktree *') { $cur = [ordered]@{ path = $line.Substring(9); head = $null; branch = $null }; $list += $cur }
    elseif ($line -like 'HEAD *') { $cur.head = $line.Substring(5) }
    elseif ($line -like 'branch refs/heads/*') { $cur.branch = $line.Substring(18) }
  }
  return $list
}

$removed = [System.Collections.Generic.List[string]]::new()
$deleted = [System.Collections.Generic.List[string]]::new()
$left = [System.Collections.Generic.List[object]]::new()

$all = @(Get-Worktrees)
foreach ($w in ($all | Select-Object -Skip 1)) {
  if ([IO.Path]::GetFullPath($w.path) -eq $self) { continue }
  $match = if ($w.branch) { $branches -contains $w.branch } else { $shas -contains $w.head }
  if (-not $match) { continue }
  $dirty = & git -C $w.path status --porcelain 2>$null
  if ($dirty) {
    $left.Add([ordered]@{ path = $w.path; reason = 'uncommitted changes'; command = "git worktree remove --force $($w.path)" })
    continue
  }
  & git worktree remove $w.path 2>$null
  if ($LASTEXITCODE -eq 0) { $removed.Add($w.path) }
  else { $left.Add([ordered]@{ path = $w.path; reason = 'git worktree remove failed'; command = "git worktree remove --force $($w.path)" }) }
}
& git worktree prune 2>$null

$remaining = @(Get-Worktrees)
$checkedOut = @($remaining | Where-Object { $_.branch } | ForEach-Object { $_.branch })
$wtNames = @($remaining | ForEach-Object { "worktree-$(Split-Path -Leaf $_.path)" })
$local = @(& git for-each-ref --format='%(refname:short)' refs/heads)
foreach ($b in $branches) {
  if ($local -notcontains $b) { continue }
  if ($checkedOut -contains $b) {
    $left.Add([ordered]@{ branch = $b; reason = 'checked out in a worktree'; command = "git branch -D $b" })
    continue
  }
  Remove-Branch $b
}

# leftover worktree-<name> branches of removed worktrees: removed when every commit is on a remote branch
# (the harness starts them at the default branch, not at the base branch); own local commits keep them
foreach ($b in ($local | Where-Object { $_ -like 'worktree-*' -and $checkedOut -notcontains $_ -and $wtNames -notcontains $_ })) {
  $remote = @(& git branch -r --contains $b 2>$null | Where-Object { $_.Trim() -and $_ -notmatch '->' })
  if ($remote.Count -gt 0) {
    Remove-Branch $b -TrySafe
  }
  else {
    $left.Add([ordered]@{ branch = $b; reason = 'commits not on any remote branch'; command = "git branch -D $b" })
  }
}

[ordered]@{ removed = @($removed); branchesDeleted = @($deleted); left = @($left) } | ConvertTo-Json -Depth 4
