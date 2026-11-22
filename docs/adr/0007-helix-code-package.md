# ADR 0007: helix-code package, entry points and CodeMirror dependency

- Status: Proposed
- Date: 2026-11-22
- Issues: #1138, #1133, #1148

## Context

Apps built on Helix need a code editor, diff and merge views, and Git views (changed files, commit graph). nixe and poimen each use CodeMirror today, nixe with `^6` ranges (`state`, `view`, `language`, `commands`, `search`, `autocomplete`, `lang-markdown`) and poimen with exact pins (`state`, `view`, `language`, `language-data`, `merge`, `@lezer/highlight` 1.2.5). Each app would otherwise keep its own editor host, theme and diff view. A new `projects/*/src/public-api.ts` and a new external dependency both need a decision (`governance.adrPaths` in `.agents/config.json`). The precedent for a package with an optional-peer entry is ADR 0005 (`helix-desktop` with `/tauri`).

## Options

- Name the package `helix-git`: rejected, it holds editor, diff and merge, not only Git views.
- A single entry point: rejected, a consumer of only the Git views (`hx-changed-files`, `hx-commit-graph`) would have to install CodeMirror.
- Exact version pins for CodeMirror: rejected, a peer range lets the app and the library share one copy of `@codemirror/state` and `view`; two copies break at runtime (`instanceof` checks on state).
- `@codemirror/autocomplete` as a peer: rejected, completion sources are app specific; it stays with the app, as do language packages beyond `language-data`.
- `@gravionlabs/helix-ui` as a peer: rejected, the library reads the Helix tokens only through CSS `var(--h-*)` and imports nothing from helix-ui.
- Own windowing for the commit graph instead of the cdk: rejected, `CdkVirtualScrollViewport` from `@angular/cdk` already exists and is tested; an own implementation adds code to maintain.

## Decision

### Package

- Name `@gravionlabs/helix-code`, location `projects/code`.

### Entry points

- Main entry `@gravionlabs/helix-code`: editor host, theme, languages, diff view, comments, conflict markers and merge picker, and the line-diff and merge functions of #1151.
- Secondary entry `@gravionlabs/helix-code/git`: `hx-changed-files` (#1146), the commit lane layout (#1154) and `hx-commit-graph` (#1155, #1156).

### CodeMirror in `/git`

The `/git` entry imports nothing from `@codemirror/*` or `@lezer/*`. A `lint:no-codemirror` script, in the style of `lint:no-tauri`, enforces it and is part of `lint`.

### Peer dependencies

- CodeMirror: `@codemirror/state`, `view`, `language`, `merge`, `language-data`, `commands` and `search` at `^6`, and `@lezer/highlight` at `^1`. All are marked optional in `peerDependenciesMeta`, so a consumer of only `/git` installs none of them. `@codemirror/autocomplete` and language packages beyond `language-data` stay with the app.
- Angular: `@angular/core`, `@angular/common` and `@angular/forms` (form binding of `hx-code-editor`, #1143) at `>=22`, plus `@angular/cdk >=22` for the virtual scrolling of `hx-commit-graph` (#1156, `CdkVirtualScrollViewport`). These are not optional.
- `@gravionlabs/helix-ui` is not a peer. The first PBI that needs an import from it has to revisit this ADR.

### Prefixes

Selector prefix `hx-`, class prefix `Hx`, as in helix-ui and helix-desktop.

### Host access

The library has no Git, file system or Tauri access: data comes in through signal inputs, events go out through outputs.

## Consequences

- One editor, diff and merge package for every app; apps keep their completion sources and extra languages.
- A consumer of only `/git` installs no CodeMirror package.
- A new lint rule and a second entry point to maintain.
- Follow-ups: the files of #1146, #1154, #1155 and #1156 move to `projects/code/git/` with `projects/code/git/src/public-api.ts`; #1139 adds the `/git` entry (`ng-package.json`) and `lint:no-codemirror`.
- The app ranges move from pins (poimen) to `^6` peers; apps own the installed versions.
- The public API grows with the review types of the diff view (`HxDiffComment`, `HxDiffFinding`, #1147, #1148); they are plain interfaces and add no dependency.
