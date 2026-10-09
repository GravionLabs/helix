# Split button

`hx-split-button` is a default action with a menu of related actions: a button and, joined to it, a button that opens an
[`hx-menu`](menu.md).

```html
<hx-split-button label="Save" icon="pi pi-save" [model]="items" (click)="save()" (triggered)="onPick($event)" />
```

| Input / output     | Type                                     | Default           | Description                                              |
| ------------------ | ---------------------------------------- | ----------------- | -------------------------------------------------------- |
| `label`            | `string`                                 |                   | Text of the main button.                                 |
| `icon`             | `string`                                 |                   | Icon font classes for the main button.                   |
| `model`            | `HxMenuItem[]`                           | `[]`              | The related actions.                                     |
| `variant`          | `'filled' \| 'outlined' \| 'text' \| 'link'` | `'filled'`        | As on `hx-button`.                                       |
| `severity`         | `HxButtonSeverity`                       | `'primary'`       | As on `hx-button`.                                       |
| `size`             | `'small' \| 'medium' \| 'large'`          | `'medium'`        | As on `hx-button`.                                       |
| `rounded`, `raised`, `disabled` | `boolean`                   | `false`           | Pill shape, elevation shadow, disables both buttons.     |
| `menuButtonLabel`  | `string`                                 | `'More actions'`  | Name of the menu button.                                 |
| `(triggered)`      | `HxMenuItem`                             |                   | An item was activated (after its `command`).             |

`(click)` is the native click of the main button; clicks on the menu button do not reach it.

- **Accessibility:** a `role="group"` named by `label`, with two buttons; the menu button has `aria-haspopup="menu"`
  and `aria-expanded`, and the menu moves the focus back to it when it closes. See [Menu](menu.md) for the keyboard.

## Tokens

The look comes from the design tokens `--h-splitbutton-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
