import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormField, form, required } from '@angular/forms/signals';
import { HxButton, HxSelect } from '@gravionlabs/helix-ui';

interface City {
  name: string;
  code: string;
  disabled?: boolean;
}

/** `@gravionlabs/helix-ui` Select, built on the Angular CDK listbox and overlay. */
@Component({
  selector: 'app-select-section',
  standalone: true,
  imports: [HxSelect, HxButton, FormsModule, FormField],
  templateUrl: './select-section.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './select-section.scss',
})
export class HxSelectSection {
  readonly cities: City[] = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN', disabled: true },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ];
  readonly instruments = Array.from({ length: 200 }, (_, i) => ({
    code: `SYM${String(i + 1).padStart(3, '0')}`,
    name: `Instrument ${i + 1}`,
  }));
  instrument: string | null = null;
  readonly sizes = ['Small', 'Medium', 'Large'];

  city: string | null = 'RM';
  readonly picked = signal<string | null>(null);

  readonly model = signal({ plan: '' });
  readonly planForm = form(this.model, (path) => {
    required(path.plan, { message: 'Choose a plan' });
  });
  readonly submitted = signal(false);

  submit() {
    this.planForm.plan().markAsTouched();
    this.submitted.set(this.planForm().valid());
  }
}
