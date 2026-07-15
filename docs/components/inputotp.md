# InputOtp

> Input Otp is used to enter one time passwords.

## Import

```ts
import { InputOtp } from '@gravionlabs/helix/inputotp';
```

## Components

### InputOtp

Selector: `h-inputOtp, h-inputotp, h-input-otp`

Input Otp is used to enter one time passwords.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `readonly` | `boolean` | — | When present, it specifies that an input field is read-only. |
| `tabindex` | `number \| null` | `null` | Index of the element in tabbing order. |
| `length` | `number` | `4` | Number of characters to initiate. |
| `styleClass` | `string \| undefined` | — | Style class of the input element. |
| `mask` | `boolean` | `false` | Mask pattern. |
| `integerOnly` | `boolean` | `false` | When present, it specifies that an input field is integer-only. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |
| `variant` | `'filled' \| 'outlined' \| undefined` | — | Specifies the input variant of the component. |
| `size` | `'large' \| 'small' \| undefined` | — | Specifies the size of the component. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onChange` | `EventEmitter&lt;InputOtpChangeEvent&gt;` | Callback to invoke on value change. |
| `onFocus` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the component receives focus. |
| `onBlur` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the component loses focus. |

## Source

[`projects/helix/inputotp`](../../projects/helix/inputotp)
