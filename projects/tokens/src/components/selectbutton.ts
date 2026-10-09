// Component tokens of "selectbutton".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const selectbutton = {
  root: {
    borderRadius: '{form.field.border.radius}',
  },
  colorScheme: {
    light: {
      root: {
        invalidBorderColor: '{form.field.invalid.border.color}',
      },
    },
    dark: {
      root: {
        invalidBorderColor: '{form.field.invalid.border.color}',
      },
    },
  },
} satisfies TokenTree;
