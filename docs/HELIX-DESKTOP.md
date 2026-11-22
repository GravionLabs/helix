# Helix Desktop

`@gravionlabs/helix-desktop` is the desktop frame of Helix: an activity bar with views, a sidebar or tab area and a status bar, with the platform switch (`data-platform`). The decision is [ADR 0005](https://github.com/GravionLabs/helix/blob/main/docs/adr/0005-helix-desktop-package.md).

The package builds, is tested and is published with the other packages. Components so far: `HxAppShell`, `HxAppToolbar`, `HxActivityBar`, `HxStatusBar`, and in the `/tauri` entry `HxStatusUpdate` with the update service.

## Entry points

- `@gravionlabs/helix-desktop`: components, the view contract and the platform switch. It imports nothing from `@tauri-apps/*`.
- `@gravionlabs/helix-desktop/tauri`: the Tauri bindings (update service, `HxStatusUpdate`, app version and channel, `providePlatform()`). Outside Tauri every service is a no-op. The only entry that may import `@tauri-apps/*`; `pnpm lint:no-tauri` enforces it.

## Peer dependencies

`@angular/core`, `@angular/common`, `@angular/cdk` and `@gravionlabs/helix-ui`.

## Styles

```css
@import "@gravionlabs/helix-ui/tokens.css";
@import "@gravionlabs/helix-desktop/styles.css";
```

Only `--h-*` tokens are read, so light and dark follow `HxTheme`.

## Tauri content security policy

A Tauri app on Helix needs this `app.security` block in `src-tauri/tauri.conf.json`; without `dangerousDisableAssetCspModification` the release build renders without its component and grid styles:

```json
"security": {
  "csp": {
    "default-src": "'self'",
    "script-src": "'self'",
    "style-src": "'self' 'unsafe-inline'",
    "img-src": "'self' data:",
    "font-src": "'self' data:",
    "connect-src": "ipc: http://ipc.localhost"
  },
  "dangerousDisableAssetCspModification": ["style-src"]
}
```

**Why:** when Tauri serves the bundled assets it adds hashes and nonces to `script-src` and `style-src`, for example for the critical CSS Angular inlines into `index.html`. Once a directive carries a hash or a nonce, browsers ignore `'unsafe-inline'` in it. Every `<style>` element inserted at runtime is then blocked: the Angular component styles and the CSS that the AG Grid Theming API (`helixGridTheme` of `@gravionlabs/helix-ag-grid`) injects. Turning the rewriting off for `style-src` only keeps the automatic hashes of `script-src`, so inline scripts stay blocked.

**Symptoms:** the global styles still load (tokens, fonts, background), but the views lose their padding and gaps, and the grids show their column headers as stacked text without rows, so the lists look empty.

**Why it shows only in installers:** with `"devCsp": null`, `tauri dev` runs without any policy. Set `devCsp` to the same policy, plus what the dev server needs (for example `ws://localhost:<port>` in `connect-src` for live reload), so a CSP problem shows during development. Passing nonces through instead (Angular `CSP_NONCE`, AG Grid `styleNonce`) does not work, because Tauri does not hand its nonces to the app.

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

- `HxStatusItem`: `kind` `'text'` (default) or `'button'`, `title`, `ariaLabel`, `disabled`, `tone` (`neutral`, `warn`, `error`, `accent`), `announce`, `popoverOpen` (two-way). Output `pressed` fires when a button item is activated (click, Enter, Space), not for a disabled or text item or a click inside the popover.
- `announce` sets `role="status"` on that item only; the bar is not a live region. Use it for values that change on their own.
- An element with `hxStatusPopover` inside a button item opens above the bar; Escape and a click outside close it.
- Conditional items: an `@if` block projects only when it has one root node and a `slot` attribute on it. For a group of items in one slot, wrap them in `<ng-container ngProjectAs="[slot=end]">` (without it Angular reports NG8011 and the items are not projected). The wrapper adds no element.

  ```html
  <hx-status-bar>
    @if (activePane()) {
      <ng-container ngProjectAs="[slot=end]">
        <hx-status-item>Input</hx-status-item>
        <hx-status-item>119×46</hx-status-item>
      </ng-container>
    }
    <hx-status-version slot="end" version="1.4.0" />
  </hx-status-bar>
  ```

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
  <section slot="bottom">...</section>
  <hx-status-bar slot="status">...</hx-status-bar>
</hx-app-shell>
```

- Slots: `toolbar`, `activity`, `sidebar`, `panel`, `bottom`, `status`, and the default slot for content.
- One sidebar: the app shows the view of `activeId` in it. `selectView(id)` collapses the sidebar when `id` is the active view, and otherwise makes it active and expands the sidebar. `showView(id)` never collapses: it activates the view and expands the sidebar, for links from outside the activity bar (status bar, notifications, commands). Both report through `sidebarChange`.
- Models: `sidebarWidth` (px), `collapsed`, `activeId`. Inputs: `minWidth` (160), `maxWidth` (480), `step` (16), `resizerLabel`, `fixedWidth`. Output `sidebarChange` emits `{ width, collapsed }` so the app can store them.
- The splitter is `role="separator"` with `aria-valuenow`, `aria-valuemin` and `aria-valuemax`. Drag it, or use Left/Right (Shift: 4 times the step), Home and End.
- Bottom panel: `slot="bottom"` lies below the content, next to the sidebar and not under the activity bar. Models: `bottomOpen` (closed hides the slot and its splitter; `toggleBottom()` flips it) and `bottomHeight` (px). Inputs: `minBottomHeight` (80), `maxBottomHeight` (480), `bottomResizerLabel`. Its splitter is a horizontal `role="separator"`: drag it, or use Up/Down (Shift: 4 times the step), Home and End.

### Inset layout (frame and panels)

The shell uses the inset layout of helix-shell (see [HELIX-SHELL.md](HELIX-SHELL.md#inset-layout-frame-and-panels)). There is one layout and no option to switch it.

- **Frame.** `--h-surface-frame` sits behind everything. The toolbar and the status bar lie flat on it; inside the shell the status bar has no top hairline.
- **Inset panels.** The activity bar, the sidebar, the content and the `panel` slot each have a 1px `--h-content-border-color` border, the panel radius and `--h-content-background`, with the panel gap to each other and to the window edge.
- **Splitter.** The sidebar splitter fills the gap between the sidebar and the content. Its hit area is a few pixels wider than the gap, so it stays usable with a gap of 0. A collapsed sidebar leaves one gap between the activity bar and the content.

| Token                  | Default | Used for                                                          |
| ---------------------- | ------- | ----------------------------------------------------------------- |
| `--helix-panel-radius` | `6px`   | Corner radius of the panels                                       |
| `--helix-panel-gap`    | `4px`   | Gap between the panels and to the window edge; `0` makes it flush |

They are the tokens of helix-shell, so one value in the app stylesheet sets both packages. helix-desktop has its own fallbacks and does not need the shell stylesheet.

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

## The tauri entry

`@tauri-apps/plugin-updater`, `plugin-process` and `api` are optional peer dependencies, loaded on first use. The plugin calls sit behind `HxUpdateBackend` (`check`, `install`, `relaunch`); provide `HX_UPDATE_BACKEND` to replace it in tests. Outside Tauri the backend is `noopUpdateBackend`.

```ts
bootstrapApplication(App, {
  providers: [providePlatform(), provideHxAppInfo({ version: await readTauriVersion() })],
});
```

- `HxUpdateService`: `state` is `idle`, `checking`, `current`, `available` (with `update`: version, notes), `installing` or `error` (with the failed `step`: `check`, `install` or `relaunch`). `start()` checks once; `check()` checks on request; `installAndRestart()` installs and restarts.
- `provideHxAppInfo({ version, channel? })`: the channel is `stable` or `rc`, derived from a `-rc` version when not given. An RC build shows the badge (`<hx-status-app-version slot="end" />` shows the version and the badge) and `start()` does not check by itself.
- `HxStatusUpdate` (`<hx-status-update slot="end" />`): the state as a status item with the version, the notes and "Install and restart" in the popover. Labels are inputs. Not rendered on mobile or while idle or current.
- `providePlatform()` sets `data-platform` to `macos`, `windows`, `linux`, `ios`, `android` or `web`. `getHxPlatformKind()` maps it to the shell kind `desktop`, `mobile` or `web`.
