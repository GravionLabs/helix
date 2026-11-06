<#
.SYNOPSIS
  Runs `/deliver` in a fresh harness process per PBI until the targets are done, blocked, stalled or -Max is reached.
.DESCRIPTION
  A long unattended run in one session grows its context and dies with it. This loop starts
  `claude -p "/deliver <targets> --unattended --max 1"` (`-Harness claude`, the default) or `copilot -p` (`-Harness copilot`) once per PBI; deliver keeps all state in GitHub, so there is no
  queue file. Progress is read from GitHub before and after each iteration: the open PBIs of the targets without the
  labels needs-decision / needs-refinement / interactive (deliver skips interactive PBIs unattended). No change stops
  the loop ("no progress"); nothing open means done (unless a closed PBI of the milestone carries needs-decision, the paused release review: blocked); open PBIs that all wait on an open blocker or a label mean blocked.
  Observability: every stream record goes to .agents/deliver-loop/<run>/<nr>.jsonl (<nr> is the first PBI that was ready
  at the start of the iteration), a summary line per step to .agents/deliver-loop.log (plain) and stdout, the same line
  with ANSI colors to .agents/deliver-loop.ansi.log (long text is cut to the terminal width, 120 characters when redirected), desktop notifications for the attention steps (macOS osascript,
  Windows toast), the herdr pane tokens deliver, deliver_step, deliver_pr when HERDR_ENV=1 and, with -LogPane in herdr on a terminal,
  a split pane labeled deliver-log below the session that tails the log (LogPane.ps1; never closed by the loop).
  Stdout carries the colors of the .ansi.log when it is a terminal and neither -NoColor nor NO_COLOR is set; otherwise it is plain.
  Run it from the repository root. Exit code: 0 done or max reached, 1 no progress, 2 blocked, 64 bad arguments.
.PARAMETER Target
  Issue numbers (PBI, Feature or Epic), as for `/deliver`: `-Target 12,14` or `-Target 12 14` (a comma list also works
  under `pwsh -File`, which does not split it itself).
.PARAMETER Milestone
  Adds the open PBIs and bugs of this milestone (as `/deliver --milestone`): M<n> or a sub-number M<n>.<m> (also after close renamed it M<n> (x.y.z)) or a legacy title.
.PARAMETER Max
  Stop after this many iterations (PBIs delivered, blocked or paused in total).
.PARAMETER Model
  Model of the orchestrating session. Default sonnet; with -Harness copilot and no -Model: auto (Copilot picks).
.PARAMETER Harness
  claude (Claude Code, default) or copilot (GitHub Copilot CLI: `copilot -p … --model <model> --allow-all-tools
  --allow-all-paths --allow-all-urls --no-ask-user --output-format json`). Any other value fails before the first iteration.
.PARAMETER LogPane
  Opens the herdr log pane `deliver-log` (herdr, stdout a terminal). Off by default: toggle it with Switch-LogPane.ps1.
.PARAMETER NoPane
  Deprecated no-op (the pane is off by default); use -LogPane to open it.
.PARAMETER NoColor
  Writes no .ansi.log and colors no stdout (as does a non-empty NO_COLOR); the pane tails the plain log.
#>
[CmdletBinding()]
param(
  [string[]]$Target = @(),
  [string]$Milestone = '',
  [ValidateRange(1, 10000)][int]$Max = 0,
  [string]$Model = 'sonnet',
  [string]$Harness = 'claude',
  [switch]$LogPane,
  [switch]$NoPane,
  [switch]$NoColor,
  [Parameter(ValueFromRemainingArguments)][string[]]$MoreTargets = @()
)
$ErrorActionPreference = 'Stop'

$Harnesses = @('claude', 'copilot')
if ($Harness -notin $Harnesses) {
  [Console]::Error.WriteLine("Unknown -Harness '$Harness'. Supported: $($Harnesses -join ', ').")
  exit 64
}

if ($NoPane) { [Console]::Error.WriteLine('deliver-loop: -NoPane is deprecated and does nothing (the log pane is off by default; -LogPane opens it).') }

