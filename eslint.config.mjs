// @ts-check
// ESLint lints the Angular templates only; oxlint lints every .ts file, the Angular class rules included
// (ADR 0006 of GravionLabs/skills, #1116). Component templates live in .html files, so no processInlineTemplates.
// The Helix lint preset (docs/LINT.md) adds helix/no-raw-control; it is imported by path because the package is
// built from this repository.
import angular from 'angular-eslint';
import { defineConfig } from 'eslint/config';
import helix, { helixAllow } from './projects/lint/eslint.mjs';

const RAW_CONTROL = 'helix/no-raw-control';

/** The allowlist entry of one demo file that still has raw controls. */
const demo = (file, reason) =>
  helixAllow({ files: [`apps/helix-demo/src/app/${file}`], rules: [RAW_CONTROL], reason });

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
  helix,
  helixAllow({
    files: ['projects/**'],
    rules: [RAW_CONTROL],
    reason: 'The library sources implement the Helix primitives, so their templates hold the raw controls',
  }),
  // demo files that still have raw controls; remove an entry when its file uses the Helix directives
  demo(
    'pages/code/changed-files/code-changed-files-demo.html',
    'Row actions projected into hx-changed-files are native buttons with the p-button classes',
  ),
  demo(
    'pages/code/commit-graph/code-commit-graph-demo.html',
    'Row action and reveal buttons are native buttons with the p-button classes',
  ),
  demo(
    'pages/code/conflict-markers/conflict-markers.html',
    'The reset button is a native button with the p-button classes',
  ),
  demo(
    'pages/code/conflict-merge/conflict-merge-demo.html',
    'The button that opens the merge is a native button with the p-button classes',
  ),
  demo(
    'pages/code/diff/code-diff-demo.html',
    'Native buttons, radios, a checkbox and a range input drive the diff view options',
  ),
  demo(
    'pages/code/editor/code-editor-demo.html',
    'Native file buttons and checkboxes drive the editor options',
  ),
  demo(
    'pages/code/language/code-language-demo.html',
    'The file buttons are native buttons with the p-button classes',
  ),
  demo(
    'pages/code/review/review-demo.html',
    'A native checkbox and unstyled buttons drive the review example',
  ),
  demo(
    'pages/desktop/components/desktop-components-demo.html',
    'Unstyled buttons as sample content of the desktop and mobile shell slots',
  ),
  demo(
    'pages/desktop/overview/desktop-overview-demo.html',
    'Hand-styled bar, notice, space and pane buttons of the desktop mock-up',
  ),
  demo(
    'shell/app-shell.html',
    'The reload action in the status bar is a native button styled as a status bar item',
  ),
);
