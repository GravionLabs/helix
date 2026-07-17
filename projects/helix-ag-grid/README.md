# @gravionlabs/helix-ag-grid

AG Grid helpers for Helix applications: locale-aware value formatters, robust
number parsing for editable cells, and shared cell styles.

## Installation

```bash
echo "@gravionlabs:registry=https://npm.pkg.github.com" >> .npmrc
npm install @gravionlabs/helix-ag-grid
```

Peer dependencies: `@angular/core >=22`, `ag-grid-angular >=33`, `ag-grid-community >=33`.

The package ships a prebuilt stylesheet; add it to your global styles:

```json
// angular.json
"styles": ["node_modules/@gravionlabs/helix-ag-grid/styles.css", "src/styles.scss"]
```

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
ng build helix-ag-grid
ng test helix-ag-grid
```

## License

MIT
