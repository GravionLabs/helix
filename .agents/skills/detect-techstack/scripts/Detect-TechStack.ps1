<#
.SYNOPSIS
  Detect the project tech stack and output a JSON report.

.DESCRIPTION
  Scans the project root recursively for indicator files and returns a JSON object
  listing detected languages, frameworks, packageManager, and the matching <lang>-test
  and <lang>-implementation skills.

.PARAMETER ProjectRoot
  Path to the project root directory.

.OUTPUTS
  JSON string to stdout. Non-zero exit code on failure.
#>
param(
  [Parameter(Mandatory)][string]$ProjectRoot
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $ProjectRoot -PathType Container)) {
  Write-Error "ProjectRoot '$ProjectRoot' does not exist or is not a directory."
  exit 1
}

function Get-IndicatorFile {
  param([string]$Path, [string]$Filter, [int]$Depth)
  Get-ChildItem -Path $Path -Recurse -Depth $Depth -Filter $Filter -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '[\\/]node_modules[\\/]' -and $_.FullName -notmatch '[\\/]\.git[\\/]' -and $_.FullName -notmatch '[\\/]\.opencode[\\/]' }
}

$rootFull = (Resolve-Path $ProjectRoot).Path
# --- tools: config files in the project root ---
function Test-RootFile([string]$Pattern) {
  [bool](Get-ChildItem -LiteralPath $rootFull -File -Filter $Pattern -Force -ErrorAction SilentlyContinue | Select-Object -First 1)
}
function Test-RootMatch([string]$Pattern, [string]$Regex) {
  foreach ($f in (Get-ChildItem -LiteralPath $rootFull -File -Filter $Pattern -Force -ErrorAction SilentlyContinue)) {
    if ((Get-Content -LiteralPath $f.FullName -Raw) -match $Regex) { return $true }
  }
  $false
}
$rootPkg = $null
if (Test-Path -LiteralPath (Join-Path $rootFull 'package.json') -PathType Leaf) {
  try { $rootPkg = Get-Content -LiteralPath (Join-Path $rootFull 'package.json') -Raw | ConvertFrom-Json -ErrorAction Stop } catch { $rootPkg = $null }
}
function Test-RootDependency([string]$Name) {
  if ($null -eq $rootPkg) { return $false }
  foreach ($section in 'dependencies', 'devDependencies') {
    if (@($rootPkg.PSObject.Properties | ForEach-Object { $_.Name }) -contains $section) {
      if (@($rootPkg.$section.PSObject.Properties | ForEach-Object { $_.Name }) -contains $Name) { return $true }
    }
  }
  $false
}
$tools = [System.Collections.Generic.List[string]]::new()
if ((Test-RootFile 'vitest.config.*') -or (Test-RootMatch 'vite.config.*' '\btest\s*:') -or (Test-RootDependency 'vitest')) { $tools.Add('vitest') }
if ((Test-RootFile 'biome.json') -or (Test-RootFile 'biome.jsonc')) { $tools.Add('biome') }
if ((Test-RootFile 'eslint.config.*') -or (Test-RootFile '.eslintrc*')) { $tools.Add('eslint') }
if ((Test-RootFile '.prettierrc*') -or (Test-RootFile 'prettier.config.*')) { $tools.Add('prettier') }
if (Test-RootFile 'jest.config.*') { $tools.Add('jest') }
if ((Test-RootFile 'pytest.ini') -or (Test-RootMatch 'pyproject.toml' '(?m)^\[tool\.pytest')) { $tools.Add('pytest') }
if (Test-RootFile 'Cargo.toml') { $tools.Add('cargo') }

$languages = [System.Collections.Generic.List[string]]::new()
$frameworks = [System.Collections.Generic.List[string]]::new()

# --- packageManager detection ---
$packageManagers = [System.Collections.Generic.List[string]]::new()

$depFrameworks = [System.Collections.Generic.HashSet[string]]::new()
$pkgJsonFiles = Get-IndicatorFile -Path $rootFull -Filter "package.json" -Depth 5
foreach ($pkg in $pkgJsonFiles) {
  try {
    $content = Get-Content $pkg.FullName -Raw | ConvertFrom-Json -ErrorAction Stop
    foreach ($section in 'dependencies', 'devDependencies') {
      if (@($content.PSObject.Properties.Name) -contains $section -and $null -ne $content.$section) {
        foreach ($dep in $content.$section.PSObject.Properties.Name) { [void]$depFrameworks.Add($dep) }
      }
    }
    if ($content.packageManager) {
      $name = ($content.packageManager -split '@')[0]
      if (-not $packageManagers.Contains($name)) {
        $packageManagers.Add($name)
      }
    }
  } catch {
    continue
  }
}

