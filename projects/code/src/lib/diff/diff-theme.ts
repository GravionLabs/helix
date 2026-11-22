import type { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

/** The roles of the diff colors: `--hx-diff-added-*` and `--hx-diff-removed-*`. */
export type HxDiffKind = 'added' | 'removed';
/** `background` tints a changed line, `mark` a changed word, `sign` the gutter sign. */
export type HxDiffPart = 'background' | 'mark' | 'sign';

/** The defaults of `--hx-diff-*` in the light and the dark theme. */
export const HX_DIFF_PALETTE: Readonly<
  Record<HxDiffKind, Readonly<Record<HxDiffPart, { light: string; dark: string }>>>
> = {
  added: {
    background: {
      light: 'rgba(22, 163, 74, 0.12)',
      dark: 'rgba(74, 222, 128, 0.14)',
    },
    mark: {
      light: 'rgba(22, 163, 74, 0.32)',
      dark: 'rgba(74, 222, 128, 0.34)',
    },
    sign: { light: '#15803d', dark: '#86efac' },
  },
  removed: {
    background: {
      light: 'rgba(220, 38, 38, 0.1)',
      dark: 'rgba(248, 113, 113, 0.14)',
    },
    mark: {
      light: 'rgba(220, 38, 38, 0.3)',
      dark: 'rgba(248, 113, 113, 0.34)',
    },
    sign: { light: '#b91c1c', dark: '#fca5a5' },
  },
};

const KINDS = Object.keys(HX_DIFF_PALETTE) as HxDiffKind[];
const PARTS: HxDiffPart[] = ['background', 'mark', 'sign'];

const color = (kind: HxDiffKind, part: HxDiffPart): string =>
  `var(--hx-diff-${kind}-${part}, var(--hx-diff-default-${kind}-${part}))`;

const defaults = (mode: 'light' | 'dark'): Record<string, string> =>
  Object.fromEntries(
    KINDS.flatMap((k) =>
      PARTS.map((p) => [`--hx-diff-default-${k}-${p}`, HX_DIFF_PALETTE[k][p][mode]]),
    ),
  );

const ADDED_LINE = '&.cm-merge-b .cm-changedLine, & .cm-inlineChangedLine';
const REMOVED_LINE = '&.cm-merge-a .cm-changedLine, & .cm-deletedChunk';
const ADDED_MARK = '&.cm-merge-b .cm-changedText, & .cm-inlineChangedLine .cm-changedText';
const REMOVED_MARK = '&.cm-merge-a .cm-changedText, & .cm-deletedChunk .cm-deletedText';
const ADDED_SIGN = '&.cm-merge-b .cm-changedLineGutter, & .cm-inlineChangedLineGutter';
const REMOVED_SIGN = '&.cm-merge-a .cm-changedLineGutter, & .cm-deletedLineGutter';

const sign = (kind: HxDiffKind, char: string) => ({
  color: color(kind, 'sign'),
  background: 'transparent',
  textAlign: 'center',
  fontWeight: '600',
  '&::before': { content: `"${char}"` },
});

/**
 * The Helix colors of the diff view. Added and removed lines, changed words and the gutter signs
 * (`+`, `-`) take their colors from `--hx-diff-added-*` and `--hx-diff-removed-*`; the defaults for
 * `.app-dark` are set here, so a theme switch needs no rebuild.
 */
export function hxDiffTheme(): Extension {
  return [
    EditorView.baseTheme({
      '&': defaults('light'),
      '.app-dark &': defaults('dark'),
    }),
    EditorView.theme({
      [ADDED_LINE]: { backgroundColor: color('added', 'background') },
      [REMOVED_LINE]: { backgroundColor: color('removed', 'background') },
      [ADDED_MARK]: { background: color('added', 'mark') },
      [REMOVED_MARK]: { background: color('removed', 'mark') },
      '.cm-changeGutter': { width: '1.25rem', padding: '0' },
      [ADDED_SIGN]: sign('added', '+'),
      [REMOVED_SIGN]: sign('removed', '-'),
      '.cm-collapsedLines': {
        color: 'var(--h-text-muted-color)',
        background: 'var(--h-content-hover-background)',
      },
      '.cm-deletedChunk': { backgroundColor: color('removed', 'background') },
      '.cm-chunkButtons': { display: 'flex', gap: '6px', padding: '2px 4px' },
      '.cm-review-button': {
        font: 'inherit',
        color: 'inherit',
        background: 'var(--h-content-background)',
        border: '1px solid var(--h-content-border-color)',
        borderRadius: 'var(--h-border-radius, 4px)',
        padding: '0 8px',
        cursor: 'pointer',
      },
      '.cm-review-button:hover': { background: 'var(--h-content-hover-background)' },
      '.cm-review-button:focus-visible': {
        outline: '2px solid var(--h-primary-color)',
        outlineOffset: '1px',
      },
    }),
  ];
}
