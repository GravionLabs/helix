# Tag

`hx-tag` is a label for a category or a status. The text is the `value` or the projected content.

```html
<hx-tag value="New" severity="success" />
<hx-tag severity="warn" rounded icon="pi pi-exclamation-triangle">Pending</hx-tag>
```

| Input      | Type                                                                          | Default     | Description                                |
| ---------- | ----------------------------------------------------------------------------- | ----------- | ------------------------------------------ |
| `value`    | `string \| number \| null`                                                     | `null`      | The text (or project content instead).     |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'danger' \| 'contrast'` | `'primary'` | The colours.                               |
| `rounded`  | `boolean`                                                                     | `false`     | A pill instead of the small radius.        |
| `icon`     | `string`                                                                      |             | Icon font classes, drawn before the text.  |

- **Accessibility:** plain text with no role; the icon is `aria-hidden`. The colour is not the only carrier of the
  meaning, the text says it too.

## Tokens

The look comes from the design tokens `--h-tag-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
