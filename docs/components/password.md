# Password

> Password displays strength indicator for password fields.

## Import

```ts
import { Password, PasswordDirective } from '@gravionlabs/helix/password';
```

## Components

### Password

Selector: `h-password`

Password displays strength indicator for password fields.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string \| undefined` | — | Defines a string that labels the input for accessibility. |
| `ariaLabelledBy` | `string \| undefined` | — | Specifies one or more IDs in the DOM that labels the input field. |
| `label` | `string \| undefined` | — | Label of the input for accessibility. |
| `promptLabel` | `string \| undefined` | — | Text to prompt password entry. Defaults to Helix I18N API configuration. |
| `mediumRegex` | `string` | `'^(((?=.*[a-z])(?=.*[A-Z]))\|((?=.*[a-z])(?=.*[0-9]))\|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'` | Regex value for medium regex. |
| `strongRegex` | `string` | `'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'` | Regex value for strong regex. |
| `weakLabel` | `string \| undefined` | — | Text for a weak password. Defaults to Helix I18N API configuration. |
| `mediumLabel` | `string \| undefined` | — | Text for a medium password. Defaults to Helix I18N API configuration. |
| `maxLength` | `number \| undefined` | — | specifies the maximum number of characters allowed in the input element. |
| `strongLabel` | `string \| undefined` | — | Text for a strong password. Defaults to Helix I18N API configuration. |
| `inputId` | `string \| undefined` | — | Identifier of the accessible input element. |
| `feedback` | `boolean` | `true` | Whether to show the strength indicator or not. |
| `toggleMask` | `boolean \| undefined` | — | Whether to show an icon to display the password as plain text. |
| `inputStyleClass` | `string \| undefined` | — | Style class of the input field. |
| `styleClass` | `string \| undefined` | — | Style class of the element. |
| `inputStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the input field. |
| `showTransitionOptions` | `string` | `'.12s cubic-bezier(0, 0, 0.2, 1)'` | Transition options of the show animation. |
| `hideTransitionOptions` | `string` | `'.1s linear'` | Transition options of the hide animation. |
| `autocomplete` | `string \| undefined` | — | Specify automated assistance in filling out password by browser. |
| `placeholder` | `string \| undefined` | — | Advisory information to display on input. |
| `showClear` | `boolean` | `false` | When enabled, a clear icon is displayed to clear the value. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |
| `tabindex` | `number` | — | Index of the element in tabbing order. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `'self'` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |
| `overlayOptions` | `OverlayOptions \| undefined` | — | Whether to use overlay API feature. The properties of overlay API can be used like an object in it. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onFocus` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the component receives focus. |
| `onBlur` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the component loses focus. |
| `onClear` | `EventEmitter&lt;any&gt;` | Callback to invoke when clear button is clicked. |

### PasswordDirective

Selector: `[hPassword]`

Password directive.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `pPasswordPT` | `PasswordPassThrough \| undefined` | — | Used to pass attributes to DOM elements inside the Password component. |
| `pPasswordUnstyled` | `boolean \| undefined` | — | Indicates whether the component should be rendered without styles. |
| `promptLabel` | `string` | `'Enter a password'` | Text to prompt password entry. Defaults to Helix I18N API configuration. |
| `weakLabel` | `string` | `'Weak'` | Text for a weak password. Defaults to Helix I18N API configuration. |
| `mediumLabel` | `string` | `'Medium'` | Text for a medium password. Defaults to Helix I18N API configuration. |
| `strongLabel` | `string` | `'Strong'` | Text for a strong password. Defaults to Helix I18N API configuration. |
| `feedback` | `boolean` | `true` | Whether to show the strength indicator or not. |
| `variant` | `'filled' \| 'outlined' \| undefined` | — | Specifies the input variant of the component. |
| `fluid` | `unknown` | `undefined` | Spans 100% width of the container when enabled. |
| `size` | `'large' \| 'small' \| undefined` | `undefined` | Specifies the size of the component. |

## Pipes

- `MapperPipe`

## Source

[`projects/helix/password`](../../projects/helix/password)
