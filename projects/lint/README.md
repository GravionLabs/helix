# @gravionlabs/helix-lint

The lint preset of Helix: a Stylelint config and an ESLint flat config that enforce the UX style guide. See
[ADR 0009](../../docs/adr/0009-type-scale-spacing-form-field-list-row-and-lint-preset.md).

- `@gravionlabs/helix-lint/stylelint`: the Stylelint config.
- `@gravionlabs/helix-lint/eslint`: the ESLint flat config.

`stylelint`, `eslint` and `@angular-eslint/template-parser` are peer dependencies.

```sh
pnpm add -D @gravionlabs/helix-lint
```

## Stylelint

| Rule                                      | Result                                                      |
| ----------------------------------------- | ----------------------------------------------------------- |
| `color-no-hex`                            | no hex colors                                               |
| `function-disallowed-list`                | no `rgb()`, `rgba()`, `hsl()` or `hsla()`                   |
| `declaration-property-value-allowed-list` | `font-size` only from the type scale, a keyword or a `calc` |

Allowed as `font-size`: `var(--h-font-size-*)`, `inherit`, `initial`, `unset`, `revert`, `smaller`, `larger`, and
`calc()` or `clamp()` over `--h-font-size-*` tokens and unitless numbers. Every other `var()`, component tokens
included, is reported.

The preset sets no `extends` and no formatting rules; add it next to your base config. `helixAllow` writes an
exception as an `overrides` entry. It throws without `files`, `rules` or a `reason`.

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

## ESLint

The preset checks the templates (`**/*.html`) with `helix/no-raw-control`:

| Raw element  | Result                                                     |
| ------------ | ---------------------------------------------------------- |
| `<button>`   | needs `hx-button` or `hx-list-row`                         |
| `<input>`    | needs `hx-input`, `hx-checkbox`, `hx-radio` or `hx-switch` |
| `<textarea>` | needs `hx-input`                                           |
| `<select>`   | always reported, use `hx-select`                           |
| `<progress>` | always reported, use `hx-progress-bar`                     |

`<input type="hidden">`, and `<input type="file">` inside `hx-file-upload`, are not reported.

`helixAllow` writes an exception. It throws without `files`, `rules` or a `reason`. Put its entries after the preset.

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

The package is in development. Adoption follows in #1214.
