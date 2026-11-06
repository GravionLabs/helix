# ADR 0004: Surface roles, dark elevation, density and named theme presets

- Status: Proposed
- Date: 2026-11-06
- Issues: #1027, #1028, #1029

## Context

The [theme audit](../migrations/theme-audit.md) (#1027) measured the inset shell of the demo against two references: poimen (a Tauri app on helix-ui 22.2.17 with the unchanged tokens) and the documentation site (VitePress with the Helix tokens bound to `--vp-c-*`; the stock VitePress values are the reference for the neutrals). The palette itself is not the problem: the neutrals already are VitePress's. What is off is how they are assigned to roles:

- Two role families disagree. The shell reads `--helix-surface-ground|chrome|card|overlay`, the components read `--h-content-*` and `--h-overlay-*`. In dark mode `--helix-surface-card` is `surface.800`, but `hx-card` paints `surface.900`, the colour of the panel it sits on: no step, and its shadow (black at 10 %) is invisible.
- Dark steps are 1.05:1 (frame `surface.950` to panel `surface.900`) and 1.07:1 (panel to a `surface.800` card). The dialog and popover are `surface.900` as well, so an overlay is told apart only by its mask. VitePress uses `bg-elv` and `bg-soft` `surface.800` for raised things and a border for the rest.
- Cards have a 12 px radius and a shadow in light mode; panels, fields, poimen and VitePress code blocks have 6 or 8 px and a 1 px hairline.
- The density is fixed (14 px root, 32.8 px controls, 55 px table rows). poimen runs the same tokens at a 13 px base with 4 px gaps and 18 px buttons.
- Presets: poimen is the same Helix look at another density, not another palette; VitePress is a different primary (`#3451b2` / `#a8b1ff`, contrast 7.1 and 8.5 against 5.9 and 5.9).

## Decision

1. **Surface roles.** Four surface roles per colour scheme, in `projects/tokens` (`semantic.ts`) as the only source: `surface.frame` (the ground behind the shell), `surface.panel` (content panel, nav rail), `surface.card` (cards, table head, code) and `surface.overlay` (dialog, popover, menu). Three more roles complete them: `surface.hover` (hovered row, menu item, rail link), `border.panel` (the hairline around panels and cards) and `border.divider` (lines inside a panel, e.g. table rows). Field borders stay a component token. `--helix-surface-*` and `--surface-*` of the shell stay as aliases of them; components read only the roles.
2. **Light:** frame `surface.50`, panel `surface.0`, card `surface.0` with a 1 px `surface.200` hairline and no shadow, overlay `surface.0` with the overlay shadow. Cards and panels share one radius (`border.radius.md`, 6 px).
3. **Dark elevation steps:** frame `surface.950`, panel `surface.900`, card `surface.800`, overlay `surface.800` with a `surface.700` hairline and a shadow of 40 % black. A raised level is one scale step lighter than what it sits on, plus a hairline; overlays are separated by the hairline and the shadow, not by a fourth step. `surface.hover` is one step lighter than the surface it hovers on (light `surface.100`, dark `surface.800` on a panel); `border.panel` is `surface.200` (light) and `surface.700` (dark, `#2e2e32`, the audit's panel and poimen/VitePress hairline), `border.divider` is `surface.100` (light) and `surface.700` (dark); `surface.700` is 1.27:1 against the `surface.900` panel, where `surface.800` would be 1.07:1 and invisible next to a `surface.800` card. The dark overlay hairline is the same `surface.700`.
4. **Density option.** `HxTheme` gets `density: 'comfortable' | 'compact'`, `comfortable` being today's look. `compact` is poimen's proportions: 13 px root, the panel gap and control heights scaled through the existing `rem` based tokens. It is a runtime choice in the configurator, like the primary colour, and needs no new token layer; the exact control heights are set in its own PBI.
5. **Named presets: yes, three, as bundles of existing knobs.** `helix` (the default after this ADR), `vitepress` (VitePress's indigo as the primary scale and its brand steps for text and filled buttons) and `compact` (`helix` plus `density: 'compact'`). A preset sets primary, surface scale and density only; the user's own choices win. No app-named preset (`poimen`): poimen is `compact`.
6. Contrast fixes found by the audit (dark filled button on `primary.500` with white text, 4.30:1; the `*.500` severity steps as text on white, 2.4:1 to 3.6:1) are checked in the surface-role and preset PBIs with the ratios of the audit as the tests' expected values.

## Consequences

- One source for every surface; dark cards and overlays get a visible step without per-component overrides. Apps that override `--helix-surface-*` keep working through the aliases.
- Cards lose their light-mode shadow and gain a hairline: a visible change for every app, so 22.3 notes it.
- A 12 px card radius becomes 6 px.
- `density` and presets add state to `HxTheme` that the configurator must show and persist.
- The `vitepress` preset needs an 11-step primary scale that is not Tailwind-derived; it is hand-written data with its own contrast test.

## Consequences for #1028 and #1029

Both issues are refined to match this ADR; their original bodies are kept as a comment.

- **#1028 (surface roles)** keeps: the roles in `semantic.ts` for light and dark, the shell aliases and back-compat aliases, the docs site (`apps/site/.vitepress/theme/helix.css`) on the same roles with `pnpm tokens:site` regenerated, `docs/THEMING.md`. It adds: the `hover` role (decided yes: hover states are needed in rows, menus and the rail, and today are per-component overrides) and separate `border.panel` and `border.divider` roles (decided yes, so `--helix-border` and `--h-content-border-color` read one role instead of differing by accident). It changes: "frame < page < raised" becomes the steps of decision 3 (frame, panel, card, overlay with hairline and shadow), each with an AA text check, and the 12 px card radius and the light-mode card shadow go (decision 2).
- **#1029 (named presets)** changes its definition from "surface scale + primary + dark/light pair" to "primary + surface scale + density", with exactly three bundled presets `helix`, `vitepress` and `compact`; poimen is `compact`, not a preset of its own, and its schemes are no longer the test case. It keeps: selection in the configurator and via `HxTheme`, app-defined presets without forking tokens, a contrast check per preset, docs and demo. It adds: the 11-step hand-written `vitepress` primary scale with its own contrast test, and a dependency on #1028 (the presets bind to the roles).
- **Density option (PBI to be created, number not yet assigned)** is required before #1029: `HxTheme` gets `density: 'comfortable' | 'compact'` (decision 4) with the exact control heights. #1029 depends on it for the `compact` preset.

## Alternatives

- Keep two role families: rejected, they are the cause of the dark card without a step.
- A fifth dark step for overlays: rejected, 1.1:1 steps do not separate by lightness; the hairline and shadow do.
- Density per component (`size` inputs only): rejected, the shell, the rail and the gaps would not follow.
- No presets, only the existing knobs: rejected, the audit shows the two references differ in three knobs that belong together.
- A `poimen` preset: rejected, a product name in a library; the look is the compact density.
