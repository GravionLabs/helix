import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { StyleClassModule } from '@gravionlabs/helix-core/styleclass';
import { HxButton } from '@gravionlabs/helix-ui';
import { LayoutStore } from '../../store';
import { HelixConfigurator } from '../configurator/configurator';

@Component({
  selector: 'helix-floating-configurator',
  standalone: true,
  imports: [CommonModule, HxButton, StyleClassModule, HelixConfigurator],
  templateUrl: './floating-configurator.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './floating-configurator.scss',
})
export class HelixFloatingConfigurator {
  store = inject(LayoutStore);

  float = input<boolean>(true);
  darkModeLabel = input('Toggle dark mode');
  configuratorLabel = input('Configure theme');

  isDarkTheme = computed(() => this.store.darkTheme());

  toggleDarkMode() {
    this.store.toggleDarkMode();
  }
}
