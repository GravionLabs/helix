# Stepper

> Stepper is a component that streamlines a wizard-like workflow, organizing content into coherent steps and visually guiding users through a numbered progression in a multistep process.

## Import

```ts
import { Stepper, StepList, StepperSeparator } from '@gravionlabs/helix/stepper';
```

## Components

### Stepper

Selector: `h-stepper`

Stepper is a component that streamlines a wizard-like workflow, organizing content into coherent steps and visually guiding users through a numbered progression in a multistep process.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| undefined` | `undefined` | A model that can hold a numeric value or be undefined. |
| `linear` | `InputSignalWithTransform&lt;any, boolean&gt;` | `false` | A boolean variable that captures user input. |
| `transitionOptions` | `string` | `'400ms cubic-bezier(0.86, 0, 0.07, 1)'` | Transition options of the animation. |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |

### StepList

Selector: `h-step-list`

### StepperSeparator

Selector: `h-stepper-separator`

StepperSeparator is a helper component for Stepper component used in vertical orientation.

### StepItem

Selector: `h-step-item`

StepItem is a helper component for Stepper component used in vertical orientation.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| undefined` | — | Value of step. |

### Step

Selector: `h-step`

Step is a helper component for Stepper component.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| undefined` | — | Active value of stepper. |
| `disabled` | `InputSignalWithTransform&lt;any, boolean&gt;` | `false` | Whether the step is disabled. |

### StepPanel

Selector: `h-step-panel`

StepPanel is a helper component for Stepper component.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| undefined` | `undefined` | Active value of stepper. |

### StepPanels

Selector: `h-step-panels`

## Interfaces & Types

- `StepContentTemplateContext` — Context interface for the StepPanel content template.
- `StepPanelContentTemplateContext` — Context interface for the StepPanel content template.

## Source

[`projects/helix/stepper`](../../projects/helix/stepper)
