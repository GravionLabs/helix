# Conflict markers

`hxConflictMarkers()` from `@gravionlabs/helix-code` is a CodeMirror extension that shows Git conflict markers as blocks. Use it in `hx-code-editor` through `extensions`; the editor itself stays generic.

```html
<hx-code-editor aria-label="Merge" path="app.ts" [(value)]="text" [extensions]="extensions" />
```

```ts
import { keymap } from '@codemirror/view';
import { hxConflictMarkers, hxNextConflict, hxPreviousConflict } from '@gravionlabs/helix-code';

const extensions = [
  hxConflictMarkers(),
  keymap.of([
    { key: 'Alt-ArrowDown', run: hxNextConflict },
    { key: 'Alt-ArrowUp', run: hxPreviousConflict },
  ]),
];
```

## What it shows

- The lines of the ours and theirs sides are colored, the base side (diff3 style) is grey, the marker lines are dimmed. The marker lines keep their text (`<<<<<<< HEAD`), so the sides are named in text and not by color alone.
- A row above each conflict has the actions **Accept ours**, **Accept theirs** and **Accept both**. An action replaces the conflict with the chosen lines as one undoable change; "both" inserts ours, then theirs, and drops the base.
- The conflicts follow every edit. A conflict whose markers you delete by hand is no longer counted.
- Malformed markers (no end, a start inside a conflict, a repeated separator) stay plain text; nothing throws.

## API

| Name                       | Description                                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `hxConflictMarkers()`      | The extension.                                                                                                 |
| `hxConflictField`          | The `StateField<readonly HxConflict[]>` that holds the conflicts.                                              |
| `hxConflictCount(state)`   | The number of conflicts left; 0 without the extension.                                                         |
| `hxNextConflict(view)`     | Command: moves the cursor to the next conflict after the cursor line, wraps around; `false` without conflicts. |
| `hxPreviousConflict(view)` | Command: the same backwards.                                                                                   |
| `hxParseConflicts(text)`   | Pure parser, returns `HxConflict[]`.                                                                           |

There is no default key map: the app binds the commands.

`HxConflict` has 0-based line numbers: `{start, end, ours, base?, theirs, oursLabel, baseLabel?, theirsLabel}`. `start` is the `<<<<<<<` line and `end` the `>>>>>>>` line. Each range `{from, to}` runs from its own marker line to the next one: `ours` to `=======` (or to `|||||||`), `base` from `|||||||` to `=======`, `theirs` from `=======` to `>>>>>>>`. The labels are the text after the markers.

## Colors

| Variable                            | Default light / dark |
| ----------------------------------- | -------------------- |
| `--hx-code-conflict-ours-bg`        | translucent green    |
| `--hx-code-conflict-theirs-bg`      | translucent blue     |
| `--hx-code-conflict-marker-opacity` | `0.6`                |

The defaults are set in the extension, not in the tokens; set the variables on an ancestor to change them.

## Accessibility

Each action row is a `group` named "Conflict n of m" with real buttons; their names include the side label (for example "Accept ours: HEAD"). The buttons are reached with Tab.
