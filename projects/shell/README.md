# @gravionlabs/helix-shell

Angular application shell for [Helix](../../README.md), extending
[sakai-ng](https://github.com/primefaces/sakai-ng) with
[NgRx Signal Store](https://ngrx.io/guide/signals) for state management.

## Features

- 🧩 **Layout** — `HelixAppLayout` with topbar, nav rail, status bar, and footer
- 🔀 **Routing utilities** — `helixRoutesFrom`, `helixMenuLinksFrom`, `helixBreadcrumbsFromRoutes`
- 🗃️ **NgRx Signal Store** — `LayoutStore` for theme, menu, and dark-mode state
- 🔐 **Auth & error pages** — login, error, access-denied, not-found, with lazy route config
- 🚀 **Landing widgets** — hero, features, highlights, pricing, footer sections
- 📝 **Form infrastructure** — `HelixFormField` (label, hint, touched-gated error); the validators come from `@gravionlabs/helix-ui/validators`
- 🎨 **Helix theming** — dark mode, primary colour and surface through the theme service of helix-ui (`provideHxTheme`), with View Transitions
- 📦 **Standalone components** — no NgModule required

## Installation

```bash
npm install @gravionlabs/helix-shell
```

### Peer Dependencies

`@angular/core >=22`, `@angular/router >=22`, `@ngrx/signals >=21`, `@gravionlabs/helix-ui >=0.1.0` (and its own
peers, `@angular/cdk` and `@angular/forms`), `primeicons >=7`.

## Setup

```typescript
// app.config.ts
import { provideHxTheme } from '@gravionlabs/helix-ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(),
    provideHxTheme({ storageKey: 'my-app-theme', viewTransition: true })
  ]
};
```

```css
/* styles.css: the shell draws its buttons, fields, breadcrumb and tooltips with helix-ui */
@import "@gravionlabs/helix-ui/styles.css";
@import "@gravionlabs/helix-ui/tokens.css";
```

```typescript
// app.routes.ts
import { HelixAppLayout } from '@gravionlabs/helix-shell';

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
  "node_modules/@gravionlabs/helix-shell/styles.css",
  "src/styles.scss"
]
```

## Layout Store

```typescript
import { inject } from '@angular/core';
import { LayoutStore } from '@gravionlabs/helix-shell';

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
