// Component tokens of "confirmdialog".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const confirmdialog = {
  icon: {
    size: '2rem',
    color: '{overlay.modal.color}',
  },
  content: {
    gap: '1rem',
  },
} satisfies TokenTree;
