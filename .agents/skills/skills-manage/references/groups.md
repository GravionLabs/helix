# Skill groups

A group is a plugin in `.claude-plugin/marketplace.json` of GravionLabs/skills; `scripts/groups.json` is its copy. Install form: `npx skills add GravionLabs/skills --skill <name> ... [-g]`. `skills-manage` builds that call from the groups, skips skills already present and adds the external dependencies pinned to a commit.

| Group        | Brings                                                                                             | Install         |
| :----------- | :------------------------------------------------------------------------------------------------- | :-------------- |
| `shared`     | `implementation`, `detect-techstack`, `diagnose`, `code-review`, `check-prerequisites`             | project or `-g` |
| `github`     | `github-issue`, `github-pull-request`, `github-release`                                            | project or `-g` |
| `delivery`   | `deliver`, `planner`, `grill-me`, `retro`, `skills-manage`; uses `github` and `shared`             | project or `-g` |
| `statusline` | `context-statusline` (status line and subagent status line)                                        | `-g`            |
| `ts`, `py`   | `<lang>-implementation`, `<lang>-test`, project scaffolding                                        | per project     |
| `rust`       | `rust-implementation`, `rust-test`                                                                 | per project     |
| `go`         | `go-implementation`, `go-test`                                                                     | per project     |
| `ng`         | Angular skills, plus `angular/skills` (`angular-developer`)                                        | per project     |
| `dotnet`     | .NET skills, plus `dotnet/skills` (`csharp-scripts`, `dotnet-pinvoke`, `nuget-trusted-publishing`) | per project     |

## Presets

- `core`: `shared`, `github`, `delivery`, `statusline`, no stack skills. Use `core -g` once per machine and the stack group per project.
- `all`: every group except `skill-tooling`. For machines that mix stacks.
- `skill-tooling` (skill authoring and audit) is for contributors of GravionLabs/skills and never part of `all`; install it by name with `npx skills add GravionLabs/skills --skill skill-write ...`.

Groups only exist at install time: `npx skills` records single skills in `skills-lock.json` and updates them one by one (`npx skills update`, `npx skills check`).

## Detection mapping

detect-techstack emits `ts`, `js`, `py`, `dotnet`, `rust`, `go`: `ts` and `js` map to `ts`, the others to the group of the same name. angular framework: `ng` (next to `ts`). tauri framework: informational, no group; a Tauri project reports `rust` and usually `ts`, so both are proposed.
