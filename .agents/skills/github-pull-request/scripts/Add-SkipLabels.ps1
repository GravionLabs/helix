<#
.SYNOPSIS
  Copies the governance skip labels of an issue onto its pull request (REST), as JSON { existing, added, missing, errors }.
.DESCRIPTION
  Without -Pr it only looks up (no POST): `existing` are the labels to pass to `gh pr create --label`.
  With -Pr it also POSTs the existing ones to the PR (fallback). Reads governance.skipLabels of .agents/config.json (default ["skip-adr"] when the governance key exists;
  no governance key or no config: nothing happens). Of the -IssueLabel values only those in skipLabels are
  copied. A label that does not exist in the repository is listed in `missing` and never created. The CI
  check `adr` reads only the labels of the PR, so look up before `gh pr create` and pass `--label`.
  Only a 404 counts as missing; other lookup failures are listed in `errors`.
.PARAMETER Pr
  Pull request number; 0 (default) = lookup only.
.PARAMETER IssueLabel
  Label names of the issue.
.PARAMETER Config
  Path of .agents/config.json; default: the one at the git top level (or the current directory).
.PARAMETER Repo
  owner/name; default: the repository of the current directory ({owner}/{repo} of gh).
#>
param(
  [int]$Pr = 0,
  [string[]]$IssueLabel = @(),
  [string]$Config,
  [string]$Repo = '{owner}/{repo}'
)
$ErrorActionPreference = 'Stop'

# The result is always the JSON line; any unexpected failure is stderr plus a non-zero exit, never help text.
try {
  if (-not $Config) {
    $top = (& git rev-parse --show-toplevel 2>$null)
    if ($LASTEXITCODE -ne 0 -or -not $top) { $top = (Get-Location).Path }
    $Config = Join-Path $top '.agents/config.json'
  }
  $skip = @()
  if (Test-Path -LiteralPath $Config) {
    $cfg = Get-Content -Raw -LiteralPath $Config | ConvertFrom-Json -AsHashtable
    $gov = $cfg['governance']
    if ($gov -is [System.Collections.IDictionary]) {
      $skip = if ($null -ne $gov['skipLabels']) { @($gov['skipLabels']) } else { @('skip-adr') }
    }
  }
  $wanted = @($IssueLabel | ForEach-Object { $_ -split ',' } | Where-Object { $_ -and ($skip -contains $_) } | Select-Object -Unique)
  $existing = @()
  $missing = @()
  $errors = @()
  foreach ($l in $wanted) {
    $out = & gh api "repos/$Repo/labels/$([uri]::EscapeDataString($l))" 2>&1
    if ($LASTEXITCODE -eq 0) { $existing += $l }
    elseif (($out | Out-String) -match '404|Not Found') { $missing += $l }
    else { $errors += "skip label lookup failed: $l ($((($out | Out-String).Trim())))" }
  }
  $added = @()
  if ($Pr -gt 0 -and $existing.Count -gt 0) {
    $ghArgs = @('api', '-X', 'POST', "repos/$Repo/issues/$Pr/labels") + @($existing | ForEach-Object { '-f'; "labels[]=$_" })
    & gh @ghArgs 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) { $added = $existing } else { $errors += "skip labels not added: POST labels of PR $Pr failed" }
  }
  if ($errors.Count -gt 0) { $errors | ForEach-Object { Write-Error $_ -ErrorAction Continue } }
  [ordered]@{ existing = $existing; added = $added; missing = $missing; errors = $errors } | ConvertTo-Json -Compress
  if ($errors.Count -gt 0) { exit 1 }
} catch {
  Write-Error "Add-SkipLabels failed: $($_.Exception.Message)" -ErrorAction Continue
  exit 1
}
