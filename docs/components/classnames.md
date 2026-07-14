# ClassNames

> Utility for composing CSS class strings from arbitrary values.

## Import

```ts
import { ClassNames } from '@gravionlabs/helix/classnames';
```

## Components

### ClassNames

Selector: `[hClass]`

PClass directive provides extends class binding functionality. Supports strings, arrays, objects, and mixed combinations.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `classNames` | `PClassValue` | `undefined` | Class value(s) to be applied. Can be a string, array, object, or combination. |

## Interfaces & Types

- `PClassValue` — Represents the suitable value types of hClass directive.

## Source

[`projects/helix/classnames`](../../projects/helix/classnames)
