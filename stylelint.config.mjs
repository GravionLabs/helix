// Stylelint config of this repository (#1168). oxlint lints only JS/TS; this lints CSS and SCSS and enforces the
// design tokens (projects/tokens/src, exported as CSS by `pnpm tokens:export`) with the Helix lint preset
// (docs/LINT.md), imported by path because the package is built from this repository. Formatting stays with oxfmt.
import preset, { helixAllow } from './projects/lint/stylelint.mjs';

const FONT_SIZE = 'declaration-property-value-allowed-list';

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
    // token rules of the preset: no hex colors, no raw color functions, font sizes from the type scale
    ...preset.rules,
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
  },
  overrides: [
    // a later entry replaces the value of `rules` set before it, so the allowlist entries stay last
    {
      // still enforced, with a wider value list than the preset; the helper checks files, rules and reason
      ...helixAllow({
        files: ['**/*.{css,scss}'],
        rules: [FONT_SIZE],
        reason:
          'Helix has not migrated its own CSS to the type scale tokens: rem and em steps of the scale, component font-size tokens and calc() or clamp() stay allowed until it does',
      }),
      rules: {
        [FONT_SIZE]: {
          'font-size': [
            '/^var\\(--/',
            '/^(inherit|initial|unset|revert|smaller|larger)$/',
            '/^(0\\.625|0\\.75|0\\.875|1|1\\.125|1\\.25|1\\.5|1\\.75|2|2\\.5)(rem|em)$/',
            '/^calc\\(/',
            '/^clamp\\(/',
          ],
        },
      },
    },
    helixAllow({
      files: [
        'apps/helix-demo/src/app/pages/desktop/overview/desktop-overview-demo.scss',
        'apps/helix-demo/src/app/pages/uikit/dynamicform-json/dynamic-form-json-demo.scss',
        'apps/helix-demo/src/app/shared/source-tabs/source-tabs.scss',
        'projects/desktop/styles/styles.css',
        'projects/shell/src/lib/layout/components/nav-rail-item/nav-rail-item.scss',
        'projects/shell/src/lib/layout/components/nav-rail/nav-rail.scss',
        'projects/shell/src/lib/layout/components/topbar/actions/alert-action.scss',
        'projects/shell/src/lib/ui/empty-state/empty-state.scss',
      ],
      rules: [FONT_SIZE],
      reason:
        'Sizes off the type scale (px and odd rem values): snapping them changes the rendered output, so they stay until a design review picks scale steps',
    }),
    helixAllow({
      files: ['projects/shell/globals-src.css'],
      rules: [FONT_SIZE],
      reason:
        'Opt-in page globals: the 14px base size of the page is deliberately in px (scripts/tests/shell-css.spec.ts asserts it)',
    }),
  ],
};
