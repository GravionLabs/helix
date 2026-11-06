# Migrating to the inset shell layout

Part of feature #1021 (PBIs #1031, #1023, #1024, #1025; docs #1026). **Breaking** for apps on `@gravionlabs/helix-shell`, released with the next minor (the version is decided by the release tooling from the Conventional Commits). The frame/inset model itself is described in the [shell reference](HELIX-SHELL.md#inset-layout-frame-and-panels).

The inset layout replaces the previous layout. There is no `classic` option and no flag to keep the old look.

## What changed

| Area             | Before                                                    | Now                                                                                                                                       |
| ---------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Window           | Topbar across the window, rail and content with hairlines | One frame ground (`--helix-surface-chrome`); nav rail and content are inset panels (1px border, radius, gap)                              |
| Page header      | Topbar bar with global actions                            | Head of the content panel (48px): breadcrumb trail or page title, plus the global actions (`topbarActions`)                               |
| Global actions   | Topbar (dark mode, configurator, alerts, action buttons)  | Page header, configured by `topbarActions` (zones start, center, end; default toolbar); see [Topbar actions (22.3)](#topbar-actions-223)  |
| Ellipsis menu    | Topbar (`topbarActions`)                                  | Removed; use custom template actions in `topbarActions`                                                                                   |
| Collapse toggle  | Rail edge / bottom of the window                          | Nav rail footer; the only collapse control on desktop                                                                                     |
| Status bar       | Full-width coloured bar, top hairline                     | Flat on the frame, 28px, 12px text; the `neutral` tone has no background; `staging`, `production`, `success`, `danger` stay filled strips |
| Chrome controls  | 2.5rem round icon buttons                                 | 32px squares (`--helix-control-height`) with `border.radius.md`; rail search and projected fields share the `hx-input` look               |
| Mobile (< 992px) | Gaps and borders as on desktop                            | Content panel edge to edge (no gap, radius, border); the rail stays an overlay                                                            |
| `.layout-main`   | Max width cap on wide screens                             | Fills the panel and scrolls inside it (the frame does not scroll); scroll resets on navigation                                            |

## API changes

### `helix-app-layout`

- New input `pageTitle` (default: title of the deepest route that has a title, then the last breadcrumb, then `appTitle`).
- `topbarActions` now takes `HelixTopbarActionConfig[]` and renders the global actions in the page header; `topbarItems` is removed, and so is the `[helixTopbarEnd]` slot (see [Topbar actions (22.3)](#topbar-actions-223)).
- `[hxStatusBarEnd]` projection is unchanged.

Check the visual points below.

### `helix-topbar` (direct users only)

- Removed inputs: `items`, `menuLabel`; the `topbarActions` input (ellipsis menu) is now `actions` and takes `HelixTopbarActionConfig[]`.
- New inputs: `pageTitle`, `alerts`.
- Removed elements: `layout-config-menu`, `layout-topbar-menu`, `layout-topbar-menu-button`.

```html
<!-- before -->
<helix-topbar [items]="items" [topbarActions]="actions" menuLabel="More" />

<!-- now -->
<helix-topbar pageTitle="Reports" [actions]="actions" />
```

### `helix-nav-rail`

- The footer holds only the collapse toggle. The nav rail takes no global actions: it has no `items`, `menuActions` or `menuLabel` inputs.

### `helix-status-bar`

- The `height` default is now `var(--helix-status-bar-height, 28px)`.
- The tinted tones use darker steps so white text keeps AA contrast.

### Tokens

New in `projects/shell/styles-src.css`: `--helix-panel-gap` (4px), `--helix-panel-radius` (6px), `--helix-control-height` (32px). `--helix-status-bar-height` is now 28px and `--helix-topbar-height` is 3rem (48px). `--helix-surface-chrome` is the frame ground. See the [token table](HELIX-SHELL.md#layout-tokens).

## Migration steps

1. Upgrade `@gravionlabs/helix-shell` and run the app; with `<helix-app-layout>` the new layout applies without code changes unless you use the removed APIs (`topbarItems`, `[helixTopbarEnd]`, nav-rail `items`/`menuActions`/`menuLabel`).
2. Move global actions into `topbarActions` (`HelixTopbarActionConfig[]`); follow [Topbar actions (22.3)](#topbar-actions-223) below.
3. Page header: give pages without a breadcrumb trail a route `title` (or set `pageTitle`), so the header start is not just the app title.
4. Controls that were projected into `[helixTopbarEnd]` become custom template actions; text fields inside them need `hx-input` and the `HxInput` directive import in the consuming component.
5. Status bar: keep the `tone` for environments; use `neutral` (default) for a flat bar. Check custom colours on the new frame ground, in light and dark.
6. Remove CSS that targeted the old structure: the topbar hairline and background, the `layout-topbar-menu*` and `layout-config-menu` selectors, rail borders, and any `.layout-main` max-width or outer padding workaround. Style the panels through the tokens instead. `app-layout` no longer sets the `blocked-scroll` class on `<body>` while the mobile menu is open: it makes `.layout-main` `inert`, and the panel scrolls instead of the window. Drop any styling of, or reliance on, `body.blocked-scroll`.
7. Popups and absolutely positioned elements inside a topbar action are clipped at the panel edge (`.layout-panel` has `overflow: hidden`); use overlays that attach to the body (for example CDK overlays).
8. In-page `#fragment` links no longer scroll the window; the content panel scrolls, not the page.

## Checklist for apps (including poimen)

- [ ] Global actions (search, dark mode, configurator, alerts, custom entries) are in the page header via `topbarActions` and reachable on mobile (center zone folds into end up to 991px).
- [ ] Page header shows a breadcrumb trail or a title on every route.
- [ ] The collapse toggle in the rail footer is the only desktop collapse control and the only thing in the footer; no custom toggle in the status bar.
- [ ] Status bar looks right flat on the frame and, where used, as a tinted strip, in light and dark.
- [ ] No leftover overrides for removed topbar or rail-action elements, and no `[helixTopbarEnd]`, `topbarItems`, `items` / `menuActions` / `menuLabel` bindings.
- [ ] Layout checked at 320px, 991px and 992px and above.

Apps such as poimen follow the same steps and checklist.

## Topbar actions (22.3)

**Breaking** (#1044), final design of the global actions: one configurable list in the page header. The nav rail keeps only navigation and the collapse toggle. This section is authoritative where earlier notes differ.

| Before                                                         | Now                                                                                                                  |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `topbarItems` (`darkmode`, `configurator`, `alert`, `action`)  | `topbarActions` entries `darkMode`, `configurator`, `alerts` (items via the `alerts` input), custom template actions |
| `topbarActions: HelixTopbarAction[]` (ellipsis menu)           | Removed. `topbarActions` now takes `HelixTopbarActionConfig[]`; move menu entries to custom template actions         |
| `helix-nav-rail` inputs `items`, `menuActions`, `menuLabel`    | Removed                                                                                                              |
| `HelixTopbarItem`, `HelixTopbarItemType`, `HelixTopbarAction`  | Removed; use `HelixTopbarActionConfig`                                                                               |
| `[helixTopbarEnd]` slot of `helix-app-layout` / `helix-topbar` | Removed, no deprecated path. Use a custom template action                                                            |

Steps:

1. Drop `topbarItems`. The default toolbar already shows search (center) plus dark mode and configurator (end); pass `[alerts]` to add the alerts action. Change single entries with `defineTopbarActions(HELIX_DEFAULT_TOPBAR_ACTIONS, [...])`.
2. Move every control projected into `[helixTopbarEnd]` into an `<ng-template>` and list it as `{ action: { id: 'my-control', template }, position: 'end' }` (or `start` / `center`). A filter field becomes the built-in `search` action (listen to `(search)`).
3. Replace ellipsis-menu entries with custom template actions (for example an icon button per entry).
4. `[]` renders no actions. The center zone folds into the end zone up to 991px.
5. Remove CSS that targeted `.layout-topbar-slot`, `.helix-nav-rail-actions` or `.helix-nav-rail-menu*`.

```html
<!-- before -->
<helix-app-layout [topbarItems]="items" [topbarActions]="menu">
  <input helixTopbarEnd hx-input type="search" aria-label="Filter" />
</helix-app-layout>

<!-- now -->
<helix-app-layout [topbarActions]="actions" (search)="filter($event)" />
```

See [topbar actions](HELIX-SHELL.md#topbar-actions) in the shell reference.
