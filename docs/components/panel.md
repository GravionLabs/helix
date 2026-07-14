# Panel

> Panel is a container with the optional content toggle feature.

## Import

```ts
import { Panel } from '@gravionlabs/helix/panel';
```

## Components

### Panel

Selector: `h-panel`

Panel is a container with the optional content toggle feature.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string \| undefined` | — | Id of the component. |
| `toggleable` | `boolean \| undefined` | — | Defines if content of panel can be expanded and collapsed. |
| `_header` | `string \| undefined` | — | Header text of the panel. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `iconPos` | `'start' \| 'end' \| 'center'` | `'end'` | Position of the icons. |
| `showHeader` | `boolean` | `true` | Specifies if header of panel cannot be displayed. |
| `toggler` | `'icon' \| 'header'` | `'icon'` | Specifies the toggler element to toggle the panel content. |
| `transitionOptions` | `string` | `'400ms cubic-bezier(0.86, 0, 0.07, 1)'` | Transition options of the animation. |
| `toggleButtonProps` | `any` | — | Used to pass all properties of the ButtonProps to the Button component. |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `collapsedChange` | `EventEmitter&lt;boolean \| undefined&gt;` | Emitted when the collapsed changes. |
| `onBeforeToggle` | `EventEmitter&lt;PanelBeforeToggleEvent&gt;` | Callback to invoke before panel toggle. |
| `onAfterToggle` | `EventEmitter&lt;PanelAfterToggleEvent&gt;` | Callback to invoke after panel toggle. |

## Source

[`projects/helix/panel`](../../projects/helix/panel)
