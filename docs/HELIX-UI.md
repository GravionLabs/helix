# @gravionlabs/helix-ui

Vanilla Angular components on the Helix design tokens: standalone, signal-based, plain CSS, no runtime
styling engine and no dependency on `@gravionlabs/helix-core`. It is the long-term replacement of the
vendored PrimeNG fork ([ADR 0001](adr/0001-styling-foundation.md)); components move over group by group,
starting with the ones `helix-shell` and `helix-zod` use.

::: warning Not published yet
The package builds and is tested in this repository (`projects/ui`), but is not on npm: the first release
needs a trusted-publisher entry for `@gravionlabs/helix-ui`. Until then it is used from source (path mapping
`@gravionlabs/helix-ui`) as in the demo.
:::

## Install and styles

```bash
npm install @gravionlabs/helix-ui
```

```css
/* the components, in the `components` cascade layer */
@import "@gravionlabs/helix-ui/styles.css";
/* the tokens the components read; load them in every app */
@import "@gravionlabs/helix-ui/tokens.css";
```

- `styles.css` states the layer order Tailwind uses (`theme, base, components, utilities`) and puts the
  component CSS in `components`: an app's unlayered CSS and Tailwind's utilities win over it.
- `tokens.css` is `helixPreset` resolved by the engine of helix-core at build time: light on `:root`, dark
  under the `app-dark` class, every token the components read. **Load it in every app, also in one that
  runs `provideHelix`:** the helix-core engine emits a component's tokens only once a core component of that
  kind is on the page, so a ui Button on a page without a core `h-button` would find no `--h-button-*`.
  The static tokens reference the semantic ones (`--h-primary-color`, …), which the engine always emits, so
  a runtime change of the primary colour or the dark mode still reaches the ui components.
- Selectors and classes use the prefix `hx` (`hx-button`); helix-core owns `h-`. Both read the same `--h-*`
  tokens, so a page mixes them without a visible seam.

## Button

`button[hxButton]` and `a[hxButton]`: a native element styled as a Helix button. The label is the content;
an icon is an inline `<svg>` (or an element with the class `hx-button-icon`) next to it.

```html
<button hxButton (click)="save()">Save</button>
<button hxButton severity="success" variant="outlined" size="large">Publish</button>
<button hxButton [loading]="saving()" (click)="save()">Save</button>
<button hxButton iconOnly rounded aria-label="Add"><svg viewBox="0 0 24 24" …/></button>
<a hxButton variant="link" href="/docs">Docs</a>
```

| Input      | Type                                                                                       | Default     | Description                                                                    |
| ---------- | ------------------------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------ |
| `variant`  | `'filled' \| 'outlined' \| 'text' \| 'link'`                                               | `'filled'`  | How loud the button is.                                                        |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast'` | `'primary'` | What it means; every severity works with every variant.                        |
| `size`     | `'small' \| 'medium' \| 'large'`                                                           | `'medium'`  | Font size and padding from the `--h-button-sm-*` / `-lg-*` tokens.             |
| `rounded`  | `boolean`                                                                                  | `false`     | A pill; a circle for an icon-only button.                                      |
| `raised`   | `boolean`                                                                                  | `false`     | Adds the elevation shadow.                                                     |
| `fluid`    | `boolean`                                                                                  | `false`     | Takes the full width of its container.                                         |
| `iconOnly` | `boolean`                                                                                  | `false`     | Square button for one icon. **Give it `aria-label`.**                          |
| `loading`  | `boolean`                                                                                  | `false`     | Spinner in front of the label, `aria-busy="true"`, clicks are ignored; the button stays focusable. |

Behaviour:

- A **disabled** button is the native `disabled` attribute; an **anchor** is disabled with
  `aria-disabled="true"`, which the directive honours by ignoring clicks.
- While `loading` the button is *not* `disabled`: focus is not lost when an operation starts, and screen
  readers hear the busy state.
- Colours, radius, padding and the focus ring come from the `--h-button-*` tokens of the preset, in light and
  dark; override a token in your own preset, not the CSS.

## Form controls

`hxInput`, `hxCheckbox`, `hxRadio` and `hxSwitch` are **native elements drawn with CSS**, not wrapper
components: they work unchanged with template-driven forms, reactive forms and Angular's signal forms, keep
the native keyboard and screen-reader behaviour, and need no `ControlValueAccessor`. The look is that of the
helix-core controls (the `--h-inputtext-*`, `--h-checkbox-*`, `--h-radiobutton-*` and `--h-toggleswitch-*`
tokens).

### Text field and textarea: `hxInput`

```html
<label for="name">Name</label>
<input hxInput id="name" [(ngModel)]="name" />
<textarea hxInput rows="4" variant="filled"></textarea>
```

| Input     | Type                           | Default      | Description                           |
| --------- | ------------------------------ | ------------ | ------------------------------------- |
| `variant` | `'outlined' \| 'filled'`       | `'outlined'` | A tinted field instead of an outline. |
| `size`    | `'small' \| 'medium' \| 'large'` | `'medium'`   | Font size and padding.                |
| `fluid`   | `boolean`                      | `false`      | Full width of the container.          |

### Checkbox, radio, switch

```html
<label><input type="checkbox" hxCheckbox [(ngModel)]="agreed" /> I agree</label>
<input type="checkbox" hxCheckbox [indeterminate]="some" aria-label="Select all" />

<label><input type="radio" hxRadio name="plan" value="free" [(ngModel)]="plan" /> Free</label>
<label><input type="radio" hxRadio name="plan" value="pro" [(ngModel)]="plan" /> Pro</label>

<label><input type="checkbox" hxSwitch [(ngModel)]="darkMode" /> Dark mode</label>
```

`hxCheckbox` and `hxRadio` take `size` (`'small' | 'medium' | 'large'`). `hxSwitch` sets `role="switch"` on its
checkbox; use it for a setting that takes effect immediately and name the setting, not the action.

### Labels, invalid state, messages

- Give every control a visible `<label>` (wrap the control in it, or use `for`/`id`); a placeholder is a hint.
- The invalid look comes from `aria-invalid="true"` and from Angular's `ng-invalid ng-touched` classes, so
  reactive and template-driven forms need nothing more. With signal forms, bind it yourself and point the
  control at its message:

```html
<input hxInput id="email" type="email" [formField]="form.email"
       [attr.aria-invalid]="form.email().touched() && form.email().invalid() ? 'true' : null"
       aria-describedby="email-error" />
<span id="email-error" aria-live="polite">@if (form.email().touched()) { {{ form.email().errors()[0]?.message }} }</span>
```

The demo page "Helix UI Form" shows all of this next to the helix-core controls, including a signal form with
`required`, `minLength` and `email` validators and a loading submit button.

## Rules of the package

- Nothing in `projects/ui` imports `@gravionlabs/helix-core`, `@primeuix/*` or `primeng` (`pnpm lint:no-core`).
- A test fails when a stylesheet reads a `--h-*` token that `tokens.css` does not define, or when a
  directive sets a class its stylesheet does not style.
- Every component has unit tests and a page here and in the demo (Helix UI Button).
