# @gravion/helix

An Angular component library extending [sakai-ng](https://github.com/primefaces/sakai-ng) with [NgRx Signal Store](https://ngrx.io/guide/signals) for state management.

## Features

- 🧩 **7 Layout Components** — `HelixAppLayout`, `HelixTopbar`, `HelixSidebar`, `HelixMenu`, `HelixMenuItem`, `HelixFooter`, `HelixConfigurator`
- ��️ **NgRx Signal Store** — `LayoutStore` replaces the classic `LayoutService`
- 🎨 **PrimeNG 21 + PrimeUIX** — Aura / Lara / Nora theme support
- 🌙 **Dark Mode** — CSS class toggle with View Transitions API
- 📦 **Standalone Components** — no NgModule required

## Installation

```bash
echo "@gravion:registry=https://npm.pkg.github.com" >> .npmrc
npm install @gravion/helix
```

### Peer Dependencies

```bash
npm install @angular/core@>=21 @ngrx/signals@>=21 primeng@>=21 @primeuix/themes@>=2
```

## Setup

```typescript
// app.config.ts
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } })
  ]
};
```

## Usage

```typescript
// app.routes.ts
import { HelixAppLayout } from '@gravion/helix';

export const appRoutes: Routes = [
  {
    path: '',
    component: HelixAppLayout,
    children: [/* your routes */]
  }
];
```

### Accessing the Layout Store

```typescript
import { inject } from '@angular/core';
import { LayoutStore } from '@gravion/helix';

layoutStore = inject(LayoutStore);
layoutStore.toggleDarkMode();
layoutStore.setMenuMode('overlay');
```

## LayoutStore API

| Signal / Computed | Description |
|---|---|
| `darkTheme()` | Dark mode active |
| `menuMode()` | `'static'` \| `'overlay'` |
| `preset()` | Active theme preset |
| `primary()` | Active primary colour |
| `isDarkTheme()` | Computed alias |
| `isOverlay()` | `true` when overlay mode |
| `isSidebarActive()` | Sidebar visibility |

| Method | Description |
|---|---|
| `toggleDarkMode()` | Toggle dark / light |
| `setMenuMode(mode)` | Set menu mode |
| `onMenuToggle()` | Toggle sidebar |
| `updateConfig(config)` | Partial config update |
| `setPreset(name)` | Switch theme preset |
| `setPrimary(name)` | Set primary colour |
| `setSurface(name)` | Set surface colour |

## HelixTopbar Inputs

| Input | Type | Default |
|---|---|---|
| `appTitle` | `string` | `'SAKAI'` |

## Development

```bash
npm run start:demo    # Serve demo app
npm run build:lib     # Build library
npm run build:demo    # Build demo app
```

## License

MIT
