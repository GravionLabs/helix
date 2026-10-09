# Auto complete

`hx-auto-complete` is a text field that suggests values while the user types. It does not search: it emits
`(complete)` with `{ query }` (after `delay` ms and `minLength` characters) and shows the `suggestions` the app sets in
answer. The value is the chosen suggestion (an array with `multiple`); without `forceSelection` it is the typed text
while nothing is chosen. It works with `ngModel`, reactive forms (including `disable()`) and signal forms.

```html
<label for="country">Country</label>
<hx-auto-complete inputId="country" [suggestions]="found()" optionLabel="name" (complete)="search($event.query)"
                  forceSelection dropdown [(ngModel)]="country" />
```

| Input            | Type      | Default             | Description                                                   |
| ---------------- | --------- | ------------------- | ------------------------------------------------------------- |
| `suggestions`    | `unknown[]` | `[]`              | What to show; set it in answer to `(complete)`.               |
| `optionLabel`    | `string \| function` | `'label'` | The text of a suggestion (primitives are their own text).    |
| `minLength`      | `number`  | `1`                 | Characters before `(complete)` fires.                         |
| `delay`          | `number`  | `300`               | Milliseconds after the last key before `(complete)` fires.    |
| `forceSelection` | `boolean` | `false`             | Text that matches no suggestion is cleared on blur.           |
| `dropdown`       | `boolean` | `false`             | A button that asks for all suggestions (empty query).         |
| `multiple`       | `boolean` | `false`             | Chosen values are removable chips; Backspace removes the last. |
| `emptyMessage`   | `string`  | `'No results found'` | Shown and announced when the query finds nothing.            |

- **Keyboard:** Arrow Down/Up open the panel and move, Home and End jump, Enter chooses, Escape closes, Tab leaves.
- **Accessibility:** the field is a `combobox` with `aria-autocomplete="list"`, `aria-expanded`, `aria-controls` and
  `aria-activedescendant`; the panel is a `listbox` of `option`s. The result count ("3 results", or the empty message)
  is announced in a polite live region. Give the field a visible label or `ariaLabel`.

## Tokens

The look comes from the design tokens `--h-autocomplete-*`, `--h-inputtext-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
