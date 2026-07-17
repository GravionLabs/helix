# RadioButton

> RadioButton is an extension to standard radio button element with theming.

## Import

```ts
import { RadioButton } from '@gravionlabs/helix/radiobutton';
```

## Components

### RadioButton

Selector: `h-radioButton, h-radiobutton, h-radio-button`

RadioButton is an extension to standard radio button element with theming.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `any` | — | Value of the radiobutton. |
| `tabindex` | `number \| undefined` | — | Index of the element in tabbing order. |
| `inputId` | `string \| undefined` | — | Identifier of the focus input to match a label defined for the component. |
| `ariaLabelledBy` | `string \| undefined` | — | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| `ariaLabel` | `string \| undefined` | — | Used to define a string that labels the input element. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |
| `binary` | `boolean \| undefined` | — | Allows to select a boolean value. |
| `variant` | `'filled' \| 'outlined' \| undefined` | — | Specifies the input variant of the component. |
| `size` | `'large' \| 'small' \| undefined` | — | Specifies the size of the component. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onClick` | `EventEmitter&lt;RadioButtonClickEvent&gt;` | Callback to invoke on radio button click. |
| `onFocus` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the receives focus. |
| `onBlur` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the loses focus. |

## Services

### RadioControlRegistry

## Source

[`projects/helix/radiobutton`](../../projects/helix/radiobutton)
