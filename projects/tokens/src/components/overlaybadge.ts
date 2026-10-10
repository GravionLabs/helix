// Component tokens of "overlaybadge".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const overlaybadge = {
  root: {
    outline: {
      width: '2px',
      color: '{content.background}',
    },
  },
} satisfies TokenTree;
