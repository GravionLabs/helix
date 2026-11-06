<#
.SYNOPSIS
  Shared by Invoke-DeliverLoop.ps1 and Switch-LogPane.ps1: opens a herdr split pane below a pane that tails a log file.
.DESCRIPTION
  Dot-source it, then call `Open-LogPane -LogFile <path>`. It does nothing outside herdr (HERDR_ENV is not 1), when stdout
  is not a terminal (cron, CI, redirected) or when the tab already has a pane labeled deliver-log. Any herdr failure is
  ignored: the caller runs on without a pane. The pane is never closed here, so the log stays readable after the run.
  -Pane/-Tab name the pane to split and its tab (default: the current pane, the tab of HERDR_PANE_ID). -Detached skips the
  herdr and terminal check, for a caller without a terminal that checked herdr itself (the toggle keybinding).
  DELIVER_LOOP_ASSUME_TTY=1 treats a redirected stdout as a terminal (tests only; see Test-LoopTerminal).
#>

$script:LogPaneLabel = 'deliver-log'

# "Terminal" for the loop: stdout is not redirected. DELIVER_LOOP_ASSUME_TTY=1 forces true (tests only).
# The single definition; Invoke-DeliverLoop.ps1 (stdout colors) and Test-LogPaneHost both call it.
function Test-LoopTerminal {
  return (-not [Console]::IsOutputRedirected) -or $env:DELIVER_LOOP_ASSUME_TTY -eq '1'
}

function Test-LogPaneHost {
  if ($env:HERDR_ENV -ne '1') { return $false }
  return (Test-LoopTerminal)
}

# Panes of one tab: -Tab, else the tab of -Pane (default HERDR_PANE_ID); every pane when neither is known.
function Get-LogPaneTabPane {
  param([string]$Pane = $env:HERDR_PANE_ID, [string]$Tab)
  $out = & herdr pane list 2>$null
  if ($LASTEXITCODE -ne 0 -or -not $out) { throw 'herdr pane list failed' }
  $panes = @((($out -join "`n") | ConvertFrom-Json).result.panes)
  if (-not $Tab) {
    $own = $panes | Where-Object { $_.pane_id -eq $Pane } | Select-Object -First 1
    if ($own -and $own.PSObject.Properties['tab_id']) { $Tab = $own.tab_id }
  }
  if ($Tab) { return @($panes | Where-Object { $_.PSObject.Properties['tab_id'] -and $_.tab_id -eq $Tab }) }
  return $panes
}

# The panes labeled deliver-log of one tab (arguments as Get-LogPaneTabPane).
function Get-LogPane {
  param([string]$Pane = $env:HERDR_PANE_ID, [string]$Tab)
  @(Get-LogPaneTabPane -Pane $Pane -Tab $Tab | Where-Object { $_.PSObject.Properties['label'] -and $_.label -eq $script:LogPaneLabel })
}

function Open-LogPane {
  [CmdletBinding()]
  param([Parameter(Mandatory)][string]$LogFile, [string]$Pane, [string]$Tab, [switch]$Detached)
  if (-not $Detached -and -not (Test-LogPaneHost)) { return }
  try {
    $lookup = if ($Pane) { $Pane } else { $env:HERDR_PANE_ID }
    if (Get-LogPane -Pane $lookup -Tab $Tab) { return }
    New-Item -ItemType Directory -Force -Path (Split-Path $LogFile) | Out-Null
    if (-not (Test-Path -LiteralPath $LogFile)) { New-Item -ItemType File -Path $LogFile | Out-Null }
    $source = if ($Pane) { $Pane } else { '--current' }
    $out = & herdr pane split $source --direction down --ratio 0.7 --no-focus 2>$null
    if ($LASTEXITCODE -ne 0 -or -not $out) { throw 'herdr pane split failed' }
    $id = (($out -join "`n") | ConvertFrom-Json).result.pane.pane_id
    if (-not $id) { throw 'herdr pane split returned no pane_id' }
    $quoted = $LogFile.Replace("'", "''")
    & herdr pane run $id "pwsh -NoProfile -Command `"Get-Content -Tail 40 -Wait '$quoted'`"" 2>$null | Out-Null
    & herdr pane rename $id $script:LogPaneLabel 2>$null | Out-Null
  } catch { Write-Verbose "log pane not opened: $_" }
}
