# Button group

`hx-button-group` joins the `hx-button`s inside it into one control: the inner corners are square and neighbouring
borders overlap instead of doubling. It reads the tokens of the button.

```html
<hx-button-group ariaLabel="Text alignment">
  <button hx-button variant="outlined">Left</button>
  <button hx-button variant="outlined">Center</button>
  <button hx-button variant="outlined">Right</button>
</hx-button-group>
```

- **Accessibility:** `role="group"`; give it `ariaLabel` when the buttons only make sense together. For a choice that
  stays selected use `hx-select-button` or `hx-toggle-button`, not a group of plain buttons.

## Tokens

The look comes from the design tokens `--h-button-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
