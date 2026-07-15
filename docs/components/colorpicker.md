# ColorPicker

> ColorPicker groups a collection of contents in tabs.

## Import

```ts
import { ColorPicker } from '@gravionlabs/helix/colorpicker';
```

## Components

### ColorPicker

Selector: `h-colorPicker, h-colorpicker, h-color-picker`

ColorPicker groups a collection of contents in tabs.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `showTransitionOptions` | `string` | `'.12s cubic-bezier(0, 0, 0.2, 1)'` | Transition options of the show animation. |
| `hideTransitionOptions` | `string` | `'.1s linear'` | Transition options of the hide animation. |
| `inline` | `boolean \| undefined` | — | Whether to display as an overlay or not. |
| `format` | `'hex' \| 'rgb' \| 'hsb'` | `'hex'` | Format to use in value binding. |
| `tabindex` | `string \| undefined` | — | Index of the element in tabbing order. |
| `inputId` | `string \| undefined` | — | Identifier of the focus input to match a label defined for the dropdown. |
| `autoZIndex` | `boolean` | `true` | Whether to automatically manage layering. |
| `autofocus` | `boolean \| undefined` | — | When present, it specifies that the component should automatically get focus on load. |
| `defaultColor` | `string \| undefined` | `'ff0000'` | Default color to display initially when model value is not present. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `undefined` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `overlayOptions` | `OverlayOptions \| undefined` | `undefined` | Whether to use overlay API feature. The properties of overlay API can be used like an object in it. |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onChange` | `EventEmitter&lt;ColorPickerChangeEvent&gt;` | Callback to invoke on value change. |
| `onShow` | `EventEmitter&lt;any&gt;` | Callback to invoke on panel is shown. |
| `onHide` | `EventEmitter&lt;any&gt;` | Callback to invoke on panel is hidden. |

## Source

[`projects/helix/colorpicker`](../../projects/helix/colorpicker)
