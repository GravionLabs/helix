<#
.SYNOPSIS
  Adds the deliver-loop shell function to a shell profile (zsh, bash or PowerShell).
.DESCRIPTION
  Writes the function between "# >>> deliver-loop >>>" markers, so a second run changes nothing
  (action "unchanged") and an outdated block is replaced ("update"). -DryRun prints the change only.
  Output is JSON: dryRun, shell, profile, action (add|update|unchanged), block (dry run only).
.PARAMETER Shell
  zsh, bash or pwsh. Default: from $env:SHELL, else pwsh.
.PARAMETER ProfilePath
  Profile file to edit. Default: ~/.zshrc, ~/.bashrc or the PowerShell profile.
.PARAMETER DryRun
  Print the change, write nothing.
#>
[CmdletBinding()]
param(
  [ValidateSet('zsh', 'bash', 'pwsh')][string]$Shell,
  [string]$ProfilePath,
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

if (-not $Shell) {
  $leaf = if ($env:SHELL) { Split-Path -Leaf $env:SHELL } else { '' }
  $Shell = if ($leaf -in 'zsh', 'bash') { $leaf } else { 'pwsh' }
}
if (-not $ProfilePath) {
  $ProfilePath = switch ($Shell) {
    'zsh' { Join-Path $HOME '.zshrc' }
    'bash' { Join-Path $HOME '.bashrc' }
    default { [string]$PROFILE }
  }
}

$ext = if ($Shell -eq 'pwsh') { 'ps1' } else { 'sh' }
$template = Join-Path $PSScriptRoot "../templates/deliver-loop.$ext"
$begin = '# >>> deliver-loop >>>'
$end = '# <<< deliver-loop <<<'
$body = ((Get-Content -Raw -LiteralPath $template) -replace "`r`n", "`n").TrimEnd()
$block = "$begin`n$body`n$end"

$current = ''
if (Test-Path -LiteralPath $ProfilePath -PathType Leaf) { $current = (Get-Content -Raw -LiteralPath $ProfilePath) -replace "`r`n", "`n" }
$rx = [regex]::new('(?s)' + [regex]::Escape($begin) + '.*?' + [regex]::Escape($end))
$m = $rx.Match($current)
if ($m.Success) {
  if ($m.Value -ceq $block) { $action = 'unchanged'; $new = $current }
  else { $action = 'update'; $new = $current.Substring(0, $m.Index) + $block + $current.Substring($m.Index + $m.Length) }
}
else {
  $action = 'add'
  $sep = if (-not $current) { '' } elseif ($current.EndsWith("`n")) { "`n" } else { "`n`n" }
  $new = $current + $sep + $block + "`n"
}

if ($action -ne 'unchanged' -and -not $DryRun) {
  $parent = Split-Path -Parent $ProfilePath
  if ($parent -and -not (Test-Path -LiteralPath $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
  [System.IO.File]::WriteAllText($ProfilePath, $new, [System.Text.UTF8Encoding]::new($false))
}

$shown = if ($DryRun -and $action -ne 'unchanged') { $block } else { $null }
[ordered]@{ dryRun = [bool]$DryRun; shell = $Shell; profile = $ProfilePath; action = $action; block = $shown } | ConvertTo-Json
