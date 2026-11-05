# Permissions: shell allowlists per harness

An `--unattended` run stops at the first permission prompt (spike #823, `docs/spikes/deliver.md` section 2). `deliver` and its subagents run six kinds of shell commands; each must be on the allowlist of the harness:

| Commands                                                                                                                                                                                          | Used by                                                               |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------- |
| the verify commands of the repository's `AGENTS.md` (build, test, format, lint)                                                                                                                   | implement and fix subagents                                           |
| `git` (`fetch`, `switch`, `worktree`, `add`, `commit`, `rebase`, `push`, `diff`, `ls-remote`, `branch`)                                                                                           | all                                                                   |
| `gh` (`auth status`, `api`, `issue`, `pr`, `label`, `repo view`)                                                                                                                                  | this session, `github-pull-request`                                   |
| `pwsh` with `scripts/Remove-PbiWorktrees.ps1` of this skill: the path of the installed skill, e.g. `.claude/skills/deliver/…` in the project or `~/.claude/skills/deliver/…` for a global install | this session, step 8 (cleanup)                                        |
| `pwsh` with `Get-Lessons.ps1` of the `lessons` skill: `.claude/skills/lessons/…`, `~/.claude/skills/lessons/…` or `.agents/skills/lessons/…`                                                      | implement, review and fix subagents (`implementation`, `code-review`) |
| `printenv HERDR_ENV`, `printenv HERDR_PANE_ID`, `herdr pane report-metadata`                                                                                                                      | only when the run is inside a herdr pane (`references/herdr.md`)      |

Replace the `pnpm` lines below with the commands of the repository's `AGENTS.md`. The deny entries block the common force-push and `--admin` forms; `deliver` needs neither, and the ruleset on `release/next` stays the real gate.

Claude Code denies any command with a quoted `$(…)` substitution even when its prefix is allowed ("Quoted text in this command can't be checked before it runs"). The same holds for any variable expansion: `herdr pane report-metadata $HERDR_PANE_ID …` is denied with or without quotes, the same call with the literal pane id passes (checked headless with `--permission-mode default`, 2026-10-29). Skill text and subagent prompts write simple commands only.

## Claude Code

`.claude/settings.json` of the repository, key `permissions.allow` (commit it, so every clone gets it). File edits of the subagents need `Edit` and `Write` here or `--permission-mode acceptEdits`.

```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Bash(gh auth status)",
      "Bash(gh api:*)",
      "Bash(gh issue:*)",
      "Bash(gh pr:*)",
      "Bash(pwsh .claude/skills/deliver/scripts/Remove-PbiWorktrees.ps1:*)",
      "Bash(pwsh .claude/skills/lessons/scripts/Get-Lessons.ps1:*)",
      "Bash(pwsh ~/.claude/skills/lessons/scripts/Get-Lessons.ps1:*)",
      "Bash(printenv HERDR_ENV)",
      "Bash(printenv HERDR_PANE_ID)",
      "Bash(herdr pane report-metadata:*)",
      "Bash(pnpm install)",
      "Bash(pnpm run build)",
      "Bash(pnpm test:*)",
      "Bash(pnpm vitest run:*)",
      "Bash(pnpm run format:*)",
      "Edit",
      "Write"
    ],
    "deny": ["Bash(git push --force:*)", "Bash(git push -f:*)", "Bash(gh pr merge --admin:*)"]
  }
}
```

Headless: `claude -p "/deliver <nr> --unattended"` reads the same file; `--allowedTools` adds entries for one run.

## OpenCode

`opencode.json` of the repository, key `permission.bash`. Patterns are globs; the last matching rule wins, so the catch-all comes first.

```json
{
  "permission": {
    "edit": "allow",
    "bash": {
      "*": "ask",
      "git *": "allow",
      "gh auth status": "allow",
      "gh api *": "allow",
      "gh issue *": "allow",
      "gh pr *": "allow",
      "pwsh *deliver/scripts/Remove-PbiWorktrees.ps1*": "allow",
      "pwsh *lessons/scripts/Get-Lessons.ps1*": "allow",
      "printenv HERDR_ENV": "allow",
      "printenv HERDR_PANE_ID": "allow",
      "herdr pane report-metadata*": "allow",
      "pnpm install": "allow",
      "pnpm run build": "allow",
      "pnpm test*": "allow",
      "pnpm vitest run *": "allow",
      "pnpm run format*": "allow",
      "git push --force*": "deny",
      "git push -f*": "deny",
      "gh pr merge --admin*": "deny"
    }
  }
}
```

Headless: `opencode run "/deliver <nr> --unattended"`. A rule left at `ask` stops the run.

## Copilot CLI

No project file: the allowlist is passed per run with `--allow-tool`. `shell(<command>)` should allow the command with every subcommand and argument; for `git` the trial below shows it does not. `--deny-tool` wins over `--allow-tool`. `write` allows file edits.

```powershell
copilot -p "/deliver <nr> --unattended" `
  --allow-tool 'shell(git fetch)' `
  --allow-tool 'shell(git switch)' `
  --allow-tool 'shell(git worktree)' `
  --allow-tool 'shell(git add)' `
  --allow-tool 'shell(git commit)' `
  --allow-tool 'shell(git rebase)' `
  --allow-tool 'shell(git push)' `
  --allow-tool 'shell(git diff)' `
  --allow-tool 'shell(git ls-remote)' `
  --allow-tool 'shell(git branch)' `
  --allow-tool 'shell(gh auth status)' `
  --allow-tool 'shell(gh api)' `
  --allow-tool 'shell(gh issue)' `
  --allow-tool 'shell(gh pr)' `
  --allow-tool 'shell(gh label)' `
  --allow-tool 'shell(gh repo view)' `
  --allow-tool 'shell(pwsh)' `
  --allow-tool 'shell(printenv HERDR_ENV)' `
  --allow-tool 'shell(printenv HERDR_PANE_ID)' `
  --allow-tool 'shell(herdr pane report-metadata)' `
  --allow-tool 'shell(pnpm install)' `
  --allow-tool 'shell(pnpm run build)' `
  --allow-tool 'shell(pnpm test)' `
  --allow-tool 'shell(pnpm vitest run)' `
  --allow-tool 'shell(pnpm run format)' `
  --allow-tool 'write' `
  --deny-tool 'shell(git push --force)' `
  --deny-tool 'shell(git push -f)' `
  --deny-tool 'shell(gh pr merge --admin)'
```

Trial #5 (Copilot CLI 1.0.105, `-p` mode):

- `shell(git)` covered read-only subcommands only; `git push`, `commit`, `switch`, `rebase`, `fetch`, `add`, `worktree` and `clone` were denied until each had its own `shell(git <sub>)` entry.
- The `--deny-tool` lines did not block `git push --force --dry-run origin release/next` while `shell(git push)` was allowed. The ruleset on `release/next` is the gate.
- `-p` gives up on the background CI watch after 600 s and ends before the merge. Set `COPILOT_TASK_WAIT_TIMEOUT_SECONDS=3600` for `-p` runs; `copilot --resume=<id> -p "continue"` finishes a run that ended early.
- The model per subagent is set only in `~/.copilot/settings.json` (`subagents.agents.general-purpose.model`), not per repository.
- `herdr pane report-metadata` with quoted arguments was denied, so the herdr display stays empty on Copilot. No workaround is required.

Live check of the unattended flags (Copilot CLI 1.0.105, `-p --no-ask-user`): `--allow-all-tools` alone denies `view` of paths outside the cwd (worktrees of subagents) and shell commands with URLs; adding `--allow-all-paths --allow-all-urls` allows both, in the orchestrator and in subagents. `Invoke-DeliverLoop.ps1 -Harness copilot` passes these three flags (`references/loop.md`); the per-tool list above is for runs that must stay narrower.

Keep the call in a PowerShell script of the repository so the list lives next to the code like the other two files.
