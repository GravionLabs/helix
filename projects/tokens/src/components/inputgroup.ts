// Component tokens of "inputgroup".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const inputgroup = {
  addon: {
    background: '{form.field.background}',
    borderColor: '{form.field.border.color}',
    color: '{form.field.icon.color}',
    borderRadius: '{form.field.border.radius}',
    padding: '0.5rem',
    minWidth: '2.5rem',
  },
} satisfies TokenTree;
