# BaseComponent

> Abstract base class providing pass-through, styling, and config plumbing for all Helix components.

## Import

```ts
import { BaseComponent } from '@gravionlabs/helix/basecomponent';
```

## Components

### BaseComponent


#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `dt` | `Object \| undefined` | — | Defines scoped design tokens of the component. |
| `unstyled` | `boolean \| undefined` | — | Indicates whether the component should be rendered without styles. |
| `pt` | `PT \| undefined` | — | Used to pass attributes to DOM elements inside the component. |
| `ptOptions` | `PassThroughOptions \| undefined` | — | Used to configure passthrough(pt) options of the component. |

## Source

[`projects/helix/basecomponent`](../../projects/helix/basecomponent)
