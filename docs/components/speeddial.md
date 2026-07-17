# SpeedDial

> When pressed, a floating action button can display multiple primary actions that can be performed on a page.

## Import

```ts
import { SpeedDial } from '@gravionlabs/helix/speeddial';
```

## Components

### SpeedDial

Selector: `h-speeddial, h-speedDial, h-speed-dial`

When pressed, a floating action button can display multiple primary actions that can be performed on a page.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string \| undefined` | — | List of items id. |
| `model` | `MenuItem[] \| null` | `null` | MenuModel instance to define the action items. |
| `style` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the element. |
| `className` | `string \| undefined` | — | Style class of the element. |
| `direction` | `'up' \| 'down' \| 'left' \| 'right' \| 'up-left' \| 'up-right' \| 'down-left' \| 'down-right' \| undefined` | `'up'` | Specifies the opening direction of actions. |
| `transitionDelay` | `number` | `30` | Transition delay step for each action item. |
| `type` | `'linear' \| 'circle' \| 'semi-circle' \| 'quarter-circle' \| undefined` | `'linear'` | Specifies the opening type of actions. |
| `radius` | `number` | `0` | Radius for *circle types. |
| `mask` | `boolean` | `false` | Whether to show a mask element behind the speeddial. |
| `disabled` | `boolean` | `false` | Whether the component is disabled. |
| `hideOnClickOutside` | `boolean` | `true` | Whether the actions close when clicked outside. |
| `buttonStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the button element. |
| `buttonClassName` | `string \| undefined` | — | Style class of the button element. |
| `maskStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the mask element. |
| `maskClassName` | `string \| undefined` | — | Style class of the mask element. |
| `showIcon` | `string \| undefined` | — | Show icon of the button element. |
| `hideIcon` | `string \| undefined` | — | Hide icon of the button element. |
| `rotateAnimation` | `boolean` | `true` | Defined to rotate showIcon when hideIcon is not present. |
| `ariaLabel` | `string \| undefined` | — | Defines a string value that labels an interactive element. |
| `ariaLabelledBy` | `string \| undefined` | — | Identifier of the underlying input element. |
| `tooltipOptions` | `TooltipOptions` | — | Whether to display the tooltip on items. The modifiers of Tooltip can be used like an object in it. Valid keys are 'event' and 'position'. |
| `buttonProps` | `ButtonProps` | — | Used to pass all properties of the ButtonProps to the Button component. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onVisibleChange` | `EventEmitter&lt;boolean&gt;` | Fired when the visibility of element changed. |
| `visibleChange` | `EventEmitter&lt;boolean&gt;` | Fired when the visibility of element changed. |
| `onClick` | `EventEmitter&lt;MouseEvent&gt;` | Fired when the button element clicked. |
| `onShow` | `EventEmitter&lt;Event&gt;` | Fired when the actions are visible. |
| `onHide` | `EventEmitter&lt;Event&gt;` | Fired when the actions are hidden. |

## Source

[`projects/helix/speeddial`](../../projects/helix/speeddial)
