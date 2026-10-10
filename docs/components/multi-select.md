# Multi select

`hx-multi-select` is a select for several values: a `combobox` that opens a multi-select listbox in an overlay. The
value is an array of option values. Options, `optionLabel`, `optionValue`, `optionDisabled`, `compareWith`, `size`,
`variant`, `fluid`, `placeholder`, `emptyMessage`, `inputId` and `showClear` work as in the Select. The panel stays
open while choosing; Escape and a click outside close it. It works with `ngModel`, reactive forms (including
`disable()`) and signal forms.

```html
<label for="cities">Cities</label>
<hx-multi-select inputId="cities" [options]="cities" optionLabel="name" optionValue="code"
                 display="chip" filter showToggleAll [(ngModel)]="visited" />
```

| Input                | Type                | Default                | Description                                             |
| -------------------- | ------------------- | ---------------------- | ------------------------------------------------------- |
| `display`            | `'comma' \| 'chip'` | `'comma'`              | Labels in a line, or a removable chip per value.        |
| `maxSelectedLabels`  | `number`            | `3`                    | More values show `selectedItemsLabel` instead.          |
| `selectedItemsLabel` | `string`            | `'{0} items selected'` | Summary text; `{0}` is the count.                       |
| `filter`             | `boolean`           | `false`                | A search field above the list (`filterPlaceholder`).    |
| `showToggleAll`      | `boolean`           | `false`                | A checkbox that selects or clears all visible, enabled options (`toggleAllLabel`). |

- **Keyboard:** Arrow Down/Up, Enter or Space on the trigger open the panel; in the list the arrows, Home, End and
  typeahead move and Enter or Space toggle an option; Escape closes the panel and returns focus to the trigger; Tab out
  of the panel closes it. The chips' remove buttons are for the pointer; deselect with the keyboard in the list.
- **Accessibility:** the trigger is a `combobox` with `aria-expanded` and `aria-controls`, the list a
  `listbox` with `aria-multiselectable="true"`; the select-all checkbox and the filter field have accessible names.
  Give the field a visible label or `ariaLabel`.

## Tokens

The look comes from the design tokens `--h-multiselect-*`, `--h-inputtext-*`, `--h-checkbox-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
