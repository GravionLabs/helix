// Component tokens of "fileupload".
// Extracted once from the Helix preset of helix-core (scripts/tokens/extract-preset.mjs); this file is the source now.
import type { TokenTree } from '../types.ts';

export const fileupload = {
  root: {
    background: '{content.background}',
    borderColor: '{content.border.color}',
    color: '{content.color}',
    borderRadius: '{content.border.radius}',
    transitionDuration: '{transition.duration}',
  },
  header: {
    background: 'transparent',
    color: '{text.color}',
    padding: '1.125rem',
    borderColor: 'unset',
    borderWidth: '0',
    borderRadius: '0',
    gap: '0.5rem',
  },
  content: {
    highlightBorderColor: '{primary.color}',
    padding: '0 1.125rem 1.125rem 1.125rem',
    gap: '1rem',
  },
  file: {
    padding: '1rem',
    gap: '1rem',
    borderColor: '{content.border.color}',
    info: {
      gap: '0.5rem',
    },
  },
  fileList: {
    gap: '0.5rem',
  },
  progressbar: {
    height: '0.25rem',
  },
  basic: {
    gap: '0.5rem',
  },
} satisfies TokenTree;
