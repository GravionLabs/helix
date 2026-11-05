<#
.SYNOPSIS
  Evaluates the `governance` key of `.agents/config.json` against the changed files of `git diff --name-status <Base>...<Head>`
  and prints JSON: `{ "governance": false }` without the key, else `governance`, `adr` (`matched`, `adrFiles`) and `spec`
  (one entry per `specMap` glob: `glob`, `spec`, `changedFiles`, `specChanged`). Rules: references/governance.md.
.DESCRIPTION
  Glob semantics (as the CI checks ci#94/ci#95): paths are relative to the repository root with `/` separators;
  `**` matches any characters including `/` (`**/` also matches no directory), `*` any characters except `/`, `?` one character except `/`.
  Renames count with their new path, deletions count as changed. Test files and `.md` files are not counted for `spec`.
.PARAMETER Base
  Base ref of the diff (default origin/release/next).
.PARAMETER Head
  Head ref of the diff (default HEAD); pass `origin/<branch>` to check a branch that is not checked out.
#>
[CmdletBinding()]
param([string]$Base = 'origin/release/next', [string]$Head = 'HEAD')
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function ConvertTo-GlobRegex([string]$Glob) {
  $sb = [System.Text.StringBuilder]::new('^')
  $i = 0
  while ($i -lt $Glob.Length) {
    $c = $Glob[$i]
    if ($c -eq '*') {
      if ($i + 1 -lt $Glob.Length -and $Glob[$i + 1] -eq '*') {
        if ($i + 2 -lt $Glob.Length -and $Glob[$i + 2] -eq '/') { [void]$sb.Append('(?:.*/)?'); $i += 3 } else { [void]$sb.Append('.*'); $i += 2 }
        continue
      }
      [void]$sb.Append('[^/]*')
    } elseif ($c -eq '?') { [void]$sb.Append('[^/]') } else { [void]$sb.Append([regex]::Escape([string]$c)) }
    $i++
  }
  [void]$sb.Append('$')
  $sb.ToString()
}
function Test-Glob([string]$Glob, [string]$Path) { $Path -match (ConvertTo-GlobRegex $Glob) }
# Case-sensitive (-cmatch) and anchored to a name or folder boundary: latest.ts and Contest.cs are source (#99)
function Test-TestOrDoc([string]$Path) {
  $Path -match '\.md$' -or $Path -cmatch '(^|/)(tests?|Tests?|__tests__)/' -or $Path -cmatch '[._](test|spec)\.[^./]+$' -or
  $Path -cmatch '(^|/)test_[^/]*$' -or $Path -cmatch 'Tests?\.cs$' -or $Path -cmatch '\.Tests?/'
}

$top = (& git rev-parse --show-toplevel 2>$null)
if ($LASTEXITCODE -ne 0 -or -not $top) { $top = (Get-Location).Path }
$configPath = Join-Path $top '.agents/config.json'
$gov = $null
if (Test-Path -LiteralPath $configPath) {
  $cfg = Get-Content -Raw -LiteralPath $configPath | ConvertFrom-Json -AsHashtable
  if ($cfg.ContainsKey('governance') -and $cfg['governance'] -is [System.Collections.IDictionary]) { $gov = $cfg['governance'] }
}
if (-not $gov) { '{ "governance": false }'; exit 0 }
function Get-Key([string]$Name, $Default) { if ($gov.ContainsKey($Name) -and $null -ne $gov[$Name]) { $gov[$Name] } else { $Default } }

$adrDir = ([string](Get-Key 'adrDir' 'docs/adr')).Trim('/')
$adrPaths = @(Get-Key 'adrPaths' @())
$specMap = Get-Key 'specMap' @{}

$lines = @(& git -C $top diff --name-status -M "$Base...$Head")
if ($LASTEXITCODE -ne 0) { throw "git diff $Base...$Head failed" }
$changed = [System.Collections.Generic.List[string]]::new()
$present = [System.Collections.Generic.List[string]]::new() # added, changed, renamed (not deleted)
foreach ($l in $lines) {
  if (-not $l) { continue }
  $parts = $l -split "`t"
  $path = $parts[-1]
  $changed.Add($path)
  if (-not $parts[0].StartsWith('D')) { $present.Add($path) }
}

$matched = @($changed | Where-Object { $p = $_; $adrPaths | Where-Object { Test-Glob $_ $p } | Select-Object -First 1 } | Sort-Object -Unique)
$adrFiles = @($present | Where-Object { $_ -match ('^' + [regex]::Escape($adrDir) + '/[^/]+\.md$') } | Sort-Object -Unique)
$spec = @(foreach ($glob in $specMap.Keys) {
    $specFile = [string]$specMap[$glob]
    $files = @($changed | Where-Object { (Test-Glob $glob $_) -and -not (Test-TestOrDoc $_) } | Sort-Object -Unique)
    [ordered]@{ glob = $glob; spec = $specFile; changedFiles = $files; specChanged = [bool]($changed -contains $specFile) }
  })

[ordered]@{ governance = $true; adr = [ordered]@{ matched = $matched; adrFiles = $adrFiles }; spec = $spec } | ConvertTo-Json -Depth 6
