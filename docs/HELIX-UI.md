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

## Theming

`tokens.css` gives every `--h-*` token its Helix value, light and dark. The theme service changes the colour
choice while the app runs, with CSS custom properties only: no styling engine, no rebuild.

```ts
// app.config.ts
provideHxTheme({ storageKey: 'my-app-theme' })

// anywhere
readonly theme = inject(HxTheme);
theme.toggleDark();
theme.setPrimary('emerald');   // one of HX_PRIMARY_COLORS
theme.setSurface('zinc');      // one of HX_SURFACE_NAMES; null is the Helix default
```

| Member | What it does |
| --- | --- |
| `dark()`, `setDark(on)`, `toggleDark()` | Dark mode: the class `app-dark` on `<html>` (or an attribute, see `darkSelector`). |
| `primary()`, `setPrimary(name \| null)` | The primary colour: `emerald`, `green`, `lime`, `orange`, `amber`, `yellow`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`, or `noir` (black on light, white on dark). `null` is the colour of the preset. |
| `surface()`, `setSurface(name \| null)` | The grey scale behind backgrounds, borders and text: `slate`, `gray`, `zinc`, `neutral`, `stone`, `soho`, `viva`, `ocean`. `null` is the Helix default. |
| `css()` | The style text of the overrides, for an app that renders it itself (server rendering). |

Options of `provideHxTheme`:

| Option | Default | |
| --- | --- | --- |
| `darkSelector` | `'.app-dark'` | A class or an attribute (`'[data-theme="dark"]'`); the selector `tokens.css` was built for. |
| `storageKey` | `null` | Remembers the choice in `localStorage` under this key; a damaged or blocked storage is ignored. |
| `dark` | the system setting | Dark mode when nothing is remembered (`prefers-color-scheme`). |
| `primary`, `surface` | `null` | The colours when nothing is remembered. |

How it works: the primary scale `--h-primary-50 … 950` is pointed at another colour scale
(`var(--h-emerald-500)`), the roles that depend on it (`--h-primary-color` is step 600 in light and 400 in dark)
stay those of the tokens, so every component follows. A surface replaces `--h-surface-0 … 950` in both colour
schemes. The overrides live in one style sheet of the service (a constructed one where the browser has them,
otherwise a `<style data-hx-theme>`), with a selector that wins over `tokens.css` in light and dark; the service
removes it when it is destroyed. Nothing touches the DOM on the server.

## Menu item model

`HxMenuItem` is the entry of every menu-like component (breadcrumb now; menu, menubar and split button follow):

```ts
import type { HxMenuItem } from '@gravionlabs/helix-ui';

const items: HxMenuItem[] = [
  { label: 'Settings', icon: 'pi pi-cog', routerLink: ['/settings'] },
  { separator: true },
  { label: 'Docs', url: 'https://example.com/docs', target: '_blank' },
  { label: 'Sign out', command: ({ item }) => signOut(item) },
];
```

| Field | Type | Meaning |
| --- | --- | --- |
| `label`, `ariaLabel` | `string` | Text; `ariaLabel` is the accessible name when an icon-only entry has no label. |
| `icon` | `string` | CSS classes of an icon font, e.g. `pi pi-home`. |
| `routerLink`, `queryParams` | `string \| unknown[]`, `object` | Router navigation; wins over `url`. |
| `url`, `target` | `string` | External link and its target. |
| `command` | `(event: { originalEvent: Event; item: HxMenuItem }) => void` | Called when the entry is activated. |
| `items` | `HxMenuItem[]` | Submenu, or a group when the entry has no action. |
| `disabled`, `visible`, `separator`, `id`, `badge` | | State, a hidden entry, a divider line, the element id, a short text next to the label. |

An item of the former helix-core menu model (`MenuItem`) is assignable to `HxMenuItem` as it is; a test keeps
that true. `HxBreadcrumbItem` is the same type.

## Validators

`@gravionlabs/helix-ui/validators` (a secondary entry point) holds the validators that carry their own error
message. The error text is the value of the error object, so a form field can show it directly.

```ts
import { FormControl } from '@angular/forms';
import { Validators } from '@gravionlabs/helix-ui/validators';

