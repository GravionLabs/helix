# Fieldset

> Fieldset is a grouping component with the optional content toggle feature.

## Import

```ts
import { Fieldset } from '@helix-ui/core/fieldset';
```

## Components

### Fieldset

Selector: `h-fieldset`

Fieldset is a grouping component with the optional content toggle feature.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `legend` | `string \| undefined` | — | Header text of the fieldset. |
| `toggleable` | `boolean \| undefined` | — | When specified, content can toggled by clicking the legend. |
| `style` | `{ [klass: string]: any; } \| null \| undefined` | — | Inline style of the component. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `transitionOptions` | `string` | `'400ms cubic-bezier(0.86, 0, 0.07, 1)'` | Transition options of the panel animation. |
| `motionOptions` | `MotionOptions \| undefined` | — | The motion options. |
| `collapsed` | `boolean \| undefined` | `false` | Defines the initial state of content, supports one or two-way binding as well. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onBeforeToggle` | `output&lt;FieldsetBeforeToggleEvent&gt;()` | Callback to invoke before panel toggle. |
| `onAfterToggle` | `output&lt;FieldsetAfterToggleEvent&gt;()` | Callback to invoke after panel toggle. |

## Source

[`projects/core/fieldset`](../../projects/core/fieldset)
