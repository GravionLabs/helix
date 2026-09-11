# Motion

> Motion component is a container to apply motion effects to its content.

## Import

```ts
import { Motion, MotionDirective } from '@helix-ui/core/motion';
```

## Components

### Motion

Selector: `h-motion`

Motion component is a container to apply motion effects to its content.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `false` | Whether the element is visible or not. |
| `mountOnEnter` | `boolean` | `true` | Whether to mount the element on enter. |
| `unmountOnLeave` | `boolean` | `true` | Whether to unmount the element on leave. |
| `name` | `string \| undefined` | — | The name of the motion. It can be a predefined motion name or a custom one. |
| `type` | `MotionType \| undefined` | — | The type of the motion, valid values 'transition' and 'animation'. |
| `safe` | `boolean \| undefined` | — | Whether the motion is safe. |
| `disabled` | `boolean \| undefined` | `false` | Whether the motion is disabled. |
| `appear` | `boolean \| undefined` | `false` | Whether the motion should appear. |
| `enter` | `boolean \| undefined` | `true` | Whether the motion should enter. |
| `leave` | `boolean \| undefined` | `true` | Whether the motion should leave. |
| `duration` | `MotionDuration` | — | The duration of the motion. |
| `hideStrategy` | `"display" \| "visibility"` | `'display'` | The hide strategy of the motion, valid values 'display' and 'visibility'. |
| `enterFromClass` | `string \| undefined` | — | The enter from class of the motion. |
| `enterToClass` | `string \| undefined` | — | The enter to class of the motion. |
| `enterActiveClass` | `string \| undefined` | — | The enter active class of the motion. |
| `leaveFromClass` | `string \| undefined` | — | The leave from class of the motion. |
| `leaveToClass` | `string \| undefined` | — | The leave to class of the motion. |
| `leaveActiveClass` | `string \| undefined` | — | The leave active class of the motion. |
| `options` | `MotionOptions` | `{}` | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onBeforeEnter` | `output&lt;MotionEvent \| undefined&gt;()` | Callback fired before the enter transition/animation starts. |
| `onEnter` | `output&lt;MotionEvent \| undefined&gt;()` | Callback fired when the enter transition/animation starts. |
| `onAfterEnter` | `output&lt;MotionEvent \| undefined&gt;()` | Callback fired after the enter transition/animation ends. |
| `onEnterCancelled` | `output&lt;MotionEvent \| undefined&gt;()` | Callback fired when the enter transition/animation is cancelled. |
| `onBeforeLeave` | `output&lt;MotionEvent \| undefined&gt;()` | Callback fired before the leave transition/animation starts. |
| `onLeave` | `output&lt;MotionEvent \| undefined&gt;()` | Callback fired when the leave transition/animation starts. |
| `onAfterLeave` | `output&lt;MotionEvent \| undefined&gt;()` | Callback fired after the leave transition/animation ends. |
| `onLeaveCancelled` | `output&lt;MotionEvent \| undefined&gt;()` | Callback fired when the leave transition/animation is cancelled. |

### MotionDirective

Selector: `[hMotion]`

Motion Directive is directive to apply motion effects to elements.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `false` | Whether the element is visible or not. |
| `name` | `string \| undefined` | — | The name of the motion. It can be a predefined motion name or a custom one. |
| `type` | `MotionType \| undefined` | — | The type of the motion, valid values 'transition' and 'animation'. |
| `safe` | `boolean \| undefined` | — | Whether the motion is safe. |
| `disabled` | `boolean \| undefined` | `false` | Whether the motion is disabled. |
| `appear` | `boolean \| undefined` | `false` | Whether the motion should appear. |
| `enter` | `boolean \| undefined` | `true` | Whether the motion should enter. |
| `leave` | `boolean \| undefined` | `true` | Whether the motion should leave. |
| `duration` | `MotionDuration` | — | The duration of the motion. |
| `hideStrategy` | `"display" \| "visibility"` | `'display'` | The hide strategy of the motion, valid values 'display' and 'visibility'. |
| `enterFromClass` | `string \| undefined` | — | The enter from class of the motion. |
| `enterToClass` | `string \| undefined` | — | The enter to class of the motion. |
| `enterActiveClass` | `string \| undefined` | — | The enter active class of the motion. |
| `leaveFromClass` | `string \| undefined` | — | The leave from class of the motion. |
| `leaveToClass` | `string \| undefined` | — | The leave to class of the motion. |
| `leaveActiveClass` | `string \| undefined` | — | The leave active class of the motion. |
| `options` | `MotionOptions` | `{}` | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onBeforeEnter` | `output&lt;MotionEvent \| undefined&gt;()` | Callback fired before the enter transition/animation starts. |
| `onEnter` | `output&lt;MotionEvent \| undefined&gt;()` | Callback fired when the enter transition/animation starts. |
| `onAfterEnter` | `output&lt;MotionEvent \| undefined&gt;()` | Callback fired after the enter transition/animation ends. |
| `onEnterCancelled` | `output&lt;MotionEvent \| undefined&gt;()` | Callback fired when the enter transition/animation is cancelled. |
| `onBeforeLeave` | `output&lt;MotionEvent \| undefined&gt;()` | Callback fired before the leave transition/animation starts. |
| `onLeave` | `output&lt;MotionEvent \| undefined&gt;()` | Callback fired when the leave transition/animation starts. |
| `onAfterLeave` | `output&lt;MotionEvent \| undefined&gt;()` | Callback fired after the leave transition/animation ends. |
| `onLeaveCancelled` | `output&lt;MotionEvent \| undefined&gt;()` | Callback fired when the leave transition/animation is cancelled. |

## Functions

- `applyHiddenStyles`
- `resetStyles`

## Source

[`projects/core/motion`](../../projects/core/motion)
