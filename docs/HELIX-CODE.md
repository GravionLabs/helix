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

Planned.

## Editor

Planned.

## Diff

Planned.

## Review

Planned.

## Conflicts

Planned.

## Commit graph

Planned.
