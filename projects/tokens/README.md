# Helix design tokens (`projects/tokens`)

The Helix design tokens as plain data. This is the source of every `--h-*` CSS variable of `helix-ui`, the
docs site and the Design System: the token resolver turns this data into CSS and JSON at build time
([retire-helix-core plan](../../docs/migrations/retire-helix-core.md), feature "Helix token source").
It is not an npm package and has no build: Node scripts import the `.ts` files directly.

## Layers

| File | Layer | What it holds |
| --- | --- | --- |
| `src/primitive.ts` | primitive | radii, the colour scales (muted Helix scales from `palettes.ts`, the neutral scales of Aura) |
| `src/semantic.ts` | semantic | what the primitives mean: `primary`, `surface`, `text`, `formField`, `overlay`, … with `colorScheme.light` and `colorScheme.dark` |
| `src/components/<name>.ts` | component | the token set of one component (`button`, `select`, `datatable`, …), 88 in total; `components/index.ts` lists them in the order the CSS is emitted |
| `src/palettes.ts` | – | the muted colour scales, **generated** (see below) |
| `src/tailwind.ts` | – | the unmuted Tailwind scales the generator reads |
| `src/index.ts` | – | `helixTokens = { primitive, semantic, components }` and `palettes` |

A leaf is a CSS value (`'#ffffff'`, `'0.5rem'`) or a reference to another token in braces
(`'{primary.600}'`, `'{form.field.border.radius}'`). A reference becomes `var(--h-…)`; the variable of a token is
its path in kebab case with the structural keys (`colorScheme`, `light`, `dark`, `root`) left out, so
`semantic.primary.color` is `--h-primary-color` and `components.button.primary.background` is
`--h-button-primary-background`. The order of the keys is the order of the CSS.

## Change a token

1. Edit the value in the file of its layer. Prefer changing a semantic token to changing many component tokens.
2. Keep references as references; a value written out in a component set cannot follow a theme change.
3. `pnpm test:scripts` checks that every leaf is a string or number, that every reference resolves, and that the
   data is still data (no functions, no imports of an engine).
4. Rebuild what reads the tokens: `pnpm build:lib:css:ui` (helix-ui), `pnpm tokens:site` (docs site).

## Change the colour scales

The primary and severity colours are Tailwind's scales with their OKLCH chroma reduced (factor 0.55; lightness
and hue unchanged), so every choice in the configurator stays quiet:

```bash
node scripts/helix-palettes.mjs [chroma factor]   # reads tailwind.ts, writes palettes.ts
```

`palettes.ts` is generated: do not edit it by hand. `tailwind.ts` is the input; the list of muted scales is
`SCALES` in `scripts/helix-palettes.mjs`.

## Where the data came from

It was extracted once from the Helix preset that `helix-core` resolves (Aura, merged with the Helix overrides
and the muted palettes) by `scripts/tokens/extract-preset.mjs`, and a test keeps proving that it is identical to
that preset, key by key and in the same order, while `helix-core` still exists. The script and the test go away
with `helix-core`; the data stays. See `NOTICE` for the origin of the values.

## Resolve to CSS and JSON

```js
import { helixTokens } from '../../projects/tokens/src/index.ts';
import { resolveTokens } from '../tokens/resolve.mjs';

const { css, json } = resolveTokens(helixTokens, { darkSelector: '.app-dark', components: true });
```

`scripts/tokens/resolve.mjs` is the resolver: pure functions, no I/O, no engine. It writes the layers in the order
primitive, semantic (light, then dark), global (`color-scheme`), then one block per component; `components` is `true`
(all, sorted by name), `false` (base layers only) or a list of names (those, in that order). `json` holds the
variables by colour scheme. Within an object the values come first, then the nested objects, the last one first;
that order is part of the contract, because the CSS of the golden snapshot depends on it.

## Checks

```bash
npx tsc -p projects/tokens     # types (pnpm lint:tokens)
pnpm test:scripts              # data, palettes, equality with the preset
```