# --- JS frameworks from dependencies (language stays ts/js) ---
foreach ($fw in 'react', 'next', 'vue', 'svelte') {
  if ($depFrameworks.Contains($fw) -and -not $frameworks.Contains($fw)) { $frameworks.Add($fw) }
}

$lockfileChecks = @(
  @{ Name = "pnpm-lock.yaml"; Value = "pnpm" }
  @{ Name = "bun.lockb";      Value = "bun" }
  @{ Name = "yarn.lock";      Value = "yarn" }
  @{ Name = "package-lock.json"; Value = "npm" }
  @{ Name = "uv.lock";        Value = "uv" }
  @{ Name = "Cargo.toml";     Value = "cargo" }
  @{ Name = "go.mod";         Value = "go" }
)

foreach ($entry in $lockfileChecks) {
  $found = Get-IndicatorFile -Path $rootFull -Filter $entry.Name -Depth 5
  if ($found -and -not $packageManagers.Contains($entry.Value)) {
    $packageManagers.Add($entry.Value)
  }
}

$csprojForPkg = Get-IndicatorFile -Path $rootFull -Filter "*.csproj" -Depth 5
if ($csprojForPkg -and -not $packageManagers.Contains("dotnet")) {
  $packageManagers.Add("dotnet")
}

# --- Angular ---
$angularJson = Get-IndicatorFile -Path $rootFull -Filter "angular.json" -Depth 5
if ($angularJson) {
  $frameworks.Add("angular")
  if (-not $languages.Contains("typescript")) {
    $languages.Add("typescript")
  }
}

# --- TypeScript (package.json + tsconfig.json pair in same directory) ---
$allPkgJson = Get-IndicatorFile -Path $rootFull -Filter "package.json" -Depth 5
$hasTypescript = $false
foreach ($pkg in $allPkgJson) {
  $tsConfig = Join-Path $pkg.Directory.FullName "tsconfig.json"
  if (Test-Path $tsConfig) {
    $hasTypescript = $true
    break
  }
}
if ($hasTypescript) {
  if (-not $languages.Contains("typescript")) {
    $languages.Add("typescript")
  }
}

# --- JavaScript (package.json exists but no tsconfig.json anywhere) ---
$hasAnyTsConfig = Get-IndicatorFile -Path $rootFull -Filter "tsconfig.json" -Depth 5
if ($allPkgJson -and -not $hasAnyTsConfig) {
  if (-not $languages.Contains("javascript")) {
    $languages.Add("javascript")
  }
}

# --- Python ---
$pyIndicators = @("pyproject.toml", "requirements.txt", "setup.py")
$hasPython = $false
foreach ($indicator in $pyIndicators) {
  $found = Get-IndicatorFile -Path $rootFull -Filter $indicator -Depth 5
  if ($found) {
    $hasPython = $true
    break
  }
}
if ($hasPython) {
  $languages.Add("python")
}

# --- .NET / C# ---
$csprojFiles = Get-IndicatorFile -Path $rootFull -Filter "*.csproj" -Depth 5
$slnFiles = Get-IndicatorFile -Path $rootFull -Filter "*.sln" -Depth 5
$slnxFiles = Get-IndicatorFile -Path $rootFull -Filter "*.slnx" -Depth 5
if ($csprojFiles -or $slnFiles -or $slnxFiles) {
  $languages.Add("csharp")
  $frameworks.Add("dotnet")
}

# --- Aspire AppHost: SDK-style csproj or file-based apphost (#:sdk directive, .NET 10) ---
$aspireRx = 'Aspire\.AppHost\.Sdk'
$aspireFound = $false
foreach ($f in @($csprojFiles)) {
  if ($f -and (Get-Content -LiteralPath $f.FullName -Raw -ErrorAction SilentlyContinue) -match $aspireRx) { $aspireFound = $true; break }
}
if (-not $aspireFound) {
  foreach ($f in @(Get-IndicatorFile -Path $rootFull -Filter "*.cs" -Depth 5 | Where-Object { $_.FullName -notmatch '[\\/](bin|obj)[\\/]' })) {
    if ((Get-Content -LiteralPath $f.FullName -Raw -ErrorAction SilentlyContinue) -match '(?m)^#:sdk\s+Aspire\.AppHost\.Sdk') { $aspireFound = $true; break }
  }
}
if ($aspireFound) {
  if (-not $languages.Contains("csharp")) { $languages.Add("csharp") }
  if (-not $frameworks.Contains("dotnet")) { $frameworks.Add("dotnet") }
  $frameworks.Add("aspire")
}

