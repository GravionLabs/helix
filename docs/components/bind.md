# Bind

> Directive that binds arbitrary attribute/class/style maps to a host element (pass-through backbone).

## Import

```ts
import { Bind } from '@gravionlabs/helix/bind';
```

## Components

### Bind

Selector: `[hBind]`

Bind directive provides dynamic attribute, property, and event listener binding functionality.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `hBind` | `{ [key: string]: any } \| undefined` | `undefined` | Dynamic attributes, properties, and event listeners to be applied to the host element. |

## Source

[`projects/helix/bind`](../../projects/helix/bind)
