# @gravionlabs/helix-ui

Vanilla Angular components on the Helix design tokens: standalone, signal-based, plain CSS, no runtime
styling engine. It replaced the vendored PrimeNG fork `@gravionlabs/helix-core`
(see [ADR 0001](../../docs/adr/0001-styling-foundation.md) and [ADR 0002](../../docs/adr/0002-retire-helix-core.md)).

## Install

```bash
npm install @gravionlabs/helix-ui
```

```css
/* the components */
@import "@gravionlabs/helix-ui/styles.css";
/* the tokens the components read; load them in every app */
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
| `HxAvatar`, `HxAvatarGroup` | `hx-avatar`, `hx-avatar-group` | picture, icon or initials; sizes, shapes; the group overlaps its avatars |
| `HxBadge`, `HxOverlayBadge` | `hx-badge`, `hx-overlay-badge` | count or dot marker, severities and sizes; the overlay variant sits on a corner of the wrapped element |
| `HxBreadcrumb` | `hx-breadcrumb` | router links, home item |
| `HxPaginator` | `hx-paginator` | first/previous/page links/next/last, rows per page, current page report; `first` and `rows` models |
| `HxIconField`, `HxInputIcon` | `hx-icon-field`, `[hx-input-icon]` | icon on the start or end edge of a text field |
| `HxFloatLabel` | `hx-float-label` | a label that sits in the field and floats up on focus or a value (`over`, `in`, `on`) |
| `HxInputGroup`, `HxInputGroupAddon` | `hx-input-group`, `hx-input-group-addon` | joins fields, selects, buttons and addons |
| `HxInputNumber` | `hx-input-number` | locale formatting, step buttons, all three forms APIs |
| `HxPassword` | `hx-password` | show/hide toggle, all three forms APIs |
| `HxCard` | `hx-card` | surface with header, title (a heading), subtitle, content and footer slots |
| `HxProgressBar`, `HxProgressSpinner` | `hx-progress-bar`, `hx-progress-spinner` | determinate and indeterminate bar, spinner; `role=progressbar`, reduced motion |
| `HxTree` | `hx-tree` | hierarchical data: selection (single, multiple, checkbox), filter, lazy children, node template, WAI-ARIA tree keyboard |
| `HxTimeline` | `hx-timeline` | events on a line: vertical or horizontal, left/right/alternate, content, opposite and marker templates |
| `HxSkeleton` | `hx-skeleton` | loading placeholder: rectangle or circle, any size, wave (off under reduced motion), `aria-hidden` |
| `HxSplitButton` | `hx-split-button` | default action plus an `hx-menu` of related actions; severity, variant, size, rounded, raised |
| `HxStepper`, `HxStepList`, `HxStep`, `HxStepPanels`, `HxStepPanel` | `hx-stepper` … | steps with panels: completed/active state, linear mode, `activateCallback`, lazy panels |
| `HxButtonGroup` | `hx-button-group` | joins `hx-button`s: square inner corners, shared borders, `role=group` |
| `HxChart` | `hx-chart` | chart.js with colours, grid and font from the tokens; optional peer dependency loaded on demand, redraws on theme change, canvas fallback slot |
| `HxDialog`, `HxDialogService`, `HxDialogRef` | `hx-dialog` | modal or non-modal dialog on the CDK dialog; declarative with `[(visible)]` or opened as a component from a service with data and a result |
| `HxDrawer` | `hx-drawer` | panel that slides in from an edge, same dialog semantics as `hx-dialog`; modal, full screen, reduced motion |
| `HxPopover` | `hx-popover` | anchored panel with arrow: `toggle(event, target)`, outside click and Escape close, non-modal dialog with focus in and back |
| `HxConfirmationService`, `HxConfirmDialog`, `HxConfirmPopup` | `hx-confirm-dialog`, `hx-confirm-popup` | ask the user to confirm: centred `alertdialog` or a popup anchored to a target; `confirm()` with callbacks or `confirmAsync()` |
| `HxTable` | `table[hx-table]` | native table styles: caption, header, body, footer, striped, gridlines, hover, sizes, sticky header; no behaviour (data grids use AG Grid) |
| `HxChip` | `hx-chip` | entity pill with picture or icon, removable by button, Backspace or Delete |
| `HxTag` | `hx-tag` | label for a category or status: severities, rounded, decorative icon |
| `HxTabs`, `HxTabList`, `HxTab`, `HxTabPanels`, `HxTabPanel` | `hx-tabs` … | WAI-ARIA tabs: roving tabindex, automatic activation, lazy panels, scrollable list |
| `HxToast`, `HxMessageService` | `hx-toast` | short messages from a service, live regions, pause on hover and focus, keys and positions |
| `HxMenubar` | `hx-menubar` | horizontal menu with dropdown submenus on the CDK menubar, collapses into a button below a breakpoint |
| `HxMenu` | `hx-menu` | menu of `HxMenuItem`s, inline or popup, group headings and nested submenus on the CDK menu |
| `HxMessage` | `hx-message` | inline message: severity, filled/outlined/simple, icon, closable, life |
| `HxToolbar` | `hx-toolbar` | start, center and end areas that wrap on small screens; no toolbar role |
| `HxAccordion`, `HxAccordionPanel`, `HxAccordionHeader`, `HxAccordionContent` | `hx-accordion` … | WAI-ARIA accordion on the CDK, single or multiple |
| `HxFieldset` | `hx-fieldset` | native fieldset and legend, optional collapse with a legend button |
| `HxPanel` | `hx-panel` | titled container, optional collapse with a toggle button, header and footer slots |
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

Selectors, inputs and classes use the prefix `hx` (`hx-button`); the custom properties keep the prefix `--h-`.

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
