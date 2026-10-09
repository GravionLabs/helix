// Component tokens of "inputnumber".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const inputnumber = {
  root: {
    transitionDuration: '{transition.duration}',
  },
  button: {
    width: '2.5rem',
    borderRadius: '{form.field.border.radius}',
    verticalPadding: '{form.field.padding.y}',
  },
  colorScheme: {
    light: {
      button: {
        background: 'transparent',
        hoverBackground: '{surface.100}',
        activeBackground: '{surface.200}',
        borderColor: '{form.field.border.color}',
        hoverBorderColor: '{form.field.border.color}',
        activeBorderColor: '{form.field.border.color}',
        color: '{surface.400}',
        hoverColor: '{surface.500}',
        activeColor: '{surface.600}',
      },
    },
    dark: {
      button: {
        background: 'transparent',
        hoverBackground: '{surface.800}',
        activeBackground: '{surface.700}',
        borderColor: '{form.field.border.color}',
        hoverBorderColor: '{form.field.border.color}',
        activeBorderColor: '{form.field.border.color}',
        color: '{surface.400}',
        hoverColor: '{surface.300}',
        activeColor: '{surface.200}',
      },
    },
  },
} satisfies TokenTree;
