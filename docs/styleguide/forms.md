# Forms

Deep dive of the [UX style guide](STYLEGUIDE.md): read it when you add or change a form. It says how a form is
built from Helix parts. Dialog layout is in [dialogs.md](dialogs.md).

## Field anatomy

[`hx-field`](../components/form-field.md) holds one `hx-input` (input or textarea), `hx-checkbox`, `hx-radio`,
`hx-switch` or `hx-select`.

- Each of these controls sits in its own `hx-field` with a `label`. The label is visible; `aria-label` does not
  replace it.
- Help text is the `hint` input: it shows below the control in `--h-text-muted-color`. The app writes no help
  element of its own.
- Error text is the `error` input (signal forms: or the `message` of the rule). `hx-field` shows it once the control
  is invalid and touched.
- Inside a field the app writes no `<label for>`, no message id, no `aria-invalid` and no condition on the error:
  `hx-field` sets `aria-invalid`, `aria-describedby` and `aria-required`.
- A required field shows the marker of `hx-field`: from `Validators.required` of `@angular/forms`, a signal forms
  `required()` rule, or the `required` attribute of the control or the field. No label carries a hand-written `*`.

```html
<hx-field label="Repository URL" hint="HTTPS or SSH" [error]="form.controls.url.errors?.['Required']" required>
  <input hx-input formControlName="url" />
</hx-field>
```

### Controls outside `hx-field`

`hx-field` does not wire other controls, such as `hx-input-number`, `hx-password`, `hx-multi-select`,
`hx-auto-complete`, `hx-date-picker` or `hx-input-group`.

- Each has a visible `<label for>` that points at its `inputId` (a native `hx-input` in a group: at its `id`).
- Its error is an `hx-message severity="error"` below it, shown while the control is invalid and touched.

```html
<label for="retries">Retries</label>
<hx-input-number inputId="retries" formControlName="retries" [min]="0" [max]="10" />
@if (form.controls.retries.touched && form.controls.retries.errors; as errors) {
  <hx-message severity="error" variant="simple" size="small">{{ errors['Required'] }}</hx-message>
}
```

## Vertical rhythm

The app lays out its own wrapper elements; it does not restyle `hx-field` or `hx-fieldset`.

| Between                                    | Gap           |
| ------------------------------------------ | ------------- |
| Label, control, hint and error of a field  | `hx-field`    |
| A `<label for>`, its control and its error | `--h-space-1` |
| Fields of one group                        | `--h-space-4` |
| Groups of a form                           | `--h-space-6` |

A form is a column of groups. A group is an `hx-fieldset` or, without a legend, a block of fields; a form with one
group is that block alone.

```css
.form,
.group {
  display: flex;
  flex-direction: column;
}

.form {
  gap: var(--h-space-6);
}

.group {
  gap: var(--h-space-4);
}
```

## Groups

- Fields that answer one question (an address, the choices of a radio group) sit in an
  [`hx-fieldset`](../components/fieldset.md) with a `legend`. No heading element stands in for the legend.
- A fieldset that holds a required field is not `toggleable`: a collapsed group hides its errors.

```html
<hx-fieldset legend="Protocol">
  <div class="group">
    <hx-field label="HTTPS"><input type="radio" hx-radio formControlName="protocol" value="https" /></hx-field>
    <hx-field label="SSH"><input type="radio" hx-radio formControlName="protocol" value="ssh" /></hx-field>
  </div>
</hx-fieldset>
```

## Placeholders

- The `placeholder` of `hx-input`, `hx-select` or another control is never its only label.
- A placeholder is a short hint on what to do ("Search branches", "Select a city"). It is never an example value
  such as `https://github.com/org/repo.git`, which reads as filled in. A format or an example goes in the `hint` of
  `hx-field`.

## Path pickers

A file or folder path is chosen, not typed: an [`hx-input-group`](../components/input-group.md) with a read-only
`hx-input` and an `hx-button` that opens the file dialog.

- The input has the `readonly` attribute and a visible `<label for>`.
- The browse button is `type="button"` with `severity="secondary"`. With an icon only, it is `iconOnly` with an
  `aria-label` and an `hx-tooltip`.
- Its error is wired as `hx-field` would: `aria-invalid`, and `aria-describedby` with the id of the `hx-message`.

```html
<label for="folder">Target folder</label>
<hx-input-group>
  <input
    hx-input
    id="folder"
    formControlName="folder"
    readonly
    [attr.aria-invalid]="folderError() ? 'true' : null"
    [attr.aria-describedby]="folderError() ? 'folder-error' : null"
  />
  <button hx-button type="button" severity="secondary" (click)="browse()">Browse…</button>
</hx-input-group>
@if (folderError(); as error) {
  <hx-message id="folder-error" severity="error" variant="simple" size="small">{{ error }}</hx-message>
}
```

## Validation

- The primary `hx-button` of a form is `type="submit"` and is never `[disabled]` because the form is invalid or
  untouched. A press on it shows what is missing.
- Submit marks every field as touched, so each invalid field shows its error: reactive and template-driven forms
  call `markAllAsTouched()`, signal forms use `submit()` of `@angular/forms/signals`.
- A field also shows its error when the user leaves it invalid: `hx-field` does this on touch, the app adds no blur
  handler.
- While the form is being sent, the submit button has `[loading]`.
- A message about the whole form (the server refused it) is an `hx-message severity="error"` above the submit
  button. A server answer about one field is set as an error on that control.

```ts
save(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  this.send(this.form.getRawValue());
}
```

### Validators

Reactive forms take the validators of
[`@gravionlabs/helix-ui/validators`](../HELIX-UI.md#validators): each carries its message, under its
`ValidatorKey`, so the text lives with the rule and `error` reads it.

- Every validator has a message that says what to enter ("Enter a repository URL").
- With the Helix `required`, set `required` on the `hx-field`: the field finds only the Angular validator by itself.
- A checkbox that must be checked takes `Validators.requiredTrue` of `@angular/forms`: the Helix `required` accepts
  `false`.

## Which control for which value

| Value                                      | Control                                                                                  |
| ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| One line of text                           | `input[hx-input]`                                                                        |
| Several lines of text                      | `textarea[hx-input]`                                                                     |
| A password or secret                       | [`hx-password`](../components/password.md)                                               |
| A number                                   | [`hx-input-number`](../components/input-number.md) with `min` and `max` where they exist |
| A number on a range, where roughly will do | [`hx-slider`](../components/slider.md)                                                   |
| Yes or no, saved with the form             | `input[type=checkbox][hx-checkbox]`                                                      |
| On or off, in effect at once               | `input[type=checkbox][hx-switch]`                                                        |
| One of 2 to 5 choices, all visible         | `input[type=radio][hx-radio]` in an `hx-fieldset`                                        |
| One of 6 or more, or of a loaded list      | [`hx-select`](../components/select.md), with `filter` from 10 options                    |
| Several of a list                          | [`hx-multi-select`](../components/multi-select.md)                                       |
| Free text with suggestions                 | [`hx-auto-complete`](../components/auto-complete.md)                                     |
| A day or a range of days                   | [`hx-date-picker`](../components/date-picker.md)                                         |
| A file or folder path                      | [Path picker](#path-pickers)                                                             |
| The content of files                       | [`hx-file-upload`](../components/file-upload.md)                                         |
