// Component tokens of "floatlabel".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const floatlabel = {
  root: {
    color: '{form.field.float.label.color}',
    focusColor: '{form.field.float.label.focus.color}',
    activeColor: '{form.field.float.label.active.color}',
    invalidColor: '{form.field.float.label.invalid.color}',
    transitionDuration: '0.2s',
    positionX: '{form.field.padding.x}',
    positionY: '{form.field.padding.y}',
    fontWeight: '500',
    active: {
      fontSize: '{fontSize.xs}',
      fontWeight: '400',
    },
  },
  over: {
    active: {
      top: '-1.25rem',
    },
  },
  in: {
    input: {
      paddingTop: '{space.6}',
      paddingBottom: '{form.field.padding.y}',
    },
    active: {
      top: '{form.field.padding.y}',
    },
  },
  on: {
    borderRadius: '{border.radius.xs}',
    active: {
      background: '{form.field.background}',
      padding: '0 0.125rem',
    },
  },
} satisfies TokenTree;
