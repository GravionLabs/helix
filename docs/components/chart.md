# Chart

`hx-chart` is a [chart.js](https://www.chartjs.org/) chart whose colours, grid and font come from the Helix tokens.
chart.js is an **optional peer dependency** (`pnpm add chart.js`); it is loaded with a dynamic import the first time a
chart is shown, so apps without charts do not ship it.

```html
<hx-chart type="bar" [data]="data" [options]="options" height="20rem" ariaLabel="Sales per month" (dataSelect)="onPick($event)">
  <table hxChartFallback>…the same numbers as text…</table>
</hx-chart>
```

| Input / output   | Type                                                                 | Default  | Description                                              |
| ---------------- | -------------------------------------------------------------------- | -------- | -------------------------------------------------------- |
| `type`           | `'bar' \| 'line' \| 'scatter' \| 'bubble' \| 'pie' \| 'doughnut' \| 'polarArea' \| 'radar'` | `'bar'`  | chart.js chart type.                                     |
| `data`           | chart.js data                                                        | `{}`     | `{ labels, datasets }`; pass a new object to update.     |
| `options`        | chart.js options                                                     | `{}`     | On top of the token defaults; yours win.                 |
| `plugins`        | `unknown[]`                                                          | `[]`     | Extra plugins for this chart.                            |
| `width`, `height`| CSS length                                                           |          | Size of the frame. With either set, the aspect ratio is not kept. |
| `responsive`     | `boolean`                                                            | `true`   | Resize with the container.                               |
| `ariaLabel`, `ariaLabelledBy` | `string`                                                |          | Accessible name of the canvas.                           |
| `(dataSelect)`   | `{ originalEvent, element, dataset }`                                |          | A point or dataset was clicked.                          |

- **Theme:** datasets without `backgroundColor` / `borderColor` get the Helix palette (`--h-primary-color`, then orange,
  green, purple, sky, red, yellow, teal; every point of a pie). Text, legend, tick and grid colours come from
  `--h-text-color`, `--h-text-muted-color` and `--h-content-border-color`. The chart is redrawn when `class`, `style` or
  `data-theme` of `<html>` change (dark mode, a new primary colour); `refresh()` redraws on demand.
- **Loading chart.js:** `HX_CHART_LOADER` returns the module (default `import('chart.js/auto')`); provide your own
  to register only the parts you use, or a fake in tests. `chart` gives the chart.js instance once it exists.
- **Accessibility:** the canvas has `role="img"` and the name from `ariaLabel`/`ariaLabelledBy`. Content marked
  `hxChartFallback` is the canvas fallback content, which assistive technology reads: put the numbers there as text or
  a table. A chart alone does not convey its data to a screen reader.

## Tokens

It has no `--h-*` tokens of its own: it reads the semantic tokens of the theme (`--h-text-color`, `--h-primary-color`, …), see [Theming](../HELIX-UI.md#theming).

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
