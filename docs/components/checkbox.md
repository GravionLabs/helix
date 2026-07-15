# Checkbox

> Checkbox is an extension to standard checkbox element with theming.

## Import

```ts
import { Checkbox } from '@gravionlabs/helix/checkbox';
```

## Components

### Checkbox

Selector: `h-checkbox, h-checkBox, h-check-box`

Checkbox is an extension to standard checkbox element with theming.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `hostName` | `any` | `''` | — |
| `value` | `any` | — | Value of the checkbox. |
| `binary` | `boolean \| undefined` | — | Allows to select a boolean value instead of multiple values. |
| `ariaLabelledBy` | `string \| undefined` | — | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| `ariaLabel` | `string \| undefined` | — | Used to define a string that labels the input element. |
| `tabindex` | `number \| undefined` | — | Index of the element in tabbing order. |
| `inputId` | `string \| undefined` | — | Identifier of the focus input to match a label defined for the component. |
| `inputStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the input element. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `inputClass` | `string \| undefined` | — | Style class of the input element. |
| `indeterminate` | `boolean` | `false` | When present, it specifies input state as indeterminate. |
| `formControl` | `FormControl \| undefined` | — | Form control value. |
| `checkboxIcon` | `string \| undefined` | — | Icon class of the checkbox icon. |
| `readonly` | `boolean \| undefined` | — | When present, it specifies that the component cannot be edited. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |
| `trueValue` | `any` | `true` | Value in checked state. |
| `falseValue` | `any` | `false` | Value in unchecked state. |
| `variant` | `'filled' \| 'outlined' \| undefined` | — | Specifies the input variant of the component. |
| `size` | `'large' \| 'small' \| undefined` | — | Specifies the size of the component. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onChange` | `EventEmitter&lt;CheckboxChangeEvent&gt;` | Callback to invoke on value change. |
| `onFocus` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the receives focus. |
| `onBlur` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the loses focus. |

## Source

[`projects/helix/checkbox`](../../projects/helix/checkbox)
