<#
.SYNOPSIS
  Creates the next architecture decision record from templates/adr.md and prints its path.
.DESCRIPTION
  Directory: `governance.adrDir` of `.agents/config.json` in the current directory, default `docs/adr` (created when missing).
  Number: highest `NNNN-*.md` + 1 (gaps are not filled), four digits. Status is Proposed. Never overwrites a file.
  -Supersedes writes `- Supersedes: [ADR nnnn](<old file>)` into the new file only and prints the old path as a second line;
  the old ADR's Status is updated by hand.
.PARAMETER Title
  Title of the decision; the slug of the file name is derived from it.
.PARAMETER Issue
  Issue number, written as `- Issues: #<n>`.
.PARAMETER Supersedes
  Number (nnnn) of the ADR this one supersedes; an unknown number is an error.
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$Title,
  [int]$Issue,
  [string]$Supersedes
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Fail([string]$Message) {
  Write-Error "New-Adr: $Message" -ErrorAction Continue
  exit 1
}

$dir = 'docs/adr'
$configPath = Join-Path (Get-Location) '.agents/config.json'
if (Test-Path -LiteralPath $configPath) {
  try { $config = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json }
  catch { Fail "invalid JSON in $configPath" }
  $gov = $config.PSObject.Properties['governance']
  if ($gov -and $gov.Value.PSObject.Properties['adrDir'] -and $gov.Value.adrDir) { $dir = [string]$gov.Value.adrDir }
}

$slug = ($Title.ToLowerInvariant() -replace '[^a-z0-9]+', '-').Trim('-')
if (-not $slug) { Fail 'the title has no letters or digits for a file name' }

New-Item -ItemType Directory -Force -Path $dir | Out-Null
$existing = @(Get-ChildItem -LiteralPath $dir -File -Filter '*.md' | Where-Object { $_.Name -match '^\d{4}-.+\.md$' })
$max = 0
foreach ($f in $existing) { $n = [int]$f.Name.Substring(0, 4); if ($n -gt $max) { $max = $n } }
$number = '{0:D4}' -f ($max + 1)

$links = ''
$oldPath = $null
if ($Supersedes) {
  if ($Supersedes -notmatch '^\d{1,4}$') { Fail "-Supersedes expects an ADR number, got '$Supersedes'" }
  $old = '{0:D4}' -f [int]$Supersedes
  $match = $existing | Where-Object { $_.Name.StartsWith("$old-") } | Select-Object -First 1
  if (-not $match) { Fail "ADR $old does not exist in $dir" }
  $oldPath = Join-Path $dir $match.Name
  $links += "`n- Supersedes: [ADR $old]($($match.Name))"
}
if ($Issue) { $links = "`n- Issues: #$Issue" + $links }

$template = (Get-Content -LiteralPath (Join-Path $PSScriptRoot '../templates/adr.md') -Raw) -replace "`r`n", "`n"
$body = $template.Replace('{{NUMBER}}', $number).Replace('{{TITLE}}', $Title).Replace('{{DATE}}', (Get-Date -Format 'yyyy-MM-dd'))
$body = $body.Replace("{{LINKS}}", $links)

$target = Join-Path $dir "$number-$slug.md"
if (Test-Path -LiteralPath $target) { Fail "$target exists, not overwriting" }
[IO.File]::WriteAllText((Join-Path (Get-Location) $target), $body, [Text.UTF8Encoding]::new($false))
Write-Output $target
if ($oldPath) { Write-Output $oldPath }
