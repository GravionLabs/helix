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

`HxConfirmation`: `message`, `content` (a `TemplateRef`), `header`, `icon`, `acceptLabel` (`'Yes'`), `rejectLabel`
(`'No'`), `acceptSeverity` (`'primary'`), `target` (an element or the event that came from it), `accept()`, `reject()`.

- **Dialog or popup:** a question without `target` goes to `hx-confirm-dialog`, one with a `target` to
  `hx-confirm-popup`. Without the component for it in the app nothing is shown.
- **Answers:** `accept` runs on the accept button; `reject` on the reject button, Escape, and (popup) a click outside or
  a new question. `confirmAsync` resolves to `true` or `false` the same way. In the dialog the mask does nothing: the
  user has to answer; questions that arrive while one is open wait their turn.
- **Accessibility:** `role="alertdialog"` with the message as `aria-describedby` (the dialog is also labelled by its
  header, or named "Confirmation"). The focus starts on the reject button, the safe answer, and returns to where it was.
  A modal dialog traps the focus; the popup does so only with [`content`](#remove-with-an-option).

## Remove with an option

A destructive question with an option ("force", "also remove the volumes") passes a template as `content`. The dialog
and the popup show it between the message and the buttons.

```html
<button hx-button type="button" severity="danger" (click)="remove(option)">Remove</button>

<ng-template #option>
  <label><input type="checkbox" hx-checkbox [checked]="force()" (change)="force.set(!force())" /> Force removal</label>
</ng-template>
```

```ts
// imports: HxButton, HxCheckbox
readonly #confirmation = inject(HxConfirmationService);
readonly force = signal(false);

async remove(content: TemplateRef<unknown>): Promise<void> {
  this.force.set(false); // each question starts without the option
  const confirmed = await this.#confirmation.confirmAsync({
    header: 'Remove container',
    message: 'Remove the container "web"?',
    content,
    acceptLabel: 'Remove',
    rejectLabel: 'Cancel',
    acceptSeverity: 'danger',
  });
  if (confirmed) this.containers.remove('web', { force: this.force() });
}
```

- The caller owns the state of what it projects and reads it in `accept` or after `confirmAsync` resolved. The template
  gets no context, and the service does not reset the state.
- The `message` stays the accessible description, so it asks the whole question; every control in the template has its
  own label.
- The focus still starts on the reject button; Tab and Shift+Tab reach the controls, in the popup too, which keeps the
  focus inside while it has `content`. Enter in the content does not accept; do not put a `<form>` that accepts in it.

## Tokens

The look comes from the design tokens `--h-confirmdialog-*`, `--h-confirmpopup-*` (see [Theming](../HELIX-UI.md#theming)); override them in your theme, never the component CSS.

Part of [`@gravionlabs/helix-ui`](../HELIX-UI.md); all components are listed in the [component reference](README.md).
