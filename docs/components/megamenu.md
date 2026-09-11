# MegaMenu

> MegaMenu is navigation component that displays submenus together.

## Import

```ts
import { MegaMenuSub, MegaMenu } from '@helix-ui/core/megamenu';
```

## Components

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
| `scrollHeight` | `string` | `undefined!` | — |
| `tabindex` | `number` | `0` | — |
| `root` | `boolean` | `false` | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `itemClick` | `output&lt;any&gt;()` | — |
| `itemMouseEnter` | `output&lt;any&gt;()` | — |
| `menuFocus` | `output&lt;any&gt;()` | — |
| `menuBlur` | `output&lt;any&gt;()` | — |
| `menuKeydown` | `output&lt;any&gt;()` | — |
| `menuMouseDown` | `output&lt;any&gt;()` | — |

### MegaMenu

Selector: `h-megaMenu, h-megamenu, h-mega-menu`

MegaMenu is navigation component that displays submenus together.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `MegaMenuItem[] \| undefined` | — | An array of menuitems. |
| `styleClass` | `string \| undefined` | — | Class of the element. |
| `orientation` | `string` | `'horizontal'` | Defines the orientation. |
| `id` | `string \| undefined` | — | Current id state as a string. |
| `ariaLabel` | `string \| undefined` | — | Defines a string value that labels an interactive element. |
| `ariaLabelledBy` | `string \| undefined` | — | Identifier of the underlying input element. |
| `breakpoint` | `string` | `'960px'` | The breakpoint to define the maximum width boundary. |
| `scrollHeight` | `string` | `'20rem'` | Height of the viewport, a scrollbar is defined if height of list exceeds this value. |
| `disabled` | `boolean` | `false` | When present, it specifies that the component should be disabled. |
| `tabindex` | `number` | `0` | Index of the element in tabbing order. |

## Source

[`projects/core/megamenu`](../../projects/core/megamenu)
