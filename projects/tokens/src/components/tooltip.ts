// Component tokens of "tooltip".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const tooltip = {
  root: {
    maxWidth: '12.5rem',
    gutter: '0.25rem',
    shadow: '{overlay.popover.shadow}',
    padding: '0.5rem 0.75rem',
    borderRadius: '{overlay.popover.border.radius}',
  },
  colorScheme: {
    light: {
      root: {
        background: '{surface.700}',
        color: '{surface.0}',
      },
    },
    dark: {
      root: {
        background: '{surface.700}',
        color: '{surface.0}',
      },
    },
  },
} satisfies TokenTree;
