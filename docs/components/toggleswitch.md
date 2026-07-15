# ToggleSwitch

> ToggleSwitch is used to select a boolean value.

## Import

```ts
import { ToggleSwitch } from '@gravionlabs/helix/toggleswitch';
```

## Components

### ToggleSwitch

Selector: `h-toggleswitch, h-toggleSwitch, h-toggle-switch`

ToggleSwitch is used to select a boolean value.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `tabindex` | `number \| undefined` | — | Index of the element in tabbing order. |
| `inputId` | `string \| undefined` | — | Identifier of the input element. |
| `readonly` | `boolean \| undefined` | — | When present, it specifies that the component cannot be edited. |
| `trueValue` | `any` | `true` | Value in checked state. |
| `falseValue` | `any` | `false` | Value in unchecked state. |
| `ariaLabel` | `string \| undefined` | — | Used to define a string that autocomplete attribute the current element. |
| `size` | `'large' \| 'small' \| undefined` | — | Specifies the size of the component. |
| `ariaLabelledBy` | `string \| undefined` | — | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onChange` | `EventEmitter&lt;ToggleSwitchChangeEvent&gt;` | Callback to invoke when the on value change. |

## Source

[`projects/helix/toggleswitch`](../../projects/helix/toggleswitch)
