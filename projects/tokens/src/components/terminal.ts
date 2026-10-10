// Component tokens of "terminal".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const terminal = {
  root: {
    background: '{form.field.background}',
    borderColor: '{form.field.border.color}',
    color: '{form.field.color}',
    height: '18rem',
    padding: '{form.field.padding.y} {form.field.padding.x}',
    borderRadius: '{form.field.border.radius}',
  },
  prompt: {
    gap: '0.25rem',
  },
  commandResponse: {
    margin: '2px 0',
  },
} satisfies TokenTree;
