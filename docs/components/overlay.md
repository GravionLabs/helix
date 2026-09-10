# Overlay

> This API allows overlay components to be controlled from the Helix configuration. In this way, all overlay components in the application can have the same behavior.

## Import

```ts
import { Overlay } from '@helix-ui/core/overlay';
```

## Components

### Overlay

Selector: `h-overlay`

This API allows overlay components to be controlled from the Helix configuration. In this way, all overlay components in the application can have the same behavior.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `hostName` | `string` | `''` | — |
| `visible` | `boolean` | `false` | The visible property is an input that determines the visibility of the component. |
| `mode` | `string \| undefined` | `''` | The mode property is an input that determines the overlay mode type or string. |
| `style` | `any` | — | The style property is an input that determines the style object for the component. |
| `styleClass` | `string` | `''` | The styleClass property is an input that determines the CSS class(es) for the component. |
| `contentStyle` | `any` | — | The contentStyle property is an input that determines the style object for the content of the component. |
| `contentStyleClass` | `string` | `''` | The contentStyleClass property is an input that determines the CSS class(es) for the content of the component. |
| `target` | `string \| null \| undefined` | — | The target property is an input that specifies the target element or selector for the component. |
| `autoZIndex` | `boolean` | `true` | The autoZIndex determines whether to automatically manage layering. Its default value is 'false'. |
| `baseZIndex` | `number` | `0` | The baseZIndex is base zIndex value to use in layering. |
| `showTransitionOptions` | `string` | `'.12s cubic-bezier(0, 0, 0.2, 1)'` | Transition options of the show or hide animation. |
| `hideTransitionOptions` | `string` | `'.1s linear'` | The hideTransitionOptions property is an input that determines the CSS transition options for hiding the component. |
| `listener` | `any` | — | The listener property is an input that specifies the listener object for the component. |
| `responsive` | `ResponsiveOverlayOptions \| undefined` | — | It is the option used to determine in which mode it should appear according to the given media or breakpoint. |
| `options` | `OverlayOptions \| undefined` | — | The options property is an input that specifies the overlay options for the component. |
| `appendTo` | `any` | — | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `inline` | `boolean` | `false` | Specifies whether the overlay should be rendered inline within the current component's template. |
| `motionOptions` | `MotionOptions \| undefined` | — | The motion options. |
| `hostAttrSelector` | `string \| undefined` | — | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onBeforeShow` | `output&lt;OverlayOnBeforeShowEvent&gt;()` | Callback to invoke before the overlay is shown. |
| `onShow` | `output&lt;OverlayOnShowEvent&gt;()` | Callback to invoke when the overlay is shown. |
| `onBeforeHide` | `output&lt;OverlayOnBeforeHideEvent&gt;()` | Callback to invoke before the overlay is hidden. |
| `onHide` | `output&lt;OverlayOnHideEvent&gt;()` | Callback to invoke when the overlay is hidden |
| `onAnimationStart` | `output&lt;AnimationEvent&gt;()` | Callback to invoke when the animation is started. |
| `onAnimationDone` | `output&lt;AnimationEvent&gt;()` | Callback to invoke when the animation is done. |
| `onBeforeEnter` | `output&lt;MotionEvent&gt;()` | Callback to invoke before the overlay enters. |
| `onEnter` | `output&lt;MotionEvent&gt;()` | Callback to invoke when the overlay enters. |
| `onAfterEnter` | `output&lt;MotionEvent&gt;()` | Callback to invoke after the overlay has entered. |
| `onBeforeLeave` | `output&lt;MotionEvent&gt;()` | Callback to invoke before the overlay leaves. |
| `onLeave` | `output&lt;MotionEvent&gt;()` | Callback to invoke when the overlay leaves. |
| `onAfterLeave` | `output&lt;MotionEvent&gt;()` | Callback to invoke after the overlay has left. |

## Source

[`projects/core/overlay`](../../projects/core/overlay)
