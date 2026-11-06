<#
.SYNOPSIS
  Starts Invoke-DeliverLoop.ps1 in its own herdr workspace "<repo> · deliver" (tab "deliver-loop").
.DESCRIPTION
  Called by the deliver-loop shell shim in herdr (HERDR_ENV=1). The herdr sidebar shows one state per
  workspace by the selected tab, so the loop gets a workspace of its own instead of a tab beside the
  agent session. All other arguments go to Invoke-DeliverLoop.ps1. Exit 0 once the command is queued,
  1 when herdr fails (the shim then runs the loop in the current terminal).
.PARAMETER ShimCwd
  Repository directory; the workspace and the loop start there.
.PARAMETER ShimScript
  Full path of the installed Invoke-DeliverLoop.ps1.
.PARAMETER PaneShell
  Shell of the new pane, which decides the quoting of the command line: sh, bash, zsh, dash, ksh, fish (POSIX single
  quotes) or pwsh, powershell (doubled single quotes). Default: DELIVER_LOOP_PANE_SHELL, else the name of $env:SHELL,
  else pwsh on Windows and sh elsewhere. Any other shell (cmd, nu, ...) exits 1 with a message before herdr is called, so the shim runs
  the loop in the current terminal.
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$ShimCwd,
  [Parameter(Mandatory)][string]$ShimScript,
  [string]$PaneShell = '',
  [Parameter(ValueFromRemainingArguments)][string[]]$LoopArgs = @()
)

$ErrorActionPreference = 'Stop'

function Get-Id($o, [string]$name) {
  foreach ($k in @("${name}_id", 'id')) { if ($o.PSObject.Properties[$k]) { return [string]$o.$k } }
  return [string]$o
}

function Get-QuoteStyle([string]$shell) {
  if (-not $shell) { $shell = $env:DELIVER_LOOP_PANE_SHELL }
  if (-not $shell) { $shell = if ($env:SHELL) { $env:SHELL } elseif ($IsWindows) { 'pwsh' } else { 'sh' } }
  $name = [IO.Path]::GetFileNameWithoutExtension(($shell -replace '\\', '/').TrimEnd('/').Split('/')[-1]).ToLowerInvariant()
  if ($name -in 'sh', 'bash', 'zsh', 'dash', 'ksh', 'fish') { return 'posix' }
  if ($name -in 'pwsh', 'powershell') { return 'pwsh' }
  throw "unsupported pane shell '$shell' (supported: sh, bash, zsh, dash, ksh, fish, pwsh, powershell; set DELIVER_LOOP_PANE_SHELL or -PaneShell)"
}

# one word for the pane shell: POSIX 'it'\''s' or pwsh 'it''s'
function ConvertTo-ShellWord([string]$s, [string]$style) {
  if ($style -eq 'pwsh') { return "'" + ($s -replace "'", "''") + "'" }
  return "'" + ($s -replace "'", "'\''") + "'"
}

try {
  $style = Get-QuoteStyle $PaneShell
  $top = (& git -C $ShimCwd rev-parse --show-toplevel 2>$null)
  $repo = Split-Path -Leaf $(if ($top) { $top } else { $ShimCwd })
  $label = "$repo $([char]0xB7) deliver"

  $r = (& herdr workspace create --cwd $ShimCwd --label $label --no-focus | Out-String | ConvertFrom-Json).result
  $tab = Get-Id $r.tab 'tab'
  $pane = Get-Id $r.root_pane 'pane'
  & herdr tab rename $tab 'deliver-loop' | Out-Null

  $words = @('pwsh', '-NoProfile', '-File', (ConvertTo-ShellWord $ShimScript $style)) + @($LoopArgs | ForEach-Object { ConvertTo-ShellWord $_ $style })
  & herdr pane run $pane ($words -join ' ') | Out-Null
  Write-Host "deliver-loop started in herdr workspace '$label' (tab deliver-loop)."
  exit 0
}
catch {
  [Console]::Error.WriteLine("herdr workspace not started: $($_.Exception.Message)")
  exit 1
}
