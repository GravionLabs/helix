# @gravionlabs/helix-ui

Vanilla Angular components on the Helix design tokens: standalone, signal-based, plain CSS, no runtime
styling engine and no dependency on `@gravionlabs/helix-core`. It is the long-term replacement of the
vendored PrimeNG fork ([ADR 0001](adr/0001-styling-foundation.md)); components move over group by group,
starting with the ones `helix-shell` and `helix-zod` use.

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
- **Naming:** components are elements (`<hx-select>`), simple controls are attributes on the native element
  (`<button hx-button>`, `<input hx-input>`), always kebab-case with the prefix `hx`; classes use it too.
  helix-core owns `h-`. Both read the same `--h-*`
  tokens, so a page mixes them without a visible seam.

## Button

`button[hx-button]` and `a[hx-button]`: a native element styled as a Helix button. The label is the content;
an icon is an inline `<svg>` (or an element with the class `hx-button-icon`) next to it.

```html
<button hx-button (click)="save()">Save</button>
<button hx-button severity="success" variant="outlined" size="large">Publish</button>
<button hx-button [loading]="saving()" (click)="save()">Save</button>
<button hx-button iconOnly rounded aria-label="Add"><svg viewBox="0 0 24 24" …/></button>
<a hx-button variant="link" href="/docs">Docs</a>
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

## Select

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

## Float label

`hx-float-label` wraps one control and its `<label for>` (the label comes after the control). The label sits in
the field and moves up when the control has focus or a value.

```html
<hx-float-label variant="on">
  <input hx-input id="email" [(ngModel)]="email" />
  <label for="email">Email</label>
</hx-float-label>
<hx-float-label>
  <hx-select inputId="color" [options]="colors" [(value)]="color" />
  <label for="color">Color</label>
</hx-float-label>
```

| Input     | Type                      | Default  | Description                                                                          |
| --------- | ------------------------- | -------- | ------------------------------------------------------------------------------------ |
| `variant` | `'over' \| 'in' \| 'on'`  | `'over'` | `over`: above the field, `in`: inside it (the field gets room), `on`: on its top border. |

- **Behaviour:** a native `hx-input` or `textarea` floats by `:focus-within` and `:placeholder-shown`; an input
  without a `placeholder` gets a blank one, and an explicit placeholder is hidden while the label sits in the field.
  `hx-select`, `hx-password` and `hx-input-number` float by the `hx-filled` class they set while they hold a value;
  a component that holds a value sets the same class to take part. The `over` label leaves the field's box:
  give the wrapper room above (`margin-top`). Invalid fields (`aria-invalid="true"`, `ng-invalid ng-touched`) tint
  the label with `--h-floatlabel-invalid-color`. Motion stops under `prefers-reduced-motion`.
- **Accessibility:** the label stays a real `<label for>`, so the control keeps its name and a click on the label
  focuses it. Nothing but styling changes with the focus, so keyboard use is unchanged.

## Icon field

`hx-icon-field` puts an icon inside a text field. Wrap an `hx-input` (or `hx-password`) and one element with
`hx-input-icon`: an icon font class such as `<i class="pi pi-search">` or an inline `<svg>`.

```html
<hx-icon-field>
  <i class="pi pi-search" hx-input-icon></i>
  <input hx-input placeholder="Search" aria-label="Search" />
</hx-icon-field>
```

| Input          | Type                 | Default  | Description                                                   |
| -------------- | -------------------- | -------- | ------------------------------------------------------------- |
| `iconPosition` | `'left' \| 'right'`  | `'left'` | Start or end edge (follows the writing direction).            |

- **Behaviour:** the icon is centred vertically, does not catch clicks, and the field gets inline padding for it;
  the `small` and `large` sizes of the input are followed. Colour: `--h-iconfield-icon-color`.
- **Accessibility:** the icon is decorative and gets `aria-hidden="true"` unless it has an `aria-label`. The
  field still needs its own label.

## Input group

`hx-input-group` joins a field with text or button addons into one control. Children: `hx-input`, `hx-select`,
`hx-input-number`, `hx-icon-field`, `button[hx-button]` and `hx-input-group-addon` (text or an icon).

```html
<hx-input-group>
  <hx-input-group-addon id="scheme">https://</hx-input-group-addon>
  <input hx-input aria-label="Domain" aria-describedby="scheme" />
  <button hx-button type="button">Go</button>
