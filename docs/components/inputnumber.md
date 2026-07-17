# InputNumber

> InputNumber is an input component to provide numerical input.

## Import

```ts
import { InputNumber } from '@gravionlabs/helix/inputnumber';
```

## Components

### InputNumber

Selector: `h-inputNumber, h-inputnumber, h-input-number`

InputNumber is an input component to provide numerical input.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `showButtons` | `boolean` | `false` | Displays spinner buttons. |
| `format` | `boolean` | `true` | Whether to format the value. |
| `buttonLayout` | `string` | `'stacked'` | Layout of the buttons, valid values are "stacked" (default), "horizontal" and "vertical". |
| `inputId` | `string \| undefined` | — | Identifier of the focus input to match a label defined for the component. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `placeholder` | `string \| undefined` | — | Advisory information to display on input. |
| `tabindex` | `number \| undefined` | — | Specifies tab order of the element. |
| `title` | `string \| undefined` | — | Title text of the input text. |
| `ariaLabelledBy` | `string \| undefined` | — | Specifies one or more IDs in the DOM that labels the input field. |
| `ariaDescribedBy` | `string \| undefined` | — | Specifies one or more IDs in the DOM that describes the input field. |
| `ariaLabel` | `string \| undefined` | — | Used to define a string that labels the input element. |
| `ariaRequired` | `boolean \| undefined` | — | Used to indicate that user input is required on an element before a form can be submitted. |
| `autocomplete` | `string \| undefined` | — | Used to define a string that autocomplete attribute the current element. |
| `incrementButtonClass` | `string \| undefined` | — | Style class of the increment button. |
| `decrementButtonClass` | `string \| undefined` | — | Style class of the decrement button. |
| `incrementButtonIcon` | `string \| undefined` | — | Style class of the increment button. |
| `decrementButtonIcon` | `string \| undefined` | — | Style class of the decrement button. |
| `readonly` | `boolean \| undefined` | — | When present, it specifies that an input field is read-only. |
| `allowEmpty` | `boolean` | `true` | Determines whether the input field is empty. |
| `locale` | `string \| undefined` | — | Locale to be used in formatting. |
| `localeMatcher` | `any` | — | The locale matching algorithm to use. Possible values are "lookup" and "best fit"; the default is "best fit". See Locale Negotiation for details. |
| `mode` | `string \| any` | `'decimal'` | Defines the behavior of the component, valid values are "decimal" and "currency". |
| `currency` | `string \| undefined` | — | The currency to use in currency formatting. Possible values are the ISO 4217 currency codes, such as "USD" for the US dollar, "EUR" for the euro, or "CNY" for the Chinese RMB. There is no default value; if the style is "currency", the currency property must be provided. |
| `currencyDisplay` | `string \| undefined \| any` | — | How to display the currency in currency formatting. Possible values are "symbol" to use a localized currency symbol such as €, ü"code" to use the ISO currency code, "name" to use a localized currency name such as "dollar"; the default is "symbol". |
| `useGrouping` | `boolean` | `true` | Whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators. |
| `minFractionDigits` | `number \| undefined` | — | The minimum number of fraction digits to use. Possible values are from 0 to 20; the default for plain number and percent formatting is 0; the default for currency formatting is the number of minor unit digits provided by the ISO 4217 currency code list (2 if the list doesn't provide that information). |
| `maxFractionDigits` | `number \| undefined` | — | The maximum number of fraction digits to use. Possible values are from 0 to 20; the default for plain number formatting is the larger of minimumFractionDigits and 3; the default for currency formatting is the larger of minimumFractionDigits and the number of minor unit digits provided by the ISO 4217 currency code list (2 if the list doesn't provide that information). |
| `prefix` | `string \| undefined` | — | Text to display before the value. |
| `suffix` | `string \| undefined` | — | Text to display after the value. |
| `inputStyle` | `any` | — | Inline style of the input field. |
| `inputStyleClass` | `string \| undefined` | — | Style class of the input field. |
| `showClear` | `boolean` | `false` | When enabled, a clear icon is displayed to clear the value. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onInput` | `EventEmitter&lt;InputNumberInputEvent&gt;` | Callback to invoke on input. |
| `onFocus` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the component receives focus. |
| `onBlur` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the component loses focus. |
| `onKeyDown` | `EventEmitter&lt;KeyboardEvent&gt;` | Callback to invoke on input key press. |
| `onClear` | `EventEmitter&lt;void&gt;` | Callback to invoke when clear token is clicked. |

## Source

[`projects/helix/inputnumber`](../../projects/helix/inputnumber)
