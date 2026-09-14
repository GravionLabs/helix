# Vendored source: tailwindcss-primeui

`styles/helix-tailwind/` is a vendored copy of the `tailwindcss-primeui`
Tailwind v4 CSS plugin, which maps Tailwind utilities/variants to PrimeNG's
`--p-*` design tokens and `data-p-*` state attributes.

| | |
| --- | --- |
| Upstream package | `tailwindcss-primeui` |
| Version | `0.6.1` |
| License | MIT |
| Source files | `node_modules/tailwindcss-primeui/v4/` |
| Vendored | 2026-09-14 (epic #421, feature #431) |

## Why

Feature #431 renames the `.p-*` CSS classes, `--p-*` design tokens, and
`data-p-*`/`data-p` state attributes produced by `@gravionlabs/helix-core`
to `.h-*`/`--h-*`/`data-h-*`/`data-h`. `tailwindcss-primeui` hardcodes the
old `--p-*`/`data-p-*` names throughout its utilities and custom variants
(color tokens, state variants like `p-invalid`/`p-disabled`, enter/leave
animation variables), so it would silently stop matching once helix-core's
own output changed. The package is tiny (~600 lines across 15 files) and
MIT-licensed, so it is vendored and renamed alongside the rest of the
prefix, rather than dropped or reconfigured (it has no `prefix` option
covering class-attribute selectors, only Tailwind's own theme-variable
prefixing, which doesn't reach into `@custom-variant` attribute matchers).

## Local modifications

Every `p-`/`--p-`/`data-p-`/`data-p` identifier was mechanically renamed to
`h-`/`--h-`/`data-h-`/`data-h` (word-boundary-safe: does not touch Tailwind's
own `p-4`/`px-2` spacing utilities, which start with a digit or a different
letter after the hyphen). No other change from upstream.

## Diffing against upstream

```sh
npm view tailwindcss-primeui@0.6.1 dist.tarball | xargs curl -L | tar xz package/v4
diff -r package/v4 projects/shell/styles/helix-tailwind
```
