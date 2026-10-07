/**
 * The Helix preset: Helix's own look, expressed as design tokens on top of Aura
 * (ADR 0001, epic #519, mockups of #521). Aura stays the structural base — it is
 * the preset the component styles were written against — and this file holds
 * only what Helix decides differently, in the same three layers the engine
 * resolves:
 *
 * - `primitive`: palettes and radii (Aura's Tailwind-derived scales are kept)
 * - `semantic`: `primary`, `colorScheme.{light,dark}.surface`, text, … — the
 *   choices that give every component the same identity
 * - `components`: per-component overrides, only where the semantic layer isn't enough
 *
 * The look ("Hybrid", round 2 of the mockups): zinc neutrals, indigo primary,
 * 6 px radius (Aura's `md`), Space Grotesk for display, Figtree for text and
 * Fira Code for code. Type is not a token of the engine: the font stacks live in
 * `@gravionlabs/helix-shell`'s stylesheet, the font files are the application's
 * (`@fontsource-variable/*`, see the demo's `angular.json`).
 *
 * `scripts/export-tokens.mjs` resolves this preset to static CSS/JSON
 * (`dist/tokens/`) for the docs site, the design-system sync (#522) and the
 * `helix-ui` library (epic #523), so the look is defined once.
 */
import { definePreset } from '@gravionlabs/helix-core/themes';
import { auraPreset } from '@gravionlabs/helix-core/themes/aura';
import type { Preset } from '@gravionlabs/helix-core/themes/types';

const zinc = {
    0: '#ffffff',
    50: '{zinc.50}',
    100: '{zinc.100}',
    200: '{zinc.200}',
    300: '{zinc.300}',
    400: '{zinc.400}',
    500: '{zinc.500}',
    600: '{zinc.600}',
    700: '{zinc.700}',
    800: '{zinc.800}',
    900: '{zinc.900}',
    950: '{zinc.950}'
};

/** Helix's deviations from Aura. Keep this the only place where Helix's identity is encoded. */
export const helixOverrides: Preset = {
    semantic: {
        primary: {
            50: '{indigo.50}',
            100: '{indigo.100}',
            200: '{indigo.200}',
            300: '{indigo.300}',
            400: '{indigo.400}',
            500: '{indigo.500}',
            600: '{indigo.600}',
            700: '{indigo.700}',
            800: '{indigo.800}',
            900: '{indigo.900}',
            950: '{indigo.950}'
        },
        colorScheme: {
            light: {
                // Zinc in both schemes (Aura: slate by day, zinc by night), so the
                // neutrals don't shift temperature with the theme.
                surface: zinc,
                // indigo-600 on white (7.2:1) instead of Aura's 500.
                primary: {
                    color: '{primary.600}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.700}',
                    activeColor: '{primary.800}'
                },
                // Near-black text and a darker muted step: zinc-600 on white is 7.6:1,
                // Aura's 500 would be 4.8:1 on the surface-50 cards.
                text: {
                    color: '{surface.950}',
                    hoverColor: '{surface.900}',
                    mutedColor: '{surface.600}',
                    hoverMutedColor: '{surface.700}'
                },
                formField: {
                    color: '{surface.950}',
                    floatLabelFocusColor: '{primary.color}'
                }
            },
            dark: {
                surface: zinc,
                primary: {
                    color: '{primary.400}',
                    contrastColor: '{surface.950}',
                    hoverColor: '{primary.300}',
                    activeColor: '{primary.200}'
                },
                text: {
                    color: '{surface.50}',
                    hoverColor: '{surface.0}',
                    mutedColor: '{surface.400}',
                    hoverMutedColor: '{surface.300}'
                }
            }
        }
    }
};

export const helixPreset: Preset = definePreset(auraPreset, helixOverrides);
