import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutStore } from '../../store/layout.store';
import { GvConfigurator } from '../configurator/configurator';

@Component({
  selector: 'gv-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, GvConfigurator],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class GvTopbar {
  @Input() appTitle = 'SAKAI';

  store = inject(LayoutStore);
}
