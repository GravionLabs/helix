# Chart

> 

## Import

```ts
import { UIChart } from '@helix-ui/core/chart';
```

## Components

### UIChart

Selector: `h-chart`

Chart groups a collection of contents in tabs.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `"bar" \| "line" \| "scatter" \| "bubble" \| "pie" \| "doughnut" \| "polarArea" \| "radar" \| undefined` | — | Type of the chart. |
| `plugins` | `any[]` | `[]` | Array of per-chart plugins to customize the chart behaviour. |
| `width` | `string \| undefined` | — | Width of the chart. |
| `height` | `string \| undefined` | — | Height of the chart. |
| `responsive` | `boolean` | `true` | Whether the chart is redrawn on screen size change. |
| `ariaLabel` | `string \| undefined` | — | Used to define a string that autocomplete attribute the current element. |
| `ariaLabelledBy` | `string \| undefined` | — | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| `data` | `any` | — | Data to display. |
| `options` | `any` | `{}` | Options to customize the chart. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onDataSelect` | `output&lt;any&gt;()` | Callback to execute when an element on chart is clicked. |

## Source

[`projects/core/chart`](../../projects/core/chart)
