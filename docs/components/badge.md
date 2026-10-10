# Badge

`hx-badge` is a small count or status marker; without a `value` it is a dot. `hx-overlay-badge` puts one on the top
right corner of the element it wraps.

```html
<hx-badge value="4" severity="danger" />
<hx-overlay-badge value="2" severity="danger">
  <button hx-button iconOnly aria-label="Notifications, 2 new"><span class="pi pi-bell hx-button-icon"></span></button>
</hx-overlay-badge>
```

| Input      | Type                                                                          | Default     | Description                           |
| ---------- | ----------------------------------------------------------------------------- | ----------- | ------------------------------------- |
| `value`    | `string \| number \| null`                                                     | `null`      | The text; empty makes a dot.          |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'danger' \| 'contrast'` | `'primary'` | The colours.                          |
| `size`     | `'small' \| 'medium' \| 'large' \| 'xlarge'`                                    | `'medium'`  | Height and font size.                 |

The overlay badge takes the same three inputs.

- **Accessibility:** the value is plain text, so it is read where it sits. A dot has no text: where it is the only sign
  of a status, say the status in text or in the name of the element it belongs to. An icon-only element under an
  overlay badge needs its own accessible name; include the count in it (`aria-label="Notifications, 2 new"`).

## Tokens

The look comes from the design tokens `--h-badge-*`, `--h-overlaybadge-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
