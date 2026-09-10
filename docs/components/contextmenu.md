# ContextMenu

> ContextMenu displays an overlay menu on right click of its target. Note that components like Table has special integration with ContextMenu.

## Import

```ts
import { ContextMenuSub, ContextMenu } from '@helix-ui/core/contextmenu';
```

## Components

### ContextMenuSub

Selector: `h-contextMenuSub, h-contextmenu-sub`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `false` | — |
| `items` | `any[]` | `undefined!` | — |
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
| `activeItemPath` | `any[]` | `undefined!` | — |
| `motionOptions` | `MotionOptions[] \| undefined` | — | — |
| `tabindex` | `number` | `0` | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `itemClick` | `output&lt;any&gt;()` | — |
| `itemMouseEnter` | `output&lt;any&gt;()` | — |
| `menuFocus` | `output&lt;any&gt;()` | — |
| `menuBlur` | `output&lt;any&gt;()` | — |
| `menuKeydown` | `output&lt;any&gt;()` | — |

### ContextMenu

Selector: `h-contextMenu, h-contextmenu, h-context-menu`

ContextMenu displays an overlay menu on right click of its target. Note that components like Table has special integration with ContextMenu.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `MenuItem[] \| undefined` | — | An array of menuitems. |
| `triggerEvent` | `string` | `'contextmenu'` | Event for which the menu must be displayed. |
| `target` | `string \| HTMLElement \| null \| undefined` | — | Local template variable name of the element to attach the context menu. |
| `global` | `boolean` | `undefined!` | Attaches the menu to document instead of a particular item. |
| `style` | `{ [klass: string]: any; } \| null \| undefined` | — | Inline style of the component. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `autoZIndex` | `boolean` | `true` | Whether to automatically manage layering. |
| `baseZIndex` | `number` | `0` | Base zIndex value to use in layering. |
| `id` | `string \| undefined` | — | Current id state as a string. |
| `breakpoint` | `string` | `'960px'` | The breakpoint to define the maximum width boundary. |
| `ariaLabel` | `string \| undefined` | — | Defines a string value that labels an interactive element. |
| `ariaLabelledBy` | `string \| undefined` | — | Identifier of the underlying input element. |
| `pressDelay` | `number \| undefined` | `500` | Press delay in touch devices as miliseconds. |
| `appendTo` | `any` | — | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `motionOptions` | `MotionOptions \| undefined` | — | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onShow` | `output&lt;void&gt;()` | Callback to invoke when overlay menu is shown. |
| `onHide` | `output&lt;void&gt;()` | Callback to invoke when overlay menu is hidden. |

## Source

[`projects/core/contextmenu`](../../projects/core/contextmenu)
