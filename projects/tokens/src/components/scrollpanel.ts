// Component tokens of "scrollpanel".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const scrollpanel = {
  root: {
    transitionDuration: '{transition.duration}',
  },
  bar: {
    size: '9px',
    borderRadius: '{border.radius.sm}',
    focusRing: {
      width: '{focus.ring.width}',
      style: '{focus.ring.style}',
      color: '{focus.ring.color}',
      offset: '{focus.ring.offset}',
      shadow: '{focus.ring.shadow}',
    },
  },
  colorScheme: {
    light: {
      bar: {
        background: '{surface.100}',
      },
    },
    dark: {
      bar: {
        background: '{surface.800}',
      },
    },
  },
} satisfies TokenTree;
