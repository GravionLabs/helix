# Toggle button

`hx-toggle-button` is a two-state button with its own labels, the look of one Select button segment. The value is
a `boolean`; it works with `ngModel`, reactive forms (including `disable()`) and signal forms (`[formField]`), or
`[(value)]` without forms.

```html
<hx-toggle-button onLabel="Subscribed" offLabel="Subscribe" onIcon="pi pi-check" [(ngModel)]="subscribed" />
<hx-toggle-button ariaLabel="Bold" onLabel="" offLabel="" onIcon="pi pi-bold" offIcon="pi pi-bold" [(value)]="bold" />
```

| Input                          | Type                             | Default    | Description                                        |
| ------------------------------ | -------------------------------- | ---------- | -------------------------------------------------- |
| `onLabel`, `offLabel`          | `string`                         | `Yes`, `No` | Text per state; empty for an icon-only button.     |
| `onIcon`, `offIcon`            | `string`                         | `''`       | Icon classes per state, for example `pi pi-check`. |
| `size`                         | `'small' \| 'medium' \| 'large'` | `'medium'` | Font size and padding.                             |
| `fluid`                        | `boolean`                        | `false`    | Full width of the container.                       |
| `inputId`, `ariaLabel`, `ariaLabelledby` | `string`               |            | `id` of the button, and its accessible name.       |

- **Accessibility:** a native `<button>` with `aria-pressed`; Enter and Space toggle it and the focus ring shows
  on keyboard focus. Icons are `aria-hidden`; an icon-only toggle needs `ariaLabel`. When the labels differ per
  state, an `ariaLabel` keeps the name stable, since `aria-pressed` already announces the state.

## Tokens

The look comes from the design tokens `--h-togglebutton-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
