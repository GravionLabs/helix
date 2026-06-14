import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutStore } from '../../store/layout.store';
import { HelixConfigurator } from '../configurator/configurator';
import type { HelixTopbarAction } from './topbar.model';

export type { HelixTopbarAction } from './topbar.model';

const DEFAULT_ACTIONS: HelixTopbarAction[] = [
  { icon: 'pi pi-calendar', label: 'Calendar' },
  { icon: 'pi pi-inbox', label: 'Messages' },
  { icon: 'pi pi-user', label: 'Profile' },
];

@Component({
  selector: 'helix-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, HelixConfigurator],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class HelixTopbar {
  appTitle = input('SAKAI');
  topbarActions = input<HelixTopbarAction[]>(DEFAULT_ACTIONS);

  store = inject(LayoutStore);
}
