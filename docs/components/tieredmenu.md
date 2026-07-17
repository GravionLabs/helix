# TieredMenu

> TieredMenu displays submenus in nested overlays.

## Import

```ts
import { TieredMenu, TieredMenuSub } from '@gravionlabs/helix/tieredmenu';
```

## Components

### TieredMenu

Selector: `h-tieredMenu, h-tieredmenu, h-tiered-menu`

TieredMenu displays submenus in nested overlays.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `popup` | `boolean \| undefined` | — | Defines if menu would displayed as a popup. |
| `style` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the component. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `breakpoint` | `string` | `'960px'` | The breakpoint to define the maximum width boundary. |
| `autoZIndex` | `boolean` | `true` | Whether to automatically manage layering. |
| `baseZIndex` | `number` | `0` | Base zIndex value to use in layering. |
| `autoDisplay` | `boolean \| undefined` | `true` | Whether to show a root submenu on mouse over. |
| `showTransitionOptions` | `string` | `'.12s cubic-bezier(0, 0, 0.2, 1)'` | Transition options of the show animation. |
| `hideTransitionOptions` | `string` | `'.1s linear'` | Transition options of the hide animation. |
| `id` | `string \| undefined` | — | Current id state as a string. |
| `ariaLabel` | `string \| undefined` | — | Defines a string value that labels an interactive element. |
| `ariaLabelledBy` | `string \| undefined` | — | Identifier of the underlying input element. |
| `disabled` | `boolean` | `false` | When present, it specifies that the component should be disabled. |
| `tabindex` | `number` | `0` | Index of the element in tabbing order. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `undefined` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onShow` | `EventEmitter&lt;any&gt;` | Callback to invoke when overlay menu is shown. |
| `onHide` | `EventEmitter&lt;any&gt;` | Callback to invoke when overlay menu is hidden. |

### TieredMenuSub

Selector: `h-tieredMenuSub, h-tieredmenusub`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `any[]` | — | — |
| `itemTemplate` | `TemplateRef&lt;TieredMenuItemTemplateContext&gt; \| undefined` | — | — |
| `root` | `boolean \| undefined` | `false` | — |
| `autoDisplay` | `boolean \| undefined` | — | — |
| `autoZIndex` | `boolean` | `true` | — |
| `baseZIndex` | `number` | `0` | — |
| `popup` | `boolean \| undefined` | — | — |
| `menuId` | `string \| undefined` | — | — |
| `ariaLabel` | `string \| undefined` | — | — |
| `ariaLabelledBy` | `string \| undefined` | — | — |
| `level` | `number` | `0` | — |
| `focusedItemId` | `string \| undefined` | — | — |
| `activeItemPath` | `any[]` | `[]` | — |
| `motionOptions` | `MotionOptions[] \| undefined` | — | — |
| `tabindex` | `number` | `0` | — |
| `inlineStyles` | `{ [klass: string]: any } \| null \| undefined` | — | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `itemClick` | `EventEmitter&lt;any&gt;` | — |
| `itemMouseEnter` | `EventEmitter&lt;any&gt;` | — |
| `menuFocus` | `EventEmitter&lt;any&gt;` | — |
| `menuBlur` | `EventEmitter&lt;any&gt;` | — |
| `menuKeydown` | `EventEmitter&lt;any&gt;` | — |

## Source

[`projects/helix/tieredmenu`](../../projects/helix/tieredmenu)
