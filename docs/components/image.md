# Image

> Displays an image with preview and tranformation options.

## Import

```ts
import { Image } from '@gravionlabs/helix/image';
```

## Components

### Image

Selector: `h-image`

Displays an image with preview and tranformation options. For multiple image, see Galleria.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `imageClass` | `string \| undefined` | — | Style class of the image element. |
| `imageStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the image element. |
| `styleClass` | `string \| undefined` | — | Class of the element. |
| `src` | `string \| SafeUrl \| undefined` | — | The source path for the main image. |
| `srcSet` | `string \| SafeUrl \| undefined` | — | The srcset definition for the main image. |
| `sizes` | `string \| undefined` | — | The sizes definition for the main image. |
| `previewImageSrc` | `string \| SafeUrl \| undefined` | — | The source path for the preview image. |
| `previewImageSrcSet` | `string \| SafeUrl \| undefined` | — | The srcset definition for the preview image. |
| `previewImageSizes` | `string \| undefined` | — | The sizes definition for the preview image. |
| `alt` | `string \| undefined` | — | Attribute of the preview image element. |
| `width` | `string \| undefined` | — | Attribute of the image element. |
| `height` | `string \| undefined` | — | Attribute of the image element. |
| `loading` | `'lazy' \| 'eager' \| undefined` | — | Attribute of the image element. |
| `preview` | `boolean` | `false` | Controls the preview functionality. |
| `showTransitionOptions` | `string` | `'150ms cubic-bezier(0, 0, 0.2, 1)'` | Transition options of the show animation |
| `hideTransitionOptions` | `string` | `'150ms cubic-bezier(0, 0, 0.2, 1)'` | Transition options of the hide animation |
| `modalEnterAnimation` | `string \| null \| undefined` | `'p-modal-enter'` | Enter animation class name of modal. |
| `modalLeaveAnimation` | `string \| null \| undefined` | `'p-modal-leave'` | Leave animation class name of modal. |
| `appendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| 'self' \| 'body' \| null \| undefined \| any` | `undefined` | Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `maskMotionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options for the mask. |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | The motion options. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onShow` | `EventEmitter&lt;any&gt;` | Triggered when the preview overlay is shown. |
| `onHide` | `EventEmitter&lt;any&gt;` | Triggered when the preview overlay is hidden. |
| `onImageError` | `EventEmitter&lt;Event&gt;` | This event is triggered if an error occurs while loading an image file. |

## Source

[`projects/helix/image`](../../projects/helix/image)
