// Component tokens of "tabbar" (`hx-tab-bar`, the editor-style tab strip). The scroll buttons read the `tabs` tokens.
import type { TokenTree } from '../types.ts';

export const tabbar = {
  root: {
    minHeight: '2.125rem',
    borderColor: '{content.border.color}',
    borderWidth: '0 0 1px 0',
    transitionDuration: '{transition.duration}',
  },
  tab: {
    hoverBackground: '{content.hover.background}',
    color: '{text.muted.color}',
    hoverColor: '{text.hover.color}',
    activeColor: '{text.color}',
    borderColor: '{content.border.color}',
    padding: '0 0.375rem 0 0.75rem',
    gap: '0.375rem',
    maxWidth: '20rem',
    focusRing: {
      width: '{focus.ring.width}',
      style: '{focus.ring.style}',
      color: '{focus.ring.color}',
      offset: '-1px',
    },
  },
  activeBar: {
    height: '2px',
    background: '{primary.color}',
  },
  group: {
    color: '{text.muted.color}',
    fontSize: '0.6875rem',
  },
  close: {
    size: '1.125rem',
    borderRadius: '{border.radius.sm}',
    hoverBackground: '{content.hover.background}',
  },
  drop: {
    indicatorColor: '{primary.color}',
  },
  attention: {
    color: '{red.500}',
  },
  unread: {
    color: '{green.500}',
  },
  actions: {
    gap: '0.5rem',
    padding: '0 0.625rem',
  },
  colorScheme: {
    light: {
      root: { background: '{surface.100}' },
      tab: { activeBackground: '{content.background}' },
    },
    dark: {
      root: { background: '{surface.950}' },
      tab: { activeBackground: '{content.background}' },
    },
  },
} satisfies TokenTree;
