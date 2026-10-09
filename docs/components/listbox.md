# Listbox

`hx-listbox` is an inline list of options, single or `multiple`, on the CDK listbox. Options, `optionLabel`,
`optionValue`, `optionDisabled` and `compareWith` work as in the Select. The value is the option's value, or an array
of values with `multiple`. It works with `ngModel`, reactive forms (including `disable()`) and signal forms.

```html
<hx-listbox ariaLabel="City" [options]="cities" optionLabel="name" optionValue="code" [(ngModel)]="city" />
<hx-listbox ariaLabel="Toppings" [options]="toppings" multiple checkmark filter scrollHeight="12rem" [(value)]="chosen" />
```

| Input               | Type      | Default       | Description                                             |
| ------------------- | --------- | ------------- | ------------------------------------------------------- |
| `multiple`          | `boolean` | `false`       | Several options can be chosen; the value is an array.   |
| `checkmark`         | `boolean` | `false`       | A check in front of the selected options.               |
| `filter`            | `boolean` | `false`       | A text field above the list narrows the options by label. |
| `filterPlaceholder` | `string`  | `'Filter'`    | Placeholder and accessible name of the filter field.    |
| `emptyMessage`      | `string`  | `'No options'` | Shown when no option matches.                          |
| `scrollHeight`      | `string`  |               | Maximum height of the list (a CSS length); it scrolls beyond. |
| `ariaLabel`, `ariaLabelledby` | `string` |       | Name of the list.                                       |

- **Behaviour:** a single list keeps its choice when the chosen option is clicked again. The filter hides options but
  keeps a hidden option selected.
- **Keyboard:** the CDK listbox keys: arrows, Home, End, typeahead, Space or Enter to choose.
- **Accessibility:** `role="listbox"` with `aria-multiselectable` and `aria-activedescendant`, `role="option"` with
  `aria-selected` and `aria-disabled`. Give the list a name with `ariaLabel` or `ariaLabelledby`.

## Tokens

The look comes from the design tokens `--h-listbox-*`, `--h-inputtext-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
