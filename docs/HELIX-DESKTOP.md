# Helix Desktop

`@gravionlabs/helix-desktop` is the desktop frame of Helix: an activity bar with views, a sidebar or tab area and a status bar, with the platform switch (`data-platform`). The decision is [ADR 0005](https://github.com/GravionLabs/helix/blob/main/docs/adr/0005-helix-desktop-package.md).

The package builds, is tested and is published with the other packages. Components so far: `HxAppShell`, `HxAppToolbar`, `HxActivityBar`, `HxStatusBar`.

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

## HxAppShell

The layout: toolbar, activity bar, one sidebar, content, an optional right panel and the status bar. Project each part with a `slot` attribute; unslotted content is the main area and takes the app's tab layout (the shell has no tab logic).

```html
<hx-app-shell #shell [(sidebarWidth)]="width" [(collapsed)]="collapsed" [(activeId)]="viewId" (sidebarChange)="store($event)">
  <hx-app-toolbar slot="toolbar">...</hx-app-toolbar>
  <hx-activity-bar slot="activity" [items]="items" [activeId]="shell.activeId()" [expanded]="!shell.collapsed()" (selected)="shell.selectView($event)" />
  <nav slot="sidebar">...</nav>
  <hx-tab-bar>...</hx-tab-bar>
  <aside slot="panel">...</aside>
  <hx-status-bar slot="status">...</hx-status-bar>
</hx-app-shell>
```

- Slots: `toolbar`, `activity`, `sidebar`, `panel`, `status`, and the default slot for content.
- One sidebar: the app shows the view of `activeId` in it. `selectView(id)` collapses the sidebar when `id` is the active view, and otherwise makes it active and expands the sidebar.
- Models: `sidebarWidth` (px), `collapsed`, `activeId`. Inputs: `minWidth` (160), `maxWidth` (480), `step` (16), `resizerLabel`, `fixedWidth`. Output `sidebarChange` emits `{ width, collapsed }` so the app can store them.
- The splitter is `role="separator"` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`. Drag it, or use Left/Right (Shift: 4 times the step), Home and End.

## HxAppToolbar

The 26 px bar at the top with `start`, `centre` (title) and `end` slots. It carries `data-tauri-drag-region` (also on the centre), so it drags a Tauri window; buttons in the start and end slot do not. `windowButtonsInset` reserves 78 px at the start for the macOS window buttons when the title bar is hidden.

## HxMobileShell and HxBottomBar

The phone layout: the same views, a different shell. A top bar with the menu button, the content, a bottom bar and a drawer (`HxDrawer` of helix-ui) for the sidebar views. There is no status bar and no hover tooltip; every touch target is at least 44 pt.

```html
<hx-mobile-shell #shell [items]="items" [(activeId)]="viewId" [(drawerOpen)]="drawer" heading="Helix">
  <nav slot="drawer"><button (click)="shell.chooseView('files')">Files</button></nav>
  ...the view of viewId...
</hx-mobile-shell>
```

- `HxBottomBar` (`items`, `activeId`, `label`, output `selected`) shows the first five items (`HX_BOTTOM_BAR_MAX_ITEMS`); an item has the shape of an activity bar item.
- `HxMobileShell`: `items`, models `activeId` and `drawerOpen`, inputs `heading`, `menuLabel`, `closeLabel`, `barLabel`. The `drawer` slot holds the sidebar views, `end` adds to the top bar. `chooseView(id)` activates a view and closes the drawer.
- The drawer opens with the menu button; it closes with a tap outside, a swipe toward its edge, Escape and after a view was chosen.
- Safe areas: the top bar, the bottom bar and the drawer pad with `env(safe-area-inset-*)`, the content with `env(keyboard-inset-height)`. Use `viewport-fit=cover` and `interactive-widget=resizes-content` in the viewport meta tag.
- Pick the shell by platform, not by width: `getHxPlatform()` reads `data-platform` of the root element (`desktop`, `mobile` or `web`), `setHxPlatform()` sets it. A narrow desktop window keeps the desktop shell.

```html
@if (platform === 'mobile') { <hx-mobile-shell ...> } @else { <hx-app-shell ...> }
```
