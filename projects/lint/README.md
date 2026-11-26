# @gravionlabs/helix-lint

The lint preset of Helix: a Stylelint config and an ESLint flat config that enforce the UX style guide. See
[ADR 0009](../../docs/adr/0009-type-scale-spacing-form-field-list-row-and-lint-preset.md).

- `@gravionlabs/helix-lint/stylelint`: the Stylelint config.
- `@gravionlabs/helix-lint/eslint`: the ESLint flat config.

`stylelint`, `eslint` and `@angular-eslint/template-parser` are peer dependencies.

```sh
pnpm add -D @gravionlabs/helix-lint
```

The package is in development: both configs are empty placeholders. Usage follows in #1214.
