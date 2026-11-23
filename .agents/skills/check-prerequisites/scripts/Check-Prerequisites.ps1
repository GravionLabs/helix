#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Checks and validates all global prerequisites for the GravionLabs skills.

.DESCRIPTION
    Verifies that required tools are installed: PowerShell, Git, Node.js, npm.
    Optionally checks for optional tools (gh, curl, jq, yq, ast-grep, python).
    ast-grep is required, even without -Full, when the git toplevel (or the working
    directory) has an sgconfig.yml. The binary is `ast-grep`, never `sg` (on Linux
    `sg` is the shadow-utils command).
    actionlint, zizmor and shellcheck are required, even without -Full, when the git
    toplevel (or the working directory) has a .github/workflows/ directory; otherwise
    they are not checked.
    gitleaks is required, even without -Full, when the git toplevel (or the working
    directory) has a .gitleaks.toml; otherwise it is optional (-Full).
    Can auto-install missing tools using platform-specific package managers.

.PARAMETER Full
    Check optional tools in addition to core and runtime prerequisites.

.PARAMETER AutoInstall
    Attempt to automatically install missing tools using platform package managers.

.EXAMPLE
    pwsh scripts/Check-Prerequisites.ps1
    # Checks core and runtime prerequisites

    pwsh scripts/Check-Prerequisites.ps1 -Full
    # Includes optional tools

    pwsh scripts/Check-Prerequisites.ps1 -AutoInstall
    # Auto-installs missing tools

.LINK
    https://github.com/GravionLabs/skills/blob/main/site/prerequisites.md
#>
param(
    [switch]$Full,
    [switch]$AutoInstall,
    [switch]$Help
)

if ($Help) {
    Get-Help $PSCommandPath -Full
    exit 0
}

$results = @{
    core    = @{}
    runtime = @{}
    optional = @{}
    missing = @()
}

# Detect OS
$OS_Windows = $PSVersionTable.Platform -eq 'Win32NT' -or -not $PSVersionTable.Platform
$OS_MacOS = $PSVersionTable.Platform -eq 'Unix' -and (uname -s) -eq 'Darwin'
$OS_Linux = $PSVersionTable.Platform -eq 'Unix' -and (uname -s) -eq 'Linux'

function Get-ToolVersion {
    param([string]$Tool, [string[]]$VersionArgs = @('--version'))
    
    try {
        $cmd = Get-Command $Tool -ErrorAction Stop
        $output = & $cmd @VersionArgs 2>&1 | Select-Object -First 1
        return $output.Trim()
    } catch {
        return $null
    }
}

