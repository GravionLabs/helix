# Badge

> Badge is a small status indicator for another element.

## Import

```ts
import { Badge, BadgeDirective } from '@gravionlabs/helix/badge';
```

## Components

### Badge

Selector: `h-badge`

Badge is a small status indicator for another element.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `styleClass` | `string` | — | Class of the element. |
| `badgeSize` | `'small' \| 'large' \| 'xlarge' \| null` | — | Size of the badge, valid options are "large" and "xlarge". |
| `size` | `'small' \| 'large' \| 'xlarge' \| null` | — | Size of the badge, valid options are "large" and "xlarge". |
| `severity` | `'secondary' \| 'info' \| 'success' \| 'warn' \| 'danger' \| 'contrast' \| null` | — | Severity type of the badge. |
| `value` | `string \| number \| null` | — | Value to display inside the badge. |
| `badgeDisabled` | `boolean` | `false` | When specified, disables the component. |

### BadgeDirective

Selector: `[hBadge]`

Badge Directive is directive usage of badge component.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `ptBadgeDirective` | `BadgePassThrough \| undefined` | — | Used to pass attributes to DOM elements inside the Badge component. |
| `pBadgePT` | `BadgePassThrough \| undefined` | — | Used to pass attributes to DOM elements inside the Badge component. |
| `pBadgeUnstyled` | `boolean \| undefined` | — | Indicates whether the component should be rendered without styles. |
| `disabled` | `boolean` | — | When specified, disables the component. |
| `badgeSize` | `'large' \| 'xlarge' \| 'small' \| null \| undefined` | — | Size of the badge, valid options are "large" and "xlarge". |
| `severity` | `'secondary' \| 'info' \| 'success' \| 'warn' \| 'danger' \| 'contrast' \| null \| undefined` | — | Severity type of the badge. |
| `value` | `string \| number` | — | Value to display inside the badge. |
| `badgeStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the element. |
| `badgeStyleClass` | `string` | — | Class of the element. |

## Source

[`projects/helix/badge`](../../projects/helix/badge)
