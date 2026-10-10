# ADR 0002: Retire helix-core — helix-ui is the only component library

- Status: accepted
- Date: 2026-10-10
- Issues: #585 (epic), #584 (consumers), #523 (the new library), #600, #601

## Context

[ADR 0001](0001-styling-foundation.md) decided on 2026-10-07 to give Helix its own look as design tokens on the
vendored PrimeNG fork (`@gravionlabs/helix-core`, 90 components, `h-` selectors, a vendored styling engine) *now*
and to replace the fork with a vanilla Angular library (`@gravionlabs/helix-ui`, `hx-` selectors, plain CSS)
as the long-term target.

The target was reached within days: `helix-ui` has 47 components (data grids use AG Grid through
`helix-ag-grid`; own Table and Paginator components are deferred), the token data lives in `projects/tokens`
with its own resolver, theming runs on CSS custom properties and `HxTheme`, and `helix-shell`, `helix-zod`,
`helix-ag-grid`, the demo, the docs and the Design System generator no longer import `helix-core`.

## Decision

- `helix-core` is removed from the workspace (`projects/core`, its Angular project, build, test and publish
  wiring). Nothing in the repository imports it; `pnpm lint:no-core` keeps it that way.
- `@gravionlabs/helix-ui` is the only component library. There is no migration guide: the maintainer is the
  only consumer of `helix-core`.
- The published versions of `@gravionlabs/helix-core` stay on npm; marking the package deprecated (`npm
  deprecate`) is a manual step of the maintainer, not part of the repository.
- Attribution stays where derived material remains: token values from the Aura preset of PrimeUIX / PrimeNG and
  the Tailwind palettes (`projects/tokens/NOTICE`), the vendored Tailwind plugin of the shell
  (`projects/shell/VENDOR.md`). The documentation no longer describes Helix as a PrimeNG fork.

## Consequences

- One component library, one prefix (`hx-`), no runtime styling engine, a smaller repository and CI.
- Applications on `helix-core` (there are none besides the demo, which moved) have no upgrade path other than
  rewriting to `helix-ui`; the component docs (`docs/components`) are the reference.
- Table and Paginator are not available as Helix components; AG Grid and the simple `table[hx-table]` styles
  cover the cases so far.

## Addendum (2026-10-10)

The deferred Paginator and Table were built after this decision: `hx-paginator` and `hx-data-table` (column model,
sorting, paging, lazy loading, selection, filters, row expansion) are part of `helix-ui`, so the last bullet of the
consequences above no longer holds. AG Grid remains the choice for large or very interactive grids.
