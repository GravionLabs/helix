// Component tokens of "drawer".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
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
