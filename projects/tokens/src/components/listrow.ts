// Component tokens of "listRow" (a row of an `hx-list`).
import type { TokenTree } from '../types.ts';

export const listRow = {
  root: {
    gap: '{space.2}',
    paddingX: '{space.3}',
    paddingY: '{space.2}',
    borderRadius: '{border.radius.sm}',
    fontSize: '{fontSize.sm}',
    background: 'transparent',
    color: '{text.color}',
    iconColor: '{text.muted.color}',
    disabledOpacity: '{disabled.opacity}',
  },
  list: {
    gap: '0.125rem',
  },
  meta: {
    color: '{text.muted.color}',
    fontSize: '{fontSize.xs}',
  },
  hover: {
    background: '{surface.hover}',
    color: '{text.hover.color}',
  },
  selected: {
    background: '{highlight.background}',
    color: '{highlight.color}',
    hoverBackground: '{highlight.focus.background}',
    hoverColor: '{highlight.focus.color}',
  },
  current: {
    background: '{surface.hover}',
    color: '{text.hover.color}',
    fontWeight: '600',
    indicatorColor: '{primary.color}',
    indicatorWidth: '2px',
  },
  focusRing: {
    width: '{focus.ring.width}',
    style: '{focus.ring.style}',
    color: '{focus.ring.color}',
    offset: '-2px',
  },
} satisfies TokenTree;
