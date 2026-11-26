# ADR 0009: Type scale, spacing, form field, list row and lint preset

- Status: Accepted
- Date: 2026-11-26
- Issues: #1215, #1206
- Builds on: [ADR 0008](0008-ux-style-guide-a-helix-base-guide-that-app-guides-extend.md), [ADR 0004](0004-surface-roles-dark-elevation-density-and-named-theme-presets.md)

## Context

ADR 0008 decides that every rule of the UX style guide names the Helix component, directive or token that carries it,
and that Helix publishes a lint preset. It does not say what the missing carriers look like. Today there are no type
scale or spacing tokens, no form field, no list row and no lint package, so apps hand-build them (#1206). The names
are a public API: apps, the style guide and the `ui-styleguide` skill (GravionLabs/skills#1031) depend on them.

## Decision

### Type scale and spacing

Both scales are in `rem`, so the `compact` density of ADR 0004 (13 px root) scales them with no further token layer.
The type scale uses t-shirt names, spacing uses numbers in steps of 0.25rem.

| Type token          | Value    |
| ------------------- | -------- |
| `--h-font-size-xs`  | 0.75rem  |
| `--h-font-size-sm`  | 0.875rem |
| `--h-font-size-md`  | 1rem     |
| `--h-font-size-lg`  | 1.125rem |
| `--h-font-size-xl`  | 1.25rem  |
| `--h-font-size-2xl` | 1.5rem   |
| `--h-font-size-3xl` | 2rem     |

| Spacing token | Value   |
| ------------- | ------- |
| `--h-space-1` | 0.25rem |
| `--h-space-2` | 0.5rem  |
| `--h-space-3` | 0.75rem |
| `--h-space-4` | 1rem    |
| `--h-space-5` | 1.25rem |
| `--h-space-6` | 1.5rem  |
| `--h-space-7` | 1.75rem |
| `--h-space-8` | 2rem    |

The steps 0.625rem, 1.75rem and 2.5rem, which `stylelint.config.mjs` of this repository allows as font sizes today,
get **no token**. Helix keeps them in its local Stylelint override until its own styles have migrated; the published
preset does not allow them.

### Form field: `hx-field`

`hx-field` is a component around one projected control.

```html
<hx-field label="Repository URL" hint="HTTPS or SSH" [error]="urlError" required>
  <input hx-input formControlName="url" />
</hx-field>
```

| Input      | Meaning                     |
| ---------- | --------------------------- |
| `label`    | The visible label           |
| `hint`     | Help text for the control   |
| `error`    | Error text for the control  |
| `required` | Marks the field as required |

- It projects exactly one control: `hx-input`, `hx-checkbox`, `hx-radio`, `hx-switch`, `hx-select` or another Helix
  form control.
- It wires `id` of the control and `for` of the label, `aria-describedby` (to the hint and error texts) and
  `aria-invalid`. The app writes none of these by hand.
- It reads the control state from `NgControl` (reactive and template-driven forms) or from the signal forms
  `FormField`.

### List row: `hx-list` and `[hx-list-row]`

The list row is a primitive: a container and a directive on a native element.

```html
<hx-list>
  <button hx-list-row [selected]="isSelected" type="button">main</button>
  <a hx-list-row [current]="isCurrent" href="/settings">Settings</a>
</hx-list>
```

- `hx-list` is the container. It owns the keyboard: roving focus, the arrow keys, Home and End. Typeahead is
  optional.
- `[hx-list-row]` goes on a `button` or an `a`, so activation and link behaviour stay native. It has two states,
  `selected` and `current`.
- Both states work on light and dark surfaces, using the surface roles of ADR 0004.

### Lint preset: `@gravionlabs/helix-lint`

- A separate package of plain files, with no Angular build. `stylelint`, `eslint` and the angular-eslint template
  parser (`@angular-eslint/template-parser`) are peer dependencies.
- Two export paths:

  | Export path                         | Content                |
  | ----------------------------------- | ---------------------- |
  | `@gravionlabs/helix-lint/stylelint` | The Stylelint config   |
  | `@gravionlabs/helix-lint/eslint`    | The ESLint flat config |

- The Stylelint config forbids hex colors and raw color functions (ADR 0008) and allows as `font-size` only the
  tokens (`var(--h-font-size-*)`) and the CSS keywords. It allows no `rem` values.
- The ESLint config contains the template rule **`helix/no-raw-control`**: it reports a raw `<button>`, `<input>`,
  `<select>`, `<textarea>` or `<progress>` without a Helix directive (ADR 0008).
- **Allowlist.** One helper, `helixAllow({ files, rules, reason })`, writes every exception, for Stylelint and for
  ESLint. `files` names the files the entry covers, `rules` the rules it allows there, and `reason` says why. The
  helper throws when `reason` is missing, so an entry without a reason fails the lint run.

  ```js
  helixAllow({
    files: ['src/app/legacy/**'],
    rules: ['helix/no-raw-control'],
    reason: 'Native file input until the upload screen moves to hx-file-upload',
  });
  ```

## Consequences

- The style guide and the app guides can name tokens, components and rules before the implementations land. A later
  rename is a breaking change and needs a new ADR.
- The scales follow the density: in `compact`, `--h-font-size-xs` renders at 9.75 px and `--h-space-4` at 13 px.
- `hx-field` needs a way to hand `id` and the ARIA attributes to every control. Native controls take attributes;
  composite controls take inputs today (`inputId`, and `ariaDescribedby` only on `hx-select`), so they have to be
  extended. The `aria-invalid` it sets has to agree with what a control already shows from the forms state.
- Apps that use the preset replace `rem` font sizes with tokens. A component font-size token such as
  `var(--h-button-sm-font-size)` is not a type scale token either, so Helix cannot adopt the preset for its own styles
  before it migrates; until then it keeps its local config.
- One more package to version and publish, and its peer ranges have to follow Stylelint, ESLint and angular-eslint.
- As in ADR 0008, apps adopt a new or stricter rule through allowlist entries first.

## Alternatives

- **Rely on ADR 0008 for the API shape.** Rejected: it decides that the carriers exist, not their names, and the
  implementations and GravionLabs/skills#1031 need fixed names.
- **Numeric type scale, or t-shirt spacing.** Rejected: t-shirt names read well for seven type steps; numbers say the
  multiple of 0.25rem for spacing.
- **Tokens in `px`.** Rejected: they would not follow the density.
- **Tokens for 0.625, 1.75 and 2.5rem.** Rejected: they would make off-scale sizes of today's Helix styles part of
  the public scale.
- **A form field directive, or label and error wired by each app.** Rejected: a component owns the label, the texts
  and the ARIA wiring in one place.
- **A list component that renders rows from data.** Rejected: apps need their own row content on native buttons and
  links; a primitive adds only focus handling and states.
- **The preset inside `@gravionlabs/helix-ui`.** Rejected: it is plain config with its own peer dependencies and
  needs no Angular build.
- **A custom script for the template check.** Rejected: an ESLint template rule runs in the linter and the editor the
  apps already use, with the angular-eslint parser.
- **`rem` steps allowed as font sizes in the preset.** Rejected: a token and its literal value would both pass, and
  the scale could not change in one place.
- **Each tool's own override and disable comments as the allowlist.** Rejected: neither requires a reason in one
  common format.
