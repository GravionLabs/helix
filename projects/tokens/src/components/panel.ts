// Component tokens of "panel".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const panel = {
  root: {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    color: '{content.color}',
    borderRadius: '{content.border.radius}',
  },
  header: {
    background: 'transparent',
    color: '{text.color}',
    padding: '1.125rem',
    borderColor: '{content.border.color}',
    borderWidth: '0',
    borderRadius: '0',
  },
  toggleableHeader: {
    padding: '0.375rem 1.125rem',
  },
  title: {
    fontWeight: '600',
  },
  content: {
    padding: '0 1.125rem 1.125rem 1.125rem',
  },
  footer: {
    padding: '0 1.125rem 1.125rem 1.125rem',
  },
} satisfies TokenTree;
