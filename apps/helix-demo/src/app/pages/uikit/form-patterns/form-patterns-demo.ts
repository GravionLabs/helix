import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  HxButton,
  HxConfirmationService,
  HxConfirmDialog,
  HxDialog,
  HxField,
  HxInput,
  HxInputGroup,
  HxMessage,
  HxMessageService,
  HxToast,
} from '@gravionlabs/helix-ui';
import { Validators } from '@gravionlabs/helix-ui/validators';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

/** How long the pretended clone takes. */
export const CLONE_DURATION_MS = 1500;

/** What the file dialog of the platform would answer: a browser app cannot ask for a folder path. */
export const PICKED_FOLDER = '/home/ada/Vaults';

/**
 * The reference form dialog of the UX style guide (`docs/styleguide/form-patterns.md`): each part of it
 * shows a rule of the forms and dialogs deep dives.
 */
@Component({
  selector: 'app-form-patterns-demo',
  imports: [
    SourceTabsComponent,
    ReactiveFormsModule,
    HxButton,
    HxConfirmDialog,
    HxDialog,
    HxField,
    HxInput,
    HxInputGroup,
    HxMessage,
    HxToast,
  ],
  templateUrl: './form-patterns-demo.html',
  styleUrl: './form-patterns-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
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
