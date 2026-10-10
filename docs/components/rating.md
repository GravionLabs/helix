# Rating

`hx-rating` is a star rating. Each star is a visually hidden `input type="radio"` labelled "n stars", so the arrow
keys change the value. It works with `ngModel`, reactive forms (including `disable()`) and signal forms. The value
is a `number | null` (`null` until a star is chosen). The stars are drawn with the internal icons and the
`--h-rating-*` tokens.

```html
<hx-rating ariaLabel="Quality" [(ngModel)]="score" />
<hx-rating readonly [stars]="10" [value]="7" />
```

| Input                       | Type      | Default    | Description                                  |
| --------------------------- | --------- | ---------- | -------------------------------------------- |
| `stars`                     | `number`  | `5`        | Number of stars.                             |
| `readonly`                  | `boolean` | `false`    | Shows the value; no way to change it.        |
| `ariaLabel`, `ariaLabelledby` | `string` | `'Rating'` | Name of the group.                           |

- **Behaviour:** hovering previews the value (the hovered star and all before it). The stars up to the value are filled.
- **Accessibility:** `role="radiogroup"` with a radio per star named "1 star", "2 stars", …; Arrow keys move and
  choose, Tab enters and leaves the group. With `readonly` the rating is `role="img"` with the label "3 of 5 stars".

## Tokens

The look comes from the design tokens `--h-rating-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
