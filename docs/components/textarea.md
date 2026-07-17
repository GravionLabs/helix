# Textarea

> Textarea adds styling and autoResize functionality to standard textarea element.

## Import

```ts
import { Textarea } from '@gravionlabs/helix/textarea';
```

## Components

### Textarea

Selector: `[hTextarea], [hInputTextarea]`

Textarea adds styling and autoResize functionality to standard textarea element.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `pTextareaPT` | `TextareaPassThrough` | — | Used to pass attributes to DOM elements inside the Textarea component. |
| `pTextareaUnstyled` | `boolean \| undefined` | — | Indicates whether the component should be rendered without styles. |
| `autoResize` | `boolean \| undefined` | — | When present, textarea size changes as being typed. |
| `pSize` | `'large' \| 'small'` | — | Defines the size of the component. |
| `variant` | `'filled' \| 'outlined' \| undefined` | — | Specifies the input variant of the component. |
| `fluid` | `unknown` | `undefined` | Spans 100% width of the container when enabled. |
| `invalid` | `unknown` | `undefined` | When present, it specifies that the component should have invalid state style. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onResize` | `EventEmitter&lt;Event \| {}&gt;` | Callback to invoke on textarea resize. |

## Source

[`projects/helix/textarea`](../../projects/helix/textarea)
