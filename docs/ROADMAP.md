# Helix – Roadmap

Angular 22 UI ecosystem: vanilla components (`@gravionlabs/helix-ui`), an application shell with NgRx Signal
Store state, Zod forms and AG Grid helpers. Until October 2026 the components were a vendored fork of
[PrimeNG](https://github.com/primefaces/primeng) 21.1.9 (`@gravionlabs/helix-core`, retired by
[ADR 0002](adr/0002-retire-helix-core.md)); the shell was scaffolded from
[sakai-ng](https://github.com/primefaces/sakai-ng).

---

## ✅ Phase 1 – Workspace & Library Setup

- [x] Angular workspace `helix` (Angular 21 initially, upgraded to 22 in epic #233)
- [x] Library `@gravionlabs/helix-core` (vendored PrimeNG fork, `h-` selectors; retired, see Phase 7)
- [x] Demo app `apps/helix-demo`
- [x] Dependencies: `@ngrx/signals`, `@primeuix/*`, `tailwindcss@^4`
- [x] GitHub Actions CI/CD workflow (build + test; publish via manual `workflow_dispatch`)
- [x] Public npm registry publishing under the `@gravionlabs` scope (moved off GitHub Packages,
      which has no anonymous read; `@gravionlabs` matches the repo owner so GitHub Packages
      would also work, but npmjs is the target so installs don't need an authenticated `.npmrc`)

---

## ✅ Phase 2 – Layout Components

NgRx Signal Store-backed layout, in `@gravionlabs/helix-shell`. All components use separate
`.ts` / `.html` / `.scss` files, no `.component` postfix.

### Store
- [x] `layout.models.ts` – `LayoutConfig`, `LayoutState`, `MenuMode`
- [x] `layout.store.ts` – `LayoutStore` with `signalStore()`
- [x] Dark mode via `withHooks().onInit` effect (View Transitions API)
- [x] `[menu]` input binding for the nav model

### Components
- [x] `HelixAppLayout` – Application shell with topbar, nav-rail, footer, router outlet
- [x] `HelixTopbar` – Navigation bar with breadcrumbs and action buttons
- [x] `HelixNavRail` – Collapsible side-navigation rail with brand icon
- [x] `HelixNavRailItem` – Recursive item renderer for nav rail
- [x] `HelixFooter` – Footer bar
- [x] `HelixConfigurator` – Theme configurator (preset, primary, surface, dark mode)
- [x] `HelixFloatingConfigurator` – Floating theme toggle button
- [x] `HelixStatusBar` – Status bar with environment badge

---

## ✅ Phase 3 – Pages

Generic, reusable page templates in `@gravionlabs/helix-shell`.

#### Auth Pages
- [x] `HelixLogin`, `HelixError`, `HelixAccess`, `authRoutes`

#### Utility Pages
- [x] `HelixNotfound`, `HelixEmpty`

#### Landing Page
- [x] `HelixLanding`, `HelixHeroWidget`, `HelixFeaturesWidget`, `HelixHighlightsWidget`,
      `HelixPricingWidget`, `HelixFooterWidget`, `HelixTopbarWidget`

### Demo stays (not in the library)
- `dashboard/` – Demo-specific charts and fake data
- `uikit/` – Helix component showcase
- `crud/` – Demo CRUD table
- `service/` – Fake data services
- `documentation/` – Project-specific developer documentation

---

## ✅ Phase 4 – Enhancements

- [x] `@Input()` customization for all page components (titles, logos, links)
- [x] Unit tests for `LayoutStore`
- [ ] Secondary entry points beyond the existing per-component ones (e.g. a combined
      `@gravionlabs/helix-core/pages` barrel)
- [ ] Storybook integration
- [ ] `CHANGELOG.md` + semantic versioning via GitVersion

---

## 🚧 Phase 5 – Cleanup & Rebrand (epic #358, in progress)

Post-merge cleanup ahead of the first real (re-)publish. All GitHub releases/tags before this
epic were deleted, so every API break here was free — no external consumers existed yet.

- [x] #359 – Finish the signal migration (remaining manual `@Input`/`@Output`/`@HostListener`
      decorators converted to `input()`/`output()`/host bindings)
- [x] #374 – Rename remaining `Prime*` symbols to `Helix*` (`PrimeTemplate` → `HelixTemplate`,
      `PrimeIcons` → `HelixIcons`, `providePrimeNG` → `provideHelix`, …)
- [x] #378 – Move framework-only form utilities (`Validators`, `FirstErrorPipe`,
      `HelixFormArrayWithFactory`, `helixFormErrorMap`) from `@gravionlabs/helix-shell` into
      `@gravionlabs/helix-core`
