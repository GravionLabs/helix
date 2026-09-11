# Stepper

> Stepper is a component that streamlines a wizard-like workflow, organizing content into coherent steps and visually guiding users through a numbered progression in a multistep process.

## Import

```ts
import { StepList, StepperSeparator, StepItem, Step, StepPanel, StepPanels, Stepper } from '@helix-ui/core/stepper';
```

## Components

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
| `disabled` | `any` | `false` | Whether the step is disabled. |

### StepPanel

Selector: `h-step-panel`

StepPanel is a helper component for Stepper component.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| undefined` | — | Active value of stepper. |

### StepPanels

Selector: `h-step-panels`

### Stepper

Selector: `h-stepper`

Stepper is a component that streamlines a wizard-like workflow, organizing content into coherent steps and visually guiding users through a numbered progression in a multistep process.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| undefined` | — | A model that can hold a numeric value or be undefined. |
| `linear` | `any` | `false` | A boolean variable that captures user input. |
| `transitionOptions` | `string` | `'400ms cubic-bezier(0.86, 0, 0.07, 1)'` | Transition options of the animation. |
| `motionOptions` | `MotionOptions \| undefined` | — | The motion options. |

## Interfaces & Types

- `StepContentTemplateContext` — Context interface for the StepPanel content template.
- `StepPanelContentTemplateContext` — Context interface for the StepPanel content template.

## Source

[`projects/core/stepper`](../../projects/core/stepper)
