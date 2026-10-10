---
layout: home

hero:
  name: Helix
  text: Angular 22 UI components
  tagline: Standalone, signal-based Angular components on design tokens with plain CSS, plus an application shell, dynamic forms and AG Grid helpers.
  actions:
    - theme: brand
      text: Components
      link: /components/
    - theme: alt
      text: Shell API
      link: /HELIX-SHELL
    - theme: alt
      text: Theming
      link: /THEMING
    - theme: alt
      text: Live demo
      link: /demo/
      # The demo is a separate app next to the site: without a target VitePress's router would look
      # for a page of its own and show its 404 until a reload.
      target: _self
    - theme: alt
      text: GitHub
      link: https://github.com/GravionLabs/helix

features:
  - title: '@gravionlabs/helix-ui'
    details: 51 components with hx- selectors, tokens, a theme service and the validators, one page each.
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
npm install @gravionlabs/helix-ui
```

```css
@import "@gravionlabs/helix-ui/styles.css";
@import "@gravionlabs/helix-ui/tokens.css";
```

```ts
import { HxButton } from '@gravionlabs/helix-ui';
```

```html
<button hx-button>Save</button>
```

Components are standalone elements (`<hx-select>`) and attributes on native elements (`<button hx-button>`). Browse
the [component reference](components/README.md), the [helix-ui overview](HELIX-UI.md), the
[shell API](HELIX-SHELL.md) or the [roadmap](ROADMAP.md). Colours, dark mode and the primary colour are CSS custom
properties (`--h-*`) that the theme service of helix-ui changes at runtime; see [Theming](THEMING.md).
