# Progress

`hx-progress-bar` fills from 0 to 100 or slides while the duration is unknown; `hx-progress-spinner` is a spinning
ring.

```html
<hx-progress-bar [value]="progress()" ariaLabel="Upload" />
<hx-progress-bar mode="indeterminate" ariaLabel="Loading" />
<hx-progress-spinner ariaLabel="Saving" />
```

| Component  | Input               | Type                              | Default         | Description                                   |
| ---------- | ------------------- | --------------------------------- | --------------- | --------------------------------------------- |
| bar        | `value`             | `number`                          | `0`             | 0 to 100, clamped.                            |
| bar        | `mode`              | `'determinate' \| 'indeterminate'` | `'determinate'` | Indeterminate slides and has no value.        |
| bar        | `showValue`, `unit` | `boolean`, `string`               | `true`, `'%'`   | The value text inside the bar.                |
| bar        | `ariaLabel`         | `string`                          |                 | Accessible name.                              |
| spinner    | `strokeWidth`       | `string`                          | `'2'`           | Ring width in the drawing.                    |
| spinner    | `animationDuration` | `string`                          | `'2s'`          | CSS time of one turn.                         |
| spinner    | `ariaLabel`         | `string`                          | `'Loading'`     | Accessible name.                              |

- **Accessibility:** `role="progressbar"` with `aria-valuemin`/`aria-valuemax` and, when determinate, `aria-valuenow`;
  the spinner and an indeterminate bar leave `aria-valuenow` out. Name every bar. Motion stops under
  `prefers-reduced-motion`.

## Tokens

The look comes from the design tokens `--h-progressbar-*`, `--h-progressspinner-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
