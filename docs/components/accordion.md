# Accordion

`hx-accordion` stacks panels of which one (or with `multiple` several) is open. It is built on `@angular/cdk/accordion`.
A panel is `hx-accordion-panel` with a `value`, an `hx-accordion-header` and an `hx-accordion-content`.

```html
<hx-accordion [(value)]="open" [headingLevel]="3">
  <hx-accordion-panel value="a">
    <hx-accordion-header>First</hx-accordion-header>
    <hx-accordion-content>Content of the first panel</hx-accordion-content>
  </hx-accordion-panel>
  <hx-accordion-panel value="b" disabled>…</hx-accordion-panel>
</hx-accordion>
```

| Input          | Type                           | Default | Description                                                       |
| -------------- | ------------------------------ | ------- | ----------------------------------------------------------------- |
| `value`        | `string \| string[] \| null`    | `null`  | `[(value)]`: the `value` of the open panel, or the open values with `multiple`. |
| `multiple`     | `boolean`                      | `false` | Panels open independently.                                        |
| `headingLevel` | `number`                       | `3`     | Level of the headings around the header buttons.                  |

A panel takes `value` (required) and `disabled`.

- **Keyboard:** Tab reaches each header; Enter or Space toggles; Arrow Down/Up move to the next or previous header
  (wrapping), Home and End to the first and last. Disabled headers are skipped.
- **Accessibility:** the WAI-ARIA accordion: every header is a `<button>` inside a heading, with `aria-expanded` and
  `aria-controls`; the content is a `role="region"` labelled by its header and `inert` while closed. Motion stops under
  `prefers-reduced-motion`.

## Tokens

The look comes from the design tokens `--h-accordion-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
