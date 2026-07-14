# AnimateOnScroll

> AnimateOnScroll is used to apply animations to elements when entering or leaving the viewport during scrolling.

## Import

```ts
import { AnimateOnScroll } from '@gravionlabs/helix/animateonscroll';
```

## Directives

### AnimateOnScroll

Selector: `[hAnimateOnScroll]`

AnimateOnScroll is used to apply animations to elements when entering or leaving the viewport during scrolling.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `enterClass` | `string \| undefined` | — | Selector to define the CSS class for enter animation. |
| `leaveClass` | `string \| undefined` | — | Selector to define the CSS class for leave animation. |
| `root` | `HTMLElement \| undefined \| null` | — | Specifies the root option of the IntersectionObserver API. |
| `rootMargin` | `string \| undefined` | — | Specifies the rootMargin option of the IntersectionObserver API. |
| `threshold` | `number \| undefined` | `0.5` | Specifies the threshold option of the IntersectionObserver API |
| `once` | `boolean` | `false` | Whether the scroll event listener should be removed after initial run. |

## Source

[`projects/helix/animateonscroll`](../../projects/helix/animateonscroll)
