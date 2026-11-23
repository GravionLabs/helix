# deliver-loop: starts the deliver loop of the installed deliver skill. Written by skills-manage (Install-LoopShim.ps1).
# A .ps1 next to the .cmd: PowerShell runs this one, so Ctrl+C does not ask "Terminate batch job".
$root = (& git rev-parse --show-toplevel 2>$null)
if (-not $root) { $root = (Get-Location).Path }
$dir = $null
foreach ($d in @((Join-Path $root '.claude/skills/deliver'), (Join-Path $root '.agents/skills/deliver'), (Join-Path $HOME '.claude/skills/deliver'), (Join-Path $HOME '.agents/skills/deliver'))) {
  if (Test-Path -LiteralPath (Join-Path $d 'scripts/deliver-loop.mts') -PathType Leaf) { $dir = $d; break }
}
if (-not $dir) {
  [Console]::Error.WriteLine('deliver-loop: no installed deliver skill found (run /skills-manage delivery).')
  exit 1
}
Push-Location -LiteralPath $root
try {
  & node (Join-Path $dir 'scripts/deliver-loop.mts') @args
  exit $LASTEXITCODE
}
finally { Pop-Location }
