# Drawer

> Sidebar is a panel component displayed as an overlay at the edges of the screen.

## Import

```ts
import { Drawer } from '@helix-ui/core/drawer';
```

## Components

### Drawer

Selector: `h-drawer`

Sidebar is a panel component displayed as an overlay at the edges of the screen.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `appendTo` | `any` | — | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `motionOptions` | `MotionOptions \| undefined` | — | The motion options. |
| `blockScroll` | `boolean` | `false` | Whether to block scrolling of the document when drawer is active. |
| `style` | `{ [klass: string]: any; } \| null \| undefined` | — | Inline style of the component. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `ariaCloseLabel` | `string \| undefined` | — | Aria label of the close icon. |
| `autoZIndex` | `boolean` | `true` | Whether to automatically manage layering. |
| `baseZIndex` | `number` | `0` | Base zIndex value to use in layering. |
| `modal` | `boolean` | `true` | Whether an overlay mask is displayed behind the drawer. |
| `closeButtonProps` | `ButtonProps` | `{ severity: 'secondary', text: true, rounded: true }` | Used to pass all properties of the ButtonProps to the Button component. |
| `dismissible` | `boolean` | `true` | Whether to dismiss drawer on click of the mask. |
| `showCloseIcon` | `boolean` | `true` | Whether to display the close icon. |
| `closeOnEscape` | `boolean` | `true` | Specifies if pressing escape key should hide the drawer. |
| `transitionOptions` | `string` | `'150ms cubic-bezier(0, 0, 0.2, 1)'` | Transition options of the animation. |
| `visible` | `boolean` | `false` | The visible property is an input that determines the visibility of the component. |
| `position` | `"left" \| "right" \| "top" \| "bottom" \| "full"` | `'left'` | Specifies the position of the drawer, valid values are "left", "right", "bottom" and "top". |
| `fullScreen` | `boolean` | `false` | Adds a close icon to the header to hide the dialog. |
| `header` | `string \| undefined` | — | Title content of the dialog. |
| `maskStyle` | `{ [klass: string]: any; } \| null \| undefined` | — | Style of the mask. |
| `closable` | `boolean` | `true` | Whether to display close button. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onShow` | `output&lt;any&gt;()` | Callback to invoke when dialog is shown. |
| `onHide` | `output&lt;any&gt;()` | Callback to invoke when dialog is hidden. |

## Source

[`projects/core/drawer`](../../projects/core/drawer)
