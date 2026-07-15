# InputText

> InputText directive is an extension to standard input element with theming.

## Import

```ts
import { InputText } from '@gravionlabs/helix/inputtext';
```

## Components

### InputText

Selector: `[hInputText]`

InputText directive is an extension to standard input element with theming.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `hostName` | `any` | `''` | — |
| `ptInputText` | `InputTextPassThrough` | — | Used to pass attributes to DOM elements inside the InputText component. |
| `pInputTextPT` | `InputTextPassThrough` | — | Used to pass attributes to DOM elements inside the InputText component. |
| `pInputTextUnstyled` | `boolean \| undefined` | — | Indicates whether the component should be rendered without styles. |
| `pSize` | `'large' \| 'small' \| undefined` | — | Defines the size of the component. |
| `variant` | `'filled' \| 'outlined' \| undefined` | — | Specifies the input variant of the component. |
| `fluid` | `unknown` | `undefined` | Spans 100% width of the container when enabled. |
| `invalid` | `unknown` | `undefined` | When present, it specifies that the component should have invalid state style. |

## Source

[`projects/helix/inputtext`](../../projects/helix/inputtext)
