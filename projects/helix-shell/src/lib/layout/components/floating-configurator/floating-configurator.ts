import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { ButtonModule } from '@gravionlabs/helix/button';
import { StyleClassModule } from '@gravionlabs/helix/styleclass';
import { LayoutStore } from '../../store';
import { HelixConfigurator } from '../configurator/configurator';

@Component({
  selector: 'helix-floating-configurator',
  standalone: true,
  imports: [CommonModule, ButtonModule, StyleClassModule, HelixConfigurator],
  templateUrl: './floating-configurator.html',
  styleUrl: './floating-configurator.scss',
})
export class HelixFloatingConfigurator {
  store = inject(LayoutStore);

  float = input<boolean>(true);

  isDarkTheme = computed(() => this.store.darkTheme());

  toggleDarkMode() {
    this.store.toggleDarkMode();
  }
}
