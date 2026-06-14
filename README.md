# @gravion/helix

Angular 21 UI library extending [sakai-ng](https://github.com/primefaces/sakai-ng) with NgRx Signal Store state management. Built on [PrimeNG](https://primeng.org) and [Tailwind CSS](https://tailwindcss.com).

## Features

- **Layout components** — App shell with topbar, sidebar, menu, footer, and theme configurator
- **Auth pages** — Login, error, and access-denied pages with lazy route config
- **Landing page widgets** — Hero, features, highlights, pricing, and footer sections
- **State management** — NgRx Signal Store for layout state (theme, menu, dark mode)
- **Standalone components** — Fully Angular 21 standalone, no NgModules required

## Quick Start

```bash
npm install @gravion/helix
```

```ts
import { Component } from '@angular/core';
import { HelixAppLayout } from '@gravion/helix';
import { HELIX_MENU_MODEL } from '@gravion/helix';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HelixAppLayout],
  providers: [
    { provide: HELIX_MENU_MODEL, useValue: [] satisfies MenuItem[] },
  ],
  template: `<helix-app-layout appTitle="My App" />`,
})
export class AppComponent {}
```

## Development

This workspace contains the library (`projects/helix`) and a demo application (`projects/demo`).

```bash
ng serve demo           # Start the demo app
ng build helix          # Build the library
ng test helix           # Run library unit tests
```

## Documentation

- [Component API reference](docs/COMPONENTS.md)
- [Project roadmap](docs/ROADMAP.md)

## License

MIT
