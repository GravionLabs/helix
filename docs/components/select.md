# Select

`hx-select` is a listbox in a CDK overlay with a combobox trigger. It needs `@angular/cdk` (a peer
dependency) and the overlay styles that come with `styles.css`.

```html
<label for="city">City</label>
<hx-select inputId="city" placeholder="Select a city" [options]="cities"
           optionLabel="name" optionValue="code" [(ngModel)]="city" showClear />
<hx-select [options]="['Free', 'Pro', 'Team']" [formField]="form.plan" />
```

| Input            | Type                                | Default        | Description                                                         |
| ---------------- | ----------------------------------- | -------------- | ------------------------------------------------------------------- |
| `options`        | `unknown[]`                         | `[]`           | Objects or primitives.                                              |
| `optionLabel`    | `string`                            | `'label'`      | Property shown for an object option.                                |
| `optionValue`    | `string`                            | `'value'`      | Property used as the value; without it the option itself is used.   |
| `optionDisabled` | `string`                            | `'disabled'`   | Property that disables an option.                                   |
| `placeholder`    | `string`                            |                | Shown while nothing is selected.                                    |
| `emptyMessage`   | `string`                            | `'No options'` | Shown when there are no options.                                    |
| `variant`        | `'outlined' \| 'filled'`            | `'outlined'`   | A tinted field instead of an outline.                               |
| `size`           | `'small' \| 'medium' \| 'large'`     | `'medium'`     | Font size and padding.                                              |
| `fluid`          | `boolean`                           | `false`        | Full width of the container.                                        |
| `showClear`      | `boolean`                           | `false`        | A button that resets the value to `null`.                           |
| `inputId`        | `string`                            |                | Id of the trigger, for `<label for>`.                               |
| `ariaLabel`      | `string`                            |                | Accessible name when there is no visible label.                     |
| `compareWith`    | `(a, b) => boolean`                 | `Object.is`    | How a value is matched to an option.                                |

- **Forms:** works with `ngModel`, reactive forms (it is a `ControlValueAccessor`) and signal forms
  (`[formField]`, it implements the form value control contract); `[(value)]` binds it without forms.
- **Keyboard:** Arrow Down/Up or Enter opens it; in the list the arrows, Home, End and typeahead move,
  Enter or Space selects, Escape closes and returns focus to the trigger, Tab closes.
- **Accessibility:** the trigger is a `combobox` with `aria-expanded` and `aria-controls`, the list a
  `listbox` of `option`s. Give it a visible label or `ariaLabel`.

## Tokens

The look comes from the design tokens `--h-select-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
