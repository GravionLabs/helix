// Component tokens of "knob".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const knob = {
  root: {
    transitionDuration: '{transition.duration}',
    focusRing: {
      width: '{focus.ring.width}',
      style: '{focus.ring.style}',
      color: '{focus.ring.color}',
      offset: '{focus.ring.offset}',
      shadow: '{focus.ring.shadow}',
    },
  },
  value: {
    background: '{primary.color}',
  },
  range: {
    background: '{content.border.color}',
  },
  text: {
    color: '{text.muted.color}',
  },
} satisfies TokenTree;
