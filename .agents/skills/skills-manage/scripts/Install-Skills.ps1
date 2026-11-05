<#
.SYNOPSIS
  Resolve and install the GravionLabs skill groups a project needs with `npx skills`.

.DESCRIPTION
  A group is a plugin of .claude-plugin/marketplace.json in GravionLabs/skills; groups.json next to this
  script is its copy (kept in sync by scripts/check-marketplace.mjs). `core` and `all` are presets, not
  groups: core = shared, github, delivery, statusline; all = every group except skill-tooling.

  Without -Groups (project install) the installed detect-techstack script maps the stack to groups
  (ts/js -> ts, py -> py, dotnet -> dotnet, rust -> rust, go -> go, angular -> ng). It is looked up in the
  user's own skill directories first; a copy that only exists in the project is repository code and runs
  only with -TrustProject. The base groups shared, github, delivery are added when their marker skill is
  missing from the user's skill directories. -Global without -Groups proposes only the base groups.

  Every wanted skill that is already installed in the target scope (a directory of that name in one of the
  agent skill directories) is skipped. All remaining GravionLabs skills go into one call:
    npx -y skills add GravionLabs/skills[#<ref>] --skill <a> --skill <b> ... -a <agent> ... -y [-g] [--copy]
  External dependencies get their own pinned call: ng -> angular/skills (angular-developer),
  dotnet -> dotnet/skills (the three skills of its dotnet plugin).
  npx output goes to stderr, so stdout is pure JSON.

.PARAMETER Groups
  Comma-separated groups or presets: shared, github, delivery, statusline, ts, py, ng, dotnet, rust, go,
  core, all. Skips detection.

.PARAMETER Global
  Install user-wide (skills -g) instead of into the project.

.PARAMETER Ref
  Tag, branch or commit sha of GravionLabs/skills (`#<ref>`). Without it the default branch is installed.

.PARAMETER Agents
  Agents to install for (skills -a). Default: claude-code, opencode, github-copilot.

.PARAMETER Copy
  Copy instead of symlinking (skills --copy). On by default on Windows, where symlinks need Developer Mode.

.PARAMETER TrustProject
  Allow running a project-local Detect-TechStack.ps1 (repository code). Off by default.

.PARAMETER Update
  Update the installed skills instead of installing: runs `npx skills check` (-g with -Global), reports its
  output as `check`, and (without -DryRun) `npx skills update`. Afterwards the script starts itself again in a
  new process, so the refreshed groups.json counts, for the groups with an installed member (or -Groups) and
  reports the skills that are new in them as `newMembers` with their `newMemberCommands` (a dry run, nothing
  installed). Install them with the same command without -Update.

.PARAMETER DryRun
  Print the commands in the JSON result, run nothing. The result lists `wouldInstall`, not `installed`.

.OUTPUTS
  JSON {dryRun, groups, installed|wouldInstall, skipped, failed, commands, dependencies, notes}.
  Exit 1 when npx or pwsh 7 is missing, a group name is invalid or an install command fails.
#>
param(
  [string[]]$Groups,
  [switch]$Global,
  [string]$Ref,
  [string[]]$Agents = @('claude-code', 'opencode', 'github-copilot'),
  [switch]$Copy,
  [switch]$TrustProject,
  [switch]$DryRun,
  [switch]$Update
)

$ErrorActionPreference = 'Stop'

if ($PSVersionTable.PSVersion.Major -lt 7) {
  [Console]::Error.WriteLine('PowerShell 7+ is required (https://aka.ms/powershell).')
  exit 1
}
if (($Update -or -not $DryRun) -and -not (Get-Command npx -ErrorAction SilentlyContinue)) {
  [Console]::Error.WriteLine('npx not found on PATH. Install Node.js 22+ (https://nodejs.org), which brings npx.')
  exit 1
}

$source = 'GravionLabs/skills'
$groupMap = Get-Content -Raw (Join-Path $PSScriptRoot 'groups.json') | ConvertFrom-Json -AsHashtable
$presets = @{
  core = @('shared', 'github', 'delivery', 'statusline')
  all  = @($groupMap.Keys | Where-Object { $_ -notin @('skill-tooling') } | Sort-Object)
}
$external = @{
  ng     = [ordered]@{ source = 'angular/skills#d422d3c17e27c9860f3df91b6e617ad80970ba05'; skills = @('angular-developer') }
  dotnet = [ordered]@{ source = 'dotnet/skills#cb7c10bd32b250459632df9e6fa1350cdaf00b18'; skills = @('csharp-scripts', 'dotnet-pinvoke', 'nuget-trusted-publishing') }
}
$valid = @($groupMap.Keys | Where-Object { $_ -notin @('skill-tooling') }) + @('core', 'all') | Sort-Object

# pwsh -File passes "ts,ng" as one string: split on commas, then validate
if ($PSBoundParameters.ContainsKey('Groups')) {
  $Groups = @($Groups | ForEach-Object { $_ -split ',' } | ForEach-Object { $_.Trim() } | Where-Object { $_ })
  if ($Groups.Count -eq 0) { [Console]::Error.WriteLine("-Groups is empty. Valid: $($valid -join ', ')"); exit 1 }
  $bad = @($Groups | Where-Object { $valid -notcontains $_ })
  if ($bad) { [Console]::Error.WriteLine("Invalid group(s): $($bad -join ', '). Valid: $($valid -join ', ')"); exit 1 }
}
$Agents = @($Agents | ForEach-Object { $_ -split ',' } | ForEach-Object { $_.Trim() } | Where-Object { $_ })
if ($Ref -and $Ref -notmatch '^[\w][\w./-]*$') {
  [Console]::Error.WriteLine("Invalid -Ref '$Ref': use a tag, branch or commit sha.")
  exit 1
}

$notes = [System.Collections.Generic.List[string]]::new()
# Windows: %USERPROFILE% (Git Bash's HOME may differ); GRAVIONLABS_TEST_WINDOWS=1 forces it (test seam, undocumented)
$isWin = [bool]$IsWindows -or $env:GRAVIONLABS_TEST_WINDOWS -eq '1'
$userHome = if ($isWin -and $env:USERPROFILE) { $env:USERPROFILE } elseif ($env:HOME) { $env:HOME } else { $env:USERPROFILE }
$projectDirs = '.claude/skills', '.agents/skills', '.opencode/skills', '.github/skills'
$homeDirs = '.claude/skills', '.agents/skills', '.config/opencode/skills', '.copilot/skills'
$scopeBase = if ($Global) { $userHome } else { (Get-Location).Path }
$scopeDirs = if ($Global) { $homeDirs } else { $projectDirs }

function Test-Installed([string]$skill, [string]$base, [string[]]$dirs) {
  foreach ($d in $dirs) { if (Test-Path (Join-Path $base "$d/$skill/SKILL.md")) { return $true } }
  return $false
}

# User-trusted locations first; a project-local copy is repository code
function Find-Detect {
  foreach ($d in $homeDirs) {
    $p = Join-Path $userHome "$d/detect-techstack/scripts/Detect-TechStack.ps1"
    if (Test-Path $p) { return $p }
  }
  foreach ($d in $projectDirs) {
    $p = Join-Path (Get-Location) "$d/detect-techstack/scripts/Detect-TechStack.ps1"
    if (Test-Path $p) {
      if ($TrustProject) { return $p }
      $notes.Add("detect-techstack found only in the project ($d): not run because it is repository code. Pass -TrustProject to run it, or -Groups.")
      return $null
    }
  }
  return $null
}

if ($Update) {
  $scopeArgs = @(if ($Global) { '-g' })
  $checkOut = @(& npx -y skills check @scopeArgs 2>&1 | ForEach-Object { "$_" })
  $checkExit = $LASTEXITCODE
  # npx skills check: exit 0 = nothing to update, 1 = an update exists; anything else is a failure
  $checkFailed = $checkExit -notin 0, 1
  if ($checkFailed) { $notes.Add("npx skills check failed (exit $checkExit)") }
  $updateArgs = @('-y', 'skills', 'update') + $scopeArgs
  $uResult = [ordered]@{ dryRun = [bool]$DryRun; scope = $(if ($Global) { 'global' } else { 'project' }); check = $checkOut; updated = $false }
  $uResult.commands = @('npx ' + ($updateArgs -join ' '))
  $newMembers = @(); $newCmds = @(); $uFailed = $checkFailed
  if (-not $DryRun -and -not $uFailed) {
    & npx @updateArgs 2>&1 | ForEach-Object { [Console]::Error.WriteLine("$_") }
    if ($LASTEXITCODE -ne 0) { $uFailed = $true; $notes.Add("npx skills update failed (exit $LASTEXITCODE)") } else { $uResult.updated = $true }
    if (-not $uFailed) {
      # new process: the updated skills-manage ships the refreshed groups.json
      $g = if ($Groups) { $Groups } else { @($groupMap.Keys | Where-Object { $_ -notin @('skill-tooling') } | Where-Object { $gn = $_; @($groupMap[$gn] | Where-Object { Test-Installed $_ $scopeBase $scopeDirs }).Count -gt 0 } | Sort-Object) }
      if ($g.Count -gt 0) {
        $cArgs = @('-NoProfile', '-File', $PSCommandPath, '-DryRun', '-Groups', ($g -join ','), '-Agents', ($Agents -join ','))
        if ($Global) { $cArgs += '-Global' }
        if ($Ref) { $cArgs += @('-Ref', $Ref) }
        $errFile = [System.IO.Path]::GetTempFileName()
        try {
          $childOut = (& pwsh @cArgs 2>$errFile | Out-String)
          $childExit = $LASTEXITCODE
          $childErr = (Get-Content -Raw -LiteralPath $errFile -ErrorAction SilentlyContinue)
        } finally { Remove-Item -LiteralPath $errFile -Force -ErrorAction SilentlyContinue }
        $child = $null
        if ($childExit -eq 0) { try { $child = $childOut | ConvertFrom-Json -ErrorAction Stop } catch { $child = $null } }
        if ($childExit -ne 0 -or $null -eq $child) {
          $uFailed = $true
          $detail = if ($childErr -and $childErr.Trim()) { $childErr.Trim() } elseif ($childOut -and $childOut.Trim()) { $childOut.Trim() } else { 'no output' }
          $notes.Add("new-member check after the update failed (exit $childExit): $detail")
        } else {
          $newMembers = @(@($child.wouldInstall) | Where-Object { $null -ne $_ }); $newCmds = @(@($child.commands) | Where-Object { $null -ne $_ })
        }
      }
    }
  } elseif ($DryRun) { $notes.Add('Dry run: new group members are proposed after the update, with the refreshed group definition.') }
  $uResult.newMembers = $newMembers
  $uResult.newMemberCommands = $newCmds
  $uResult.notes = @($notes)
  $uResult | ConvertTo-Json -Depth 4
  if ($uFailed) { exit 1 }
  exit 0
}

$wanted = [System.Collections.Generic.List[string]]::new()
function Add-Group([string]$g) {
  $members = if ($presets.ContainsKey($g)) { $presets[$g] } else { @($g) }
  foreach ($m in $members) { if (-not $wanted.Contains($m)) { $wanted.Add($m) } }
}

if ($Groups) {
  $Groups | ForEach-Object { Add-Group $_ }
} else {
  if ($Global) {
    $notes.Add('Global install without -Groups proposes only the base groups (no stack detection). Pass -Groups (e.g. core, ts) for more.')
  } else {
    $detect = Find-Detect
    $langMap = @{ ts = 'ts'; js = 'ts'; typescript = 'ts'; javascript = 'ts'; py = 'py'; python = 'py'; dotnet = 'dotnet'; csharp = 'dotnet'; rust = 'rust'; go = 'go' }
    if ($detect) {
      try {
        $out = & pwsh -NoProfile -File $detect -ProjectRoot . 2>$null | Out-String
        if ($LASTEXITCODE -ne 0) { throw "exit $LASTEXITCODE" }
        $report = $out | ConvertFrom-Json -ErrorAction Stop
        foreach ($l in @($report.languages)) {
          $k = "$l".ToLowerInvariant()
          if ($langMap.ContainsKey($k)) { Add-Group $langMap[$k] }
        }
        if (@($report.frameworks) -contains 'angular') { Add-Group 'ng' }
      } catch {
        $wanted.Clear()
        $notes.Add("detect-techstack failed ($($_.Exception.Message)): only base groups resolved. Pass -Groups for stack groups.")
      }
    } elseif (-not ($notes | Where-Object { $_ -like 'detect-techstack found only*' })) {
      $notes.Add('detect-techstack not installed: only base groups resolved. Pass -Groups for stack groups.')
    }
  }
  # Base groups: proposed when their marker skill is missing from the user's skill directories
  $marker = [ordered]@{ shared = 'detect-techstack'; github = 'github-issue'; delivery = 'deliver' }
  foreach ($k in $marker.Keys) {
    if (-not (Test-Installed $marker[$k] $userHome $homeDirs)) { Add-Group $k }
  }
  if ($wanted.Count -eq 0) { $notes.Add('The base groups are already installed globally and no stack was detected: nothing to propose.') }
}

# Skills of the wanted groups, already installed ones skipped
$skills = [System.Collections.Generic.List[string]]::new()
$skipped = [System.Collections.Generic.List[string]]::new()
foreach ($g in $wanted) {
  foreach ($s in $groupMap[$g]) {
    if ($skills.Contains($s) -or $skipped.Contains($s)) { continue }
    if (Test-Installed $s $scopeBase $scopeDirs) { $skipped.Add($s) } else { $skills.Add($s) }
  }
}

$useCopy = $Copy -or $IsWindows
if ($IsWindows -and -not $Copy) { $notes.Add('Windows: installing as copies (--copy); symlinks need Developer Mode. npx skills update refreshes the copies.') }
$common = @()
foreach ($a in $Agents) { $common += @('-a', $a) }
$common += '-y'
if ($Global) { $common += '-g' }
if ($useCopy) { $common += '--copy' }

$calls = [System.Collections.Generic.List[object]]::new()
if ($skills.Count -gt 0) {
  $spec = $source + $(if ($Ref) { "#$Ref" } else { '' })
  $calls.Add([ordered]@{ name = $source; skills = @($skills); args = @('-y', 'skills', 'add', $spec) + @($skills | ForEach-Object { '--skill', $_ }) + $common })
}
$deps = [System.Collections.Generic.List[string]]::new()
foreach ($g in $wanted) {
  if (-not $external.ContainsKey($g)) { continue }
  $e = $external[$g]
  $missing = @($e.skills | Where-Object { -not (Test-Installed $_ $scopeBase $scopeDirs) })
  $deps.Add("$($e.source.Split('#')[0]) ($($e.skills -join ', '))")
  if ($missing.Count -eq 0) { $e.skills | ForEach-Object { $skipped.Add($_) }; continue }
  $calls.Add([ordered]@{ name = $e.source; skills = $missing; args = @('-y', 'skills', 'add', $e.source) + @($missing | ForEach-Object { '--skill', $_ }) + $common })
}

$done = [System.Collections.Generic.List[string]]::new()
$commands = [System.Collections.Generic.List[string]]::new()
$failed = $null
foreach ($c in $calls) {
  $commands.Add('npx ' + (($c.args | ForEach-Object { if ($_ -match '[\s*]') { "'$_'" } else { $_ } }) -join ' '))
  if ($failed) { continue }
  if (-not $DryRun) {
    $argv = $c.args
    & npx @argv 2>&1 | ForEach-Object { [Console]::Error.WriteLine("$_") }
    if ($LASTEXITCODE -ne 0) { $failed = $c.name; $notes.Add("npx skills add failed for $($c.name) (exit $LASTEXITCODE)"); continue }
  }
  $c.skills | ForEach-Object { $done.Add($_) }
}

# .agents/ holds the installed skills of OpenCode and Copilot and the committed project config
$gitignore = Join-Path $scopeBase '.gitignore'
if (-not $Global -and (Test-Path -LiteralPath $gitignore -PathType Leaf)) {
  $gi = @(Get-Content -LiteralPath $gitignore | ForEach-Object { $_.Trim() })
  if (@($gi | Where-Object { $_ -match '^/?\.agents(/(\*{1,2})?)?$' }).Count -gt 0) {
    $notes.Add('.gitignore ignores .agents/: that hides the installed skills (.agents/skills/), the project config (.agents/config.json) and the committed lessons (.agents/lessons/). Remove the line, or keep them with !.agents/skills/, !.agents/config.json and !.agents/lessons/.')
  }
}

$result = [ordered]@{ dryRun = [bool]$DryRun; groups = @($wanted) }
$result[$(if ($DryRun) { 'wouldInstall' } else { 'installed' })] = @($done)
$result.skipped = @($skipped)
$result.failed = $failed
$result.commands = @($commands)
$result.dependencies = @($deps)
$result.notes = @($notes)
$result | ConvertTo-Json -Depth 4

if ($failed) { exit 1 }
