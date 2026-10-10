// Component tokens of "fieldset".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const fieldset = {
  root: {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    borderRadius: '{content.border.radius}',
    color: '{content.color}',
    padding: '0 1.125rem 1.125rem 1.125rem',
    transitionDuration: '{transition.duration}',
  },
  legend: {
    background: '{content.background}',
    hoverBackground: '{content.hover.background}',
    color: '{content.color}',
    hoverColor: '{content.hover.color}',
    borderRadius: '{content.border.radius}',
    borderWidth: '1px',
    borderColor: 'transparent',
    padding: '0.5rem 0.75rem',
    gap: '0.5rem',
    fontWeight: '600',
    focusRing: {
      width: '{focus.ring.width}',
      style: '{focus.ring.style}',
      color: '{focus.ring.color}',
      offset: '{focus.ring.offset}',
      shadow: '{focus.ring.shadow}',
    },
  },
  toggleIcon: {
    color: '{text.muted.color}',
    hoverColor: '{text.hover.muted.color}',
  },
  content: {
    padding: '0',
  },
} satisfies TokenTree;
