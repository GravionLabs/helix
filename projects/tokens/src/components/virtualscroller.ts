// Component tokens of "virtualscroller".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const virtualscroller = {
  loader: {
    mask: {
      background: '{content.background}',
      color: '{text.muted.color}',
    },
    icon: {
      size: '2rem',
    },
  },
} satisfies TokenTree;
