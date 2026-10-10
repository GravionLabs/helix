// Component tokens of "ripple".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const ripple = {
  colorScheme: {
    light: {
      root: {
        background: 'rgba(0,0,0,0.1)',
      },
    },
    dark: {
      root: {
        background: 'rgba(255,255,255,0.3)',
      },
    },
  },
} satisfies TokenTree;