if ($Harness -eq 'copilot' -and -not $PSBoundParameters.ContainsKey('Model')) { $Model = 'auto' }

$Nrs = @(($Target + $MoreTargets) | ForEach-Object { $_ -split '[,\s]+' } | Where-Object { $_ })
if (($Nrs | Where-Object { $_ -notmatch '^\d+$' }) -or ($Nrs.Count -eq 0 -and -not $Milestone)) {
  [Console]::Error.WriteLine('Give -Target <nr...> (issue numbers) and/or -Milestone <name>.')
  exit 64
}
$Nrs = @($Nrs | ForEach-Object { [int]$_ })

$Held = @('needs-decision', 'needs-refinement', 'interactive')
$LogFile = Join-Path (Get-Location) '.agents/deliver-loop.log'
$AnsiFile = if ($NoColor -or $env:NO_COLOR) { '' } else { Join-Path (Get-Location) '.agents/deliver-loop.ansi.log' }
$Esc = [char]27
$Ansi = @{ dim = "$Esc[2m"; cyan = "$Esc[36m"; red = "$Esc[31m"; yellow = "$Esc[33m"; green = "$Esc[32m"; reset = "$Esc[0m" }
# stdout gets the colors of the .ansi.log when it is a terminal (Test-LoopTerminal in LogPane.ps1 defines "terminal").
. (Join-Path $PSScriptRoot 'LogPane.ps1')
$ColorStdout = [bool]$AnsiFile -and (Test-LoopTerminal)
$RunDir = Join-Path (Get-Location) ".agents/deliver-loop/$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
$Recent = [System.Collections.Generic.List[string]]::new()
$AgentNames = @{}
$Pane = if ($env:HERDR_ENV -eq '1') { $env:HERDR_PANE_ID } else { '' }

# One step: plain to the log; colored to the .ansi.log and a terminal stdout (time dim, $Tool cyan, the rest in $Color).
# $Tool is looked up from $ToolAt on (after the subagent prefix).
function Write-Step([string]$text, [string]$Color = '', [string]$Tool = '', [int]$ToolAt = 0) {
  $time = (Get-Date).ToString('HH:mm:ss')
  $line = "$time $text"
  New-Item -ItemType Directory -Force -Path (Split-Path $LogFile) | Out-Null
  [IO.File]::AppendAllText($LogFile, $line + "`n")
  $colored = $line
  if ($AnsiFile) {
    $body = if ($Color) { "$($Ansi[$Color])$text$($Ansi.reset)" } else { $text }
    $at = if ($Tool) { $text.IndexOf($Tool, $ToolAt) } else { -1 }
    if ($at -ge 0 -and -not $Color) { $body = $text.Substring(0, $at) + "$($Ansi.cyan)$Tool$($Ansi.reset)" + $text.Substring($at + $Tool.Length) }
    $colored = "$($Ansi.dim)$time$($Ansi.reset) $body"
    [IO.File]::AppendAllText($AnsiFile, $colored + "`n")
  }
  Write-Host $(if ($ColorStdout) { $colored } else { $line })
  $Recent.Add($line)
  if ($Recent.Count -gt 10) { $Recent.RemoveAt(0) }
}

