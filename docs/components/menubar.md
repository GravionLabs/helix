# Menubar

> Menubar is a horizontal menu component.

## Import

```ts
import { Menubar, MenubarSub } from '@gravionlabs/helix/menubar';
```

## Components

### Menubar

Selector: `h-menubar`

Menubar is a horizontal menu component.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `styleClass` | `string \| undefined` | — | Class of the element. |
| `autoZIndex` | `boolean` | `true` | Whether to automatically manage layering. |
| `baseZIndex` | `number` | `0` | Base zIndex value to use in layering. |
| `autoDisplay` | `boolean \| undefined` | `true` | Whether to show a root submenu on mouse over. |
| `autoHide` | `boolean \| undefined` | — | Whether to hide a root submenu when mouse leaves. |
| `breakpoint` | `string` | `'960px'` | The breakpoint to define the maximum width boundary. |
| `autoHideDelay` | `number` | `100` | Delay to hide the root submenu in milliseconds when mouse leaves. |
| `id` | `string \| undefined` | — | Current id state as a string. |
| `ariaLabel` | `string \| undefined` | — | Defines a string value that labels an interactive element. |
| `ariaLabelledBy` | `string \| undefined` | — | Identifier of the underlying input element. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onFocus` | `EventEmitter&lt;FocusEvent&gt;` | Callback to execute when button is focused. |
| `onBlur` | `EventEmitter&lt;FocusEvent&gt;` | Callback to execute when button loses focus. |

### MenubarSub

Selector: `h-menubarSub, h-menubarsub, [hMenubarSub]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `any[]` | — | — |
| `itemTemplate` | `TemplateRef&lt;MenubarItemTemplateContext&gt; \| undefined` | — | — |
| `root` | `boolean` | `false` | — |
| `autoZIndex` | `boolean` | `true` | — |
| `baseZIndex` | `number` | `0` | — |
| `mobileActive` | `boolean \| undefined` | — | — |
| `autoDisplay` | `boolean \| undefined` | — | — |
| `menuId` | `string \| undefined` | — | — |
| `ariaLabel` | `string \| undefined` | — | — |
| `ariaLabelledBy` | `string \| undefined` | — | — |
| `level` | `number` | `0` | — |
| `focusedItemId` | `string \| undefined` | — | — |
| `activeItemPath` | `any[]` | — | — |
| `inlineStyles` | `any` | — | — |
| `submenuiconTemplate` | `TemplateRef&lt;void&gt; \| undefined` | — | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `itemClick` | `EventEmitter&lt;any&gt;` | — |
| `itemMouseEnter` | `EventEmitter&lt;any&gt;` | — |
| `menuFocus` | `EventEmitter&lt;any&gt;` | — |
| `menuBlur` | `EventEmitter&lt;any&gt;` | — |
| `menuKeydown` | `EventEmitter&lt;any&gt;` | — |

## Services

### MenubarService

## Source

[`projects/helix/menubar`](../../projects/helix/menubar)
