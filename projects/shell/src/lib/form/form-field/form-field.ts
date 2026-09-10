import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { AbstractControl } from '@angular/forms';

@Component({
  selector: 'helix-form-field',
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelixFormField {
  readonly label = input<string>();

  readonly control = input<AbstractControl | null>(null);

  readonly hint = input<string>();

  readonly error = input<string | null>(null);

  readonly showLabel = input(true);

  readonly showHint = input(true);

  readonly activeError = computed<string | null>(() => {
    const ext = this.error();
    if (ext) return ext;
    const ctrl = this.control();
    if (ctrl?.touched && ctrl.invalid && ctrl.errors) {
      const first = Object.values(ctrl.errors)[0];
      return typeof first === 'string' ? first : null;
    }
    return null;
  });
}
