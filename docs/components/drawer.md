# Drawer

`hx-drawer` is a panel that slides in from an edge of the screen. It has the same dialog semantics as
[`hx-dialog`](dialog.md) (it is built on the same CDK dialog and the same frame) and the same slots.

```html
<hx-drawer [(visible)]="open" header="Filters" position="right" width="24rem">
  …
  <div hxDialogFooter><button hx-button (click)="open = false">Done</button></div>
</hx-drawer>
```

| Input / output    | Type                                       | Default  | Description                                                    |
| ----------------- | ------------------------------------------ | -------- | -------------------------------------------------------------- |
| `visible`         | `boolean`                                  | `false`  | `[(visible)]`.                                                 |
| `header`          | `string`                                   |          | Title (a heading).                                             |
| `position`        | `'left' \| 'right' \| 'top' \| 'bottom'`   | `'left'` | The edge it slides in from.                                    |
| `modal`           | `boolean`                                  | `true`   | Mask, focus trap, page behind hidden from assistive technology. |
| `dismissable`     | `boolean`                                  | `true`   | A click on the mask closes a modal drawer.                     |
| `closable`, `closeOnEscape` | `boolean`                        | `true`   | The close button; Escape closes it.                            |
| `fullScreen`      | `boolean`                                  | `false`  | Covers the whole screen.                                       |
| `width`, `height` | CSS length                                 | `20rem`  | `width` for left and right, `height` for top and bottom.       |
| `panelClass`, `closeLabel`, `ariaLabel`, `(shown)`, `(hidden)` |               |          | As on `hx-dialog`.                                             |

- **Accessibility:** as for the dialog: `role="dialog"`, `aria-modal` (modal only), labelled by the title, focus to the
  first control, trapped, restored; Escape closes. The slide-in stops under `prefers-reduced-motion`; closing is
  immediate.

## Tokens

The look comes from the design tokens `--h-drawer-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
