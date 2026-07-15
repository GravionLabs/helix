# Breadcrumb

> Breadcrumb provides contextual information about page hierarchy.

## Import

```ts
import { Breadcrumb } from '@gravionlabs/helix/breadcrumb';
```

## Components

### Breadcrumb

Selector: `h-breadcrumb`

Breadcrumb provides contextual information about page hierarchy.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `MenuItem[] \| undefined` | — | An array of menuitems. |
| `style` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the component. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `home` | `MenuItem \| undefined` | — | MenuItem configuration for the home icon. |
| `homeAriaLabel` | `string \| undefined` | — | Defines a string that labels the home icon for accessibility. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onItemClick` | `EventEmitter&lt;BreadcrumbItemClickEvent&gt;` | Fired when an item is selected. |

## Source

[`projects/helix/breadcrumb`](../../projects/helix/breadcrumb)
