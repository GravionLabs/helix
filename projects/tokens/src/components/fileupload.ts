// Component tokens of "fileupload".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
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
    gap: '{space.2}',
  },
  content: {
    highlightBorderColor: '{primary.color}',
    padding: '0 1.125rem 1.125rem 1.125rem',
    gap: '{space.4}',
  },
  file: {
    padding: '{space.4}',
    gap: '{space.4}',
    borderColor: '{content.border.color}',
    info: {
      gap: '{space.2}',
    },
  },
  fileList: {
    gap: '{space.2}',
  },
  progressbar: {
    height: '0.25rem',
  },
  basic: {
    gap: '{space.2}',
  },
} satisfies TokenTree;
