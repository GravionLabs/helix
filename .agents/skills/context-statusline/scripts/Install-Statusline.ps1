#!/usr/bin/env pwsh
#Requires -Version 7.0
<#
.SYNOPSIS
  Installs (or removes) the GravionLabs status line for Claude Code and/or GitHub Copilot CLI.
.DESCRIPTION
  The settings entries point at the scripts of the installed skill, so 'npx skills update' refreshes them; nothing is copied.
  The script directory is derived from the installer's own location ($PSScriptRoot). When it lies in a
  <root>/.claude/skills/ or <root>/.agents/skills/ deployment, the client gets its own deployment: Claude Code
  <root>/.claude/skills/context-statusline/scripts, Copilot CLI <root>/.agents/skills/context-statusline/scripts.
  Any other location (project checkout, custom path) is used as is. The installer refuses when the target script does not
  exist, for example when the skill was deployed for the other client only. On Linux/macOS paths under $HOME are written as ~/...;
  on Windows the home directory is %USERPROFILE% (never Git Bash's HOME) and paths are written absolute in forward-slash form
  (C:/Users/<user>/.claude/...), quoted when they contain whitespace; re-running migrates ~/... entries to that form.
  -Client claude (default): sets 'statusLine' and 'subagentStatusLine' in ~/.claude/settings.json to
  node <scripts>/statusline.mjs and node <scripts>/subagent-statusline.mjs.
  -Client copilot: sets 'statusLine' (with padding 1) in <copilot home>/settings.json plus the feature flag STATUS_LINE
  in feature_flags.enabled (added once, other flags kept). <copilot home> is $COPILOT_HOME when set, else ~/.copilot.
  Copilot CLI has no subagent status line. -Client all does both.
  Every other key is kept (order and values). A backup settings.json.bak-<timestamp> is written before any change.
  Idempotent. Entries of older versions (node <client home>/apm-hub/statusline/<file>.mjs) are migrated and their copies
  removed. An entry that is neither is foreign and only replaced with -Force.
  Context warning hook: unless -NoContextWarning, the installer also registers <scripts>/context-warning.sh (npx skills
  installs no hooks): Claude Code gets a UserPromptSubmit hook in settings.json (hooks.UserPromptSubmit), Copilot CLI a
  postToolUse hook (hooks.postToolUse) in its settings.json. Foreign hooks are kept; our entry is found by its command.
  -Uninstall removes only our entries and the copies of older versions; the STATUS_LINE flag is left in place (it may be
  wanted by another status line). The skill files are never touched. Supports -WhatIf and -Confirm.
.PARAMETER Client     claude (default), copilot or all.
.PARAMETER Force      Replace foreign statusLine / subagentStatusLine entries.
.PARAMETER Uninstall  Remove our entries (status lines and hook) and the copies of older versions.
.PARAMETER NoContextWarning  Do not register the context warning hook.
#>
[CmdletBinding(SupportsShouldProcess)]
param([ValidateSet('claude', 'copilot', 'all')][string]$Client = 'claude', [switch]$Force, [switch]$Uninstall, [switch]$NoContextWarning)
$ErrorActionPreference = 'Stop'

$script:SkillRel = 'skills/context-statusline/scripts'

# Platform decision in one place; GRAVIONLABS_TEST_WINDOWS=1 forces Windows (test seam, undocumented).
function Test-Windows { [bool]$IsWindows -or $env:GRAVIONLABS_TEST_WINDOWS -eq '1' }
# Home directory: %USERPROFILE% on Windows (Git Bash's HOME may differ), else $HOME.
function Get-UserHome { if ((Test-Windows) -and $env:USERPROFILE) { $env:USERPROFILE } else { $HOME } }

function ConvertTo-Slash([string]$p) { ($p -replace '\\', '/').TrimEnd('/') }

# Script directory for a client: the client's own deployment next to this one, else this directory.
function Get-ScriptDir([string]$clientDir) {
  $here = ConvertTo-Slash $PSScriptRoot
  if ($here -match "^(.*)/(\.claude|\.agents)/$([regex]::Escape($script:SkillRel))$") { return "$($Matches[1])/$clientDir/$script:SkillRel" }
  $here
}

# Command path: Windows always absolute (a ~ would expand against Git Bash's HOME); else ~/... under $HOME, else absolute;
# quoted when it contains whitespace (then always absolute).
function Get-CommandPath([string]$dir) {
  $dir = ConvertTo-Slash $dir
  if ($dir -match '\s') { return '"' + $dir + '"' }
  if (Test-Windows) { return $dir }
  $home2 = ConvertTo-Slash $HOME
  $cmp = [StringComparison]::Ordinal
  if ($home2 -and $dir.StartsWith("$home2/", $cmp)) { return '~' + $dir.Substring($home2.Length) }
  $dir
}

$script:HookRx = '^bash\s.*context-warning\.sh"?\s*$'

function Get-Str($node, [string]$field) { try { $node[$field].GetValue[string]() } catch { $null } }

# Registers (or removes) our hook command under hooks.<event>. Nested = Claude Code groups {hooks:[{type,command}]},
# else flat entries {type,bash,timeoutSec} (Copilot CLI). Foreign hooks stay; ours is found by its command.
function Set-Hook($root, [string]$hookEvent, [bool]$nested, [string]$cmd, [bool]$install) {
  $field = if ($nested) { 'command' } else { 'bash' }
  $hooks = $root['hooks']
  if ($null -ne $hooks -and $hooks -isnot [System.Text.Json.Nodes.JsonObject]) { throw "hooks in settings.json is not an object." }
  $arr = $null
  if ($hooks) { $arr = $hooks[$hookEvent] }  # assignment, not an if-expression: that would unroll the array
  if ($null -ne $arr -and $arr -isnot [System.Text.Json.Nodes.JsonArray]) { throw "hooks.$hookEvent in settings.json is not an array." }
  $found = $false
  if ($arr) {
    for ($i = $arr.Count - 1; $i -ge 0; $i--) {
      $item = $arr[$i]
      if ($item -isnot [System.Text.Json.Nodes.JsonObject]) { continue }
      $inner = $null
      if ($nested) { $inner = $item['hooks'] }
      if ($nested -and $inner -isnot [System.Text.Json.Nodes.JsonArray]) { continue }
      if ($nested) {
        for ($j = $inner.Count - 1; $j -ge 0; $j--) {
          $c = Get-Str $inner[$j] $field
          if (-not ($c -match $script:HookRx)) { continue }
          if ($install) { $found = $true; if ($c -cne $cmd) { $inner[$j][$field] = $cmd } }
          else { $inner.RemoveAt($j) }
        }
        if (-not $install -and $inner.Count -eq 0 -and $item.Count -eq 1) { $arr.RemoveAt($i) }
      } else {
        $c = Get-Str $item $field
        if (-not ($c -match $script:HookRx)) { continue }
        if ($install) { $found = $true; if ($c -cne $cmd) { $item[$field] = $cmd } }
        else { $arr.RemoveAt($i) }
      }
    }
  }
  if ($install) {
    if ($found) { return }
    if ($null -eq $hooks) { $hooks = [System.Text.Json.Nodes.JsonObject]::new(); $root['hooks'] = $hooks }
    if ($null -eq $arr) { $arr = [System.Text.Json.Nodes.JsonArray]::new(); $hooks[$hookEvent] = $arr }
    $leaf = [System.Text.Json.Nodes.JsonObject]::new()
    $leaf['type'] = 'command'
    $leaf[$field] = $cmd
    if ($nested) {
      $leaf['timeout'] = 5
      $group = [System.Text.Json.Nodes.JsonObject]::new()
      $group['hooks'] = [System.Text.Json.Nodes.JsonArray]::new($leaf)
      $arr.Add($group)
    } else { $leaf['timeoutSec'] = 5; $arr.Add($leaf) }
  } elseif ($hooks) {
    if ($arr -and $arr.Count -eq 0) { [void]$hooks.Remove($hookEvent) }
    if ($hooks.Count -eq 0) { [void]$root.Remove('hooks') }
  }
}

function Get-Cfg([string]$name) {
  if ($name -eq 'claude') {
    @{ Name = 'claude'; Dir = (Join-Path (Get-UserHome) '.claude'); Scripts = (Get-ScriptDir '.claude'); Padding = $false; HookEvent = 'UserPromptSubmit'; Nested = $true
       Keys = [ordered]@{ statusLine = 'statusline.mjs'; subagentStatusLine = 'subagent-statusline.mjs' } }
  } else {
    $dir = if ($env:COPILOT_HOME) { $env:COPILOT_HOME } else { Join-Path (Get-UserHome) '.copilot' }
    @{ Name = 'copilot'; Dir = $dir; Scripts = (Get-ScriptDir '.agents'); Padding = $true; HookEvent = 'postToolUse'; Nested = $false; Keys = [ordered]@{ statusLine = 'statusline.mjs' } }
  }
}

function Install-Client($cfg) {
$keys = $cfg.Keys
$files = @($keys.Values)
$clientDir = $cfg.Dir
$settings = Join-Path $clientDir 'settings.json'
$oldDir = Join-Path $clientDir 'apm-hub/statusline'
$cmdPath = Get-CommandPath $cfg.Scripts
$isOurs = { param($node)
  try { $cmd = $node['command'].GetValue[string](); $cmd -match '(apm-hub/statusline|context-statusline/scripts)"?/(statusline|subagent-statusline)\.mjs"?\s*$' } catch { $false } }

if (-not $Uninstall) {
  $needed = if ($NoContextWarning) { $files } else { $files + 'context-warning.sh' }
  foreach ($f in $needed) {
    if (-not (Test-Path -LiteralPath (Join-Path $cfg.Scripts $f))) {
      throw "[$($cfg.Name)] $($cfg.Scripts)/$f not found. The context-statusline skill is not installed for this client (deployed for another target only?). Install it with npx skills for $($cfg.Name) and run the installer from that copy."
    }
  }
}

$jsonNode = [System.Text.Json.Nodes.JsonNode]
$docOpts = [System.Text.Json.JsonDocumentOptions]::new()
$docOpts.CommentHandling = [System.Text.Json.JsonCommentHandling]::Skip
$docOpts.AllowTrailingCommas = $true
$root = $null
if (Test-Path -LiteralPath $settings) {
  $text = [IO.File]::ReadAllText($settings)
  if ($text.Trim()) {
    try { $root = $jsonNode::Parse($text, $null, $docOpts) } catch { throw "$settings is not valid JSON: $($_.Exception.Message)" }
    if ($root -isnot [System.Text.Json.Nodes.JsonObject]) { throw "$settings is not a JSON object." }
  }
}
if (-not $root) { $root = [System.Text.Json.Nodes.JsonObject]::new() }
$before = $root.ToJsonString()

# Decide changes
$foreign = @()
foreach ($k in $keys.Keys) {
  $cur = $root[$k]
  if ($null -eq $cur) { continue }
  if (-not (& $isOurs $cur)) { $foreign += $k }
}
if ($Uninstall) {
  foreach ($k in $keys.Keys) { if ($null -ne $root[$k] -and (& $isOurs $root[$k])) { [void]$root.Remove($k) } }
  foreach ($k in $foreign) { Write-Warning "$k is not a context-statusline entry; left untouched." }
} else {
  if ($foreign -and -not $Force) { throw "[$($cfg.Name)] Existing $($foreign -join ', ') not managed by context-statusline in $settings. Use -Force to replace." }
  foreach ($k in $keys.Keys) {
    $o = [System.Text.Json.Nodes.JsonObject]::new()
    $o['type'] = 'command'
    $o['command'] = "node $cmdPath/$($keys[$k])"
    if ($cfg.Padding) { $o['padding'] = 1 }
    $root[$k] = $o
  }
}
if (-not $Uninstall -and $cfg.Name -eq 'copilot') {
  $ff = $root['feature_flags']
  if ($null -eq $ff) { $ff = [System.Text.Json.Nodes.JsonObject]::new(); $root['feature_flags'] = $ff }
  if ($ff -isnot [System.Text.Json.Nodes.JsonObject]) { throw "feature_flags in $settings is not an object." }
  $en = $ff['enabled']
  if ($null -eq $en) { $en = [System.Text.Json.Nodes.JsonArray]::new(); $ff['enabled'] = $en }
  if ($en -isnot [System.Text.Json.Nodes.JsonArray]) { throw "feature_flags.enabled in $settings is not an array." }
  if (-not ($en | Where-Object { $_ -is [System.Text.Json.Nodes.JsonValue] -and $_.ToJsonString() -ceq '"STATUS_LINE"' })) { $en.Add('STATUS_LINE') }
}
if ($Uninstall -or -not $NoContextWarning) {
  Set-Hook $root $cfg.HookEvent $cfg.Nested "bash $cmdPath/context-warning.sh" (-not $Uninstall)
}
$settingsChanged = $root.ToJsonString() -cne $before

if ($settingsChanged) {
  $so = [System.Text.Json.JsonSerializerOptions]::new()
  $so.WriteIndented = $true
  $so.Encoder = [System.Text.Encodings.Web.JavaScriptEncoder]::UnsafeRelaxedJsonEscaping
  $out = $root.ToJsonString($so) + "`n"
  if ($PSCmdlet.ShouldProcess($settings, 'Update statusLine / subagentStatusLine / context warning hook')) {
    New-Item -ItemType Directory -Path $clientDir -Force | Out-Null
    if (Test-Path -LiteralPath $settings) {
      $bak = "$settings.bak-$([DateTime]::UtcNow.ToString('yyyyMMddHHmmssfff'))"
      Copy-Item -LiteralPath $settings -Destination $bak
      Write-Host "Backup $bak"
    }
    [IO.File]::WriteAllText($settings, $out, [Text.UTF8Encoding]::new($false))
    Write-Host "$(if ($Uninstall) { 'Removed entries from' } else { 'Updated' }) $settings"
  }
}

# Copies of older versions (install and uninstall): only our two file names, the directory when empty afterwards.
$removed = 0
foreach ($f in 'statusline.mjs', 'subagent-statusline.mjs') {
  $old = Join-Path $oldDir $f
  if ((Test-Path -LiteralPath $old) -and $PSCmdlet.ShouldProcess($old, 'Remove old copy')) { Remove-Item -LiteralPath $old; Write-Host "Removed old copy $old"; $removed++ }
}
foreach ($d in $oldDir, (Split-Path $oldDir -Parent)) {
  if ((Test-Path -LiteralPath $d) -and -not (Get-ChildItem -LiteralPath $d -Force) -and $PSCmdlet.ShouldProcess($d, 'Remove empty directory')) { Remove-Item -LiteralPath $d }
}
if (-not $settingsChanged -and -not $removed) { Write-Host "Up to date ($($cfg.Name)): nothing to do." }
}

foreach ($n in $(if ($Client -eq 'all') { 'claude', 'copilot' } else { $Client })) { Install-Client (Get-Cfg $n) }
