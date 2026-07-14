# ConfirmPopup

> ConfirmPopup displays a confirmation overlay displayed relatively to its target.

## Import

```ts
import { ConfirmPopup } from '@gravionlabs/helix/confirmpopup';
```

## Components

### ConfirmPopup

Selector: `h-confirmpopup`

ConfirmPopup displays a confirmation overlay displayed relatively to its target.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `key` | `string \| undefined` | — | Optional key to match the key of confirm object, necessary to use when component tree has multiple confirm dialogs. |
| `defaultFocus` | `string` | `'accept'` | Element to receive the focus when the popup gets visible, valid values are "accept", "reject", and "none". |
| `showTransitionOptions` | `string` | `'.12s cubic-bezier(0, 0, 0.2, 1)'` | Transition options of the show animation. |
| `hideTransitionOptions` | `string` | `'.1s linear'` | Transition options of the hide animation. |
| `autoZIndex` | `boolean` | `true` | Whether to automatically manage layering. |
| `baseZIndex` | `number` | `0` | Base zIndex value to use in layering. |
| `style` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the component. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `visible` | `boolean` | — | Defines if the component is visible. |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `'body'` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |

## Source

[`projects/helix/confirmpopup`](../../projects/helix/confirmpopup)
