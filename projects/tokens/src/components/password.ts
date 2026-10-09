// Component tokens of "password".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const password = {
  meter: {
    background: '{content.border.color}',
    borderRadius: '{content.border.radius}',
    height: '.75rem',
  },
  icon: {
    color: '{form.field.icon.color}',
  },
  overlay: {
    background: '{overlay.popover.background}',
    borderColor: '{overlay.popover.border.color}',
    borderRadius: '{overlay.popover.border.radius}',
    color: '{overlay.popover.color}',
    padding: '{overlay.popover.padding}',
    shadow: '{overlay.popover.shadow}',
  },
  content: {
    gap: '0.5rem',
  },
  colorScheme: {
    light: {
      strength: {
        weakBackground: '{red.500}',
        mediumBackground: '{amber.500}',
        strongBackground: '{green.500}',
      },
    },
    dark: {
      strength: {
        weakBackground: '{red.400}',
        mediumBackground: '{amber.400}',
        strongBackground: '{green.400}',
      },
    },
  },
} satisfies TokenTree;
