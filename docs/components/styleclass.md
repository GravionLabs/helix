# StyleClass

> StyleClass manages css classes declaratively to during enter/leave animations or just to toggle classes on an element.

## Import

```ts
import { StyleClass } from '@gravionlabs/helix/styleclass';
```

## Directives

### StyleClass

Selector: `[hStyleClass]`

StyleClass manages css classes declaratively to during enter/leave animations or just to toggle classes on an element.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `selector` | `string \| undefined` | — | Selector to define the target element. Available selectors are '@next', '@prev', '@parent' and '@grandparent'. |
| `enterFromClass` | `string \| undefined` | — | Style class to add when item begins to get displayed. |
| `enterActiveClass` | `string \| undefined` | — | Style class to add during enter animation. |
| `enterToClass` | `string \| undefined` | — | Style class to add when item begins to get displayed. |
| `leaveFromClass` | `string \| undefined` | — | Style class to add when item begins to get hidden. |
| `leaveActiveClass` | `string \| undefined` | — | Style class to add during leave animation. |
| `leaveToClass` | `string \| undefined` | — | Style class to add when leave animation is completed. |
| `hideOnOutsideClick` | `boolean \| undefined` | — | Whether to trigger leave animation when outside of the element is clicked. |
| `toggleClass` | `string \| undefined` | — | Adds or removes a class when no enter-leave animation is required. |
| `hideOnEscape` | `boolean \| undefined` | — | Whether to trigger leave animation when escape key pressed. |
| `hideOnResize` | `boolean \| undefined` | — | Whether to trigger leave animation when the target element resized. |
| `resizeSelector` | `string \| undefined` | — | Target element to listen resize. Valid values are "window", "document" or target element selector. |

## Source

[`projects/helix/styleclass`](../../projects/helix/styleclass)
