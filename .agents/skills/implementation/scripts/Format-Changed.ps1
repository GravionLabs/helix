<#
.SYNOPSIS
  Runs a format (or check) command on the changed files with the given extensions.
  Without -Language, -Extensions and -Command the changed files are grouped by extension (.ts .tsx .js .jsx .mjs .cjs .json .css .html: ts; .py: py;
  .cs .csproj .sln .slnx: dotnet; .rs: rust; .go: go) and each detected language runs its defaults (a `format.<Language>` config entry still replaces them); other extensions are ignored.
  Precedence: `.agents/config.json` entry `format.<Language>` (legacy `.agents/format.json`; `"format": false` disables), then explicit -Extensions/-Command, then the built-in defaults of -Language
  (ts, ng: prettier then eslint, or biome check when biome.json[c] is at the git toplevel; py: ruff format then ruff check --fix;
  dotnet: dotnet format; rust: cargo fmt; go: gofmt).
.PARAMETER Language
  Key into `format` of `<repo>/.agents/config.json`; an entry there replaces -Extensions, -Command and -Requires (a configured tool that is missing is an error).
  Without -Extensions and -Command it also selects the built-in defaults (ts, ng, py, dotnet, rust, go); -Check uses their read-only variants.
.PARAMETER Extensions
  Extensions to keep, e.g. '.ts','.tsx' (one comma-separated string works too; the leading dot is optional).
.PARAMETER Command
  Command line with a {files} placeholder, e.g. 'npx prettier --write {files}'. Without the placeholder the files are appended.
.PARAMETER Requires
  Optional probe command; it must exit 0 (e.g. 'npx --no-install prettier --version'), otherwise the run is skipped with `skipped: <tool> not configured`.
.PARAMETER Check
  Read-only intent: the command passed is the check command; the success line reads `checked: <n> files`.
.PARAMETER Base
  Also include the files changed in `<Base>...HEAD`. Default: uncommitted changes only (staged, unstaged, untracked).
.PARAMETER WhatIf
  Prints the resolved steps (override, -Command or defaults; -Check selects the check commands) as JSON
  `[{ tool, extensions, requires, commands }]` and exits 0 without probing or running anything.
#>
param(
  [string]$Language,
  [string[]]$Extensions,
  [string]$Command,
  [switch]$Check,
  [string]$Requires,
  [string]$Base,
  [switch]$WhatIf
)
$ErrorActionPreference = 'Stop'

$root = (& git rev-parse --show-toplevel 2>$null)
if ($LASTEXITCODE -ne 0 -or -not $root) { Write-Output 'skipped: not a git repository'; exit 0 }

function Stop-Fail([string]$Message) { Write-Error "error: $Message" -ErrorAction Continue; exit 1 }
# `1 -is [pscustomobject]` is true in PowerShell: ask for the real type
function Test-JsonObject($Value) { $null -ne $Value -and $Value.GetType().Name -eq 'PSCustomObject' }

# NUL-separated output (-z): names with spaces, quotes or non-ASCII characters arrive unquoted
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
function Stop-Git($Out, [int]$Code) { Write-Error (($Out | Out-String).Trim()) -ErrorAction Continue; exit $(if ($Code) { $Code } else { 1 }) }
function Split-GitNames($Out) { (@($Out) -join "`n") -split "`0" | Where-Object { $_ } }
function Get-GitNames {
  param([string[]]$GitArgs)
  $out = & git -C $root @GitArgs 2>&1
  if ($LASTEXITCODE -ne 0) { Stop-Git $out $LASTEXITCODE }
  Split-GitNames $out
}
function Get-ChangedFiles {
$names = [System.Collections.Generic.List[string]]::new()
if ($Base) {
  # a bad ref must fail loudly: a swallowed error would let -Check pass with nothing checked
  Get-GitNames @('diff', '--name-only', '-z', "$Base...HEAD", '--') | ForEach-Object { $names.Add($_) }
}
# staged + unstaged vs HEAD; a repository without a commit has no HEAD: the index instead (HEAD is probed only when the diff fails)
$out = & git -C $root diff --name-only -z HEAD -- 2>&1
if ($LASTEXITCODE -eq 0) { Split-GitNames $out | ForEach-Object { $names.Add($_) } }
else {
  $diffCode = $LASTEXITCODE
  & git -C $root rev-parse --verify -q HEAD *> $null
  if ($LASTEXITCODE -eq 0) { Stop-Git $out $diffCode }
  Get-GitNames @('diff', '--name-only', '-z', '--cached', '--') | ForEach-Object { $names.Add($_) }
}
Get-GitNames @('ls-files', '--others', '--exclude-standard', '-z') | ForEach-Object { $names.Add($_) }

# repo-relative, existing (deleted dropped), no duplicates
@($names | Select-Object -Unique | Where-Object { $_ -and (Test-Path -LiteralPath (Join-Path $root $_) -PathType Leaf) })
}

