import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { GvFloatingConfigurator } from '../../layout/components/floating-configurator/floating-configurator';

export interface GvNotfoundSuggestion {
  icon: string;
  title: string;
  description: string;
  route: string;
}

const DEFAULT_SUGGESTIONS: GvNotfoundSuggestion[] = [
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
  selector: 'gv-notfound',
  standalone: true,
  imports: [RouterModule, GvFloatingConfigurator, ButtonModule],
  templateUrl: './notfound.html',
  styleUrl: './notfound.scss',
})
export class GvNotfound {
  errorCode = input('404');
  title = input('Not Found');
  message = input('Requested resource is not available.');
  buttonLabel = input('Go to Dashboard');
  buttonRoute = input('/');
  suggestions = input<GvNotfoundSuggestion[]>(DEFAULT_SUGGESTIONS);
}
