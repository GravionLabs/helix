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
- `.p-*` CSS class names, `--p-*` design tokens, and `data-p-*`/`data-p` state
  attributes were renamed to `.h-*`/`--h-*`/`data-h-*`/`data-h` once the
  styling layer producing them was vendored in (epic #421 feature #431,
  2026-09-14) — see the "Vendored source: primeuix" section below.
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
| `themes` | 2.0.3 | [`main`](https://github.com/primefaces/primeuix) @ 2.0.3 (matches the pin exactly) | Vendored as `themes` (engine: `$t`, `updatePreset`, `updateSurfacePalette`, …), `themes/types` (design-token type declarations — its own entry point since presets need it cross-directory) and `themes/{aura,lara,nora}` (Material intentionally excluded per decision). Verified byte-for-byte deep-equal against the live `@primeuix/themes` package for all three presets. Two structural changes from upstream: (1) every component folder's redundant `index.d.ts` packaging shim was dropped (upstream ships a real `index.ts` *and* a near-duplicate hand-written `.d.ts` for its own dual-publish tooling; nothing in-package imports the `.d.ts` except `base`, whose `index.d.ts` is the *real* token-type declarations and was kept, renamed to `basetokens.ts` to avoid colliding with the real `index.ts`). (2) Each preset's default export was changed to a plain named export (`export const auraPreset = {...}`, no `export default`) — see the note below. |

### Gotcha: `export default` is silently dropped from unconsumed ng-packagr entry points

While vendoring `themes`, a bare `export default {...}` (or `export { x as default }`) on a secondary entry point's `public_api.ts` was silently stripped from the built FESM bundle — with no build error — whenever nothing else in the **same** `ng build core` invocation imported that entry point. A plain named export (`export const x = {...}`) on the exact same file survives correctly. Confirmed by bisecting with a minimal throwaway entry point. Since `themes`/`themes/aura`/`themes/lara`/`themes/nora` have no consumers within `projects/core` itself (only `helix-shell`/`helix-demo`, built as separate `ng build` invocations against the *published* dist), any `export default` here would ship broken. **Conclusion: never use `export default` in a `projects/core` secondary entry point** — use named exports throughout.

## `.p-*` → `.h-*` rename (feature #431, 2026-09-14)

Once the styling layer above was fully vendored, the `.p-*` CSS class names, `--p-*` design tokens, and `data-p-*`/bare `data-p` state attributes it produces (previously kept unrenamed per the now-superseded [css-class-prefix-decision.md](../../docs/migrations/css-class-prefix-decision.md)) were mechanically renamed to `.h-*`/`--h-*`/`data-h-*`/`data-h`:

- The rename regex was word-boundary-safe (`\bp-[a-zA-Z][\w-]*` → `h-...`, plus a separate `\bdata-p\b` → `data-h` pass for the bare multi-value state attribute): it cannot match Tailwind's own `p-4`/`px-2` spacing utilities (digit, or a different letter, immediately follows the hyphen) or `pi-*` primeicons classes.
- Applied across `projects/core` (all 84 vendored `*.css.ts` style modules, component/directive logic, templates, and the `themes/aura` preset's inline `css` override module), `projects/shell`, `projects/zod`, `projects/ag-grid`, and `apps/helix-demo/src` (not `apps/helix-demo/public/source`, which is generated — see `pnpm demo:generate-sources`).
- `uix/styled`'s `prefix` default (`config/index.ts`) changed from `'p'` to `'h'`, so the `dt()`/`$dt()` token-key generator and `toVariables()` now emit `--h-*` variable names at runtime, matching the renamed static CSS.
- `projects/shell`'s `tailwindcss-primeui` Tailwind plugin dependency was vendored and renamed too, since it hardcodes `--p-*`/`data-p-*` throughout its utilities and `@custom-variant`s — see `projects/shell/VENDOR.md`.
- `docs/components/*` regenerated (`pnpm docs:components`) to reflect renamed default values and doc comments.

## Diffing against upstream primeuix

```sh
git clone --depth 1 --branch main https://github.com/primefaces/primeuix
diff -r primeuix/packages/utils/src projects/core/uix/utils
```
