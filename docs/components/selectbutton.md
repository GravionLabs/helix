# SelectButton

> SelectButton is used to choose single or multiple items from a list using buttons.

## Import

```ts
import { SelectButton } from '@gravionlabs/helix/selectbutton';
```

## Components

### SelectButton

Selector: `h-selectButton, h-selectbutton, h-select-button`

SelectButton is used to choose single or multiple items from a list using buttons.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `any[] \| undefined` | — | An array of selectitems to display as the available options. |
| `optionLabel` | `string \| undefined` | — | Name of the label field of an option. |
| `optionValue` | `string \| undefined` | — | Name of the value field of an option. |
| `optionDisabled` | `string \| undefined` | — | Name of the disabled field of an option. |
| `tabindex` | `number` | `0` | Index of the element in tabbing order. |
| `multiple` | `boolean \| undefined` | — | When specified, allows selecting multiple values. |
| `allowEmpty` | `boolean` | `true` | Whether selection can not be cleared. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `ariaLabelledBy` | `string \| undefined` | — | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| `dataKey` | `string \| undefined` | — | A property to uniquely identify a value in options. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |
| `size` | `'large' \| 'small' \| undefined` | — | Specifies the size of the component. |
| `fluid` | `unknown` | `undefined` | Spans 100% width of the container when enabled. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onOptionClick` | `EventEmitter&lt;SelectButtonOptionClickEvent&gt;` | Callback to invoke on input click. |
| `onChange` | `EventEmitter&lt;SelectButtonChangeEvent&gt;` | Callback to invoke on selection change. |

## Source

[`projects/helix/selectbutton`](../../projects/helix/selectbutton)
