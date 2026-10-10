// The site's theme: VitePress's default theme on the Helix design tokens (ADR 0001, #521).
// `generated/helix.base.css` is written by `pnpm tokens:site` from the Helix tokens — the same
// tokens the components render with — and `helix.css` binds VitePress's variables to them.
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './generated/helix.base.css';
import './helix.css';

export default { extends: DefaultTheme } satisfies Theme;
