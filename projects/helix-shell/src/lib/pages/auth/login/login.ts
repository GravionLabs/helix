import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@gravionlabs/helix/button';
import { CheckboxModule } from '@gravionlabs/helix/checkbox';
import { InputTextModule } from '@gravionlabs/helix/inputtext';
import { PasswordModule } from '@gravionlabs/helix/password';
import { RippleModule } from '@gravionlabs/helix/ripple';
import { HelixFloatingConfigurator } from '../../../layout/components/floating-configurator/floating-configurator';

export interface HelixLoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'helix-login',
  standalone: true,
  imports: [
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    RouterModule,
    RippleModule,
    HelixFloatingConfigurator,
  ],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login.scss',
})
export class HelixLogin {
  title = input('Welcome!');
  subtitle = input('Sign in to continue');
  submitLabel = input('Sign In');
  forgotPasswordLabel = input('Forgot password?');

  login = output<HelixLoginCredentials>();
  forgotPassword = output<void>();

  email = '';
  password = '';
  checked = false;

  onSubmit(): void {
    this.login.emit({ email: this.email, password: this.password, rememberMe: this.checked });
  }

  onForgotPassword(): void {
    this.forgotPassword.emit();
  }
}
