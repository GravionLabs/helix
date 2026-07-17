# Toast

> Toast is used to display messages in an overlay.

## Import

```ts
import { Toast, ToastItem } from '@gravionlabs/helix/toast';
```

## Components

### Toast

Selector: `h-toast`

Toast is used to display messages in an overlay.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `key` | `string \| undefined` | — | Key of the message in case message is targeted to a specific toast component. |
| `autoZIndex` | `boolean` | `true` | Whether to automatically manage layering. |
| `baseZIndex` | `number` | `0` | Base zIndex value to use in layering. |
| `life` | `number` | `3000` | The default time to display messages for in milliseconds. |
| `styleClass` | `string \| undefined` | — | Inline class of the component. |
| `preventOpenDuplicates` | `boolean` | `false` | It does not add the new message if there is already a toast displayed with the same content |
| `preventDuplicates` | `boolean` | `false` | Displays only once a message with the same content. |
| `showTransformOptions` | `string` | `'translateY(100%)'` | Transform options of the show animation. |
| `hideTransformOptions` | `string` | `'translateY(-100%)'` | Transform options of the hide animation. |
| `showTransitionOptions` | `string` | `'300ms ease-out'` | Transition options of the show animation. |
| `hideTransitionOptions` | `string` | `'250ms ease-in'` | Transition options of the hide animation. |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |
| `breakpoints` | `{ [key: string]: any } \| undefined` | — | Object literal to define styles per screen size. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onClose` | `EventEmitter&lt;ToastCloseEvent&gt;` | Callback to invoke when a message is closed. |

### ToastItem

Selector: `h-toastItem`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `message` | `ToastMessageOptions \| null \| undefined` | — | — |
| `index` | `number \| null \| undefined` | — | — |
| `life` | `number` | — | — |
| `template` | `TemplateRef&lt;ToastMessageTemplateContext&gt; \| undefined` | — | — |
| `headlessTemplate` | `TemplateRef&lt;ToastHeadlessTemplateContext&gt; \| undefined` | — | — |
| `showTransformOptions` | `string \| undefined` | — | — |
| `hideTransformOptions` | `string \| undefined` | — | — |
| `showTransitionOptions` | `string \| undefined` | — | — |
| `hideTransitionOptions` | `string \| undefined` | — | — |
| `motionOptions` | `MotionOptions` | — | — |
| `clearAll` | `any` | `null` | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onAnimationStart` | `HTMLElement` | — |
| `onAnimationEnd` | `HTMLElement` | — |
| `onClose` | `EventEmitter&lt;ToastItemCloseEvent&gt;` | — |

## Source

[`projects/helix/toast`](../../projects/helix/toast)
