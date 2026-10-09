import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormField, form, min, required } from '@angular/forms/signals';
import {
  HxButton,
  HxFloatLabel,
  HxIconField,
  HxInput,
  HxInputGroup,
  HxInputGroupAddon,
  HxInputIcon,
  HxInputNumber,
  HxPassword,
  HxSelect,
} from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` input components: Float label, Icon field, Input group, Input number. */
@Component({
  selector: 'app-hx-inputs-demo',
  standalone: true,
  imports: [
    HxInputNumber,
    HxFloatLabel,
    HxPassword,
    HxSelect,
    HxInputGroup,
    HxInputGroupAddon,
    HxIconField,
    HxInputIcon,
    HxInput,
    HxButton,
    FormsModule,
    FormField,
  ],
  templateUrl: './hx-inputs-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hx-inputs-demo.scss',
})
export class HxInputsDemo {
  readonly cities = ['Berlin', 'Lisbon', 'Zurich'];
  readonly city = signal<string | null>(null);
  readonly secret = signal('');
  notes = 'Grows with the content.';
  quantity: number | null = 5;
  readonly price = signal<number | null>(1234.5);
  readonly horizontal = signal<number | null>(20);

  readonly model = signal<{ seats: number | null }>({ seats: 2 });
  readonly seatsForm = form(this.model, (path) => {
    required(path.seats, { message: 'Enter the number of seats' });
    min(path.seats, 1, { message: 'At least one seat' });
  });
  readonly submitted = signal(false);

  submit() {
    this.seatsForm.seats().markAsTouched();
    this.submitted.set(this.seatsForm().valid());
  }
}