function Test-Tool {
    param([string]$Tool)
    try {
        $null = Get-Command $Tool -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

function Install-Tool {
    param([string]$Tool, [hashtable]$Installers)
    
    if (-not $AutoInstall) { return $false }
    
    $installer = $Installers[$Tool]
    if (-not $installer) { return $false }
    
    Write-Host "  → Attempting to install $Tool..." -ForegroundColor Yellow
    
    try {
        if ($OS_Windows) {
            if (Test-Tool 'winget') {
                & winget install -e --id $installer.winget --silent
            } else {
                Write-Host "    ✗ winget not found. Install manually: $($installer.windows)" -ForegroundColor Red
                return $false
            }
        } elseif ($OS_MacOS) {
            & brew install $installer.brew
        } elseif ($OS_Linux) {
            if (-not ($installer.npm -or $installer.pipx -or $installer.go -or $installer.apt -or $installer.dnf)) {
                Write-Host "    ✗ No package manager entry for $Tool on Linux. See the install hint." -ForegroundColor Red
                return $false
            }
            if ($installer.npm) { & npm install -g $installer.npm } elseif ($installer.pipx) { & pipx install $installer.pipx } elseif ($installer.go) { & go install $installer.go } else { & sudo apt-get install -y $installer.apt 2>/dev/null || & sudo dnf install -y $installer.dnf 2>/dev/null }
        }
        
        # Verify installation
        return Test-Tool $Tool
    } catch {
        Write-Host "    ✗ Installation failed: $_" -ForegroundColor Red
        return $false
    }
}

# ===== CORE Prerequisites =====
Write-Host "`n=== CORE Prerequisites ===" -ForegroundColor Cyan

# PowerShell
$psVersion = $PSVersionTable.PSVersion
if ($psVersion.Major -ge 7) {
    $results.core['PowerShell'] = "✓ $($psVersion.Major).$($psVersion.Minor).$($psVersion.Patch)"
    Write-Host "  ✓ PowerShell: $($psVersion.Major).$($psVersion.Minor).$($psVersion.Patch)" -ForegroundColor Green
} else {
    $results.core['PowerShell'] = "✗ $($psVersion.Major).$($psVersion.Minor) (need 7+)"
    Write-Host "  ✗ PowerShell: $($psVersion.Major).$($psVersion.Minor) (need 7+)" -ForegroundColor Red
    $results.missing += 'PowerShell'
}

# Git
if (Test-Tool 'git') {
    $gitVersion = git --version | Select-Object -First 1
    $results.core['Git'] = "✓ $gitVersion"
    Write-Host "  ✓ Git: $gitVersion" -ForegroundColor Green
} else {
    $results.core['Git'] = "✗ NOT FOUND"
    Write-Host "  ✗ Git: NOT FOUND" -ForegroundColor Red
    $results.missing += 'Git'
}

# ===== RUNTIME Prerequisites =====
Write-Host "`n=== RUNTIME Prerequisites ===" -ForegroundColor Cyan

# Node.js
if (Test-Tool 'node') {
    $nodeVersion = node --version
    $results.runtime['Node.js'] = "✓ $nodeVersion"
    Write-Host "  ✓ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    $results.runtime['Node.js'] = "✗ NOT FOUND"
    Write-Host "  ✗ Node.js: NOT FOUND" -ForegroundColor Red
    $results.missing += 'Node.js'
}

# npm
if (Test-Tool 'npm') {
    $npmVersion = npm --version
    $results.runtime['npm'] = "✓ v$npmVersion"
    Write-Host "  ✓ npm: v$npmVersion" -ForegroundColor Green
} else {
    $results.runtime['npm'] = "✗ NOT FOUND"
    Write-Host "  ✗ npm: NOT FOUND" -ForegroundColor Red
    $results.missing += 'npm'
}

# ===== ast-grep: required where sgconfig.yml exists =====
$astGrepRequired = $false
$repoRoot = $null
if (Test-Tool 'git') {
    $repoRoot = (git rev-parse --show-toplevel 2>$null | Select-Object -First 1)
}
foreach ($root in @($repoRoot, (Get-Location).Path)) {
    if ($root -and (Test-Path -LiteralPath (Join-Path $root 'sgconfig.yml'))) { $astGrepRequired = $true; break }
}
if ($astGrepRequired) {
    if (Test-Tool 'ast-grep') {
        $results.runtime['ast-grep'] = "✓ $(Get-ToolVersion 'ast-grep')"
        Write-Host "  ✓ ast-grep (sgconfig.yml found): $(Get-ToolVersion 'ast-grep')" -ForegroundColor Green
    } else {
        $results.runtime['ast-grep'] = "✗ NOT FOUND"
        Write-Host "  ✗ ast-grep (required, sgconfig.yml found): NOT FOUND" -ForegroundColor Red
        $results.missing += 'ast-grep'
    }
}

# ===== actionlint, zizmor, shellcheck: required where .github/workflows/ exists =====
$workflowTools = @('actionlint', 'zizmor', 'shellcheck')
$workflowsPresent = $false
foreach ($root in @($repoRoot, (Get-Location).Path)) {
    if ($root -and (Test-Path -LiteralPath (Join-Path $root '.github/workflows') -PathType Container)) { $workflowsPresent = $true; break }
}
if ($workflowsPresent) {
    foreach ($tool in $workflowTools) {
        if (Test-Tool $tool) {
            $results.runtime[$tool] = "✓ $(Get-ToolVersion $tool)"
            Write-Host "  ✓ $tool (.github/workflows found): $(Get-ToolVersion $tool)" -ForegroundColor Green
        } else {
            $results.runtime[$tool] = "✗ NOT FOUND"
            Write-Host "  ✗ $tool (required, .github/workflows found): NOT FOUND" -ForegroundColor Red
            $results.missing += $tool
        }
    }
}

# ===== gitleaks: required where .gitleaks.toml exists =====
$gitleaksRequired = $false
foreach ($root in @($repoRoot, (Get-Location).Path)) {
    if ($root -and (Test-Path -LiteralPath (Join-Path $root '.gitleaks.toml') -PathType Leaf)) { $gitleaksRequired = $true; break }
}
if ($gitleaksRequired) {
    if (Test-Tool 'gitleaks') {
        $results.runtime['gitleaks'] = "✓ $(Get-ToolVersion 'gitleaks' @('version'))"
        Write-Host "  ✓ gitleaks (.gitleaks.toml found): $(Get-ToolVersion 'gitleaks' @('version'))" -ForegroundColor Green
    } else {
        $results.runtime['gitleaks'] = "✗ NOT FOUND"
        Write-Host "  ✗ gitleaks (required, .gitleaks.toml found): NOT FOUND" -ForegroundColor Red
        $results.missing += 'gitleaks'
    }
}

# ===== OPTIONAL Prerequisites =====
if ($Full) {
    Write-Host "`n=== OPTIONAL Prerequisites ===" -ForegroundColor Cyan
    
    $optionalTools = @(
        'gh',
        'curl',
        'jq',
        'yq',
        'ast-grep',
        'gitleaks',
        'python'
    )
    
    foreach ($tool in $optionalTools) {
        if ($astGrepRequired -and $tool -eq 'ast-grep') { continue }
        if ($gitleaksRequired -and $tool -eq 'gitleaks') { continue }
        if (Test-Tool $tool) {
            $version = if ($tool -eq 'gitleaks') { Get-ToolVersion $tool @('version') } else { Get-ToolVersion $tool }
            $results.optional[$tool] = "✓ $version"
            Write-Host "  ✓ $tool : $version" -ForegroundColor Green
        } else {
            $results.optional[$tool] = "✗ NOT FOUND"
            Write-Host "  ✗ $tool : NOT FOUND" -ForegroundColor Gray
        }
    }
}

# ===== Summary =====
Write-Host "`n=== Summary ===" -ForegroundColor Cyan

if ($results.missing.Count -eq 0) {
    Write-Host "✓ All required prerequisites are installed!" -ForegroundColor Green
    exit 0
} else {
    $installHints = @{
        'PowerShell' = @{ windows = 'winget install Microsoft.PowerShell'; macos = 'brew install powershell'; linux = 'sudo apt-get install powershell' }
        'Git'        = @{ windows = 'winget install Git.Git';              macos = 'brew install git';        linux = 'sudo apt-get install git' }
        'Node.js'    = @{ windows = 'winget install OpenJS.NodeJS';        macos = 'brew install node';       linux = 'sudo apt-get install nodejs' }
        'npm'        = @{ windows = 'included with Node.js';               macos = 'brew install node';       linux = 'sudo apt-get install npm' }
        'ast-grep'   = @{ windows = 'winget install ast-grep.ast-grep';    macos = 'brew install ast-grep';   linux = 'npm install -g @ast-grep/cli' }
        'actionlint' = @{ windows = 'winget install rhysd.actionlint';     macos = 'brew install actionlint'; linux = 'go install github.com/rhysd/actionlint/cmd/actionlint@latest' }
        'zizmor'     = @{ windows = 'pipx install zizmor';                 macos = 'brew install zizmor';     linux = 'pipx install zizmor' }
        'shellcheck' = @{ windows = 'winget install koalaman.shellcheck';  macos = 'brew install shellcheck'; linux = 'sudo apt-get install shellcheck' }
        'gitleaks'   = @{ windows = 'winget install Gitleaks.Gitleaks';    macos = 'brew install gitleaks';   linux = 'download a release from https://github.com/gitleaks/gitleaks/releases and put gitleaks on PATH' }
    }

    $installers = @{
        'PowerShell' = @{ winget = 'Microsoft.PowerShell'; brew = 'powershell'; apt = 'powershell'; dnf = 'powershell' }
        'Git'        = @{ winget = 'Git.Git';              brew = 'git';        apt = 'git';        dnf = 'git' }
        'Node.js'    = @{ winget = 'OpenJS.NodeJS';        brew = 'node';       apt = 'nodejs';     dnf = 'nodejs' }
        'npm'        = @{ winget = 'OpenJS.NodeJS';        brew = 'node';       apt = 'npm';        dnf = 'npm' }
        'ast-grep'   = @{ winget = 'ast-grep.ast-grep';    brew = 'ast-grep';   npm = '@ast-grep/cli' }
        'actionlint' = @{ winget = 'rhysd.actionlint';     brew = 'actionlint'; go = 'github.com/rhysd/actionlint/cmd/actionlint@latest' }
        'zizmor'     = @{ winget = 'zizmor.zizmor';        brew = 'zizmor';     pipx = 'zizmor' }
        'shellcheck' = @{ winget = 'koalaman.shellcheck';  brew = 'shellcheck'; apt = 'shellcheck'; dnf = 'ShellCheck' }
        'gitleaks'   = @{ winget = 'Gitleaks.Gitleaks';    brew = 'gitleaks' }
    }

    Write-Host "✗ Missing Prerequisites" -ForegroundColor Red
    Write-Host ""
    foreach ($tool in $results.missing) {
        $hints = $installHints[$tool]
        Write-Host "  • $tool : NOT FOUND" -ForegroundColor Red
        if ($hints) {
            Write-Host "    → Windows: $($hints.windows)" -ForegroundColor Yellow
            Write-Host "    → macOS:   $($hints.macos)" -ForegroundColor Yellow
            Write-Host "    → Linux:   $($hints.linux)" -ForegroundColor Yellow
        }
        Write-Host ""
    }

    Write-Host "Run with -AutoInstall flag to attempt automatic installation." -ForegroundColor Yellow
    Write-Host "See site/prerequisites.md for detailed instructions." -ForegroundColor Yellow

    if ($AutoInstall) {
        Write-Host "`n  Attempting auto-install..." -ForegroundColor Yellow
        foreach ($tool in $results.missing) {
            Install-Tool $tool $installers
        }
    }

    exit 1
}
