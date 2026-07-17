# @gravionlabs/helix

Helix base component library for Angular — 90 UI components, 7 directives, and
20 infrastructure modules, each exposed as its own secondary entry point:

```ts
import { Button } from '@gravionlabs/helix/button';
```

```html
<h-button label="Save" />
```

Selectors use the `h-` prefix (`h-button`, `hTooltip`, `hRipple`). Styling is
provided by the pinned `@primeuix` MIT layer, so CSS classes (`.p-*`) and
design tokens (`--p-*`) keep their upstream names and all existing PrimeNG
themes/presets work unchanged (decision rationale:
[docs/migrations/css-class-prefix-decision.md](../../docs/migrations/css-class-prefix-decision.md)).

## Documentation

Every module has its own doc page — selectors, inputs, outputs, and exported
types — indexed at [docs/components](../../docs/components/README.md).

## Attribution

This library is a fork of [PrimeNG](https://github.com/primefaces/primeng) by
PrimeTek Informatics, vendored at tag `21.1.9` — the last version published
under the MIT "PRIMENG COMMUNITY VERSIONS LICENSE". See `LICENSE.md` for the
original license and `VENDOR.md` for the exact upstream commit and the list of
local modifications. All credit for the original component implementations
belongs to PrimeTek.
