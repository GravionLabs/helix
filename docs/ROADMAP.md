# @gravion/sakai-ui – Roadmap

Angular 21 UI library extending [sakai-ng](https://github.com/primefaces/sakai-ng) with NgRx Signal Store state management.

---

## ✅ Phase 1 – Workspace & Library Setup

- [x] Angular 21 workspace `gravion-sakai`
- [x] Library `@gravion/sakai-ui` scaffolded (`ng generate library`)
- [x] Demo app scaffolded (`ng generate application demo`)
- [x] Dependencies: `@ngrx/signals@^21`, `primeng@^21`, `tailwindcss@^4`
- [x] GitHub Actions CI/CD workflow (build + publish to GitHub Packages)
- [x] `.npmrc` für `@gravion` scope

---

## ✅ Phase 2 – Layout Components

NgRx Signal Store replacing sakai-ng's `LayoutService`. All components use separate `.ts` / `.html` / `.scss` files (Angular 21 convention, no `.component` postfix).

### Store
- [x] `layout.models.ts` – `LayoutConfig`, `LayoutState`, `MenuMode`
- [x] `layout.store.ts` – `LayoutStore` with `signalStore()`
- [x] Dark mode via `withHooks().onInit` effect (View Transitions API)
- [x] `GV_MENU_MODEL` injection token für konfigurierbare Navigation

### Components
- [x] `GvAppLayout` – Router-Outlet wrapper with CSS class bindings
- [x] `GvTopbar` – Navigation bar with menu toggle
- [x] `GvSidebar` – Collapsible sidebar with outside-click handling
- [x] `GvMenu` – Pure presentational menu (`@Input() model`)
- [x] `GvMenuItem` – Recursive menu item with animations
- [x] `GvFooter` – Footer bar
- [x] `GvConfigurator` – Theme configurator (preset, primary, surface, dark mode)

---

## 🔄 Phase 3 – Pages

Generic, reusable page templates moved from the demo into the library.

### Components to add

#### Auth Pages
- [ ] `GvLogin` – Login page
- [ ] `GvError` – Error page
- [ ] `GvAccess` – Access denied page
- [ ] `authRoutes` – Lazy-loadable auth route config

#### Utility Pages
- [ ] `GvNotFound` – 404 Not Found page
- [ ] `GvEmpty` – Empty state page

#### Landing Page
- [ ] `GvLanding` – Landing page wrapper
- [ ] `GvHeroWidget` – Hero section
- [ ] `GvFeaturesWidget` – Features section
- [ ] `GvHighlightsWidget` – Highlights section
- [ ] `GvPricingWidget` – Pricing section
- [ ] `GvFooterWidget` – Landing page footer
- [ ] `GvTopbarWidget` – Landing page topbar

#### Floating Configurator
- [ ] `GvFloatingConfigurator` – Floating dark-mode + theme button (moved from demo)

### Demo stays (not in library)
- `dashboard/` – Demo-specific charts and fake data
- `uikit/` – PrimeNG component showcase
- `crud/` – Demo CRUD table
- `service/` – Fake data services
- `documentation/` – Project-specific documentation

---

## 📋 Phase 4 – Enhancements (Planned)

- [ ] `@Input()` customization for all page components (titles, logos, links)
- [ ] Secondary entry points (`@gravion/sakai-ui/pages`, `@gravion/sakai-ui/layout`)
- [ ] Unit tests for `LayoutStore`
- [ ] Storybook integration
- [ ] Separate `CHANGELOG.md` + semantic versioning via GitVersion

---

## Architecture

```
gravion-sakai/
├── projects/
│   ├── sakai-ui/              # @gravion/sakai-ui (library)
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

[GitHub Packages](https://github.com/GravionLabs/gravion-sakai/packages) under `@gravion/sakai-ui`.
