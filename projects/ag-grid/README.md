# @gravionlabs/helix-ag-grid

AG Grid helpers for Helix applications: the Helix theme, locale-aware value formatters, robust
number parsing for editable cells, and shared cell styles. Interactive tables (sorting, filtering,
paging, selection, row actions) use AG Grid Community through this package; small static tables use
`table[hx-table]` of `@gravionlabs/helix-ui`.

## Installation

```bash
npm install @gravionlabs/helix-ag-grid
```

Peer dependencies: `@angular/core >=22`, `ag-grid-angular >=33`, `ag-grid-community >=33`.

## Theme

`helixGridTheme` is AG Grid's Quartz theme with its parameters pointed at the Helix design tokens. It needs no
stylesheet:

```ts
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { helixGridTheme } from '@gravionlabs/helix-ag-grid';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({ template: `<ag-grid-angular [theme]="theme" [rowData]="rows" [columnDefs]="columns" />` })
class Grid { theme = helixGridTheme; }
```

Every colour is a `var(--h-*)` reference (`--h-content-background`, `--h-text-color`, `--h-primary-color`, …), so the
grid follows dark mode (`.app-dark`) and a primary colour that changes at runtime without any code. Refine it with
`helixGridTheme.withParams({ rowHeight: 36 })`.

**Why the Theming API and not CSS variables:** since AG Grid 33 the default theme is configured through the `theme`
grid option; the `--ag-*` CSS custom properties only drive the legacy `ag-theme-*` classes (`theme="legacy"`). The
Theming API takes `var()` references as parameter values, is typed, and needs no stylesheet. The package still ships
`styles.css` with a `.helix-ag-grid` class for grids that remain on a legacy theme (also `--h-*` only); add it to the
global styles only then:

```json
// angular.json
"styles": ["node_modules/@gravionlabs/helix-ag-grid/styles.css", "src/styles.scss"]
```

## Data grids

The demo page "Helix UI Data grid" shows everything below.

- **Columns:** `columnDefs` with the Helix formatters (`valueFormatter: currencyFormatter('EUR')`) and
  `cellStyle: numberCellStyle`; `defaultColDef: { sortable: true, filter: true, resizable: true }`; text and number
  filters with `filter: 'agTextColumnFilter' | 'agNumberColumnFilter'`.
- **Row selection:** `[rowSelection]="{ mode: 'multiRow' }"` (add `checkboxes` / `headerCheckbox` as needed; a
  checkbox column is on by default).
- **Row actions:** a cell renderer component built from `button[hx-button]`; hand it the callback through the grid's
  `[context]` and read `params.context` in the renderer.
- **Status tags:** a cell renderer that renders `<hx-tag [severity]="…">` from the cell value.
- **Pagination:** `[pagination]="true" [paginationPageSize]="5" [paginationPageSizeSelector]="[5, 10]"`.
- **Quick filter:** `[quickFilterText]="text()"` bound to an `input[hx-input]`.
- **Empty and loading:** `[loading]="loading()"` shows the loading overlay; an empty `rowData` shows "No Rows To Show"
  (change the text with `localeText`).

```ts
@Component({ standalone: true, imports: [HxTag], template: `<hx-tag [value]="status()" [severity]="severity()" rounded />` })
class StatusCell implements ICellRendererAngularComp {
  status = signal(''); severity = signal<HxTagSeverity>('primary');
  agInit(p: ICellRendererParams) { this.refresh(p); }
  refresh(p: ICellRendererParams) { this.status.set(p.value); this.severity.set(MAP[p.value]); return true; }
}
```

**Community only.** Everything the demo CRUD and table pages need is in AG Grid Community (MIT): sorting, column
filters, quick filter, pagination, row selection with checkboxes, cell renderers and editors, column resizing,
moving and pinning, CSV export, overlays. These are **Enterprise** features and are left out: row grouping and
aggregation, pivoting, master/detail, Excel export, range selection and the clipboard range, integrated charts, the
side bar and tool panels, the set filter, the multi filter, the server-side row model, the status bar.

## Formatters

`Intl`-based value formatters for column definitions:

| Export | Formats |
| --- | --- |
| `numberFormatter` / `rawNumberFormatter` / `intlNumberFormatter` | Numbers (grouped, raw, or custom `Intl.NumberFormat` options) |
| `currencyFormatter` | Currency values |
| `cetDateFormatter` / `cetTimeFormatter` / `cetDateTimeFormatter` | Dates/times in CET |

```ts
import { currencyFormatter } from '@gravionlabs/helix-ag-grid';

const columnDefs: ColDef[] = [
  { field: 'price', valueFormatter: currencyFormatter('EUR') },
];
```

See `AgGridFormatterParams` for the accepted parameter shape.

## Parsers

Number parsing for cell editing:

- `parseNumber(value, options?)` / `parseNumberValue` — parse localized number strings (`ParseNumberOptions` controls locale/precision behavior).
- `numberValueParser` — drop-in `valueParser` for numeric columns.
- `coerceValue` — general value coercion helper.

## Cell Styles

- `numberCellStyle` — right-aligned tabular style for numeric columns.

## Development

```bash
ng build ag-grid
ng test ag-grid
```

## License

MIT
