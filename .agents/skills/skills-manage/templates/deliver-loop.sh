deliver-loop() {
  local root d dir=""
  root=$(git rev-parse --show-toplevel 2>/dev/null) || root=$PWD
  for d in "$root/.claude/skills/deliver" "$root/.agents/skills/deliver" "$HOME/.claude/skills/deliver" "$HOME/.agents/skills/deliver"; do
    if [ -f "$d/scripts/Invoke-DeliverLoop.ps1" ]; then dir=$d; break; fi
  done
  if [ -z "$dir" ]; then
    echo "deliver-loop: no installed deliver skill found (run /skills-manage delivery)." >&2
    return 1
  fi
  if [ "${HERDR_ENV:-}" = 1 ] && command -v herdr >/dev/null 2>&1 && [ -f "$dir/scripts/Start-LoopWorkspace.ps1" ]; then
    (cd "$root" && pwsh -NoProfile -File "$dir/scripts/Start-LoopWorkspace.ps1" -ShimCwd "$root" -ShimScript "$dir/scripts/Invoke-DeliverLoop.ps1" "$@") && return 0
  fi
  (cd "$root" && pwsh -NoProfile -File "$dir/scripts/Invoke-DeliverLoop.ps1" "$@")
}
