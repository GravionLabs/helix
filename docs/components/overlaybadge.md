# OverlayBadge

> OverlayPanel is a container component positioned as connected to its target.

## Import

```ts
import { OverlayBadge } from '@helix-ui/core/overlaybadge';
```

## Components

### OverlayBadge

Selector: `h-overlayBadge, h-overlay-badge, h-overlaybadge`

OverlayPanel is a container component positioned as connected to its target.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `styleClass` | `string \| undefined` | — | Class of the element. |
| `style` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the element. |
| `badgeSize` | `'small' \| 'large' \| 'xlarge' \| null \| undefined` | — | Size of the badge, valid options are "large" and "xlarge". |
| `severity` | `'secondary' \| 'info' \| 'success' \| 'warn' \| 'danger' \| 'contrast' \| null \| undefined` | — | Severity type of the badge. |
| `value` | `string \| number \| null \| undefined` | — | Value to display inside the badge. |
| `badgeDisabled` | `boolean` | `false` | When specified, disables the component. |

## Source

[`projects/core/overlaybadge`](../../projects/core/overlaybadge)
