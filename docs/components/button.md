# Button

> Button is an extension to standard button element with icons and theming.

## Import

```ts
import { ButtonLabel, ButtonIcon, ButtonDirective, Button } from '@helix-ui/core/button';
```

## Components

### ButtonLabel

Selector: `[hButtonLabel]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `ptButtonLabel` | `any` | — | Used to pass attributes to DOM elements inside the hButtonLabel. |
| `pButtonLabelPT` | `any` | — | Used to pass attributes to DOM elements inside the hButtonLabel. |
| `pButtonLabelUnstyled` | `boolean \| undefined` | — | Indicates whether the component should be rendered without styles. |

### ButtonIcon

Selector: `[hButtonIcon]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `ptButtonIcon` | `any` | — | Used to pass attributes to DOM elements inside the hButtonIcon. |
| `pButtonIconPT` | `any` | — | Used to pass attributes to DOM elements inside the hButtonIcon. |
| `pButtonUnstyled` | `boolean \| undefined` | — | Indicates whether the component should be rendered without styles. |

### ButtonDirective

Selector: `[hButton]`

Button directive is an extension to button component.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `ptButtonDirective` | `ButtonPassThrough` | — | Used to pass attributes to DOM elements inside the Button component. |
| `pButtonPT` | `ButtonPassThrough` | — | Used to pass attributes to DOM elements inside the Button component. |
| `pButtonUnstyled` | `boolean \| undefined` | — | Indicates whether the component should be rendered without styles. |
| `hostName` | `any` | `''` | — |
| `text` | `boolean` | `false` | Add a textual class to the button without a background initially. |
| `plain` | `boolean` | `false` | Add a plain textual class to the button without a background initially. |
| `raised` | `boolean` | `false` | Add a shadow to indicate elevation. |
| `size` | `"large" \| "small" \| undefined` | — | Defines the size of the button. |
| `outlined` | `boolean` | `false` | Add a border class without a background initially. |
| `rounded` | `boolean` | `false` | Add a circular border radius to the button. |
| `iconPos` | `ButtonIconPosition` | `'left'` | Position of the icon. |
| `loadingIcon` | `string \| undefined` | — | Icon to display in loading state. |
| `fluid` | `boolean \| undefined` | — | Spans 100% width of the container when enabled. |
| `label` | `string \| undefined` | — | Text of the button. |
| `icon` | `string \| undefined` | — | Name of the icon. |
| `loading` | `boolean` | `false` | Whether the button is in loading state. |
| `buttonProps` | `ButtonProps \| undefined` | — | Used to pass all properties of the ButtonProps to the Button component. |
| `severity` | `ButtonSeverity` | — | Defines the style of the button. |

### Button

Selector: `h-button`

Button is an extension to standard button element with icons and theming.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `hostName` | `any` | `''` | — |
| `type` | `string` | `'button'` | Type of the button. |
| `badge` | `string \| undefined` | — | Value of the badge. |
| `disabled` | `boolean \| undefined` | — | When present, it specifies that the component should be disabled. |
| `raised` | `boolean` | `false` | Add a shadow to indicate elevation. |
| `rounded` | `boolean` | `false` | Add a circular border radius to the button. |
| `text` | `boolean` | `false` | Add a textual class to the button without a background initially. |
| `plain` | `boolean` | `false` | Add a plain textual class to the button without a background initially. |
| `outlined` | `boolean` | `false` | Add a border class without a background initially. |
| `link` | `boolean` | `false` | Add a link style to the button. |
| `tabindex` | `number \| undefined` | — | Add a tabindex to the button. |
| `size` | `"large" \| "small" \| undefined` | — | Defines the size of the button. |
| `variant` | `"text" \| "outlined" \| undefined` | — | Specifies the variant of the component. |
| `style` | `{ [klass: string]: any; } \| null \| undefined` | — | Inline style of the element. |
| `styleClass` | `string \| undefined` | — | Class of the element. |
| `badgeClass` | `string \| undefined` | — | Style class of the badge. |
| `badgeSeverity` | `"secondary" \| "info" \| "success" \| "warn" \| "danger" \| "contrast" \| "help" \| "primary" \| null \| undefined` | `'secondary'` | Severity type of the badge. |
| `ariaLabel` | `string \| undefined` | — | Used to define a string that autocomplete attribute the current element. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |
| `iconPos` | `ButtonIconPosition` | `'left'` | Position of the icon. |
| `icon` | `string \| undefined` | — | Name of the icon. |
| `label` | `string \| undefined` | — | Text of the button. |
| `loading` | `boolean` | `false` | Whether the button is in loading state. |
| `loadingIcon` | `string \| undefined` | — | Icon to display in loading state. |
| `severity` | `ButtonSeverity` | — | Defines the style of the button. |
| `buttonProps` | `ButtonProps \| undefined` | — | Used to pass all properties of the ButtonProps to the Button component. |
| `fluid` | `boolean \| undefined` | — | Spans 100% width of the container when enabled. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onClick` | `output&lt;MouseEvent&gt;()` | Callback to execute when button is clicked. |
| `onFocus` | `output&lt;FocusEvent&gt;()` | Callback to execute when button is focused. |
| `onBlur` | `output&lt;FocusEvent&gt;()` | Callback to execute when button loses focus. |

## Interfaces & Types

- `ButtonIconPosition`

## Source

[`projects/core/button`](../../projects/core/button)
