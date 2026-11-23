<#
.SYNOPSIS
  Writes the deliver-loop launcher file and removes the old deliver-loop function from the shell profiles.
.DESCRIPTION
  macOS and Linux: <BinDir>/deliver-loop (executable). Windows: <BinDir>\deliver-loop.cmd and deliver-loop.ps1.
  The launcher runs node <skill-dir>/scripts/deliver-loop.mts with its arguments. The old block between
  "# >>> deliver-loop >>>" and "# <<< deliver-loop <<<" is removed from the profiles: a function of the same
  name hides the file. PATH is never changed; the result says whether BinDir is on it and how to add it.
  A second run changes nothing. Output is JSON: dryRun, binDir, files[] (path, action add|update|unchanged),
  profiles[] (path, action removed|none), onPath, pathHint.
.PARAMETER BinDir
  Directory of the launcher. Default: ~/.local/bin.
.PARAMETER Profiles
  Profile files to clean. Default: ~/.zshrc, ~/.bashrc and the PowerShell profiles of the current user.
.PARAMETER Platform
  windows or unix. Default: the running system.
.PARAMETER DryRun
  Report the changes, write nothing.
#>
[CmdletBinding()]
param(
  [string]$BinDir = (Join-Path $HOME '.local/bin'),
  [string[]]$Profiles,
  [ValidateSet('windows', 'unix')][string]$Platform = $(if ($IsWindows) { 'windows' } else { 'unix' }),
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$utf8 = [System.Text.UTF8Encoding]::new($false)

if ($Profiles) { $Profiles = @($Profiles | ForEach-Object { $_ -split ',' }) } # -File passes a list as one comma-joined word
else {
  $Profiles = @((Join-Path $HOME '.zshrc'), (Join-Path $HOME '.bashrc'), $PROFILE.CurrentUserCurrentHost, $PROFILE.CurrentUserAllHosts) | Select-Object -Unique
}

# launcher files
$names = if ($Platform -eq 'windows') { @('deliver-loop.cmd', 'deliver-loop.ps1') } else { @('deliver-loop') }
$files = foreach ($name in $names) {
  $template = Join-Path $PSScriptRoot ('../templates/' + $(if ($name -eq 'deliver-loop') { 'deliver-loop.sh' } else { $name }))
  $want = (Get-Content -Raw -LiteralPath $template) -replace "`r`n", "`n"
  if ($name -like '*.cmd') { $want = $want -replace "`n", "`r`n" }
  $path = Join-Path $BinDir $name
  $executable = $Platform -eq 'unix'
  $same = $false
  if (Test-Path -LiteralPath $path -PathType Leaf) {
    $same = [System.IO.File]::ReadAllText($path) -ceq $want
    if ($same -and $executable -and -not $IsWindows) {
      $same = ([System.IO.File]::GetUnixFileMode($path) -band [System.IO.UnixFileMode]::UserExecute) -ne 0
    }
  }
  $action = if ($same) { 'unchanged' } elseif (Test-Path -LiteralPath $path) { 'update' } else { 'add' }
  if ($action -ne 'unchanged' -and -not $DryRun) {
    New-Item -ItemType Directory -Path $BinDir -Force | Out-Null
    [System.IO.File]::WriteAllText($path, $want, $utf8)
    if ($executable -and -not $IsWindows) {
      [System.IO.File]::SetUnixFileMode($path, [System.IO.UnixFileMode]'UserRead,UserWrite,UserExecute,GroupRead,GroupExecute,OtherRead,OtherExecute')
    }
  }
  [ordered]@{ path = $path; action = $action }
}

# the old function block
$rx = [regex]::new('(?s)(\r?\n)?# >>> deliver-loop >>>.*?# <<< deliver-loop <<<(\r?\n)?')
$cleaned = foreach ($profilePath in $Profiles) {
  $action = 'none'
  if (Test-Path -LiteralPath $profilePath -PathType Leaf) {
    $text = [System.IO.File]::ReadAllText($profilePath)
    if ($rx.IsMatch($text)) {
      $action = 'removed'
      if (-not $DryRun) { [System.IO.File]::WriteAllText($profilePath, $rx.Replace($text, ''), $utf8) }
    }
  }
  [ordered]@{ path = $profilePath; action = $action }
}

# PATH: report only
$sep = [System.IO.Path]::PathSeparator
$trim = { param($p) $p.TrimEnd('/', '\') }
$full = & $trim ([System.IO.Path]::GetFullPath($BinDir))
$onPath = @(($env:PATH -split [regex]::Escape($sep)) | Where-Object { $_ } | ForEach-Object { & $trim $_ }) -contains $full
$hint = $null
if (-not $onPath) {
  $hint = if ($Platform -eq 'windows') {
    "$BinDir is not in PATH. Add it for your user: [Environment]::SetEnvironmentVariable('Path', `"`$([Environment]::GetEnvironmentVariable('Path','User'));$BinDir`", 'User'), then open a new terminal."
  }
  else {
    "$BinDir is not in PATH. Add this line to ~/.zshrc or ~/.bashrc and open a new terminal: export PATH=`"$BinDir`:`$PATH`""
  }
}

[ordered]@{ dryRun = [bool]$DryRun; binDir = $BinDir; files = @($files); profiles = @($cleaned); onPath = $onPath; pathHint = $hint } | ConvertTo-Json -Depth 4
