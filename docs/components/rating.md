# Rating

> Rating is an extension to standard radio button element with theming.

## Import

```ts
import { Rating } from '@gravionlabs/helix/rating';
```

## Components

### Rating

Selector: `h-rating`

Rating is an extension to standard radio button element with theming.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `readonly` | `boolean \| undefined` | — | When present, changing the value is not possible. |
| `stars` | `number` | `5` | Number of stars. |
| `iconOnClass` | `string \| undefined` | — | Style class of the on icon. |
| `iconOnStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the on icon. |
| `iconOffClass` | `string \| undefined` | — | Style class of the off icon. |
| `iconOffStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the off icon. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onRate` | `EventEmitter&lt;RatingRateEvent&gt;` | Emitted on value change. |
| `onFocus` | `EventEmitter&lt;FocusEvent&gt;` | Emitted when the rating receives focus. |
| `onBlur` | `EventEmitter&lt;FocusEvent&gt;` | Emitted when the rating loses focus. |

## Source

[`projects/helix/rating`](../../projects/helix/rating)
