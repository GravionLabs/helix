# Slider

> Slider is a component to provide input with a drag handle.

## Import

```ts
import { Slider } from '@gravionlabs/helix/slider';
```

## Components

### Slider

Selector: `h-slider`

Slider is a component to provide input with a drag handle.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `animate` | `boolean \| undefined` | — | When enabled, displays an animation on click of the slider bar. |
| `min` | `number` | `0` | Mininum boundary value. |
| `max` | `number` | `100` | Maximum boundary value. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientation of the slider. |
| `step` | `number \| undefined` | — | Step factor to increment/decrement the value. |
| `range` | `boolean \| undefined` | — | When specified, allows two boundary values to be picked. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `ariaLabel` | `string \| undefined` | — | Defines a string that labels the input for accessibility. |
| `ariaLabelledBy` | `string \| undefined` | — | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| `tabindex` | `number` | `0` | Index of the element in tabbing order. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onChange` | `EventEmitter&lt;SliderChangeEvent&gt;` | Callback to invoke on value change. |
| `onSlideEnd` | `EventEmitter&lt;SliderSlideEndEvent&gt;` | Callback to invoke when slide ended. |

## Source

[`projects/helix/slider`](../../projects/helix/slider)
