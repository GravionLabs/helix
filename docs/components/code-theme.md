# Code theme

`hxCodeTheme()` and `hxCodeHighlight()` from `@gravionlabs/helix-code` give a CodeMirror editor or diff view the Helix look. They need the optional peers `@codemirror/state`, `@codemirror/view`, `@codemirror/language` and `@lezer/highlight`, and import nothing from helix-ui.

```ts
import { hxCodeHighlight, hxCodeTheme } from '@gravionlabs/helix-code';

new EditorView({
  parent,
  state: EditorState.create({ doc, extensions: [hxCodeTheme(), hxCodeHighlight()] }),
});
```

| Function            | Description                                                                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `hxCodeTheme()`     | The editor theme: background, text, cursor, selection, active line, gutters, panels and tooltips, on `var(--h-*)` only. |
| `hxCodeHighlight()` | The syntax highlighting: a `HighlightStyle` on lezer tags, its colors the variables `--hx-code-*`.                      |

## Theme switch

Dark mode keys on the `.app-dark` class, through CSS only. The defaults of `--hx-code-*` for light and dark are set inside `hxCodeHighlight()` (no stylesheet to import), so a theme switch needs no rebuild of the editor.

## CSS variables

| Variable                                                                                                                                        | Default                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `--hx-code-keyword`, `-string`, `-number`, `-comment`, `-function`, `-type`, `-property`, `-operator`, `-meta`, `-invalid`, `-link`, `-heading` | light and dark default each |
| `--hx-code-font-family`                                                                                                                         | a monospace stack           |
| `--hx-code-font-size`                                                                                                                           | `0.875rem`                  |

Set one on `:root` or any container to override it in both themes:

```css
:root {
  --hx-code-keyword: #0b6e4f;
}
```

- **Accessibility:** every default syntax color reaches a contrast of at least 4.5:1 against the editor background in the light and the dark theme; a test checks it. An override is yours to check.
