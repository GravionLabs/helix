# Input number

`hx-input-number` is a numeric field with locale formatting and optional step buttons. The value is a
`number | null`. The text is formatted with `Intl.NumberFormat` when the field loses focus and parsed in the same
locale while the user types. It works with `ngModel`, reactive forms and signal forms, like the Select.

```html
<label for="qty">Quantity</label>
<hx-input-number inputId="qty" [(ngModel)]="qty" [min]="0" [max]="99" showButtons />
<hx-input-number ariaLabel="Price" mode="currency" currency="EUR" locale="de-DE" [formField]="form.price" />
```

| Input                                  | Type                        | Default      | Description                                                         |
| -------------------------------------- | --------------------------- | ------------ | ------------------------------------------------------------------- |
| `min`, `max`                           | `number`                    |              | Limits; typed and stepped values are clamped to them.               |
| `step`                                 | `number`                    | `1`          | Size of a step (arrows and buttons).                                |
| `minFractionDigits`, `maxFractionDigits` | `number`                  | locale       | Fraction digits shown; values are rounded to `maxFractionDigits`.   |
| `locale`                               | `string`                    | browser      | BCP 47 tag used to format and parse.                                |
| `useGrouping`                          | `boolean`                   | `true`       | Thousands separators.                                               |
| `mode`                                 | `'decimal' \| 'currency'`   | `'decimal'`  | `currency` needs `currency` (ISO 4217, default `USD`).              |
| `prefix`, `suffix`                     | `string`                    |              | Text around the number, ignored when parsing.                       |
| `showButtons`                          | `boolean`                   | `false`      | Increment and decrement buttons.                                    |
| `buttonLayout`                         | `'stacked' \| 'horizontal'` | `'stacked'`  | One column on the end edge, or minus and plus on both sides.        |
| `incrementLabel`, `decrementLabel`     | `string`                    | English      | Accessible names of the buttons, to translate.                      |
| `inputId`, `ariaLabel`, `ariaLabelledby` | `string`                  |              | Id for `<label for>`, or the accessible name.                       |
| `placeholder`                          | `string`                    |              | A hint, not a label.                                                |
| `variant`, `size`, `fluid`             |                             | as `hx-input` | Same look as the text field.                                       |

- **Behaviour:** the value follows what is typed (clamped), the text is reformatted on blur or Enter. Text that is
  not a number leaves the value as it was. Arrow Up/Down step, Home/End jump to `min`/`max` when they are set.
  A step button repeats while it is held and stops at the limit. Steps are rounded to `maxFractionDigits`: set it
  to match a `step` finer than three decimals.
- **Forms:** works with `ngModel`, reactive forms (`disable()` included) and signal forms (`[formField]`);
  `[(value)]` binds it without forms.
- **Accessibility:** the field is a `spinbutton` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and the
  formatted text as `aria-valuetext`. The step buttons have an `aria-label` and `tabindex="-1"`: keyboard users
  use the arrow keys. Give it a visible label or `ariaLabel`.

## Tokens

The look comes from the design tokens `--h-inputnumber-*`, `--h-inputtext-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
