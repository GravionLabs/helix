// Component tokens of "dataview".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const dataview = {
  root: {
    borderColor: 'transparent',
    borderWidth: '0',
    borderRadius: '0',
    padding: '0',
  },
  header: {
    background: '{content.background}',
    color: '{content.color}',
    borderColor: '{content.border.color}',
    borderWidth: '0 0 1px 0',
    padding: '0.75rem 1rem',
    borderRadius: '0',
  },
  content: {
    background: '{content.background}',
    color: '{content.color}',
    borderColor: 'transparent',
    borderWidth: '0',
    padding: '0',
    borderRadius: '0',
  },
  footer: {
    background: '{content.background}',
    color: '{content.color}',
    borderColor: '{content.border.color}',
    borderWidth: '1px 0 0 0',
    padding: '0.75rem 1rem',
    borderRadius: '0',
  },
  paginatorTop: {
    borderColor: '{content.border.color}',
    borderWidth: '0 0 1px 0',
  },
  paginatorBottom: {
    borderColor: '{content.border.color}',
    borderWidth: '1px 0 0 0',
  },
} satisfies TokenTree;
