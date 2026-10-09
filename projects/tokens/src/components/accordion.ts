// Component tokens of "accordion".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const accordion = {
  root: {
    transitionDuration: '{transition.duration}',
  },
  panel: {
    borderWidth: '0 0 1px 0',
    borderColor: '{content.border.color}',
  },
  header: {
    color: '{text.muted.color}',
    hoverColor: '{text.color}',
    activeColor: '{text.color}',
    activeHoverColor: '{text.color}',
    padding: '1.125rem',
    fontWeight: '600',
    borderRadius: '0',
    borderWidth: '0',
    borderColor: '{content.border.color}',
    background: '{content.background}',
    hoverBackground: '{content.background}',
    activeBackground: '{content.background}',
    activeHoverBackground: '{content.background}',
    focusRing: {
      width: '{focus.ring.width}',
      style: '{focus.ring.style}',
      color: '{focus.ring.color}',
      offset: '-1px',
      shadow: '{focus.ring.shadow}',
    },
    toggleIcon: {
      color: '{text.muted.color}',
      hoverColor: '{text.color}',
      activeColor: '{text.color}',
      activeHoverColor: '{text.color}',
    },
    first: {
      topBorderRadius: '{content.border.radius}',
      borderWidth: '0',
    },
    last: {
      bottomBorderRadius: '{content.border.radius}',
      activeBottomBorderRadius: '0',
    },
  },
  content: {
    borderWidth: '0',
    borderColor: '{content.border.color}',
    background: '{content.background}',
    color: '{text.color}',
    padding: '0 1.125rem 1.125rem 1.125rem',
  },
} satisfies TokenTree;
