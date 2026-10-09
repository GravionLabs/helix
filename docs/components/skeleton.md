# Skeleton

`hx-skeleton` is a placeholder shaped like the content that is still loading.

```html
<div aria-busy="true">
  <hx-skeleton shape="circle" size="4rem" />
  <hx-skeleton width="10rem" height="1rem" />
</div>
```

| Input          | Type                       | Default       | Description                                           |
| -------------- | -------------------------- | ------------- | ----------------------------------------------------- |
| `shape`        | `'rectangle' \| 'circle'`   | `'rectangle'` | A circle is always round.                             |
| `width`        | `string`                   | `'100%'`      | Any CSS length.                                       |
| `height`       | `string`                   | `'1rem'`      | Any CSS length.                                       |
| `size`         | `string`                   |               | Width and height at once; wins over both.             |
| `borderRadius` | `string`                   |               | Replaces the theme radius.                            |
| `animation`    | `'wave' \| 'none'`          | `'wave'`      | The sweeping gradient; off under `prefers-reduced-motion`. |

- **Accessibility:** `aria-hidden="true"`, so a skeleton says nothing by itself. The container of the loading content
  announces the state: `aria-busy="true"` on it, or a visually hidden "Loading…" in a live region.

## Tokens

The look comes from the design tokens `--h-skeleton-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
