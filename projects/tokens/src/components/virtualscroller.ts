// Component tokens of "virtualscroller".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
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
