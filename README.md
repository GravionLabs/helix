# Helix

Angular UI component ecosystem by Gravion Labs. Helix is a maintained fork of
[PrimeNG](https://github.com/primefaces/primeng) 21.1.9 — the last MIT community
version — rebranded as `@helix-ui/core` with `h-` selectors, plus an
application shell, form utilities, and AG Grid helpers built on top of it.

## Packages

| Package | Description |
| --- | --- |
| [`@helix-ui/core`](projects/core) | Base component library — 90 components, 7 directives, and theming/infra modules, one secondary entry point each (`@helix-ui/core/button`). |
| [`@helix-ui/shell`](projects/shell) | Application shell: layout (topbar, nav rail, footer), auth pages, landing widgets, layout signal store, and form infrastructure. |
| [`@helix-ui/zod`](projects/zod) | Zod v4 adapter: reactive-forms validator bridge and dynamic forms from annotated Zod schemas. |
| [`@helix-ui/ag-grid`](projects/ag-grid) | AG Grid helpers: value formatters, number parsers, and cell styles. |

The workspace also contains [`apps/helix-demo`](apps/helix-demo), the showcase
application used for development.

## Quick Start

```bash
npm install @helix-ui/core
```

```ts
import { Button } from '@helix-ui/core/button';
```

```html
<h-button label="Save" />
```

Theming uses the `@primeuix` layer, so existing presets (Aura, Lara, Nora) work
unchanged:

```ts
// app.config.ts
import Aura from '@primeuix/themes/aura';
import { provideHelix } from '@helix-ui/core/config';

export const appConfig: ApplicationConfig = {
  providers: [provideHelix({ theme: { preset: Aura } })],
};
```

## Documentation

- [Module docs](docs/components/README.md) — one page per `@helix-ui/core` entry point
- [`helix-shell` API reference](docs/HELIX-SHELL.md)
- [Roadmap](docs/ROADMAP.md)
- [File structure conventions](docs/CONTRIBUTING-file-structure.md)

## Development

Requires Node ≥ 24 and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm start          # Build libs + serve the demo app
pnpm build:lib      # Build all four libraries
pnpm test:lib       # Run library unit tests
pnpm lint           # biome + eslint + no-primeng import guard
```

## Attribution & License

MIT. `projects/core` is a vendored fork of PrimeNG by PrimeTek Informatics at
tag `21.1.9` (MIT "PRIMENG COMMUNITY VERSIONS LICENSE") — see
[LICENSE.md](projects/core/LICENSE.md) and [VENDOR.md](projects/core/VENDOR.md)
for the upstream commit and the list of local modifications. All credit for the
original component implementations belongs to PrimeTek.
