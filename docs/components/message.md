# Message

> Message groups a collection of contents in tabs.

## Import

```ts
import { Message } from '@helix-ui/core/message';
```

## Components

### Message

Selector: `h-message`

Message groups a collection of contents in tabs.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `severity` | `"secondary" \| "info" \| "success" \| "warn" \| "contrast" \| "error" \| null \| undefined` | `'info'` | Severity level of the message. |
| `text` | `string \| undefined` | — | Text content. |
| `escape` | `boolean` | `true` | Whether displaying messages would be escaped or not. |
| `style` | `{ [klass: string]: any; } \| null \| undefined` | — | Inline style of the component. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `closable` | `boolean` | `false` | Whether the message can be closed manually using the close icon. |
| `icon` | `string \| undefined` | — | Icon to display in the message. |
| `closeIcon` | `string \| undefined` | — | Icon to display in the message close button. |
| `life` | `number \| undefined` | — | Delay in milliseconds to close the message automatically. |
| `showTransitionOptions` | `string` | `'300ms ease-out'` | Transition options of the show animation. |
| `hideTransitionOptions` | `string` | `'200ms cubic-bezier(0.86, 0, 0.07, 1)'` | Transition options of the hide animation. |
| `size` | `"large" \| "small" \| undefined` | — | Defines the size of the component. |
| `variant` | `"text" \| "outlined" \| "simple" \| undefined` | — | Specifies the input variant of the component. |
| `motionOptions` | `MotionOptions \| undefined` | — | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onClose` | `output&lt;{ originalEvent: Event; }&gt;()` | Emits when the message is closed. |

## Source

[`projects/core/message`](../../projects/core/message)
