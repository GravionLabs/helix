# Retiring helix-core: analysis and plan

Status: plan, 2026-10-08. Decision base: [ADR 0001](../adr/0001-styling-foundation.md) (hybrid: tokens on the fork
now, `@gravionlabs/helix-ui` as the long-term replacement). This document is the shared reference for the issues
that carry the work out; each PBI links back to a section here.

## Goal

Nothing in the repository imports `@gravionlabs/helix-core` any more, the package is removed from the workspace
and deprecated on npm, and Helix is no longer described as a PrimeNG fork. The look stays: the same `--h-*`
design tokens drive `helix-ui`.

## Where helix-core is used today

| Consumer | What it takes from helix-core | Size |
| --- | --- | --- |
| `helix-shell` | `api` (`MenuItem` type), `config` + `themes` (configurator: `updatePreset`, `updateSurfacePalette`, `$t`, presets aura/lara/nora/helix), `validators` (form-field spec) | 4 entry points; components already on helix-ui (#568) |
| `helix-zod` | `validators` (message-carrying validators); widgets are native inputs with their own SCSS | 1 entry point |
| `helix-ag-grid` | nothing (reads `--h-*` tokens in CSS only) | 0 |
| `helix-ui` | nothing at runtime; **`tokens.css` is generated with the engine and presets of helix-core** (`scripts/build-ui-css.mjs`) | build time |
| Demo app | 79 entry points in 167 imports across 22 pages; `provideHelix({ theme: helixPreset })` in `app.config.ts` | largest consumer |
| Scripts | `export-tokens.mjs`, `build-ui-css.mjs`, `design-system/*` and the docs site tokens load `dist/core`; `helix-palettes.mjs` writes into `projects/core/themes/helix`; `generate-component-docs.mjs` writes `docs/components/*.md` (122 pages) from core sources | build time |
| Docs | `docs/components/*` (generated from core), `docs/COMPONENTS.md`, `docs/THEMING.md` (`provideHelix`, `updatePreset`), README "fork" wording, `VENDOR.md`, PrimeNG attribution | |
| CI | `build:lib` builds core first; `ci.yml` publishes `helix-core` | |

The package itself: 129 entry points, 92 token sets, the vendored styling engine (`projects/core/uix`), 100 spec
files, 19 MB of source.

## Decisions (proposed; confirm before the dependent epic starts)

1. **Token source moves out of helix-core.** The resolved Helix preset (Aura base merged with the Helix
   overrides and the muted palettes) becomes plain data in a new workspace project `projects/tokens`, resolved by
   a small resolver of our own at build time. The CSS variable names do not change, so nothing that reads
   `--h-*` notices. A golden-file test against today's output proves it.
2. **No runtime styling engine.** Theme changes at runtime are CSS-variable overrides: the primary colour maps
   `--h-primary-50…950` to another palette (`var(--h-emerald-500)` …), the surface sets `--h-surface-0…950`,
   dark mode stays the `.app-dark` class. A small theme service in helix-ui (`provideHxTheme`) does this.
3. **Only the Helix preset survives.** The configurator drops the Aura/Lara/Nora preset switch and keeps
   primary colour, surface, dark mode and menu mode.
4. **Validators move to `@gravionlabs/helix-ui/validators`** (secondary entry point, same API), the
   `MenuItem` type becomes `HxMenuItem` in helix-ui (menus, breadcrumb and the shell share it).
5. **Icons:** components draw their own few icons as inline SVG or CSS masks (chevron, check, close, eye …).
   Apps keep PrimeIcons (`pi pi-*`, MIT) as an optional dependency for their content; the shell's
   `primeicons` peer stays.
6. **Component scope** is the B-lite and B-mid bar of ADR 0001 plus what the demo's dashboard and CRUD pages
   need. Everything else is dropped; its demo sections are removed (table below).
7. **Data tables use AG Grid; no Angular Material** (decided 2026-10-08). Interactive tables (sorting,
   filtering, paging, selection, row actions) use AG Grid Community through `helix-ag-grid`, themed with the
   `--h-*` tokens; small static tables get plain styles (`table[hx-table]`). The own Table component (three
   PBIs) and the Paginator stay in the backlog with the label `deferred`. A hybrid on Angular Material was
   checked and rejected: it themes well, but keeps Material's anatomy, its CSS sits outside the cascade
   layers, and it would add a second component vocabulary ([spike report](spike-angular-material.md)).

### Component scope

Done: Button, InputText/Textarea (`hx-input`), Checkbox, Radio, Switch, Select, Divider, Tooltip, Breadcrumb,
Password, SelectButton.

| Group | Components to build |
| --- | --- |
| Foundations | shared option/forms internals, `HxMenuItem`, validators entry point, internal icons |
| Form inputs | InputNumber, IconField + InputIcon, InputGroup + addon, FloatLabel, Textarea auto-resize, ToggleButton, Slider, Rating |
| Selection (B-mid) | Listbox, MultiSelect, AutoComplete, DatePicker, FileUpload |
| Containers | Card, Panel, Fieldset, Accordion, Toolbar |
| Overlays and messages | Dialog, Drawer, Popover, ConfirmDialog + ConfirmPopup, Toast, Message |
| Navigation | Tabs, Menu (popup, inline, nested), Menubar, Stepper, SplitButton (Paginator deferred) |
| Display | Badge + OverlayBadge, Tag, Chip, Avatar + AvatarGroup, Skeleton, ProgressBar + ProgressSpinner, ButtonGroup, Timeline |
| Data (B-mid) | data grids via `helix-ag-grid` (theme and recipe), simple table styles, Tree, Chart; own Table (three steps) and Paginator deferred |

**Dropped** (no helix-ui counterpart; the demo loses these sections): Knob, ColorPicker, InputMask, InputOtp,
KeyFilter, CascadeSelect, TreeSelect, TreeTable, PickList, OrderList, DataView, Carousel, Galleria, Image,
ImageCompare, ScrollPanel, ScrollTop, Splitter, MegaMenu, ContextMenu, PanelMenu, SpeedDial, Dock, Terminal,
OrganizationChart, Editor, BlockUI, MeterGroup, AnimateOnScroll, Inplace, DragDrop, Fluid (components have a
`fluid` input), FocusTrap/AutoFocus (CDK a11y), virtual Scroller (CDK scrolling).

## Order of the work

```text
E-tokens (token source, resolver)  ──►  E-tokens (runtime theme, configurator)  ──┐
E-components (foundations ► groups, in parallel) ──────────────────────────────────┼──►  E-consumers  ──►  E-retire
                                                                                  ┘
```

- The token source must move before helix-core can go, but it does not block component work: helix-ui reads
  the same variables either way.
- Component groups are independent of each other once the foundations exist. Inside a group, PBIs are
  independent unless a PBI says "Depends on".
- A demo page migrates when every component it uses exists in helix-ui.
- Retirement starts when `pnpm lint:core-imports` has an empty allow-list for every library and the demo
  imports nothing from helix-core.

## Component recipe

Every helix-ui component PBI is done when all of this holds. The existing components are the reference: a
native-element directive like `projects/ui/src/lib/button/button.ts`, a form control like
`projects/ui/src/lib/select/select.ts` (ControlValueAccessor plus signal-forms `FormValueControl`), an overlay
like `projects/ui/src/lib/tooltip/tooltip.ts`.

1. **Code** in `projects/ui/src/lib/<name>/<name>.ts` (+ `.html` if the template is long): standalone,
   `ChangeDetectionStrategy.OnPush`, signal inputs (`input()`, `model()`, `output()`), no decorators for
   inputs, selector with the prefix `hx` in kebab-case (`hx-card`, `button[hx-button]`), host classes
   `hx-<name>-*`. Prefer a directive on a native element when the component is one native element; prefer the
   Angular CDK (`overlay`, `dialog`, `menu`, `listbox`, `a11y`, `scrolling`) for overlays, focus and keyboard.
2. **Styles** in `projects/ui/styles/<name>.scss`: only `var(--h-*)` tokens of the preset (and local
   `--hx-*` variables), no colour literals, reduced-motion rule for transitions. Register the stylesheet in
   `TOKEN_COMPONENTS` of `scripts/build-ui-css.mjs` with the preset token sets it reads (list them with the
   resolver, see existing entries). `node scripts/build-ui-css.mjs` fails on an undefined token.
3. **Export** from `projects/ui/src/public-api.ts`, add the directive or component to the class table of
   `scripts/tests/ui-css.spec.ts` (every host class must be styled).
4. **Forms:** a value-holding component implements `ControlValueAccessor` and `FormValueControl` and has tests
   for `ngModel`, a reactive `FormControl` (including disable) and a signal form `[formField]`.
5. **Accessibility:** native semantics first; otherwise the WAI-ARIA pattern of the component (roles, states,
   keyboard). Label inputs (`ariaLabel`, `ariaLabelledby`, or `inputId` for `<label for>`), visible focus ring
   from the `focus.ring` tokens, user-facing strings as inputs with English defaults.
6. **Tests** in `<name>.spec.ts` (vitest, jsdom): rendering, every input, keyboard, ARIA attributes, forms.
   jsdom has no layout: stub `Element.prototype.scrollIntoView` where the CDK scrolls.
7. **Docs:** a section in `docs/HELIX-UI.md` (usage snippet, input table, behaviour and accessibility notes),
   a row in `projects/ui/README.md`.
8. **Demo:** a section on the matching "Helix UI" demo page (`apps/helix-demo/src/app/pages/uikit/hx-*`, route
   and menu entry in `uikit.routes.ts` / `uikit-menu-items.ts`), with an `sr-only` `h1` and `h2.demo-title`
   headings like the existing pages.
9. **Checks:** `npx ng test ui --watch=false`, `pnpm test:scripts`, `pnpm lint`, `npx ng build ui`,
   `node scripts/build-ui-css.mjs`, `npx ng build helix-demo` (rebuild the CSS after `ng build ui`; it clears
   `dist/ui`).
10. **Delivery:** branch `feature/<pbi>-<slug>` from `main`, conventional commit `feat(ui): …`, PR that
    closes the PBI and its Task, nothing merged without the maintainer.

## Issue map

Every PBI has one Task with the implementation notes, files and checks.

### #523 Epic: helix-ui — vanilla Angular component library replacing the vendored PrimeNG fork

- **#586 helix-ui foundations for the remaining components**
  - #602 helix-ui: shared option and id internals
  - #603 helix-ui: HxMenuItem model
  - #604 helix-ui: validators entry point
  - #605 helix-ui: internal icon set
- **#587 helix-ui form inputs**
  - #606 helix-ui InputNumber
  - #607 helix-ui IconField and InputIcon
  - #608 helix-ui InputGroup
  - #609 helix-ui FloatLabel
  - #610 helix-ui Textarea auto-resize
  - #611 helix-ui ToggleButton
  - #612 helix-ui Slider
  - #613 helix-ui Rating
- **#588 helix-ui selection components (B-mid)**
  - #614 helix-ui Listbox
  - #615 helix-ui MultiSelect
  - #616 helix-ui AutoComplete
  - #617 helix-ui DatePicker: calendar
  - #618 helix-ui DatePicker: input and popup
  - #619 helix-ui FileUpload
- **#589 helix-ui containers**
  - #620 helix-ui Card
  - #621 helix-ui Panel
  - #622 helix-ui Fieldset
  - #623 helix-ui Accordion
  - #624 helix-ui Toolbar
- **#590 helix-ui overlays and messages**
  - #754 helix-ui Dialog
  - #755 helix-ui Drawer
  - #756 helix-ui Popover
  - #757 helix-ui ConfirmDialog and ConfirmPopup
  - #625 helix-ui Toast
  - #626 helix-ui Message
- **#591 helix-ui navigation**
  - #627 helix-ui Tabs
  - #628 helix-ui Menu (popup, inline, nested)
  - #629 helix-ui Menubar
  - #630 helix-ui Paginator (deferred)
  - #631 helix-ui Stepper
  - #632 helix-ui SplitButton
- **#592 helix-ui display components**
  - #633 helix-ui Badge and OverlayBadge
  - #634 helix-ui Tag
  - #635 helix-ui Chip
  - #636 helix-ui Avatar and AvatarGroup
  - #637 helix-ui Skeleton
  - #638 helix-ui ProgressBar and ProgressSpinner
  - #639 helix-ui ButtonGroup
  - #640 helix-ui Timeline
- **#593 helix-ui data components (B-mid)**
  - #641 helix-ui Table: rendering and column model (deferred)
  - #642 helix-ui Table: sorting and pagination (deferred)
  - #643 helix-ui Table: selection, filtering, row expansion (deferred)
  - #644 helix-ui Tree
  - #645 helix-ui Chart
  - #759 helix-ui simple table styles
  - #760 Data grids with helix-ag-grid

### #583 Epic: Helix tokens and theming without helix-core

- **#594 Helix token source and resolver outside helix-core**
  - #646 Golden snapshot of the resolved Helix tokens
  - #647 Token data in projects/tokens
  - #648 Token resolver of our own
  - #649 Token pipeline on the new resolver
- **#595 Runtime theming without the styling engine**
  - #650 helix-ui theme service
  - #651 Shell configurator on HxTheme
  - #652 Theming docs for the token pipeline

### #584 Epic: Move every consumer off helix-core

- **#596 helix-zod without helix-core**
  - #653 helix-zod: validators from helix-ui
  - #654 helix-zod: widgets with helix-ui controls
- **#597 helix-shell without helix-core**
  - #655 helix-shell: HxMenuItem and validators from helix-ui
  - #656 helix-shell: no helix-core peer dependency
- **#598 Demo app on helix-ui**
  - #657 Demo: dashboard on helix-ui
  - #658 Demo: CRUD page on helix-ui
  - #659 Demo: input and form layout pages on helix-ui
  - #660 Demo: button page on helix-ui
  - #661 Demo: table page on helix-ui
  - #662 Demo: list and media pages
  - #663 Demo: menu page on helix-ui
  - #664 Demo: message, file and overlay pages on helix-ui
  - #665 Demo: misc, timeline and panel pages on helix-ui
  - #666 Demo: tree and charts pages on helix-ui
  - #667 Demo: dynamic forms, source tabs and the Helix UI pages
  - #668 Demo: app without the styling engine
- **#599 Docs and design system on helix-ui**
  - #669 Component docs for helix-ui
  - #670 Design System generator on helix-ui

### #585 Epic: Retire helix-core

- **#600 Remove helix-core from the workspace**
  - #671 Remove projects/core and its build wiring
  - #672 CI and publishing without helix-core
- **#601 Communicate the retirement**
  - #673 Migration guide helix-core → helix-ui
  - #674 Wording, attribution and ADR 0002
  - #675 Deprecate helix-core on npm
