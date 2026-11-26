# Components

Deep dive of the [UX style guide](STYLEGUIDE.md): read it when you add or change a button, a list or any other
control, or before you build a component. It says which Helix part does which job. Inputs and accessibility of each
part are on its [component page](../components/README.md).

## Reuse before building

Take the first step that solves the job:

1. A Helix component or directive of the [component reference](../components/README.md), with its inputs.
2. A composition of Helix components, laid out by an element of the app with `--h-space-*` gaps.
3. A Helix component with other values of its `--h-*` tokens ([Theming](../THEMING.md)).
4. An app component built from Helix parts and `--h-*` tokens. The PR names what Helix lacks and links a Helix issue
   for it.

An app has no component that redraws a Helix one, and no CSS rule on an `.hx-*` class that changes its look.

## Which primitive replaces which raw element

`helix/no-raw-control` of the [lint preset](../LINT.md) reports these elements in `.html` templates. The same rules
hold for inline templates, which the lint run does not check.

| Instead of                     | Use                                                                                                |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `<button>` for an action       | `button[hx-button]`                                                                                |
| `<button>` that is a row       | `button[hx-list-row]` in an `hx-list`                                                              |
| `<button>` that stays pressed  | [`hx-toggle-button`](../components/toggle-button.md)                                               |
| `<input>` for text             | `input[hx-input]`                                                                                  |
| `<input type="checkbox">`      | `input[hx-checkbox]`, or `input[hx-switch]` for a setting in effect at once                        |
| `<input type="radio">`         | `input[hx-radio]`                                                                                  |
| `<input type="number">`        | [`hx-input-number`](../components/input-number.md)                                                 |
| `<input type="password">`      | [`hx-password`](../components/password.md)                                                         |
| `<input type="range">`         | [`hx-slider`](../components/slider.md)                                                             |
| `<input>` for a date or a time | [`hx-date-picker`](../components/date-picker.md), [`hx-time-picker`](../components/time-picker.md) |
| `<input type="file">`          | [`hx-file-upload`](../components/file-upload.md)                                                   |
| `<textarea>`                   | `textarea[hx-input]`                                                                               |
| `<select>`                     | [`hx-select`](../components/select.md)                                                             |
| `<select multiple>`            | [`hx-multi-select`](../components/multi-select.md)                                                 |
| `<progress>`                   | [`hx-progress-bar`](../components/progress.md)                                                     |

