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

- Import specifiers rewritten: `primeng/<entry>` → `@gravionlabs/helix/<entry>`.
- All component/directive selectors renamed `p-` → `h-` (`p-button` → `h-button`,
  `pButton` → `hButton`), including template usages and input aliases.
- **Not renamed:** `.p-*` CSS class names and `--p-*` design tokens — they are
  produced by the pinned `@primeuix/styles`/`@primeuix/styled` layer, which is
  an external dependency, not part of the fork (see #212).
- Build adapted from the upstream Nx/prebuild setup to this workspace's plain
  ng-packagr configuration (`ng build helix`); the per-entry-point
  `ng-package.json` files are upstream's, with `$schema` paths adjusted.
- Upstream `*.spec.ts` files are vendored unmodified apart from the import
  rewrite; they are excluded from the library build and not yet adapted to the
  renamed selectors or this workspace's test runner.

## Diffing against upstream

```sh
git clone --depth 1 --branch 21.1.9 https://github.com/primefaces/primeng
diff -r primeng/packages/primeng/src projects/helix
```
