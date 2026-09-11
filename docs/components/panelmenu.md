# PanelMenu

> PanelMenu is a hybrid of Accordion and Tree components.

## Import

```ts
import { PanelMenuSub, PanelMenuList, PanelMenu } from '@helix-ui/core/panelmenu';
```

## Components

### PanelMenuSub

Selector: `ul[hPanelMenuSub]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `panelId` | `string \| undefined` | — | — |
| `focusedItemId` | `string \| undefined` | — | — |
| `items` | `any[]` | `undefined!` | — |
| `itemTemplate` | `TemplateRef&lt;PanelMenuItemTemplateContext&gt; \| undefined` | — | — |
| `level` | `number` | `0` | — |
| `activeItemPath` | `any[]` | `undefined!` | — |
| `root` | `boolean \| undefined` | — | — |
| `tabindex` | `number \| undefined` | — | — |
| `transitionOptions` | `string \| undefined` | — | — |
| `parentExpanded` | `boolean \| undefined` | — | — |
| `motionOptions` | `MotionOptions \| undefined` | — | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `itemToggle` | `output&lt;any&gt;()` | — |
| `menuFocus` | `output&lt;any&gt;()` | — |
| `menuBlur` | `output&lt;any&gt;()` | — |
| `menuKeyDown` | `output&lt;any&gt;()` | — |

### PanelMenuList

Selector: `ul[hPanelMenuList]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `panelId` | `string \| undefined` | — | — |
| `id` | `string \| undefined` | — | — |
| `items` | `any[]` | `undefined!` | — |
| `itemTemplate` | `TemplateRef&lt;PanelMenuItemTemplateContext&gt; \| undefined` | — | — |
| `parentExpanded` | `boolean \| undefined` | — | — |
| `expanded` | `boolean \| undefined` | — | — |
| `transitionOptions` | `string \| undefined` | — | — |
| `root` | `boolean \| undefined` | — | — |
| `tabindex` | `number \| undefined` | — | — |
| `activeItem` | `any` | — | — |
| `motionOptions` | `MotionOptions \| undefined` | — | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `itemToggle` | `output&lt;any&gt;()` | — |
| `headerFocus` | `output&lt;any&gt;()` | — |

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
| `motionOptions` | `MotionOptions \| undefined` | — | The motion options. |
| `id` | `string \| undefined` | — | Current id state as a string. |
| `tabindex` | `number \| undefined` | `0` | Index of the element in tabbing order. |

## Source

[`projects/core/panelmenu`](../../projects/core/panelmenu)
