# @gravionlabs/helix

Helix base component library for Angular — ~90 UI components with
per-component secondary entry points:

```ts
import { Button } from '@gravionlabs/helix/button';
```

```html
<h-button label="Save" />
```

Selectors use the `h-` prefix (`h-button`, `hTooltip`, `hRipple`). Styling is
provided by the pinned `@primeuix` MIT layer, so CSS classes (`.p-*`) and
design tokens (`--p-*`) keep their upstream names and all existing PrimeNG
themes/presets work unchanged.

## Attribution

This library is a fork of [PrimeNG](https://github.com/primefaces/primeng) by
PrimeTek Informatics, vendored at tag `21.1.9` — the last version published
under the MIT "PRIMENG COMMUNITY VERSIONS LICENSE". See `LICENSE.md` for the
original license and `VENDOR.md` for the exact upstream commit and the list of
local modifications. All credit for the original component implementations
belongs to PrimeTek.
