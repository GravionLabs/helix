# After install

## What to commit

| Path                                 | Action                                                                                                                                                                                                                                                                                                                          |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `skills-lock.json`                   | commit (source and ref per skill; `npx skills update` and `npx skills check` read it)                                                                                                                                                                                                                                           |
| `.agents/skills/`, `.claude/skills/` | commit (instant context on clone). `.agents/skills/` holds the copies for OpenCode and Copilot; `.claude/skills/` links to them (copies on Windows)                                                                                                                                                                             |
| `.agents/config.json`                | commit (project config, see [project config](https://github.com/GravionLabs/skills/blob/main/site/usage/project-config.md)). A `.gitignore` line `.agents/*` without exceptions hides it and the installed skills: add `!.agents/skills/`, `!.agents/config.json` and `!.agents/lessons/` below it; the installer prints a note |
| `.gitignore`                         | add `.agents/proof/` (next to the `!.agents/lessons/` exception): the proof of a delivery is never committed; the installer prints a note when the line is missing                                                                                                                                                              |

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

`/skills-manage delivery` also offers the `deliver-loop` command: `pwsh scripts/Install-LoopShim.ps1` writes a launcher (`~/.local/bin/deliver-loop`, on Windows `deliver-loop.cmd` and `deliver-loop.ps1` in `%USERPROFILE%\.local\bin`), removes the old `# >>> deliver-loop >>>` function from the shell profiles, and reports when `.local/bin` is not in `PATH` (it never changes `PATH`). The loop needs Node 24 or newer: it runs `.mts` files with Node's built-in type stripping, there is no build step.

Delivery runs through the `deliver` skill (`/deliver <nr>`, or `node scripts/deliver-loop.mts --milestone <M>` for a set), harness-neutral. Settings live under `deliver` in `.agents/config.json`; the session needs `git`, `gh` and the verify commands of the repository's `AGENTS.md` (build, test, format, lint), read from its `## Commands` section.

## project-setup offer

After a project install (not `-g`) of `shared`, which carries `project-setup`, `skills-manage` asks whether to run `/project-setup` (formatter, linter, base files, `.editorconfig`). Yes delegates to that skill, no leaves it for later. A global install never asks: the choices are per project.

## Coming from apm-hub

GravionLabs/skills replaces GravionLabs/apm-hub (archived; its last release `v3.3.x` stays installable with apm). The skills keep their names; `apm-install` is now `skills-manage`.

1. Remove the apm-hub packages: delete the `GravionLabs/apm-hub/packages/...` entries from `apm.yml` and run `apm install` (project) or `apm uninstall -g GravionLabs/apm-hub/packages/<pkg>` (global). apm deletes the files it recorded in `apm.lock.yaml`.
2. Run `/skills-manage` (or `pwsh scripts/Install-Skills.ps1 -DryRun`) and confirm.
3. When `apm.yml` lists nothing else, delete `apm.yml`, `apm.lock.yaml` and `apm_modules/`.
4. `.agents/config.json` stays as it is; its schema moved to `https://raw.githubusercontent.com/GravionLabs/skills/main/skills/shared/implementation/schema/config.schema.json`.
5. `[Task]` issues of apm-hub plans stay readable; planning creates no Task level any more (a PBI that fits one session goes to `planner refine <nr>`, a bigger one becomes sibling PBIs), and commits carry `Refs #<pbi>`.
