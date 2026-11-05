<#
.SYNOPSIS
  State for the roadmap skill as JSON (schema/roadmap-state.schema.json): open Epics, Features, PBIs and Bugs plus the milestones with progress.
.DESCRIPTION
  Read-only: only `gh api` GET calls (REST). Issues: one paginated read of the open issues (pull requests filtered out); the level
  comes from the label epic, feature, pbi or bug (issues without one are left out). parent: the native sub-issue parent
  (GET issues/<nr>/parent, none: null). blockedBy: the open native blockers, a number per local blocker and a string `owner/repo#n` per blocker in another repository (GET issues/<nr>/dependencies/blocked_by).
  size: S, M or L from a body line `Size: <S|M|L>` or a label `size:<S|M|L>`, otherwise null. milestone: the title or null.
  milestones: Get-Milestones.ps1 -Mode list of the sibling github-milestone skill (M<n>, M<n> (x.y.z) and legacy x.y.z titles).
  Closed milestones also carry issues[] (number, title) of their closed issues (one more GET per closed milestone), for the Done sections of ROADMAP.md.
.PARAMETER Repo
  owner/name; default: the repository of the current directory.
.PARAMETER MilestoneScript
  Path of Get-Milestones.ps1; default: the sibling github-milestone skill (installed: ../../github-milestone, repository: ../../../github/github-milestone).
#>
param(
  [string]$Repo = '{owner}/{repo}',
  [string]$MilestoneScript = (@('../../github-milestone', '../../../github/github-milestone') | ForEach-Object { Join-Path $PSScriptRoot "$_/scripts/Get-Milestones.ps1" } | Where-Object { Test-Path $_ } | Select-Object -First 1)
)
$ErrorActionPreference = 'Stop'

function Fail([string]$m) { Write-Error $m -ErrorAction Continue; exit 1 }

function Add-Leaf($list, $x) {
  if ($x -is [System.Collections.IList]) { foreach ($e in $x) { Add-Leaf $list $e } }
  elseif ($null -ne $x) { $list.Add($x) }
}
function Get-Paged([string]$path) {
  $raw = & gh api $path --paginate --slurp 2>$null
  if ($LASTEXITCODE -ne 0) { Fail "gh api $path failed" }
  $items = [System.Collections.Generic.List[object]]::new()
  Add-Leaf $items ($raw | Out-String | ConvertFrom-Json -NoEnumerate)
  $items.ToArray()
}

if (-not $MilestoneScript -or -not (Test-Path $MilestoneScript)) { Fail "Get-Milestones.ps1 not found: $MilestoneScript" }

$levels = @('epic', 'feature', 'pbi', 'bug')
$issues = foreach ($i in (Get-Paged "repos/$Repo/issues?state=open&per_page=100")) {
  if ($i.pull_request) { continue }
  $labels = @($i.labels | ForEach-Object { if ($_ -is [string]) { $_ } else { $_.name } })
  $level = $levels | Where-Object { $labels -contains $_ } | Select-Object -First 1
  if (-not $level) { continue }
  $size = $null
  if ($i.body -match '(?m)^\s*Size:\s*([SML])\b') { $size = $Matches[1] }
  elseif ($labels | Where-Object { $_ -match '^size[:/]([SML])$' }) { $size = $Matches[1] }

  $parent = $null
  $p = & gh api "repos/$Repo/issues/$($i.number)/parent" 2>$null
  if ($LASTEXITCODE -eq 0 -and $p) { $parent = [int]($p | Out-String | ConvertFrom-Json).number }

  $raw = & gh api "repos/$Repo/issues/$($i.number)/dependencies/blocked_by" 2>$null
  $blocked = @()
  if ($LASTEXITCODE -eq 0 -and $raw) {
    $blocked = @(($raw | Out-String | ConvertFrom-Json) | Where-Object { $_.state -eq 'open' } | ForEach-Object {
        # a blocker in another repository keeps its repository (owner/repo#n), so #n never names a local issue
        if ($_.repository_url -and $i.repository_url -and $_.repository_url -ne $i.repository_url) { ($_.repository_url -replace '^.*/repos/', '') + "#$([int]$_.number)" }
        else { [int]$_.number }
      })
  }

  [ordered]@{
    number    = [int]$i.number
    level     = $level
    title     = $i.title
    size      = $size
    labels    = $labels
    parent    = $parent
    blockedBy = $blocked
    milestone = if ($i.milestone) { $i.milestone.title } else { $null }
    url       = $i.html_url
  }
}

$listRaw = & pwsh -NoProfile -File $MilestoneScript -Mode list -Repo $Repo
if ($LASTEXITCODE -ne 0) { Fail 'Get-Milestones.ps1 -Mode list failed' }
$list = $listRaw | Out-String | ConvertFrom-Json

$milestones = foreach ($m in @($list.milestones)) {
  if ($m.state -ne 'closed') { $m; continue }
  $done = @(Get-Paged "repos/$Repo/issues?milestone=$($m.number)&state=closed&per_page=100" |
      Where-Object { $null -eq $_.pull_request } | Sort-Object number |
      ForEach-Object { [ordered]@{ number = [int]$_.number; title = $_.title } })
  $m | Add-Member -NotePropertyName issues -NotePropertyValue $done -Force -PassThru
}

[ordered]@{
  issues     = @($issues | Sort-Object { $_.number })
  milestones = @($milestones)
  latestTag  = $list.latestTag
} | ConvertTo-Json -Depth 8
