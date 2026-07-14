import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@gravionlabs/helix/button';
import { HelixFloatingConfigurator } from '../../layout/components/floating-configurator/floating-configurator';

export interface HelixNotfoundSuggestion {
  icon: string;
  title: string;
  description: string;
  route: string;
}

const DEFAULT_SUGGESTIONS: HelixNotfoundSuggestion[] = [
  {
    icon: 'pi pi-fw pi-table',
    title: 'Frequently Asked Questions',
    description: 'Ultricies mi quis hendrerit dolor.',
    route: '/',
  },
  {
    icon: 'pi pi-fw pi-question-circle',
    title: 'Solution Center',
    description: 'Phasellus faucibus scelerisque eleifend.',
    route: '/',
  },
  {
    icon: 'pi pi-fw pi-unlock',
    title: 'Permission Manager',
    description: 'Accumsan in nisl nisi scelerisque',
    route: '/',
  },
];

@Component({
  selector: 'helix-notfound',
  standalone: true,
  imports: [RouterModule, HelixFloatingConfigurator, ButtonModule],
  templateUrl: './notfound.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './notfound.scss',
})
export class HelixNotfound {
  errorCode = input('404');
  title = input('Not Found');
  message = input('Requested resource is not available.');
  buttonLabel = input('Go to Dashboard');
  buttonRoute = input('/');
  suggestions = input<HelixNotfoundSuggestion[]>(DEFAULT_SUGGESTIONS);
}
