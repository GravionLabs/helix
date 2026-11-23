<#
.SYNOPSIS
  Runs a format (or check) command on the changed files with the given extensions.
  Without -Language, -Extensions and -Command the changed files are grouped by extension (.ts .tsx .js .jsx .mjs .cjs .json .css .html: ts; .py: py;
  .cs .csproj .sln .slnx: dotnet; .rs: rust; .go: go) and each detected language runs its defaults (a `format.<Language>` config entry still replaces them); other extensions are ignored.
  Precedence: `.agents/config.json` entry `format.<Language>` (legacy `.agents/format.json`; `"format": false` disables), then explicit -Extensions/-Command, then the built-in defaults of -Language
  (ts, ng: prettier then eslint, or biome check when biome.json[c] is at the git toplevel; in an oxc project oxfmt instead of prettier
  (.oxfmtrc.json[c]) and oxlint --fix instead of eslint (.oxlintrc.json), ng then eslint on .html only; py: ruff format then ruff check --fix;
  dotnet: dotnet format; rust: cargo fmt; go: gofmt).
.PARAMETER Language
  Key into `format` of `<repo>/.agents/config.json`; an entry there replaces -Extensions, -Command and -Requires (a configured tool that is missing is an error).
  Without -Extensions and -Command it also selects the built-in defaults (ts, ng, py, dotnet, rust, go); -Check uses their read-only variants.
.PARAMETER Extensions
  Extensions to keep, e.g. '.ts','.tsx' (one comma-separated string works too; the leading dot is optional).
.PARAMETER Command
  Command line with a {files} placeholder, e.g. 'npx prettier --write {files}'. Without the placeholder the files are appended.
.PARAMETER Lint
  Lint instead of format: reads the `lint` key of `.agents/config.json` (`false` disables; entry `lint.<Language>` with `command` (string or array) and optional `extensions`),
  else the built-in lint defaults of -Language (ts, ng: eslint, or biome lint in a Biome project, or oxlint (ng: plus eslint on .html) with .oxlintrc.json; py: ruff check; dotnet: dotnet format analyzers; rust: cargo clippy; go: golangci-lint).
  Read-only: a command that exits non-zero fails the run with that exit code; a command without {files} runs as it is (no files appended); the success line reads `linted: <n> files`. Not combinable with -Check.
.PARAMETER Requires
  Optional probe command; it must exit 0 (e.g. 'npx --no-install prettier --version'), otherwise the run is skipped with `skipped: <tool> not configured`.
.PARAMETER Check
  Read-only intent: the command passed is the check command; the success line reads `checked: <n> files`.
.PARAMETER Base
  Also include the files changed in `<Base>...HEAD`. Default: uncommitted changes only (staged, unstaged, untracked).
.PARAMETER Staged
  Only the staged files (`git diff --cached --name-only --diff-filter=ACMR`), for a pre-commit hook; unstaged and untracked files and -Base are ignored.
.PARAMETER WhatIf
  Prints the resolved steps (override, -Command or defaults; -Check selects the check commands) as JSON
  `[{ tool, extensions, requires, commands }]` and exits 0 without probing or running anything.
#>
param(
  [string]$Language,
  [string[]]$Extensions,
  [string]$Command,
  [switch]$Check,
  [switch]$Lint,
  [string]$Requires,
  [string]$Base,
  [switch]$Staged,
  [switch]$WhatIf
)
$ErrorActionPreference = 'Stop'
if ($Lint -and $Check) { Write-Error 'error: -Lint and -Check cannot be combined' -ErrorAction Continue; exit 1 }

$root = (& git rev-parse --show-toplevel 2>$null)
if ($LASTEXITCODE -ne 0 -or -not $root) { Write-Output 'skipped: not a git repository'; exit 0 }

