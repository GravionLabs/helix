import type { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

/**
 * The editor theme of Helix: surfaces, text, cursor, selection, active line, gutters, panels and
 * tooltips, all on `var(--h-*)` values, so the editor follows the light and dark theme and a
 * primary colour that changes at runtime without a rebuild. Font family and size come from
 * `--hx-code-font-family` and `--hx-code-font-size`, with defaults.
 *
 * It needs no import from helix-ui: dark mode is the `.app-dark` class, through CSS only.
 * Pair it with `hxCodeHighlight()` for the syntax colours.
 */
export function hxCodeTheme(): Extension {
  return EditorView.theme({
    '&': {
      color: 'var(--h-text-color)',
      backgroundColor: 'var(--h-content-background)',
      fontSize: 'var(--hx-code-font-size, 0.875rem)',
    },
    '&.cm-focused': { outline: 'none' },
    '.cm-scroller': {
      fontFamily:
        'var(--hx-code-font-family, ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace)',
    },
    '.cm-content': { caretColor: 'var(--h-primary-color)' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--h-primary-color)' },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      { backgroundColor: 'var(--h-highlight-background)' },
    '.cm-activeLine': { backgroundColor: 'var(--h-content-hover-background)' },
    '.cm-selectionMatch': { backgroundColor: 'var(--h-highlight-background)' },
    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
      backgroundColor: 'var(--h-highlight-background)',
    },
    '.cm-gutters': {
      color: 'var(--h-text-muted-color)',
      backgroundColor: 'var(--h-content-background)',
      borderRight: '1px solid var(--h-content-border-color)',
    },
    '.cm-activeLineGutter': {
      color: 'var(--h-text-color)',
      backgroundColor: 'var(--h-content-hover-background)',
    },
    '.cm-foldPlaceholder': {
      color: 'var(--h-text-muted-color)',
      backgroundColor: 'var(--h-content-hover-background)',
      border: '1px solid var(--h-content-border-color)',
    },
    '.cm-panels': {
      color: 'var(--h-text-color)',
      backgroundColor: 'var(--h-content-background)',
    },
    '.cm-panels.cm-panels-top': { borderBottom: '1px solid var(--h-content-border-color)' },
    '.cm-panels.cm-panels-bottom': { borderTop: '1px solid var(--h-content-border-color)' },
    '.cm-tooltip': {
      color: 'var(--h-overlay-popover-color, var(--h-text-color))',
      backgroundColor: 'var(--h-overlay-popover-background, var(--h-content-background))',
      border: '1px solid var(--h-overlay-popover-border-color, var(--h-content-border-color))',
      borderRadius: 'var(--h-overlay-popover-border-radius, var(--h-content-border-radius))',
    },
    '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
      color: 'var(--h-highlight-color)',
      backgroundColor: 'var(--h-highlight-background)',
    },
  });
}
