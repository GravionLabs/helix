# Helix

Angular UI component ecosystem by Gravion Labs. Helix is a maintained fork of
[PrimeNG](https://github.com/primefaces/primeng) 21.1.9 — the last MIT community
version — rebranded as `@gravionlabs/helix-core` with `h-` selectors, plus an
application shell, form utilities, and AG Grid helpers built on top of it.

## Packages

| Package | Description |
| --- | --- |
| [`@gravionlabs/helix-core`](projects/core) | Base component library — 90 components, 7 directives, and theming/infra modules, one secondary entry point each (`@gravionlabs/helix-core/button`). |
| [`@gravionlabs/helix-shell`](projects/shell) | Application shell: layout (topbar, nav rail, footer), auth pages, landing widgets, layout signal store, and form infrastructure. |
| [`@gravionlabs/helix-zod`](projects/zod) | Zod v4 adapter: reactive-forms validator bridge and dynamic forms from annotated Zod schemas. |
| [`@gravionlabs/helix-ag-grid`](projects/ag-grid) | AG Grid helpers: value formatters, number parsers, and cell styles. |
| [`@gravionlabs/helix-ui`](projects/ui) | Vanilla Angular components on the Helix tokens (plain CSS, no PrimeNG): the successor of `helix-core` — button, form controls, select, divider, tooltip, breadcrumb, password, select button. |

The documentation is published at
[gravionlabs.github.io/helix](https://gravionlabs.github.io/helix/) (built from [`docs/`](docs) by
[`apps/site`](apps/site)). The workspace also contains [`apps/helix-demo`](apps/helix-demo), the
showcase application used for development — live at
[gravionlabs.github.io/helix/demo/](https://gravionlabs.github.io/helix/demo/).

## Quick Start

```bash
npm install @gravionlabs/helix-core
```

```ts
import { Button } from '@gravionlabs/helix-core/button';
```

```html
<h-button label="Save" />
```

Theming ships `helixPreset` (`themes/helix`) — Helix's own look as tokens on top of Aura: the
neutral greys of the sibling sites, indigo primary, Inter (see
[ADR 0001](docs/adr/0001-styling-foundation.md), epic #519) — plus the Aura, Lara and Nora presets
vendored into `helix-core`:

```ts
// app.config.ts
import { helixPreset } from '@gravionlabs/helix-core/themes/helix';
import { provideHelix } from '@gravionlabs/helix-core/config';

export const appConfig: ApplicationConfig = {
  providers: [provideHelix({ theme: { preset: helixPreset } })],
};
```

## Documentation

Browse it as a website at [gravionlabs.github.io/helix](https://gravionlabs.github.io/helix/), or read the Markdown here:

- [Module docs](docs/components/README.md) — one page per `@gravionlabs/helix-core` entry point
- [`helix-shell` API reference](docs/HELIX-SHELL.md)
- [Helix UI](docs/HELIX-UI.md) — the vanilla component library that replaces the fork (`@gravionlabs/helix-ui`)
- [Theming](docs/THEMING.md) — the Helix preset, dark mode, overriding tokens, static token export
- [Design System](docs/CONTRIBUTING-design-system.md) — the generated brand book, tokens and component previews
- [Roadmap](docs/ROADMAP.md)
- [Architecture decision records](docs/adr/README.md)
- [File structure conventions](docs/CONTRIBUTING-file-structure.md)

## Development

Requires Node ≥ 24 and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm start          # Build libs + serve the demo app
pnpm build:lib      # Build all libraries (core, ui, shell, zod, ag-grid) (ends with pnpm tokens:export → dist/tokens/)
pnpm test:lib       # Run library unit tests
pnpm lint           # biome + eslint + no-primeng import guard
```

## Attribution & License

MIT. `projects/core` is a vendored fork of PrimeNG by PrimeTek Informatics at
tag `21.1.9` (MIT "PRIMENG COMMUNITY VERSIONS LICENSE") — see
[LICENSE.md](projects/core/LICENSE.md) and [VENDOR.md](projects/core/VENDOR.md)
for the upstream commit and the list of local modifications. All credit for the
original component implementations belongs to PrimeTek.
