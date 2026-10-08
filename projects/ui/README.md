# @gravionlabs/helix-ui

Vanilla Angular components on the Helix design tokens: standalone, signal-based, plain CSS, no runtime
styling engine, no dependency on `@gravionlabs/helix-core`. It is the long-term replacement of the vendored
PrimeNG fork (see [ADR 0001](../../docs/adr/0001-styling-foundation.md), epic #523).

## Install

```bash
npm install @gravionlabs/helix-ui
```

```css
/* the components */
@import "@gravionlabs/helix-ui/styles.css";
/* the tokens the components read; load them in every app, also with the helix-core theme engine */
@import "@gravionlabs/helix-ui/tokens.css";
```

Dark mode: tokens switch under the `app-dark` class on `<html>`, as in `helix-shell`.

## Components

| Component | Selector | |
| --- | --- | --- |
| `HxButton` | `button[hx-button]`, `a[hx-button]` | variants, severities, sizes, loading, icon-only |
| `HxInput` | `input[hx-input]`, `textarea[hx-input]` | outlined / filled, sizes, invalid |
| `HxCheckbox` | `input[hx-checkbox]` | native checkbox, indeterminate |
| `HxRadio` | `input[hx-radio]` | native radio |
| `HxSwitch` | `input[hx-switch]` | native checkbox with `role="switch"` |

Selectors, inputs and classes use the prefix `hx` (`hx-button`), so they never clash with `helix-core`'s `h-`
in an app that uses both while migrating. Both libraries read the same `--h-*` tokens, so a page mixes them
without a visible seam.

## Rules of this package

- Nothing imports `@gravionlabs/helix-core`, `@primeuix/*` or `primeng` (`pnpm lint:no-core`).
- Styles are plain CSS in `styles/<component>.css` that read `--h-*` tokens only; they ship in a `components`
  cascade layer so an app's own CSS and Tailwind utilities win without specificity fights.
- Every component has unit tests and a docs page; a test fails when a stylesheet reads a token that
  `tokens.css` does not define.

## Publishing

Not published yet: the first release needs a trusted-publisher entry for `@gravionlabs/helix-ui` on npmjs.com
(Settings → Trusted Publisher → GitHub Actions, owner GravionLabs, repo helix, workflow `ci.yml`), then
`ui` joins the package loops of `.github/workflows/ci.yml`.

## License

MIT