$code = 0
# no -Language, -Extensions, -Command: group the changed files by extension, run the defaults of each detected language
if (-not $Language -and -not $Extensions -and -not $Command) {
  $langOf = @{}
  foreach ($e in '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.css', '.html') { $langOf[$e] = 'ts' }
  $langOf['.py'] = 'py'
  foreach ($e in '.cs', '.csproj', '.sln', '.slnx') { $langOf[$e] = 'dotnet' }
  $langOf['.rs'] = 'rust'; $langOf['.go'] = 'go'
  # Markdown and YAML only in a Biome project (Biome >= 2.6 formats them)
  if ((Test-Path -LiteralPath (Join-Path $root 'biome.json') -PathType Leaf) -or (Test-Path -LiteralPath (Join-Path $root 'biome.jsonc') -PathType Leaf)) {
    foreach ($e in '.md', '.yml', '.yaml') { $langOf[$e] = 'ts' }
  }
  $present = @(Get-ChangedFiles | ForEach-Object { $langOf[[IO.Path]::GetExtension($_).ToLowerInvariant()] } | Where-Object { $_ })
  $detected = @('ts', 'py', 'dotnet', 'rust', 'go' | Where-Object { $present -contains $_ })
  $all = @()
  foreach ($l in $detected) {
    $sp = @{ Language = $l }
    if ($Check) { $sp.Check = $true }
    if ($Base) { $sp.Base = $Base }
    if ($WhatIf) { $sp.WhatIf = $true }
    if ($WhatIf) { $json = (& $PSCommandPath @sp | Out-String); if ($LASTEXITCODE -eq 0 -and $json.Trim()) { $all += @($json | ConvertFrom-Json) } }
    else { & $PSCommandPath @sp }
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  }
  if ($WhatIf) { ConvertTo-Json -Depth 4 -InputObject @($all) }
  elseif ($detected.Count -eq 0) { Write-Output 'skipped: no changed files' }
  exit 0
}

