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
  HxListbox,
  HxMultiSelect,
  HxPassword,
  HxRating,
  HxSelect,
  HxSlider,
  type HxSliderValue,
  HxToggleButton,
} from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` input components: Float label, Toggle button, Icon field, Input group, Input number. */
@Component({
  selector: 'app-hx-inputs-demo',
  standalone: true,
  imports: [
    HxInputNumber,
    HxFloatLabel,
    HxToggleButton,
    HxSlider,
    HxRating,
    HxListbox,
    HxMultiSelect,
    HxSlider,
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
  readonly city = signal<unknown>(null);
  readonly visited = signal<string[]>(['Lisbon']);
  readonly secret = signal('');
  readonly score = signal<number | null>(3);
  readonly volume = signal<HxSliderValue>(30);
  readonly priceRange = signal<HxSliderValue>([100, 300]);
  readonly gain = signal<HxSliderValue>(60);
  readonly subscribed = signal(false);
  readonly bold = signal(true);
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
