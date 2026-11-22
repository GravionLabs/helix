# Component File-Structure Convention

Decided in epic #233 (feature #241); analysis in
[migrations/file-separation-analysis.md](migrations/file-separation-analysis.md).

## Own code (`helix-shell`, `helix-zod`, `helix-ag-grid`, `helix-demo`)

- **Templates**: always a separate `.html` file via `templateUrl`, also for
  trivial ones (#1116). oxlint fails an inline `template:` outside spec files
  (`@angular-eslint/component-max-inline-declarations`), because ESLint lints
  `**/*.html` only. A file with one component uses `component-name.html`; a
  file with several uses the kebab-case class name without the `Hx`/`Helix`
  prefix (`tabs.ts`: `tab-list.html`, `tab-panel.html`, …). Test hosts in spec
  files keep inline templates.
- **Styles**: a `component-name.scss` via `styleUrl` when the component has its
  own styles (Tailwind-utility-only components usually don't need one); short
  inline `styles` are fine.
- One directory per component, files share the component's kebab-case name
  (see `projects/shell/src/lib/layout/components/` for the reference
  layout).

## Control flow

All templates use built-in control flow
(`@if`/`@for`/`@switch`). `*ngIf`/`*ngFor`/`*ngSwitch` are forbidden and
enforced by `@angular-eslint/template/prefer-control-flow` (see
`eslint.config.mjs`).

## Lint and format

- `pnpm lint`: oxlint lints every `.ts` file, type-aware, with the Angular
  class rules (`@angular-eslint/eslint-plugin` as an oxlint JS plugin) and
  helix's own rules (`scripts/lint/oxlint-plugin-helix.mjs`, for example
  `helix/no-decorator-api` against `@Input()`/`@Output()`/… in the libraries,
  #373); ESLint lints the templates (`**/*.html`, template and accessibility
  rules). Config: `.oxlintrc.json`, `eslint.config.mjs`. `pnpm lint` builds
  `dist/ui` first when it is missing: the other projects import
  `@gravionlabs/helix-ui` from there, and the type-aware rules need its types.
- `pnpm lint:styles` (part of `pnpm lint`; `pnpm lint:fix` fixes): Stylelint
  lints every `.css` and `.scss` file (`stylelint.config.mjs`,
  `stylelint-config-standard-scss`). The token rule: no hex colors and no
  `rgb()`/`rgba()`/`hsl()`/`hsla()` in component styles, and `font-size` is a
  `var(--…)` or a step of the type scale; use a token (`var(--h-…)`). Only
  files that define tokens or are generated may use raw values, through an
  `overrides` entry that names its reason. Formatting stays with oxfmt.
- `pnpm format` / `pnpm format:check`: oxfmt (`.oxfmtrc.json`).
- A disabled rule, in the config or in an `oxlint-disable-next-line` /
  `eslint-disable-next-line` comment, names its reason.
- `scripts/lint/probe/` holds deliberate violations; `scripts/tests/lint-probe.spec.ts`
  fails when oxlint or ESLint stops reporting one of them (for example after a
  tool update).
