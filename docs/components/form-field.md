# Form field

`hx-field` is a form field around one control. It renders the label, the hint, the error and the required marker
and does the wiring between them, so a form writes no `<label for>`, no message id and no `aria-*` attribute.

```html
<hx-field label="Name" error="Enter your name">
  <input hx-input formControlName="name" />
</hx-field>

<hx-field label="Email" hint="We never share it">
  <input hx-input type="email" [formField]="signup.email" />
</hx-field>

<hx-field label="City" error="Pick a city">
  <hx-select required [options]="cities" [(ngModel)]="city" />
</hx-field>

<hx-field label="Dark mode">
  <input type="checkbox" hx-switch [formField]="signup.darkMode" />
</hx-field>
```

| Input      | Type             | Default | Description                                                                 |
| ---------- | ---------------- | ------- | --------------------------------------------------------------------------- |
| `label`    | `string`         |         | The visible label.                                                          |
| `hint`     | `string`         |         | Help text below the control.                                                |
| `error`    | `string \| null` |         | The error text; it replaces the message of the form's error.                |
| `required` | `boolean`        | `false` | Marks the field as required; the control's validator or attribute does too. |

## The control

Put exactly one control in the field: `hx-input` (input or textarea), `hx-checkbox`, `hx-radio`, `hx-switch` or
`hx-select`. A checkbox, radio or switch stands before the label on one line. Float label and input group are not
supported inside a field.

## Wiring

- **Id:** the control gets a generated `id` unless it has one (`inputId` for `hx-select`); the label points at it.
- **Description:** `aria-describedby` holds the ids of the hint and the error while they are shown. Ids you set
  yourself (`ariaDescribedby` for `hx-select`) stay.
- **Required:** from the `required` input, the control's `required` attribute, `Validators.required` /
  `Validators.requiredTrue` or a signal forms `required()` rule. The control gets `aria-required="true"`; the `*`
  in the label is visual only. The `required` input does not add a validator.
- **Invalid:** with a form on the control (`ngModel`, `formControl`, `formControlName` or `[formField]`), it is
  invalid when the form says so **and** it is touched; `aria-invalid="true"` and the error appear then. An
  `hx-select` in a field shows its invalid look at the same moment.
- **Error text:** `error`, else with signal forms the `message` of the first error. Reactive and template-driven
  errors carry no message, so set `error`. Without a form, a set `error` shows at once.
- The error sits in a polite live region.

## Tokens

The field has no tokens of its own: type is `--h-font-size-sm`, the gaps are `--h-space-*`, the hint is
`--h-text-muted-color` and the error and the required marker are `--h-form-field-invalid-placeholder-color`
(see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
