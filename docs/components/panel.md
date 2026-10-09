# Panel

`hx-panel` is a titled container that can collapse. The `header` input is the title; `[hxPanelHeader]` adds content next
to it (icons, buttons) and `[hxPanelFooter]` is the footer. Expanding and collapsing is animated unless the user prefers
reduced motion.

```html
<hx-panel header="Filters" toggleable [(collapsed)]="closed">
  <button hxPanelHeader hx-button size="small">Reset</button>
  ...
  <div hxPanelFooter>3 filters active</div>
</hx-panel>
```

| Input       | Type      | Default | Description                                              |
| ----------- | --------- | ------- | -------------------------------------------------------- |
| `header`    | `string`  | `''`    | The title.                                               |
| `toggleable` | `boolean` | `false` | A button in the header collapses and expands the content. |
| `collapsed` | `boolean` (model) | `false` | `[(collapsed)]`; only a toggleable panel collapses. |

- **Accessibility:** the toggle is a native `<button>` named by the title, with `aria-expanded` and `aria-controls`; the
  content is a `role="region"` labelled by the title, and `inert` while collapsed so its controls leave the tab order.

## Tokens

The look comes from the design tokens `--h-panel-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
