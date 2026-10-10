// Component tokens of "popover".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const popover = {
  root: {
    background: '{overlay.popover.background}',
    borderColor: '{overlay.popover.border.color}',
    color: '{overlay.popover.color}',
    borderRadius: '{overlay.popover.border.radius}',
    shadow: '{overlay.popover.shadow}',
    gutter: '10px',
    arrowOffset: '1.25rem',
  },
  content: {
    padding: '{overlay.popover.padding}',
  },
} satisfies TokenTree;
