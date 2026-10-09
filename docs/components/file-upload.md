# File upload

`hx-file-upload` collects files and emits them; there is no HTTP in it, the app uploads. The choose control is a
native `<input type="file">` inside a button-like label, so it works by keyboard; the drop zone is an extra way to add
files. Files of the wrong type, too large, or beyond the limit are not added and the reason is shown.

```html
<hx-file-upload accept="image/*,.pdf" multiple [maxFileSize]="1000000" [fileLimit]="5" [progress]="percent()"
                (select)="onSelect($event)" (upload)="upload($event)" />
<hx-file-upload mode="basic" accept=".csv" chooseLabel="Import" (select)="import($event)" />
```

| Input                   | Type                    | Default      | Description                                          |
| ----------------------- | ----------------------- | ------------ | ---------------------------------------------------- |
| `mode`                  | `'basic' \| 'advanced'` | `'advanced'` | `basic`: only the choose button and the names.       |
| `accept`                | `string`                | `''`         | `.png`, `image/*`, `application/pdf`, comma separated. |
| `multiple`              | `boolean`               | `false`      | Several files; otherwise a new choice replaces the old. |
| `maxFileSize`, `fileLimit` | `number`             |              | Largest file in bytes, most files in the list.       |
| `progress`              | `number \| null`        | `null`       | 0 to 100; shows a bar while set.                     |
| `chooseLabel`, `uploadLabel`, `cancelLabel`, `removeLabel`, `dropLabel` | `string` | | Texts. The three `invalid…Message` inputs take `{0}`, `{1}`. |

Outputs: `(select)` the files one choice or drop added, `(remove)` the file removed, `(clear)` Cancel emptied the
list, `(upload)` all files in the list. `reset()` empties the list from code, and `files()` is the current list.

- **Accessibility:** the file input is visually hidden but focusable (Enter or Space opens the dialog, and the label
  shows the focus ring); dropping is not the only way to add files. Validation messages are in a polite live region
  (`role="status"`); the progress bar is a `progressbar`; each remove button is named "Remove {file}".

## Tokens

The look comes from the design tokens `--h-fileupload-*`, `--h-button-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
