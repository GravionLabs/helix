import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutStore } from '../../store/layout.store';
import { GvConfigurator } from '../configurator/configurator';
import { GvTopbarAction } from './topbar.model';

export type { GvTopbarAction } from './topbar.model';

const DEFAULT_ACTIONS: GvTopbarAction[] = [
  { icon: 'pi pi-calendar', label: 'Calendar' },
  { icon: 'pi pi-inbox', label: 'Messages' },
  { icon: 'pi pi-user', label: 'Profile' },
];

@Component({
  selector: 'gv-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, GvConfigurator],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class GvTopbar {
  appTitle = input('SAKAI');
  topbarActions = input<GvTopbarAction[]>(DEFAULT_ACTIONS);

  store = inject(LayoutStore);
}
