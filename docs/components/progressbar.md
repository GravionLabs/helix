# ProgressBar

> ProgressBar is a process status indicator.

## Import

```ts
import { ProgressBar } from '@gravionlabs/helix/progressbar';
```

## Components

### ProgressBar

Selector: `h-progressBar, h-progressbar, h-progress-bar`

ProgressBar is a process status indicator.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| undefined` | — | Current value of the progress. |
| `showValue` | `boolean` | `true` | Whether to display the progress bar value. |
| `styleClass` | `string \| undefined` | — | Style class of the element. |
| `valueStyleClass` | `string \| undefined` | — | Style class of the value element. |
| `unit` | `string` | `'%'` | Unit sign appended to the value. |
| `mode` | `'determinate' \| 'indeterminate'` | `'determinate'` | Defines the mode of the progress |
| `color` | `string \| undefined` | — | Color for the background of the progress. |

## Source

[`projects/helix/progressbar`](../../projects/helix/progressbar)
