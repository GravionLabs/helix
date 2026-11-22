# Conflict merge

`<hx-conflict-merge>` from `@gravionlabs/helix-code` merges two versions of a text. Lines both versions share are shown once; each differing part shows both sides and offers **mine**, **theirs** or **both**. The result is a textarea and can be edited before it is taken.

```html
<hx-dialog [(visible)]="visible" header="Merge" width="48rem">
  <hx-conflict-merge [mine]="mine" [theirs]="theirs" (merged)="take($event)" (cancelled)="visible.set(false)" />
</hx-dialog>
```

The component renders no dialog and imports nothing from `@gravionlabs/helix-ui`; the app places it (the demo uses `hx-dialog`).

## API

| Name                       | Kind           | Description                                                                                       |
| -------------------------- | -------------- | ------------------------------------------------------------------------------------------------- |
| `mine`, `theirs`           | required input | The two versions. Changing either resets the choices and the manual edit.                         |
| `mineLabel`, `theirsLabel` | input          | Names of the sides, default `'Mine'` and `'Theirs'`.                                              |
| `result()`                 | signal         | The merged text for the current choices (`hxMergeText`, ends with a line break when `mine` does). |
| `unresolved()`             | signal         | The number of differing parts without a choice yet.                                               |
| `merged`                   | output         | The final text on confirm.                                                                        |
| `cancelled`                | output         | Cancel was pressed.                                                                               |

## Behaviour

- The default choice of each part is mine. `unresolved()` is informational: confirm is allowed while it is above 0, and unchosen parts take mine.
- After a manual edit of the result, a changed choice asks first with an inline prompt (**Overwrite** / **Keep edit**). Keep edit leaves the text and the old choice.
- Each choice is a native radio group with an accessible name ("Choice for difference n").
- Colors of the two sides: `--hx-code-conflict-ours-bg`, `--hx-code-conflict-theirs-bg`.
