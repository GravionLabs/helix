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
    // type scale: a token or one step of the helix scale (rem steps of the shell headings and the form field sizes)
    'declaration-property-value-allowed-list': {
      'font-size': [
        '/^var\\(--/',
        '/^(inherit|initial|unset|revert|smaller|larger)$/',
        '/^(0\\.625|0\\.75|0\\.875|1|1\\.125|1\\.25|1\\.5|1\\.75|2|2\\.5)(rem|em)$/',
        '/^calc\\(/',
        '/^clamp\\(/',
      ],
    },
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
    // `//` alone on a line separates paragraphs of a comment (the _icons.scss header)
    'scss/comment-no-empty': null,
    // oxfmt breaks long `calc()` after an operator
    'scss/operator-no-newline-after': null,
    // an Angular `styleUrl` needs its file even when a component has no styles yet
    'no-empty-source': null,
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
