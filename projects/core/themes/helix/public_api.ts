/**
 * The Helix preset: Helix's own look, expressed as design tokens on top of Aura
 * (ADR 0001, epic #519). Aura stays the structural base — it is the preset the
 * component styles were written against — and this file holds only what Helix
 * decides differently, in the same three layers the engine resolves:
 *
 * - `primitive`: palettes and radii (add a brand palette here, don't edit Aura's)
 * - `semantic`: `primary`, `colorScheme.{light,dark}.surface`, `formField`,
 *   `focusRing`, … — the choices that give every component the same identity
 * - `components`: per-component overrides, only where the semantic layer isn't enough
 *
 * The token *values* come from the design mockups (#521); until that feature
 * lands the preset resolves to Aura, so adopting `helixPreset` now is free and
 * the switch to the Helix look is a change of this file alone.
 *
 * `scripts/export-tokens.mjs` resolves this preset to static CSS/JSON
 * (`dist/tokens/`) for the docs site, the design-system sync (#522) and the
 * future `helix-ui` library (B half of ADR 0001), so the look is defined once.
 */
import { definePreset } from '@gravionlabs/helix-core/themes';
import { auraPreset } from '@gravionlabs/helix-core/themes/aura';
import type { Preset } from '@gravionlabs/helix-core/themes/types';

/** Helix's deviations from Aura. Keep this the only place where Helix's identity is encoded. */
export const helixOverrides: Preset = {
    primitive: {},
    semantic: {},
    components: {}
};

export const helixPreset: Preset = definePreset(auraPreset, helixOverrides);
