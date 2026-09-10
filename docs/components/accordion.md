# Accordion

> Accordion groups a collection of contents in tabs.

## Import

```ts
import { AccordionPanel, AccordionHeader, AccordionContent, Accordion } from '@helix-ui/core/accordion';
```

## Components

### AccordionPanel

Selector: `h-accordion-panel, h-accordionpanel`

AccordionPanel is a helper component for Accordion component.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| number \| string[] \| number[] \| null \| undefined` | — | Value of the active tab. |
| `disabled` | `any` | `false` | Disables the tab when enabled. |

### AccordionHeader

Selector: `h-accordion-header, h-accordionheader`

AccordionHeader is a helper component for Accordion component.

### AccordionContent

Selector: `h-accordion-content, h-accordioncontent`

### Accordion

Selector: `h-accordion`

Accordion groups a collection of contents in tabs.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| number \| string[] \| number[] \| null \| undefined` | — | Value of the active tab. |
| `multiple` | `boolean` | `false` | When enabled, multiple tabs can be activated at the same time. |
| `styleClass` | `string \| undefined` | — | Class of the element. |
| `expandIcon` | `string \| undefined` | — | Icon of a collapsed tab. |
| `collapseIcon` | `string \| undefined` | — | Icon of an expanded tab. |
| `selectOnFocus` | `boolean` | `false` | When enabled, the focused tab is activated. |
| `transitionOptions` | `string` | `'400ms cubic-bezier(0.86, 0, 0.07, 1)'` | Transition options of the animation. |
| `motionOptions` | `MotionOptions \| undefined` | — | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onClose` | `output&lt;AccordionTabCloseEvent&gt;()` | Callback to invoke when an active tab is collapsed by clicking on the header. |
| `onOpen` | `output&lt;AccordionTabOpenEvent&gt;()` | Callback to invoke when a tab gets expanded. |

## Interfaces & Types

- `AccordionTabOpenEvent` — Custom tab open event.
- `AccordionTabCloseEvent` — Custom tab close event.
- `AccordionToggleIconTemplateContext` — Toggle icon template context.

## Source

[`projects/core/accordion`](../../projects/core/accordion)
