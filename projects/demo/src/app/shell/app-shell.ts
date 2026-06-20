import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HelixAppLayout, LayoutStore } from '@gravionlabs/helix';
import { DEMO_MENU_MODEL } from './menu.model';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [HelixAppLayout, RouterModule],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  protected layoutStore = inject(LayoutStore);
  protected menu = DEMO_MENU_MODEL;
}
