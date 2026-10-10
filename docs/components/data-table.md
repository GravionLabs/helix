# Data table

`hx-data-table` is a table with a column model on a native `<table>`: cell templates, caption, empty and loading
state, striped rows, gridlines, sizes and a scrolling body with a sticky header. It draws with the CSS of
[`table[hx-table]`](table.md). Sorting and paging (client side or lazy) are built in; selection, filters and row expansion are described
below as they are added.

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

A column is `{ field, header, width?, align?, sortable? }`; `field` can be a path (`customer.name`), `align` is
`left`, `center` or `right`.

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

## Sorting

A `sortable` column has a button in its header: a click sorts ascending, the next descending, the next removes the
sort. The state is in models, so it can be bound and restored:

```html
<hx-data-table [value]="rows" [columns]="columns" [(sortField)]="field" [(sortOrder)]="order" />
```

| Name | Type | Default | |
| --- | --- | --- | --- |
| `sortMode` | `'single' \| 'multiple'` | `'single'` | In `multiple` mode a click adds the column to the sort order (ascending, descending, removed); a small number shows the position. |
| `sortField` (model), `sortOrder` (model) | `string \| null`, `1 \| -1` | `null`, `1` | The sorted column in `single` mode. |
| `multiSortMeta` (model) | `{ field, order }[]` | `[]` | The sorted columns in `multiple` mode, most important first. |
| `sortFunction` | `(rows, meta) => rows` | none | Replaces the client-side sort. |

The default order puts empty values last, compares numbers and dates by value and text by locale with numeric
parts (`Item 2` before `Item 10`); `compareValues` is exported.

## Paging

```html
<hx-data-table [value]="rows" [columns]="columns" paginator [(first)]="first" [(rows)]="rows" [rowsPerPageOptions]="[10, 25, 50]" />
```

`paginator` adds an [`hx-paginator`](paginator.md) below the table; `rows`, `first`, `rowsPerPageOptions` and
`showCurrentPageReport` (default on) are its settings. A change of the sort goes back to the first page.

## Lazy loading

With `lazy` the table neither sorts nor pages: it shows `value` as given and emits `lazyLoad` when the sort, the page
or the rows per page change (and once on init unless `lazyLoadOnInit` is off). Set `totalRecords` to the number of
all records so the paginator knows how many pages there are.

```html
<hx-data-table [value]="page" [columns]="columns" lazy paginator [totalRecords]="total" [rows]="20" (lazyLoad)="load($event)" />
```

`HxLazyLoadEvent` is `{ first, rows, sortField, sortOrder, multiSortMeta }`.

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
cells. A sortable header contains a `<button>` and its `th` has `aria-sort` (`ascending`, `descending`, `none`); a polite
live region announces "Sorted by Name, ascending" or that the sort was removed. The paginator is a labelled `nav`. While `loading` the frame has `aria-busy="true"` and the spinner is a `role="status"`. A table that scrolls
(`scrollHeight` or `scrollable`) is a focusable `region` named by `ariaLabel` or `caption`, so the keyboard can scroll it.

## Tokens

The look comes from the design tokens `--h-datatable-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
