// Component tokens of "rating".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const rating = {
  root: {
    gap: '0.25rem',
    transitionDuration: '{transition.duration}',
    focusRing: {
      width: '{focus.ring.width}',
      style: '{focus.ring.style}',
      color: '{focus.ring.color}',
      offset: '{focus.ring.offset}',
      shadow: '{focus.ring.shadow}',
    },
  },
  icon: {
    size: '1rem',
    color: '{text.muted.color}',
    hoverColor: '{primary.color}',
    activeColor: '{primary.color}',
  },
} satisfies TokenTree;
