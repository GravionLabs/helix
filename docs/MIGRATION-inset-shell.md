# Migrating to the inset shell layout

Part of feature #1021 (PBIs #1031, #1023, #1024, #1025; docs #1026). **Breaking** for apps on `@gravionlabs/helix-shell`, released with the next minor (the version is decided by the release tooling from the Conventional Commits). The frame/inset model itself is described in the [shell reference](HELIX-SHELL.md#inset-layout-frame-and-panels).

The inset layout replaces the previous layout. There is no `classic` option and no flag to keep the old look.

## What changed

| Area             | Before                                                    | Now                                                                                                                                       |
| ---------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Window           | Topbar across the window, rail and content with hairlines | One frame ground (`--helix-surface-chrome`); nav rail and content are inset panels (1px border, radius, gap)                              |
| Page header      | Topbar bar with global actions                            | Head of the content panel (48px): breadcrumb trail or page title, plus your `[helixTopbarEnd]` content                                    |
| Global actions   | Topbar (dark mode, configurator, alerts, action buttons)  | Nav rail footer; stacked as an icon column when the rail is collapsed; in the overlay rail on mobile                                      |
| Ellipsis menu    | Topbar (`topbarActions`)                                  | Nav rail footer (`menuActions`)                                                                                                           |
| Collapse toggle  | Rail edge / bottom of the window                          | Nav rail footer; the only collapse control on desktop                                                                                     |
| Status bar       | Full-width coloured bar, top hairline                     | Flat on the frame, 28px, 12px text; the `neutral` tone has no background; `staging`, `production`, `success`, `danger` stay filled strips |
| Chrome controls  | 2.5rem round icon buttons                                 | 32px squares (`--helix-control-height`) with `border.radius.md`; rail search and projected fields share the `hx-input` look               |
| Mobile (< 992px) | Gaps and borders as on desktop                            | Content panel edge to edge (no gap, radius, border); the rail stays an overlay                                                            |
| `.layout-main`   | Max width cap on wide screens                             | Fills the panel and scrolls inside it (the frame does not scroll); scroll resets on navigation                                            |

## API changes

### `helix-app-layout`

- New input `pageTitle` (default: title of the deepest route that has a title, then the last breadcrumb, then `appTitle`).
- `topbarItems` and `topbarActions` keep their names and meaning, but are now rendered in the nav rail footer. The `mobile` item is ignored.
- `[helixTopbarEnd]` and `[hxStatusBarEnd]` projection are unchanged.

No change is needed when you only use `<helix-app-layout>`; check the visual points below.

### `helix-topbar` (direct users only)

- Removed inputs: `items`, `topbarActions`, `menuLabel`.
- New input: `pageTitle`.
- Removed elements: `layout-config-menu`, `layout-topbar-menu`, `layout-topbar-menu-button`.

```html
<!-- before -->
<helix-topbar [items]="items" [topbarActions]="actions" menuLabel="More" />

<!-- now: the global actions are inputs of the nav rail -->
<helix-nav-rail [items]="items" [menuActions]="actions" menuLabel="More" ... />
<helix-topbar pageTitle="Reports" />
```

### `helix-nav-rail`

- New inputs: `items` (global actions: `darkmode`, `configurator`, `alert`, `action`), `menuActions` (ellipsis menu entries), `menuLabel` (accessible name, default `'More actions'`).

### `helix-status-bar`

- The `height` default is now `var(--helix-status-bar-height, 28px)`.
- The tinted tones use darker steps so white text keeps AA contrast.

### Tokens

New in `projects/shell/styles-src.css`: `--helix-panel-gap` (4px), `--helix-panel-radius` (6px), `--helix-control-height` (32px). `--helix-status-bar-height` is now 28px and `--helix-topbar-height` is 3rem (48px). `--helix-surface-chrome` is the frame ground. See the [token table](HELIX-SHELL.md#layout-tokens).

## Migration steps

1. Upgrade `@gravionlabs/helix-shell` and run the app; with `<helix-app-layout>` the new layout applies without code changes.
2. Move global actions: nothing to do when you pass `topbarItems` / `topbarActions` to `helix-app-layout`. Direct `helix-topbar` users bind `items` / `menuActions` / `menuLabel` on `helix-nav-rail` instead (see above).
3. Page header: give pages without a breadcrumb trail a route `title` (or set `pageTitle`), so the header start is not just the app title.
4. Text fields projected into `[helixTopbarEnd]`: add `hx-input` and import the `HxInput` directive in the consuming component; the bare attribute does not style the field. Use `flex: 1` on a filter bar to let it fill the header.
5. Status bar: keep the `tone` for environments; use `neutral` (default) for a flat bar. Check custom colours on the new frame ground, in light and dark.
6. Remove CSS that targeted the old structure: the topbar hairline and background, the `layout-topbar-menu*` and `layout-config-menu` selectors, rail borders, and any `.layout-main` max-width or outer padding workaround. Style the panels through the tokens instead. `app-layout` no longer sets the `blocked-scroll` class on `<body>` while the mobile menu is open: it makes `.layout-main` `inert`, and the panel scrolls instead of the window. Drop any styling of, or reliance on, `body.blocked-scroll`.
7. Popups and absolutely positioned elements inside `[helixTopbarEnd]` are clipped at the panel edge (`.layout-panel` has `overflow: hidden`); use overlays that attach to the body (for example CDK overlays).
8. In-page `#fragment` links no longer scroll the window; the content panel scrolls, not the page.

## Checklist for apps (including poimen)

- [ ] Global actions (dark mode, configurator, alerts, user entries) are in the rail footer and reachable collapsed and on mobile.
- [ ] Page header shows a breadcrumb trail or a title on every route.
- [ ] Collapse toggle in the rail footer is the only desktop collapse control; no custom toggle in the status bar.
- [ ] Status bar looks right flat on the frame and, where used, as a tinted strip, in light and dark.
- [ ] No leftover overrides for removed topbar elements.
- [ ] Layout checked at 320px, 991px and 992px and above.

Apps such as poimen follow the same steps and checklist.
