// Component tokens of "dock".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const dock = {
  root: {
    background: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: '0.5rem',
    borderRadius: '{border.radius.xl}',
  },
  item: {
    borderRadius: '{content.border.radius}',
    padding: '0.5rem',
    size: '3rem',
    focusRing: {
      width: '{focus.ring.width}',
      style: '{focus.ring.style}',
      color: '{focus.ring.color}',
      offset: '{focus.ring.offset}',
      shadow: '{focus.ring.shadow}',
    },
  },
} satisfies TokenTree;
