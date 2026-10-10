# Image

`hx-image` shows a picture and, with `preview`, opens it in a modal overlay on a click: a toolbar rotates and zooms
it, Escape or the close button return to the page.

```html
<hx-image src="product.jpg" alt="Bamboo watch" width="250" preview />
<hx-image src="thumb.jpg" previewImageSrc="large.jpg" alt="Bamboo watch" preview>
  <ng-template hxImageIndicator><i class="pi pi-search"></i></ng-template>
</hx-image>
```

## Inputs and outputs

| Name | Type | Default | |
| --- | --- | --- | --- |
| `src`, `alt` | `string` | required | The picture and its text alternative (also the name of the preview button and dialog). |
| `width`, `height` | `string \| number` | — | Size of the inline picture (a number is pixels). |
| `preview` | `boolean` | `false` | A button over the picture opens the overlay; a mask and an eye show on hover and focus. |
| `previewImageSrc` | `string` | `src` | A larger picture for the overlay. |
| `imageClass`, `imageStyle` | `string`, `object` | — | Class and style of the inline `img`. |
| `showToolbar` | `boolean` | `true` | Rotate left/right, zoom out/in and close; without it only the close button. |
| `zoomStep`, `zoomMin`, `zoomMax` | `number` | `0.25`, `0.5`, `3` | The zoom scale. |
| `previewLabelTemplate`, `rotateLeftLabel`, `rotateRightLabel`, `zoomOutLabel`, `zoomInLabel`, `closeLabel` | `string` | English | The labels (`{alt}` is replaced). |
| `show`, `hide` | `void` | | The preview opened / closed. |

Template `hxImageIndicator` replaces the eye in the hover indicator. `open()` and `close()` are public.

## Accessibility

The preview trigger is a button named "Preview {alt}" over the picture (visible on focus). The overlay is a modal
`dialog` named by the `alt`: the focus is trapped, the toolbar buttons are labelled, + and - zoom, Escape and the
close button close it, and the focus returns to the trigger. The picture keeps its `alt` in the overlay.

## Tokens

The look comes from the design tokens `--h-image-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
