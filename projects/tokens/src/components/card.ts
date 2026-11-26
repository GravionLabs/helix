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
    padding: '{space.5}',
    gap: '{space.2}',
  },
  caption: {
    gap: '{space.2}',
  },
  title: {
    fontSize: '{fontSize.xl}',
    fontWeight: '500',
  },
  subtitle: {
    color: '{text.muted.color}',
  },
} satisfies TokenTree;
