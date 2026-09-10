# @helix-ui/shell

Angular application shell for [Helix](../../README.md), extending
[sakai-ng](https://github.com/primefaces/sakai-ng) with
[NgRx Signal Store](https://ngrx.io/guide/signals) for state management.

## Features

- 🧩 **Layout** — `HelixAppLayout` with topbar, nav rail, status bar, and footer
- 🔀 **Routing utilities** — `helixRoutesFrom`, `helixMenuLinksFrom`, `helixBreadcrumbsFromRoutes`
- 🗃️ **NgRx Signal Store** — `LayoutStore` for theme, menu, and dark-mode state
- 🔐 **Auth & error pages** — login, error, access-denied, not-found, with lazy route config
- 🚀 **Landing widgets** — hero, features, highlights, pricing, footer sections
- 📝 **Form infrastructure** — `HelixFormField`, `HelixValidators`, `helixFormErrorMap`
- 🎨 **Helix + PrimeUIX theming** — Aura / Lara / Nora presets, dark mode via View Transitions
- 📦 **Standalone components** — no NgModule required

## Installation

```bash
npm install @helix-ui/shell
```

### Peer Dependencies

`@angular/core >=22`, `@ngrx/signals >=21`, `@helix-ui/core >=22`,
`@primeuix/themes >=2`, `primeicons >=7`.

## Setup

```typescript
// app.config.ts
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from '@helix-ui/core/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } })
  ]
};
```

```typescript
// app.routes.ts
import { HelixAppLayout } from '@helix-ui/shell';

export const appRoutes: Routes = [
  {
    path: '',
    component: HelixAppLayout,
    children: [/* your routes */]
  }
];
```

## Styles

Some components use Tailwind utility classes baked into their templates. The
library ships a prebuilt stylesheet covering those classes — add it to your
app's global styles, since Tailwind's content scanning does not look inside
`node_modules` by default:

```json
// angular.json
"styles": [
  "node_modules/@helix-ui/shell/styles.css",
  "src/styles.scss"
]
```

## Layout Store

```typescript
import { inject } from '@angular/core';
import { LayoutStore } from '@helix-ui/shell';

layoutStore = inject(LayoutStore);
layoutStore.toggleDarkMode();
layoutStore.setMenuMode('overlay');
```

## Documentation

Full API reference — every component, input, store signal, and form utility —
lives in [docs/HELIX-SHELL.md](../../docs/HELIX-SHELL.md).

## Development

```bash
pnpm start                # Serve the demo app (builds libs first)
ng build shell      # Build the library
pnpm test:lib:stable      # Run the shell unit tests
```

## License

MIT
