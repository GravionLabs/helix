# @gravionlabs/helix-ui

Vanilla Angular components on the Helix design tokens: standalone, signal-based, plain CSS, no runtime
styling engine, no dependency on `@gravionlabs/helix-core`. It is the long-term replacement of the vendored
PrimeNG fork (see [ADR 0001](../../docs/adr/0001-styling-foundation.md), epic #523).

## Install

```bash
npm install @gravionlabs/helix-ui
```

```css
/* the components */
@import "@gravionlabs/helix-ui/styles.css";
/* the tokens the components read; load them in every app, also with the helix-core theme engine */
@import "@gravionlabs/helix-ui/tokens.css";
```

Dark mode: tokens switch under the `app-dark` class on `<html>`, as in `helix-shell`.

## Components

| Component | Selector | |
| --- | --- | --- |
| `HxButton` | `button[hx-button]`, `a[hx-button]` | variants, severities, sizes, loading, icon-only |
| `HxInput` | `input[hx-input]`, `textarea[hx-input]` | outlined / filled, sizes, invalid, textarea `autoResize` |
| `HxCheckbox` | `input[hx-checkbox]` | native checkbox, indeterminate |
| `HxRadio` | `input[hx-radio]` | native radio |
| `HxSelect` | `hx-select` | CDK listbox in an overlay, all three forms APIs |
| `HxDivider` | `hx-divider` | horizontal/vertical, labelled |
| `HxTooltip` | `[hx-tooltip]` | CDK overlay, hover and focus |
| `HxBreadcrumb` | `hx-breadcrumb` | router links, home item |
| `HxIconField`, `HxInputIcon` | `hx-icon-field`, `[hx-input-icon]` | icon on the start or end edge of a text field |
| `HxFloatLabel` | `hx-float-label` | a label that sits in the field and floats up on focus or a value (`over`, `in`, `on`) |
| `HxInputGroup`, `HxInputGroupAddon` | `hx-input-group`, `hx-input-group-addon` | joins fields, selects, buttons and addons |
| `HxInputNumber` | `hx-input-number` | locale formatting, step buttons, all three forms APIs |
| `HxPassword` | `hx-password` | show/hide toggle, all three forms APIs |
| `HxCard` | `hx-card` | surface with header, title (a heading), subtitle, content and footer slots |
| `HxFileUpload` | `hx-file-upload` | choose and drop files, list, validation messages, progress; no HTTP, the app uploads |
| `HxDatePicker` | `hx-date-picker` | date field with a calendar popup or inline: single, range or multiple days, typing, month and year views, all three forms APIs |
| `HxAutoComplete` | `hx-auto-complete` | text field with suggestions from `(complete)`, chips, dropdown, all three forms APIs |
| `HxMultiSelect` | `hx-multi-select` | select for several values: comma or chips, filter, select all, all three forms APIs |
| `HxListbox` | `hx-listbox` | inline single or multiple list on the CDK listbox, filter, checkmark, all three forms APIs |
| `HxRating` | `hx-rating` | star rating as a radio group, read only as an image, all three forms APIs |
| `HxSlider` | `hx-slider` | one value or a range on native range inputs, horizontal or vertical, all three forms APIs |
| `HxToggleButton` | `hx-toggle-button` | on/off button with labels and icons, all three forms APIs |
| `HxSelectButton` | `hx-select-button` | single or multiple, all three forms APIs |
| `HxSwitch` | `input[hx-switch]` | native checkbox with `role="switch"` |

Selectors, inputs and classes use the prefix `hx` (`hx-button`), so they never clash with `helix-core`'s `h-`
in an app that uses both while migrating. Both libraries read the same `--h-*` tokens, so a page mixes them
without a visible seam.

## Rules of this package

- Nothing imports `@gravionlabs/helix-core`, `@primeuix/*` or `primeng` (`pnpm lint:no-core`).
- Styles are plain CSS in `styles/<component>.css` that read `--h-*` tokens only; they ship in a `components`
  cascade layer so an app's own CSS and Tailwind utilities win without specificity fights.
- Every component has unit tests and a docs page; a test fails when a stylesheet reads a token that
  `tokens.css` does not define.

## Publishing

Published to npm with the other packages by `.github/workflows/ci.yml` (OIDC trusted publisher, provenance).
The package needs a trusted-publisher entry on npmjs.com once (Settings → Trusted Publisher → GitHub Actions,
owner GravionLabs, repo helix, workflow `ci.yml`); the first release, 0.1.0, was published by hand.

## License

MIT
