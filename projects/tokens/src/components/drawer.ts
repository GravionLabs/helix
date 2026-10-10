// Component tokens of "drawer".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const drawer = {
  root: {
    background: '{overlay.modal.background}',
    borderColor: '{overlay.modal.border.color}',
    color: '{overlay.modal.color}',
    shadow: '{overlay.modal.shadow}',
  },
  header: {
    padding: '{overlay.modal.padding}',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
  },
  content: {
    padding: '0 {overlay.modal.padding} {overlay.modal.padding} {overlay.modal.padding}',
  },
  footer: {
    padding: '{overlay.modal.padding}',
  },
} satisfies TokenTree;
