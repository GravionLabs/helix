# Popover

> Popover is a container component that can overlay other components on page.

## Import

```ts
import { Popover } from '@gravionlabs/helix/popover';
```

## Components

### Popover

Selector: `h-popover`

Popover is a container component that can overlay other components on page.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string \| undefined` | — | Defines a string that labels the input for accessibility. |
| `ariaLabelledBy` | `string \| undefined` | — | Establishes relationships between the component and label(s) where its value should be one or more element IDs. |
| `dismissable` | `boolean` | `true` | Enables to hide the overlay when outside is clicked. |
| `style` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the component. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `'body'` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `autoZIndex` | `boolean` | `true` | Whether to automatically manage layering. |
| `ariaCloseLabel` | `string \| undefined` | — | Aria label of the close icon. |
| `baseZIndex` | `number` | `0` | Base zIndex value to use in layering. |
| `focusOnShow` | `boolean` | `true` | When enabled, first button receives focus on show. |
| `showTransitionOptions` | `string` | `'.12s cubic-bezier(0, 0, 0.2, 1)'` | Transition options of the show animation. |
| `hideTransitionOptions` | `string` | `'.1s linear'` | Transition options of the hide animation. |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onShow` | `EventEmitter&lt;any&gt;` | Callback to invoke when an overlay becomes visible. |
| `onHide` | `EventEmitter&lt;any&gt;` | Callback to invoke when an overlay gets hidden. |

## Source

[`projects/helix/popover`](../../projects/helix/popover)
