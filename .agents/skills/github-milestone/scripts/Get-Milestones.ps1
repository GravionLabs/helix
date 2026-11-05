<#
.SYNOPSIS
  Milestones of a repository as JSON (schema/milestones.schema.json) for the github-milestone skill.
.DESCRIPTION
  Milestone titles: `M<n>` or `M<n>.<m>[.<k>...]` (sub-number, sorts numerically per part between M<n> and M<n+1>: 1, 1.1, 1.2, 2, 10; lookup by `M1.1` is exact, `M1` never finds `M1.1`) or `M<n> <Topic>` while open (topic without parentheses), `M<n> [<Topic>] (x.y.z)` after close, and the legacy
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
.PARAMETER Mode
  current, list, show, create, issues, close, rename or insert.
.PARAMETER DryRun
  insert: list the renames and the references that need a manual check, write nothing.
.PARAMETER Name
  show, create, close, issues: M<n>, the full title, the version x.y.z (a leading v is dropped) or the title of a legacy milestone.
  create: M<n> or x.y.z; empty: the next free M number.
.PARAMETER To
  rename: the new title, M<n> [<Topic>] [(x.y.z)].
.PARAMETER Version
  close M<n>: the release version x.y.z for the new title; default the newest release tag not yet assigned to a milestone.
.PARAMETER MoveTo
  close: M<m> (or legacy x.y.z) of an existing open milestone that receives the open issues.
.PARAMETER State
  issues: open, closed or all (default).
.PARAMETER Repo
  owner/name; default: the repository of the current directory ({owner}/{repo} of gh).
.PARAMETER ReleaseState
  Path of Get-ReleaseState.ps1; default: the sibling github-release skill. Missing: releasePr is null.
#>
param(
  [Parameter(Mandatory)][ValidateSet('current', 'list', 'show', 'create', 'issues', 'close', 'rename', 'insert')][string]$Mode,
  [string]$Name,
  [string]$To,
  [string]$MoveTo,
  [switch]$DryRun,
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
# title -> @{ kind = 'numbered'|'legacy'|$null; n (id string: 1 or 1.1); key (sort key); whole (int before the first dot); topic; version } (version: of the parentheses, or the legacy title)
function Get-Title([string]$t) {
  if ($t -cmatch $numberedRx) { @{ kind = 'numbered'; n = $Matches[1]; key = (Get-NumKey $Matches[1]); whole = [int](($Matches[1] -split '\.')[0]); topic = $Matches[2]; version = $Matches[3] } }
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
    $hit = $all | Where-Object { $p = Get-Title $_.title; $p.kind -eq 'numbered' -and $p.version -eq $bare } | Select-Object -First 1
  }
  $hit
}

$milestones = @(Get-Paged "repos/$Repo/milestones?state=all&per_page=100")

