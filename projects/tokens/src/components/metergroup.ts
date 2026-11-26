// Component tokens of "metergroup".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const metergroup = {
  root: {
    borderRadius: '{content.border.radius}',
    gap: '{space.4}',
  },
  meters: {
    background: '{content.border.color}',
    size: '0.5rem',
  },
  label: {
    gap: '{space.2}',
  },
  labelMarker: {
    size: '0.5rem',
  },
  labelIcon: {
    size: '1rem',
  },
  labelList: {
    verticalGap: '{space.2}',
    horizontalGap: '{space.4}',
  },
} satisfies TokenTree;
