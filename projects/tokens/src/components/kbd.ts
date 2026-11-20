// Component tokens of "kbd" (the key cap of a keyboard shortcut).
import type { TokenTree } from '../types.ts';

export const kbd = {
  root: {
    gap: '0.25rem',
    borderRadius: '{border.radius.sm}',
    borderWidth: '1px',
    paddingX: '0.375rem',
    minWidth: '1.5rem',
    height: '1.5rem',
    fontSize: '0.75rem',
    sm: {
      gap: '0.125rem',
      minWidth: '1.25rem',
      height: '1.25rem',
      paddingX: '0.25rem',
      fontSize: '0.6875rem',
    },
  },
  colorScheme: {
    light: {
      root: {
        background: '{surface.50}',
        color: '{surface.700}',
        borderColor: '{surface.500}',
        separatorColor: '{surface.500}',
      },
      // on the dark bubble of a tooltip
      tooltip: {
        background: '{surface.600}',
        color: '{surface.0}',
        borderColor: '{surface.400}',
        separatorColor: '{surface.300}',
      },
    },
    dark: {
      root: {
        background: '{surface.800}',
        color: '{surface.0}',
        borderColor: '{surface.400}',
        separatorColor: '{surface.400}',
      },
      tooltip: {
        background: '{surface.600}',
        color: '{surface.0}',
        borderColor: '{surface.400}',
        separatorColor: '{surface.300}',
      },
    },
  },
} satisfies TokenTree;
