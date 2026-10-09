// Component tokens of "chip".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const chip = {
  root: {
    borderRadius: '16px',
    paddingX: '0.75rem',
    paddingY: '0.5rem',
    gap: '0.5rem',
    transitionDuration: '{transition.duration}',
  },
  image: {
    width: '2rem',
    height: '2rem',
  },
  icon: {
    size: '1rem',
  },
  removeIcon: {
    size: '1rem',
    focusRing: {
      width: '{focus.ring.width}',
      style: '{focus.ring.style}',
      color: '{focus.ring.color}',
      offset: '{focus.ring.offset}',
      shadow: '{form.field.focus.ring.shadow}',
    },
  },
  colorScheme: {
    light: {
      root: {
        background: '{surface.100}',
        color: '{surface.800}',
      },
      icon: {
        color: '{surface.800}',
      },
      removeIcon: {
        color: '{surface.800}',
      },
    },
    dark: {
      root: {
        background: '{surface.800}',
        color: '{surface.0}',
      },
      icon: {
        color: '{surface.0}',
      },
      removeIcon: {
        color: '{surface.0}',
      },
    },
  },
} satisfies TokenTree;
