# Slider

`hx-slider` chooses a number, or with `range` a pair, on a track. It is built on native `<input type="range">`
elements (one, or two for a range), so the keyboard and screen readers work natively; the track and thumbs are drawn
with the `--h-slider-*` tokens. It works with `ngModel`, reactive forms (including `disable()`) and signal forms.

```html
<hx-slider ariaLabel="Volume" [(ngModel)]="volume" />
<hx-slider range ariaLabelStart="Minimum price" ariaLabelEnd="Maximum price" [min]="0" [max]="500" [(value)]="price" />
<hx-slider orientation="vertical" ariaLabel="Gain" [(value)]="gain" />
```

| Input                                   | Type                         | Default        | Description                                        |
| --------------------------------------- | ---------------------------- | -------------- | -------------------------------------------------- |
| `range`                                 | `boolean`                    | `false`        | Two thumbs; the value is `[start, end]`.           |
| `min`, `max`, `step`                    | `number`                     | `0`, `100`, `1` | Bounds and step.                                  |
| `orientation`                           | `'horizontal' \| 'vertical'` | `'horizontal'` | A vertical slider has its minimum at the bottom.   |
| `inputId`, `ariaLabel`, `ariaLabelledby` | `string`                    |                | `id` and name of the thumb of a single slider.     |
| `ariaLabelStart`, `ariaLabelEnd`        | `string`                     |                | Names of the two thumbs of a range.                |

- **Behaviour:** in a range the start thumb never passes the end thumb. Only the thumbs take the pointer in a
  range.
- **Keyboard:** the native range keys: arrows, Page Up/Down, Home, End.
- **Accessibility:** every thumb is an `input type="range"` with `aria-orientation`; give it a name with
  `ariaLabel` (`ariaLabelStart` and `ariaLabelEnd` for a range) or a `<label for>` with `inputId`.

## Tokens

The look comes from the design tokens `--h-slider-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
