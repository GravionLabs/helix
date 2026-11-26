// Component tokens of "toolbar".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const toolbar = {
  root: {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    borderRadius: '{content.border.radius}',
    color: '{content.color}',
    gap: '{space.2}',
    padding: '{space.3}',
  },
} satisfies TokenTree;
