# Helix Code

`@gravionlabs/helix-code` is code editing for Angular: a CodeMirror editor, diff and merge views, and Git views (changed files, commit graph). The decision is [ADR 0007](https://github.com/GravionLabs/helix/blob/main/docs/adr/0007-helix-code-package.md).

The package builds, is tested and is published with the other packages. The parts below are added one by one; each section is filled by the PBI that delivers the part.

## Install

```bash
pnpm add @gravionlabs/helix-code
```

## Entry points

- `@gravionlabs/helix-code`: editor host, theme, languages, diff view, comments, conflict markers and merge picker.
- `@gravionlabs/helix-code/git`: changed files and the commit graph. It imports nothing from `@codemirror/*` or `@lezer/*`.

## Peer dependencies

Required:

- `@angular/core`, `@angular/common`, `@angular/forms` at `>=22`
- `@angular/cdk` at `>=22` (virtual scrolling of the commit graph)

CodeMirror, all optional, so a consumer of only `/git` installs none of them:

- `@codemirror/state`, `@codemirror/view`, `@codemirror/language`, `@codemirror/language-data`, `@codemirror/merge`, `@codemirror/commands` and `@codemirror/search` at `^6`
- `@lezer/highlight` at `^1`

`@codemirror/autocomplete` and language packages beyond `language-data` stay with the app: completion sources are app specific. `@gravionlabs/helix-ui` is not a peer.

## Data in, events out, no Git access

The library has no Git, file system or Tauri access. Data comes in through signal inputs, events go out through outputs; the app reads the repository and acts on the events.

## Theme

`hxCodeTheme()` and `hxCodeHighlight()` give every editor and diff view of an app the Helix look. Both return a CodeMirror extension; add them to the `extensions` of the editor.

```ts
import { hxCodeHighlight, hxCodeTheme } from "@gravionlabs/helix-code";

const extensions = [hxCodeTheme(), hxCodeHighlight()];
```

Colors follow the CSS variables, so a switch between light and dark (`.app-dark`) needs no rebuild. Details, variables and contrast: [Code theme](components/code-theme.md).

## Languages

`hxLanguageFor(path, languages?)` returns the `LanguageDescription` for a file name, or `null`. `hxLoadLanguage(path, languages?)` resolves to the `LanguageSupport`, or `null`; a failed load resolves to `null` and does not throw. Both are plain functions and need no injection context; `languages` defaults to `@codemirror/language-data`. Each grammar is a lazy chunk, so none is in the first bundle.

```ts
import { hxLoadLanguage } from "@gravionlabs/helix-code";

const support = await hxLoadLanguage("src/app/app.ts");
if (support) view.dispatch({ effects: language.reconfigure(support) });
```

A view that loads a language for a changing file must ignore a late result of an earlier file (a generation counter), as `hx-code-editor` does.

To ship fewer grammars, provide a shorter list with the token `HX_CODE_LANGUAGES` (default `@codemirror/language-data`). Only `hx-code-editor` reads the token and passes it to the functions; when you call them yourself, pass the list as `languages`.

## Editor

`<hx-code-editor>` hosts a CodeMirror editor: `[(value)]` for the text, `path` for the language, `readOnly`, `lineNumbers`, `lineWrapping`, and `extensions` for the features of the app. The Helix theme and highlighting are on by default, and it works in template-driven, reactive and signal forms.

```html
<hx-code-editor aria-label="Source" path="src/app/app.ts" [(value)]="text" [extensions]="extra" />
```

Inputs change the running view; it is never rebuilt. Details: [Code editor](components/code-editor.md).

## Diff

`<hx-diff-view>` shows two versions of a text, read-only: `original` and `modified` (both required), `path` for the language, `layout` (`'split'` default, `'unified'`, or `'auto'`: split from `splitMinWidth` px of the host, default 900, else unified; it follows the host, not the window) and `collapseUnchanged` (default on: margin 3, minimum 4). Changed words are marked and the gutter shows `+` and `-`, so the change does not rely on color alone. `next()` and `previous()` step through the changes (with wrap-around), `changeCount()` and `currentChange()` give "3 of 12", and `revealLine(line, side)` scrolls to a line and expands the collapsed region around it.

```html
<hx-diff-view aria-label="Changes" path="src/app/app.ts" [original]="before" [modified]="after" />
```

Colors are the CSS variables `--hx-diff-added-*` and `--hx-diff-removed-*`, with defaults for light and dark. Details: [Diff view](components/diff-view.md).

## Changed files

`<hx-changed-files>` from `@gravionlabs/helix-code/git` lists the files of a change set (`HxChangedFile`: `path`, `oldPath`, `status`, `additions`, `deletions`, `binary`) with status letter, name, muted folder and `+n −n`, and a header with the count and totals. `files` and `selected` are inputs, `selectedChange` the output; arrow keys move and Enter selects. An `<ng-template hxChangedFileActions>` adds actions per row. One list per section (Conflicts, Staged, Changes). Details: [Changed files](components/changed-files.md).

```html
<hx-changed-files aria-label="Changes" [files]="files" [selected]="path" (selectedChange)="path = $event" />
```

## Review

`<hx-diff-view>` takes line comments: `[commentable]="true"` lets the reviewer click a line number (Shift-click for a range) and write a comment; `(commentAdded)` emits `{side, startLine, endLine, text, quote}` and the app passes saved comments back as `[comments]` (`HxDiffComment`: `id`, `side`, `startLine`, `endLine`, `text`, `author?`, `time?`). They show below their last line in both layouts, and changing `comments` does not rebuild the editor or close an open draft. `openCommentDraft` is a CodeMirror command for keyboard access; the app binds the key. Details: [Diff view](components/diff-view.md#line-comments).

`[findings]` (`HxDiffFinding`: `id`, `side`, `startLine`, `endLine`, `severity: 'blocking' | 'note'`, `title`, `detail?`) shows review findings as boxes below their last line with the lines marked in the gutter; severity is an icon plus text. With `findingActionLabel` each box has a button and `(findingAction)` emits `{id, quote}`. Details: [Diff view](components/diff-view.md#findings).

`[threads]` (`HxDiffThread`: `id`, `side`, `startLine`, `endLine`, `resolved`, `comments: {id, author, time, text}[]`) shows a review thread as one box with its comments, a reply field (`(replyAdded)` emits `{threadId, text}`) and a resolve button (`(resolvedChange)` emits `{threadId, resolved}`); a resolved thread is collapsed to one line. `[renderComment]` renders Markdown; the result is sanitized by the library. Boxes on one line: findings, threads, comments. Details: [Diff view](components/diff-view.md#threads).

```html
<hx-diff-view [original]="before" [modified]="after" commentable [comments]="comments" (commentAdded)="add($event)" />
```

`[reviewable]="true"` (unified layout only; ignored with `split`) adds an Accept and a Reject button to each change. `(changeDecided)` emits `{index, decision}` with a stable `index` in the initial list of changes; `result()` is the text after the decisions so far, `pendingChanges()` the number of undecided changes, `acceptAll()` / `rejectAll()` decide the rest. Details: [Diff view](components/diff-view.md#accept-and-reject).

## Conflicts

Pure functions for line diffs and merging two texts hunk by hunk; no component and no Angular dependency.

- `hxDiffLines(oldText, newText): HxDiffRow[]` returns rows `{kind: 'same' | 'add' | 'del', text, segments?}`; `text` has no line break. CRLF is read as LF and a final line break adds no line, so `'x\n'` and `'x'` give no rows. A run of deleted lines followed by a run of added lines is paired in order and gets word `segments` (`HxSegment {text, changed}`); surplus rows get none.
- `hxWordDiff(oldLine, newLine)` returns `{old: HxSegment[], new: HxSegment[]}`.
- `hxDiffStat(rows)` returns `{added, removed}`.
- `hxMergeParts(mine, theirs): HxMergePart[]` splits the difference into `{kind: 'same', lines}` and `{kind: 'hunk', index, mine, theirs}`.
- `hxMergeText(parts, choices, endsWithBreak)` builds the merged text. `choices` maps a hunk `index` to `HxMergeChoice` (`'mine' | 'theirs' | 'both'`); a hunk without a choice takes `'mine'`. The result ends with a line break when `endsWithBreak` is true and it has lines.

The algorithm is a longest common subsequence over lines (and over tokens for words) after the common head and tail are trimmed. If the remaining middle has more than 4,000,000 cells (lines x lines), it falls back to "all deleted, then all added".

```ts
const parts = hxMergeParts(mine, theirs);
const merged = hxMergeText(parts, { 0: 'both' }, mine.endsWith('\n'));
```

## Commit graph

Planned.
