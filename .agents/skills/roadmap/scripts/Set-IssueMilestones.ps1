<#
.SYNOPSIS
  Sets the milestones of issues from an approved assignment and prints the result as JSON (schema/set-issue-milestones.schema.json).
.DESCRIPTION
  -Assignment: a JSON array [{ "issue": 12, "milestone": "M3" }] or the path of a file holding it. A milestone name is resolved as in the
  github-milestone skill: exact title, M<n> (finds `M3 Market data`), or legacy x.y.z. Everything is checked before the first write:
  invalid input, an unknown issue or a closed milestone exits 1 and changes nothing. A missing M<n> is created with
  Get-Milestones.ps1 -Mode create of the sibling github-milestone skill. An issue already in the target milestone is skipped
  (status unchanged); the others get `gh issue edit --milestone` (status set). A re-run therefore changes nothing.
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
function Get-N([string]$t) { if ($t -cmatch $numberedRx) { $Matches[1] } else { $null } }
function Get-Ver([string]$t) { if ($t -cmatch $numberedRx) { $Matches[3] } else { $null } }
# same lookup as github-milestone: exact title, M<n> by number, version in the parentheses
function Find-Milestone($all, [string]$name) {
  $bare = Get-Bare $name
  $hit = $all | Where-Object { $_.title -eq $name -or $_.title -eq $bare } | Select-Object -First 1
  if (-not $hit -and $bare -cmatch $numberedRx -and -not $Matches[3]) {
    $n = $Matches[1]
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
  if ($seen.ContainsKey($nr)) { Fail "issue #$nr appears twice in the assignment" }
  $seen[$nr] = $true
  $pairs.Add([pscustomobject]@{ issue = $nr; name = $bare })
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
$current = @{}
foreach ($p in $pairs) {
  $raw = & gh api "repos/$Repo/issues/$($p.issue)" 2>$null
  if ($LASTEXITCODE -ne 0) { Fail "issue #$($p.issue) not found: nothing was changed" }
  $ms = ($raw | Out-String | ConvertFrom-Json).milestone
  $current[$p.issue] = if ($ms) { $ms.title } else { $null }
}

$created = [System.Collections.Generic.List[string]]::new()
foreach ($name in @($targets.Keys)) {
  if ($targets[$name]) { continue }
  $out = & $MilestoneScript -Mode create -Name $name -Repo $Repo
  if ($LASTEXITCODE -ne 0) { Fail "creating milestone $name failed" }
  $targets[$name] = ($out | Out-String | ConvertFrom-Json).milestone.title
  $created.Add($targets[$name])
}

$repoArgs = if ($Repo -eq '{owner}/{repo}') { @() } else { @('--repo', $Repo) }
$results = foreach ($p in $pairs) {
  $title = $targets[$p.name]
  $status = 'unchanged'
  if ($current[$p.issue] -ne $title) {
    $null = & gh issue edit $p.issue --milestone $title @repoArgs 2>$null
    if ($LASTEXITCODE -ne 0) { Fail "setting milestone $title on #$($p.issue) failed" }
    $status = 'set'
  }
  [ordered]@{ issue = $p.issue; milestone = $title; status = $status }
}
[ordered]@{ created = @($created); results = @($results) } | ConvertTo-Json -Depth 5
