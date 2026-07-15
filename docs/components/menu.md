# Menu

> Menu is a navigation / command component that supports dynamic and static positioning.

## Import

```ts
import { Menu, MenuItemContent } from '@gravionlabs/helix/menu';
```

## Components

### Menu

Selector: `h-menu`

Menu is a navigation / command component that supports dynamic and static positioning.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `MenuItem[] \| undefined` | — | An array of menuitems. |
| `popup` | `boolean \| undefined` | — | Defines if menu would displayed as a popup. |
| `style` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the component. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `autoZIndex` | `boolean` | `true` | Whether to automatically manage layering. |
| `baseZIndex` | `number` | `0` | Base zIndex value to use in layering. |
| `showTransitionOptions` | `string` | `'.12s cubic-bezier(0, 0, 0.2, 1)'` | Transition options of the show animation. |
| `hideTransitionOptions` | `string` | `'.1s linear'` | Transition options of the hide animation. |
| `ariaLabel` | `string \| undefined` | — | Defines a string value that labels an interactive element. |
| `ariaLabelledBy` | `string \| undefined` | — | Identifier of the underlying input element. |
| `id` | `string \| undefined` | — | Current id state as a string. |
| `tabindex` | `number` | `0` | Index of the element in tabbing order. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `undefined` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onShow` | `EventEmitter&lt;any&gt;` | Callback to invoke when overlay menu is shown. |
| `onHide` | `EventEmitter&lt;any&gt;` | Callback to invoke when overlay menu is hidden. |
| `onBlur` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the list loses focus. |
| `onFocus` | `EventEmitter&lt;Event&gt;` | Callback to invoke when the list receives focus. |

### MenuItemContent

Selector: `[hMenuItemContent]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `item` | `MenuItem \| undefined` | — | — |
| `itemTemplate` | `any \| undefined` | — | — |
| `menuitemId` | `string` | `''` | — |
| `idx` | `number` | `0` | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onMenuItemClick` | `EventEmitter&lt;any&gt;` | — |

## Pipes

- `SafeHtmlPipe`

## Source

[`projects/helix/menu`](../../projects/helix/menu)
