// Stylelint config of this repository (#1168). oxlint lints only JS/TS; this lints CSS and SCSS and enforces the
// design tokens (projects/tokens/src, exported as CSS by `pnpm tokens:export`). Formatting stays with oxfmt.
/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss'],
  ignoreFiles: [
    '**/dist/**',
    '**/node_modules/**',
    '**/.angular/**',
    '**/coverage/**',
    'scripts/tests/fixtures/**',
    'apps/site/.vitepress/cache/**',
    'apps/site/.vitepress/dist/**',
  ],
  rules: {
    // switched off: helix classes are `helix-x__y--z` / `hx-` BEM, not kebab-case
    'selector-class-pattern': null,
    // switched off: blank lines are formatting; oxfmt owns formatting and keeps the author's blank lines
    'at-rule-empty-line-before': null,
    'rule-empty-line-before': null,
    'declaration-empty-line-before': null,
    'custom-property-empty-line-before': null,
    'comment-empty-line-before': null,
    'scss/double-slash-comment-empty-line-before': null,
    'scss/dollar-variable-empty-line-before': null,
    // `-webkit-mask` stays: the unprefixed property is not enough for every WebKit/Blink the demo supports
    'property-no-vendor-prefix': null,
    // Tailwind v4 theme namespaces such as `--breakpoint-*` and `--color-*`
    'custom-property-pattern': null,
    // Tailwind v4 at-rules of the shell and desktop CSS
    'scss/at-rule-no-unknown': [
      true,
      { ignoreAtRules: ['theme', 'utility', 'custom-variant', 'variant', 'source', 'plugin', 'apply', 'config', 'reference'] },
    ],
    // the former Biome rules
    'declaration-block-no-duplicate-properties': [
      true,
      { ignore: ['consecutive-duplicates-with-different-values'] },
    ],
    'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['ng-deep'] }],
    // token rules: colors come from tokens, not from raw values
    'color-no-hex': true,
    'function-disallowed-list': ['rgb', 'rgba', 'hsl', 'hsla'],
  },
  overrides: [],
};
