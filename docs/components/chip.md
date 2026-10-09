# Chip

`hx-chip` is a compact element for an entity, optionally removable.

```html
<hx-chip label="Amy Elsner" image="/amy.png" />
<hx-chip label="Angular" icon="pi pi-code" removable (remove)="drop('Angular')" />
```

| Input / output | Type      | Default    | Description                                                              |
| -------------- | --------- | ---------- | ------------------------------------------------------------------------ |
| `label`        | `string`  |            | The text (or project content instead).                                   |
| `icon`         | `string`  |            | Icon font classes; not shown when there is an `image`.                   |
| `image`        | `string`  |            | Picture before the label.                                                |
| `imageAlt`     | `string`  | `''`       | Alternative text; decorative by default because the label names the chip. |
| `removable`    | `boolean` | `false`    | Shows the remove button and makes the chip focusable.                    |
| `removeLabel`  | `string`  | `'Remove'` | Name of the remove button.                                               |
| `(remove)`     | `void`    |            | Remove pressed, or Backspace/Delete on the chip.                         |

The chip does not remove itself: drop it from your data in `(remove)`.

- **Accessibility:** a removable chip is a focusable `role="group"` named by its label; the remove control is a real
  `<button>` with `aria-label`. After a removal the focus is lost with the chip, so move it yourself if the list
  continues (e.g. to the next chip).

## Tokens

The look comes from the design tokens `--h-chip-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
