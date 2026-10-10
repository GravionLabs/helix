# Data table

`hx-data-table` is a table with a column model on a native `<table>`: cell templates, caption, empty and loading
state, striped rows, gridlines, sizes and a scrolling body with a sticky header. It draws with the CSS of
[`table[hx-table]`](table.md). Sorting, paging, selection, filters and row expansion are described below as they are
added to the component.

```html
<hx-data-table [value]="invoices" [columns]="columns" dataKey="id" caption="Invoices" stripedRows>
  <ng-template hxCell="amount" let-value>{{ value | currency: 'EUR' }}</ng-template>
</hx-data-table>
```

```ts
columns: HxColumn[] = [
  { field: 'no', header: 'No.', width: '8rem' },
  { field: 'customer.name', header: 'Customer' },
  { field: 'amount', header: 'Amount', align: 'right' },
];
```

A column is `{ field, header, width?, align? }`; `field` can be a path (`customer.name`), `align` is `left`,
`center` or `right`.

## Inputs

| Name | Type | Default | |
| --- | --- | --- | --- |
| `value` | `unknown[]` | `[]` | The rows. |
| `columns` | `HxColumn[]` | `[]` | The column model. |
| `dataKey` | `string` | none | The property that identifies a row: the DOM of a row survives a new array. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Cell padding. |
| `stripedRows`, `showGridlines` | `boolean` | `false` | Alternate row background; borders around every cell. |
| `hoverRows` | `boolean` | `true` | Rows change colour under the pointer. |
| `emptyMessage` | `string` | `'No records found'` | Shown in one cell across the table when there are no rows. |
| `loading` | `boolean` | `false` | A spinner covers the table; `aria-busy="true"`. |
| `caption` | `string` | none | Visible caption above the table. |
| `ariaLabel` | `string` | none | Accessible name; without `caption` it is a visually hidden caption. |
| `scrollHeight` | `string` | none | The body scrolls inside this height, the header stays in view. |
| `scrollable` | `boolean` | `false` | A wide table scrolls horizontally. |

## Templates

Templates are `ng-template`s inside the table:

| Directive | Replaces | Context |
| --- | --- | --- |
| `hxCell="field"` | the cell content of that column | `$implicit` row, `value`, `index` |
| `hxTableHeader` | the header cells (inside the `<tr>`; write `<th scope="col">`) | `$implicit` columns |
| `hxTableBody` | the cells of every row (write `<td>`) | `$implicit` row, `index`, `columns` |
| `hxTableFooter` | adds a footer row (write `<td>`) | `$implicit` columns |
| `hxTableCaption` | the caption text | none |

## Accessibility

A native `<table>` with a `<caption>` (visually hidden when only `ariaLabel` is set) and `<th scope="col">` header
cells. While `loading` the frame has `aria-busy="true"` and the spinner is a `role="status"`. A table that scrolls
(`scrollHeight` or `scrollable`) is a focusable `region` named by `ariaLabel` or `caption`, so the keyboard can scroll it.

## Tokens

The look comes from the design tokens `--h-datatable-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
