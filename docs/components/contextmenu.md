# ContextMenu

> ContextMenu displays an overlay menu on right click of its target.

## Import

```ts
import { ContextMenu, ContextMenuSub } from '@gravionlabs/helix/contextmenu';
```

## Components

### ContextMenu

Selector: `h-contextMenu, h-contextmenu, h-context-menu`

ContextMenu displays an overlay menu on right click of its target. Note that components like Table has special integration with ContextMenu.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `triggerEvent` | `string` | `'contextmenu'` | Event for which the menu must be displayed. |
| `target` | `HTMLElement \| string \| null \| undefined` | — | Local template variable name of the element to attach the context menu. |
| `global` | `boolean` | — | Attaches the menu to document instead of a particular item. |
| `style` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the component. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `autoZIndex` | `boolean` | `true` | Whether to automatically manage layering. |
| `baseZIndex` | `number` | `0` | Base zIndex value to use in layering. |
| `id` | `string \| undefined` | — | Current id state as a string. |
| `breakpoint` | `string` | `'960px'` | The breakpoint to define the maximum width boundary. |
| `ariaLabel` | `string \| undefined` | — | Defines a string value that labels an interactive element. |
| `ariaLabelledBy` | `string \| undefined` | — | Identifier of the underlying input element. |
| `pressDelay` | `number \| undefined` | `500` | Press delay in touch devices as miliseconds. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `undefined` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onShow` | `EventEmitter&lt;null&gt;` | Callback to invoke when overlay menu is shown. |
| `onHide` | `EventEmitter&lt;null&gt;` | Callback to invoke when overlay menu is hidden. |

### ContextMenuSub

Selector: `h-contextMenuSub, h-contextmenu-sub`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `any[]` | — | — |
| `itemTemplate` | `TemplateRef&lt;ContextMenuItemTemplateContext&gt; \| undefined` | — | — |
| `root` | `boolean \| undefined` | `false` | — |
| `autoZIndex` | `boolean` | `true` | — |
| `baseZIndex` | `number` | `0` | — |
| `popup` | `boolean \| undefined` | — | — |
| `menuId` | `string \| undefined` | — | — |
| `ariaLabel` | `string \| undefined` | — | — |
| `ariaLabelledBy` | `string \| undefined` | — | — |
| `level` | `number` | `0` | — |
| `focusedItemId` | `string \| undefined` | — | — |
| `activeItemPath` | `any[]` | — | — |
| `motionOptions` | `MotionOptions[] \| undefined` | — | — |
| `tabindex` | `number` | `0` | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `itemClick` | `EventEmitter&lt;any&gt;` | — |
| `itemMouseEnter` | `EventEmitter&lt;any&gt;` | — |
| `menuFocus` | `EventEmitter&lt;any&gt;` | — |
| `menuBlur` | `EventEmitter&lt;any&gt;` | — |
| `menuKeydown` | `EventEmitter&lt;any&gt;` | — |

## Source

[`projects/helix/contextmenu`](../../projects/helix/contextmenu)
