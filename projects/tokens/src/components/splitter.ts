// Component tokens of "splitter".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const splitter = {
  root: {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    color: '{content.color}',
    transitionDuration: '{transition.duration}',
  },
  gutter: {
    background: '{content.border.color}',
  },
  handle: {
    size: '24px',
    background: 'transparent',
    borderRadius: '{content.border.radius}',
    focusRing: {
      width: '{focus.ring.width}',
      style: '{focus.ring.style}',
      color: '{focus.ring.color}',
      offset: '{focus.ring.offset}',
      shadow: '{focus.ring.shadow}',
    },
  },
} satisfies TokenTree;
