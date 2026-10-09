# Password

`hx-password` is a password field with an optional button that shows or hides the text. It works with `ngModel`,
reactive forms and signal forms, like the Select.

```html
<label for="pw">Password</label>
<hx-password inputId="pw" [(ngModel)]="password" toggleMask fluid />
```

| Input                    | Type      | Default              | Description                                   |
| ------------------------ | --------- | -------------------- | --------------------------------------------- |
| `toggleMask`             | `boolean` | `false`              | The show/hide button (`aria-pressed`).        |
| `inputId`                | `string`  |                      | Id of the field, for `<label for>`.           |
| `placeholder`            | `string`  |                      | A hint, not a label.                          |
| `autocomplete`           | `string`  | `'current-password'` | Use `new-password` when choosing one.         |
| `variant`, `size`, `fluid` |         | as `hx-input`        | Same look as the text field.                  |
| `showLabel`, `hideLabel` | `string`  | English              | Accessible names of the toggle, to translate. |

There is no strength meter yet.

## Tokens

The look comes from the design tokens `--h-password-*`, `--h-inputtext-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
