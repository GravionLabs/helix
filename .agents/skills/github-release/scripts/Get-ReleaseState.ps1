<#
.SYNOPSIS
  Read-only state check of a release branch for the github-release skill; prints one JSON object.
.DESCRIPTION
  Runs `git fetch origin --tags` and the git/gh checks of `cut` and `finish`, never pushes or deletes.
  Fields: default, branch, state, openPrs[], localAhead, staleLines[], fastForwardAllowed, action, plus
  hasMajorCommit (a `+semver: major` commit on the branch: `finish major` adds none again), releaseWorkflow and
  releasePr (the CI release PR, or null), defaultIsAncestor (origin/<default> is an ancestor of the branch; null when
  the branch is not on origin) and mergeConflicts (`git merge-tree` reports conflicts between them; null when
  defaultIsAncestor is true, the branch is absent or git cannot tell). A squashed back-merge leaves it false. The bump otherwise comes from the Conventional Commits on the branch.
  state: absent (not on origin), fresh (equals default), unreleased (own work, not behind), behind (default
  has commits the branch lacks), merged (tip is the second parent of a merge on default), released (ancestor
  of default, not a merge tip), released-continued (continued after its release merge).
  Mode base resolves the base branch of a pull request instead and prints { base, source, warning }: source input
  (-Branch given), issue (Release branch: line of -Issue or a parent, one Parent <Level>: #N line at a time), current
  (current release/* branch) or default (the default branch). warning is set when base is a released, not yet reset
  release/next.
.PARAMETER Mode
  cut, finish or base.
.PARAMETER Branch
  release/next or release/<x.y>. Default: cut -> release/next; finish -> the current branch if release/*,
  else release/next on origin, else the highest release/<x.y> whose v<x.y>.0 tag is not on origin.
  With base: the explicit base_branch input, returned unchanged.
.PARAMETER Issue
  base only: issue number whose body (and parents) may carry a `Release branch:` line.
.PARAMETER Milestone
  finish only: milestone title. Adds releaseTest (the open issue labeled `release-test` of it: number, url; or null),
  olderReleaseTests (open release-test issues of lower milestones, to close as superseded), gate (`release.test.gate` of .agents/config.json, default false) and warning (`RC test open: <url>`). With gate true
  and an open release-test issue `action` becomes a stop.
#>
param(
  [Parameter(Mandatory)][ValidateSet('cut', 'finish', 'base')][string]$Mode,
  [string]$Branch,
  [int]$Issue,
  [string]$Milestone
)
$ErrorActionPreference = 'Stop'

function Fail([string]$m) { Write-Error $m -ErrorAction Continue; exit 1 }
function Invoke-Git { $o = & git @args 2>$null; $script:gitOk = ($LASTEXITCODE -eq 0); $o }

$null = Invoke-Git fetch origin --tags --quiet
if (-not $gitOk) { Fail 'git fetch origin failed' }

$default = (Invoke-Git symbolic-ref refs/remotes/origin/HEAD --short)
$default = if ($gitOk -and $default) { $default -replace '^origin/', '' } else { 'main' }

$heads = @(Invoke-Git ls-remote --heads origin 'release/*' | ForEach-Object { $_ -replace '.*refs/heads/', '' })
$tags = @(Invoke-Git ls-remote --tags origin 'v*' | ForEach-Object { ($_ -replace '.*refs/tags/', '') -replace '\^\{\}$', '' })
$xy = '^release/[0-9]+\.[0-9]+$'
$staleLines = @($heads | Where-Object { $_ -match $xy } | Sort-Object { [version]($_ -replace '^release/', '') } |
    Where-Object { $tags -contains ('v' + ($_ -replace '^release/', '') + '.0') })

# release/next on origin, else the highest release/<x.y> whose v<x.y>.0 tag is not on origin, else $null
function Get-OriginBase {
  if ($heads -contains 'release/next') { return 'release/next' }
  $open = @($heads | Where-Object { $_ -match $xy -and $staleLines -notcontains $_ } | Sort-Object { [version]($_ -replace '^release/', '') })
  if ($open.Count -gt 0) { $open[-1] } else { $null }
}

# Release branch: line of the issue body, else of its parent (Parent <Level>: #N), one level at a time
function Get-IssueBase([int]$nr) {
  $seen = @{}
  while ($nr -and -not $seen.ContainsKey($nr)) {
    $seen[$nr] = $true
    $raw = & gh issue view $nr --json body 2>$null
    if ($LASTEXITCODE -ne 0) { Fail "gh issue view $nr failed" }
    $body = [string]($raw | ConvertFrom-Json).body
    if ($body -match '(?m)^Release branch:\s*`?(release/(?:next|[0-9]+\.[0-9]+))`?\s*$') { return $Matches[1] }
    $nr = if ($body -match '(?m)^Parent [A-Za-z]+: #([0-9]+)') { [int]$Matches[1] } else { 0 }
  }
  $null
}

if ($Mode -eq 'base') {
  $source = 'default'; $base = $null
  if ($Branch) { $base = $Branch; $source = 'input' }
  if (-not $base -and $Issue) { $base = Get-IssueBase $Issue; if ($base) { $source = 'issue' } }
  if (-not $base) {
    $cur = Invoke-Git branch --show-current
    if ($cur -match '^release/') { $base = $cur; $source = 'current' }
  }
  if (-not $base) { $base = $default }
  $warning = $null
  if ($base -eq 'release/next' -and $heads -contains $base) {
    $null = Invoke-Git merge-base --is-ancestor origin/release/next "origin/$default"; $inDefault = $gitOk
    if ($inDefault -and (Invoke-Git rev-parse origin/release/next) -ne (Invoke-Git rev-parse "origin/$default")) {
      $warning = 'released, not reset: run github-release cut'
    }
  }
  [ordered]@{ base = $base; source = $source; warning = $warning } | ConvertTo-Json
  exit 0
}

if (-not $Branch) {
  if ($Mode -eq 'cut') { $Branch = 'release/next' }
  else {
    $cur = Invoke-Git branch --show-current
    if ($cur -match '^release/') { $Branch = $cur }
    else {
      $Branch = Get-OriginBase
      if (-not $Branch) { Fail 'no release branch found; run cut' }
    }
  }
}
if ($Branch -notmatch '^release/(next|[0-9]+\.[0-9]+)$') { Fail "invalid branch name '$Branch': expected release/next or release/<x.y>" }

$remote = "origin/$Branch"
$def = "origin/$default"
$onOrigin = $heads -contains $Branch
$state = 'absent'; $openPrs = @(); $localAhead = 0; $major = $false
$defaultIsAncestor = $null; $mergeConflicts = $null

if ($onOrigin) {
  $null = Invoke-Git merge-base --is-ancestor $remote $def; $inDefault = $gitOk
  $null = Invoke-Git merge-base --is-ancestor $def $remote; $hasDefault = $gitOk
  $tip = Invoke-Git rev-parse $remote
  $defaultIsAncestor = [bool]$hasDefault
  if (-not $hasDefault) {
    $null = & git merge-tree --write-tree $def $remote 2>$null
    $mergeConflicts = switch ($LASTEXITCODE) { 0 { $false } 1 { $true } default { $null } }
  }
  if ($inDefault) {
    $merges = @(Invoke-Git log --merges --first-parent $def --format=%P)
    if ((Invoke-Git rev-parse $remote) -eq (Invoke-Git rev-parse $def)) { $state = 'fresh' }
    elseif ($merges | Where-Object { $_ -match " $tip$" }) { $state = 'merged' }
    else { $state = 'released' }
  }
  else {
    $continued = $false
    if ($Branch -match $xy) { $continued = $tags -contains ('v' + ($Branch -replace '^release/', '') + '.0') }
    else {
      foreach ($t in (Invoke-Git tag -l 'v*')) {
        $p = Invoke-Git rev-parse -q --verify "$t^2"
        if (-not $gitOk) { continue }
        $null = Invoke-Git merge-base --is-ancestor $p $remote; $pIn = $gitOk
        $null = Invoke-Git merge-base --is-ancestor $t $remote; $tIn = $gitOk
        if ($pIn -and -not $tIn) { $continued = $true; break }
      }
    }
    $state = if ($continued) { 'released-continued' } elseif (-not $hasDefault) { 'behind' } else { 'unreleased' }
  }
  $raw = & gh pr list --base $Branch --state open --json number,title,url 2>$null
  if ($LASTEXITCODE -ne 0) { Fail 'gh pr list failed' }
  $openPrs = @($raw | ConvertFrom-Json)
  $null = Invoke-Git rev-parse -q --verify "refs/heads/$Branch"
  if ($gitOk) { $localAhead = [int](Invoke-Git rev-list --count "$remote..refs/heads/$Branch") }
  $major = [bool](Invoke-Git log "$def..$remote" -F --grep '+semver: major')
}

# #528: release/next is moved to the default branch by a fast-forward, never deleted; open PRs keep their base
$fastForwardAllowed = ($Branch -eq 'release/next') -and ($state -in 'released', 'merged') -and $localAhead -eq 0

$stopReleased = 'stop: already released; cut a new release branch'
$action = if ($Mode -eq 'cut') {
  switch ($state) {
    'absent' { 'create' }
    { $_ -in 'released', 'merged' } { if ($fastForwardAllowed) { 'fast-forward' } else { 'stop: local commits block the reset' } }
    default { 'noop' }
  }
}
else {
  switch ($state) {
    'absent' { 'stop: branch not on origin' }
    'fresh' { 'stop: nothing to release' }
    'merged' { if ($fastForwardAllowed) { 'fast-forward' } else { $stopReleased } }
    { $_ -in 'released', 'released-continued' } { $stopReleased }
    'behind' { "stop: $default is not an ancestor of $Branch; back-merge it first (merge commit PR, see the back-merge section of github-release)" }
    default { if ($openPrs.Count -gt 0) { 'stop: open PRs target the branch; merge them first' } else { 'release-pr' } }
  }
}

# #528: with `delete_branch_on_merge` and no `deletion` rule, merging the release PR deletes release/next and GitHub moves
# the open PRs into it to the default branch. Fail soft: when gh cannot tell, the fields stay null / empty and no warning is set.
$deleteOnMerge = $null; $deletionRule = $null; $retargetedPrs = @(); $ruleWarning = $null
if ($Branch -eq 'release/next' -and $onOrigin) {
  $raw = & gh repo view --json nameWithOwner --jq .nameWithOwner 2>$null
  $slug = if ($LASTEXITCODE -eq 0) { ([string]$raw).Trim() } else { '' }
  if ($slug -match '^[^/\s]+/[^/\s]+$') {
    $raw = & gh api "repos/$slug" --jq .delete_branch_on_merge 2>$null
    if ($LASTEXITCODE -eq 0 -and "$raw".Trim() -in 'true', 'false') { $deleteOnMerge = ("$raw".Trim() -eq 'true') }
    $raw = & gh api "repos/$slug/rules/branches/release/next" 2>$null
    if ($LASTEXITCODE -eq 0 -and $raw) {
      $deletionRule = [bool](@($raw | ConvertFrom-Json) | Where-Object { $_.type -eq 'deletion' })
    }
    $q = 'query($o:String!,$n:String!,$b:String!){repository(owner:$o,name:$n){pullRequests(baseRefName:$b,states:OPEN,first:50){nodes{number title url timelineItems(itemTypes:[BASE_REF_CHANGED_EVENT],last:1){nodes{... on BaseRefChangedEvent{previousRefName}}}}}}}'
    $owner, $name = $slug -split '/'
    $raw = & gh api graphql -f query=$q -f o=$owner -f n=$name -f b=$default 2>$null
    if ($LASTEXITCODE -eq 0 -and $raw) {
      $nodes = @(($raw | ConvertFrom-Json).data.repository.pullRequests.nodes)
      $retargetedPrs = @($nodes | Where-Object { @($_.timelineItems.nodes)[-1].previousRefName -eq 'release/next' } |
          ForEach-Object { [ordered]@{ number = $_.number; title = $_.title; url = $_.url } })
    }
  }
  $parts = @()
  if ($deleteOnMerge -eq $true -and $deletionRule -eq $false) {
    $parts += 'release/next has no deletion rule while delete_branch_on_merge is on: merging the release PR deletes it (add the `deletion` rule to its ruleset)'
  }
  if ($retargetedPrs.Count -gt 0) {
    $parts += 'open PRs moved from release/next to ' + $default + ': ' + (($retargetedPrs | ForEach-Object { '#' + $_.number }) -join ', ')
  }
  if ($parts.Count -gt 0) { $ruleWarning = $parts -join '; ' }
}

$workflow = $false
if (Test-Path .github/workflows) {
  $workflow = [bool](Select-String -Path .github/workflows/*.yml -SimpleMatch @('ci/.github/workflows/release-branch.yml', './.github/workflows/release-branch.yml') -List -ErrorAction SilentlyContinue)
}
$releasePr = $null
if ($Mode -eq 'finish' -and $onOrigin) {
  $raw = & gh pr list --base $default --head $Branch --state open --json number,url 2>$null
  if ($LASTEXITCODE -eq 0) { $releasePr = @($raw | ConvertFrom-Json) | Select-Object -First 1 }
}

$olderReleaseTests = @(); $releaseTest = $null; $gate = $false; $warning = $null
if ($Mode -eq 'finish' -and $Milestone) {
  $raw = & gh issue list --label release-test --state open --milestone $Milestone --json number,url,milestone 2>$null
  if ($LASTEXITCODE -ne 0) { Fail 'gh issue list failed' }
  $releaseTest = @($raw | ConvertFrom-Json) | Select-Object -First 1
  $raw = & gh issue list --label release-test --state open --json number,url,milestone 2>$null
  if ($LASTEXITCODE -ne 0) { Fail 'gh issue list failed' }
  $allIssues = @($raw | ConvertFrom-Json)
  # numeric value of M<n>[.<m>] (padded or not: M3 = M003, M011.1 = 11.1)
  $msNum = {
    param($t)
    if ($t -match '^M(\d+)(?:\.(\d+))?') { [double]("$([int]$Matches[1]).$(if ($Matches[2]) { $Matches[2] } else { '0' })") } else { $null }
  }
  # #409: gh needs the exact title; M<n> is also the key of a milestone titled `M<n> <Topic>`; matched by number, not by padding
  if (-not $releaseTest -and $Milestone -match '^M\d+(\.\d+)?$') {
    $wantNum = & $msNum $Milestone
    $releaseTest = $allIssues | Where-Object { $_.milestone.title -match '^M\d+(\.\d+)?(\s|$)' -and (& $msNum $_.milestone.title) -eq $wantNum } | Select-Object -First 1
  }
  # #399: only issues of a lower milestone (M-number, else due date) are replaced; no milestone = skipped
  $curDue = if ($releaseTest -and $releaseTest.milestone.dueOn) { [datetime]$releaseTest.milestone.dueOn } else { $null }
  $isOlder = {
    param($m)
    if (-not $m -or -not $m.title -or $m.title -eq $Milestone) { return $false }
    $a = & $msNum $m.title; $b = & $msNum $Milestone
    if ($null -ne $a -and $null -ne $b) { return $a -lt $b }
    if ($m.dueOn -and $curDue) { return ([datetime]$m.dueOn) -lt $curDue }
    return $false
  }
  $olderReleaseTests = @($allIssues | Where-Object { & $isOlder $_.milestone } |
      ForEach-Object { [ordered]@{ number = $_.number; url = $_.url } })
  if (Test-Path .agents/config.json) {
    $cfg = Get-Content .agents/config.json -Raw | ConvertFrom-Json
    $gate = [bool]($cfg.release.test.gate -eq $true)
  }
  if ($releaseTest) {
    $warning = "RC test open: $($releaseTest.url)"
    if ($gate -and $action -eq 'release-pr') { $action = "stop: release.test.gate is true, close the RC test $($releaseTest.url) first" }
  }
}

if ($ruleWarning) { $warning = if ($warning) { "$warning; $ruleWarning" } else { $ruleWarning } }

[ordered]@{
  default = $default; branch = $Branch; state = $state; openPrs = @($openPrs); localAhead = $localAhead
  staleLines = @($staleLines); fastForwardAllowed = $fastForwardAllowed; action = $action
  hasMajorCommit = $major; deleteOnMerge = $deleteOnMerge; deletionRule = $deletionRule; retargetedPrs = @($retargetedPrs); defaultIsAncestor = $defaultIsAncestor; mergeConflicts = $mergeConflicts; releaseWorkflow = $workflow; releasePr = $releasePr
  releaseTest = $releaseTest; olderReleaseTests = @($olderReleaseTests); gate = $gate; warning = $warning
} | ConvertTo-Json -Depth 4
