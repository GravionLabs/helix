# Galleria

`hx-galleria` is an image gallery: a stage with the current picture, a strip of thumbnails, previous/next buttons,
captions and an optional full-screen mode in a modal overlay.

```html
<hx-galleria [value]="pictures" [(activeIndex)]="index" [numVisible]="5" circular ariaLabel="Product pictures" />
```

```ts
pictures: HxGalleriaItem[] = [
  { src: 'large/1.jpg', thumbnailSrc: 'small/1.jpg', alt: 'Bamboo watch on a desk', title: 'Bamboo Watch', caption: 'Summer collection' },
];
```

Full screen: with `fullScreen` nothing is shown inline; `visible` opens the gallery over the whole screen.

```html
<button hx-button type="button" (click)="open = true">Show pictures</button>
<hx-galleria [value]="pictures" fullScreen [(visible)]="open" circular />
```

## Inputs and outputs

| Name | Type | Default | |
| --- | --- | --- | --- |
| `value` | `HxGalleriaItem[]` | `[]` | `{ src, alt, thumbnailSrc?, title?, caption? }`. |
| `activeIndex` (model) | `number` | `0` | The picture on the stage; `activeIndexChange` is its output. |
| `numVisible` | `number` | `5` | Thumbnails shown at a time; the strip scrolls with its own buttons and follows the active picture. |
| `circular` | `boolean` | `false` | After the last picture comes the first again. |
| `autoplay`, `autoplayInterval` | `boolean`, `number` | `false`, `4000` | Next picture every `autoplayInterval` ms; pauses while the pointer or the focus is inside; off with reduced motion. |
| `showThumbnails`, `showItemNavigators`, `showIndicators` | `boolean` | `true`, `true`, `false` | The strip, the previous/next buttons on the stage, dots on the stage. |
| `thumbnailsPosition` | `'bottom' \| 'top' \| 'left' \| 'right'` | `'bottom'` | Where the strip sits. |
| `fullScreen`, `visible` (model) | `boolean` | `false` | Full-screen mode and whether it is open (`visibleChange`). |
| `height` | `string` | `'24rem'` | CSS height of the stage inline. |
| `ariaLabel`, `prevLabel`, `nextLabel`, `closeLabel`, `itemLabelTemplate` | `string` | English | The labels (`{index}`, `{count}` are replaced). |

Templates: `hxGalleriaItem` (the stage; context `$implicit` item, `index`), `hxGalleriaThumbnail`, `hxGalleriaCaption`.
`goTo(index)`, `next()` and `prev()` are public.

## Accessibility

The stage is a `region` with `aria-roledescription="carousel"` and the `ariaLabel`; the picture is a `group` named
"n of m" that carries its `alt`. The stage is focusable: Arrow keys move between pictures, Home and End go to the
first and the last. The thumbnails (and the indicator dots) are a `tablist` of buttons with `aria-selected` and the
picture's alt as name; the same keys work there and keep the focus on the active thumbnail. Full screen is a modal
dialog: the focus is trapped, Escape and the close button close it, and the focus returns to where it was.

## Tokens

The look comes from the design tokens `--h-galleria-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
