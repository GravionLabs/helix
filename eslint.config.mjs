// @ts-check
// ESLint lints the Angular templates only; oxlint lints every .ts file, the Angular class rules included
// (ADR 0006 of GravionLabs/skills, #1116). Component templates live in .html files, so no processInlineTemplates.
import angular from 'angular-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.angular/**',
      '**/coverage/**',
      'apps/site/**',
      'apps/helix-demo/public/**',
      '.agents/**',
      '.claude/**',
      '.opencode/**',
      // deliberate violations, linted by scripts/tests/lint-probe.spec.ts
      'scripts/lint/probe/**',
      // deliberate violations, linted by scripts/tests/lint-preset-template.spec.ts
      'scripts/tests/fixtures/lint-preset/**',
    ],
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      // Guard against reintroducing *ngIf/*ngFor/*ngSwitch (#268)
      '@angular-eslint/template/prefer-control-flow': 'error',
    },
  },
);
