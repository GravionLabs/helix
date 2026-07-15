# MegaMenu

> MegaMenu is navigation component that displays submenus together.

## Import

```ts
import { MegaMenu, MegaMenuSub } from '@gravionlabs/helix/megamenu';
```

## Components

### MegaMenu

Selector: `h-megaMenu, h-megamenu, h-mega-menu`

MegaMenu is navigation component that displays submenus together.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `styleClass` | `string \| undefined` | — | Class of the element. |
| `orientation` | `'horizontal' \| 'vertical' \| string` | `'horizontal'` | Defines the orientation. |
| `id` | `string \| undefined` | — | Current id state as a string. |
| `ariaLabel` | `string \| undefined` | — | Defines a string value that labels an interactive element. |
| `ariaLabelledBy` | `string \| undefined` | — | Identifier of the underlying input element. |
| `breakpoint` | `string` | `'960px'` | The breakpoint to define the maximum width boundary. |
| `scrollHeight` | `string` | `'20rem'` | Height of the viewport, a scrollbar is defined if height of list exceeds this value. |
| `disabled` | `boolean` | `false` | When present, it specifies that the component should be disabled. |
| `tabindex` | `number` | `0` | Index of the element in tabbing order. |

### MegaMenuSub

Selector: `h-megaMenuSub, h-megamenu-sub, ul[hMegaMenuSub]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string \| undefined` | — | — |
| `items` | `any[] \| undefined` | — | — |
| `itemTemplate` | `TemplateRef&lt;MegaMenuItemTemplateContext&gt; \| undefined` | — | — |
| `menuId` | `string \| undefined` | — | — |
| `ariaLabel` | `string \| undefined` | — | — |
| `ariaLabelledBy` | `string \| undefined` | — | — |
| `level` | `number` | `0` | — |
| `focusedItemId` | `string \| undefined` | — | — |
| `disabled` | `boolean` | `false` | — |
| `orientation` | `string \| undefined` | — | — |
| `activeItem` | `any` | — | — |
| `submenu` | `any` | — | — |
| `queryMatches` | `boolean` | `false` | — |
| `mobileActive` | `boolean` | `false` | — |
| `scrollHeight` | `string` | — | — |
| `tabindex` | `number` | `0` | — |
| `root` | `boolean` | `false` | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `itemClick` | `EventEmitter&lt;any&gt;` | — |
| `itemMouseEnter` | `EventEmitter&lt;any&gt;` | — |
| `menuFocus` | `EventEmitter&lt;any&gt;` | — |
| `menuBlur` | `EventEmitter&lt;any&gt;` | — |
| `menuKeydown` | `EventEmitter&lt;any&gt;` | — |
| `menuMouseDown` | `EventEmitter&lt;any&gt;` | — |

## Source

[`projects/helix/megamenu`](../../projects/helix/megamenu)
