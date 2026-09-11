# InputMask

> InputMask component is used to enter input in a certain format such as numeric, date, currency, email and phone.

## Import

```ts
import { InputMaskDirective, InputMask } from '@helix-ui/core/inputmask';
```

## Components

### InputMaskDirective

Selector: `[hInputMask]`

InputMask directive is applied directly to input elements to enable masked input.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `pInputMaskPT` | `any` | — | Used to pass attributes to DOM elements inside the InputMask directive. |
| `pInputMaskUnstyled` | `boolean \| undefined` | — | Indicates whether the component should be rendered without styles. |
| `hInputMask` | `string \| undefined` | — | Mask pattern. |
| `slotChar` | `string` | `'_'` | Placeholder character in mask, default is underscore. |
| `autoClear` | `boolean` | `true` | Clears the incomplete value on blur. |
| `characterPattern` | `string` | `'[A-Za-z]'` | Regex pattern for alpha characters. |
| `keepBuffer` | `boolean` | `false` | When present, it specifies that whether to clean buffer value from model. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onCompleteEvent` | `output&lt;void&gt;()` | Callback to invoke when the mask is completed. |
| `onUnmaskedChange` | `output&lt;string&gt;()` | Callback to invoke when value changes, emits unmasked value. |

### InputMask

Selector: `h-inputmask, h-inputMask, h-input-mask`

InputMask component is used to enter input in a certain format such as numeric, date, currency, email and phone.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `'text'` | HTML5 input type. |
| `slotChar` | `string` | `'_'` | Placeholder character in mask, default is underscore. |
| `autoClear` | `boolean` | `true` | Clears the incomplete value on blur. |
| `showClear` | `boolean` | `false` | When enabled, a clear icon is displayed to clear the value. |
| `style` | `{ [klass: string]: any; } \| null \| undefined` | — | Inline style of the input field. |
| `inputId` | `string \| undefined` | — | Identifier of the focus input to match a label defined for the component. |
| `styleClass` | `string \| undefined` | — | Style class of the input field. |
| `placeholder` | `string \| undefined` | — | Advisory information to display on input. |
| `tabindex` | `string \| undefined` | — | Specifies tab order of the element. |
| `title` | `string \| undefined` | — | Title text of the input text. |
| `ariaLabel` | `string \| undefined` | — | Used to define a string that labels the input element. |
| `ariaLabelledBy` | `string \| undefined` | — | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| `ariaRequired` | `boolean \| undefined` | — | Used to indicate that user input is required on an element before a form can be submitted. |
| `readonly` | `boolean \| undefined` | — | When present, it specifies that an input field is read-only. |
| `unmask` | `boolean \| undefined` | — | Defines if ngModel sets the raw unmasked value to bound value or the formatted mask value. |
| `characterPattern` | `string` | `'[A-Za-z]'` | Regex pattern for alpha characters |
| `autofocus` | `boolean \| undefined` | — | When present, the input gets a focus automatically on load. |
| `autocomplete` | `string \| undefined` | — | Used to define a string that autocomplete attribute the current element. |
| `keepBuffer` | `boolean` | `false` | When present, it specifies that whether to clean buffer value from model. |
| `mask` | `string \| null \| undefined` | — | Mask pattern. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onComplete` | `output&lt;void&gt;()` | Callback to invoke when the mask is completed. |
| `onFocus` | `output&lt;Event&gt;()` | Callback to invoke when the component receives focus. |
| `onBlur` | `output&lt;Event&gt;()` | Callback to invoke when the component loses focus. |
| `onInput` | `output&lt;Event&gt;()` | Callback to invoke on input. |
| `onKeydown` | `output&lt;Event&gt;()` | Callback to invoke on input key press. |
| `onClear` | `output&lt;void&gt;()` | Callback to invoke when input field is cleared. |

## Source

[`projects/core/inputmask`](../../projects/core/inputmask)
