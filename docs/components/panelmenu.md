# PanelMenu

> PanelMenu is a hybrid of Accordion and Tree components.

## Import

```ts
import { PanelMenu, PanelMenuSub, PanelMenuList } from '@gravionlabs/helix/panelmenu';
```

## Components

### PanelMenu

Selector: `h-panelMenu, h-panelmenu, h-panel-menu`

PanelMenu is a hybrid of Accordion and Tree components.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `MenuItem[] \| undefined` | — | An array of menuitems. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `multiple` | `boolean` | `false` | Whether multiple tabs can be activated at the same time or not. |
| `transitionOptions` | `string` | `'400ms cubic-bezier(0.86, 0, 0.07, 1)'` | Transition options of the animation. |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |
| `id` | `string \| undefined` | — | Current id state as a string. |
| `tabindex` | `number \| undefined` | `0` | Index of the element in tabbing order. |

### PanelMenuSub

Selector: `ul[hPanelMenuSub]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `panelId` | `string \| undefined` | — | — |
| `focusedItemId` | `string \| undefined` | — | — |
| `items` | `any[]` | — | — |
| `itemTemplate` | `TemplateRef&lt;PanelMenuItemTemplateContext&gt; \| undefined` | — | — |
| `level` | `number` | `0` | — |
| `activeItemPath` | `any[]` | — | — |
| `root` | `boolean \| undefined` | — | — |
| `tabindex` | `number \| undefined` | — | — |
| `transitionOptions` | `string \| undefined` | — | — |
| `parentExpanded` | `boolean \| undefined` | — | — |
| `motionOptions` | `MotionOptions` | — | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `itemToggle` | `EventEmitter&lt;any&gt;` | — |
| `menuFocus` | `EventEmitter&lt;any&gt;` | — |
| `menuBlur` | `EventEmitter&lt;any&gt;` | — |
| `menuKeyDown` | `EventEmitter&lt;any&gt;` | — |

### PanelMenuList

Selector: `ul[hPanelMenuList]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `panelId` | `string \| undefined` | — | — |
| `id` | `string \| undefined` | — | — |
| `items` | `any[]` | — | — |
| `itemTemplate` | `TemplateRef&lt;PanelMenuItemTemplateContext&gt; \| undefined` | — | — |
| `parentExpanded` | `boolean \| undefined` | — | — |
| `expanded` | `boolean \| undefined` | — | — |
| `transitionOptions` | `string \| undefined` | — | — |
| `root` | `boolean \| undefined` | — | — |
| `tabindex` | `number \| undefined` | — | — |
| `activeItem` | `any` | — | — |
| `motionOptions` | `MotionOptions` | — | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `itemToggle` | `EventEmitter&lt;any&gt;` | — |
| `headerFocus` | `EventEmitter&lt;any&gt;` | — |

## Source

[`projects/helix/panelmenu`](../../projects/helix/panelmenu)
