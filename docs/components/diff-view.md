# Diff view

`hx-diff-view` from `@gravionlabs/helix-code` shows two versions of a text, side by side or unified, read-only. It highlights the syntax, marks the changed words inside a changed line, shows a change gutter and collapses long unchanged regions. It needs the optional peers `@codemirror/state`, `@codemirror/view`, `@codemirror/merge`, `@codemirror/language` and `@lezer/highlight`, plus `@codemirror/language-data` for the default language list.

```html
<hx-diff-view aria-label="Changes in app.ts" path="src/app/app.ts" [original]="before" [modified]="after" layout="unified" />
```

## Inputs

| Name                            | Type                                               | Description                                                                                                                                              |
| ------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `original` (required)           | `string`                                           | The old version. Empty: a new file.                                                                                                                      |
| `modified` (required)           | `string`                                           | The new version. Empty: a deleted file.                                                                                                                  |
| `path`                          | `string`                                           | A file name or path; it selects the language. Empty or unknown: plain text.                                                                              |
| `layout`                        | `'split' \| 'unified' \| 'auto'`                   | `split` (default): two columns. `unified`: one column, removed lines inline. `auto`: split when the host is at least `splitMinWidth` wide, else unified. |
| `splitMinWidth`                 | `number`                                           | With `layout="auto"`: the host width in px from which the view is split. Default 900.                                                                    |
| `collapseUnchanged`             | `boolean \| { margin?: number; minSize?: number }` | Default `true`: 3 lines stay visible around a change, at least 4 lines collapse.                                                                         |
| `aria-label`, `aria-labelledby` | `string`                                           | The accessible name; it is moved onto the content element.                                                                                               |

## Navigation

The component has methods and signals so an app can build its own controls (it binds the keys itself).

| Member                                | Description                                                                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `next()`, `previous()`                | Select the next or previous change and scroll it into view. They wrap: after the last comes the first, before the first the last. |
| `changeCount()`                       | The number of changes.                                                                                                            |
| `currentChange()`                     | The 1-based number of the change that holds the cursor; `0` before the first `next()` or when the cursor is outside a change.     |
| `revealLine(line, side = 'modified')` | Scrolls to a 1-based line of the `'original'` or `'modified'` text and expands the collapsed region around it.                    |

```html
<hx-diff-view #diff [original]="before" [modified]="after" layout="auto" />
<button (click)="diff.previous()">Previous</button>
<span>{{ diff.currentChange() }} of {{ diff.changeCount() }}</span>
<button (click)="diff.next()">Next</button>
```

With `layout="auto"` the view follows the width of its host element (a `ResizeObserver`), not of the window, so a resizable panel switches the layout. It is built after the first measurement. `effectiveLayout()` tells which layout is in use.

## Behaviour

- The view is rebuilt when `original`, `modified`, the effective layout, `path` or `collapseUnchanged` changes (a resize that keeps the layout does not rebuild). `changeCount()` and `currentChange()` are reset by a rebuild. A theme switch needs no rebuild.
- The language loads lazily; a late result of an earlier input is ignored.
- Both versions may be empty strings (new file, deleted file).
- The view is destroyed with the component.

## Colors

| Variable                                                     | Meaning                           |
| ------------------------------------------------------------ | --------------------------------- |
| `--hx-diff-added-background`, `--hx-diff-removed-background` | the tint of an added/removed line |
| `--hx-diff-added-mark`, `--hx-diff-removed-mark`             | the tint of a changed word        |
| `--hx-diff-added-sign`, `--hx-diff-removed-sign`             | the color of the gutter `+` / `-` |

The defaults for light and dark (`.app-dark`) are set by the component. Override a variable anywhere above it; the override wins in both themes. `hxDiffTheme()` is the same theme as a CodeMirror extension.

## Accessibility

Added and removed lines are told apart without color: the gutter shows `+` and `-`. The content is read-only (`aria-readonly`); give the host an `aria-label` or `aria-labelledby`.
