// Component tokens of "card".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const card = {
  root: {
    background: '{surface.card}',
    borderColor: '{border.panel}',
    borderRadius: '{border.radius.md}',
    color: '{content.color}',
    shadow: 'none',
  },
  body: {
    padding: '1.25rem',
    gap: '0.5rem',
  },
  caption: {
    gap: '0.5rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '500',
  },
  subtitle: {
    color: '{text.muted.color}',
  },
} satisfies TokenTree;
