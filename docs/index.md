---
layout: home

hero:
  name: Helix
  text: Angular 22 UI components
  tagline: A maintained fork of PrimeNG 21.1.9 with signals and h- selectors, plus an application shell, dynamic forms and AG Grid helpers.
  actions:
    - theme: brand
      text: Components
      link: /components/
    - theme: alt
      text: Shell API
      link: /HELIX-SHELL
    - theme: alt
      text: Live demo
      link: /demo/
    - theme: alt
      text: GitHub
      link: https://github.com/GravionLabs/helix

features:
  - title: '@gravionlabs/helix-core'
    details: 90 components, 9 directives and the theming infrastructure, one secondary entry point each.
    link: /components/
  - title: '@gravionlabs/helix-shell'
    details: Topbar, nav rail, status bar, auth pages, landing widgets and the layout store.
    link: /HELIX-SHELL
  - title: '@gravionlabs/helix-zod'
    details: Dynamic forms from annotated Zod v4 schemas, on Angular signal forms.
  - title: '@gravionlabs/helix-ag-grid'
    details: Value formatters, number parsers and cell styles for AG Grid.
---

## Install

```bash
npm install @gravionlabs/helix-core
```

```ts
import { ButtonModule } from '@gravionlabs/helix-core/button';
```

```html
<button hButton label="Save"></button>
```

Every component is imported from its own entry point (`@gravionlabs/helix-core/<module>`) and uses the
`h-` selector prefix. Browse the [component reference](components/README.md), the
[shell API](HELIX-SHELL.md) or the [roadmap](ROADMAP.md).
