// The ESLint flat config of the Helix lint preset (ADR 0009).
import * as templateParser from '@angular-eslint/template-parser';
import noRawControl from './rules/no-raw-control.mjs';

export { helixAllow } from './allow.mjs';

/** The ESLint plugin with the `helix/*` template rules. */
export const plugin = {
  meta: { name: '@gravionlabs/helix-lint' },
  rules: { 'no-raw-control': noRawControl },
};

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    name: 'helix/templates',
    files: ['**/*.html'],
    languageOptions: { parser: templateParser },
    plugins: { helix: plugin },
    rules: { 'helix/no-raw-control': 'error' },
  },
];
