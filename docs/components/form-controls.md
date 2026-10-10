# Form controls

`hx-input`, `hx-checkbox`, `hx-radio` and `hx-switch` are **native elements drawn with CSS**, not wrapper
components: they work unchanged with template-driven forms, reactive forms and Angular's signal forms, keep
the native keyboard and screen-reader behaviour, and need no `ControlValueAccessor`. The look is that of the
helix-core controls (the `--h-inputtext-*`, `--h-checkbox-*`, `--h-radiobutton-*` and `--h-toggleswitch-*`
tokens).

### Text field and textarea: `hx-input`

```html
<label for="name">Name</label>
<input hx-input id="name" [(ngModel)]="name" />
<textarea hx-input rows="4" variant="filled"></textarea>
```

| Input     | Type                           | Default      | Description                           |
| --------- | ------------------------------ | ------------ | ------------------------------------- |
| `variant` | `'outlined' \| 'filled'`       | `'outlined'` | A tinted field instead of an outline. |
| `size`    | `'small' \| 'medium' \| 'large'` | `'medium'`   | Font size and padding.                |
| `fluid`   | `boolean`                      | `false`      | Full width of the container.          |
| `autoResize` | `boolean`                   | `false`      | Textarea only: the height follows the content. |

- **Auto resize:** `rows` (and `min-height`) is the minimum height; the textarea grows and shrinks on input, when a
  form writes a value (`ngModel`, reactive or signal forms) and when its width changes the wrapping at the next render.
  The resize handle and the scrollbar are off while it is on. Accessibility: nothing beyond the native textarea.

### Checkbox, radio, switch

```html
<label><input type="checkbox" hx-checkbox [(ngModel)]="agreed" /> I agree</label>
<input type="checkbox" hx-checkbox [indeterminate]="some" aria-label="Select all" />

<label><input type="radio" hx-radio name="plan" value="free" [(ngModel)]="plan" /> Free</label>
<label><input type="radio" hx-radio name="plan" value="pro" [(ngModel)]="plan" /> Pro</label>

<label><input type="checkbox" hx-switch [(ngModel)]="darkMode" /> Dark mode</label>
```

`hx-checkbox` and `hx-radio` take `size` (`'small' | 'medium' | 'large'`). `hx-switch` sets `role="switch"` on its
checkbox; use it for a setting that takes effect immediately and name the setting, not the action.

### Labels, invalid state, messages

- Give every control a visible `<label>` (wrap the control in it, or use `for`/`id`); a placeholder is a hint.
- The invalid look comes from `aria-invalid="true"` and from Angular's `ng-invalid ng-touched` classes, so
  reactive and template-driven forms need nothing more. With signal forms, bind it yourself and point the
  control at its message:

```html
<input hx-input id="email" type="email" [formField]="form.email"
       [attr.aria-invalid]="form.email().touched() && form.email().invalid() ? 'true' : null"
       aria-describedby="email-error" />
<span id="email-error" aria-live="polite">@if (form.email().touched()) { {{ form.email().errors()[0]?.message }} }</span>
```

The demo page "Helix UI Form" shows all of this next to the helix-core controls, including a signal form with
`required`, `minLength` and `email` validators and a loading submit button.

## Tokens

The look comes from the design tokens `--h-inputtext-*`, `--h-textarea-*`, `--h-checkbox-*`, `--h-radiobutton-*`, `--h-toggleswitch-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
