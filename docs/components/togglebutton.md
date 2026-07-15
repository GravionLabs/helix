# ToggleButton

> ToggleButton is used to select a boolean value using a button.

## Import

```ts
import { ToggleButton } from '@gravionlabs/helix/togglebutton';
```

## Components

### ToggleButton

Selector: `h-toggleButton, h-togglebutton, h-toggle-button`

ToggleButton is used to select a boolean value using a button.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `onLabel` | `string` | `'Yes'` | Label for the on state. |
| `offLabel` | `string` | `'No'` | Label for the off state. |
| `onIcon` | `string \| undefined` | — | Icon for the on state. |
| `offIcon` | `string \| undefined` | — | Icon for the off state. |
| `ariaLabel` | `string \| undefined` | — | Defines a string that labels the input for accessibility. |
| `ariaLabelledBy` | `string \| undefined` | — | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| `styleClass` | `string \| undefined` | — | Style class of the element. |
| `inputId` | `string \| undefined` | — | Identifier of the focus input to match a label defined for the component. |
| `tabindex` | `number \| undefined` | `0` | Index of the element in tabbing order. |
| `iconPos` | `'left' \| 'right'` | `'left'` | Position of the icon. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |
| `size` | `'large' \| 'small'` | — | Defines the size of the component. |
| `allowEmpty` | `boolean \| undefined` | — | Whether selection can not be cleared. |
| `fluid` | `unknown` | `undefined` | Spans 100% width of the container when enabled. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onChange` | `EventEmitter&lt;ToggleButtonChangeEvent&gt;` | Callback to invoke on value change. |

## Source

[`projects/helix/togglebutton`](../../projects/helix/togglebutton)
