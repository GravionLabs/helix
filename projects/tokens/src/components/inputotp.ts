// Component tokens of "inputotp".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const inputotp = {
  root: {
    gap: '0.5rem',
  },
  input: {
    width: '2.5rem',
    sm: {
      width: '2rem',
    },
    lg: {
      width: '3rem',
    },
  },
} satisfies TokenTree;
