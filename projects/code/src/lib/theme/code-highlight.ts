import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import type { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';

/** The syntax roles of Helix code, each one a CSS variable `--hx-code-<role>`. */
export type HxCodeRole =
  | 'keyword'
  | 'string'
  | 'number'
  | 'comment'
  | 'function'
  | 'type'
  | 'property'
  | 'operator'
  | 'meta'
  | 'invalid'
  | 'link'
  | 'heading';

/** The default colour of a role in the light and the dark theme. */
export interface HxCodeColor {
  readonly light: string;
  readonly dark: string;
}

/**
 * The defaults of `--hx-code-*`. Every colour reaches at least 4.5:1 against the editor background
 * (`--h-content-background`: `#ffffff` light, `#1b1b1f` dark); the token test checks it.
 */
export const HX_CODE_PALETTE: Readonly<Record<HxCodeRole, HxCodeColor>> = {
  keyword: { light: '#6d28d9', dark: '#c4b5fd' },
  string: { light: '#0f766e', dark: '#5eead4' },
  number: { light: '#b45309', dark: '#fdba74' },
  comment: { light: '#667085', dark: '#9ca3af' },
  function: { light: '#1d4ed8', dark: '#93c5fd' },
  type: { light: '#0e7490', dark: '#67e8f9' },
  property: { light: '#0369a1', dark: '#7dd3fc' },
  operator: { light: '#475569', dark: '#cbd5e1' },
  meta: { light: '#4b5563', dark: '#9ca3af' },
  invalid: { light: '#b91c1c', dark: '#fca5a5' },
  link: { light: '#1d4ed8', dark: '#93c5fd' },
  heading: { light: '#1e40af', dark: '#bfdbfe' },
};

const ROLES = Object.keys(HX_CODE_PALETTE) as HxCodeRole[];

/** `var(--hx-code-<role>)`, falling back to the built-in default of the current theme. */
function roleColor(role: HxCodeRole): string {
  return `var(--hx-code-${role}, var(--hx-code-default-${role}))`;
}

/**
 * The built-in defaults live on the editor under the name `--hx-code-default-*`, light first and
 * `.app-dark` after it. The public `--hx-code-*` stay unset, so an app overrides one anywhere above
 * the editor (`:root`, a container) and the override wins in both themes.
 */
const defaultsTheme = EditorView.baseTheme({
  '&': Object.fromEntries(ROLES.map((r) => [`--hx-code-default-${r}`, HX_CODE_PALETTE[r].light])),
  '.app-dark &': Object.fromEntries(
    ROLES.map((r) => [`--hx-code-default-${r}`, HX_CODE_PALETTE[r].dark]),
  ),
});

const style = HighlightStyle.define([
  {
    tag: [t.keyword, t.controlKeyword, t.moduleKeyword, t.definitionKeyword],
    color: roleColor('keyword'),
  },
  { tag: [t.string, t.special(t.string), t.regexp, t.character], color: roleColor('string') },
  { tag: [t.number, t.bool, t.null, t.atom, t.unit], color: roleColor('number') },
  {
    tag: [t.comment, t.lineComment, t.blockComment, t.docComment],
    color: roleColor('comment'),
    fontStyle: 'italic',
  },
  {
    tag: [t.function(t.variableName), t.function(t.propertyName), t.macroName, t.labelName],
    color: roleColor('function'),
  },
  { tag: [t.typeName, t.className, t.namespace, t.tagName], color: roleColor('type') },
  {
    tag: [t.propertyName, t.attributeName, t.definition(t.variableName)],
    color: roleColor('property'),
  },
  { tag: [t.operator, t.punctuation, t.separator, t.bracket], color: roleColor('operator') },
  {
    tag: [t.meta, t.processingInstruction, t.annotation, t.documentMeta],
    color: roleColor('meta'),
  },
  { tag: t.invalid, color: roleColor('invalid') },
  { tag: [t.link, t.url], color: roleColor('link'), textDecoration: 'underline' },
  { tag: t.heading, color: roleColor('heading'), fontWeight: '600' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strong, fontWeight: '600' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
]);

/**
 * The syntax highlighting of Helix code: a `HighlightStyle` on lezer tags whose colours are the CSS
 * variables `--hx-code-<role>` (see {@link HX_CODE_PALETTE}), with defaults for the light and the
 * dark (`.app-dark`) theme set inside the extension; there is no stylesheet to import.
 * A theme switch needs no rebuild of the editor.
 */
export function hxCodeHighlight(): Extension {
  return [defaultsTheme, syntaxHighlighting(style)];
}
