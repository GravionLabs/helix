# Galleria

> Galleria is an advanced content gallery component.

## Import

```ts
import { Galleria, GalleriaContent, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails } from '@helix-ui/core/galleria';
```

## Components

### Galleria

Selector: `h-galleria`

Galleria is an advanced content gallery component.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `activeIndex` | `number` | `0` | Index of the first item. |
| `fullScreen` | `boolean` | `false` | Whether to display the component on fullscreen. |
| `id` | `string \| undefined` | — | Unique identifier of the element. |
| `value` | `any[] \| undefined` | — | An array of objects to display. |
| `numVisible` | `number` | `3` | Number of items per page. |
| `responsiveOptions` | `GalleriaResponsiveOptions[] \| undefined` | — | An array of options for responsive design. |
| `showItemNavigators` | `boolean` | `false` | Whether to display navigation buttons in item section. |
| `showThumbnailNavigators` | `boolean` | `true` | Whether to display navigation buttons in thumbnail container. |
| `showItemNavigatorsOnHover` | `boolean` | `false` | Whether to display navigation buttons on item hover. |
| `changeItemOnIndicatorHover` | `boolean` | `false` | When enabled, item is changed on indicator hover. |
| `circular` | `boolean` | `false` | Defines if scrolling would be infinite. |
| `autoPlay` | `boolean` | `false` | Items are displayed with a slideshow in autoPlay mode. |
| `shouldStopAutoplayByClick` | `boolean` | `true` | When enabled, autorun should stop by click. |
| `transitionInterval` | `number` | `4000` | Time in milliseconds to scroll items. |
| `showThumbnails` | `boolean` | `true` | Whether to display thumbnail container. |
| `thumbnailsPosition` | `"left" \| "right" \| "top" \| "bottom" \| undefined` | `'bottom'` | Position of thumbnails. |
| `verticalThumbnailViewPortHeight` | `string` | `'300px'` | Height of the viewport in vertical thumbnail. |
| `showIndicators` | `boolean` | `false` | Whether to display indicator container. |
| `showIndicatorsOnItem` | `boolean` | `false` | When enabled, indicator container is displayed on item container. |
| `indicatorsPosition` | `"left" \| "right" \| "top" \| "bottom" \| undefined` | `'bottom'` | Position of indicators. |
| `baseZIndex` | `number` | `0` | Base zIndex value to use in layering. |
| `maskClass` | `string \| undefined` | — | Style class of the mask on fullscreen mode. |
| `containerClass` | `string \| undefined` | — | Style class of the component on fullscreen mode. Otherwise, the 'class' property can be used. |
| `containerStyle` | `{ [klass: string]: any; } \| null \| undefined` | — | Inline style of the component on fullscreen mode. Otherwise, the 'style' property can be used. |
| `showTransitionOptions` | `string` | `'150ms cubic-bezier(0, 0, 0.2, 1)'` | Transition options of the show animation. |
| `hideTransitionOptions` | `string` | `'150ms cubic-bezier(0, 0, 0.2, 1)'` | Transition options of the hide animation. |
| `motionOptions` | `MotionOptions \| undefined` | — | The motion options. |
| `maskMotionOptions` | `MotionOptions \| undefined` | — | The mask motion options. |
| `visible` | `boolean` | `false` | Specifies the visibility of the mask on fullscreen mode. |

### GalleriaContent

Selector: `div[hGalleriaContent]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `activeIndex` | `number` | `0` | — |
| `value` | `any[]` | `[]` | — |
| `numVisible` | `number \| undefined` | — | — |
| `fullScreen` | `boolean` | `false` | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `maskHide` | `output&lt;void&gt;()` | — |
| `activeItemChange` | `output&lt;number&gt;()` | — |

### GalleriaItemSlot

Selector: `div[hGalleriaItemSlot]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `templates` | `readonly HelixTemplate[] \| undefined` | — | — |
| `index` | `number \| undefined` | — | — |
| `item` | `any` | — | — |
| `type` | `string \| undefined` | — | — |

### GalleriaItem

Selector: `div[hGalleriaItem]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string \| undefined` | — | — |
| `circular` | `boolean` | `false` | — |
| `value` | `any[] \| undefined` | — | — |
| `showItemNavigators` | `boolean` | `false` | — |
| `showIndicators` | `boolean` | `true` | — |
| `slideShowActive` | `boolean` | `true` | — |
| `changeItemOnIndicatorHover` | `boolean` | `true` | — |
| `autoPlay` | `boolean` | `false` | — |
| `templates` | `readonly HelixTemplate[] \| undefined` | — | — |
| `indicatorFacet` | `any` | — | — |
| `captionFacet` | `any` | — | — |
| `activeIndex` | `number` | `0` | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `startSlideShow` | `output&lt;void&gt;()` | — |
| `stopSlideShow` | `output&lt;void&gt;()` | — |
| `onActiveIndexChange` | `output&lt;number&gt;()` | — |

### GalleriaThumbnails

Selector: `div[hGalleriaThumbnails]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `containerId` | `string \| undefined` | — | — |
| `value` | `any[] \| undefined` | — | — |
| `isVertical` | `boolean` | `false` | — |
| `slideShowActive` | `boolean` | `false` | — |
| `circular` | `boolean` | `false` | — |
| `responsiveOptions` | `GalleriaResponsiveOptions[] \| undefined` | — | — |
| `contentHeight` | `string` | `'300px'` | — |
| `showThumbnailNavigators` | `boolean` | `true` | — |
| `templates` | `readonly HelixTemplate[] \| undefined` | — | — |
| `numVisible` | `number` | `0` | — |
| `activeIndex` | `number` | `0` | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onActiveIndexChange` | `output&lt;number&gt;()` | — |
| `stopSlideShow` | `output&lt;void&gt;()` | — |

## Source

[`projects/core/galleria`](../../projects/core/galleria)
