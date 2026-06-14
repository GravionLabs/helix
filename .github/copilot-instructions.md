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
- **`@gravion/helix`** – A reusable Angular UI library extending [sakai-ng](https://github.com/primefaces/sakai-ng) with NgRx Signal Store state management
- **`demo`** – A demo application showcasing the library

## Code Style

### Angular Components
- Use Angular 21 conventions: no `.component` postfix in filenames (`topbar.ts`, not `topbar.component.ts`)
- Each component must have **3 separate files**: `name.ts`, `name.html`, `name.scss`
- All components must be `standalone: true`
- Use `templateUrl` and `styleUrl` (not inline `template` or `styles`)

### Component Prefix
- All library components use the `gv-` selector prefix (e.g., `gv-topbar`, `gv-sidebar`)
- All library class names use the `Gv` prefix (e.g., `GvTopbar`, `GvSidebar`)

### State Management
- Use NgRx Signal Store (`@ngrx/signals`) for all state management in the library
- Avoid using `LayoutService` – always use `LayoutStore` from the library
- Import from `@gravion/helix`, never from local demo layout copies

### Dependency Injection
- Use `inject()` function instead of constructor injection
- Use `input()` and `output()` signals for component I/O where possible

## File Structure

```
projects/helix/src/lib/
├── layout/
│   ├── components/        # Layout components (GvAppLayout, GvTopbar, etc.)
│   ├── store/             # NgRx Signal Store (LayoutStore, LayoutModels)
│   └── menu-model.token.ts
└── pages/
    ├── auth/              # Auth pages (GvLogin, GvError, GvAccess)
    ├── landing/           # Landing page + widgets
    ├── notfound/          # 404 page
    └── empty/             # Empty state page
```

## Exports
- All public library exports go through `projects/helix/src/public-api.ts`
- Never import directly from library source paths in the demo app – always use `@gravion/helix`

## Testing
- Unit tests use the `*.spec.ts` naming convention
- Run `ng test helix` for library tests, `ng test demo` for demo tests
