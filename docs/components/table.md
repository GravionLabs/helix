# Table

`table[hx-table]` draws a native `<table>` as a Helix table, with CSS only. It is for small static tables; sorting,
paging, filtering and selection are not part of it: use AG Grid through `helix-ag-grid` for data grids (the
`helixGridTheme`, formatters and cell renderer recipes are in the
[helix-ag-grid README](https://github.com/GravionLabs/helix/blob/main/projects/ag-grid/README.md#data-grids)).

```html
<div class="hx-table-scroll">
  <table hx-table striped hoverable>
    <caption>Invoices</caption>
    <thead><tr><th scope="col">No.</th><th scope="col">Amount</th></tr></thead>
    <tbody>
      <tr><th scope="row">1001</th><td>€ 120</td></tr>
      <tr aria-selected="true"><th scope="row">1002</th><td>€ 80</td></tr>
    </tbody>
    <tfoot><tr><th scope="row">Total</th><td>€ 200</td></tr></tfoot>
  </table>
</div>
```

| Input         | Type                            | Default    | Description                                                   |
| ------------- | ------------------------------- | ---------- | ------------------------------------------------------------- |
| `size`        | `'small' \| 'medium' \| 'large'` | `'medium'` | Cell padding.                                                 |
| `striped`     | `boolean`                       | `false`    | Alternate body rows get a background.                         |
| `gridlines`   | `boolean`                       | `false`    | Borders around every cell.                                    |
| `hoverable`   | `boolean`                       | `false`    | Body rows change colour under the pointer.                    |
| `stickyHeader`| `boolean`                       | `false`    | The header stays at the top of its scroll container.          |

- **Scrolling:** wrap a wide table in `.hx-table-scroll` (`overflow: auto`); with `stickyHeader` also give the wrapper a
  `max-height`. A scroll container must be reachable by keyboard: give it `tabindex="0"`, `role="region"` and an
  `aria-label` when it scrolls.
- **Selected row:** a body row with `aria-selected="true"` is drawn as selected; the table does not select anything itself.
- **Accessibility:** the native table semantics stay untouched, nothing is added. Use a `<caption>` (it is drawn as the
  table header) and `<th scope="col">` / `<th scope="row">`. Do not use a table for layout.

## Tokens

The look comes from the design tokens `--h-datatable-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
