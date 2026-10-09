# Icon field

`hx-icon-field` puts an icon inside a text field. Wrap an `hx-input` (or `hx-password`) and one element with
`hx-input-icon`: an icon font class such as `<i class="pi pi-search">` or an inline `<svg>`.

```html
<hx-icon-field>
  <i class="pi pi-search" hx-input-icon></i>
  <input hx-input placeholder="Search" aria-label="Search" />
</hx-icon-field>
```

| Input          | Type                 | Default  | Description                                                   |
| -------------- | -------------------- | -------- | ------------------------------------------------------------- |
| `iconPosition` | `'left' \| 'right'`  | `'left'` | Start or end edge (follows the writing direction).            |

- **Behaviour:** the icon is centred vertically, does not catch clicks, and the field gets inline padding for it;
  the `small` and `large` sizes of the input are followed. Colour: `--h-iconfield-icon-color`.
- **Accessibility:** the icon is decorative and gets `aria-hidden="true"` unless it has an `aria-label`. The
  field still needs its own label.

## Tokens

The look comes from the design tokens `--h-iconfield-*`, `--h-inputtext-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
