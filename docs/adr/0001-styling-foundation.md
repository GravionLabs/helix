# ADR 0001: Styling foundation — Helix tokens on the vendored fork now, a vanilla library replaces it

- Status: accepted
- Date: 2026-10-07
- Issues: #519 (epic), #520 (this record), #521 (mockups), #522 (design-system sync), #523 (the new library)

## Context

Helix has no visual identity of its own. The three surfaces people see look like two unrelated products:

- The components are PrimeNG 21.1.9, vendored into `projects/core` as `@gravionlabs/helix-core` (epic #201):
  90 components, ~149k lines of TypeScript, 108 component style files (`*/style/*style.ts`), the `@primeuix`
  styling engine vendored into `core/uix` (`styled`, `motion`, `utils`; epic #421) and PrimeTek's three
  presets in `core/themes` (Aura, Lara, Nora — 88 component token sets each).
- The demo (`apps/helix-demo`) runs `auraPreset` with PrimeTek's configurator. There is no Helix preset.
- The documentation site (`apps/site`, VitePress) uses the stock default theme and shares no token with the
  components.

What the fork *does* give us is a complete design-token model, in three layers, in TypeScript with `{ref}`
syntax: **primitive** (palettes, radii) → **semantic** (`primary`, `surface`, `formField`, `focusRing`, `text`,
`content`, `overlay`, per `light`/`dark` colour scheme) → **component** (`themes/<preset>/<component>/index.ts`).
The engine resolves them at runtime into `--h-*` custom properties and injects each component's CSS when
the component is first used. `helix-shell` adds a thin layer on top (`projects/shell/styles-src.css`:
`--helix-surface-*`, layout dimensions, a Tailwind `@theme inline` colour map, dark mode via `.app-dark`,
Lato at 14px).

The question is where Helix's look should live: in that token model, or in a library of our own that
replaces the fork.

### Measured

- **What depends on the fork.** `helix-shell`, `helix-zod` and `helix-ag-grid` import 14 core entry points,
  8 of them components: button, checkbox, inputtext, password, selectbutton, breadcrumb, divider, tooltip
  (plus ripple, styleclass and the api/config/themes/validators infrastructure). The demo imports 79 — it
  is a showcase of the fork, not a measure of product need.
- **Where the lines are.** 53k of the 149k lines are themes and token types. The large components: table
  6.9k, treetable 4.5k, datepicker 4.1k, multiselect / select / autocomplete / cascadeselect ~2k each,
  galleria, tree.
- **What the engine costs** (production build of the demo, 2026-10-07): initial bundle 1.78 MB raw /
  330 kB transferred; the lazy uikit chunk 1.86 MB / 304 kB. Of the library: a preset is 131 kB of ESM
  (Aura), the styling engine 30 kB plus 49 kB of utils, and the component CSS strings total 359 kB across
  the 108 style files, injected at runtime as components appear. The engine is a cost, not the dominant one.
- **The engine runs without Angular.** `dist/core/fesm2022/*themes*.mjs` and `*uix-styled.mjs` import
  nothing; `Theme.setTheme({ preset })`, `Theme.getCommon()` and `Theme.getComponent(name)` return the CSS
  in plain Node. A static token export is a 60-line script.

## Options

### A — Keep the fork, add a Helix token layer

A fourth preset, `helixPreset` (`@gravionlabs/helix-core/themes/helix`), extending Aura with Helix's primitive,
semantic and (where needed) component tokens; a static export of the resolved `--h-*` variables (light and
dark) for the docs site and the design-system sync; a VitePress custom theme bound to the same variables.

- Weeks of work; the token model already covers every component, the work is choosing values.
- Low risk, additive, reversible; Aura, Lara and Nora keep working; PrimeNG fixes can still be cherry-picked.
- Visual freedom bounded by the token model: colours, radii, spacing, type, shadows, focus rings per
  component are tokens, the DOM and the `h-*` class structure stay PrimeNG's.
- The runtime engine stays. A later variant can resolve the tokens at build time (the static export *is*
  that CSS) and drop runtime preset switching, without touching components.

### B — A new vanilla Angular library, retire the fork

`@gravionlabs/helix-ui` on `@angular/cdk`, standalone components, signals, plain CSS; `helix-shell`,
`helix-zod`, the demo and the docs migrate component by component; `helix-core` is retired when nothing
imports it.

- Unlimited freedom; static CSS, smaller bundles, no runtime engine; no more "fork of PrimeNG" caveat and
  attribution.
- The cost depends entirely on the parity bar (AI-assisted development, orders of magnitude):

  | Bar    | Set                                                                                                                                                                   | Estimate     |
  | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
  | B-lite | what shell/zod use + button, inputs, select, checkbox/radio/toggle, card, dialog/popover, toast, tabs, menu, breadcrumb, tooltip, badge/tag, skeleton, paginator (~20) | 1–3 months   |
  | B-mid  | + datepicker, multiselect/autocomplete, tree, basic table, fileupload, stepper (~35)                                                                                  | 4–8 months   |
  | B-full | all 90, incl. treetable, galleria, picklist/orderlist, dock, knob, terminal                                                                                           | years        |

- B-full is not worth it. B-lite is viable only as a conscious scope cut: Helix stops being "PrimeNG with
  `h-` prefixes" and becomes a focused library; the demo shrinks with it. `helix-zod`'s dynamic forms are
  the one place where the component set is dictated by functionality (one renderer per input type).

### Same repository or a new one for B?

A separate repository would make sense if the new library were a different product with its own brand, had a
different release cadence or owner, or needed a hard guarantee that nothing from the fork leaks in. None of
these hold: Helix is the brand, PrimeNG only the implementation being replaced; the migration needs
`helix-shell`/`helix-zod` to switch component by component while both libraries coexist, which in one
workspace is a path-mapping change and one PR per component, across repositories a publish → bump → fix loop
per step; the demo, docs site, Pages workflow, CI and conventions are reused as they are; attribution is
already per package (`projects/core/LICENSE.md`, `VENDOR.md`), so a new `projects/ui` carries a plain MIT
licence from day one; and a lint guard (no `@gravionlabs/helix-core` import inside `projects/ui`) gives the
isolation guarantee for free.

## Decision

**Hybrid: A now, B as the long-term target. PrimeNG is to disappear from the repository.**

1. **Now (A).** `helixPreset` in `projects/core/themes/helix`, defined as `definePreset(auraPreset,
   helixOverrides)` so the file holds only what Helix decides differently. Its *values* come from the design
   mockups (#521); until then it resolves to Aura. `scripts/export-tokens.mjs` writes the resolved tokens of a
   preset to `dist/tokens/<preset>.css` and `.json` (light, and dark under `.app-dark`) for the docs site
   theme, the design-system sync (#522) and the new library. The demo and the shell default to `helixPreset`;
   Aura, Lara and Nora remain selectable.
2. **Long-term (B), epic #523.** `@gravionlabs/helix-ui` in `projects/ui`, same repository, CDK-based, plain
   CSS that consumes the exported `--h-*` tokens, no runtime styling engine, guarded by a `lint:no-core`
   rule. Built against the B-lite bar first, starting from the 8 components the shell and zod use; B-mid as
   those packages need it. Every new component (the wrappers of #513 among them) is written in `helix-ui`,
   never in `helix-core`. `helix-shell` and `helix-zod` switch component by component; a demo page is
   removed when its core component has no `helix-ui` counterpart in the bar. `helix-core` is retired when
   nothing in `projects/` or `apps/` imports it; `VENDOR.md`, the PrimeNG licence file and the "fork of
   PrimeNG" wording in README and docs leave with it.
3. **Tokens are the contract between the two halves.** Whatever #521 decides is expressed as Helix tokens;
   the fork reads them through `helixPreset`, `helix-ui` through the static export. A page can mix old and
   new components during the migration without a visible seam, and the look does not change when the
   implementation underneath is swapped.

## Consequences

- `docs/adr/` exists from this record on (index in its README); the site excludes it like Ariadne does,
  links from the Markdown lead to GitHub.
- `@gravionlabs/helix-core/themes/helix` is a public entry point. Changing the look of Helix means changing
  `helixOverrides` and re-running `pnpm tokens:export`; nothing else encodes the identity.
- `pnpm build:lib` ends with the token export, so `dist/tokens/` is always current and CI fails when the
  export breaks. `dist/` stays untracked.
- The B epic (#523) carries the migration order and the retirement criterion; this record is not re-opened
  for "A vs. B" — a reversal needs a new ADR.
- The configurator's runtime preset switching (`updatePreset`) survives only as long as the fork does; the
  `helix-ui` equivalent is a swap of static token CSS.
