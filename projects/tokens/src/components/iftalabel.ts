// Component tokens of "iftalabel".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const iftalabel = {
  root: {
    color: '{form.field.float.label.color}',
    focusColor: '{form.field.float.label.focus.color}',
    invalidColor: '{form.field.float.label.invalid.color}',
    transitionDuration: '0.2s',
    positionX: '{form.field.padding.x}',
    top: '{form.field.padding.y}',
    fontSize: '0.75rem',
    fontWeight: '400',
  },
  input: {
    paddingTop: '1.5rem',
    paddingBottom: '{form.field.padding.y}',
  },
} satisfies TokenTree;
