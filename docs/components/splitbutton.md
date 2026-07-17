# SplitButton

> SplitButton groups a set of commands in an overlay with a default command.

## Import

```ts
import { SplitButton } from '@gravionlabs/helix/splitbutton';
```

## Components

### SplitButton

Selector: `h-splitbutton, h-splitButton, h-split-button`

SplitButton groups a set of commands in an overlay with a default command.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `MenuItem[] \| undefined` | — | MenuModel instance to define the overlay items. |
| `severity` | `'success' \| 'info' \| 'warn' \| 'danger' \| 'help' \| 'primary' \| 'secondary' \| 'contrast' \| null \| undefined` | — | Defines the style of the button. |
| `raised` | `boolean` | `false` | Add a shadow to indicate elevation. |
| `rounded` | `boolean` | `false` | Add a circular border radius to the button. |
| `text` | `boolean` | `false` | Add a textual class to the button without a background initially. |
| `outlined` | `boolean` | `false` | Add a border class without a background initially. |
| `size` | `'small' \| 'large' \| undefined \| null` | `null` | Defines the size of the button. |
| `plain` | `boolean` | `false` | Add a plain textual class to the button without a background initially. |
| `icon` | `string \| undefined` | — | Name of the icon. |
| `iconPos` | `SplitButtonIconPosition` | `'left'` | Position of the icon. |
| `label` | `string \| undefined` | — | Text of the button. |
| `tooltip` | `string \| undefined` | — | Tooltip for the main button. |
| `tooltipOptions` | `TooltipOptions \| undefined` | — | Tooltip options for the main button. |
| `styleClass` | `string \| undefined` | — | Class of the element. |
| `menuStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the overlay menu. |
| `menuStyleClass` | `string \| undefined` | — | Style class of the overlay menu. |
| `dropdownIcon` | `string \| undefined` | — | Name of the dropdown icon. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `'body'` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `dir` | `string \| undefined` | — | Indicates the direction of the element. |
| `expandAriaLabel` | `string \| undefined` | — | Defines a string that labels the expand button for accessibility. |
| `showTransitionOptions` | `string` | `'.12s cubic-bezier(0, 0, 0.2, 1)'` | Transition options of the show animation. |
| `hideTransitionOptions` | `string` | `'.1s linear'` | Transition options of the hide animation. |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |
| `buttonProps` | `ButtonProps \| undefined` | — | Button Props |
| `menuButtonProps` | `MenuButtonProps \| undefined` | — | Menu Button Props |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |
| `tabindex` | `number \| undefined` | — | Index of the element in tabbing order. |
| `menuButtonDisabled` | `boolean` | `false` | When present, it specifies that the menu button element should be disabled. |
| `buttonDisabled` | `boolean` | `false` | When present, it specifies that the button element should be disabled. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onClick` | `EventEmitter&lt;MouseEvent&gt;` | Callback to invoke when default command button is clicked. |
| `onMenuHide` | `EventEmitter&lt;any&gt;` | Callback to invoke when overlay menu is hidden. |
| `onMenuShow` | `EventEmitter&lt;any&gt;` | Callback to invoke when overlay menu is shown. |
| `onDropdownClick` | `EventEmitter&lt;MouseEvent&gt;` | Callback to invoke when dropdown button is clicked. |

## Source

[`projects/helix/splitbutton`](../../projects/helix/splitbutton)
