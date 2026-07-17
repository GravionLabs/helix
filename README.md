# Helix

Angular UI component ecosystem by Gravion Labs. Helix is a maintained fork of
[PrimeNG](https://github.com/primefaces/primeng) 21.1.9 — the last MIT community
version — rebranded as `@gravionlabs/helix` with `h-` selectors, plus an
application shell, form utilities, and AG Grid helpers built on top of it.

## Packages

| Package | Description |
| --- | --- |
| [`@gravionlabs/helix`](projects/helix) | Base component library — 90 components, 7 directives, and theming/infra modules, one secondary entry point each (`@gravionlabs/helix/button`). |
| [`@gravionlabs/helix-shell`](projects/helix-shell) | Application shell: layout (topbar, nav rail, footer), auth pages, landing widgets, layout signal store, and form infrastructure. |
| [`@gravionlabs/helix-zod`](projects/helix-zod) | Zod v4 adapter: reactive-forms validator bridge and dynamic forms from annotated Zod schemas. |
| [`@gravionlabs/helix-ag-grid`](projects/helix-ag-grid) | AG Grid helpers: value formatters, number parsers, and cell styles. |

The workspace also contains [`apps/helix-demo`](apps/helix-demo), the showcase
application used for development.

## Quick Start

```bash
echo "@gravionlabs:registry=https://npm.pkg.github.com" >> .npmrc
npm install @gravionlabs/helix
```

```ts
import { Button } from '@gravionlabs/helix/button';
```

```html
<h-button label="Save" />
```

Theming uses the `@primeuix` layer, so existing presets (Aura, Lara, Nora) work
unchanged:

```ts
// app.config.ts
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from '@gravionlabs/helix/config';

export const appConfig: ApplicationConfig = {
  providers: [providePrimeNG({ theme: { preset: Aura } })],
};
```

## Documentation

- [Module docs](docs/components/README.md) — one page per `@gravionlabs/helix` entry point
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

MIT. `projects/helix` is a vendored fork of PrimeNG by PrimeTek Informatics at
tag `21.1.9` (MIT "PRIMENG COMMUNITY VERSIONS LICENSE") — see
[LICENSE.md](projects/helix/LICENSE.md) and [VENDOR.md](projects/helix/VENDOR.md)
for the upstream commit and the list of local modifications. All credit for the
original component implementations belongs to PrimeTek.