function Send-Notice([string]$text) {
  try {
    if ($IsMacOS) {
      $esc = $text.Replace('\', '\\').Replace('"', '\"')
      & osascript -e "display notification `"$esc`" with title `"deliver loop`"" 2>$null | Out-Null
    } elseif ($IsWindows) {
      [void][Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime]
      $xml = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent('ToastText02')
      $nodes = $xml.GetElementsByTagName('text')
      [void]$nodes.Item(0).AppendChild($xml.CreateTextNode('deliver loop'))
      [void]$nodes.Item(1).AppendChild($xml.CreateTextNode($text))
      [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('PowerShell').Show([Windows.UI.Notifications.ToastNotification]::new($xml))
    }
  } catch { Write-Verbose "notification failed: $_" }
}

$PanePbi = ''
$PanePr = ''
function Set-Pane([string]$Nr = '', [string]$Step = '', [switch]$Clear) {
  # herdr pane tokens (#16): deliver=#<nr>, deliver_step=<pos>/<total> <step>[: <result>], deliver_pr=#<pr>; values <= 80 chars
  if (-not $Pane) { return }
  if ($Clear) {
    $tokenArgs = @('--clear-token', 'deliver', '--clear-token', 'deliver_step', '--clear-token', 'deliver_pr')
  } else {
    if ($Nr -ne $script:PanePbi) { $script:PanePbi = $Nr; $script:PanePr = '' }
    if ($Step -match '^\d+/\d+ pr: .*?#(\d+)') { $script:PanePr = $Matches[1] }
    $value = if ($Step.Length -gt 80) { $Step.Substring(0, 79) + '…' } else { $Step }
    $tokenArgs = @('--token', "deliver=#$Nr", '--token', "deliver_step=$value")
    if ($script:PanePr) { $tokenArgs += @('--token', "deliver_pr=#$($script:PanePr)") }
    $tokenArgs += @('--ttl-ms', '3600000')
  }
  try { & herdr pane report-metadata $Pane --source deliver @tokenArgs 2>$null | Out-Null } catch { Write-Verbose "herdr failed: $_" }
}

# herdr agent state (#191): the loop reports its own lifecycle (source deliver-loop, agent deliver); herdr tracks only the pane's agent, not the claude -p children.
# working per iteration, blocked on a pause/blocked step or when the loop ends blocked / no progress, idle at the end, then release. Any herdr failure is ignored.
$Paused = $false
# Live herdr (2026-11): the pane id must come right after the subcommand; release-agent rejects it as trailing positional
# ("unknown option"). report-agent replaces the state of another agent in the pane and release-agent does not restore it,
# so the loop reports only in a pane without another agent (checked once with `pane get`; herdr failure: reports as before).
$AgentStateOff = $false
function Test-PaneHasOtherAgent {
  if (-not $Pane) { return $false }
  try {
    $out = & herdr pane get $Pane 2>$null
    if ($LASTEXITCODE -ne 0 -or -not $out) { return $false }
    $a = (($out -join "`n") | ConvertFrom-Json).result.pane.agent
    return [bool]$a -and $a -ne 'deliver'
  } catch { return $false }
}
function Set-AgentState([string]$State = '', [switch]$Release) {
  if (-not $Pane -or $AgentStateOff) { return }
  [string[]]$a = if ($Release) { 'release-agent' } else { 'report-agent', '--state', $State }
  try { & herdr pane $a[0] $Pane @($a | Select-Object -Skip 1) --source deliver-loop --agent deliver 2>$null | Out-Null } catch { Write-Verbose "herdr failed: $_" }
}

# Get-Milestones.ps1 of github-milestone: sibling skill (installed) or skills/github (repository)
$MilestoneScript = @('../../github-milestone', '../../../github/github-milestone' | ForEach-Object { Join-Path $PSScriptRoot "$_/scripts/Get-Milestones.ps1" }) |
  Where-Object { Test-Path $_ } | Select-Object -First 1

function Get-Json([string[]]$ghArgs, [switch]$Pwsh) {
  $out = if ($Pwsh) { & pwsh -NoProfile @ghArgs 2>$null } else { & gh @ghArgs 2>$null }
  if ($LASTEXITCODE -ne 0) { throw "$(if ($Pwsh) { 'pwsh' } else { 'gh' }) $($ghArgs -join ' ') failed" }
  if (-not $out) { return $null }
  return ($out -join "`n") | ConvertFrom-Json
}

function Add-Pbis([int]$nr, [hashtable]$seen, $found) {
  if ($seen.ContainsKey($nr)) { return }
  $seen[$nr] = $true
  # REST per issue: `gh issue view` runs on the GraphQL budget (#117)
  $issue = Get-Json @('api', "repos/{owner}/{repo}/issues/$nr")
  $labels = @($issue.labels | ForEach-Object { $_.name })
  if ($labels -contains 'pbi' -or $labels -contains 'bug') {
    if ($issue.state -eq 'open') { $found.Add([pscustomobject]@{ Number = $nr; Labels = $labels }) }
    return
  }
  foreach ($child in @(Get-Json @('api', "repos/{owner}/{repo}/issues/$nr/sub_issues?per_page=100"))) {
    if ($child) { Add-Pbis ([int]$child.number) $seen $found }
  }
}

# State from GitHub: open PBIs of the targets; eligible = no hold label; ready = eligible and no open blocker.
function Get-State {
  $seen = @{}
  $found = [System.Collections.Generic.List[object]]::new()
  foreach ($nr in $Nrs) { Add-Pbis $nr $seen $found }
  if ($Milestone) {
    # one REST call lists the milestone (Get-Milestones.ps1 -Mode issues); PBIs and Bugs need no read of their own (#127)
    $list = Get-Json @('-File', $MilestoneScript, '-Mode', 'issues', '-Name', $Milestone, '-State', 'open') -Pwsh
    foreach ($item in @($list.issues)) {
      if (-not $item) { continue }
      if ($item.labels -contains 'pbi' -or $item.labels -contains 'bug') {
        if (-not $seen.ContainsKey([int]$item.number)) { $seen[[int]$item.number] = $true; $found.Add([pscustomobject]@{ Number = [int]$item.number; Labels = @($item.labels) }) }
      } else { Add-Pbis ([int]$item.number) $seen $found }
    }
  }
  # release-review pause (references/release-review.md): nothing open, but a closed PBI or Bug of the milestone carries needs-decision
  $paused = $false
  if ($Milestone -and $found.Count -eq 0) {
    $closed = Get-Json @('-File', $MilestoneScript, '-Mode', 'issues', '-Name', $Milestone, '-State', 'closed') -Pwsh
    $paused = [bool]@(@($closed.issues) | Where-Object { $_ -and $_.labels -contains 'needs-decision' -and ($_.labels -contains 'pbi' -or $_.labels -contains 'bug') })
  }
  $eligible = @($found | Where-Object { -not ($_.Labels | Where-Object { $Held -contains $_ }) })
  $ready = @($eligible | Where-Object {
      $blockers = @(Get-Json @('api', "repos/{owner}/{repo}/issues/$($_.Number)/dependencies/blocked_by?per_page=100"))
      -not ($blockers | Where-Object { $_ -and $_.state -eq 'open' })
    })
  [pscustomobject]@{
    Open     = $found.Count
    Paused   = $paused
    Eligible = @($eligible | ForEach-Object { $_.Number } | Sort-Object)
    Ready    = @($ready | ForEach-Object { $_.Number } | Sort-Object)
  }
}

function Get-StopReason($state) {
  if ($state.Open -eq 0) { return $(if ($state.Paused) { 'blocked' } else { 'done' }) }
  if ($state.Ready.Count -eq 0) { return 'blocked' }
  return $null
}

# Room for a cut text: the terminal width minus time, agent prefix and tool name (40); 120 when stdout is redirected.
function Get-LineWidth {
  if ([Console]::IsOutputRedirected) { return 120 }
  $w = try { [Console]::WindowWidth } catch { 0 }
  return [Math]::Max(120, $w - 40)
}

function Get-Short([string]$s, [int]$n = 0) {
  if ($n -le 0) { $n = Get-LineWidth }
  $first = (($s -split "`r?`n") | Where-Object { $_.Trim() } | Select-Object -First 1)
  if (-not $first) { return '' }
  if ($first.Length -gt $n) { return $first.Substring(0, $n) + '…' }
  return $first
}

function Get-Attention([string]$step, [string]$result) {
  switch -Regex ($step) {
    '^pr$' { return 'PR opened' }
    '^review$' { if ($result -match 'fix') { return 'review fix round' } }
    '^ci$' { if ($result -match 'red|fail') { return 'CI red' } }
    '^merge(d)?$' { return 'merged' }
  }
  if ($result -match '\bpaused\b' -or $step -eq 'paused') { return 'paused' }
  if ($result -match '\bblocked\b' -or $step -eq 'blocked') { return 'blocked' }
  return $null
}

# Color of a progress line in the pane: PR opened, merged, done green; the other attention steps yellow.
function Get-StepColor([string]$step, [string]$result) {
  if ($step -eq 'done') { return 'green' }
  $why = Get-Attention $step $result
  if ($why -in 'PR opened', 'merged') { return 'green' }
  if ($why) { return 'yellow' }
  return ''
}

# Steps shared by both harnesses: a tool call, assistant text (with progress lines of deliver), a tool error.
function Write-ToolStep([string]$prefix, [string]$name, $in) {
  $what = ''
  foreach ($k in 'description', 'file_path', 'command', 'pattern', 'path') {
    if ($in.$k) { $what = Get-Short ([string]$in.$k); break }
  }
  Write-Step "$prefix$name $what" -Tool $name -ToolAt $prefix.Length
}

function Write-TextStep([string]$prefix, [string]$text, [int]$position, [int]$total) {
  $color = ''
  if (-not $prefix) {
    foreach ($l in ($text -split "`r?`n")) { if ($l -match '^#\d+ ([\w-]+): (.*)$') { $color = Get-StepColor $Matches[1] $Matches[2]; if ($color) { break } } }
  }
  Write-Step "$prefix» $(Get-Short $text)" $color
  if ($prefix) { return }
  foreach ($l in ($text -split "`r?`n")) {
    if ($l -match '^#(\d+) ([\w-]+): (.*)$') {
      Set-Pane $Matches[1] "$position/$total $($Matches[2]): $($Matches[3])"
      $why = Get-Attention $Matches[2] $Matches[3]
      if ($why -in 'paused', 'blocked') { $script:Paused = $true; Set-AgentState 'blocked' }
      if ($why) { Send-Notice "#$($Matches[1]) $why" }
    }
  }
}

# One stream-json record of Claude Code: summary line, progress lines of deliver (top level only), tool errors.
function Read-Record([string]$line, [int]$position, [int]$total) {
  try { $rec = $line | ConvertFrom-Json } catch { Write-Step "? $(Get-Short $line)"; return }
  $parent = $rec.parent_tool_use_id
  $prefix = if ($parent -and $AgentNames.ContainsKey($parent)) { "[$($AgentNames[$parent])] " } elseif ($parent) { '[subagent] ' } else { '' }
  foreach ($c in @($rec.message.content)) {
    if (-not $c) { continue }
    if ($rec.type -eq 'assistant' -and $c.type -eq 'tool_use') {
      if ($c.name -in 'Agent', 'Task') { $AgentNames[$c.id] = Get-Short ([string]$c.input.description) 60 }
      Write-ToolStep $prefix $c.name $c.input
    } elseif ($rec.type -eq 'assistant' -and $c.type -eq 'text') {
      Write-TextStep $prefix $c.text $position $total
    } elseif ($rec.type -eq 'user' -and $c.type -eq 'tool_result' -and $c.is_error) {
      $body = if ($c.content -is [string]) { $c.content } else { ($c.content | ForEach-Object { $_.text }) -join "`n" }
      Write-Step "$prefix✗ $(Get-Short $body)" 'red'
    }
  }
}

# One JSONL event of Copilot CLI (--output-format json): {type, data}. Tool calls come as tool.execution_start,
# failures as tool.execution_complete with success=false, text as assistant.message. Subagent steps get the
# agentDisplayName of subagent.started as prefix (events with a parentToolCallId; [subagent] if unknown). Unknown event types are ignored (only logged to the jsonl).
function Read-CopilotRecord([string]$line, [int]$position, [int]$total) {
  try { $rec = $line | ConvertFrom-Json } catch { Write-Step "? $(Get-Short $line)"; return }
  $d = $rec.data
  $prefix = if ($d.parentToolCallId -and $AgentNames.ContainsKey($d.parentToolCallId)) { "[$($AgentNames[$d.parentToolCallId])] " } elseif ($d.parentToolCallId) { '[subagent] ' } else { '' }
  switch ($rec.type) {
    'subagent.started' { if ($d.toolCallId) { $script:AgentNames[$d.toolCallId] = Get-Short ([string]($d.agentDisplayName ?? $d.agentName)) 60 } }
    'tool.execution_start' {
      Write-ToolStep $prefix $d.toolName $d.arguments
    }
    'assistant.message' { if ($d.content) { Write-TextStep $prefix ([string]$d.content) $position $total } }
    'tool.execution_complete' {
      if ($d.success -eq $false) {
        $body = if ($d.error.message) { [string]$d.error.message } elseif ($d.result.content) { [string]$d.result.content } else { 'tool failed' }
        Write-Step "$prefix✗ $(Get-Short $body)" 'red'
      }
    }
  }
}

function Invoke-Iteration([int]$n, [int]$total, $state) {
  New-Item -ItemType Directory -Force -Path $RunDir | Out-Null
  $jsonl = Join-Path $RunDir "$($state.Ready[0]).jsonl"
  $targets = @($Nrs | ForEach-Object { "$_" })
  if ($Milestone) { $targets += @('--milestone', $Milestone) }
  $prompt = "/deliver $($targets -join ' ') --unattended --max 1"
  Write-Step "iteration $n/$total start: $prompt"
  $script:Paused = $false
  Set-AgentState 'working'
  Set-Pane "$($state.Ready[0])" "$n/$total starting"
  $saved = $env:HERDR_ENV
  $env:HERDR_ENV = ''
  try {
    $cli = if ($Harness -eq 'copilot') {
      @('-p', $prompt, '--model', $Model, '--allow-all-tools', '--allow-all-paths', '--allow-all-urls', '--no-ask-user', '--output-format', 'json')
    } else {
      @('-p', $prompt, '--model', $Model, '--permission-mode', 'auto', '--output-format', 'stream-json', '--verbose')
    }
    & $Harness @cli 2>&1 | ForEach-Object {
      $line = "$_"
      if ($_ -is [System.Management.Automation.ErrorRecord]) { Write-Step "stderr $(Get-Short $line)" 'red'; return }
      [IO.File]::AppendAllText($jsonl, $line + "`n")
      if ($Harness -eq 'copilot') { Read-CopilotRecord $line $n $total } else { Read-Record $line $n $total }
    }
    if ($LASTEXITCODE -ne 0) { Write-Step "$Harness exited with $LASTEXITCODE" 'red' }
  } finally { $env:HERDR_ENV = $saved }
}

$result = 'done'
$code = 0
$i = 0
try {
  if ($LogPane) { Open-LogPane -LogFile $(if ($AnsiFile) { $AnsiFile } else { $LogFile }) }
  if (Test-PaneHasOtherAgent) {
    $script:AgentStateOff = $true
    Write-Step 'herdr agent state not reported: another agent runs in this pane (start the loop in its own pane)' 'yellow'
  }
  $state = Get-State
  $result = Get-StopReason $state
  $total = if ($Max -gt 0) { [Math]::Min($Max, $state.Eligible.Count) } else { $state.Eligible.Count }
  while (-not $result) {
    $i++
    Invoke-Iteration $i $total $state
    $after = Get-State
    if (($after.Eligible -join ',') -eq ($state.Eligible -join ',')) {
      $result = 'no progress'
      Write-Step 'no progress: the open PBIs did not change. Last log lines:' 'yellow'
      foreach ($l in $Recent.ToArray()) { Write-Host "  $l" }
      break
    }
    $state = $after
    $result = Get-StopReason $state
    if (-not $result -and $Max -gt 0 -and $i -ge $Max) { $result = 'max reached' }
  }
  $code = switch ($result) { 'no progress' { 1 } 'blocked' { 2 } default { 0 } }
  $color = if ($result -in 'done', 'max reached') { 'green' } else { 'yellow' }
  Write-Step "loop result: $result ($i iteration(s), $($state.Open) PBI(s) open)" $color
  Send-Notice "loop result: $result"
  Set-AgentState $(if (($result -in 'blocked','no progress') -or $Paused) { 'blocked' } else { 'idle' })
} finally {
  Set-Pane -Clear
  Set-AgentState -Release
}
exit $code
