# Changed files

`hx-changed-files` from `@gravionlabs/helix-code/git` lists the files of a change set with their status and line counts; the user selects a file to see its diff. It needs no CodeMirror: the `/git` entry imports nothing from `@codemirror/*` or `@lezer/*`.

```html
<hx-changed-files
  aria-label="Changes"
  [files]="files"
  [selected]="path"
  (selectedChange)="path = $event"
/>
```

```ts
import { HxChangedFiles, type HxChangedFile } from '@gravionlabs/helix-code/git';
```

## Type

`HxChangedFile`: `{ path, oldPath?, status, additions?, deletions?, binary? }`. `status` is `added`, `modified`, `deleted`, `renamed`, `untracked` or `conflicted`.

## Inputs and output

| Name                            | Type                       | Description                                        |
| ------------------------------- | -------------------------- | -------------------------------------------------- |
| `files` (required)              | `readonly HxChangedFile[]` | The files of the change set.                       |
| `selected`                      | `string \| null`           | The path of the selected file.                     |
| `selectedChange`                | output `string`            | The path the user selects (click, Enter or Space). |
| `aria-label`, `aria-labelledby` | `string`                   | The accessible name of the list.                   |

## Rows

Each row shows a status letter (A, M, D, R, U, C) with a color and, for screen readers, the status as text; the file name; the folder, muted; and `+n −n` when given. A renamed file shows its old path. A `binary` file shows "binary" instead of the counts. The header shows the number of files and the totals. Colors: `--hx-changed-added-color` and `--hx-changed-removed-color`.

## Keyboard

The list is a `listbox` with `aria-activedescendant`. Arrow up and down, Home and End move; Enter or Space selects.

## Row actions

Add an `<ng-template hxChangedFileActions>` to put your own actions (stage, discard) next to each row. The context `$implicit` is the file. The actions sit beside the option, not inside it, and a click on them does not select the row.

```html
<hx-changed-files [files]="files">
  <ng-template hxChangedFileActions let-file>
    <button type="button" (click)="stage(file.path)">Stage</button>
  </ng-template>
</hx-changed-files>
```

## Not included

Sections (Conflicts, Staged, Changes): render one `hx-changed-files` per section. A folder tree and multi-selection are not supported.
