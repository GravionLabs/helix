# Confirm

`HxConfirmationService` asks the user to confirm an action. Put `<hx-confirm-dialog />` (centred questions) and/or
`<hx-confirm-popup />` (questions anchored to an element) once in the app, for example in the root component.

```ts
confirmation.confirm({
  header: 'Delete', message: 'Delete this item?', icon: 'pi pi-trash',
  acceptLabel: 'Delete', acceptSeverity: 'danger', accept: () => this.delete(),
});
confirmation.confirm({ message: 'Discard changes?', target: event, accept: () => this.discard() }); // popup at the button
if (await confirmation.confirmAsync({ message: 'Leave the page?' })) { … }
```

`HxConfirmation`: `message`, `header`, `icon`, `acceptLabel` (`'Yes'`), `rejectLabel` (`'No'`), `acceptSeverity`
(`'primary'`), `target` (an element or the event that came from it), `accept()`, `reject()`.

- **Dialog or popup:** a question without `target` goes to `hx-confirm-dialog`, one with a `target` to
  `hx-confirm-popup`. Without the component for it in the app nothing is shown.
- **Answers:** `accept` runs on the accept button; `reject` on the reject button, Escape, and (popup) a click outside or
  a new question. `confirmAsync` resolves to `true` or `false` the same way. In the dialog the mask does nothing: the
  user has to answer; questions that arrive while one is open wait their turn.
- **Accessibility:** `role="alertdialog"` with the message as `aria-describedby` (the dialog is also labelled by its
  header, or named "Confirmation"). The focus starts on the reject button, the safe answer, and returns to where it was.
  A modal dialog traps the focus.

## Tokens

The look comes from the design tokens `--h-confirmdialog-*`, `--h-confirmpopup-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
