# Component File-Structure Convention

Decided in epic #233 (feature #241); analysis in
[migrations/file-separation-analysis.md](migrations/file-separation-analysis.md).

## Own code (`helix-shell`, `helix-zod`, `helix-ag-grid`, `helix-demo`)

- **Trivial templates** (a handful of lines, no branching worth reading in
  isolation): inline `template:` in the component file is fine.
- **Everything else**: separate `component-name.html` via `templateUrl`, and a
  `component-name.scss` via `styleUrl` when the component has its own styles
  (Tailwind-utility-only components usually don't need one).
- One directory per component, files share the component's kebab-case name
  (see `projects/helix-shell/src/lib/layout/components/` for the reference
  layout).

## Vendored fork (`projects/helix`)

- Always mirrors upstream PrimeNG's single-file layout: inline template,
  styles via the TS token system (`style/*style.ts`).
- Never split fork components, regardless of template size — upstream
  diffability wins. If a component is ever deliberately forked away from
  upstream, its file structure (and its decorator APIs, see
  [migrations/signals-audit.md](migrations/signals-audit.md)) can be
  reconsidered at that point.

## Control flow

All templates — own code and fork alike — use built-in control flow
(`@if`/`@for`/`@switch`). `*ngIf`/`*ngFor`/`*ngSwitch` are forbidden and
enforced by `@angular-eslint/template/prefer-control-flow` (see
`eslint.config.js`), which also covers inline templates.
