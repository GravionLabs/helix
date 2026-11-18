# ADR 0005: helix-desktop package, entry points and view contract

- Status: Proposed
- Date: 2026-11-18
- Issues: #1073, #1072, #1074

## Context

Apps built on Helix that run as a desktop app (Tauri) or as a mobile app need the same frame: an activity bar with views, a sidebar or tab area, a status bar. Each app would otherwise rebuild it and import `@tauri-apps/*` in its own shell code. `@gravionlabs/helix-shell` is the web page layout (nav rail, topbar); the desktop frame is a different concern with a different dependency set.

## Decision

### Package

- Name `@gravionlabs/helix-desktop`, location `projects/desktop`.
- Not `helix-shell`: the name is taken by the web layout, and the desktop frame must not pull its dependencies or change its API.
- Not a Tauri-named package (`helix-tauri`): Tauri is one host. The frame, the view contract and the platform switch also serve a browser and a mobile shell; only the `/tauri` entry knows Tauri.

### Entry points

- Main entry (`@gravionlabs/helix-desktop`): components, the view contract and the platform switch. It imports nothing from `@tauri-apps/*`. A lint rule enforces it, like `lint:no-primeng`: `lint:no-tauri` greps `projects/desktop/src` outside the `tauri` directory for `from '@tauri-apps/`, and is part of `lint`.
- `@gravionlabs/helix-desktop/tauri`: the Tauri bindings (window controls, platform detection, the plugins the package uses). Peer dependencies on `@tauri-apps/api` and on each plugin it uses. All are marked optional in `peerDependenciesMeta`, so a consumer of the main entry installs none of them.

### View contract

Both the desktop and the mobile shell render the same typed descriptions; an app declares them once.

- `HelixView`: `id`, `label`, `icon`, `placement` (`'sidebar'` or `'tab'`) and `position` (`'top'` or `'bottom'` of the activity bar). The content is a template or component the app supplies for the `id`.
- `HelixStatusItem`: `id`, `side` (`'start'` or `'end'`) and `order` (number, ascending within the side). The content is a template the app supplies.
- Like ADR 0003, placement and visibility are data, so apps can test and compute them.

### Platform switch

The shell chooses its form by platform, not by viewport width. The root element carries `data-platform` (`desktop`, `mobile` or `web`). The main entry reads and sets the attribute; the `/tauri` entry sets it from the Tauri platform at startup. A narrow desktop window stays a desktop shell, and a large tablet gets the mobile shell. Styles and components select on `[data-platform]`.

### Icons

An app passes its own icons: either an inline SVG template (`TemplateRef`) or an icon name that the app resolves through an icon registry it provides. The package ships no icon font and no icon set beyond the few glyphs its own chrome needs, as inline SVG.

### Adoption note for consumers

`@gravionlabs/helix-*` is own code, so a consumer exempts it from the 7-day minimum release age:

- pnpm: `minimumReleaseAgeExclude` in `pnpm-workspace.yaml` lists `'@gravionlabs/helix-*'`.
- Renovate: a package rule for `@gravionlabs/helix-*` with `minimumReleaseAge: null`.

## Consequences

- One frame and one view contract for every desktop and mobile app; apps keep their views, content and icons.
- The main entry stays usable in a plain web build, with no Tauri install.
- A new lint rule and a second entry point to maintain; the `/tauri` entry is the only place that changes when Tauri does.
- Platform detection by `data-platform` needs the attribute set before first render; the `/tauri` entry does it at startup.

## Alternatives

- Put the frame into `helix-shell`: rejected, it mixes web layout and desktop frame and ties the shell to the Tauri peers.
- A Tauri-named package: rejected, it hides that the frame and contract are host independent.
- Switch by viewport width (breakpoint): rejected, a resized desktop window would turn into the mobile shell.
- An icon font: rejected, it adds a font file and a fixed icon set; apps bring their own SVG.
