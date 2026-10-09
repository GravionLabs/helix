import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { email, FormField, form, minLength, required, submit } from '@angular/forms/signals';
import { HxButton, HxCheckbox, HxInput, HxRadio, HxSwitch } from '@gravionlabs/helix-ui';

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
  imports: [FormsModule, FormField, HxInput, HxCheckbox, HxRadio, HxSwitch, HxButton],
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
