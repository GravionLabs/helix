# Panel

> Panel is a container with the optional content toggle feature.

## Import

```ts
import { Panel } from '@helix-ui/core/panel';
```

## Components

### Panel

Selector: `h-panel`

Panel is a container with the optional content toggle feature.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string \| undefined` | `uuid('pn_id_')` | Id of the component. |
| `toggleable` | `boolean \| undefined` | — | Defines if content of panel can be expanded and collapsed. |
| `_header` | `string \| undefined` | — | Header text of the panel. |
| `collapsed` | `boolean \| undefined` | `false` | Defines the initial state of panel content, supports one or two-way binding as well. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `iconPos` | `"center" \| "start" \| "end"` | `'end'` | Position of the icons. |
| `showHeader` | `boolean` | `true` | Specifies if header of panel cannot be displayed. |
| `toggler` | `"header" \| "icon"` | `'icon'` | Specifies the toggler element to toggle the panel content. |
| `transitionOptions` | `string` | `'400ms cubic-bezier(0.86, 0, 0.07, 1)'` | Transition options of the animation. |
| `toggleButtonProps` | `any` | — | Used to pass all properties of the ButtonProps to the Button component. |
| `motionOptions` | `MotionOptions \| undefined` | — | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onBeforeToggle` | `output&lt;PanelBeforeToggleEvent&gt;()` | Callback to invoke before panel toggle. |
| `onAfterToggle` | `output&lt;PanelAfterToggleEvent&gt;()` | Callback to invoke after panel toggle. |

## Source

[`projects/core/panel`](../../projects/core/panel)
