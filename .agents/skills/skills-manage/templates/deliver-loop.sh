#!/bin/sh
# deliver-loop: starts the deliver loop of the installed deliver skill. Written by skills-manage (Install-LoopShim.ps1).
root=$(git rev-parse --show-toplevel 2>/dev/null) || root=$PWD
dir=
for d in "$root/.claude/skills/deliver" "$root/.agents/skills/deliver" "$HOME/.claude/skills/deliver" "$HOME/.agents/skills/deliver"; do
  if [ -f "$d/scripts/deliver-loop.mts" ]; then dir=$d; break; fi
done
if [ -z "$dir" ]; then
  echo "deliver-loop: no installed deliver skill found (run /skills-manage delivery)." >&2
  exit 1
fi
cd "$root" || exit 1
exec node "$dir/scripts/deliver-loop.mts" "$@"
