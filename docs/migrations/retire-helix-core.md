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
| Navigation | Tabs, Menu (popup, inline, nested), Menubar, Paginator, Stepper, SplitButton |
| Display | Badge + OverlayBadge, Tag, Chip, Avatar + AvatarGroup, Skeleton, ProgressBar + ProgressSpinner, ButtonGroup, Timeline |
| Data (B-mid) | Table (three steps), Tree, Chart |

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

Filled in when the issues exist; see the epics in the GitHub project "Helix".
