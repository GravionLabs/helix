import type { HxSurface } from './surfaces';
import type { HxPrimaryColor } from './theme';

/** A primary scale written out: the 11 steps `--h-primary-50 … --h-primary-950`, as CSS colours. */
export interface HxPrimaryScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

/**
 * A named bundle of the three knobs of the theme: the primary colour (a named scale or a scale written out), the
 * surface scale (`null`: the Helix neutrals of `tokens.css`) and the density. Nothing else; the user's own choices
 * win over it.
 */
export interface HxThemePreset {
  primary: HxPrimaryColor | HxPrimaryScale;
  surface: HxSurface | null;
  density: 'comfortable' | 'compact';
}

/**
 * VitePress's indigo, written by hand (not derived from a Tailwind scale). Step 600 is brand-1 of the light theme
 * (`#3451b2`, 7.1:1 on white), step 400 brand-1 of the dark theme (`#a8b1ff`, 8.5:1 on the dark panel), step 500
 * a step between brand-3 (`#5672cd`, 4.48:1 with white, too low) and brand-1, so a filled button on 500 with white text passes AA (4.90:1; helix indigo has 4.30:1 there).
 */
export const VITEPRESS_PRIMARY: HxPrimaryScale = {
  50: '#f0f2ff',
  100: '#e3e7ff',
  200: '#ced4ff',
  300: '#bcc3ff',
  400: '#a8b1ff',
  500: '#506cc4',
  600: '#3451b2',
  700: '#2c4496',
  800: '#243679',
  900: '#1c295c',
  950: '#111a3a',
};

/**
 * The bundled presets of ADR 0004: `helix` (the default), `vitepress` and `compact` (`helix` with the compact
 * density; poimen runs on it, there is no preset of an app).
 */
export const HX_THEME_PRESETS = {
  helix: { primary: 'indigo', surface: null, density: 'comfortable' },
  vitepress: { primary: VITEPRESS_PRIMARY, surface: null, density: 'comfortable' },
  compact: { primary: 'indigo', surface: null, density: 'compact' },
} as const satisfies Record<string, HxThemePreset>;

export type HxBundledPreset = keyof typeof HX_THEME_PRESETS;
