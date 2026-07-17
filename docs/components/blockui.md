# BlockUI

> BlockUI can either block other components or the whole page.

## Import

```ts
import { BlockUI } from '@gravionlabs/helix/blockui';
```

## Components

### BlockUI

Selector: `h-blockUI, h-blockui, h-block-ui`

BlockUI can either block other components or the whole page.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `target` | `any` | — | Name of the local ng-template variable referring to another component. |
| `autoZIndex` | `boolean` | `true` | Whether to automatically manage layering. |
| `baseZIndex` | `number` | `0` | Base zIndex value to use in layering. |
| `styleClass` | `string \| undefined` | — | Class of the element. |

## Source

[`projects/helix/blockui`](../../projects/helix/blockui)