# a config file at the git toplevel (a nested one is no project config)
function Test-TopFile([string]$Name) { Test-Path -LiteralPath (Join-Path $root $Name) -PathType Leaf }
$hasBiome = (Test-TopFile 'biome.json') -or (Test-TopFile 'biome.jsonc')
$hasOxfmt = (Test-TopFile '.oxfmtrc.json') -or (Test-TopFile '.oxfmtrc.jsonc')
$hasOxlint = Test-TopFile '.oxlintrc.json'
# Stylelint (ADR 0008): any stylelint.config.* or .stylelintrc* at the toplevel
$hasStylelint = [bool](Get-ChildItem -LiteralPath $root -File -Force -ErrorAction SilentlyContinue | Where-Object { $_.Name -like 'stylelint.config.*' -or $_.Name -like '.stylelintrc*' })

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
if ($Staged) {
  $st = @(Get-GitNames @('diff', '--cached', '--name-only', '-z', '--diff-filter=ACMR', '--'))
  return @($st | Select-Object -Unique | Where-Object { $_ -and (Test-Path -LiteralPath (Join-Path $root $_) -PathType Leaf) })
}
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
  # Markdown and YAML only in a Biome project (Biome >= 2.6 formats them) or an oxfmt project
  if ($hasBiome -or $hasOxfmt) {
    foreach ($e in '.md', '.yml', '.yaml') { $langOf[$e] = 'ts' }
  }
  $present = @(Get-ChangedFiles | ForEach-Object { $langOf[[IO.Path]::GetExtension($_).ToLowerInvariant()] } | Where-Object { $_ })
  $detected = @('ts', 'py', 'dotnet', 'rust', 'go' | Where-Object { $present -contains $_ })
  $all = @()
  foreach ($l in $detected) {
    $sp = @{ Language = $l }
    if ($Check) { $sp.Check = $true }
    if ($Lint) { $sp.Lint = $true }
    if ($Base) { $sp.Base = $Base }
    if ($Staged) { $sp.Staged = $true }
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
$cfgKey = if ($Lint) { 'lint' } else { 'format' }
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
    $fp = $cfg.PSObject.Properties[$cfgKey]
    if ($fp) {
      $haveFormat = $true; $formatCfg = $fp.Value
      if (-not (($formatCfg -is [bool] -and -not $formatCfg) -or (Test-JsonObject $formatCfg))) {
        Stop-Fail ".agents/config.json: key '$cfgKey' must be false or a map of language to entry"
      }
    }
  }
  if (-not $Lint -and (Test-Path -LiteralPath $legacyFile -PathType Leaf)) {
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
    $key = if ($Lint) { 'command' } elseif ($Check) { 'check' } else { 'format' }
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
$plainDefaults = @{ ts = $defaults['ts']; ng = $defaults['ng'] }
# a Biome project (biome.json[c] at the toplevel) replaces prettier + eslint with one biome step on the prettier extensions plus Markdown and YAML
if ($hasBiome) {
  foreach ($lang in 'ts', 'ng') {
    $defaults[$lang] = @(@{ Tool = 'biome'; Ext = $defaults[$lang][0].Ext + @('.md', '.yml', '.yaml'); Requires = 'npx --no-install biome --version'; Format = @('npx biome check --write --no-errors-on-unmatched {files}'); Check = @('npx biome check --no-errors-on-unmatched {files}') })
  }
}
# an oxc project (ADR 0006) wins over a biome.json[c] left from a migration: .oxfmtrc.json[c] replaces prettier with oxfmt (plus Markdown
# and YAML), .oxlintrc.json replaces eslint with oxlint --fix; ng keeps eslint for the .html templates (oxlint does not parse them)
if ($hasOxfmt -or $hasOxlint) {
  foreach ($lang in 'ts', 'ng') {
    $fmt = $plainDefaults[$lang][0]; $fix = $plainDefaults[$lang][1]
    if ($hasOxfmt) { $fmt = @{ Tool = 'oxfmt'; Ext = $fmt.Ext + @('.md', '.yml', '.yaml'); Requires = 'npx --no-install oxfmt --version'; Format = @('npx --no-install oxfmt --no-error-on-unmatched-pattern {files}'); Check = @('npx --no-install oxfmt --check --no-error-on-unmatched-pattern {files}') } }
    if ($hasOxlint) { $fix = @{ Tool = 'oxlint'; Ext = $fix.Ext; Requires = 'npx --no-install oxlint --version'; Format = @('npx --no-install oxlint --fix --no-error-on-unmatched-pattern {files}'); Check = @('npx --no-install oxlint --no-error-on-unmatched-pattern {files}') } }
    $defaults[$lang] = @($fmt, $fix)
  }
  if ($hasOxlint) { $defaults['ng'] += @{ Tool = 'eslint'; Ext = @('.html'); Requires = 'npx --no-install eslint --version'; Format = @('npx --no-install eslint --fix {files}'); Check = @('npx --no-install eslint {files}') } }
}

# lint defaults (read-only; rust runs on the whole crate, so its command has no {files})
$lintDefaults = @{
  ts     = @(@{ Tool = 'eslint'; Ext = $exts5 + '.jsx'; Requires = 'npx --no-install eslint --version'; Lint = @('npx --no-install eslint {files}') })
  ng     = @(@{ Tool = 'eslint'; Ext = $exts5; Requires = 'npx --no-install eslint --version'; Lint = @('npx --no-install eslint {files}') })
  py     = @(@{ Tool = 'ruff'; Ext = @('.py', '.pyi'); Requires = 'uv run ruff --version'; Lint = @('uv run ruff check {files}') })
  dotnet = @(@{ Tool = 'dotnet'; Ext = @('.cs'); Requires = 'dotnet format --version'; Lint = @('dotnet format analyzers --verify-no-changes --include {files}') })
  rust   = @(@{ Tool = 'cargo'; Ext = @('.rs'); Requires = 'cargo clippy --version'; Lint = @('cargo clippy --all-targets -- -D warnings') })
  go     = @(@{ Tool = 'golangci-lint'; Ext = @('.go'); Requires = 'golangci-lint --version'; Lint = @('golangci-lint run {files}') })
}
if ($hasBiome) {
  foreach ($lang in 'ts', 'ng') {
    $lintDefaults[$lang] = @(@{ Tool = 'biome'; Ext = $lintDefaults[$lang][0].Ext + @('.json', '.css', '.html'); Requires = 'npx --no-install biome --version'; Lint = @('npx biome lint --no-errors-on-unmatched {files}') })
  }
}
if ($hasOxlint) {
  $lintDefaults['ts'] = @(@{ Tool = 'oxlint'; Ext = $exts5 + '.jsx'; Requires = 'npx --no-install oxlint --version'; Lint = @('npx --no-install oxlint --no-error-on-unmatched-pattern {files}') })
  $lintDefaults['ng'] = @(@{ Tool = 'oxlint'; Ext = $exts5; Requires = 'npx --no-install oxlint --version'; Lint = @('npx --no-install oxlint --no-error-on-unmatched-pattern {files}') },
    @{ Tool = 'eslint'; Ext = @('.html'); Requires = 'npx --no-install eslint --version'; Lint = @('npx --no-install eslint {files}') })
}
# stylelint.config.* (ADR 0008): lint .css/.scss too, wherever the language lints (ts, ng)
if ($hasStylelint) {
  foreach ($lang in 'ts', 'ng') {
    $lintDefaults[$lang] += @{ Tool = 'stylelint'; Ext = @('.css', '.scss'); Requires = 'npx --no-install stylelint --version'; Lint = @('npx --no-install stylelint {files}') }
  }
}

$steps = @()
if ($override) {
  if (-not $Extensions -and $Lint -and $lintDefaults.ContainsKey($Language)) { $Extensions = @($lintDefaults[$Language] | ForEach-Object { $_.Ext }) }
  if (-not $Extensions) { Stop-Fail '-Extensions is required (no $srcName entry supplies them)' }
  $steps = @(@{ Tool = $null; Ext = $Extensions; Requires = $null; Commands = $commands })
}
elseif ($Lint -and -not $Command -and -not $Extensions -and $Language -and $lintDefaults.ContainsKey($Language)) {
  $steps = @($lintDefaults[$Language] | ForEach-Object { @{ Tool = $_.Tool; Ext = $_.Ext; Requires = $_.Requires; Commands = $_.Lint } })
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

function Get-ArgList([string[]]$Tokens, [string[]]$Safe, [bool]$AppendFiles = $true) {
  $argList = [System.Collections.Generic.List[string]]::new()
  $placed = $false
  foreach ($t in $Tokens | Select-Object -Skip 1) {
    if ($t -eq '{files}') { foreach ($f in $Safe) { $argList.Add($f) }; $placed = $true }
    elseif ($t.Contains('{files}')) { $argList.Add($t.Replace('{files}', ($Safe -join ';'))); $placed = $true } # embedded: files joined by ';'
    else { $argList.Add($t) }
  }
  if (-not $placed -and $AppendFiles) { foreach ($f in $Safe) { $argList.Add($f) } }
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
      $al = Get-ArgList $t $safe (-not $Lint)
      & $t[0] @al
      if ($LASTEXITCODE -ne 0) { $code = $LASTEXITCODE; break }
    }
    if ($code -ne 0) { break }
    foreach ($f in $files) { $null = $done.Add($f) }
  }
} finally { Pop-Location }
if ($code -ne 0) { exit $code }
if ($done.Count -gt 0) { Write-Output ("{0}: {1} files" -f ($(if ($Lint) { 'linted' } elseif ($Check) { 'checked' } else { 'formatted' }), $done.Count)) }
elseif ($skipped -eq 0) { Write-Output 'skipped: no changed files' }