# --- Rust (+ Tauri 1 and 2) ---
# build output and vendored crates carry their own Cargo.toml; they do not make the project Rust
if (Get-IndicatorFile -Path $rootFull -Filter "Cargo.toml" -Depth 5 |
    Where-Object { [System.IO.Path]::GetRelativePath($rootFull, $_.FullName) -notmatch '(^|[\\/])(target|vendor)[\\/]' }) {
  $languages.Add("rust")
}
foreach ($tauriConf in 'tauri.conf.json', 'tauri.conf.json5') {
  $tauriFound = Get-IndicatorFile -Path $rootFull -Filter $tauriConf -Depth 5 |
    Where-Object { $_.Directory.Name -eq 'src-tauri' }
  if ($tauriFound -and -not $frameworks.Contains("tauri")) {
    $frameworks.Add("tauri")
  }
}

# --- Go (go.mod; vendored modules and testdata carry their own go.mod) ---
if (Get-IndicatorFile -Path $rootFull -Filter "go.mod" -Depth 5 |
    Where-Object { [System.IO.Path]::GetRelativePath($rootFull, $_.FullName) -notmatch '(^|[\\/])(vendor|testdata)[\\/]' }) {
  $languages.Add("go")
}

$langPrefixMap = @{
  typescript = "ts"
  python     = "py"
  csharp     = "dotnet"
  javascript = "js"
  rust       = "rust"
}

for ($i = 0; $i -lt $languages.Count; $i++) {
  if ($langPrefixMap.ContainsKey($languages[$i])) {
    $languages[$i] = $langPrefixMap[$languages[$i]]
  }
}

$test = $languages | ForEach-Object { "${_}-test" }
$implementation = $languages | ForEach-Object { "${_}-implementation" }

# --- governance (#68): ADR and spec folders; opt-in key of .agents/config.json (#65) ---
$govConfigured = $false
$govKey = $null
$configFile = Join-Path $rootFull '.agents/config.json'
if (Test-Path -LiteralPath $configFile -PathType Leaf) {
  try {
    $cfg = Get-Content -LiteralPath $configFile -Raw | ConvertFrom-Json -ErrorAction Stop
    if ($cfg -is [pscustomobject] -and @($cfg.PSObject.Properties.Name) -contains 'governance') {
      $govConfigured = $true
      $govKey = $cfg.governance
    }
  } catch {
    $govConfigured = $false
  }
}
function Get-GovernanceDir([string]$Name, [string]$Default) {
  if ($govKey -is [pscustomobject] -and @($govKey.PSObject.Properties.Name) -contains $Name -and $govKey.$Name -is [string] -and $govKey.$Name.Length -gt 0) {
    return $govKey.$Name
  }
  $Default
}
$adrRel = Get-GovernanceDir 'adrDir' 'docs/adr'
$specRel = Get-GovernanceDir 'specDir' 'docs/specs'
$adrCount = @(Get-ChildItem -LiteralPath (Join-Path $rootFull $adrRel) -File -Filter '*.md' -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -match '^\d{4}-.+\.md$' }).Count
$specCount = @(Get-ChildItem -LiteralPath (Join-Path $rootFull $specRel) -File -Filter '*.md' -ErrorAction SilentlyContinue).Count
$govHint = $null
if (-not $govConfigured -and ($adrCount + $specCount) -gt 0) {
  $govHint = 'docs/adr or docs/specs found but no governance key in .agents/config.json; add it to opt in (docs/usage/project-config.md)'
}

$report = [ordered]@{
  languages       = @($languages)
  frameworks      = @($frameworks)
  packageManager  = @($packageManagers)
  tools           = @($tools)
  test            = @($test)
  implementation  = @($implementation)
  governance      = [ordered]@{
    configured = $govConfigured
    adrDir     = $adrRel
    adrCount   = $adrCount
    specDir    = $specRel
    specCount  = $specCount
    hint       = $govHint
  }
}

$report | ConvertTo-Json -Compress
exit 0
