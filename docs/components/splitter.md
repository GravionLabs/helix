# Splitter

> Splitter is utilized to separate and resize panels.

## Import

```ts
import { Splitter } from '@gravionlabs/helix/splitter';
```

## Components

### Splitter

Selector: `h-splitter`

Splitter is utilized to separate and resize panels.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `panelStyleClass` | `string \| undefined` | — | Style class of the panel. |
| `panelStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the panel. |
| `stateStorage` | `string \| undefined` | `'session'` | Defines where a stateful splitter keeps its state, valid values are 'session' for sessionStorage and 'local' for localStorage. |
| `stateKey` | `string \| undefined \| null` | `null` | Storage identifier of a stateful Splitter. |
| `layout` | `string \| undefined` | `'horizontal'` | Orientation of the panels. Valid values are 'horizontal' and 'vertical'. |
| `gutterSize` | `number` | `4` | Size of the divider in pixels. |
| `step` | `number` | `5` | Step factor to increment/decrement the size of the panels while pressing the arrow keys. |
| `minSizes` | `number[]` | `[]` | Minimum size of the elements relative to 100%. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onResizeEnd` | `EventEmitter&lt;SplitterResizeEndEvent&gt;` | Callback to invoke when resize ends. |
| `onResizeStart` | `EventEmitter&lt;SplitterResizeStartEvent&gt;` | Callback to invoke when resize starts. |

## Source

[`projects/helix/splitter`](../../projects/helix/splitter)
