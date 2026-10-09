// Component tokens of "overlaybadge".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const overlaybadge = {
  root: {
    outline: {
      width: '2px',
      color: '{content.background}',
    },
  },
} satisfies TokenTree;
