# Spike: a hybrid on Angular Material

Status: spike result, 2026-10-08. **Decision: not adopted** (decision 7 of the [plan](retire-helix-core.md)):
interactive tables use AG Grid through helix-ag-grid, everything else stays in helix-ui.

Question: instead of building every remaining component of
[the retirement plan](retire-helix-core.md) on the Angular CDK, can Helix use Angular Material components
themed with the Helix tokens, and is that a better deal?

## What was built

- `@angular/material@22.2.1` (same version as the CDK already in use) added to the workspace.
- `apps/helix-demo/src/material-helix.scss` (≈100 lines): `mat.theme()` for the token structure, then
  `mat.theme-overrides()` pointing every Material system token (`primary`, `on-primary`, `surface`,
  `surface-container-*`, `outline`, `error`, `inverse-surface`, `corner-*`, the font) at a semantic Helix
  token (`--h-primary-color`, `--h-content-background`, `--h-overlay-*-background`, `--h-form-field-*`,
  `--h-border-radius-*` …), plus `mat.button-overrides()` and `mat.form-field-overrides()` for the Helix radii,
  weights and outline widths.
- A demo page "Spike: Material" (`/uikit/spike-material`) with Material and helix-ui side by side: buttons,
  text field, select, checkbox, toggle; and the components helix-ui does not have yet: datepicker, menu,
  dialog, tooltip, tabs, table with sort and paginator.

## Results

| Check | Result |
| --- | --- |
| Colours follow the Helix tokens | yes: primary, surfaces, text, outlines come from `--h-*` |
| Dark mode (`.app-dark`) | works without a second theme: the Material button is exactly the helix-ui colour (`rgb(138,148,206)`) |
| Runtime primary colour (the `HxTheme` mechanism of the plan: `--h-primary-*` → `var(--h-emerald-*)`) | works: Material button, tab indicator and checkbox switch together with helix-ui |
| Datepicker, tabs, table, sort, paginator, tooltip | render and work with the Helix colours and font without further code |
| Dialog and menu | work: the dialog traps focus, closes on Escape and returns focus to its trigger; the menu opens with its items |
| Material datepicker on a helix-ui field (`input[hx-input]` + `[matDatepicker]`) | works: the field keeps the Helix look (33 px), the Material calendar opens, a pick sets the value and closes it, `aria-haspopup="dialog"` is set |
| Tailwind utility on a component (`bg-blue-500`) | wins over helix-ui (cascade layer `components`), loses against Material (unlayered CSS) |
| Size match | close but not equal: button 40 px vs 33 px, text field 37 px vs 33 px, toggle 32 px vs 21 px (token overrides can bring heights closer; the M3 toggle shape stays) |
| Field anatomy | different: Material's outline field cuts a notch for the floating label and uses a filled triangle arrow; helix-ui has a plain bordered field with a chevron |
| Bundle (production build, minified, demo) | Material ≈ 526 KiB for the 15 component modules on the page, CDK ≈ 253 KiB (already paid today), helix-ui ≈ 116 KiB for its 12 components; for comparison helix-core ≈ 2.5 MB and PrimeIcons ≈ 632 KiB in the same build |

## Assessment

**For Material**

- Mature, well-tested components with strong accessibility (the CDK's patterns, plus years of fixes),
  maintained by the Angular team in lockstep with Angular releases.
- The expensive B-mid components exist today: DatePicker (with range and adapters), Table + Sort +
  Paginator, Tree, AutoComplete, Chips, Slider, Stepper. In the plan these are the largest PBIs
  (DatePicker ×2, Table ×3, Tree, AutoComplete, Paginator).
- The token architecture of Helix fits: one mapping file, and dark mode and the runtime primary colour
  reach Material for free.

**Against Material**

- It looks like Material unless heavily overridden: field anatomy (notched outline, floating label), M3 toggle,
  state layers and ripples. The Helix look (PrimeNG-like fields) is only reachable for colours, radii and
  sizes, not the structure.
- Its CSS is not in a cascade layer, so Tailwind utilities (`utilities` layer) cannot override Material styles
  without `!important` (checked in the spike with `bg-blue-500`). helix-ui deliberately sits in `components`.
- Two component vocabularies in one app (`mat-…` and `hx-…`), two forms of documentation, and the M3 design
  direction is Google's, not ours.
- Size: noticeably larger per component than helix-ui, though small next to helix-core.

## Options

| Option | What | Effort left (PBIs of epic #523) | Look | Risk |
| --- | --- | --- | --- | --- |
| A. Plan as is | every component in helix-ui on the CDK | 48 | exactly Helix | most work; DatePicker, Table, Tree are hard to get right |
| **B. Hybrid** | helix-ui for controls, containers, overlays, navigation, display (CDK-based, already the pattern); **Material, themed by helix-ui, for DatePicker, Table/Sort/Paginator, Tree, AutoComplete** | ≈ 40, and the hardest 8 become theming + docs | Helix everywhere except inside those components | two vocabularies, but only for complex widgets |
| C. Material everywhere | drop most of helix-ui, theme Material | small | Material with Helix colours | gives up the Helix look and the cascade-layer approach; throws away finished work |

## Recommendation

**Option B.** Keep helix-ui as the library for everything that defines the look (fields, buttons, menus,
dialogs, layout), and use Angular Material for the four complex widgets whose behaviour is far more expensive
than their appearance. Ship the mapping as an optional theme in helix-ui (e.g. `@gravionlabs/helix-ui/material`:
an SCSS mixin and a prebuilt CSS), so apps opt in and Material stays an optional peer dependency.

To keep the field look consistent, attach Material behaviour to helix-ui fields where Material allows it
(`matDatepicker` and `matAutocomplete` work on any `<input>`). The spike confirmed it for the datepicker:
`input[hx-input]` + `mat-datepicker` gives a Helix field with the Material calendar. AutoComplete is still to verify.

## What would change in the issue tree

If B is chosen:

- New feature under epic #523: "Angular Material on the Helix tokens" with PBIs: theme entry point
  `@gravionlabs/helix-ui/material` (mixin, prebuilt CSS, docs, cascade-layer test); DatePicker on `hx-input`
  with `mat-datepicker`; Table/Sort/Paginator styling and a column-model helper; Tree styling; AutoComplete on
  `hx-input`.
- Closed as superseded: the PBIs "DatePicker: calendar", "DatePicker: input and popup", "Table: rendering",
  "Table: sorting and pagination", "Table: selection, filtering, row expansion", "Tree", "AutoComplete",
  "Paginator" (the paginator comes with the Material table).
- The demo migration PBIs for input, table, CRUD, tree and dashboard depend on the new feature instead.
- The plan document's decision list gets a 7th decision "Material for complex widgets".

The spike code (page, theme, dependency) stays on the branch `spike/angular-material-hybrid` (draft PR #758,
closed); it was not merged.
