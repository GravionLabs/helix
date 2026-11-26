import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { email, FormField, form, minLength, required, submit } from '@angular/forms/signals';
import {
  HxButton,
  HxCheckbox,
  HxField,
  HxInput,
  HxRadio,
  HxSelect,
  HxSwitch,
} from '@gravionlabs/helix-ui';

interface Signup {
  name: string;
  email: string;
  plan: 'free' | 'pro';
  newsletter: boolean;
  darkMode: boolean;
}

/** `@gravionlabs/helix-ui` form controls, and a signal form built from them. */
@Component({
  selector: 'app-form-section',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormField,
    HxField,
    HxInput,
    HxSelect,
    HxCheckbox,
    HxRadio,
    HxSwitch,
    HxButton,
  ],
  templateUrl: './form-section.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './form-section.scss',
})
export class HxFormSection {
  // template-driven
  text = 'Ada Lovelace';
  note = '';
  agree = true;
  plan = 'pro';
  dark = true;

  nickname = '';

  // the reactive form
  readonly cities = ['Berlin', 'Oslo', 'Rome'];
  /* oxlint-disable typescript/unbound-method -- Angular's validators are static functions */
  readonly profile = new FormGroup({
    fullName: new FormControl('', Validators.required),
    city: new FormControl<string | null>(null, Validators.required),
  });
  /* oxlint-enable typescript/unbound-method */

  // the signal form
  readonly model = signal<Signup>({
    name: '',
    email: '',
    plan: 'free',
    newsletter: false,
    darkMode: false,
  });

  readonly signup = form(this.model, (path) => {
    required(path.name, { message: 'Name is required' });
    minLength(path.name, 3, { message: 'Name needs at least 3 characters' });
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Enter a valid email address' });
  });

  readonly sending = signal(false);
  readonly sent = signal<Signup | null>(null);

  async send(event: Event) {
    event.preventDefault();
    this.sent.set(null);
    await submit(this.signup, async () => {
      this.sending.set(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      this.sending.set(false);
      this.sent.set(this.model());
    });
  }
}
