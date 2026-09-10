# Carousel

> Carousel is a content slider featuring various customization options.

## Import

```ts
import { Carousel } from '@helix-ui/core/carousel';
```

## Components

### Carousel

Selector: `h-carousel`

Carousel is a content slider featuring various customization options.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `number` | `0` | Index of the first item. |
| `numVisible` | `number` | `1` | Number of items per page. |
| `numScroll` | `number` | `1` | Number of items to scroll. |
| `responsiveOptions` | `CarouselResponsiveOptions[] \| undefined` | — | An array of options for responsive design. |
| `orientation` | `"horizontal" \| "vertical"` | `'horizontal'` | Specifies the layout of the component. |
| `verticalViewPortHeight` | `string` | `'300px'` | Height of the viewport in vertical layout. |
| `contentClass` | `string` | `''` | Style class of main content. |
| `indicatorsContentClass` | `string` | `''` | Style class of the indicator items. |
| `indicatorsContentStyle` | `{ [klass: string]: any; } \| null \| undefined` | — | Inline style of the indicator items. |
| `indicatorStyleClass` | `string` | `''` | Style class of the indicators. |
| `indicatorStyle` | `{ [klass: string]: any; } \| null \| undefined` | — | Style of the indicators. |
| `value` | `any[]` | `undefined!` | An array of objects to display. |
| `circular` | `boolean` | `false` | Defines if scrolling would be infinite. |
| `showIndicators` | `boolean` | `true` | Whether to display indicator container. |
| `showNavigators` | `boolean` | `true` | Whether to display navigation buttons in container. |
| `autoplayInterval` | `number` | `0` | Time in milliseconds to scroll items automatically. |
| `styleClass` | `string \| undefined` | — | Style class of the viewport container. |
| `prevButtonProps` | `ButtonProps` | `{
    severity: 'secondary',
    text: true,
    rounded: true
}` | Used to pass all properties of the ButtonProps to the Button component. |
| `nextButtonProps` | `ButtonProps` | `{
    severity: 'secondary',
    text: true,
    rounded: true
}` | Used to pass all properties of the ButtonProps to the Button component. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onPage` | `output&lt;CarouselPageEvent&gt;()` | Callback to invoke after scroll. |

## Source

[`projects/core/carousel`](../../projects/core/carousel)
