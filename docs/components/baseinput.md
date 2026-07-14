# BaseInput

> Abstract base class for input components (name, size, invalid, fluid state).

## Import

```ts
import { BaseInput } from '@gravionlabs/helix/baseinput';
```

## Components

### BaseInput


#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `fluid` | `unknown` | `undefined` | Spans 100% width of the container when enabled. |
| `variant` | `'filled' \| 'outlined' \| undefined` | — | Specifies the input variant of the component. |
| `size` | `'large' \| 'small' \| undefined` | — | Specifies the size of the component. |
| `inputSize` | `number \| null \| undefined` | — | Specifies the visible width of the input element in characters. |
| `pattern` | `string \| null \| undefined` | — | Specifies the value must match the pattern. |
| `min` | `number \| null \| undefined` | — | The value must be greater than or equal to the value. |
| `max` | `number \| null \| undefined` | — | The value must be less than or equal to the value. |
| `step` | `number \| null \| undefined` | — | Unless the step is set to the any literal, the value must be min + an integral multiple of the step. |
| `minlength` | `number \| null \| undefined` | — | The number of characters (code points) must not be less than the value of the attribute, if non-empty. |
| `maxlength` | `number \| null \| undefined` | — | The number of characters (code points) must not exceed the value of the attribute. |

## Source

[`projects/helix/baseinput`](../../projects/helix/baseinput)
