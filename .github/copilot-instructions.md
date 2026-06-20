# GitHub Copilot Instructions for helix

## Language

**All content in this repository must be written in English.** This applies to:

- Source code comments and JSDoc/TSDoc
- Documentation files (`docs/`, `README.md`, `ROADMAP.md`, etc.)
- Git commit messages
- GitHub Issues, Pull Requests, and comments
- Variable names, function names, and other identifiers should follow English conventions

## Project Overview

This is an Angular 21 workspace containing:
- **`@gravionlabs/helix`** – A reusable Angular UI library extending [sakai-ng](https://github.com/primefaces/sakai-ng) with NgRx Signal Store state management
- **`demo`** – A demo application showcasing the library

## Code Style

### Angular Components
- Use Angular 21 conventions: no `.component` postfix in filenames (`topbar.ts`, not `topbar.component.ts`)
- Each component must have **3 separate files**: `name.ts`, `name.html`, `name.scss`
- All components must be `standalone: true`
- Use `templateUrl` and `styleUrl` (not inline `template` or `styles`)

### Component Prefix
- All library components use the `helix-` selector prefix (e.g., `helix-topbar`, `helix-nav-rail`)
- All library class names use the `Helix` prefix (e.g., `HelixTopbar`, `HelixNavRail`)

### State Management
- Use NgRx Signal Store (`@ngrx/signals`) for all state management in the library
- Avoid using `LayoutService` – always use `LayoutStore` from the library
- Import from `@gravionlabs/helix`, never from local demo layout copies

### Dependency Injection
- Use `inject()` function instead of constructor injection
- Use `input()` and `output()` signals for component I/O where possible

## File Structure

```
projects/helix/src/lib/
├── layout/
│   ├── components/        # Layout components (HelixAppLayout, HelixTopbar, etc.)
│   ├── store/             # NgRx Signal Store (LayoutStore, LayoutModels)
│   └── menu-model.token.ts
└── pages/
    ├── auth/              # Auth pages (HelixLogin, HelixError, HelixAccess)
    ├── landing/           # Landing page + widgets
    ├── notfound/          # 404 page
    └── empty/             # Empty state page
```

## Exports
- All public library exports go through `projects/helix/src/public-api.ts`
- Never import directly from library source paths in the demo app – always use `@gravionlabs/helix`

## Testing
- Unit tests use the `*.spec.ts` naming convention
- Run `pnpm test` for all tests, `pnpm run test:lib` for library tests only

## Implementing Issues and Epics

When asked to implement an issue or epic (e.g., "impl #85", "implement epic #85"):

### Branch Naming
- Epic issues (`[EPIC]` in title): `epic/<number>-<slug>`
- Others: derive prefix from conventional-commit type in title (`feat/`, `refactor/`, `fix/`, `chore/`) — `<number>-<slug>`
- Always branch off `main` after `git pull --rebase`

### Sub-Task Order
Read the epic with `gh issue view <number>`. Implement sub-tasks in checklist order. Each sub-task is one commit. Only commit when all three pass:
```bash
pnpm run build:lib   # or pnpm run build for full workspace
pnpm run lint
pnpm test
```

### Commit Format
```
<type>(<scope>): <description> (#<sub-issue-number>)

Part of epic #<epic-number>
```

### After All Sub-Tasks
1. `git push -u origin <branch>`
2. `gh pr create` — reference the epic/issue, list sub-tasks as checked
3. `gh pr edit <pr-number> --add-reviewer "github-copilot[bot]"`
4. `gh pr merge <pr-number> --auto --squash` — auto-merges when CI passes

Skip step 4 only if explicitly asked not to merge.
