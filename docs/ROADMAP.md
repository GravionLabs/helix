# @gravionlabs/helix – Roadmap

Angular 21 UI library extending [sakai-ng](https://github.com/primefaces/sakai-ng) with NgRx Signal Store state management.

---

## ✅ Phase 1 – Workspace & Library Setup

- [x] Angular 21 workspace `helix`
- [x] Library `@gravionlabs/helix` scaffolded (`ng generate library`)
- [x] Demo app scaffolded (`ng generate application demo`)
- [x] Dependencies: `@ngrx/signals@^21`, `primeng@^21`, `tailwindcss@^4`
- [x] GitHub Actions CI/CD workflow (build + publish to GitHub Packages)
- [x] `.npmrc` for `@gravionlabs` scope

---

## ✅ Phase 2 – Layout Components

NgRx Signal Store replacing sakai-ng's `LayoutService`. All components use separate `.ts` / `.html` / `.scss` files (Angular 21 convention, no `.component` postfix).

### Store
- [x] `layout.models.ts` – `LayoutConfig`, `LayoutState`, `MenuMode`
- [x] `layout.store.ts` – `LayoutStore` with `signalStore()`
- [x] Dark mode via `withHooks().onInit` effect (View Transitions API)
- [x] `[menu]` input binding replacing removed `HELIX_MENU_MODEL` token

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

Generic, reusable page templates moved from the demo into the library.

#### Auth Pages
- [x] `HelixLogin` – Login page
- [x] `HelixError` – Error page
- [x] `HelixAccess` – Access denied page
- [x] `authRoutes` – Lazy-loadable auth route config

#### Utility Pages
- [x] `HelixNotfound` – 404 Not Found page
- [x] `HelixEmpty` – Empty state page

#### Landing Page
- [x] `HelixLanding` – Landing page wrapper
- [x] `HelixHeroWidget` – Hero section
- [x] `HelixFeaturesWidget` – Features section
- [x] `HelixHighlightsWidget` – Highlights section
- [x] `HelixPricingWidget` – Pricing section
- [x] `HelixFooterWidget` – Landing page footer
- [x] `HelixTopbarWidget` – Landing page topbar

#### Floating Configurator
- [x] `HelixFloatingConfigurator` – Floating dark-mode + theme button (moved from demo)

### Demo stays (not in library)
- `dashboard/` – Demo-specific charts and fake data
- `uikit/` – PrimeNG component showcase
- `crud/` – Demo CRUD table
- `service/` – Fake data services
- `documentation/` – Project-specific documentation

---

## 📋 Phase 4 – Enhancements (Planned)

- [x] `@Input()` customization for all page components (titles, logos, links)
- [x] Unit tests for `LayoutStore`
- [ ] Secondary entry points (`@gravionlabs/helix/pages`, `@gravionlabs/helix/layout`)
- [ ] Storybook integration
- [ ] Separate `CHANGELOG.md` + semantic versioning via GitVersion

---

## Architecture

```
helix/
├── projects/
│   ├── helix/                 # @gravionlabs/helix (library)
│   │   └── src/lib/
│   │       ├── layout/        # Layout components + NgRx store
│   │       └── pages/         # Reusable page templates (Phase 3)
│   └── demo/                  # Demo application
│       └── src/app/
│           ├── layout/        # Demo-specific: menu.model.ts, app.floatingconfigurator.ts
│           └── pages/         # Demo pages (dashboard, uikit, crud, docs)
└── docs/
    └── ROADMAP.md
```

## Published to

[GitHub Packages](https://github.com/GravionLabs/helix/packages) under `@gravionlabs/helix`.
