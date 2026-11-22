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
import { hxCodeHighlight, hxCodeTheme } from '@gravionlabs/helix-code';

const extensions = [hxCodeTheme(), hxCodeHighlight()];
```

Colors follow the CSS variables, so a switch between light and dark (`.app-dark`) needs no rebuild. Details, variables and contrast: [Code theme](components/code-theme.md).

## Languages

`hxLanguageFor(path, languages?)` returns the `LanguageDescription` for a file name, or `null`. `hxLoadLanguage(path, languages?)` resolves to the `LanguageSupport`, or `null`; a failed load resolves to `null` and does not throw. Both are plain functions and need no injection context; `languages` defaults to `@codemirror/language-data`. Each grammar is a lazy chunk, so none is in the first bundle.

```ts
import { hxLoadLanguage } from '@gravionlabs/helix-code';

const support = await hxLoadLanguage('src/app/app.ts');
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

Planned.

## Review

Planned.

## Conflicts

Planned.

## Commit graph

Planned.
