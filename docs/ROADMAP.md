# @helix-ui/core – Roadmap

Angular 22 UI ecosystem extending a vendored fork of [PrimeNG](https://github.com/primefaces/primeng)
21.1.9 with NgRx Signal Store state management. Originally scaffolded from
[sakai-ng](https://github.com/primefaces/sakai-ng).

---

## ✅ Phase 1 – Workspace & Library Setup

- [x] Angular workspace `helix` (Angular 21 initially, upgraded to 22 in epic #233)
- [x] Library `@helix-ui/core` (vendored PrimeNG fork, `h-` selectors)
- [x] Demo app `apps/helix-demo`
- [x] Dependencies: `@ngrx/signals`, `@primeuix/*`, `tailwindcss@^4`
- [x] GitHub Actions CI/CD workflow (build + test; publish via manual `workflow_dispatch`)
- [x] Public npm registry publishing under the `@helix-ui` scope (moved off GitHub Packages —
      that registry requires the scope to equal the repo owner, which `@helix-ui` doesn't)

---

## ✅ Phase 2 – Layout Components

NgRx Signal Store-backed layout, in `@helix-ui/shell`. All components use separate
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

Generic, reusable page templates in `@helix-ui/shell`.

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
      `@helix-ui/core/pages` barrel)
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
      `HelixFormArrayWithFactory`, `helixFormErrorMap`) from `@helix-ui/shell` into
      `@helix-ui/core`
- [x] #381 – Package restructure: `@gravionlabs/*` → `@helix-ui/*`, `core`/`shell`/`zod`/`ag-grid`
      naming, release cleanup (all sub-issues closed; parent issue still open pending closeout)
- [ ] #385 – Documentation refresh: committed component-docs generator
      (`scripts/generate-component-docs.mjs`) + regenerated `docs/components/*`, manual docs swept
      for stale symbol names / import paths

---

## Architecture

```
helix/
├── projects/
│   ├── core/                  # @helix-ui/core — vendored PrimeNG fork
│   ├── shell/                 # @helix-ui/shell — app shell, auth/landing pages, layout store
│   ├── zod/                   # @helix-ui/zod — Zod v4 reactive-forms adapter
│   └── ag-grid/               # @helix-ui/ag-grid — AG Grid helpers
├── apps/
│   └── helix-demo/            # Showcase app (dashboard, uikit, crud, docs)
└── docs/
    ├── ROADMAP.md
    ├── COMPONENTS.md
    ├── HELIX-SHELL.md
    └── components/            # One generated page per @helix-ui/core entry point
```

## Published to

The public npm registry, under the `@helix-ui` scope (`@helix-ui/core`, `@helix-ui/shell`,
`@helix-ui/zod`, `@helix-ui/ag-grid`). Publishing is currently manual
(`workflow_dispatch` with `force-publish`) until #381's rename has settled — see
[`.github/workflows/ci.yml`](../.github/workflows/ci.yml).
