# Steps

> Steps components is an indicator for the steps in a wizard workflow.

## Import

```ts
import { Steps } from '@gravionlabs/helix/steps';
```

## Components

### Steps

Selector: `h-steps`

Steps components is an indicator for the steps in a wizard workflow.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `activeIndex` | `number` | `0` | Index of the active item. |
| `model` | `MenuItem[] \| undefined` | — | An array of menu items. |
| `readonly` | `boolean` | `true` | Whether the items are clickable or not. |
| `style` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the component. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `exact` | `boolean` | `true` | Whether to apply 'router-link-active-exact' class if route exactly matches the item path. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `activeIndexChange` | `EventEmitter&lt;number&gt;` | Callback to invoke when the new step is selected. |

## Source

[`projects/helix/steps`](../../projects/helix/steps)