const email = new FormControl('', [
  Validators.required('Email is required'),
  Validators.email('Not an email address'),
]);
email.errors; // { Required: 'Email is required' } while the field is empty
```

- Each validator takes the message first, either a `string` or a function of the value (`(value) => string`).
- Validators for optional values take `allowEmpty` (default `true`): an empty value is valid unless you pass
  `false`.
- The error key is the `ValidatorKey` enum member (`Required`, `Email`, `Number`, `Integer`, `Min`, `Max`,
  `MinLength`, `MaxLength`, `Pattern`, `Date`, `OneOf`, `AllOf`), so templates and error resolvers can switch on it.
- It is the same code as `@gravionlabs/helix-core/validators`; `helix-zod` and the shell move to this entry point.

## Icons

Components draw the few icons they need themselves, as CSS masks in the colour of the element, so an app needs no
icon font for helix-ui to look right. The icons live in `projects/ui/styles/_icons.scss` (a partial: it emits no
CSS of its own) on a 24 × 24 grid with round caps and joins:

`chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`, `check`, `close`, `plus`, `minus`, `search`,
`calendar`, `eye`, `eye-off`, `upload`, `spinner`, `info`, `success`, `warn`, `error`, `star`, `star-filled`, `bars`.

```scss
@use 'icons' as *;

.hx-select-chevron {
  @include hx-icon(chevron-down, 1rem, var(--h-select-dropdown-color), 2.4);
}
```

`hx-icon($name, $size: 1em, $color: currentcolor, $stroke: 2)` sets the box, the colour and the mask; an unknown name
stops the build with the list of known icons. To add one, add its path to the `$hx-icons` map (a test compiles every
entry). `hx-icon-spin()` and `hx-icon-spin-keyframes()` turn an icon, with a slower turn for users who prefer
reduced motion.

Apps are free to keep PrimeIcons (`pi pi-*`) for the content of their own pages and for the `icon` field of menu
items; helix-ui components that take an icon (`icon="pi pi-home"`) accept the classes of any icon font.

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

## Tabs

`hx-tabs` shows one panel at a time, chosen by a row of tabs, in the WAI-ARIA tabs pattern.

```html
<hx-tabs [(value)]="tab" scrollable>
  <hx-tab-list>
    <hx-tab value="a">Profile</hx-tab>
    <hx-tab value="b">Billing</hx-tab>
    <hx-tab value="c" disabled>Soon</hx-tab>
  </hx-tab-list>
  <hx-tab-panels>
    <hx-tab-panel value="a">Profile content</hx-tab-panel>
    <hx-tab-panel value="b"><ng-template hxTabContent>Billing content</ng-template></hx-tab-panel>
  </hx-tab-panels>
