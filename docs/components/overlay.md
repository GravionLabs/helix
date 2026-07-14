# Overlay

> Generic overlay container with configurable positioning, transitions, and pass-through.

## Import

```ts
import { Overlay } from '@gravionlabs/helix/overlay';
```

## Components

### Overlay

Selector: `h-overlay`

This API allows overlay components to be controlled from the PrimeNG. In this way, all overlay components in the application can have the same behavior.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `hostName` | `string` | `''` | — |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `undefined` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `inline` | `boolean` | `false` | Specifies whether the overlay should be rendered inline within the current component's template. |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |
| `hostAttrSelector` | `string` | — | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `visibleChange` | `EventEmitter&lt;boolean&gt;` | This EventEmitter is used to notify changes in the visibility state of a component. |
| `onBeforeShow` | `EventEmitter&lt;OverlayOnBeforeShowEvent&gt;` | Callback to invoke before the overlay is shown. |
| `onShow` | `EventEmitter&lt;OverlayOnShowEvent&gt;` | Callback to invoke when the overlay is shown. |
| `onBeforeHide` | `EventEmitter&lt;OverlayOnBeforeHideEvent&gt;` | Callback to invoke before the overlay is hidden. |
| `onHide` | `EventEmitter&lt;OverlayOnHideEvent&gt;` | Callback to invoke when the overlay is hidden |
| `onAnimationStart` | `EventEmitter&lt;AnimationEvent&gt;` | Callback to invoke when the animation is started. |
| `onAnimationDone` | `EventEmitter&lt;AnimationEvent&gt;` | Callback to invoke when the animation is done. |
| `onBeforeEnter` | `EventEmitter&lt;MotionEvent&gt;` | Callback to invoke before the overlay enters. |
| `onEnter` | `EventEmitter&lt;MotionEvent&gt;` | Callback to invoke when the overlay enters. |
| `onAfterEnter` | `EventEmitter&lt;MotionEvent&gt;` | Callback to invoke after the overlay has entered. |
| `onBeforeLeave` | `EventEmitter&lt;MotionEvent&gt;` | Callback to invoke before the overlay leaves. |
| `onLeave` | `EventEmitter&lt;MotionEvent&gt;` | Callback to invoke when the overlay leaves. |
| `onAfterLeave` | `EventEmitter&lt;MotionEvent&gt;` | Callback to invoke after the overlay has left. |

## Source

[`projects/helix/overlay`](../../projects/helix/overlay)
