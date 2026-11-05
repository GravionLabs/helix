# After install

## What to commit

| Path                                 | Action                                                                                                                                                                                                                                                                                                                          |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `skills-lock.json`                   | commit (source and ref per skill; `npx skills update` and `npx skills check` read it)                                                                                                                                                                                                                                           |
| `.agents/skills/`, `.claude/skills/` | commit (instant context on clone). `.agents/skills/` holds the copies for OpenCode and Copilot; `.claude/skills/` links to them (copies on Windows)                                                                                                                                                                             |
| `.agents/config.json`                | commit (project config, see [project config](https://github.com/GravionLabs/skills/blob/main/docs/usage/project-config.md)). A `.gitignore` line `.agents/*` without exceptions hides it and the installed skills: add `!.agents/skills/`, `!.agents/config.json` and `!.agents/lessons/` below it; the installer prints a note |

Updates: `/skills-manage update [-g]`, or `npx skills check` (exit 1 when an update exists, usable in CI), `npx skills update` (all) or `npx skills update <name>`.

## Renamed skills

`npx skills update` cannot follow a rename: the old skill stays in `skills-lock.json` and on disk, and `/skills-manage` skips a skill that is already present, so the new name is added next to the old copy and both trigger. Replace the old skill when `npx skills check` or the release notes name a rename.

| Old name               | New name     | Since  |
| :--------------------- | :----------- | :----- |
| `ng-ag-grid-developer` | `ng-ag-grid` | v2.0.0 |

```powershell
npx skills remove ng-ag-grid-developer
npx skills add GravionLabs/skills --skill ng-ag-grid
```

Add `-g` to both commands for a global install, and commit the changed `skills-lock.json` and the skill folders. The rename policy is in [CONTRIBUTING.md](https://github.com/GravionLabs/skills/blob/main/CONTRIBUTING.md#public-surface-and-renames).

## Global and project copies

A skill installed both globally (`-g`) and in the project may resolve to the global copy, depending on the client: OpenCode, for example, loaded `detect-techstack` from `~/.agents/skills/` although `.opencode/skills/` linked the project copy. An outdated global copy then wins silently. Keep the global copy current (`npx skills update -g`) or remove it. To see which copy is loaded, OpenCode prints the resolved path per skill with `opencode debug skill`.

## Delivery

Delivery runs through the `deliver` skill (`/deliver <nr>`, harness-neutral), not through a separate runner.

Before the first `/deliver <nr> --unattended`, propose the shell allowlist of the harness and let the user confirm it (never write it unasked): `.claude/settings.json` (`permissions.allow`) for Claude Code, `opencode.json` (`permission.bash`) for OpenCode, `--allow-tool 'shell(…)'` flags for Copilot CLI. The entries are `git`, `gh`, `herdr pane report-metadata`, `pwsh` for the cleanup script of `deliver` and the verify commands of the repository's `AGENTS.md` (build, test, format, lint): read them from its `## Commands` section and name them. The templates per harness are in `permissions.md` in the references of the `deliver` skill; without them an unattended run stops at the first prompt. The per-project settings the skills read live in `.agents/config.json`.

## deliver-loop shell command

`scripts/Install-LoopShim.ps1` (offered after the `delivery` group, asks first) adds the function `deliver-loop` to `~/.zshrc`, `~/.bashrc` or the PowerShell profile, between `# >>> deliver-loop >>>` markers (a second run changes nothing, an outdated block is replaced). It finds the installed script in `.claude/skills/deliver`, `.agents/skills/deliver` (project), `~/.claude/skills/deliver`, `~/.agents/skills/deliver` and passes all arguments through; no copy, so `npx skills update` keeps it current. Nothing found: message and exit 1.

```powershell
deliver-loop -Milestone 1.3.0 -Max 5 -Model sonnet
deliver-loop -Target 12,14 -Harness copilot -Model gpt-5
```

In herdr (`HERDR_ENV=1`) it starts the loop in its own workspace `<repo> · deliver` (tab `deliver-loop`); elsewhere in the current terminal.

## Coming from apm-hub

GravionLabs/skills replaces GravionLabs/apm-hub (archived; its last release `v3.3.x` stays installable with apm). The skills keep their names; `apm-install` is now `skills-manage`.

1. Remove the apm-hub packages: delete the `GravionLabs/apm-hub/packages/...` entries from `apm.yml` and run `apm install` (project) or `apm uninstall -g GravionLabs/apm-hub/packages/<pkg>` (global). apm deletes the files it recorded in `apm.lock.yaml`.
2. Run `/skills-manage` (or `pwsh scripts/Install-Skills.ps1 -DryRun`) and confirm.
3. When `apm.yml` lists nothing else, delete `apm.yml`, `apm.lock.yaml` and `apm_modules/`.
4. `.agents/config.json` stays as it is; its schema moved to `https://raw.githubusercontent.com/GravionLabs/skills/main/skills/shared/implementation/schema/config.schema.json`.
5. `[Task]` issues of apm-hub plans stay readable; planning creates no Task level any more (a PBI that fits one session goes to `planner refine <nr>`, a bigger one becomes sibling PBIs), and commits carry `Refs #<pbi>`.
