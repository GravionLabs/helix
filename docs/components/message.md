# Message

`hx-message` is an inline message next to the content it is about.

```html
<hx-message severity="error" closable (close)="onClose()">The card was declined.</hx-message>
<hx-message severity="info" variant="outlined" icon="pi pi-star" [life]="5000">Saved</hx-message>
```

| Input        | Type                                                          | Default    | Description                                       |
| ------------ | ------------------------------------------------------------- | ---------- | ------------------------------------------------- |
| `severity`   | `'success' \| 'info' \| 'warn' \| 'error' \| 'secondary' \| 'contrast'` | `'info'`   | Colours and built-in icon.                        |
| `variant`    | `'filled' \| 'outlined' \| 'simple'`                          | `'filled'` | Tinted box, outline only, or text only.           |
| `size`       | `'small' \| 'medium' \| 'large'`                              | `'medium'` | Padding, text and icon size.                      |
| `icon`       | `string`                                                      | `''`       | Icon classes (any icon font) instead of the built-in icon. |
| `closable`   | `boolean`                                                     | `false`    | A close button (`closeLabel`, default `Close`).   |
| `life`       | `number`                                                      | `0`        | Milliseconds until the message hides itself.      |

`(close)` fires when the button or `life` hides the message.

- **Accessibility:** the message is a live region: `role="status"`, and `role="alert"` for `error`. The built-in icon
  is `aria-hidden`; the close button has an accessible name. Do not rely on the colour alone: say what happened in the text.

## Tokens

The look comes from the design tokens `--h-message-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
