# Dialog

> Dialog is a container to display content in an overlay window.

## Import

```ts
import { Dialog } from '@gravionlabs/helix/dialog';
```

## Components

### Dialog

Selector: `h-dialog`

Dialog is a container to display content in an overlay window.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `hostName` | `string` | `''` | — |
| `header` | `string \| undefined` | — | Title text of the dialog. |
| `draggable` | `boolean` | `true` | Enables dragging to change the position using header. |
| `resizable` | `boolean` | `true` | Enables resizing of the content. |
| `contentStyle` | `any` | — | Style of the content section. |
| `contentStyleClass` | `string \| undefined` | — | Style class of the content. |
| `modal` | `boolean` | `false` | Defines if background should be blocked when dialog is displayed. |
| `closeOnEscape` | `boolean` | `true` | Specifies if pressing escape key should hide the dialog. |
| `dismissableMask` | `boolean` | `false` | Specifies if clicking the modal background should hide the dialog. |
| `rtl` | `boolean` | `false` | When enabled dialog is displayed in RTL direction. |
| `closable` | `boolean` | `true` | Adds a close icon to the header to hide the dialog. |
| `breakpoints` | `any` | — | Object literal to define widths per screen size. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `maskStyleClass` | `string \| undefined` | — | Style class of the mask. |
| `maskStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Style of the mask. |
| `showHeader` | `boolean` | `true` | Whether to show the header or not. |
| `blockScroll` | `boolean` | `false` | Whether background scroll should be blocked when dialog is visible. |
| `autoZIndex` | `boolean` | `true` | Whether to automatically manage layering. |
| `baseZIndex` | `number` | `0` | Base zIndex value to use in layering. |
| `minX` | `number` | `0` | Minimum value for the left coordinate of dialog in dragging. |
| `minY` | `number` | `0` | Minimum value for the top coordinate of dialog in dragging. |
| `focusOnShow` | `boolean` | `true` | When enabled, first focusable element receives focus on show. |
| `maximizable` | `boolean` | `false` | Whether the dialog can be displayed full screen. |
| `keepInViewport` | `boolean` | `true` | Keeps dialog in the viewport. |
| `focusTrap` | `boolean` | `true` | When enabled, can only focus on elements inside the dialog. |
| `transitionOptions` | `string` | `'150ms cubic-bezier(0, 0, 0.2, 1)'` | Transition options of the animation. |
| `maskMotionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options for the mask. |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |
| `closeIcon` | `string \| undefined` | — | Name of the close icon. |
| `closeAriaLabel` | `string \| undefined` | — | Defines a string that labels the close button for accessibility. |
| `closeTabindex` | `string` | `'0'` | Index of the close button in tabbing order. |
| `minimizeIcon` | `string \| undefined` | — | Name of the minimize icon. |
| `maximizeIcon` | `string \| undefined` | — | Name of the maximize icon. |
| `closeButtonProps` | `ButtonProps` | `{ severity: 'secondary', variant: 'text', rounded: true }` | Used to pass all properties of the ButtonProps to the Button component. |
| `maximizeButtonProps` | `ButtonProps` | `{ severity: 'secondary', variant: 'text', rounded: true }` | Used to pass all properties of the ButtonProps to the Button component. |
| `position` | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'topleft' \| 'topright' \| 'bottomleft' \| 'bottomright'` | — | Position of the dialog. |
| `role` | `string` | `'dialog'` | Role attribute of html element. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `undefined` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `headerTemplate` | `TemplateRef&lt;void&gt; \| undefined` | — | Header template. |
| `contentTemplate` | `TemplateRef&lt;void&gt; \| undefined` | — | Content template. |
| `footerTemplate` | `TemplateRef&lt;void&gt; \| undefined` | — | Footer template. |
| `closeIconTemplate` | `TemplateRef&lt;void&gt; \| undefined` | — | Close icon template. |
| `maximizeIconTemplate` | `TemplateRef&lt;void&gt; \| undefined` | — | Maximize icon template. |
| `minimizeIconTemplate` | `TemplateRef&lt;void&gt; \| undefined` | — | Minimize icon template. |
| `headlessTemplate` | `TemplateRef&lt;void&gt; \| undefined` | — | Headless template. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onShow` | `EventEmitter&lt;any&gt;` | Callback to invoke when dialog is shown. |
| `onHide` | `EventEmitter&lt;any&gt;` | Callback to invoke when dialog is hidden. |
| `visibleChange` | `EventEmitter&lt;boolean&gt;` | This EventEmitter is used to notify changes in the visibility state of a component. |
| `onResizeInit` | `EventEmitter&lt;MouseEvent&gt;` | Callback to invoke when dialog resizing is initiated. |
| `onResizeEnd` | `EventEmitter&lt;MouseEvent&gt;` | Callback to invoke when dialog resizing is completed. |
| `onDragEnd` | `EventEmitter&lt;DragEvent&gt;` | Callback to invoke when dialog dragging is completed. |
| `onMaximize` | `EventEmitter&lt;any&gt;` | Callback to invoke when dialog maximized or unmaximized. |

## Source

[`projects/helix/dialog`](../../projects/helix/dialog)
