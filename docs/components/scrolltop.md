# ScrollTop

> ScrollTop gets displayed after a certain scroll position and used to navigates to the top of the page quickly.

## Import

```ts
import { ScrollTop } from '@helix-ui/core/scrolltop';
```

## Components

### ScrollTop

Selector: `h-scrollTop, h-scrolltop, h-scroll-top`

ScrollTop gets displayed after a certain scroll position and used to navigates to the top of the page quickly.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `styleClass` | `string \| undefined` | — | Class of the element. |
| `style` | `{ [klass: string]: any; } \| null \| undefined` | — | Inline style of the element. |
| `target` | `"window" \| "parent" \| undefined` | `'window'` | Target of the ScrollTop. |
| `threshold` | `number` | `400` | Defines the threshold value of the vertical scroll position of the target to toggle the visibility. |
| `icon` | `string \| undefined` | — | Name of the icon or JSX.Element for icon. |
| `behavior` | `"auto" \| "smooth" \| undefined` | `'smooth'` | Defines the scrolling behavior, "smooth" adds an animation and "auto" scrolls with a jump. |
| `showTransitionOptions` | `string` | `'.15s'` | A string value used to determine the display transition options. |
| `hideTransitionOptions` | `string` | `'.15s'` | A string value used to determine the hiding transition options. |
| `motionOptions` | `MotionOptions \| undefined` | — | The motion options. |
| `buttonAriaLabel` | `string \| undefined` | — | Establishes a string value that labels the scroll-top button. |
| `buttonProps` | `ButtonProps` | `{ rounded: true }` | Used to pass all properties of the ButtonProps to the Button component. |

## Source

[`projects/core/scrolltop`](../../projects/core/scrolltop)
