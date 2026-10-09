# The Helix Design System

The look of Helix lives in one place, the tokens of `helixPreset` (ADR 0001, [Theming](THEMING.md)). The
**Design System** is that look made browsable for designers and for AI tools: tokens per theme, the brand
book, previews of the components, the fonts and the mark. It is *generated* from the repository (epic #519,
feature #522); nothing in it is edited by hand except the brand-book text and the previews' markup, which are
files in `scripts/design-system/`.

## Regenerate

```bash
pnpm tokens:export          # resolves projects/tokens to dist/tokens (also the last step of build:lib)
pnpm design-system:build    # writes dist/design-system/project/…
```

The output is deterministic: a second run writes the same bytes. `pnpm test:scripts` (part of `test:ci`)
checks the files against the type's grammar and caps, and fails when a preview uses a class that
`bundle.css` does not define.

| File                                | Comes from                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------- |
| `tokens.json`                       | `dist/tokens/helix.json` (`scripts/design-system/tokens.mjs`); values follow `helixPreset`        |
| `README.md`                         | `scripts/design-system/content/README.md` (hand-written brand book; names tokens, no values)       |
| `components/bundle.css`             | resolved `--h-*` tokens + the components' real structural CSS (`bundle.mjs`)                       |
| `components/<Name>/…`               | `scripts/design-system/previews.mjs`: markup captured from the demo, guidelines, selector          |
| `components/Cover/preview.html`     | `build.mjs`: palette blocks, a helix of dots and the name, all in tokens                          |
| `fonts/*.woff2`                     | `@fontsource-variable/inter` (latin, variable); code uses the system monospace                    |
| `assets/Logos/…`                    | the double helix of the shell's nav rail in `primary` (light and dark)                            |

To add a component: capture its markup from the demo (class names only, no Angular attributes), add an entry
to `PREVIEWS` with `css` (the directories of `projects/core` whose structural CSS it needs) and run the build;
the drift test tells you which class or `--h-*` variable is missing. Components are Angular and the type's
runtime is React, so there is no `bundle.js`: previews are static renditions of the real markup and CSS.

## Publish and re-sync

CI builds the folder but does not upload it: publishing needs a Claude session. Two targets take the same
folder.

**The Design System artifact** (the type "Design System" of the Artifact tool; Claude does it from a session in
this repository: "sync the Helix Design System"):

1. Upload the two `assets/Logos/*.svg` as assets of the artifact (they are named by records in the index).
2. Publish every other file under `project/` in one call (`tokens.json`, `README.md`, `components/**`,
   `fonts/**`, `assets/Logos/README.md`), the index `project/design-system.json` last (title `Helix`, namespace
   `Helix`, `assetGroups.Logos` with the uploaded ids, `lastChange` with the commit).
3. **Re-sync** sends only the files whose bytes changed. Before it, read the index and the files you will
   replace: people edit the system on its page, and a `lastChange` newer than the last sync means someone did.
   Keep their usage notes, add what is new, and list (do not silently delete) tokens the code no longer has.

The current system: https://claude.ai/artifact/CYmYZ374LeKNVn6SLRaE8Q (private to its owner until shared from
the page's Share menu).

**A claude.ai/design project** (`/design-sync`, which the user starts; it uses the `DesignSync` tool with the
user's login): create or pick a design-system project, review the path list, and upload the same folder. Each
preview's first line (`<!-- @dsCard group=… height=… -->`) is what the Design System pane indexes.

## What is not in it yet

The shell's chrome (topbar, nav rail, status bar), the table, overlay and menu families, and 78 of the 90
library components have no preview; icons are not mirrored (the PrimeIcons font is not redistributed). When
the vanilla `helix-ui` library (epic #523) replaces `helix-core`, the previews are regenerated from its
components instead of the fork's.