</hx-tabs>
```

| Input        | Type             | Default | Description                                                           |
| ------------ | ---------------- | ------- | --------------------------------------------------------------------- |
| `value`      | `string \| null` | `null`  | `[(value)]`: the active tab; while `null` the first enabled tab is active. |
| `scrollable` | `boolean`        | `false` | Buttons at the ends of the list scroll tabs that overflow.            |
| `keepAlive`  | `boolean`        | `false` | Keep the content of lazy panels after their tab is left.              |

`hx-tab` and `hx-tab-panel` take `value` (required); a tab also takes `disabled`.

- **Lazy panels:** a panel whose content is in `<ng-template hxTabContent>` creates it when its tab first becomes
  active, and destroys it when the tab is left unless the tabs are `keepAlive`. Plain panel content is created up front
  and only hidden.
- **Keyboard:** Tab enters the list at the active tab (roving tabindex); Left and Right move to the previous and next
  enabled tab (wrapping), Home and End to the first and last, and the tab they reach is activated; Enter and Space
  activate a focused tab.
- **Accessibility:** `role="tablist"`, `role="tab"` with `aria-selected` and `aria-controls`, `role="tabpanel"` with
  `aria-labelledby`; disabled tabs are `aria-disabled` and skipped by the arrows. The scroll buttons are for the pointer
  and are not tab stops. Motion stops under `prefers-reduced-motion`.

## Split button

`hx-split-button` is a default action with a menu of related actions: a button and, joined to it, a button that opens an
[`hx-menu`](#menu).

```html
<hx-split-button label="Save" icon="pi pi-save" [model]="items" (click)="save()" (triggered)="onPick($event)" />
```

| Input / output     | Type                                     | Default           | Description                                              |
| ------------------ | ---------------------------------------- | ----------------- | -------------------------------------------------------- |
| `label`            | `string`                                 |                   | Text of the main button.                                 |
| `icon`             | `string`                                 |                   | Icon font classes for the main button.                   |
| `model`            | `HxMenuItem[]`                           | `[]`              | The related actions.                                     |
| `variant`          | `'filled' \| 'outlined' \| 'text' \| 'link'` | `'filled'`        | As on `hx-button`.                                       |
| `severity`         | `HxButtonSeverity`                       | `'primary'`       | As on `hx-button`.                                       |
| `size`             | `'small' \| 'medium' \| 'large'`          | `'medium'`        | As on `hx-button`.                                       |
| `rounded`, `raised`, `disabled` | `boolean`                   | `false`           | Pill shape, elevation shadow, disables both buttons.     |
| `menuButtonLabel`  | `string`                                 | `'More actions'`  | Name of the menu button.                                 |
| `(triggered)`      | `HxMenuItem`                             |                   | An item was activated (after its `command`).             |

`(click)` is the native click of the main button; clicks on the menu button do not reach it.

- **Accessibility:** a `role="group"` named by `label`, with two buttons; the menu button has `aria-haspopup="menu"`
  and `aria-expanded`, and the menu moves the focus back to it when it closes. See [Menu](#menu) for the keyboard.

## Stepper

`hx-stepper` shows the steps of a process as a row of headers above the panel of the active step.

```html
<hx-stepper [(value)]="step" linear>
  <hx-step-list>
    <hx-step [value]="1">Account</hx-step>
    <hx-step [value]="2">Address</hx-step>
  </hx-step-list>
  <hx-step-panels>
    <hx-step-panel [value]="1">
      <ng-template hxStepContent let-activateCallback="activateCallback">
        <button hx-button (click)="activateCallback(2)">Next</button>
      </ng-template>
    </hx-step-panel>
    <hx-step-panel [value]="2">Address form</hx-step-panel>
  </hx-step-panels>
</hx-stepper>
```

| Input       | Type                      | Default | Description                                                            |
| ----------- | ------------------------- | ------- | ---------------------------------------------------------------------- |
| `value`     | `string \| number \| null` | `null`  | `[(value)]`: the active step; while `null` the first enabled step is active. |
| `linear`    | `boolean`                 | `false` | Steps after the active one are disabled in the header.                 |
| `keepAlive` | `boolean`                 | `false` | Keep the content of lazy panels after their step is left.              |

`hx-step` and `hx-step-panel` take `value` (required); a step also takes `disabled`. `next()` and `previous()` on the
stepper (a template reference works) move to the neighbouring step.

- **Completed steps:** the steps before the active one show a check mark and their separator in the active colour.
- **Linear:** the header cannot jump ahead; the app moves on with `activateCallback(value)` (or `next()`) once the
  step is valid. Going back is always possible.
- **Lazy panels:** content in `<ng-template hxStepContent>` is created when its step first becomes active and
  destroyed when it is left unless `keepAlive`; the template context has `activateCallback` and `value`. Plain panel
  content is created up front and only hidden.
- **Accessibility:** the headers are buttons in a list, the active one has `aria-current="step"` and each controls its
  panel (`role="region"`, `aria-labelledby`). Disabled steps are really `disabled`. Below 40rem only the title of
  the active step is shown. Motion stops under `prefers-reduced-motion`.
- Horizontal layout only; a vertical stepper is not part of this version.

## Toast

`hx-toast` shows short messages that go away. Put one in the root component and send messages with
`HxMessageService`.

```html
<hx-toast position="top-right" />
<hx-toast key="form" position="bottom-center" />
```

```ts
readonly messages = inject(HxMessageService);
this.messages.add({ severity: 'success', summary: 'Saved', detail: 'The order was saved.' });
this.messages.add({ severity: 'error', summary: 'Failed', sticky: true, key: 'form' });
this.messages.clear('form');
```

`add({ severity, summary, detail, life, sticky, closable, key })` returns the id of the message; `remove(id)` and
`clear(key?)` take messages away. `life` is 3000 ms by default, `sticky` keeps the message until it is closed,
`closable` (default `true`) shows the close button.

| Input      | Type                                                                                    | Default       | Description                                 |
| ---------- | --------------------------------------------------------------------------------------- | ------------- | ------------------------------------------- |
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'center' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'top-right'` | Where the stack sits.                       |
| `key`      | `string`                                                                                |               | Show only messages sent with this key (without a key: those sent without). |