# per-project override: an entry for -Language replaces extensions and ALL default commands
# source: `.agents/config.json` key `format` (false disables, else a map language -> entry); the legacy `.agents/format.json` (the map itself) is honoured when config.json has no `format` key
$commands = @(); $override = $false; $disabled = $false
$configFile = Join-Path $root '.agents/config.json'
$legacyFile = Join-Path $root '.agents/format.json'
$srcName = '.agents/config.json'
$formatCfg = $null; $haveFormat = $false
if ($Language) {
  if (Test-Path -LiteralPath $configFile -PathType Leaf) {
    try { $cfg = Get-Content -LiteralPath $configFile -Raw | ConvertFrom-Json -ErrorAction Stop }
    catch { Stop-Fail ".agents/config.json is not valid JSON ($($_.Exception.Message))" }
    if (-not (Test-JsonObject $cfg)) { Stop-Fail '.agents/config.json must be a JSON object' }
    # top-level keys come from the schema shipped next to the skill, so a typo is caught
    $schemaFile = Join-Path $PSScriptRoot '../schema/config.schema.json'
    if (Test-Path -LiteralPath $schemaFile -PathType Leaf) {
      $known = @((Get-Content -LiteralPath $schemaFile -Raw | ConvertFrom-Json).properties.PSObject.Properties.Name)
      foreach ($p in $cfg.PSObject.Properties.Name) {
        if ($known -notcontains $p) { Stop-Fail ".agents/config.json: unknown key '$p' (known: $($known -join ', '))" }
      }
    }
    $fp = $cfg.PSObject.Properties['format']
    if ($fp) {
      $haveFormat = $true; $formatCfg = $fp.Value
      if (-not (($formatCfg -is [bool] -and -not $formatCfg) -or (Test-JsonObject $formatCfg))) {
        Stop-Fail ".agents/config.json: key 'format' must be false or a map of language to entry"
      }
    }
  }
  if (Test-Path -LiteralPath $legacyFile -PathType Leaf) {
    if ($haveFormat) {
      Write-Error 'notice: .agents/config.json and the deprecated .agents/format.json both define format; .agents/config.json wins, delete .agents/format.json' -ErrorAction Continue
    }
    else {
      try { $formatCfg = Get-Content -LiteralPath $legacyFile -Raw | ConvertFrom-Json -ErrorAction Stop }
      catch { Stop-Fail ".agents/format.json is not valid JSON ($($_.Exception.Message))" }
      $haveFormat = $true; $srcName = '.agents/format.json'
      Write-Error 'notice: .agents/format.json is deprecated; move its content to the "format" key of .agents/config.json' -ErrorAction Continue
    }
  }
}
if ($haveFormat -and $formatCfg -is [bool] -and -not $formatCfg) { $disabled = $true }
elseif ($haveFormat) {
  $entry = if ($formatCfg -is [pscustomobject]) { $formatCfg.PSObject.Properties[$Language] } else { $null }
  if ($entry) {
    $override = $true
    $key = if ($Check) { 'check' } else { 'format' }
    $entryVal = $entry.Value
    $cmdProp = if ($entryVal -is [pscustomobject]) { $entryVal.PSObject.Properties[$key] } else { $null }
    if (-not $cmdProp) { Stop-Fail "${srcName}: entry '$Language' has no '$key' command" }
    $commands = @($cmdProp.Value | Where-Object { $_ -is [string] -and $_.Trim() })
    if ($commands.Count -eq 0) { Stop-Fail "${srcName}: entry '$Language' has an empty '$key' command" }
    $extProp = $entryVal.PSObject.Properties['extensions']
    if ($extProp) { $Extensions = @($extProp.Value) }
    # commands come from a repo-controlled file: say so (no gate)
    Write-Error "notice: running commands from $srcName for '$Language'" -ErrorAction Continue
  }
}
if ($disabled) {
  if ($WhatIf) { ConvertTo-Json -InputObject @() } else { Write-Output 'skipped: disabled' }
  exit 0
}
# defaults per language: ordered steps, each with its own extensions, probe and commands (format / check)
$exts5 = @('.ts', '.tsx', '.js', '.mjs', '.cjs')
$defaults = @{
  ts     = @(
    @{ Tool = 'prettier'; Ext = $exts5 + @('.jsx', '.json', '.css', '.html'); Requires = 'npx --no-install prettier --version'; Format = @('npx --no-install prettier --write {files}'); Check = @('npx --no-install prettier --check {files}') },
    @{ Tool = 'eslint'; Ext = $exts5 + '.jsx'; Requires = 'npx --no-install eslint --version'; Format = @('npx --no-install eslint --fix {files}'); Check = @('npx --no-install eslint {files}') })
  # ng: the ts tools on the Angular extensions (.scss, no .jsx)
  ng     = @(
    @{ Tool = 'prettier'; Ext = $exts5 + @('.json', '.html', '.scss', '.css'); Requires = 'npx --no-install prettier --version'; Format = @('npx --no-install prettier --write {files}'); Check = @('npx --no-install prettier --check {files}') },
    @{ Tool = 'eslint'; Ext = $exts5; Requires = 'npx --no-install eslint --version'; Format = @('npx --no-install eslint --fix {files}'); Check = @('npx --no-install eslint {files}') })
  py     = @(
    @{ Tool = 'ruff'; Ext = @('.py', '.pyi'); Requires = 'uv run ruff --version'; Format = @('uv run ruff format {files}', 'uv run ruff check --fix {files}'); Check = @('uv run ruff format --check {files}', 'uv run ruff check {files}') })
  dotnet = @(
    @{ Tool = 'dotnet'; Ext = @('.cs'); Requires = 'dotnet format --version'; Format = @('dotnet format --include {files}'); Check = @('dotnet format --verify-no-changes --include {files}') })
  rust   = @(
    @{ Tool = 'cargo'; Ext = @('.rs'); Requires = 'cargo fmt --version'; Format = @('cargo fmt -- {files}'); Check = @('cargo fmt -- --check {files}') })
  # gofmt ships with go and has no --version: the not-found check is the probe
  go     = @(
    @{ Tool = 'gofmt'; Ext = @('.go'); Requires = $null; Format = @('gofmt -w {files}'); Check = @('gofmt -l {files}') })
}
# a Biome project (biome.json[c] at the toplevel) replaces prettier + eslint with one biome step on the prettier extensions plus Markdown and YAML
if ((Test-Path -LiteralPath (Join-Path $root 'biome.json') -PathType Leaf) -or (Test-Path -LiteralPath (Join-Path $root 'biome.jsonc') -PathType Leaf)) {
  foreach ($lang in 'ts', 'ng') {
    $defaults[$lang] = @(@{ Tool = 'biome'; Ext = $defaults[$lang][0].Ext + @('.md', '.yml', '.yaml'); Requires = 'npx --no-install biome --version'; Format = @('npx biome check --write --no-errors-on-unmatched {files}'); Check = @('npx biome check --no-errors-on-unmatched {files}') })
  }
}

