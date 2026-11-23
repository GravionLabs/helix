<#
.SYNOPSIS
  Sets the milestones of issues from an approved assignment and prints the result as JSON (schema/set-issue-milestones.schema.json).
.DESCRIPTION
  -Assignment: a JSON array [{ "issue": 12, "milestone": "M3" }] or the path of a file holding it. A milestone name is resolved as in the
  github-milestone skill: exact title, M<n> (finds `M3 Market data`), or legacy x.y.z. Everything is checked before the first write:
  invalid input, an unknown issue, a closed milestone or a break of the milestone rule (Epic, incomplete Feature) exits 1 and changes nothing. A missing M<n> is created (after the rule checks of all targets, which run as a dry run against it) with
  Get-Milestones.ps1 -Mode create of the sibling github-milestone skill. The assignment is
  written per target milestone by `Get-Milestones.ps1 -Mode assign` (dry run first), which gets the whole assignment as -Planned so the milestone rule holds over all targets; M1000 and M1.10 are refused up front; an issue already in the target milestone is skipped
  (status unchanged), the others are set (status set). A re-run therefore changes nothing.
.PARAMETER Assignment
  JSON array or file path.
.PARAMETER Repo
  owner/name; default: the repository of the current directory.
.PARAMETER MilestoneScript
  Path of Get-Milestones.ps1; default: the sibling github-milestone skill (installed: ../../github-milestone, repository: ../../../github/github-milestone).
#>
param(
  [Parameter(Mandatory)][string]$Assignment,
  [string]$Repo = '{owner}/{repo}',
  [string]$MilestoneScript = (@('../../github-milestone', '../../../github/github-milestone') | ForEach-Object { Join-Path $PSScriptRoot "$_/scripts/Get-Milestones.ps1" } | Where-Object { Test-Path $_ } | Select-Object -First 1)
)
$ErrorActionPreference = 'Stop'

function Fail([string]$m) { Write-Error $m -ErrorAction Continue; exit 1 }

if (-not $MilestoneScript -or -not (Test-Path $MilestoneScript)) { Fail "Get-Milestones.ps1 not found: $MilestoneScript" }
$text = if (Test-Path -PathType Leaf $Assignment) { Get-Content -Raw $Assignment } else { $Assignment }
try { $items = @($text | ConvertFrom-Json -NoEnumerate) } catch { Fail "-Assignment is not valid JSON: $($_.Exception.Message)" }
if ($items.Count -eq 1 -and $items[0] -is [System.Collections.IList]) { $items = @($items[0]) }

$semverRx = '^[0-9]+\.[0-9]+\.[0-9]+$'
$numberedRx = '^M([0-9]{1,8}(?:\.[0-9]{1,8}){0,7})(?: ([^()]+?))?(?: \(([0-9]+\.[0-9]+\.[0-9]+)\))?$'
function Get-Bare([string]$n) { $n -replace '^v(?=[0-9])', '' }
# number id by value: every part as [int] (M3 = M003, M011.1 = M11.1)
function Get-N([string]$t) { if ($t -cmatch $numberedRx) { (@($Matches[1] -split '\.' | ForEach-Object { [string][int]$_ })) -join '.' } else { $null } }
# canonical name: main number padded to 3 digits (M3 Topic -> M003 Topic), so equal numbers are equal names
function Get-Canon([string]$t) { if ($t -cmatch '^M([0-9]+)(?=[. ]|$)') { 'M' + ([int]$Matches[1]).ToString('000') + $t.Substring($Matches[0].Length) } else { $t } }
function Get-Ver([string]$t) { if ($t -cmatch $numberedRx) { $Matches[3] } else { $null } }
# same lookup as github-milestone: exact title, M<n> by number, version in the parentheses
function Find-Milestone($all, [string]$name) {
  $bare = Get-Bare $name
  $hit = $all | Where-Object { $_.title -eq $name -or $_.title -eq $bare } | Select-Object -First 1
  if (-not $hit -and $bare -cmatch $numberedRx -and -not $Matches[3]) {
    $n = Get-N $bare
    $hit = $all | Where-Object { (Get-N $_.title) -eq $n } | Select-Object -First 1
  }
  if (-not $hit -and $bare -match $semverRx) { $hit = $all | Where-Object { (Get-Ver $_.title) -eq $bare } | Select-Object -First 1 }
  $hit
}

