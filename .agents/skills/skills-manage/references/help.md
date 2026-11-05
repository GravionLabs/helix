# /skills-manage

## Usage

```
/skills-manage [dry-run] [<group>...] [-g]
/skills-manage update [dry-run] [<group>...] [-g]
```

Detects the stack of the project (or uses the named groups), shows a dry run, asks for confirmation and installs the skills with `npx skills add GravionLabs/skills --skill …`.

## Arguments and flags

- `dry-run`: print the proposal and the commands only, install nothing (`-DryRun`)
- `<group>...`: skip detection and install these groups: `shared`, `github`, `delivery`, `statusline`, `ts`, `py`, `ng`, `dotnet`, `rust`, `go`; anything else exits 1
- `core`: preset with `shared`, `github`, `delivery`, `statusline`, no stack skills
- `all`: preset with every group except `skill-tooling`
- `-g`: install user-wide instead of into the project (`-Global`)
- Pinned external packs: `ng` adds `angular/skills` (`angular-developer`), `dotnet` adds `dotnet/skills` (`csharp-scripts`, `dotnet-pinvoke`, `nuget-trusted-publishing`), each at a fixed commit
- `update`: `npx skills check` (shown), after confirmation `npx skills update`, then skills that are new in the installed groups are proposed (`-Update`); `-g` for the global scope

## Examples

- `/skills-manage`: detect the stack and propose groups
- `/skills-manage ts py`: install the `ts` and `py` groups
- `/skills-manage dry-run ng`: show what `ng` would install, including `angular/skills`
- `/skills-manage core -g`: install the core preset user-wide
- `/skills-manage update -g`: update the global skills, then propose new group members
- `/skills-manage all`: every group except `skill-tooling`

## Config

none

## See also

- `references/groups.md`: what each group brings
- `references/after-install.md`: what to commit, allowlist, updates
