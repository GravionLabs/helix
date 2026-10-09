# Dialog

`hx-dialog` is a modal or non-modal dialog on `@angular/cdk/dialog`. `HxDialogService` opens a component in one and
returns its result.

```html
<hx-dialog [(visible)]="open" header="Edit profile" width="30rem">
  <input hx-input [(ngModel)]="name" aria-label="Name" />
  <div hxDialogFooter>
    <button hx-button variant="text" (click)="open = false">Cancel</button>
    <button hx-button (click)="save()">Save</button>
  </div>
</hx-dialog>
```

```ts
const ref = inject(HxDialogService).open(EditUser, { header: 'Edit user', width: '30rem', data: { id: 7 } });
ref.closed.subscribe((result) => console.log(result));
// inside EditUser: inject(HX_DIALOG_DATA) is { id: 7 }; inject(HxDialogRef).close(result)
```

| Input / output    | Type                     | Default    | Description                                                             |
| ----------------- | ------------------------ | ---------- | ----------------------------------------------------------------------- |
| `visible`         | `boolean`                | `false`    | `[(visible)]`: open or closed; closing from inside sets it to `false`.  |
| `header`          | `string`                 |            | Title (a heading); content marked `hxDialogHeader` follows it.          |
| `modal`           | `boolean`                | `true`     | Mask, focus trap, page behind hidden from assistive technology.         |
| `closable`        | `boolean`                | `true`     | The close button.                                                       |
| `closeOnEscape`   | `boolean`                | `true`     | Escape closes it.                                                       |
| `dismissableMask` | `boolean`                | `false`    | A click on the mask closes it.                                          |
| `position`        | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right' \| 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'center'` | Where it sits. |
| `width`, `height` | CSS length               |            | Size; it never grows beyond the screen and the content scrolls.         |
| `panelClass`      | `string \| string[]`     |            | Extra classes on the overlay pane.                                      |
| `closeLabel`      | `string`                 | `'Close'`  | Name of the close button.                                               |
| `ariaLabel`       | `string`                 |            | Name of the dialog when there is no `header`.                           |
| `(shown)`, `(hidden)` | `void`               |            | Opened, closed (by whatever means).                                     |

`HxDialogService.open(Component, config)` takes the same options (`header`, `width`, `modal`, `closable`,
`closeOnEscape`, `dismissableMask`, `position`, `panelClass`, `closeLabel`, `ariaLabel`) plus `data`. It returns an
`HxDialogRef` with `close(result)`, `closed` (emits the result, or `undefined` when closed some other way) and
`componentInstance`.

- **Content:** `hx-dialog` creates its content when it opens and destroys it when it closes.
- **Accessibility:** the CDK container has `role="dialog"`, `aria-modal` (modal only) and `aria-labelledby` pointing at
  the title (or `aria-label`). The focus moves to the first control of the content (the close button comes last in the
  DOM), is trapped while a modal dialog is open, and returns to the element that had it when the dialog closes.
  Escape closes it. If the content has no focusable element, the dialog itself is focused.

## Tokens

The look comes from the design tokens `--h-dialog-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
