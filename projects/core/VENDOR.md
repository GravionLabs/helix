# Vendored source: PrimeNG 21.1.9

This library is a vendored fork of PrimeNG, imported from the last MIT
community version. Record kept for future diffing against upstream.

| | |
| --- | --- |
| Upstream repository | https://github.com/primefaces/primeng |
| Upstream path | `packages/primeng/src` |
| Tag | `21.1.9` |
| Commit | `c493b1c6d9f7cdffbe1c4dc195493dd73d733593` |
| License at tag | MIT — "PRIMENG COMMUNITY VERSIONS LICENSE" (see `LICENSE.md`) |
| Imported | 2026-07-13 (epic #201, feature #203) |

## Local modifications

- Import specifiers rewritten: `primeng/<entry>` → `@gravionlabs/helix-core/<entry>`.
- All component/directive selectors renamed `p-` → `h-` (`p-button` → `h-button`,
  `pButton` → `hButton`), including template usages and input aliases.
- **Not renamed:** `.p-*` CSS class names and `--p-*` design tokens — they are
  produced by the pinned `@primeuix/styles`/`@primeuix/styled` layer, which is
  an external dependency, not part of the fork (see #212).
- Build adapted from the upstream Nx/prebuild setup to this workspace's plain
  ng-packagr configuration (`ng build core`); the per-entry-point
  `ng-package.json` files are upstream's, with `$schema` paths adjusted.
- Upstream `*.spec.ts` files are vendored unmodified apart from the import
  rewrite; they are excluded from the library build and not yet adapted to the
  renamed selectors or this workspace's test runner.

## Diffing against upstream

```sh
git clone --depth 1 --branch 21.1.9 https://github.com/primefaces/primeng
diff -r primeng/packages/primeng/src projects/core
```

# Vendored source: primeuix

The `@primeuix/*` packages PrimeNG 21.1.9 depends on for styling and theming
(`utils`, `motion`, `styled`, `styles`, `themes`) are also vendored in, one at
a time, as they no longer publish MIT versions past the pins below (epic #421).
Each is copied from `github.com/primefaces/primeuix` (MIT) into a new
`uix/<pkg>` (or `themes`) secondary entry point of this library, keeping
upstream's internal file layout for future diffing.

| Package | Pinned version | Upstream commit | Notes |
| --- | --- | --- | --- |
| `utils` | 0.7.2 | [`main`](https://github.com/primefaces/primeuix) @ 0.6.4, hand-ported to 0.7.2 | `isCssSupported` (new in 0.7.x), `toElement` (ref-unwrapping superset), `setAttribute` (style-object handling) manually ported on top of the 0.6.4 source — see doc comments on the touched files under `uix/utils/dom/methods/`. |
| `motion` | 0.0.10 | [`6835ef4347`](https://github.com/primefaces/primeuix/commit/6835ef4347) (the 0.0.10 version-bump commit; `main` had since moved to 0.0.11 with unrelated new features, deliberately not picked up) | Vendored unmodified apart from import rewrites (`@primeuix/utils` → `uix/utils`) and flattening the package's `types/index.ts` into a sibling `types.ts`. |
| `styled` | 0.7.4 | [`main`](https://github.com/primefaces/primeuix) @ 0.7.4 (matches the pin exactly) | Vendored unmodified apart from import rewrites (`@primeuix/utils`(`/eventbus`, `/object`) → `uix/utils`). The entry point keeps upstream's `public_api.ts` (renamed from `index.ts`) at its root; two files (`helpers/css.ts`, `helpers/color/palette.ts`) that did a bare directory import of the package root were pointed at `./public_api` explicitly, since ng-packagr refuses an `index.ts` living alongside a differently-named entry file. |
| `styles` | 2.0.3 | [`main`](https://github.com/primefaces/primeuix) @ 2.0.3 (matches the pin exactly) | Not a separate entry point — each of the 84 component CSS-in-JS modules actually imported (`packages/styles/src/<name>/index.ts`) was copied verbatim next to the component's existing `*style.ts` as `<component>/style/<name>.css.ts`, and the importing file's `from '@primeuix/styles/<name>'` was pointed at the new relative file. Upstream has no cross-module imports in this package, so this was a pure mechanical move. |

## Diffing against upstream primeuix

```sh
git clone --depth 1 --branch main https://github.com/primefaces/primeuix
diff -r primeuix/packages/utils/src projects/core/uix/utils
```
