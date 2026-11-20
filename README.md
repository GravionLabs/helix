# Helix

Angular UI component ecosystem by Gravion Labs: vanilla, signal-based components on design tokens with
plain CSS (`@gravionlabs/helix-ui`), an application shell, dynamic forms from Zod schemas, and AG Grid helpers.

## Packages

| Package                                          | Description                                                                                                                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@gravionlabs/helix-shell`](projects/shell)     | Application shell: layout (topbar, nav rail, footer), auth pages, landing widgets, layout signal store, and form infrastructure.                              |
| [`@gravionlabs/helix-zod`](projects/zod)         | Zod v4 adapter: reactive-forms validator bridge and dynamic forms from annotated Zod schemas.                                                                 |
| [`@gravionlabs/helix-ag-grid`](projects/ag-grid) | AG Grid helpers: value formatters, number parsers, and cell styles.                                                                                           |
| [`@gravionlabs/helix-desktop`](projects/desktop) | Desktop frame (scaffold): activity bar, views, status bar, platform switch; Tauri bindings in the `/tauri` entry.                                             |
| [`@gravionlabs/helix-ui`](projects/ui)           | Vanilla Angular components on the Helix tokens (plain CSS, no PrimeNG): button, form controls, select, divider, tooltip, breadcrumb, password, select button. |

The documentation is published at
[gravionlabs.github.io/helix](https://gravionlabs.github.io/helix/) (built from [`docs/`](docs) by
[`apps/site`](apps/site)). The workspace also contains [`apps/helix-demo`](apps/helix-demo), the
showcase application used for development — live at
[gravionlabs.github.io/helix/demo/](https://gravionlabs.github.io/helix/demo/).

## Quick Start

```bash
npm install @gravionlabs/helix-ui
```

```css
/* styles.css: the components and the tokens they read */
@import "@gravionlabs/helix-ui/styles.css";
@import "@gravionlabs/helix-ui/tokens.css";
```

```ts
import { HxButton } from '@gravionlabs/helix-ui';
```

```html
<button hx-button type="button">Save</button>
```

Theming runs on CSS custom properties (`--h-*`): `tokens.css` is Helix's own look (the neutral greys of the
sibling sites, indigo primary, Inter; see [ADR 0001](docs/adr/0001-styling-foundation.md)), dark mode and the
primary colour are switched with `provideHxTheme`:

```ts
// app.config.ts
import { provideHxTheme } from '@gravionlabs/helix-ui';

export const appConfig: ApplicationConfig = {
  providers: [provideHxTheme({ storageKey: 'my-app-theme' })],
};
```

## Agent skills

The Angular agent skills are installed with [`npx skills`](https://github.com/GravionLabs/skills) (`/skills-manage` in an agent) and committed: `skills-lock.json`, `.agents/skills/` and `.claude/skills/`. Update them with `npx skills update`.

## Documentation

Browse it as a website at [gravionlabs.github.io/helix](https://gravionlabs.github.io/helix/), or read the Markdown here:

- [Component docs](docs/components/README.md) — one page per `@gravionlabs/helix-ui` component
- [`helix-shell` API reference](docs/HELIX-SHELL.md)
- [Helix UI](docs/HELIX-UI.md) — the component library: install, theming, validators, rules
- [Theming](docs/THEMING.md) — the Helix tokens, dark mode, overriding tokens, static token export
- [UX rules](docs/UX-RULES.md) — feedback by duration, which element for what, confirm or undo, tooltips, texts, motion
- [Design System](docs/CONTRIBUTING-design-system.md) — the generated brand book, tokens and component previews
- [Roadmap](docs/ROADMAP.md)
- [Architecture decision records](docs/adr/README.md)
- [File structure conventions](docs/CONTRIBUTING-file-structure.md)

## Development

Requires Node ≥ 24 and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm start          # Build libs + serve the demo app
pnpm build:lib      # Build all libraries (ui, shell, zod, ag-grid, desktop) (ends with pnpm tokens:export → dist/tokens/)
pnpm test:lib       # Run library unit tests
pnpm lint           # oxlint (TypeScript, type-aware) + ESLint (templates) + import guards
pnpm format         # format with oxfmt (pnpm format:check only checks)
```

## Attribution & License

MIT. The design token values derive from the Aura preset of PrimeNG / PrimeUIX (PrimeTek, MIT) and from Tailwind CSS (MIT); see [projects/tokens/NOTICE](projects/tokens/NOTICE).
