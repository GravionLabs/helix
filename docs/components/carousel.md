# Carousel

`hx-carousel` slides over a list of items: `numVisible` at a time, moved by `numScroll` with the previous/next
buttons, the page indicators or the arrow keys. It can be `circular`, play by itself and change its counts per
viewport width.

```html
<hx-carousel [value]="products" [numVisible]="3" [numScroll]="1" [responsiveOptions]="responsive" circular [(page)]="page" ariaLabel="Products">
  <ng-template hxCarouselItem let-product let-index="index">
    <img [src]="product.image" [alt]="product.name" />
    {{ product.name }}
  </ng-template>
</hx-carousel>
```

```ts
responsive: HxCarouselResponsiveOption[] = [
  { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
  { breakpoint: '640px', numVisible: 1, numScroll: 1 },
];
```

Content marked `hxCarouselHeader` / `hxCarouselFooter` is shown above / below the items.

## Inputs and outputs

| Name | Type | Default | |
| --- | --- | --- | --- |
| `value` | `T[]` | `[]` | The items. |
| `numVisible`, `numScroll` | `number` | `1`, `1` | Items shown at a time, items moved per page. The last page is pulled back so it is full. |
| `responsiveOptions` | `{ breakpoint, numVisible, numScroll }[]` | — | Counts for viewports up to `breakpoint` (a max-width); the smallest matching breakpoint wins. |
| `circular` | `boolean` | `false` | After the last page comes the first again (and the buttons never disable). |
| `autoplayInterval` | `number` | `0` | Milliseconds between automatic page changes; off when 0. Pauses while the pointer or the focus is inside; off when the user prefers reduced motion. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Vertical slides inside `verticalViewPortHeight` (`'300px'`). |
| `showIndicators`, `showNavigators` | `boolean` | `true` | The page indicators below, the previous/next buttons beside the items. |
| `page` (model) | `number` | `0` | The current page (0-based); `pageChange` is its output. |
| `ariaLabel`, `prevLabel`, `nextLabel`, `pageLabelTemplate`, `itemLabelTemplate` | `string` | English | The labels (`{page}`, `{pageCount}`, `{index}`, `{count}` are replaced). |

`goTo(page)`, `next()` and `prev()` are public for a template reference.

## Accessibility

The carousel is a `region` with `aria-roledescription="carousel"` and the `ariaLabel`. Every item is a `group` with
`aria-roledescription="slide"` and the label "n of m"; items outside the viewport are `aria-hidden` and `inert`, so
they are neither read nor reachable with Tab. The viewport is focusable: Arrow keys (Up/Down when vertical) move a
page, Home and End go to the first and the last. The indicators are a `tablist` of buttons with `aria-selected`; the
same keys work there and keep the focus on the current indicator. While autoplay runs the region is `aria-live="off"`,
otherwise `polite`.

## Tokens

The look comes from the design tokens `--h-carousel-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
