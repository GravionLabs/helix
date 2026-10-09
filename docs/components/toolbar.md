# Toolbar

`hx-toolbar` groups actions in a start, a center and an end area. It wraps on small screens.

```html
<hx-toolbar>
  <button hxToolbarStart hx-button>New</button>
  <span hxToolbarCenter>3 selected</span>
  <button hxToolbarEnd hx-button>Export</button>
</hx-toolbar>
```

Project into `[hxToolbarStart]`, `[hxToolbarCenter]` and `[hxToolbarEnd]`; an area without content takes no space.

- **Accessibility:** a plain group, deliberately without `role="toolbar"`: that role promises a single tab stop and
  arrow-key navigation between the controls, which this component does not implement, so every control keeps its own
  tab stop. Add `role="group"` and an `aria-label` yourself when the group needs a name.

## Tokens

The look comes from the design tokens `--h-toolbar-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
