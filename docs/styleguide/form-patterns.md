# Form patterns

Example of the [UX style guide](STYLEGUIDE.md): read it when you build a dialog with a form. A "Clone vault" dialog
that follows the rules of [forms.md](forms.md) and [dialogs.md](dialogs.md); the demo page
`uikit/form-patterns` of `helix-demo` runs it.

## What each part shows

| Part of the example                                                        | Rule                                                                |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `header` and `size="md"`, no CSS width                                     | [Header and size](dialogs.md#header-and-size)                       |
| `hx-field` with `label`, `hint` and `error` around the URL                 | [Field anatomy](forms.md#field-anatomy)                             |
| "HTTPS or SSH" as `hint`, no example value as placeholder                  | [Placeholders](forms.md#placeholders)                               |
| `hx-input-group` with a read-only input and a "Browse…" button             | [Path pickers](forms.md#path-pickers)                               |
| `<label for>` and `hx-message` of the folder, `aria-required` on its input | [Controls outside `hx-field`](forms.md#controls-outside-hx-field)   |
| `.form` and `.path-picker` gaps from `--h-space-*`                         | [Vertical rhythm](forms.md#vertical-rhythm)                         |
| Validators of `@gravionlabs/helix-ui/validators` with their messages       | [Validators](forms.md#validators)                                   |
| "Clone" is never disabled for an invalid form; `markAllAsTouched()`        | [Validation](forms.md#validation)                                   |
| `[loading]` on "Clone", the other buttons disabled while it runs           | [Feedback by duration](ux-rules.md#feedback-by-duration)            |
| Two `hxDialogFooter` buttons: Cancel (text, secondary), then "Clone"       | [Footer](dialogs.md#footer)                                         |
| The URL is the first tabbable element of the content, no `focus()` call    | [Default focus](dialogs.md#default-focus)                           |
| `<form id>` and `type="submit"` with `form`: Enter submits                 | [Enter](dialogs.md#enter)                                           |
| Escape closes; with changes it is off and Cancel asks                      | [Escape and unsaved changes](dialogs.md#escape-and-unsaved-changes) |
| "Discard" and "Keep editing", `acceptSeverity: 'danger'`                   | [Confirmations](dialogs.md#confirmations)                           |
| The result is a toast                                                      | [Which element for what](ux-rules.md#which-element-for-what)        |

## Template

The button that opens the dialog is `<button hx-button type="button" (click)="show()">Clone vault…</button>`.

```html
<hx-dialog
  header="Clone vault"
  size="md"
  [visible]="open()"
  (visibleChange)="open.set($event)"
  [closable]="!form.dirty"
  [closeOnEscape]="!form.dirty"
>
  <form id="clone-vault-form" class="form" [formGroup]="form" (ngSubmit)="clone()">
    <hx-field
      label="Repository URL"
      hint="HTTPS or SSH"
      [error]="form.controls.url.errors?.['Required']"
      required
    >
      <input hx-input formControlName="url" autocomplete="off" spellcheck="false" />
    </hx-field>

    <div class="path-picker">
      <label for="clone-vault-folder">Target folder</label>
      <hx-input-group>
        <input
          hx-input
          id="clone-vault-folder"
          formControlName="folder"
          readonly
          aria-required="true"
          [attr.aria-invalid]="folderError() ? 'true' : null"
          [attr.aria-describedby]="folderError() ? 'clone-vault-folder-error' : null"
        />
        <button
          hx-button
          type="button"
          severity="secondary"
          [disabled]="saving()"
          (click)="browse()"
        >
          Browse…
        </button>
      </hx-input-group>
      @if (folderError(); as error) {
        <hx-message id="clone-vault-folder-error" severity="error" variant="simple" size="small">
          {{ error }}
        </hx-message>
      }
    </div>
  </form>

  <button
    hxDialogFooter
    hx-button
    type="button"
    variant="text"
    severity="secondary"
    [disabled]="saving()"
    (click)="cancel()"
  >
    Cancel
  </button>
  <button hxDialogFooter hx-button type="submit" form="clone-vault-form" [loading]="saving()">
    Clone
  </button>
</hx-dialog>

<hx-confirm-dialog />
<hx-toast />
```

## Component

The imports are `ReactiveFormsModule`, `HxButton`, `HxConfirmDialog`, `HxDialog`, `HxField`, `HxInput`,
`HxInputGroup`, `HxMessage` and `HxToast`; `Validators` comes from `@gravionlabs/helix-ui/validators`. The `timeout`
stands for the request, and `browse()` for the file dialog of the platform.

```ts
/** How long the pretended clone takes. */
const CLONE_DURATION_MS = 1500;

/** What the file dialog of the platform would answer: a browser app cannot ask for a folder path. */
const PICKED_FOLDER = '/home/ada/Vaults';

export class FormPatternsDemo {
  readonly #confirmation = inject(HxConfirmationService);
  readonly #messages = inject(HxMessageService);

  readonly open = signal(false);
  readonly saving = signal(false);
  readonly form = inject(FormBuilder).nonNullable.group({
    url: ['', Validators.required('Enter a repository URL')],
    folder: ['', Validators.required('Choose a target folder')],
  });

  #timer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.#timer));
  }

  /** The path picker is outside `hx-field`, so it shows its error itself: once invalid and touched. */
  folderError(): string | null {
    const folder = this.form.controls.folder;
    return folder.touched ? (folder.errors?.['Required'] ?? null) : null;
  }

  show(): void {
    this.form.reset();
    this.open.set(true);
  }

  /** A desktop app opens the file dialog of the platform here. */
  browse(): void {
    const folder = this.form.controls.folder;
    folder.setValue(PICKED_FOLDER);
    // A value set in code is a change of the user here: closing would lose it.
    folder.markAsDirty();
  }

  clone(): void {
    if (this.saving()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { folder } = this.form.getRawValue();
    this.saving.set(true);
    this.#timer = setTimeout(() => {
      this.saving.set(false);
      this.form.reset();
      this.open.set(false);
      this.#messages.add({ severity: 'success', summary: 'Vault cloned', detail: folder });
    }, CLONE_DURATION_MS);
  }

  async cancel(): Promise<void> {
    const discard =
      !this.form.dirty ||
      (await this.#confirmation.confirmAsync({
        header: 'Discard changes',
        message: 'The vault is not cloned yet.',
        acceptLabel: 'Discard',
        rejectLabel: 'Keep editing',
        acceptSeverity: 'danger',
      }));
    if (!discard) return;
    this.form.reset();
    this.open.set(false);
  }
}
```

## Styles

```css
.form {
  display: flex;
  flex-direction: column;
  gap: var(--h-space-4);
}

.path-picker {
  display: flex;
  flex-direction: column;
  gap: var(--h-space-1);
}
```
