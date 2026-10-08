// Component tokens of "progressbar".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const progressbar = {
  root: {
    background: '{content.border.color}',
    borderRadius: '{content.border.radius}',
    height: '1.25rem',
  },
  value: {
    background: '{primary.color}',
  },
  label: {
    color: '{primary.contrast.color}',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
} satisfies TokenTree;
