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
  selector: 'app-hx-select-demo',
  standalone: true,
  imports: [HxSelect, HxButton, FormsModule, FormField],
  templateUrl: './hx-select-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hx-select-demo.scss',
})
export class HxSelectDemo {
  readonly cities: City[] = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN', disabled: true },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ];
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