$steps = @()
if ($override) {
  if (-not $Extensions) { Stop-Fail '-Extensions is required (no $srcName entry supplies them)' }
  $steps = @(@{ Tool = $null; Ext = $Extensions; Requires = $null; Commands = $commands })
}
elseif (-not $Command -and -not $Extensions -and $Language -and $defaults.ContainsKey($Language)) {
  $mode = if ($Check) { 'Check' } else { 'Format' }
  $steps = @($defaults[$Language] | ForEach-Object { @{ Tool = $_.Tool; Ext = $_.Ext; Requires = $_.Requires; Commands = $_[$mode] } })
}
else {
  if (-not $Command) { Stop-Fail '-Command is required (no $srcName entry or built-in default applies)' }
  if (-not $Extensions) { Stop-Fail '-Extensions is required (no $srcName entry supplies them)' }
  $steps = @(@{ Tool = $null; Ext = $Extensions; Requires = $Requires; Commands = @($Command) })
}
if ($WhatIf) {
  ConvertTo-Json -Depth 4 -InputObject @($steps | ForEach-Object { [ordered]@{ tool = $_.Tool; extensions = @($_.Ext); requires = $(if ($_.Requires) { $_.Requires } else { $null }); commands = @($_.Commands) } })
  exit 0
}
foreach ($st in $steps) { $st.Plans = @($st.Commands | ForEach-Object { , @($_.Trim() -split '\s+' | Where-Object { $_ }) }) }
if ($override) {
  # a configured tool that is missing is an error even when nothing changed
  foreach ($t in $steps[0].Plans) {
    if (-not (Get-Command $t[0] -ErrorAction SilentlyContinue)) { Stop-Fail "$($t[0]) not found (configured in $srcName for $Language)" }
  }
}

function ConvertTo-Ext($List) {
  @($List | ForEach-Object { $_ -split ',' } | Where-Object { $_.Trim() } |
    ForEach-Object { $e = $_.Trim().ToLowerInvariant(); if ($e.StartsWith('.')) { $e } else { ".$e" } })
}

$existing = Get-ChangedFiles

function Get-ArgList([string[]]$Tokens, [string[]]$Safe) {
  $argList = [System.Collections.Generic.List[string]]::new()
  $placed = $false
  foreach ($t in $Tokens | Select-Object -Skip 1) {
    if ($t -eq '{files}') { foreach ($f in $Safe) { $argList.Add($f) }; $placed = $true }
    elseif ($t.Contains('{files}')) { $argList.Add($t.Replace('{files}', ($Safe -join ';'))); $placed = $true } # embedded: files joined by ';'
    else { $argList.Add($t) }
  }
  if (-not $placed) { foreach ($f in $Safe) { $argList.Add($f) } }
  , $argList.ToArray()
}

$done = [System.Collections.Generic.HashSet[string]]::new()
$skipped = 0
Push-Location -LiteralPath $root
try {
  foreach ($st in $steps) {
    $exts = ConvertTo-Ext $st.Ext
    $files = @($existing | Where-Object { $exts -contains ([IO.Path]::GetExtension($_).ToLowerInvariant()) })
    if ($files.Count -eq 0) { continue }
    if (-not $override) {
      $t = $st.Plans[0]
      if (-not (Get-Command $t[0] -ErrorAction SilentlyContinue)) { Write-Output "skipped: $($t[0]) not found"; $skipped++; continue }
    }
    if ($st.Requires -and -not $override) {
      $rt = @($st.Requires.Trim() -split '\s+' | Where-Object { $_ })
      $ok = $false
      if (Get-Command $rt[0] -ErrorAction SilentlyContinue) {
        $ra = @($rt | Select-Object -Skip 1)
        & $rt[0] @ra *> $null; $ok = ($LASTEXITCODE -eq 0)
      }
      if (-not $ok) { $name = if ($st.Tool) { $st.Tool } else { $rt[0] }; Write-Output "skipped: $name not configured"; $skipped++; continue }
    }
    # every file is its own argument (no shell quoting); the command never sees `.` or a directory
    # a name starting with '-' must not read as an option
    $safe = @($files | ForEach-Object { if ($_.StartsWith('-')) { "./$_" } else { $_ } })
    foreach ($t in $st.Plans) {
      $al = Get-ArgList $t $safe
      & $t[0] @al
      if ($LASTEXITCODE -ne 0) { $code = $LASTEXITCODE; break }
    }
    if ($code -ne 0) { break }
    foreach ($f in $files) { $null = $done.Add($f) }
  }
} finally { Pop-Location }
if ($code -ne 0) { exit $code }
if ($done.Count -gt 0) { Write-Output ("{0}: {1} files" -f ($(if ($Check) { 'checked' } else { 'formatted' }), $done.Count)) }
elseif ($skipped -eq 0) { Write-Output 'skipped: no changed files' }
