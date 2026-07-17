# Knob

> Knob is a form component to define number inputs with a dial.

## Import

```ts
import { Knob } from '@gravionlabs/helix/knob';
```

## Components

### Knob

Selector: `h-knob`

Knob is a form component to define number inputs with a dial.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `ariaLabel` | `string \| undefined` | — | Defines a string that labels the input for accessibility. |
| `ariaLabelledBy` | `string \| undefined` | — | Specifies one or more IDs in the DOM that labels the input field. |
| `tabindex` | `number` | `0` | Index of the element in tabbing order. |
| `valueColor` | `string` | `$dt('knob.value.background').variable` | Background of the value. |
| `rangeColor` | `string` | `$dt('knob.range.background').variable` | Background color of the range. |
| `textColor` | `string` | `$dt('knob.text.color').variable` | Color of the value text. |
| `valueTemplate` | `string` | `'{value}'` | Template string of the value. |
| `size` | `number` | `100` | Size of the component in pixels. |
| `min` | `number` | `0` | Mininum boundary value. |
| `max` | `number` | `100` | Maximum boundary value. |
| `step` | `number` | `1` | Step factor to increment/decrement the value. |
| `strokeWidth` | `number` | `14` | Width of the knob stroke. |
| `showValue` | `boolean` | `true` | Whether the show the value inside the knob. |
| `readonly` | `boolean` | `false` | When present, it specifies that the component value cannot be edited. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onChange` | `EventEmitter&lt;number&gt;` | Callback to invoke on value change. |

## Source

[`projects/helix/knob`](../../projects/helix/knob)
