# Divider

`hx-divider`: a line between content. Projected content is a label sitting on the line.

```html
<hx-divider />
<hx-divider align="center">OR</hx-divider>
<hx-divider layout="vertical" />
```

| Input    | Type                               | Default        | Description                                  |
| -------- | ---------------------------------- | -------------- | -------------------------------------------- |
| `layout` | `'horizontal' \| 'vertical'`       | `'horizontal'` | Direction of the line.                       |
| `type`   | `'solid' \| 'dashed' \| 'dotted'`  | `'solid'`      | Line style.                                  |
| `align`  | `'start' \| 'center' \| 'end'`     |                | Where the label sits; no effect without one. |

It has `role="separator"` and `aria-orientation`. Margins and colours come from the `--h-divider-*` tokens.

## Tokens

The look comes from the design tokens `--h-divider-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