- [x] #381 – Package restructure: `core`/`shell`/`zod`/`ag-grid` naming, release cleanup. The
      npm scope moved twice — first to `@helix-ui/*` (#384), then back to `@gravionlabs/*` with
      `helix-` prefixed names (#418) once `@helix-ui` turned out to be unclaimable on npmjs
      (parent issue still open pending closeout)
- [ ] #385 – Documentation refresh: committed component-docs generator
      (`scripts/generate-component-docs.mjs`) + regenerated `docs/components/*`, manual docs swept
      for stale symbol names / import paths

---

## 🚧 Phase 6 – Visual identity & styling foundation (epics #519, #523)

Decided 2026-10-07 in [ADR 0001](adr/0001-styling-foundation.md): Helix's own look as design tokens on
the vendored fork *now*, a vanilla Angular library replacing PrimeNG as the *long-term target*.

- [x] #520 – ADR 0001; `helixPreset` (`themes/helix`, extends Aura, values pending the mockups);
      `pnpm tokens:export` → `dist/tokens/<preset>.{css,json}` (static `--h-*` variables, light + dark)
- [ ] #521 – Design mockups in Claude Design; Helix look for docs site, demo and components.
      Done: mockup rounds 1–2 (hybrid chosen: muted indigo primary; surfaces then settled on the sibling sites' VitePress neutrals, #532), type settled on
      Inter (as on the sibling Gravion Labs sites) after a comparison of six pairings, `helixPreset` values, shell font stacks, demo and shell default to
      `helixPreset`. VitePress theme on the same tokens (`apps/site/.vitepress/theme`), theming guide (`docs/THEMING.md`)
- [x] #522 – Design System sync: `pnpm design-system:build` (tokens.json, brand book, 12 component previews, cover, Inter
      font, Helix mark), published as the "Helix Design System" artifact; `docs/CONTRIBUTING-design-system.md`
- [x] #523 – `@gravionlabs/helix-ui`: vanilla library on the Helix tokens (47 components); `helix-shell`,
      `helix-zod`, the demo and the docs migrated. Table and Paginator are deferred (data grids use AG Grid)

---

## ✅ Phase 7 – helix-core retired (epics #584, #585)

- [x] #584 – every consumer (shell, zod, ag-grid, demo, docs, Design System) runs on `helix-ui`
- [x] #585 – `projects/core` removed from the workspace, CI and publishing without it,
      [ADR 0002](adr/0002-retire-helix-core.md); `npm deprecate` of `@gravionlabs/helix-core` is a manual step

---

## Architecture

```
helix/
├── projects/
│   ├── ui/                    # @gravionlabs/helix-ui — vanilla components on the Helix tokens
│   ├── tokens/                # token data (private; resolved to tokens.css)
│   ├── shell/                 # @gravionlabs/helix-shell — app shell, auth/landing pages, layout store
│   ├── zod/                   # @gravionlabs/helix-zod — Zod v4 reactive-forms adapter
│   └── ag-grid/               # @gravionlabs/helix-ag-grid — AG Grid helpers
├── apps/
│   └── helix-demo/            # Showcase app (dashboard, uikit, crud, docs)
└── docs/
    ├── adr/                   # Architecture decision records
    ├── ROADMAP.md
    ├── COMPONENTS.md
    ├── HELIX-SHELL.md
    └── components/            # One page per @gravionlabs/helix-ui component
```

## Published to

The public npm registry, under the `@gravionlabs` scope (`@gravionlabs/helix-ui`,
`@gravionlabs/helix-shell`, `@gravionlabs/helix-zod`, `@gravionlabs/helix-ag-grid`). Publishing is currently manual
(`workflow_dispatch` with `force-publish`) until #381's rename has settled — see
[`.github/workflows/ci.yml`](../.github/workflows/ci.yml).
