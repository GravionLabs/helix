// Component tokens of "metergroup".
// Originally extracted from the Helix preset of the former helix-core; this file is the source now.
import type { TokenTree } from '../types.ts';

export const metergroup = {
  root: {
    borderRadius: '{content.border.radius}',
    gap: '1rem',
  },
  meters: {
    background: '{content.border.color}',
    size: '0.5rem',
  },
  label: {
    gap: '0.5rem',
  },
  labelMarker: {
    size: '0.5rem',
  },
  labelIcon: {
    size: '1rem',
  },
  labelList: {
    verticalGap: '0.5rem',
    horizontalGap: '1rem',
  },
} satisfies TokenTree;
