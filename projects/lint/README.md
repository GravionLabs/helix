# @gravionlabs/helix-lint

The lint preset of Helix: a Stylelint config and an ESLint flat config that enforce the UX style guide. See
[ADR 0009](../../docs/adr/0009-type-scale-spacing-form-field-list-row-and-lint-preset.md).

- `@gravionlabs/helix-lint/stylelint`: the Stylelint config.
- `@gravionlabs/helix-lint/eslint`: the ESLint flat config.

`stylelint`, `eslint` and `@angular-eslint/template-parser` are peer dependencies.

```sh
pnpm add -D @gravionlabs/helix-lint
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

The package is in development: the Stylelint config is an empty placeholder (#1212).
