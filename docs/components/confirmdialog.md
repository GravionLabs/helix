# ConfirmDialog

> ConfirmDialog uses a Dialog UI that is integrated with the Confirmation API.

## Import

```ts
import { ConfirmDialog } from '@gravionlabs/helix/confirmdialog';
```

## Components

### ConfirmDialog

Selector: `h-confirmDialog, h-confirmdialog, h-confirm-dialog`

ConfirmDialog uses a Dialog UI that is integrated with the Confirmation API.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `header` | `string \| undefined` | — | Title text of the dialog. |
| `icon` | `string \| undefined` | — | Icon to display next to message. |
| `message` | `string \| undefined` | — | Message of the confirmation. |
| `styleClass` | `string \| undefined` | — | Class of the element. |
| `maskStyleClass` | `string \| undefined` | — | Specify the CSS class(es) for styling the mask element |
| `acceptIcon` | `string \| undefined` | — | Icon of the accept button. |
| `acceptLabel` | `string \| undefined` | — | Label of the accept button. |
| `closeAriaLabel` | `string \| undefined` | — | Defines a string that labels the close button for accessibility. |
| `acceptAriaLabel` | `string \| undefined` | — | Defines a string that labels the accept button for accessibility. |
| `acceptVisible` | `boolean` | `true` | Visibility of the accept button. |
| `rejectIcon` | `string \| undefined` | — | Icon of the reject button. |
| `rejectLabel` | `string \| undefined` | — | Label of the reject button. |
| `rejectAriaLabel` | `string \| undefined` | — | Defines a string that labels the reject button for accessibility. |
| `rejectVisible` | `boolean` | `true` | Visibility of the reject button. |
| `acceptButtonStyleClass` | `string \| undefined` | — | Style class of the accept button. |
| `rejectButtonStyleClass` | `string \| undefined` | — | Style class of the reject button. |
| `closeOnEscape` | `boolean` | `true` | Specifies if pressing escape key should hide the dialog. |
| `dismissableMask` | `boolean \| undefined` | — | Specifies if clicking the modal background should hide the dialog. |
| `blockScroll` | `boolean` | `true` | Determines whether scrolling behavior should be blocked within the component. |
| `rtl` | `boolean` | `false` | When enabled dialog is displayed in RTL direction. |
| `closable` | `boolean` | `true` | Adds a close icon to the header to hide the dialog. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `'body'` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `key` | `string \| undefined` | — | Optional key to match the key of confirm object, necessary to use when component tree has multiple confirm dialogs. |
| `autoZIndex` | `boolean` | `true` | Whether to automatically manage layering. |
| `baseZIndex` | `number` | `0` | Base zIndex value to use in layering. |
| `transitionOptions` | `string` | `'150ms cubic-bezier(0, 0, 0.2, 1)'` | Transition options of the animation. |
| `focusTrap` | `boolean` | `true` | When enabled, can only focus on elements inside the confirm dialog. |
| `defaultFocus` | `'accept' \| 'reject' \| 'close' \| 'none'` | `'accept'` | Element to receive the focus when the dialog gets visible. |
| `breakpoints` | `any` | — | Object literal to define widths per screen size. |
| `modal` | `boolean` | `true` | Defines if background should be blocked when dialog is displayed. |
| `position` | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'topleft' \| 'topright' \| 'bottomleft' \| 'bottomright'` | `'center'` | Allows getting the position of the component. |
| `draggable` | `boolean` | `true` | Enables dragging to change the position using header. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onHide` | `EventEmitter&lt;ConfirmEventType&gt;` | Callback to invoke when dialog is hidden. |

## Source

[`projects/helix/confirmdialog`](../../projects/helix/confirmdialog)
