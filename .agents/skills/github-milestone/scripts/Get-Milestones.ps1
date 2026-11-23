<#
.SYNOPSIS
  Milestones of a repository as JSON (schema/milestones.schema.json) for the github-milestone skill.
.DESCRIPTION
  Titles are written with a 3-digit main number (`M001`, `M011.1`, `M001 (0.2.0)`; at most M999, one sub level 1..9, create/rename/insert refuse more) and found by value (`M11`, `M011`, `M0011`). Milestone titles: `M<n>` or `M<n>.<m>[.<k>...]` (sub-number, sorts numerically per part between M<n> and M<n+1>: 1, 1.1, 1.2, 2, 10; lookup by `M1.1` is exact, `M1` never finds `M1.1`) or `M<n> <Topic>` while open (topic without parentheses), `M<n> [<Topic>] (x.y.z)` after close, and the legacy
  bare `x.y.z` (still valid, no flag day). Other titles are listed but never current.
  current, list and show are read-only and use only `gh api` GET calls (REST). create and close are the writes.
  current: the open milestone with the lowest M number; legacy rule unchanged: an open x.y.z title above the latest
  release tag v<x.y.z> comes first ({ current: null, hint } when there is none). list: all milestones, open and
  closed, sorted legacy semver first, then M number, other titles last. show: one milestone by -Name: exact title,
  M<n> (also with a topic and/or the parentheses; `M3` and `M3 Market data` find the same milestone) or the version in the parentheses. current and show group the open
  issues (pull requests filtered out) as needsDecision, needsRefinement, blocked (open blockers), claimed (assignee)
  and ready, in that precedence (a blocker from another repository carries repository owner/repo), and add the release
  PR release/next -> default from Get-ReleaseState.ps1 of the github-release skill. tagged: the tag v<version> of the
  parentheses exists (legacy: v<title>; M<n> without version: false).
  create: creates milestone -Name (M<n> [<Topic>], or legacy x.y.z) when none matches; without -Name the next free M number.
  It never renames or closes one.
  rename: renames the open milestone -Name (found as in show) to -To, a title of the grammar M<n> [<Topic>] [(x.y.z)] (legacy x.y.z is no valid target).
  The number of an existing M<n> title never changes; a legacy x.y.z title may become any M<n>. Refuses an unknown or closed milestone, an existing -To and an invalid -To (exit 1).
  The one PATCH changes only the title; the version comes from -To (a milestone shipped as v0.1.1 under the title 0.2.0 becomes M2 (0.1.1)).
  issues: resolves the milestone -Name (any form above) to its number and lists its issues (body, labels, assignees,
  state; pull requests filtered out) in one paginated REST call, for the batched reads of deliver; unknown milestone: exit 1.
  close: closes the milestone -Name. M<n>: takes the version from -Version, else the newest release tag v<x.y.z> not yet
  assigned to a milestone; that tag must exist; the version is added at the end (`M3 Market data` becomes `M3 Market data (x.y.z)`) in the same PATCH that closes it.
  Legacy x.y.z: needs the tag v<x.y.z>, closes without renaming. Exit 1 when the name is not valid, the milestone
  does not exist, or no tag fits. Already closed: changes nothing ({ closed: false }). Open issues (pull requests are
  ignored and never moved): without -MoveTo nothing is renamed or closed and they are listed in openIssues;
  -MoveTo is validated first (also without open issues). With -MoveTo <M<m>|x.y.z> they are moved to that existing open milestone first (never created), then it is closed.
  Never edits the due date or deletes a milestone.
  insert: `insert -Name M<n>` renames every open M<k> with k >= n (and its sub-numbered ones, topic and version kept) to k+1, from the highest down so no title collides,
  then creates M<n>. Closed milestones are never touched; a closed or unmoved milestone that would collide exits 1 before the first write. -DryRun only lists
  the renames. Result: renames[], references[] (what is not rewritten: issue bodies of the shifted milestones, ROADMAP.md, release-review-<M<n>>.json state files).
  assign: `assign -Name <M<n>|none> -Issues 1,2,3` sets the milestone of the issues (found as in show; open only; a missing one is never created: exit 1, with -DryRun the plan is made against it (state `missing`) so the rules can be checked first) or clears it (`none`).
  Everything is checked before the first write (exit 1, nothing changed): an Epic never gets a milestone; a Feature only when all its open sub-issues are in it afterwards
  (the call's own issues count with the new milestone; a sub-issue from another repository is always outside). Clearing a PBI or Bug is allowed, reported in warnings[]
  (no-milestone; feature-incomplete when its Feature keeps the milestone). An issue already in the target is `unchanged`. -DryRun writes nothing.
  Result: assigned[] (number, previous, milestone, status set|unchanged), warnings[].
  renumber: migrates the titles of every numbered milestone, open and closed, to the padded form (`M1 (0.2.0)` -> `M001 (0.2.0)`, `M11.1` -> `M011.1`, `M12 Terminal` -> `M012 Terminal`; topic and version kept; legacy x.y.z and other titles untouched).
  A target title that exists already (also two milestones with the same number) exits 1 before the first write; a number above 999 or a sub-number above 9 is reported in skipped[] and left as it is. A second run plans nothing.
  -DryRun prints the plan (renames[]: number, state, old, new; skipped[]; summary) and writes nothing. -AllRepos: one result per repository in repos[].
.PARAMETER Mode
  current, list, show, create, issues, close, rename, insert, assign or renumber.
.PARAMETER Issues
  assign: issue numbers, comma or space separated, `#` allowed (`1,2,#3`).
.PARAMETER NoReleaseTest
  create, insert: skip the release-test issue (New-ReleaseTestIssue.ps1 makes it only when .agents/config.json has release.test, never twice per milestone; result key releaseTest).
.PARAMETER DryRun
  insert: list the renames and the references that need a manual check, write nothing. assign: report the result, write nothing.
.PARAMETER Name
  show, create, close, issues: M<n>, the full title, the version x.y.z (a leading v is dropped) or the title of a legacy milestone.
  create: M<n> or x.y.z; empty: the next free M number.
.PARAMETER To
  rename: the new title, M<n> [<Topic>] [(x.y.z)].
.PARAMETER Version
  close M<n>: the release version x.y.z for the new title; default the newest release tag not yet assigned to a milestone; an explicit version may be carried by several milestones.
.PARAMETER MoveTo
  close: M<m> (or legacy x.y.z) of an existing open milestone that receives the open issues.
.PARAMETER State
  issues: open, closed or all (default).
.PARAMETER Repo
  owner/name; default: the repository of the current directory ({owner}/{repo} of gh).
.PARAMETER ReleaseState
  Path of Get-ReleaseState.ps1; default: the sibling github-release skill. Missing: releasePr is null.
.PARAMETER AllRepos
  renumber: run it over every repository of the owner that is not archived and has milestones (`gh repo list <owner> --no-archived`). All repositories are planned first; one clash or failure aborts before the first write.
.PARAMETER Planned
  assign: JSON object {"<issue>": "<milestone title>"} of the whole assignment of the caller (all targets). A Feature's open sub-issue listed there counts as inside only when its planned milestone is the target; without it only the issues of this call count.
.PARAMETER Owner
  renumber -AllRepos: the owner; default the owner of -Repo (of the current directory without -Repo).
#>
param(
  [Parameter(Mandatory)][ValidateSet('current', 'list', 'show', 'create', 'issues', 'close', 'rename', 'insert', 'assign', 'renumber')][string]$Mode,
  [string]$Issues,
  [string]$Planned,
  [switch]$NoReleaseTest,
  [string]$Name,
  [string]$To,
  [string]$MoveTo,
  [switch]$DryRun,
  [switch]$AllRepos,
  [string]$Owner,
  [string]$Version,
  [ValidateSet('open', 'closed', 'all')][string]$State = 'all',
  [string]$Repo = '{owner}/{repo}',
  [string]$ReleaseState = (Join-Path $PSScriptRoot '../../github-release/scripts/Get-ReleaseState.ps1')
)
$ErrorActionPreference = 'Stop'

function Fail([string]$m) { Write-Error $m -ErrorAction Continue; exit 1 }

# GET with --paginate --slurp: one array of pages, flattened to the items
function Get-Paged([string]$path) {
  $raw = & gh api $path --paginate --slurp 2>$null
  if ($LASTEXITCODE -ne 0) { Fail "gh api $path failed" }
  $items = [System.Collections.Generic.List[object]]::new()
  Add-Leaf $items ($raw | Out-String | ConvertFrom-Json -NoEnumerate)
  $items.ToArray()
}
function Add-Leaf($list, $x) {
  if ($x -is [System.Collections.IList]) { foreach ($e in $x) { Add-Leaf $list $e } }
  elseif ($null -ne $x) { $list.Add($x) }
}

$semverRx = '^([0-9]+)\.([0-9]+)\.([0-9]+)$'
function ConvertTo-Version([string]$t) { if ($t -match $semverRx) { [version]"$($Matches[1]).$($Matches[2]).$($Matches[3])" } else { $null } }
function Get-Bare([string]$n) { $n -replace '^v(?=[0-9])', '' }
$numberedRx = '^M([0-9]{1,8}(?:\.[0-9]{1,8}){0,7})(?: ([^()]+?))?(?: \(([0-9]+\.[0-9]+\.[0-9]+)\))?$'
# sort key of a number id (1, 1.1, 10): every part padded to 8 digits, 8 parts, so the string order is the numeric order per part
function Get-NumKey([string]$id) { $p = @(if ($id) { $id -split '\.' }); (0..7 | ForEach-Object { if ($_ -lt $p.Count) { $p[$_].PadLeft(8, '0') } else { '00000000' } }) -join '' }
# Titles are written with a 3-digit main number (M001, M011.1), found by value (M11, M011, M0011 are one). n is the normalized id (11, 11.1).
function Format-Id([string]$id) { $p = @($id -split '\.' | ForEach-Object { [int]$_ }); (@('{0:D3}' -f $p[0]) + @($p | Select-Object -Skip 1)) -join '.' }
function Format-Title($p) { "M$(Format-Id $p.n)$(if ($p.topic) { " $($p.topic)" })$(if ($p.version) { " ($($p.version))" })" }
# $null when a new title may use this id, else the reason (main number up to 999, one sub level 1..9)
function Test-Writable([string]$id) {
  $p = @($id -split '\.' | ForEach-Object { [int]$_ })
  if ($p[0] -gt 999) { return "main number $($p[0]) is above 999 (titles are written as M001..M999)" }
  if ($p.Count -gt 2) { return "more than one sub level in M$id (only M<n>.<m> is written)" }
  if ($p.Count -eq 2 -and $p[1] -gt 9) { return "sub-number $($p[1]) in M$id is above 9" }
}
# title -> @{ kind = 'numbered'|'legacy'|$null; n (id string: 1 or 1.1); key (sort key); whole (int before the first dot); topic; version } (version: of the parentheses, or the legacy title)
function Get-Title([string]$t) {
  if ($t -cmatch $numberedRx) { @{ kind = 'numbered'; n = (($Matches[1] -split '\.' | ForEach-Object { [int]$_ }) -join '.'); key = (Get-NumKey $Matches[1]); whole = [int](($Matches[1] -split '\.')[0]); topic = $Matches[2]; version = $Matches[3] } }
  elseif ($t -match $semverRx) { @{ kind = 'legacy'; n = ''; key = (Get-NumKey ''); whole = 0; topic = $null; version = $t } }
  else { @{ kind = $null; n = ''; key = (Get-NumKey ''); whole = 0; topic = $null; version = $null } }
}
# lookup: exact title, M<n> or M<n> <Topic> (by the number), the version in the parentheses (a leading v is dropped)
function Find-Milestone($all, [string]$name) {
  $bare = Get-Bare $name
  $hit = $all | Where-Object { $_.title -eq $name -or $_.title -eq $bare } | Select-Object -First 1
  $np = Get-Title $bare
  if (-not $hit -and $np.kind -eq 'numbered' -and -not $np.version) {
    $n = $np.n
    $hit = $all | Where-Object { $p = Get-Title $_.title; $p.kind -eq 'numbered' -and $p.n -eq $n } | Select-Object -First 1
  }
  if (-not $hit -and $bare -match $semverRx) {
    $hit = $all | Where-Object { $p = Get-Title $_.title; $p.kind -eq 'numbered' -and $p.version -eq $bare } | Sort-Object number | Select-Object -First 1
  }
  $hit
}

# release-test issue of a new milestone; $null without release.test or with -NoReleaseTest
function New-ReleaseTest($ms) {
  if ($NoReleaseTest) { return $null }
  $raw = & (Join-Path $PSScriptRoot 'New-ReleaseTestIssue.ps1') -Milestone $ms.title -MilestoneNumber $ms.number -Repo $Repo
  if ($LASTEXITCODE -ne 0) { Fail "creating the release-test issue of $($ms.title) failed" }
  if ($raw) { $raw | Out-String | ConvertFrom-Json }
}

# renumber: plan of one repository ($ms = its milestones); error = reason (nothing may be written), renames[] old -> new
function Get-RenumberPlan([string]$repo, $ms) {
  $renames = [System.Collections.Generic.List[object]]::new()
  $skipped = [System.Collections.Generic.List[object]]::new()
  $numbered = 0; $unchanged = 0; $other = 0
  foreach ($m in ($ms | Sort-Object number)) {
    $p = Get-Title $m.title
    if ($p.kind -ne 'numbered') { $other++; continue }
    $numbered++
    $bad = Test-Writable $p.n
    if ($bad) { $skipped.Add([ordered]@{ number = $m.number; state = $m.state; title = $m.title; reason = $bad }); continue }
    $new = Format-Title $p
    if ($new -ceq $m.title) { $unchanged++; continue }
    $renames.Add([ordered]@{ number = $m.number; state = $m.state; old = $m.title; new = $new })
  }
  $err = $null
  foreach ($r in $renames) {
    $taken = @($ms | Where-Object { $_.number -ne $r.number -and $_.title -ieq $r.new } | Select-Object -First 1)
    $twin = @($renames | Where-Object { $_.number -ne $r.number -and $_.new -ieq $r.new } | Select-Object -First 1)
    if ($taken.Count) { $err = "milestone '$($taken[0].title)' already exists: renumber would rename '$($r.old)' to '$($r.new)'"; break }
    if ($twin.Count) { $err = "'$($twin[0].old)' and '$($r.old)' would both become '$($r.new)'"; break }
  }
  [ordered]@{
    repo = $repo; renumbered = $false; dryRun = [bool]$DryRun; error = $err
    renames = @($renames); skipped = @($skipped)
    summary = [ordered]@{ milestones = @($ms).Count; numbered = $numbered; renames = $renames.Count; unchanged = $unchanged; skipped = $skipped.Count; other = $other }
  }
}

if ($Mode -eq 'renumber') {
  if (-not $AllRepos -and $Repo -eq '{owner}/{repo}') {
    $Repo = (& gh repo view --json nameWithOwner --jq '.nameWithOwner' 2>$null | Out-String).Trim()
    if ($LASTEXITCODE -ne 0 -or -not $Repo) { Fail 'cannot resolve the repository: pass -Repo owner/name' }
  }
  $repos = @($Repo)
  if ($AllRepos) {
    $own = $Owner
    if (-not $own -and $Repo -ne '{owner}/{repo}') { $own = ($Repo -split '/')[0] }
    if (-not $own) { $own = (& gh repo view --json owner --jq '.owner.login' 2>$null | Out-String).Trim(); if ($LASTEXITCODE -ne 0 -or -not $own) { Fail 'cannot resolve the owner: pass -Owner' } }
    $raw = & gh repo list $own --json nameWithOwner --no-archived --limit 1000 2>$null
    if ($LASTEXITCODE -ne 0) { Fail "gh repo list $own failed" }
    $repos = @($raw | Out-String | ConvertFrom-Json | ForEach-Object { $_.nameWithOwner })
  }
  $plans = [System.Collections.Generic.List[object]]::new()
  foreach ($r in $repos) {
    $ms = @(Get-Paged "repos/$r/milestones?state=all&per_page=100")
    if ($AllRepos -and -not $ms.Count) { continue }
    $plans.Add((Get-RenumberPlan $r $ms))
  }
  $failed = @($plans | Where-Object { $_.error })
  if (-not $DryRun -and -not $failed.Count) {
    $done = [System.Collections.Generic.List[string]]::new()
    foreach ($pl in $plans) {
      foreach ($rn in $pl.renames) {
        $null = & gh api -X PATCH "repos/$($pl.repo)/milestones/$($rn.number)" -f "title=$($rn.new)" 2>$null
        if ($LASTEXITCODE -ne 0) { Fail "renaming milestone $($rn.old) to $($rn.new) in $($pl.repo) failed (renamed so far: $($done -join ', '))" }
        $done.Add("$($pl.repo): $($rn.old) -> $($rn.new)")
      }
      $pl.renumbered = $true
    }
  }
  foreach ($f in $failed) { Write-Error "$($f.repo): $($f.error); nothing was changed" -ErrorAction Continue }
  if ($AllRepos) { [ordered]@{ allRepos = $true; dryRun = [bool]$DryRun; repos = @($plans) } | ConvertTo-Json -Depth 7 }
  else { $plans[0] | ConvertTo-Json -Depth 6 }
  if ($failed.Count) { exit 1 }
  exit 0
}

$milestones = @(Get-Paged "repos/$Repo/milestones?state=all&per_page=100")

if ($Mode -eq 'create') {
  if ($Name) {
    $title = Get-Bare $Name
    $pt = Get-Title $title
    if (-not $pt.kind -or ($pt.kind -eq 'numbered' -and $pt.version)) { Fail "invalid milestone name '$Name': expected M<n> [<Topic>] or x.y.z" }
    if ($pt.kind -eq 'numbered') { $bad = Test-Writable $pt.n; if ($bad) { Fail "invalid milestone name '$Name': $bad" }; $title = Format-Title $pt }
  }
  else {
    $max = 0
    foreach ($x in $milestones) { $p = Get-Title $x.title; if ($p.kind -eq 'numbered' -and $p.whole -gt $max) { $max = $p.whole } }
    $bad = Test-Writable "$($max + 1)"
    if ($bad) { Fail "cannot create the next milestone: $bad" }
    $title = "M$('{0:D3}' -f ($max + 1))"
  }
  $existing = Find-Milestone $milestones $title
  $created = -not $existing
  if ($created) {
    $raw = & gh api -X POST "repos/$Repo/milestones" -f "title=$title" 2>$null
    if ($LASTEXITCODE -ne 0) { Fail "creating milestone $title failed" }
    $existing = $raw | ConvertFrom-Json
  }
  $res = [ordered]@{ created = $created; milestone = [ordered]@{ number = $existing.number; title = $existing.title; state = $existing.state; url = $existing.html_url } }
  if ($created) { $rt = New-ReleaseTest $existing; if ($rt) { $res.releaseTest = $rt } }
  $res | ConvertTo-Json -Depth 4
  exit 0
}

if ($Mode -eq 'rename') {
  if (-not $Name) { Fail 'rename needs -Name <milestone>' }
  if (-not $To -or (Get-Title $To).kind -ne 'numbered') { Fail "invalid -To '$To': expected M<n> [<Topic>] [(x.y.z)]" }
  $m = Find-Milestone $milestones $Name
  if (-not $m) { Fail "milestone '$Name' not found" }
  if ($m.state -ne 'open') { Fail "milestone '$($m.title)' is closed: only open milestones are renamed" }
  $from = Get-Title $m.title
  $dest = Get-Title $To
  $bad = Test-Writable $dest.n
  if ($bad) { Fail "invalid -To '$To': $bad" }
  $To = Format-Title $dest
  if ($from.kind -eq 'numbered' -and $from.n -ne $dest.n) { Fail "the number of $($m.title) stays M$(Format-Id $from.n): -To '$To' would change it" }
  $clash = $milestones | Where-Object { $_.title -ieq $To -or ($_.number -ne $m.number -and (Get-Title $_.title).kind -eq 'numbered' -and (Get-Title $_.title).n -eq $dest.n) } | Select-Object -First 1
  if ($clash) { Fail "milestone '$($clash.title)' already exists: -To '$To' is taken" }
  $null = & gh api -X PATCH "repos/$Repo/milestones/$($m.number)" -f "title=$To" 2>$null
  if ($LASTEXITCODE -ne 0) { Fail "renaming milestone $($m.title) to $To failed" }
  [ordered]@{ renamed = $true; previousTitle = $m.title; milestone = [ordered]@{ number = $m.number; title = $To; state = $m.state; url = $m.html_url } } |
    ConvertTo-Json -Depth 4
  exit 0
}

if ($Mode -eq 'insert') {
  if (-not $Name) { Fail 'insert needs -Name M<n>' }
  if ($Name -cnotmatch '^M([0-9]{1,8})$') { Fail "invalid milestone name '$Name': insert takes a whole number M<n>" }
  $at = [int]$Matches[1]
  $bad = Test-Writable "$at"
  if ($bad) { Fail "invalid milestone name '$Name': $bad" }
  $shift = @($milestones | Where-Object { $p = Get-Title $_.title; $_.state -eq 'open' -and $p.kind -eq 'numbered' -and $p.whole -ge $at } | Sort-Object { (Get-Title $_.title).key } -Descending)
  $plan = @($shift | ForEach-Object {
      $p = Get-Title $_.title
      $parts = $p.n -split '\.'
      $parts[0] = [string]($p.whole + 1)
      $bad = Test-Writable ($parts -join '.')
      if ($bad) { Fail "insert M$at would rename $($_.title): $bad" }
      $np = @{ n = ($parts -join '.'); topic = $p.topic; version = $p.version }
      [pscustomobject]@{ number = $_.number; from = $_.title; to = (Format-Title $np); old = "M$(Format-Id $p.n)"; rx = "M0*$([regex]::Escape($p.n))" }
    })
  $moving = @($plan | ForEach-Object { $_.number })
  $taken = @($milestones | Where-Object { $moving -notcontains $_.number } | ForEach-Object { (Get-Title $_.title).n } | Where-Object { $_ })
  $final = @($plan | ForEach-Object { (Get-Title $_.to).n }) + @("$at")
  foreach ($id in $final) { if ($taken -contains $id) { Fail "M$id already exists (closed or not moved): insert M$at would collide; only open milestones can take an insert" } }
  $refs = [System.Collections.Generic.List[object]]::new()
  $common = & git rev-parse --git-common-dir 2>$null
  if ($LASTEXITCODE -ne 0) { $common = $null }
  foreach ($pl in $plan) {
    $rx = "(?<![A-Za-z0-9.])$($pl.rx)(?![0-9]|\.[0-9])"
    foreach ($i in (Get-Paged "repos/$Repo/issues?milestone=$($pl.number)&state=all&per_page=100" | Where-Object { $null -eq $_.pull_request })) {
      if ("$($i.body)" -cmatch $rx) { $refs.Add([ordered]@{ where = "issue #$($i.number)"; name = $pl.old; hint = 'issue body names the old milestone' }) }
    }
    if ((Test-Path ROADMAP.md) -and ((Get-Content -Raw ROADMAP.md) -cmatch $rx)) { $refs.Add([ordered]@{ where = 'ROADMAP.md'; name = $pl.old; hint = 'text names the old milestone' }) }
    if ($common) {
      $sf = @($pl.old, ($pl.old -replace '^M0+(?=[0-9])', 'M')) | ForEach-Object { Join-Path $common ".agents/state/release-review-$_.json" } | Where-Object { Test-Path $_ } | Select-Object -First 1
      if ($sf) { $refs.Add([ordered]@{ where = $sf; name = $pl.old; hint = 'release-review state of the old name' }) }
    }
  }
  $res = [ordered]@{ inserted = $false; dryRun = [bool]$DryRun; title = "M$('{0:D3}' -f $at)"; renames = @($plan | ForEach-Object { [ordered]@{ number = $_.number; from = $_.from; to = $_.to } }); references = @($refs) }
  if (-not $DryRun) {
    $done = [System.Collections.Generic.List[string]]::new()
    foreach ($pl in $plan) {
      $null = & gh api -X PATCH "repos/$Repo/milestones/$($pl.number)" -f "title=$($pl.to)" 2>$null
      if ($LASTEXITCODE -ne 0) { Fail "renaming milestone $($pl.from) to $($pl.to) failed (renamed so far: $($done -join ', '))" }
      $done.Add("$($pl.from) -> $($pl.to)")
    }
    $raw = & gh api -X POST "repos/$Repo/milestones" -f "title=M$('{0:D3}' -f $at)" 2>$null
    if ($LASTEXITCODE -ne 0) { Fail "creating milestone M$('{0:D3}' -f $at) failed (renamed so far: $($done -join ', '))" }
    $c = $raw | ConvertFrom-Json
    $res.inserted = $true
    $res.milestone = [ordered]@{ number = $c.number; title = $c.title; state = $c.state; url = $c.html_url }
    $rt = New-ReleaseTest $c
    if ($rt) { $res.releaseTest = $rt }
  }
  $res | ConvertTo-Json -Depth 5
  exit 0
}

if ($Mode -eq 'close') {
  if (-not $Name) { Fail 'close needs -Name <M<n>|x.y.z>' }
  $title = Get-Bare $Name
  $kind = (Get-Title $title).kind
  if (-not $kind -and $title -cnotmatch '^M[0-9]+ \(') { Fail "invalid milestone name '$Name': expected M<n> or x.y.z" }
  $m = Find-Milestone $milestones $title
  if (-not $m) { Fail "milestone '$title' not found" }
  $t = $null
  if ($MoveTo) {
    $target = Get-Bare $MoveTo
    if (-not (Get-Title $target).kind) { Fail "invalid -MoveTo '$MoveTo': expected M<n> or x.y.z" }
    $t = Find-Milestone $milestones $target
    if (-not $t) { Fail "target milestone '$target' not found; create it with /github-milestone create $target" }
    if ($t.state -ne 'open') { Fail "target milestone '$target' is closed" }
    if ($t.number -eq $m.number) { Fail 'target milestone is the milestone to close' }
  }
  $mk = (Get-Title $m.title).kind
  $ref = [ordered]@{ number = $m.number; title = $m.title; state = $m.state; url = $m.html_url }
  $result = [ordered]@{ closed = $false; milestone = $ref; moved = @(); openIssues = @() }
  if ($m.state -eq 'closed') { $result | ConvertTo-Json -Depth 5; exit 0 }
  $newTitle = $null
  if ($mk -eq 'numbered') {
    $ver = if ($Version) { Get-Bare $Version } else { $null }
    if ($ver -and -not (ConvertTo-Version $ver)) { Fail "invalid -Version '$Version': expected x.y.z" }
    $assigned = @($milestones | Where-Object { $_.number -ne $m.number } | ForEach-Object { (Get-Title $_.title).version } | Where-Object { $_ })
    if ($ver) {
      # several milestones may ship in one release: an explicit version already carried by another milestone is accepted
      $null = & gh api "repos/$Repo/git/ref/tags/v$ver" 2>$null
      if ($LASTEXITCODE -ne 0) { Fail "tag v$ver does not exist: release first, then close the milestone" }
    }
    else {
      $cand = @((Get-Paged "repos/$Repo/tags?per_page=100") | ForEach-Object { $_.name } | Where-Object { $_ -match '^v[0-9]+\.[0-9]+\.[0-9]+$' -and $assigned -notcontains $_.Substring(1) } |
          Sort-Object { [version]($_.Substring(1)) })
      if (-not $cand.Count) { Fail "no release tag without a milestone: release first, or pass -Version x.y.z to give this milestone the version of another one (one release can ship several milestones)" }
      $ver = $cand[-1].Substring(1)
    }
    $mt = Get-Title $m.title
    $newTitle = "M$(Format-Id $mt.n)$(if ($mt.topic) { " $($mt.topic)" }) ($ver)"
  }
  else {
    $title = $m.title
    $null = & gh api "repos/$Repo/git/ref/tags/v$title" 2>$null
    if ($LASTEXITCODE -ne 0) { Fail "tag v$title does not exist: release first, then close the milestone" }
  }
  $open = @(Get-Paged "repos/$Repo/issues?milestone=$($m.number)&state=open&per_page=100" | Where-Object { $null -eq $_.pull_request } | Sort-Object number |
      ForEach-Object { [ordered]@{ number = $_.number; title = $_.title } })
  if ($open.Count -and $t) {
    $repoArgs = if ($Repo -eq '{owner}/{repo}') { @() } else { @('--repo', $Repo) }
    $moved = [System.Collections.Generic.List[object]]::new()
    foreach ($i in $open) {
      $null = & gh issue edit $i.number --milestone $t.title @repoArgs 2>$null
      if ($LASTEXITCODE -ne 0) { Fail "moving #$($i.number) to milestone $target failed (moved so far: $(($moved | ForEach-Object { "#$($_.number)" }) -join ', '))" }
      $moved.Add($i)
    }
    $result.moved = $moved.ToArray()
    $open = @()
  }
  if ($open.Count) { $result.openIssues = $open; $result | ConvertTo-Json -Depth 5; exit 0 }
  $patch = @('-f', 'state=closed')
  if ($newTitle) { $patch += @('-f', "title=$newTitle") }
  $null = & gh api -X PATCH "repos/$Repo/milestones/$($m.number)" @patch 2>$null
  if ($LASTEXITCODE -ne 0) { Fail "closing milestone $($m.title) failed" }
  $ref.state = 'closed'
  if ($newTitle) { $ref.title = $newTitle; $result.version = $ver }
  $result.closed = $true
  $result | ConvertTo-Json -Depth 5
  exit 0
}

if ($Mode -eq 'assign') {
  if (-not $Name) { Fail 'assign needs -Name <M<n>|none>' }
  $nums = @("$Issues" -split '[,\s]+' | Where-Object { $_ } | ForEach-Object { if ($_ -match '^#?([0-9]+)$' -and [int]$Matches[1] -ge 1) { [int]$Matches[1] } else { Fail "invalid issue number '$_' in -Issues" } } | Select-Object -Unique)
  if (-not $nums.Count) { Fail 'assign needs -Issues <n,...>' }
  $target = $null
  if ($Name -cne 'none') {
    $bare = Get-Bare $Name
    if (-not (Get-Title $bare).kind) { Fail "invalid milestone name '$Name': expected M<n>, x.y.z or none" }
    $target = Find-Milestone $milestones $bare
    if (-not $target -and $DryRun) { $target = [pscustomobject]@{ number = $null; title = $bare; state = 'missing'; html_url = $null } }
    if (-not $target) { Fail "milestone '$Name' not found; create it first with /github-milestone create $bare" }
    if ($target.state -ne 'missing' -and $target.state -ne 'open') { Fail "milestone '$($target.title)' is closed: nothing was changed" }
  }
  $info = @{}
  foreach ($n in $nums) {
    $raw = & gh api "repos/$Repo/issues/$n" 2>$null
    if ($LASTEXITCODE -ne 0) { Fail "issue #$n not found: nothing was changed" }
    $o = $raw | Out-String | ConvertFrom-Json
    $info[$n] = [pscustomobject]@{
      number = $n; title = $o.title; repository_url = $o.repository_url; parent = $o.parent_issue_url
      current = $(if ($o.milestone) { [string]$o.milestone.title } else { [string]$null })
      labels = @($o.labels | ForEach-Object { if ($_ -is [string]) { $_ } else { $_.name } })
    }
  }
  $warnings = [System.Collections.Generic.List[object]]::new()
  $plannedMap = @{}
  if ($Planned) { $po = $Planned | ConvertFrom-Json; foreach ($pp in $po.PSObject.Properties) { $plannedMap[[string]$pp.Name] = [string]$pp.Value } }
  foreach ($n in $nums) {
    $i = $info[$n]
    if ($target) {
      if ($i.labels -contains 'objective') { Fail "issue #$n is an Objective: an Objective never has a milestone, nothing was changed" }
      if ($i.labels -contains 'epic') { Fail "issue #$n is an Epic: an Epic never has a milestone, nothing was changed" }
      if ($i.labels -notcontains 'feature') { continue }
      $sraw = & gh api "repos/$Repo/issues/$n/sub_issues?per_page=100" 2>$null
      if ($LASTEXITCODE -ne 0) { Fail "sub-issues of #$n not readable: nothing was changed" }
      $outside = @(@($sraw | Out-String | ConvertFrom-Json) | Where-Object { $_ -and $_.state -eq 'open' } | ForEach-Object {
          $foreign = $_.repository_url -and $i.repository_url -and $_.repository_url -ne $i.repository_url
          if ($foreign) { ($_.repository_url -replace '^.*/repos/', '') + "#$($_.number)" }
          elseif ($plannedMap.ContainsKey([string]$_.number)) { if ($plannedMap[[string]$_.number] -cne $target.title) { "#$($_.number)" } }
          elseif ($info.ContainsKey([int]$_.number)) { }
          elseif (-not ($_.milestone -and $_.milestone.title -eq $target.title)) { "#$($_.number)" }
        })
      if ($outside.Count) { Fail "Feature #$n gets a milestone only when all its PBIs are in it; outside: $($outside -join ', '): nothing was changed" }
    }
    elseif ($i.labels -contains 'pbi' -or $i.labels -contains 'bug') {
      $warnings.Add([ordered]@{ type = 'no-milestone'; number = $n; message = "warning: #$n has no milestone" })
      $pm = if ($i.parent) { [regex]::Match($i.parent, '/repos/(.+)/issues/([0-9]+)$') } else { $null }
      if ($pm -and $pm.Success -and $pm.Groups[1].Value -eq ($i.repository_url -replace '^.*/repos/', '') -and -not $info.ContainsKey([int]$pm.Groups[2].Value)) {
        $praw = & gh api "repos/$Repo/issues/$($pm.Groups[2].Value)" 2>$null
        if ($LASTEXITCODE -eq 0) {
          $po = $praw | Out-String | ConvertFrom-Json
          if ($po.milestone) {
            $warnings.Add([ordered]@{ type = 'feature-incomplete'; number = [int]$po.number; title = $po.title; outside = @([ordered]@{ number = $n; title = $i.title; milestone = 'none' }) })
          }
        }
      }
    }
  }
  $repoArgs = if ($Repo -eq '{owner}/{repo}') { @() } else { @('--repo', $Repo) }
  $assigned = foreach ($n in $nums) {
    $i = $info[$n]
    $newMs = $null
    if ($target) { $newMs = $target.title }
    $status = 'unchanged'
    if ("$($i.current)" -cne "$newMs") {
      $status = 'set'
      if (-not $DryRun) {
        $null = if ($newMs) { & gh issue edit $n --milestone $newMs @repoArgs 2>$null } else { & gh issue edit $n --remove-milestone @repoArgs 2>$null }
        if ($LASTEXITCODE -ne 0) { Fail "setting the milestone of #$n failed" }
      }
    }
    [ordered]@{ number = $n; previous = $(if ($i.current) { $i.current } else { $null }); milestone = $newMs; status = $status }
  }
  [ordered]@{ dryRun = [bool]$DryRun; milestone = $(if ($target) { [ordered]@{ number = $target.number; title = $target.title; state = $target.state; url = $target.html_url } } else { $null }); assigned = @($assigned); warnings = @($warnings) } | ConvertTo-Json -Depth 6
  exit 0
}

if ($Mode -eq 'issues') {
  if (-not $Name) { Fail 'issues needs -Name <milestone title>' }
  $m = Find-Milestone $milestones $Name
  if (-not $m) { Fail "milestone '$Name' not found" }
  $list = @(Get-Paged "repos/$Repo/issues?milestone=$($m.number)&state=$State&per_page=100" | Where-Object { $null -eq $_.pull_request } | Sort-Object number | ForEach-Object {
      $item = [ordered]@{
        number = $_.number; title = $_.title; state = $_.state; closed_at = $_.closed_at; body = $_.body
        labels = @($_.labels | ForEach-Object { $_.name }); assignees = @($_.assignees | ForEach-Object { $_.login })
      }
      if ($_.state -eq 'open') {
        # native blocked-by links: only the open blockers; a blocker in another repository keeps its owner/repo
        $sum = $_.issue_dependencies_summary
        $bl = @()
        if ($null -eq $sum -or [int]$sum.blocked_by -gt 0) {
          $iss = $_
          $bl = @(Get-Paged "repos/$Repo/issues/$($_.number)/dependencies/blocked_by" | Where-Object { $_.state -eq 'open' } | ForEach-Object {
              $b = [ordered]@{ number = $_.number }
              if ($_.repository_url -and $_.repository_url -ne $iss.repository_url) { $b.repository = $_.repository_url -replace '^.*/repos/', '' }
              $b
            })
        }
        $item.blockedBy = $bl
        # release-test: has the RC been posted on it (comment marker <!-- release-test-rc -->)
        if ($item.labels -contains 'release-test') {
          # a failed read counts as not posted
          $cm = & gh api "repos/$Repo/issues/$($_.number)/comments" --paginate --jq '.[].body' 2>$null
          $item.rcPosted = ($LASTEXITCODE -eq 0) -and (($cm | Out-String) -match '<!-- release-test-rc -->')
        }
      }
      $item
    })
  $nextM = @($milestones | Where-Object { $_.state -eq 'open' -and $_.number -ne $m.number } |
      Sort-Object @{ e = { $k = (Get-Title $_.title).kind; if ($k) { @{ legacy = 0; numbered = 1 }[$k] } else { 2 } } }, @{ e = { (Get-Title $_.title).key } }, @{ e = { ConvertTo-Version $_.title } }, @{ e = { $_.title } }) | Select-Object -First 1
  [ordered]@{ milestone = [ordered]@{ number = $m.number; title = $m.title; state = $m.state }; baseUrl = ($m.html_url -replace '/milestone/\d+/?$', ''); nextMilestone = $(if ($nextM) { $nextM.title } else { $null }); issues = $list } | ConvertTo-Json -Depth 6
  exit 0
}

$tags = @((Get-Paged "repos/$Repo/tags?per_page=100") | ForEach-Object { $_.name })
$released = @($tags | Where-Object { $_ -match '^v[0-9]+\.[0-9]+\.[0-9]+$' } | Sort-Object { [version]($_.Substring(1)) })
$latestTag = if ($released.Count) { $released[-1] } else { $null }

function Get-Summary($m) {
  $total = [int]$m.open_issues + [int]$m.closed_issues
  [ordered]@{
    number = $m.number; title = $m.title; state = $m.state; dueOn = $m.due_on
    open = [int]$m.open_issues; closed = [int]$m.closed_issues
    progress = if ($total) { [int][math]::Round(100 * [int]$m.closed_issues / $total) } else { 0 }
    tagged = $(
      $v = (Get-Title $m.title).version
      [bool]($v -and $tags -contains "v$v")
    ); url = $m.html_url
  }
}

function Get-ReleasePr {
  if (-not (Test-Path $ReleaseState)) { return $null }
  try {
    $raw = & $ReleaseState -Mode finish -Branch release/next 2>$null
    if ($LASTEXITCODE -ne 0 -or -not $raw) { return $null }
    $pr = ($raw | Out-String | ConvertFrom-Json).releasePr
    if ($pr) { [ordered]@{ number = $pr.number; url = $pr.url } } else { $null }
  }
  catch { $null }
}

function Get-Detail($m) {
  $d = Get-Summary $m
  $groups = [ordered]@{ ready = @(); blocked = @(); needsDecision = @(); needsRefinement = @(); claimed = @() }
  $issues = @(Get-Paged "repos/$Repo/issues?milestone=$($m.number)&state=open&per_page=100" | Where-Object { $null -eq $_.pull_request })
  # milestone rule (github-issue references/milestones.md): an Epic never has one; a Feature only when all its PBIs are in it
  $warnings = @()
  foreach ($i in ($issues | Sort-Object number)) {
    $kinds = @($i.labels | ForEach-Object { $_.name })
    if ($kinds -contains 'epic') { $warnings += , ([ordered]@{ type = 'epic-in-milestone'; number = $i.number; title = $i.title }) }
    elseif ($kinds -contains 'feature') {
      # a sub-issue from another repository is always outside: a milestone belongs to one repository
      $feature = $i
      $outside = @(Get-Paged "repos/$Repo/issues/$($i.number)/sub_issues?per_page=100" | Where-Object {
          $foreign = $_.repository_url -and $feature.repository_url -and $_.repository_url -ne $feature.repository_url
          $_.state -eq 'open' -and ($foreign -or $null -eq $_.milestone -or $_.milestone.number -ne $m.number)
        } | ForEach-Object {
          $o = [ordered]@{ number = $_.number; title = $_.title; milestone = $(if ($_.milestone) { $_.milestone.title } else { 'none' }) }
          if ($_.repository_url -and $feature.repository_url -and $_.repository_url -ne $feature.repository_url) { $o.repository = $_.repository_url -replace '^.*/repos/', '' }
          $o
        })
      if ($outside.Count) { $warnings += , ([ordered]@{ type = 'feature-incomplete'; number = $i.number; title = $i.title; outside = $outside }) }
    }
  }
  foreach ($i in ($issues | Sort-Object number)) {
    $labels = @($i.labels | ForEach-Object { $_.name })
    $assignees = @($i.assignees | ForEach-Object { $_.login })
    $item = [ordered]@{ number = $i.number; title = $i.title; assignees = $assignees }
    $sum = $i.issue_dependencies_summary
    $blockers = @()
    if ($null -eq $sum -or [int]$sum.blocked_by -gt 0) {
      $blockers = @(Get-Paged "repos/$Repo/issues/$($i.number)/dependencies/blocked_by" | Where-Object { $_.state -eq 'open' } |
          ForEach-Object {
            $b = [ordered]@{ number = $_.number; title = $_.title }
            # a blocker in another repository keeps its owner/repo, so #n never names a local issue
            if ($_.repository_url -and $_.repository_url -ne $i.repository_url) { $b.repository = $_.repository_url -replace '^.*/repos/', '' }
            $b
          })
    }
    $key = if ($labels -contains 'needs-decision') { 'needsDecision' }
    elseif ($labels -contains 'needs-refinement') { 'needsRefinement' }
    elseif ($blockers.Count) { 'blocked' }
    elseif ($assignees.Count) { 'claimed' }
    else { 'ready' }
    if ($key -eq 'blocked') { $item.blockers = $blockers }
    $groups[$key] += , $item
  }
  $d.issues = $groups
  $d.warnings = $warnings
  $d.releasePr = Get-ReleasePr
  $d
}

switch ($Mode) {
  'list' {
    $rank = @{ legacy = 0; numbered = 1 }
    $sorted = @($milestones | Sort-Object @{ e = { $k = (Get-Title $_.title).kind; if ($k) { $rank[$k] } else { 2 } } }, @{ e = { (Get-Title $_.title).key } }, @{ e = { ConvertTo-Version $_.title } }, @{ e = { $_.title } })
    [ordered]@{ latestTag = $latestTag; milestones = @($sorted | ForEach-Object { Get-Summary $_ }) } | ConvertTo-Json -Depth 6
  }
  'show' {
    if (-not $Name) { Fail 'show needs -Name <M<n>|x.y.z>' }
    $m = Find-Milestone $milestones $Name
    if (-not $m) { Fail "milestone '$Name' not found" }
    Get-Detail $m | ConvertTo-Json -Depth 8
  }
  'current' {
    $floor = if ($latestTag) { [version]$latestTag.Substring(1) } else { [version]'0.0.0' }
    $m = @($milestones | Where-Object { $_.state -eq 'open' -and (ConvertTo-Version $_.title) -gt $floor } | Sort-Object { ConvertTo-Version $_.title }) | Select-Object -First 1
    if (-not $m) { $m = @($milestones | Where-Object { $_.state -eq 'open' -and (Get-Title $_.title).kind -eq 'numbered' } | Sort-Object { (Get-Title $_.title).key }) | Select-Object -First 1 }
    if ($m) { [ordered]@{ latestTag = $latestTag; current = Get-Detail $m } | ConvertTo-Json -Depth 8 }
    else {
      $hint = "no open milestone M<n> (or x.y.z above $(if ($latestTag) { $latestTag } else { 'the first release' })); create one with /github-milestone create"
      [ordered]@{ latestTag = $latestTag; current = $null; hint = $hint } | ConvertTo-Json -Depth 4
    }
  }
}
