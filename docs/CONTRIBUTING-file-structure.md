# Component File-Structure Convention

Decided in epic #233 (feature #241); analysis in
[migrations/file-separation-analysis.md](migrations/file-separation-analysis.md).
The vendored-fork rule was revised by epic #297 (feature #298) on 2026-07-15:
the fork no longer tracks upstream, so fork components now also use separate
`.html` files.

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

Fork components use separate `.html` template files (epic #297); styles stay
in the TS token system (`style/*style.ts`), unchanged. Reference example:
`projects/helix/knob/`.

Extraction rules:

- **Main component** in `<dir>/<name>.ts`: the template moves verbatim to
  `<dir>/<name>.html`; the decorator gets `templateUrl: './<name>.html'`.
- **Secondary components/directives** declared in the same file: their
  templates go to `<dir>/<lowercased-class-name>.html` (e.g. class
  `TableBody` in `table.ts` → `table/tablebody.html`).
- **Secondary components with templates under 10 lines** may stay inline.
- **Exempt:** the 55 SVG icon components under `projects/helix/icons/`
  (tiny static templates) keep their inline templates.
- Template text moves **verbatim**, only re-indented to the new file's
  baseline. No refactoring, no formatting changes, no attribute reordering.

ng-packagr inlines `templateUrl` at build time, so extraction has zero
runtime impact on the published library.

## Control flow

All templates — own code and fork alike — use built-in control flow
(`@if`/`@for`/`@switch`). `*ngIf`/`*ngFor`/`*ngSwitch` are forbidden and
enforced by `@angular-eslint/template/prefer-control-flow` (see
`eslint.config.js`), which also covers inline templates.
