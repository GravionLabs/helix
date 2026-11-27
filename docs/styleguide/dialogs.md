# Dialogs

Deep dive of the [UX style guide](STYLEGUIDE.md): read it when you add or change a dialog or a confirmation. It says
how a dialog is built from Helix parts. The fields inside it follow [forms.md](forms.md).

## Dialog or popover

[Which element for what](ux-rules.md#which-element-for-what) decides. A dialog is an
[`hx-dialog`](../components/dialog.md), a question with two answers is a [confirmation](#confirmations).

## Header and size

- A dialog has a `header`. One without a visible title has an `ariaLabel`.
- The width is the `size` input (`sm`, `md`, `lg`), picked by [what the dialog holds](../components/dialog.md#sizes).
  `width` is only for content that fits no class, and the PR says why.
- No app CSS sets the width of a dialog. A class that is wrong for the whole app is changed by its
  `--h-dialog-<size>-width` token.

## Footer

The actions of a dialog are `hx-button`s in the footer.

- Each button has the `hxDialogFooter` attribute itself. No wrapper element holds them: `--h-dialog-footer-gap` spaces
  only the direct children of the footer.
- A footer has exactly one primary action: the one `hx-button` with the filled `variant` and the `primary` severity
  (both the defaults). Every other button takes the `variant` and `severity` of its job in the
  [button hierarchy](components.md#button-hierarchy), so none of them is `primary` and filled.
- Order in the template, which is the order on screen: secondary actions first, the primary action last.
- Cancel is `variant="text"` and `severity="secondary"`, never `danger`.
- A destructive action is `severity="danger"` and names what it does ("Delete"). Next to a primary action it is
  `variant="outlined"` and the first button of the footer, so Cancel stands between it and the primary action. A
  dialog whose main action is destructive is a [confirmation](#confirmations).
- Every button but a submit button is `type="button"`.
- The gap above the footer is the bottom of `--h-dialog-content-padding`. The app adds no margin, padding or spacer
  between content and footer.

```html
<hx-dialog [(visible)]="open" header="Edit profile" size="md">
  <form id="profile-form" [formGroup]="form" (ngSubmit)="save()">
    <hx-field label="Name" required>
      <input hx-input formControlName="name" />
    </hx-field>
  </form>

  <button hxDialogFooter hx-button type="button" variant="text" severity="secondary" (click)="cancel()">Cancel</button>
  <button hxDialogFooter hx-button type="submit" form="profile-form" [loading]="saving()">Save</button>
</hx-dialog>
```

## Default focus

`hx-dialog` focuses the element with `cdkFocusInitial`; without one, the first element in the dialog that can be
tabbed to, in DOM order: header, content, footer, close button. It focuses the dialog itself when there is none, and
gives the focus back when it closes.

- A dialog with a form starts on its first field: the field is the first tabbable element of the content, so the app
  does nothing. If a link or button comes before it, the field has `cdkFocusInitial`.
- A dialog without a field starts on its primary action: that button has `cdkFocusInitial`. Without it the focus
  lands on the first link or button, often Cancel.
- The app calls no `focus()` of its own when a dialog opens.

## Enter

- The fields of a dialog sit in a `<form>` with an `id`. The primary button is `type="submit"` and names that id in
  its `form` attribute, because the footer is outside the form. Enter in a field then submits.
- The app binds no Enter key handler. Submit and validation follow [forms.md](forms.md#validation).

## Escape and unsaved changes

- Escape and the close button close the dialog (`closeOnEscape` and `closable`, both on by default). The app switches
  them off only while closing would lose something.
- `dismissableMask` stays off for a dialog with a form.
- While the dialog has unsaved changes, `closeOnEscape` and `closable` are `false`, and Cancel asks through
  `HxConfirmationService` before it closes. Once nothing is unsaved, both are on again.

```html
<hx-dialog [(visible)]="open" header="Edit profile" [closable]="!form.dirty" [closeOnEscape]="!form.dirty">
```

```ts
async cancel(): Promise<void> {
  const discard =
    !this.form.dirty ||
    (await this.confirmation.confirmAsync({
      header: 'Discard changes',
      message: 'Your changes are not saved.',
      acceptLabel: 'Discard',
      rejectLabel: 'Keep editing',
      acceptSeverity: 'danger',
    }));
  if (!discard) return;
  this.form.reset();
  this.open.set(false);
}
```

## Confirmations

- A question before an action is asked with [`HxConfirmationService`](../components/confirm.md), never with an
  `hx-dialog` the app builds. [Confirm or undo](ux-rules.md#confirm-or-undo) says when to ask.
- The app has one `<hx-confirm-dialog />` (and one `<hx-confirm-popup />` if it passes a `target`).
- Every question sets `acceptLabel` to the verb of the action and `rejectLabel` to "Cancel" or to what rejecting
  does ("Keep editing"). The defaults "Yes" and "No" are not used.
- A destructive question sets `acceptSeverity: 'danger'`.
- A destructive question with an option ("force", "also remove the volumes") is a confirmation with the option as its
  [`content`](../components/confirm.md#remove-with-an-option) template, never a panel the app builds. The option is
  off when the question opens.

## Service dialogs

`HxDialogService` opens a component in a dialog. It has no `size`, its component cannot fill the footer, and its
`closeOnEscape` and `closable` are fixed when it opens. A dialog with actions, a form or a size class is therefore an
`hx-dialog` in a template.

## Not carried yet

ADR 0008, decision 3: what Helix does not carry is no rule here.

- `hx-dialog` does not ask before Escape or the close button discard changes; they are off instead:
  [#1253](https://github.com/GravionLabs/helix/issues/1253).
- The footer has no separate place at its start for a destructive action:
  [#1255](https://github.com/GravionLabs/helix/issues/1255).
- `HxDialogService` has no footer and no `size`: [#1254](https://github.com/GravionLabs/helix/issues/1254).
