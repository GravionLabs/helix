<#
.SYNOPSIS
  Toggles the deliver-log pane of the active herdr tab: closes it when open, else opens it again below the active pane.
.DESCRIPTION
  Bound to a herdr key (references/herdr.md): `type = "shell"` sets HERDR_ACTIVE_TAB_ID, HERDR_ACTIVE_PANE_ID and
  HERDR_ACTIVE_PANE_CWD; a plugin action sets HERDR_TAB_ID and HERDR_PANE_ID. herdr has no hide, so the toggle closes the
  pane and reopens it on the same log: .agents/deliver-loop.ansi.log under the pane's cwd, else .agents/deliver-loop.log.
  Runs only in herdr: HERDR_ENV=1 or a HERDR_ACTIVE_* id (a shell keybinding may not set HERDR_ENV). Outside herdr, without
  a log or on a herdr failure it opens no pane and exits 0.
#>
[CmdletBinding()]
param()

$tab = if ($env:HERDR_ACTIVE_TAB_ID) { $env:HERDR_ACTIVE_TAB_ID } else { $env:HERDR_TAB_ID }
$pane = if ($env:HERDR_ACTIVE_PANE_ID) { $env:HERDR_ACTIVE_PANE_ID } else { $env:HERDR_PANE_ID }
if ($env:HERDR_ENV -ne '1' -and -not $env:HERDR_ACTIVE_TAB_ID -and -not $env:HERDR_ACTIVE_PANE_ID) { exit 0 }

. (Join-Path $PSScriptRoot 'LogPane.ps1')

try {
  $open = Get-LogPane -Pane $pane -Tab $tab
} catch {
  [Console]::Error.WriteLine("deliver log: $_")
  exit 0
}
if ($open) {
  foreach ($p in $open) { & herdr pane close $p.pane_id 2>$null | Out-Null }
  exit 0
}

$cwd = if ($env:HERDR_ACTIVE_PANE_CWD) { $env:HERDR_ACTIVE_PANE_CWD } else { (Get-Location).Path }
$log = @('.agents/deliver-loop.ansi.log', '.agents/deliver-loop.log') |
  ForEach-Object { Join-Path $cwd $_ } |
  Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } |
  Select-Object -First 1
if (-not $log) {
  [Console]::Error.WriteLine("deliver log: no .agents/deliver-loop.log under $cwd")
  exit 0
}
Open-LogPane -LogFile $log -Pane $pane -Tab $tab -Detached
exit 0
