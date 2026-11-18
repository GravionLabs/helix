# Helix Desktop

`@gravionlabs/helix-desktop` is the desktop frame of Helix: an activity bar with views, a sidebar or tab area and a status bar, with the platform switch (`data-platform`). The decision is [ADR 0005](https://github.com/GravionLabs/helix/blob/main/docs/adr/0005-helix-desktop-package.md).

The package builds, is tested and is published with the other packages. Components so far: `HxActivityBar`.

## Entry points

- `@gravionlabs/helix-desktop`: components, the view contract and the platform switch. It imports nothing from `@tauri-apps/*`.
- `@gravionlabs/helix-desktop/tauri`: the Tauri bindings. The only entry that may import `@tauri-apps/*`; `pnpm lint:no-tauri` enforces it.

## Peer dependencies

`@angular/core`, `@angular/common`, `@angular/cdk` and `@gravionlabs/helix-ui`.

## Styles

```css
@import "@gravionlabs/helix-ui/tokens.css";
@import "@gravionlabs/helix-desktop/styles.css";
```

Only `--h-*` tokens are read, so light and dark follow `HxTheme`.

## HxActivityBar

The 48 px icon rail at the far left. It selects the sidebar view, opens tab views and holds actions.

```html
<hx-activity-bar [items]="items" [activeId]="activeId()" [expanded]="open()" (selected)="select($event)" />
```

- Inputs: `items` (`HxActivityBarItem[]`: `id`, `label`, `icon`, `position` `'top'` or `'bottom'`, optional `kind` `'view'` (default, `aria-pressed`) or `'action'` (plain button), optional `badge` as a count or `true` for a dot), `activeId`, `expanded`, `label`. Output: `selected` (the id).
- The active view is marked only while `expanded` is true.
- The rail is one tab stop; arrow keys, Home and End move the focus.
- `icon` is a `TemplateRef` (inline SVG) or an icon name used as a CSS class; both are drawn in a 20 px box. Each item has a tooltip (`title`) and an `aria-label`.
