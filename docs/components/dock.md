# Dock

> Dock is a navigation component consisting of menuitems.

## Import

```ts
import { Dock } from '@gravionlabs/helix/dock';
```

## Components

### Dock

Selector: `h-dock`

Dock is a navigation component consisting of menuitems.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string \| undefined` | — | Current id state as a string. |
| `styleClass` | `string \| undefined` | — | Class of the element. |
| `model` | `MenuItem[] \| undefined \| null` | `null` | MenuModel instance to define the action items. |
| `position` | `'bottom' \| 'top' \| 'left' \| 'right'` | `'bottom'` | Position of element. |
| `ariaLabel` | `string \| undefined` | — | Defines a string that labels the input for accessibility. |
| `breakpoint` | `string \| undefined` | `'960px'` | The breakpoint to define the maximum width boundary. |
| `ariaLabelledBy` | `string \| undefined` | — | Defines a string that labels the dropdown button for accessibility. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onFocus` | `EventEmitter&lt;FocusEvent&gt;` | Callback to execute when button is focused. |
| `onBlur` | `EventEmitter&lt;FocusEvent&gt;` | Callback to invoke when the component loses focus. |

## Source

[`projects/helix/dock`](../../projects/helix/dock)
