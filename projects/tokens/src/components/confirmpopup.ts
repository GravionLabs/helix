// Component tokens of "confirmpopup".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const confirmpopup = {
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
    gap: '1rem',
  },
  icon: {
    size: '1.5rem',
    color: '{overlay.popover.color}',
  },
  footer: {
    gap: '0.5rem',
    padding: '0 {overlay.popover.padding} {overlay.popover.padding} {overlay.popover.padding}',
  },
} satisfies TokenTree;
