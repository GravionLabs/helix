import { Component } from '@angular/core';
import { HelixAppLayout } from '@gravionlabs/helix';
import { DEMO_MENU_MODEL } from './menu.model';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [HelixAppLayout],
  template: `
    <helix-app-layout
      appTitle="Helix Demo"
      environment="development"
      [alertCount]="3"
      [menu]="menu"
    />
  `,
})
export class AppShell {
  protected menu = DEMO_MENU_MODEL;
}
