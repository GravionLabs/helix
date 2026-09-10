import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@helix-ui/core/button';
import { CheckboxModule } from '@helix-ui/core/checkbox';
import { InputTextModule } from '@helix-ui/core/inputtext';
import { PasswordModule } from '@helix-ui/core/password';
import { RippleModule } from '@helix-ui/core/ripple';
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
