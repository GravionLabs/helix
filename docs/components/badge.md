# Badge

> Badge is a small status indicator for another element.

## Import

```ts
import { BadgeDirective, Badge } from '@helix-ui/core/badge';
```

## Components

### BadgeDirective

Selector: `[hBadge]`

Badge Directive is directive usage of badge component.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `ptBadgeDirective` | `BadgePassThrough` | — | Used to pass attributes to DOM elements inside the Badge component. |
| `pBadgePT` | `BadgePassThrough` | — | Used to pass attributes to DOM elements inside the Badge component. |
| `pBadgeUnstyled` | `boolean \| undefined` | — | Indicates whether the component should be rendered without styles. |
| `disabled` | `boolean` | `undefined!` | When specified, disables the component. |
| `badgeSize` | `"large" \| "xlarge" \| "small" \| null \| undefined` | — | Size of the badge, valid options are "large" and "xlarge". |
| `size` | `"large" \| "xlarge" \| "small" \| null \| undefined` | — | Size of the badge, valid options are "large" and "xlarge". |
| `severity` | `"secondary" \| "info" \| "success" \| "warn" \| "danger" \| "contrast" \| null \| undefined` | — | Severity type of the badge. |
| `value` | `string \| number \| undefined` | — | Value to display inside the badge. |
| `badgeStyle` | `{ [klass: string]: any; } \| null \| undefined` | — | Inline style of the element. |
| `badgeStyleClass` | `string` | `undefined!` | Class of the element. |

### Badge

Selector: `h-badge`

Badge is a small status indicator for another element.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `styleClass` | `string \| undefined` | — | Class of the element. |
| `badgeSize` | `"large" \| "xlarge" \| "small" \| null \| undefined` | — | Size of the badge, valid options are "large" and "xlarge". |
| `size` | `"large" \| "xlarge" \| "small" \| null \| undefined` | — | Size of the badge, valid options are "large" and "xlarge". |
| `severity` | `"secondary" \| "info" \| "success" \| "warn" \| "danger" \| "contrast" \| null \| undefined` | — | Severity type of the badge. |
| `value` | `string \| number \| null \| undefined` | — | Value to display inside the badge. |
| `badgeDisabled` | `boolean` | `false` | When specified, disables the component. |

## Source

[`projects/core/badge`](../../projects/core/badge)
