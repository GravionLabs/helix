// Component tokens of "tooltip".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const tooltip = {
  root: {
    maxWidth: '12.5rem',
    gutter: '0.25rem',
    shadow: '{overlay.popover.shadow}',
    padding: '0.5rem 0.75rem',
    borderRadius: '{overlay.popover.border.radius}',
  },
  colorScheme: {
    light: {
      root: {
        background: '{surface.700}',
        color: '{surface.0}',
      },
    },
    dark: {
      root: {
        background: '{surface.700}',
        color: '{surface.0}',
      },
    },
  },
} satisfies TokenTree;
