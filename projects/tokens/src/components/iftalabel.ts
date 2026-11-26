// Component tokens of "iftalabel".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const iftalabel = {
  root: {
    color: '{form.field.float.label.color}',
    focusColor: '{form.field.float.label.focus.color}',
    invalidColor: '{form.field.float.label.invalid.color}',
    transitionDuration: '0.2s',
    positionX: '{form.field.padding.x}',
    top: '{form.field.padding.y}',
    fontSize: '{fontSize.xs}',
    fontWeight: '400',
  },
  input: {
    paddingTop: '{space.6}',
    paddingBottom: '{form.field.padding.y}',
  },
} satisfies TokenTree;