$pairs = [System.Collections.Generic.List[object]]::new()
$seen = @{}
foreach ($it in $items) {
  $nr = $it.issue -as [int]
  $name = [string]$it.milestone
  if (-not $nr -or $nr -lt 1 -or -not $name) { Fail 'each assignment needs an integer "issue" and a "milestone" name' }
  $bare = Get-Bare $name
  $valid = ($bare -cmatch $numberedRx -and -not $Matches[3]) -or $bare -match $semverRx
  if (-not $valid) { Fail "invalid milestone name '$name': expected M<n> [<Topic>] or x.y.z" }
  if ($bare -cmatch $numberedRx) {
    $ids = @($Matches[1] -split '\.' | ForEach-Object { [int]$_ })
    if ($ids[0] -gt 999 -or $ids.Count -gt 2 -or ($ids.Count -eq 2 -and $ids[1] -gt 9)) { Fail "milestone name '$name' is not writable: main number up to 999, one sub level 1..9: nothing was changed" }
  }
  if ($seen.ContainsKey($nr)) { Fail "issue #$nr appears twice in the assignment" }
  $seen[$nr] = $true
  $pairs.Add([pscustomobject]@{ issue = $nr; name = (Get-Canon $bare) })
}
if (-not $pairs.Count) { Fail 'the assignment is empty' }

$list = & $MilestoneScript -Mode list -Repo $Repo
if ($LASTEXITCODE -ne 0) { Fail 'reading the milestones failed' }
$all = @(($list | Out-String | ConvertFrom-Json).milestones)

# resolve: all checks before the first write
$targets = [ordered]@{}
foreach ($name in ($pairs.name | Select-Object -Unique)) {
  $m = Find-Milestone $all $name
  if ($m -and $m.state -ne 'open') { Fail "milestone '$($m.title)' is closed: nothing was changed" }
  $targets[$name] = if ($m) { $m.title } else { $null }
}
foreach ($p in $pairs) {
  $null = & gh api "repos/$Repo/issues/$($p.issue)" 2>$null
  if ($LASTEXITCODE -ne 0) { Fail "issue #$($p.issue) not found: nothing was changed" }
}

# the milestone rule (Epic, Feature) is checked by github-milestone: Get-Milestones.ps1 -Mode assign, per target milestone
function Invoke-Assign([string]$title, [bool]$dry) {
  $nrs = ($pairs | Where-Object { ($targets[$_.name] ?? $_.name) -eq $title } | ForEach-Object { $_.issue }) -join ','
  # the whole assignment (issue -> target title), so a Feature's sub-issue sent to another target counts as outside
  $planned = [ordered]@{}
  foreach ($q in $pairs) { $planned["$($q.issue)"] = [string]($targets[$q.name] ?? $q.name) }
  $extra = @{ DryRun = $dry; Planned = ($planned | ConvertTo-Json -Compress) }
  $out = & $MilestoneScript -Mode assign -Name $title -Issues $nrs -Repo $Repo @extra
  if ($LASTEXITCODE -ne 0) { Fail "assigning to milestone $title failed: see above" }
  @(($out | Out-String | ConvertFrom-Json).assigned)
}
# dry run for the existing targets first: a refused assignment changes nothing, not even in an earlier target
# a missing target is checked too (assign -DryRun plans against it), before anything is created
foreach ($name in @($targets.Keys)) { $null = Invoke-Assign $(if ($targets[$name]) { $targets[$name] } else { $name }) $true }

$created = [System.Collections.Generic.List[string]]::new()
foreach ($name in @($targets.Keys)) {
  if ($targets[$name]) { continue }
  $out = & $MilestoneScript -Mode create -Name $name -Repo $Repo
  if ($LASTEXITCODE -ne 0) { Fail "creating milestone $name failed" }
  $targets[$name] = ($out | Out-String | ConvertFrom-Json).milestone.title
  $created.Add($targets[$name])
}

$status = @{}
foreach ($t in ($targets.Values | Select-Object -Unique)) {
  foreach ($a in (Invoke-Assign $t $false)) { $status[[int]$a.number] = $a.status }
}
$results = foreach ($p in $pairs) { [ordered]@{ issue = $p.issue; milestone = $targets[$p.name]; status = $status[$p.issue] } }
[ordered]@{ created = @($created); results = @($results) } | ConvertTo-Json -Depth 5