- **Accessibility:** every message is a live region: `role="status"` with `aria-live="polite"` for info, success,
  secondary and contrast; `role="alert"` with `aria-live="assertive"` for warn and error. The close button is named.
  The timer of a message pauses while the pointer or the focus is on it, so it is not removed while someone reads it or
  reaches for its close button. Motion stops under `prefers-reduced-motion`.

## Menu

`hx-menu` shows a list of [`HxMenuItem`s](#menu-item-model), inline or as a popup, with nested submenus. It is built on
`@angular/cdk/menu`.

```html
<button hx-button aria-haspopup="menu" (click)="menu.toggle($event)">Actions</button>
<hx-menu #menu popup ariaLabel="Actions" [model]="items" (triggered)="onPick($event)" />

<hx-menu [model]="items" ariaLabel="Account" />
```

| Input / output | Type                  | Default | Description                                                         |
| -------------- | --------------------- | ------- | ------------------------------------------------------------------- |
| `model`        | `HxMenuItem[]`        | `[]`    | The entries: label, icon, `routerLink`, `url`, `command`, `disabled`, `separator`, `badge`, `items`. |
| `popup`        | `boolean`             | `false` | Open in an overlay with `toggle(event)` / `show(event)`; otherwise inline. |
| `ariaLabel`    | `string`              |         | Name of the menu.                                                   |
| `(triggered)`  | `HxMenuItem`          |         | An item was activated (after its `command`).                        |

`toggle(event)`, `show(event)` and `hide()` control a popup; it opens at the element of the event.

- **Items:** an item at the first level that has `items` and no action of its own is a group heading above its
  children; deeper levels open as submenus. A disabled item runs nothing; a hidden one (`visible: false`) is left out.
- **Keyboard:** Arrow Down/Up and Home/End move, typing jumps by label, Right or Enter opens a submenu and Left closes
  it, Enter or Space activates, Escape closes the menu and returns the focus to the element that opened it.
- **Accessibility:** the WAI-ARIA menu from the CDK: `role="menu"`, `menuitem`, `separator`, `group`; submenu items
  have `aria-haspopup="menu"` and `aria-expanded`. Put `aria-haspopup="menu"` on the button that opens a popup, and
  name an icon-only item with `ariaLabel`.

## Menubar

`hx-menubar` is a horizontal menu of [`HxMenuItem`s](#menu-item-model) with dropdown submenus, on the CDK menubar.

```html
<hx-menubar ariaLabel="Main" [model]="items">
  <a hxMenubarStart routerLink="/">Helix</a>
  <button hxMenubarEnd hx-button>Sign in</button>
</hx-menubar>
```

| Input / output | Type           | Default  | Description                                                           |
| -------------- | -------------- | -------- | --------------------------------------------------------------------- |
| `model`        | `HxMenuItem[]` | `[]`     | The entries; an entry with `items` opens a submenu.                   |
| `breakpoint`   | `number`       | `960`    | Width in px below which the items collapse into a button.             |
| `ariaLabel`    | `string`       |          | Name of the menubar.                                                  |
| `buttonLabel`  | `string`       | `'Menu'` | Name of the button shown when collapsed.                              |
| `(triggered)`  | `HxMenuItem`   |          | An item was activated (after its `command`).                          |

Content marked `hxMenubarStart` or `hxMenubarEnd` is placed before and after the items.

- **Collapsed:** below `breakpoint` the bar shows the start and end content and a button; the button opens the items as
  an [`hx-menu`](#menu) popup (group headings and nested submenus as there).
- **Keyboard:** Left and Right move between the top items, Down or Enter opens a submenu and moves into it, Escape
  closes it and returns to the item, typing jumps by label.
- **Accessibility:** `role="menubar"` with `menuitem`s; items with a submenu have `aria-haspopup="menu"` and
  `aria-expanded`. Name icon-only items with `ariaLabel`.

## Message

`hx-message` is an inline message next to the content it is about.

```html
<hx-message severity="error" closable (close)="onClose()">The card was declined.</hx-message>
<hx-message severity="info" variant="outlined" icon="pi pi-star" [life]="5000">Saved</hx-message>
```

| Input        | Type                                                          | Default    | Description                                       |
| ------------ | ------------------------------------------------------------- | ---------- | ------------------------------------------------- |
| `severity`   | `'success' \| 'info' \| 'warn' \| 'error' \| 'secondary' \| 'contrast'` | `'info'`   | Colours and built-in icon.                        |
| `variant`    | `'filled' \| 'outlined' \| 'simple'`                          | `'filled'` | Tinted box, outline only, or text only.           |
| `size`       | `'small' \| 'medium' \| 'large'`                              | `'medium'` | Padding, text and icon size.                      |
| `icon`       | `string`                                                      | `''`       | Icon classes (any icon font) instead of the built-in icon. |
| `closable`   | `boolean`                                                     | `false`    | A close button (`closeLabel`, default `Close`).   |
| `life`       | `number`                                                      | `0`        | Milliseconds until the message hides itself.      |

`(close)` fires when the button or `life` hides the message.

- **Accessibility:** the message is a live region: `role="status"`, and `role="alert"` for `error`. The built-in icon
  is `aria-hidden`; the close button has an accessible name. Do not rely on the colour alone: say what happened in the text.

## Toolbar

`hx-toolbar` groups actions in a start, a center and an end area. It wraps on small screens.

```html
<hx-toolbar>
  <button hxToolbarStart hx-button>New</button>
  <span hxToolbarCenter>3 selected</span>
  <button hxToolbarEnd hx-button>Export</button>
</hx-toolbar>
```

Project into `[hxToolbarStart]`, `[hxToolbarCenter]` and `[hxToolbarEnd]`; an area without content takes no space.

- **Accessibility:** a plain group, deliberately without `role="toolbar"`: that role promises a single tab stop and
  arrow-key navigation between the controls, which this component does not implement, so every control keeps its own
  tab stop. Add `role="group"` and an `aria-label` yourself when the group needs a name.

## Accordion

`hx-accordion` stacks panels of which one (or with `multiple` several) is open. It is built on `@angular/cdk/accordion`.
A panel is `hx-accordion-panel` with a `value`, an `hx-accordion-header` and an `hx-accordion-content`.

```html
<hx-accordion [(value)]="open" [headingLevel]="3">
  <hx-accordion-panel value="a">
    <hx-accordion-header>First</hx-accordion-header>
    <hx-accordion-content>Content of the first panel</hx-accordion-content>
  </hx-accordion-panel>
  <hx-accordion-panel value="b" disabled>…</hx-accordion-panel>
</hx-accordion>
```

| Input          | Type                           | Default | Description                                                       |
| -------------- | ------------------------------ | ------- | ----------------------------------------------------------------- |
| `value`        | `string \| string[] \| null`    | `null`  | `[(value)]`: the `value` of the open panel, or the open values with `multiple`. |
| `multiple`     | `boolean`                      | `false` | Panels open independently.                                        |
| `headingLevel` | `number`                       | `3`     | Level of the headings around the header buttons.                  |

A panel takes `value` (required) and `disabled`.

- **Keyboard:** Tab reaches each header; Enter or Space toggles; Arrow Down/Up move to the next or previous header
  (wrapping), Home and End to the first and last. Disabled headers are skipped.
- **Accessibility:** the WAI-ARIA accordion: every header is a `<button>` inside a heading, with `aria-expanded` and
  `aria-controls`; the content is a `role="region"` labelled by its header and `inert` while closed. Motion stops under
  `prefers-reduced-motion`.

## Fieldset

`hx-fieldset` is a native `<fieldset>` with a `<legend>` that groups related controls and can collapse.

```html
<hx-fieldset legend="Shipping address" toggleable [(collapsed)]="closed">
  <label for="street">Street</label> <input hx-input id="street" />
</hx-fieldset>
```

| Input       | Type              | Default | Description                                              |
| ----------- | ----------------- | ------- | -------------------------------------------------------- |
| `legend`    | `string`          | `''`    | The legend text.                                         |
| `toggleable` | `boolean`        | `false` | The legend holds a button that collapses the content.    |
| `collapsed` | `boolean` (model) | `false` | `[(collapsed)]`; only a toggleable fieldset collapses.   |

- **Accessibility:** it is a real fieldset and legend, so the group name is announced for the controls inside. When
  toggleable, the legend contains a `<button>` with `aria-expanded` and `aria-controls`; the content is `inert` while
  collapsed so its controls leave the tab order. Motion stops under `prefers-reduced-motion`.

## Panel

`hx-panel` is a titled container that can collapse. The `header` input is the title; `[hxPanelHeader]` adds content next
to it (icons, buttons) and `[hxPanelFooter]` is the footer. Expanding and collapsing is animated unless the user prefers
reduced motion.

```html
<hx-panel header="Filters" toggleable [(collapsed)]="closed">
  <button hxPanelHeader hx-button size="small">Reset</button>
  ...
  <div hxPanelFooter>3 filters active</div>
</hx-panel>
```

| Input       | Type      | Default | Description                                              |
| ----------- | --------- | ------- | -------------------------------------------------------- |
| `header`    | `string`  | `''`    | The title.                                               |
| `toggleable` | `boolean` | `false` | A button in the header collapses and expands the content. |
| `collapsed` | `boolean` (model) | `false` | `[(collapsed)]`; only a toggleable panel collapses. |

- **Accessibility:** the toggle is a native `<button>` named by the title, with `aria-expanded` and `aria-controls`; the
  content is a `role="region"` labelled by the title, and `inert` while collapsed so its controls leave the tab order.

## Card

`hx-card` is a surface for grouped content. Project a header with `hxCardHeader` (an image, say), a title with
`hxCardTitle`, a subtitle with `hxCardSubtitle`, the content, and a footer with `hxCardFooter`; or use the `title` and
`subtitle` inputs as a shortcut. Regions without content take no space.

```html
<hx-card title="Billing" subtitle="October" [headingLevel]="3">
  <img hxCardHeader src="chart.png" alt="" />
  Total due: 120 EUR
  <div hxCardFooter><button hx-button>Pay</button></div>
</hx-card>
```

| Input          | Type     | Default | Description                                              |
| -------------- | -------- | ------- | -------------------------------------------------------- |
| `title`        | `string` | `''`    | The title (a shortcut for the `hxCardTitle` slot).       |
| `subtitle`     | `string` | `''`    | The subtitle (a shortcut for the `hxCardSubtitle` slot). |
| `headingLevel` | `number` | `2`     | Level of the title heading, 1 to 6.                      |

- **Accessibility:** the title is a real heading (`h1` to `h6` by `headingLevel`) so the page outline stays right;
  the card adds no role. An empty title is hidden, not left as an empty heading.

## File upload

`hx-file-upload` collects files and emits them; there is no HTTP in it, the app uploads. The choose control is a
native `<input type="file">` inside a button-like label, so it works by keyboard; the drop zone is an extra way to add
files. Files of the wrong type, too large, or beyond the limit are not added and the reason is shown.

```html
<hx-file-upload accept="image/*,.pdf" multiple [maxFileSize]="1000000" [fileLimit]="5" [progress]="percent()"
                (select)="onSelect($event)" (upload)="upload($event)" />
<hx-file-upload mode="basic" accept=".csv" chooseLabel="Import" (select)="import($event)" />
```

| Input                   | Type                    | Default      | Description                                          |
| ----------------------- | ----------------------- | ------------ | ---------------------------------------------------- |
| `mode`                  | `'basic' \| 'advanced'` | `'advanced'` | `basic`: only the choose button and the names.       |
| `accept`                | `string`                | `''`         | `.png`, `image/*`, `application/pdf`, comma separated. |
| `multiple`              | `boolean`               | `false`      | Several files; otherwise a new choice replaces the old. |
| `maxFileSize`, `fileLimit` | `number`             |              | Largest file in bytes, most files in the list.       |
| `progress`              | `number \| null`        | `null`       | 0 to 100; shows a bar while set.                     |
| `chooseLabel`, `uploadLabel`, `cancelLabel`, `removeLabel`, `dropLabel` | `string` | | Texts. The three `invalid…Message` inputs take `{0}`, `{1}`. |

Outputs: `(select)` the files one choice or drop added, `(remove)` the file removed, `(clear)` Cancel emptied the
list, `(upload)` all files in the list. `reset()` empties the list from code, and `files()` is the current list.

- **Accessibility:** the file input is visually hidden but focusable (Enter or Space opens the dialog, and the label
  shows the focus ring); dropping is not the only way to add files. Validation messages are in a polite live region
  (`role="status"`); the progress bar is a `progressbar`; each remove button is named "Remove {file}".

## Date picker

`hx-date-picker` is a date field that opens a calendar, or with `[inline]="true"` the calendar alone, to choose a day, a
range or several days. Clicking the month or the year in the header opens the month and year views. Names of months and weekdays come from
`Intl.DateTimeFormat` for the `locale`. The value is a `Date` (`single`) or a `Date[]` (`multiple`; with `range`
one date while the range is open and two when it is complete). It works with `ngModel`, reactive forms
(including `disable()`) and signal forms.

```html
<label for="arrival">Arrival</label>
<hx-date-picker inputId="arrival" showIcon showButtonBar [(ngModel)]="arrival" />
<hx-date-picker inline ariaLabel="Arrival" [(ngModel)]="arrival" />
<hx-date-picker inline selectionMode="range" [minDate]="today" [firstDayOfWeek]="1" [(value)]="stay" />
```

| Input                   | Type                                  | Default    | Description                                       |
| ----------------------- | ------------------------------------- | ---------- | ------------------------------------------------- |
| `inline`                | `boolean`                             | `false`    | The calendar in the page, without a field.        |
| `showIcon`              | `boolean`                             | `false`    | A calendar button at the end of the field.        |
| `showButtonBar`         | `boolean`                             | `false`    | Today and Clear under the calendar of the popup (`todayLabel`, `clearLabel`). |
| `dateFormat`            | `Intl.DateTimeFormatOptions`          | numeric `dd/mm/yyyy` order of the locale | Format of the text in the field. |
| `placeholder`, `inputId` | `string`                             |            | Of the text field.                                |
| `selectionMode`         | `'single' \| 'range' \| 'multiple'`   | `'single'` | What the value holds.                             |
| `minDate`, `maxDate`    | `Date \| null`                        | `null`     | Earliest and latest day.                          |
| `disabledDates`         | `Date[]`                              | `[]`       | Days that cannot be chosen.                       |
| `firstDayOfWeek`        | `number`                              | `0`        | `0` Sunday … `6` Saturday.                        |
| `locale`                | `string`                              | browser's  | BCP 47 tag for the names.                         |
| `ariaLabel`, `ariaLabelledby` | `string`                        | `Calendar` | Name of the calendar.                             |

- **Field:** it shows the value with `Intl.DateTimeFormat`. Typing a date parses it in the order the locale writes
  numbers (also `yyyy-mm-dd`); unreadable or disabled dates put the value back. A range reads as `a – b`, several days
  as `a, b`. The popup opens by click, by the button or Arrow Down; a range keeps it open until the second date.
- **Keyboard:** in the day grid the arrows move by a day or a week, Home and End to the start and end of the week, Page
  Up and Page Down by a month (with Shift by a year), Enter or Space selects. The grid is one tab stop.
- **Accessibility:** the popup is a non-modal dialog (`role="dialog"`, `aria-modal="false"`, labelled from the field);
  focus moves to the selected or today's day when it opens and returns to the field when it closes (Escape closes).
  The calendar is the WAI-ARIA date grid: `role="grid"` with column headers (`abbr` is the full weekday name),
  `role="gridcell"` with `aria-selected`, today has `aria-current="date"`, and every day button is named with the
  full date ("Friday, October 9, 2026"). Days outside `minDate`/`maxDate` or in `disabledDates` are `aria-disabled`.

## Auto complete

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

## Multi select

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

## Listbox

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

## Rating

`hx-rating` is a star rating. Each star is a visually hidden `input type="radio"` labelled "n stars", so the arrow
keys change the value. It works with `ngModel`, reactive forms (including `disable()`) and signal forms. The value
is a `number | null` (`null` until a star is chosen). The stars are drawn with the internal icons and the
`--h-rating-*` tokens.

```html
<hx-rating ariaLabel="Quality" [(ngModel)]="score" />
<hx-rating readonly [stars]="10" [value]="7" />
```

| Input                       | Type      | Default    | Description                                  |
| --------------------------- | --------- | ---------- | -------------------------------------------- |
| `stars`                     | `number`  | `5`        | Number of stars.                             |
| `readonly`                  | `boolean` | `false`    | Shows the value; no way to change it.        |
| `ariaLabel`, `ariaLabelledby` | `string` | `'Rating'` | Name of the group.                           |

- **Behaviour:** hovering previews the value (the hovered star and all before it). The stars up to the value are filled.
- **Accessibility:** `role="radiogroup"` with a radio per star named "1 star", "2 stars", …; Arrow keys move and
  choose, Tab enters and leaves the group. With `readonly` the rating is `role="img"` with the label "3 of 5 stars".

## Slider

`hx-slider` chooses a number, or with `range` a pair, on a track. It is built on native `<input type="range">`
elements (one, or two for a range), so the keyboard and screen readers work natively; the track and thumbs are drawn
with the `--h-slider-*` tokens. It works with `ngModel`, reactive forms (including `disable()`) and signal forms.

```html
<hx-slider ariaLabel="Volume" [(ngModel)]="volume" />
<hx-slider range ariaLabelStart="Minimum price" ariaLabelEnd="Maximum price" [min]="0" [max]="500" [(value)]="price" />
<hx-slider orientation="vertical" ariaLabel="Gain" [(value)]="gain" />
```

| Input                                   | Type                         | Default        | Description                                        |
| --------------------------------------- | ---------------------------- | -------------- | -------------------------------------------------- |
| `range`                                 | `boolean`                    | `false`        | Two thumbs; the value is `[start, end]`.           |
| `min`, `max`, `step`                    | `number`                     | `0`, `100`, `1` | Bounds and step.                                  |
| `orientation`                           | `'horizontal' \| 'vertical'` | `'horizontal'` | A vertical slider has its minimum at the bottom.   |
| `inputId`, `ariaLabel`, `ariaLabelledby` | `string`                    |                | `id` and name of the thumb of a single slider.     |
| `ariaLabelStart`, `ariaLabelEnd`        | `string`                     |                | Names of the two thumbs of a range.                |

- **Behaviour:** in a range the start thumb never passes the end thumb. Only the thumbs take the pointer in a
  range.
- **Keyboard:** the native range keys: arrows, Page Up/Down, Home, End.
- **Accessibility:** every thumb is an `input type="range"` with `aria-orientation`; give it a name with
  `ariaLabel` (`ariaLabelStart` and `ariaLabelEnd` for a range) or a `<label for>` with `inputId`.

## Toggle button

`hx-toggle-button` is a two-state button with its own labels, the look of one Select button segment. The value is
a `boolean`; it works with `ngModel`, reactive forms (including `disable()`) and signal forms (`[formField]`), or
`[(value)]` without forms.

```html
<hx-toggle-button onLabel="Subscribed" offLabel="Subscribe" onIcon="pi pi-check" [(ngModel)]="subscribed" />
<hx-toggle-button ariaLabel="Bold" onLabel="" offLabel="" onIcon="pi pi-bold" offIcon="pi pi-bold" [(value)]="bold" />
```

| Input                          | Type                             | Default    | Description                                        |
| ------------------------------ | -------------------------------- | ---------- | -------------------------------------------------- |
| `onLabel`, `offLabel`          | `string`                         | `Yes`, `No` | Text per state; empty for an icon-only button.     |
| `onIcon`, `offIcon`            | `string`                         | `''`       | Icon classes per state, for example `pi pi-check`. |
| `size`                         | `'small' \| 'medium' \| 'large'` | `'medium'` | Font size and padding.                             |
| `fluid`                        | `boolean`                        | `false`    | Full width of the container.                       |
| `inputId`, `ariaLabel`, `ariaLabelledby` | `string`               |            | `id` of the button, and its accessible name.       |

- **Accessibility:** a native `<button>` with `aria-pressed`; Enter and Space toggle it and the focus ring shows
  on keyboard focus. Icons are `aria-hidden`; an icon-only toggle needs `ariaLabel`. When the labels differ per
  state, an `ariaLabel` keeps the name stable, since `aria-pressed` already announces the state.

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
