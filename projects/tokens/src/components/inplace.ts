// Component tokens of "inplace".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const inplace = {
  root: {
    padding: '{form.field.padding.y} {form.field.padding.x}',
    borderRadius: '{content.border.radius}',
    focusRing: {
      width: '{focus.ring.width}',
      style: '{focus.ring.style}',
      color: '{focus.ring.color}',
      offset: '{focus.ring.offset}',
      shadow: '{focus.ring.shadow}',
    },
    transitionDuration: '{transition.duration}',
  },
  display: {
    hoverBackground: '{content.hover.background}',
    hoverColor: '{content.hover.color}',
  },
} satisfies TokenTree;
