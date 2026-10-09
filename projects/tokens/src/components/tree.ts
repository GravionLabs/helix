// Component tokens of "tree".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const tree = {
  root: {
    background: '{content.background}',
    color: '{content.color}',
    padding: '1rem',
    gap: '2px',
    indent: '1rem',
    transitionDuration: '{transition.duration}',
  },
  node: {
    padding: '0.25rem 0.5rem',
    borderRadius: '{content.border.radius}',
    hoverBackground: '{content.hover.background}',
    selectedBackground: '{highlight.background}',
    color: '{text.color}',
    hoverColor: '{text.hover.color}',
    selectedColor: '{highlight.color}',
    focusRing: {
      width: '{focus.ring.width}',
      style: '{focus.ring.style}',
      color: '{focus.ring.color}',
      offset: '-1px',
      shadow: '{focus.ring.shadow}',
    },
    gap: '0.25rem',
  },
  nodeIcon: {
    color: '{text.muted.color}',
    hoverColor: '{text.hover.muted.color}',
    selectedColor: '{highlight.color}',
  },
  nodeToggleButton: {
    borderRadius: '50%',
    size: '1.75rem',
    hoverBackground: '{content.hover.background}',
    selectedHoverBackground: '{content.background}',
    color: '{text.muted.color}',
    hoverColor: '{text.hover.muted.color}',
    selectedHoverColor: '{primary.color}',
    focusRing: {
      width: '{focus.ring.width}',
      style: '{focus.ring.style}',
      color: '{focus.ring.color}',
      offset: '{focus.ring.offset}',
      shadow: '{focus.ring.shadow}',
    },
  },
  loadingIcon: {
    size: '2rem',
  },
  filter: {
    margin: '0 0 0.5rem 0',
  },
  css: '\n    .h-tree-mask.h-overlay-mask {\n        --px-mask-background: light-dark(rgba(255,255,255,0.5),rgba(0,0,0,0.3));\n    }\n',
} satisfies TokenTree;