</hx-input-group>
```

The group has no inputs. Neighbours overlap by their border, inner corners are square and the outer corners
keep the radius; the group is as wide as its container. The addon reads the `--h-inputgroup-addon-*` tokens.

- **Accessibility:** the group adds no role. Addon text is not part of the field's name; reference it with
  `aria-describedby` (give the addon an `id`) when it carries information, and label the field itself.

## Input number

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

## Divider

`hx-divider`: a line between content. Projected content is a label sitting on the line.

```html
<hx-divider />
<hx-divider align="center">OR</hx-divider>
<hx-divider layout="vertical" />
```

| Input    | Type                               | Default        | Description                                  |
| -------- | ---------------------------------- | -------------- | -------------------------------------------- |
| `layout` | `'horizontal' \| 'vertical'`       | `'horizontal'` | Direction of the line.                       |
| `type`   | `'solid' \| 'dashed' \| 'dotted'`  | `'solid'`      | Line style.                                  |
| `align`  | `'start' \| 'center' \| 'end'`     |                | Where the label sits; no effect without one. |

It has `role="separator"` and `aria-orientation`. Margins and colours come from the `--h-divider-*` tokens.

## Tooltip

`[hx-tooltip]` shows a short text next to an element on hover and keyboard focus. It is a CDK overlay with
`role="tooltip"`, the host gets `aria-describedby` while it is open, and Escape or a click closes it. Use it for
hints, for example the name of an icon-only button, never for essential information.

```html
<button hx-button iconOnly aria-label="Add" hx-tooltip="Add item" hxTooltipPosition="right">+</button>
```

| Input                  | Type                                       | Default  | Description                                 |
| ---------------------- | ------------------------------------------ | -------- | ------------------------------------------- |
| `hx-tooltip`           | `string \| null`                           |          | The text; empty shows nothing.              |
| `hxTooltipPosition`    | `'top' \| 'right' \| 'bottom' \| 'left'`    | `'top'`  | Preferred side; it flips when it does not fit. |
| `hxTooltipEvent`       | `'hover' \| 'focus' \| 'both'`             | `'both'` | What opens it.                              |
| `hxTooltipDisabled`    | `boolean`                                  | `false`  | Never shows.                                |
| `hxTooltipShowDelay`   | `number`                                   | `0`      | Milliseconds before it appears.             |

## Breadcrumb

`hx-breadcrumb` renders the path to the current page as a `nav` landmark with an ordered list. The last item is
the current page (`aria-current="page"`); items with `routerLink` or `url` are links. It needs `@angular/router`.

```html
<hx-breadcrumb [model]="items" [home]="{ icon: 'pi pi-home', routerLink: '/' }" />
```

An item is `{ label?, icon?, routerLink?, url?, target?, disabled?, visible? }`; `icon` is the CSS classes of an
icon font. An item without a label (the home icon) gets `aria-label="Home"`. `ariaLabel` renames the landmark.

## Password

`hx-password` is a password field with an optional button that shows or hides the text. It works with `ngModel`,
reactive forms and signal forms, like the Select.

```html
<label for="pw">Password</label>
<hx-password inputId="pw" [(ngModel)]="password" toggleMask fluid />
```

| Input                    | Type      | Default              | Description                                   |
| ------------------------ | --------- | -------------------- | --------------------------------------------- |
| `toggleMask`             | `boolean` | `false`              | The show/hide button (`aria-pressed`).        |
| `inputId`                | `string`  |                      | Id of the field, for `<label for>`.           |
| `placeholder`            | `string`  |                      | A hint, not a label.                          |
| `autocomplete`           | `string`  | `'current-password'` | Use `new-password` when choosing one.         |
| `variant`, `size`, `fluid` |         | as `hx-input`        | Same look as the text field.                  |
| `showLabel`, `hideLabel` | `string`  | English              | Accessible names of the toggle, to translate. |

There is no strength meter yet.

## Select button

`hx-select-button` is a choice among a few options as a joined group of toggle buttons: native buttons with
`aria-pressed` in a `role="group"`. Single choice by default, `multiple` for an array.

```html
<hx-select-button [options]="['Left', 'Center', 'Right']" [(ngModel)]="align" [allowEmpty]="false" ariaLabel="Alignment" />
<hx-select-button [options]="toppings" multiple [(value)]="chosen" />
```

Options, `optionLabel`, `optionValue` and `optionDisabled` work as in the Select. `allowEmpty` (default `true`)
decides whether a chosen option can be switched off again; `size` and `fluid` as usual. It works with `ngModel`,
reactive forms and signal forms. Give the group a name with `ariaLabel` or `ariaLabelledby`.

## Migration status

`helix-ui` replaces the components of the vendored PrimeNG fork group by group ([ADR 0001](adr/0001-styling-foundation.md)).

| Library        | State                                                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `helix-shell`  | Migrated: every component, ripple and styleclass is gone. It still imports the `MenuItem` type, the theme engine and the presets of the configurator, and the message validators from `helix-core`. `helix-ui` is a peer dependency. |
| `helix-zod`    | Uses only the validators of `helix-core`; no UI.                                                                                        |
| `helix-ag-grid`| No import from `helix-core`.                                                                                                            |
| `helix-core`   | Stays as the theme engine, presets and validators; its components are the fork that is retired last.                                   |

`pnpm lint:core-imports` fails when one of these libraries imports another entry point of `helix-core`, so a
migrated library cannot slide back.

## Rules of the package

- No component of `helix-shell`, `helix-zod` or `helix-ag-grid` imports a component of `helix-core` (`pnpm lint:core-imports`).
- Nothing in `projects/ui` imports `@gravionlabs/helix-core`, `@primeuix/*` or `primeng` (`pnpm lint:no-core`).
- A test fails when a stylesheet reads a `--h-*` token that `tokens.css` does not define, or when a
  directive sets a class its stylesheet does not style.
- The component styles are SCSS (`projects/ui/styles/*.scss`) compiled at build time (`pnpm build:lib:css:ui`) to
  plain CSS: loops and mixins keep repetitive parts, such as the button severities, in one place, and the
  package ships and needs no SCSS. Components still read only `--h-*` tokens.
- Every component has unit tests and a page here and in the demo (Helix UI Button, Form, Select, Blocks).
