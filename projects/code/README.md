# @gravionlabs/helix-code

Code editing for Angular apps built on Helix: a CodeMirror editor host, diff and merge views, and Git views.

- `@gravionlabs/helix-code`: editor, theme, languages, diff and merge.
- `@gravionlabs/helix-code/git`: changed files and commit graph. Imports no CodeMirror package.

The CodeMirror packages (`@codemirror/state`, `view`, `language`, `merge`, `language-data`, `commands`, `search`
and `@lezer/highlight`) are optional peer dependencies: install them when you use the main entry. See
[ADR 0007](../../docs/adr/0007-helix-code-package.md).

```sh
pnpm add @gravionlabs/helix-code
```

The package is in development; it holds placeholders until the components land.
