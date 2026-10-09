# Fieldset

`hx-fieldset` is a native `<fieldset>` with a `<legend>` that groups related controls and can collapse.

```html
<hx-fieldset legend="Shipping address" toggleable [(collapsed)]="closed">
  <label for="street">Street</label> <input hx-input id="street" />
</hx-fieldset>
```

| Input       | Type              | Default | Description                                              |
| ----------- | ----------------- | ------- | -------------------------------------------------------- |
| `legend`    | `string`          | `''`    | The legend text.                                         |
| `toggleable` | `boolean`        | `false` | The legend holds a button that collapses the content.    |
| `collapsed` | `boolean` (model) | `false` | `[(collapsed)]`; only a toggleable fieldset collapses.   |

- **Accessibility:** it is a real fieldset and legend, so the group name is announced for the controls inside. When
  toggleable, the legend contains a `<button>` with `aria-expanded` and `aria-controls`; the content is `inert` while
  collapsed so its controls leave the tab order. Motion stops under `prefers-reduced-motion`.

## Tokens

The look comes from the design tokens `--h-fieldset-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
