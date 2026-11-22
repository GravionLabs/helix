/** Version of `@gravionlabs/helix-code`; a placeholder until the editor components land. */
export const HELIX_CODE_VERSION = '0.1.0';

export { hxCodeTheme } from './lib/theme/code-theme';
export {
  hxCodeHighlight,
  HX_CODE_PALETTE,
  type HxCodeColor,
  type HxCodeRole,
} from './lib/theme/code-highlight';
export { hxLanguageFor, hxLoadLanguage, HX_CODE_LANGUAGES } from './lib/language/language';
export { HxCodeEditor } from './lib/editor/code-editor';
export {
  HxDiffView,
  type HxDiffCollapse,
  type HxDiffLayout,
  type HxDiffSide,
} from './lib/diff/diff-view';
export { hxDiffTheme, HX_DIFF_PALETTE } from './lib/diff/diff-theme';
