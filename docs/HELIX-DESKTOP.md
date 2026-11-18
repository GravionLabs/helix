# Helix Desktop

`@gravionlabs/helix-desktop` is the desktop frame of Helix: an activity bar with views, a sidebar or tab area and a status bar, with the platform switch (`data-platform`). The decision is [ADR 0005](https://github.com/GravionLabs/helix/blob/main/docs/adr/0005-helix-desktop-package.md).

The package builds, is tested and is published with the other packages. Components so far: `HxActivityBar`, `HxStatusBar`.

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

## HxStatusBar

The 22 px bottom bar with a start and an end group. Items are projected, not configured by inputs.

```html
<hx-status-bar>
  <hx-status-item slot="start" [announce]="true">Synced</hx-status-item>
  <hx-status-item slot="end" kind="button" ariaLabel="Update details" [(popoverOpen)]="open">
    Update 1.5.0
    <div hxStatusPopover>Release notes</div>
  </hx-status-item>
  <hx-status-zoom slot="end" [(value)]="zoom" [min]="50" [max]="200" />
  <hx-status-version slot="end" version="1.4.0" channel="RC" />
</hx-status-bar>
```

- `HxStatusItem`: `kind` `'text'` (default) or `'button'`, `title`, `ariaLabel`, `disabled`, `tone` (`neutral`, `warn`, `error`, `accent`), `announce`, `popoverOpen` (two-way).
- `announce` sets `role="status"` on that item only; the bar is not a live region. Use it for values that change on their own.
- An element with `hxStatusPopover` inside a button item opens above the bar; Escape and a click outside close it.
- `HxStatusZoom`: `value` (two-way, percent), `min`, `max`, `step`, `reset`. The percentage resets.
- `HxStatusVersion`: `version` and an optional `channel` badge.
