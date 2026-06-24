import { Component } from '@angular/core';
import type { HelixStatusBarVersion } from '@gravionlabs/helix';
import { HelixAppLayout } from '@gravionlabs/helix';
import { DEMO_MENU_MODEL } from './menu.model';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [HelixAppLayout],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  protected menu = DEMO_MENU_MODEL;

  protected versions: HelixStatusBarVersion[] = [{ label: 'Helix', value: '0.0.0' }];
}