`<input type="hidden">` stays raw. For the control of a form value see
[Which control for which value](forms.md#which-control-for-which-value).

## Button hierarchy

`variant` says how loud an [`hx-button`](../components/button.md) is, `severity` what it means. The job picks both;
`size` follows [the row](#button-size).

| Job                               | Element                             | `variant`          | `severity`                 |
| --------------------------------- | ----------------------------------- | ------------------ | -------------------------- |
| Primary action of a view          | `button[hx-button]`                 | `filled` (default) | `primary` (default)        |
| Secondary action                  | `button[hx-button]`                 | `filled`           | `secondary`                |
| Cancel, close, dismiss            | `button[hx-button]`                 | `text`             | `secondary`                |
| Toolbar action                    | `button[hx-button]`                 | `text`             | `secondary`                |
| Row trigger (open, choose a row)  | `button[hx-list-row]`               | none               | none                       |
| Action in a table cell            | `button[hx-button]`                 | `text`             | `secondary`                |
| Link that looks like a button     | `a[hx-button]`                      | by its job above   | by its job above           |
| Link-styled action or destination | `button[hx-button]`, `a[hx-button]` | `link`             | `primary` (default)        |
| Starts a destructive action       | `button[hx-button]`                 | `outlined`         | `danger`                   |
| The same in a toolbar or a cell   | `button[hx-button]`                 | `text`             | `danger`                   |
| Confirms a destructive action     | `HxConfirmationService`             | `filled`           | `acceptSeverity: 'danger'` |

- A view or dialog has at most one filled primary `hx-button`; a primary action in its toolbar is that one.
- An action takes `primary`, `secondary` or `danger`. `success`, `info`, `warn`, `help` and `contrast` rank no
  action.
- A control with a URL (`href` or `routerLink`) is an `a`; every other action is a `button`. A link inside a
  sentence is a plain `<a>`.
- A disabled button has `disabled`, a disabled `a[hx-button]` has `aria-disabled="true"`.
- A `button` in a `<form>` that does not submit it has `type="button"`.

```html
<button hx-button (click)="create()">Create branch</button>
<button hx-button severity="secondary" (click)="fetch()">Fetch</button>
<button hx-button variant="outlined" severity="danger" (click)="confirmDelete()">Delete branch</button>
<a hx-button variant="link" routerLink="/settings">Open settings</a>
```

### Icon-only buttons

- It is an `hx-button` with `iconOnly`, with the `variant` and `severity` of its job.
- It has an `aria-label` and an `hx-tooltip` with the same text.
- Its icon is an inline `<svg>` or an element with the class `hx-button-icon`, with `aria-hidden="true"`.

```html
<button hx-button iconOnly variant="text" severity="secondary" aria-label="Refresh" hx-tooltip="Refresh">
  <span class="hx-button-icon pi pi-refresh" aria-hidden="true"></span>
</button>
```

### Several actions together

| Need                                       | Use                                                                     |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| One default action and related ones        | [`hx-split-button`](../components/split-button.md)                      |
| Several actions behind one trigger         | an `hx-button` that opens an [`hx-menu`](../components/menu.md) `popup` |
| Buttons that read as one control           | [`hx-button-group`](../components/button-group.md)                      |
| On or off that stays visible               | [`hx-toggle-button`](../components/toggle-button.md)                    |
| One or several of a few, applied as chosen | [`hx-select-button`](../components/select-button.md)                    |
| The actions of a view                      | [`hx-toolbar`](../components/toolbar.md) with its start, center and end |

## Button size

Controls of the same `size` have the same height: `hx-button`, `hx-input` and `hx-select` read the same form field
tokens. So a row has one size.

| Row                              | `size` of its controls                                  |
| -------------------------------- | ------------------------------------------------------- |
| Form, with its buttons           | default (`medium`)                                      |
| `hx-toolbar`                     | `small`, on every control in it that has a `size` input |
| List row                         | none: the row is the control, sized by `--h-list-row-*` |
| Header or footer of an `hx-list` | `small`                                                 |
| Table cell                       | `small`                                                 |

- `size="large"` is not used in any of these rows.
- The [density option](../THEMING.md#density) (`density: 'compact'`, `HxTheme.setDensity`) scales all rows alike. No
  screen picks another `size` to look denser, and the app sets no height, padding or font size on a control.

```html
<hx-toolbar>
  <button hxToolbarStart hx-button size="small" variant="text" severity="secondary">Fetch</button>
  <input hxToolbarEnd hx-input size="small" aria-label="Filter branches" />
</hx-toolbar>
```

## Lists

- A list of things to open or choose (sidebar, search results, outline, picker) is an `hx-list` of
  [`hx-list-row`](../components/list-row.md)s, not a column of `hx-button`s or clickable `div`s.
- The list has an `aria-label` or `aria-labelledby`.
- A row is a `button type="button"` for an action or an `a` for a destination. It holds no other button, link or
  field.
- Its content sits in `.hx-list-row-icon`, `.hx-list-row-label` and `.hx-list-row-meta`.
- The chosen row has `selected`, the open page or item has `current`. The app draws neither state itself.
- `role="listbox"` is for a list whose rows are the options of a choice.

| Need                                      | Use                                                                                             |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------- |
| A form value chosen from an inline list   | [`hx-listbox`](../components/listbox.md)                                                        |
| A popup of commands                       | [`hx-menu`](../components/menu.md)                                                              |
| Rows with columns, small and static       | [`table[hx-table]`](../components/table.md)                                                     |
| Columns with sorting, paging or selection | [`hx-data-table`](../components/data-table.md), or AG Grid through `@gravionlabs/helix-ag-grid` |
| A hierarchy                               | [`hx-tree`](../components/tree.md)                                                              |

## Not carried yet

These have no Helix carrier and are therefore no rule yet:

- A second action on a list row, such as a trailing remove button:
  [#1256](https://github.com/GravionLabs/helix/issues/1256).
