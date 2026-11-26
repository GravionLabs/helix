# Helix lint preset (`@gravionlabs/helix-lint`)

The lint preset enforces the part of the [UX rules](UX-RULES.md) a linter can check: colors and font sizes come from
the tokens, and a raw control in a template needs its Helix directive or component. It is a Stylelint config and an
ESLint flat config ([ADR 0009](adr/0009-type-scale-spacing-form-field-list-row-and-lint-preset.md)). Helix lints
itself with it.

## Install

```sh
pnpm add -D @gravionlabs/helix-lint stylelint eslint @angular-eslint/template-parser
```

`stylelint` (18), `eslint` (10) and `@angular-eslint/template-parser` (22) are peer dependencies.

| Name                                | What it is                   |
| ----------------------------------- | ---------------------------- |
| `@gravionlabs/helix-lint`           | The package                  |
| `@gravionlabs/helix-lint/stylelint` | The Stylelint config         |
| `@gravionlabs/helix-lint/eslint`    | The ESLint flat config       |
| `helix/no-raw-control`              | The template rule            |
| `helixAllow`                        | The allowlist helper of both |

## Commands

```sh
stylelint "**/*.{css,scss}"
eslint "**/*.html"
```

Both commands lint every matching file, so leave build output out: `ignoreFiles` in the Stylelint config, an
`ignores` entry in the ESLint config. The template rule checks `.html` files; these commands do not check inline
templates in `.ts` files.

## Stylelint

The preset sets three rules, no `extends` and no formatting rules; add it next to your base config. SCSS needs a base
config that parses it, such as `stylelint-config-standard-scss` (install it separately).

```js
// stylelint.config.mjs
export default {
  extends: ['stylelint-config-standard-scss', '@gravionlabs/helix-lint/stylelint'],
  ignoreFiles: ['dist/**'],
};
```

| Rule                                      | Result                                                      |
| ----------------------------------------- | ----------------------------------------------------------- |
| `color-no-hex`                            | no hex colors                                               |
| `function-disallowed-list`                | no `rgb()`, `rgba()`, `hsl()` or `hsla()`                   |
| `declaration-property-value-allowed-list` | `font-size` only from the type scale, a keyword or a `calc` |

Allowed as `font-size`: `var(--h-font-size-*)`, `inherit`, `initial`, `unset`, `revert`, `smaller`, `larger`, and
`calc()` or `clamp()` over `--h-font-size-*` tokens and unitless numbers. Everything else is reported: `px`, `rem` and
`em` values, and every other `var()`, component tokens included. [Theming](THEMING.md) lists the type scale.

## ESLint

```js
// eslint.config.mjs
import helix from '@gravionlabs/helix-lint/eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig({ ignores: ['dist/**'] }, helix);
```

The preset parses `**/*.html` with the Angular template parser and reports `helix/no-raw-control` as an error. It adds
no other rule; keep your angular-eslint template configs next to it.

| Raw element  | Result                                                     |
| ------------ | ---------------------------------------------------------- |
| `<button>`   | needs `hx-button` or `hx-list-row`                         |
| `<input>`    | needs `hx-input`, `hx-checkbox`, `hx-radio` or `hx-switch` |
| `<textarea>` | needs `hx-input`                                           |
| `<select>`   | always reported, use `hx-select`                           |
| `<progress>` | always reported, use `hx-progress-bar`                     |

`<input type="hidden">`, and `<input type="file">` inside `hx-file-upload`, are not reported.

## Allowlist

`helixAllow({ files, rules, reason })` writes every exception. `files` names the files the entry covers, `rules` the
rules it turns off there, and `reason` says why. It throws without one of the three, so an entry without a reason
fails the lint run. Each preset exports its own `helixAllow`.

For Stylelint the entry goes into `overrides`:

```js
// stylelint.config.mjs
import { helixAllow } from '@gravionlabs/helix-lint/stylelint';

export default {
  extends: ['stylelint-config-standard-scss', '@gravionlabs/helix-lint/stylelint'],
  overrides: [
    helixAllow({
      files: ['src/app/legacy/**'],
      rules: ['declaration-property-value-allowed-list'],
      reason: 'Off-scale sizes until the legacy screens move to the type scale',
    }),
  ],
};
```

For ESLint it is a config object; put it after the preset:

```js
// eslint.config.mjs
import helix, { helixAllow } from '@gravionlabs/helix-lint/eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  helix,
  helixAllow({
    files: ['src/app/legacy/**'],
    rules: ['helix/no-raw-control'],
    reason: 'Native file input until the upload screen moves to hx-file-upload',
  }),
);
```

## Adopting the preset in an app

An app adopts the preset, and every new or stricter rule of a later release, through an allowlist phase
([ADR 0008](adr/0008-ux-style-guide-a-helix-base-guide-that-app-guides-extend.md), Consequences), so a Helix release
does not turn its CI red at once:

1. Add the preset and run both commands.
2. Write one `helixAllow` entry, with its reason, for what you do not fix in the same change.
3. Let the lint run block in CI, so new code follows the rules.
4. Migrate the allowed files and remove their entries.