if ($Mode -eq 'create') {
  if ($Name) {
    $title = Get-Bare $Name
    $pt = Get-Title $title
    if (-not $pt.kind -or ($pt.kind -eq 'numbered' -and $pt.version)) { Fail "invalid milestone name '$Name': expected M<n> [<Topic>] or x.y.z" }
  }
  else {
    $max = 0
    foreach ($x in $milestones) { $p = Get-Title $x.title; if ($p.kind -eq 'numbered' -and $p.whole -gt $max) { $max = $p.whole } }
    $title = "M$($max + 1)"
  }
  $existing = Find-Milestone $milestones $title
  $created = -not $existing
  if ($created) {
    $raw = & gh api -X POST "repos/$Repo/milestones" -f "title=$title" 2>$null
    if ($LASTEXITCODE -ne 0) { Fail "creating milestone $title failed" }
    $existing = $raw | ConvertFrom-Json
  }
  [ordered]@{ created = $created; milestone = [ordered]@{ number = $existing.number; title = $existing.title; state = $existing.state; url = $existing.html_url } } |
    ConvertTo-Json -Depth 4
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
  if ($from.kind -eq 'numbered' -and $from.n -ne $dest.n) { Fail "the number of $($m.title) stays M$($from.n): -To '$To' would change it" }
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
  $shift = @($milestones | Where-Object { $p = Get-Title $_.title; $_.state -eq 'open' -and $p.kind -eq 'numbered' -and $p.whole -ge $at } | Sort-Object { (Get-Title $_.title).key } -Descending)
  $plan = @($shift | ForEach-Object {
      $p = Get-Title $_.title
      $parts = $p.n -split '\.'
      $parts[0] = [string]($p.whole + 1)
      $to = "M$($parts -join '.')$(if ($p.topic) { " $($p.topic)" })$(if ($p.version) { " ($($p.version))" })"
      [pscustomobject]@{ number = $_.number; from = $_.title; to = $to; old = "M$($p.n)" }
    })
  $moving = @($plan | ForEach-Object { $_.number })
  $taken = @($milestones | Where-Object { $moving -notcontains $_.number } | ForEach-Object { (Get-Title $_.title).n } | Where-Object { $_ })
  $final = @($plan | ForEach-Object { (Get-Title $_.to).n }) + @("$at")
  foreach ($id in $final) { if ($taken -contains $id) { Fail "M$id already exists (closed or not moved): insert M$at would collide; only open milestones can take an insert" } }
  $refs = [System.Collections.Generic.List[object]]::new()
  $common = & git rev-parse --git-common-dir 2>$null
  if ($LASTEXITCODE -ne 0) { $common = $null }
  foreach ($pl in $plan) {
    $rx = "(?<![A-Za-z0-9.])$([regex]::Escape($pl.old))(?![0-9]|\.[0-9])"
    foreach ($i in (Get-Paged "repos/$Repo/issues?milestone=$($pl.number)&state=all&per_page=100" | Where-Object { $null -eq $_.pull_request })) {
      if ("$($i.body)" -cmatch $rx) { $refs.Add([ordered]@{ where = "issue #$($i.number)"; name = $pl.old; hint = 'issue body names the old milestone' }) }
    }
    if ((Test-Path ROADMAP.md) -and ((Get-Content -Raw ROADMAP.md) -cmatch $rx)) { $refs.Add([ordered]@{ where = 'ROADMAP.md'; name = $pl.old; hint = 'text names the old milestone' }) }
    if ($common) {
      $sf = Join-Path $common ".agents/state/release-review-$($pl.old).json"
      if (Test-Path $sf) { $refs.Add([ordered]@{ where = $sf; name = $pl.old; hint = 'release-review state of the old name' }) }
    }
  }
  $res = [ordered]@{ inserted = $false; dryRun = [bool]$DryRun; title = "M$at"; renames = @($plan | ForEach-Object { [ordered]@{ number = $_.number; from = $_.from; to = $_.to } }); references = @($refs) }
  if (-not $DryRun) {
    $done = [System.Collections.Generic.List[string]]::new()
    foreach ($pl in $plan) {
      $null = & gh api -X PATCH "repos/$Repo/milestones/$($pl.number)" -f "title=$($pl.to)" 2>$null
      if ($LASTEXITCODE -ne 0) { Fail "renaming milestone $($pl.from) to $($pl.to) failed (renamed so far: $($done -join ', '))" }
      $done.Add("$($pl.from) -> $($pl.to)")
    }
    $raw = & gh api -X POST "repos/$Repo/milestones" -f "title=M$at" 2>$null
    if ($LASTEXITCODE -ne 0) { Fail "creating milestone M$at failed (renamed so far: $($done -join ', '))" }
    $c = $raw | ConvertFrom-Json
    $res.inserted = $true
    $res.milestone = [ordered]@{ number = $c.number; title = $c.title; state = $c.state; url = $c.html_url }
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
      if ($assigned -contains $ver) { Fail "version $ver is already assigned to another milestone" }
      $null = & gh api "repos/$Repo/git/ref/tags/v$ver" 2>$null
      if ($LASTEXITCODE -ne 0) { Fail "tag v$ver does not exist: release first, then close the milestone" }
    }
    else {
      $cand = @((Get-Paged "repos/$Repo/tags?per_page=100") | ForEach-Object { $_.name } | Where-Object { $_ -match '^v[0-9]+\.[0-9]+\.[0-9]+$' -and $assigned -notcontains $_.Substring(1) } |
          Sort-Object { [version]($_.Substring(1)) })
      if (-not $cand.Count) { Fail "no release tag without a milestone: release first, or pass -Version x.y.z" }
      $ver = $cand[-1].Substring(1)
    }
    $mt = Get-Title $m.title
    $newTitle = "M$($mt.n)$(if ($mt.topic) { " $($mt.topic)" }) ($ver)"
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

if ($Mode -eq 'issues') {
  if (-not $Name) { Fail 'issues needs -Name <milestone title>' }
  $m = Find-Milestone $milestones $Name
  if (-not $m) { Fail "milestone '$Name' not found" }
  $list = @(Get-Paged "repos/$Repo/issues?milestone=$($m.number)&state=$State&per_page=100" | Where-Object { $null -eq $_.pull_request } | Sort-Object number | ForEach-Object {
      [ordered]@{
        number = $_.number; title = $_.title; state = $_.state; closed_at = $_.closed_at; body = $_.body
        labels = @($_.labels | ForEach-Object { $_.name }); assignees = @($_.assignees | ForEach-Object { $_.login })
      }
    })
  [ordered]@{ milestone = [ordered]@{ number = $m.number; title = $m.title; state = $m.state }; issues = $list } | ConvertTo-Json -Depth 6
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
