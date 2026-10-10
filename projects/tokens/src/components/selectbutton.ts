// Component tokens of "selectbutton".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
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
