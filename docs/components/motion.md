# Motion

> Enter/leave animation directive built on `@primeuix/motion`.

## Import

```ts
import { Motion, MotionDirective } from '@gravionlabs/helix/motion';
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
| `name` | `MotionOptions['name']` | `undefined` | The name of the motion. It can be a predefined motion name or a custom one. phases: [name]-enter [name]-enter-active [name]-enter-to [name]-leave [name]-leave-active [name]-leave-to |
| `type` | `MotionOptions['type']` | `undefined` | The type of the motion, valid values 'transition' and 'animation'. |
| `safe` | `MotionOptions['safe']` | `undefined` | Whether the motion is safe. |
| `disabled` | `MotionOptions['disabled']` | `false` | Whether the motion is disabled. |
| `appear` | `MotionOptions['appear']` | `false` | Whether the motion should appear. |
| `enter` | `MotionOptions['enter']` | `true` | Whether the motion should enter. |
| `leave` | `MotionOptions['leave']` | `true` | Whether the motion should leave. |
| `duration` | `MotionOptions['duration']` | `undefined` | The duration of the motion. |
| `hideStrategy` | `'display' \| 'visibility'` | `'display'` | The hide strategy of the motion, valid values 'display' and 'visibility'. |
| `enterFromClass` | `ClassNameOptions['from']` | `undefined` | The enter from class of the motion. |
| `enterToClass` | `ClassNameOptions['to']` | `undefined` | The enter to class of the motion. |
| `enterActiveClass` | `ClassNameOptions['active']` | `undefined` | The enter active class of the motion. |
| `leaveFromClass` | `ClassNameOptions['from']` | `undefined` | The leave from class of the motion. |
| `leaveToClass` | `ClassNameOptions['to']` | `undefined` | The leave to class of the motion. |
| `leaveActiveClass` | `ClassNameOptions['active']` | `undefined` | The leave active class of the motion. |
| `options` | `MotionOptions` | `{}` | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onBeforeEnter` | `MotionEvent \| undefined` | Callback fired before the enter transition/animation starts. |
| `onEnter` | `MotionEvent \| undefined` | Callback fired when the enter transition/animation starts. |
| `onAfterEnter` | `MotionEvent \| undefined` | Callback fired after the enter transition/animation ends. |
| `onEnterCancelled` | `MotionEvent \| undefined` | Callback fired when the enter transition/animation is cancelled. |
| `onBeforeLeave` | `MotionEvent \| undefined` | Callback fired before the leave transition/animation starts. |
| `onLeave` | `MotionEvent \| undefined` | Callback fired when the leave transition/animation starts. |
| `onAfterLeave` | `MotionEvent \| undefined` | Callback fired after the leave transition/animation ends. |
| `onLeaveCancelled` | `MotionEvent \| undefined` | Callback fired when the leave transition/animation is cancelled. |

### MotionDirective

Selector: `[hMotion]`

Motion Directive is directive to apply motion effects to elements.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `false` | Whether the element is visible or not. |
| `name` | `MotionOptions['name']` | `undefined` | The name of the motion. It can be a predefined motion name or a custom one. phases: [name]-enter [name]-enter-active [name]-enter-to [name]-leave [name]-leave-active [name]-leave-to |
| `type` | `MotionOptions['type']` | `undefined` | The type of the motion, valid values 'transition' and 'animation'. |
| `safe` | `MotionOptions['safe']` | `undefined` | Whether the motion is safe. |
| `disabled` | `MotionOptions['disabled']` | `false` | Whether the motion is disabled. |
| `appear` | `MotionOptions['appear']` | `false` | Whether the motion should appear. |
| `enter` | `MotionOptions['enter']` | `true` | Whether the motion should enter. |
| `leave` | `MotionOptions['leave']` | `true` | Whether the motion should leave. |
| `duration` | `MotionOptions['duration']` | `undefined` | The duration of the motion. |
| `hideStrategy` | `'display' \| 'visibility'` | `'display'` | The hide strategy of the motion, valid values 'display' and 'visibility'. |
| `enterFromClass` | `ClassNameOptions['from']` | `undefined` | The enter from class of the motion. |
| `enterToClass` | `ClassNameOptions['to']` | `undefined` | The enter to class of the motion. |
| `enterActiveClass` | `ClassNameOptions['active']` | `undefined` | The enter active class of the motion. |
| `leaveFromClass` | `ClassNameOptions['from']` | `undefined` | The leave from class of the motion. |
| `leaveToClass` | `ClassNameOptions['to']` | `undefined` | The leave to class of the motion. |
| `leaveActiveClass` | `ClassNameOptions['active']` | `undefined` | The leave active class of the motion. |
| `options` | `MotionOptions` | `{}` | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onBeforeEnter` | `MotionEvent \| undefined` | Callback fired before the enter transition/animation starts. |
| `onEnter` | `MotionEvent \| undefined` | Callback fired when the enter transition/animation starts. |
| `onAfterEnter` | `MotionEvent \| undefined` | Callback fired after the enter transition/animation ends. |
| `onEnterCancelled` | `MotionEvent \| undefined` | Callback fired when the enter transition/animation is cancelled. |
| `onBeforeLeave` | `MotionEvent \| undefined` | Callback fired before the leave transition/animation starts. |
| `onLeave` | `MotionEvent \| undefined` | Callback fired when the leave transition/animation starts. |
| `onAfterLeave` | `MotionEvent \| undefined` | Callback fired after the leave transition/animation ends. |
| `onLeaveCancelled` | `MotionEvent \| undefined` | Callback fired when the leave transition/animation is cancelled. |

## Functions

- `applyHiddenStyles()`
- `resetStyles()`

## Source

[`projects/helix/motion`](../../projects/helix/motion)
