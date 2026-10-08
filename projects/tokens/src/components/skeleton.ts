// Component tokens of "skeleton".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const skeleton = {
  root: {
    borderRadius: '{content.border.radius}',
  },
  colorScheme: {
    light: {
      root: {
        background: '{surface.200}',
        animationBackground: 'rgba(255,255,255,0.4)',
      },
    },
    dark: {
      root: {
        background: 'rgba(255, 255, 255, 0.06)',
        animationBackground: 'rgba(255, 255, 255, 0.04)',
      },
    },
  },
} satisfies TokenTree;
