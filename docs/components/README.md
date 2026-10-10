# @gravionlabs/helix-ui: component reference

One page per component of `@gravionlabs/helix-ui`: usage, inputs and outputs, accessibility and tokens. Selectors use the `hx-` prefix. The overview, install, theming and rules are in [HELIX-UI](../HELIX-UI.md).

## Buttons and actions (5)

| Component | Description |
| --- | --- |
| [Button](button.md) | `button[hx-button]` and `a[hx-button]`: a native element styled as a Helix button. |
| [Button group](button-group.md) | `hx-button-group` joins the `hx-button`s inside it into one control: the inner corners are square and neighbouring borders overlap instead of doubling. |
| [Split button](split-button.md) | `hx-split-button` is a default action with a menu of related actions: a button and, joined to it, a button that opens an [`hx-menu`](menu.md). |
| [Toggle button](toggle-button.md) | `hx-toggle-button` is a two-state button with its own labels, the look of one Select button segment. |
| [Select button](select-button.md) | `hx-select-button` is a choice among a few options as a joined group of toggle buttons: native buttons with `aria-pressed` in a `role="group"`. |

## Form controls (14)

| Component | Description |
| --- | --- |
| [Form controls](form-controls.md) | `hx-input`, `hx-checkbox`, `hx-radio` and `hx-switch` are **native elements drawn with CSS**, not wrapper components: they work unchanged with template-driven forms, reactive forms and Angular's signal forms, keep the native keyboard and screen-reader behaviour, and need no `ControlValueAccessor`. |
| [Float label](float-label.md) | `hx-float-label` wraps one control and its `<label for>` (the label comes after the control). |
| [Icon field](icon-field.md) | `hx-icon-field` puts an icon inside a text field. |
| [Input group](input-group.md) | `hx-input-group` joins a field with text or button addons into one control. |
| [Input number](input-number.md) | `hx-input-number` is a numeric field with locale formatting and optional step buttons. |
| [Password](password.md) | `hx-password` is a password field with an optional button that shows or hides the text. |
| [Select](select.md) | `hx-select` is a listbox in a CDK overlay with a combobox trigger. |
| [Auto complete](auto-complete.md) | `hx-auto-complete` is a text field that suggests values while the user types. |
| [Multi select](multi-select.md) | `hx-multi-select` is a select for several values: a `combobox` that opens a multi-select listbox in an overlay. |
| [Listbox](listbox.md) | `hx-listbox` is an inline list of options, single or `multiple`, on the CDK listbox. |
| [Date picker](date-picker.md) | `hx-date-picker` is a date field that opens a calendar, or with `[inline]="true"` the calendar alone, to choose a day, a range or several days. |
| [File upload](file-upload.md) | `hx-file-upload` collects files and emits them; there is no HTTP in it, the app uploads. |
| [Rating](rating.md) | `hx-rating` is a star rating. |
| [Slider](slider.md) | `hx-slider` chooses a number, or with `range` a pair, on a track. |

## Containers (6)

| Component | Description |
| --- | --- |
| [Card](card.md) | `hx-card` is a surface for grouped content. |
| [Panel](panel.md) | `hx-panel` is a titled container that can collapse. |
| [Fieldset](fieldset.md) | `hx-fieldset` is a native `<fieldset>` with a `<legend>` that groups related controls and can collapse. |
| [Accordion](accordion.md) | `hx-accordion` stacks panels of which one (or with `multiple` several) is open. |
| [Toolbar](toolbar.md) | `hx-toolbar` groups actions in a start, a center and an end area. |
| [Divider](divider.md) | `hx-divider`: a line between content. |

## Overlays and messages (7)

| Component | Description |
| --- | --- |
| [Dialog](dialog.md) | `hx-dialog` is a modal or non-modal dialog on `@angular/cdk/dialog`. |
| [Drawer](drawer.md) | `hx-drawer` is a panel that slides in from an edge of the screen. |
| [Popover](popover.md) | `hx-popover` is a small panel anchored to an element, with arbitrary content and an arrow pointing at the element. |
| [Confirm](confirm.md) | `HxConfirmationService` asks the user to confirm an action. |
| [Toast](toast.md) | `hx-toast` shows short messages that go away. |
| [Message](message.md) | `hx-message` is an inline message next to the content it is about. |
| [Tooltip](tooltip.md) | `[hx-tooltip]` shows a short text next to an element on hover and keyboard focus. |

## Navigation (5)

| Component | Description |
| --- | --- |
| [Menu](menu.md) | `hx-menu` shows a list of [`HxMenuItem`s](../HELIX-UI.md#menu-item-model), inline or as a popup, with nested submenus. |
| [Menubar](menubar.md) | `hx-menubar` is a horizontal menu of [`HxMenuItem`s](../HELIX-UI.md#menu-item-model) with dropdown submenus, on the CDK menubar. |
| [Tabs](tabs.md) | `hx-tabs` shows one panel at a time, chosen by a row of tabs, in the WAI-ARIA tabs pattern. |
| [Stepper](stepper.md) | `hx-stepper` shows the steps of a process as a row of headers above the panel of the active step. |
| [Breadcrumb](breadcrumb.md) | `hx-breadcrumb` renders the path to the current page as a `nav` landmark with an ordered list. |

## Display (7)

| Component | Description |
| --- | --- |
| [Avatar](avatar.md) | `hx-avatar` shows a picture, an icon or initials for a person; `hx-avatar-group` overlaps several. |
| [Badge](badge.md) | `hx-badge` is a small count or status marker; without a `value` it is a dot. |
| [Chip](chip.md) | `hx-chip` is a compact element for an entity, optionally removable. |
| [Tag](tag.md) | `hx-tag` is a label for a category or a status. |
| [Progress](progress.md) | `hx-progress-bar` fills from 0 to 100 or slides while the duration is unknown; `hx-progress-spinner` is a spinning ring. |
| [Skeleton](skeleton.md) | `hx-skeleton` is a placeholder shaped like the content that is still loading. |
| [Timeline](timeline.md) | `hx-timeline` shows events along a line, as an ordered list. |

## Data (3)

| Component | Description |
| --- | --- |
| [Table](table.md) | `table[hx-table]` draws a native `<table>` as a Helix table, with CSS only. |
| [Tree](tree.md) | `hx-tree` shows hierarchical data with expand and collapse, selection, a filter and lazy children, in the WAI-ARIA tree view pattern. |
| [Chart](chart.md) | `hx-chart` is a [chart.js](https://www.chartjs.org/) chart whose colours, grid and font come from the Helix tokens. |

