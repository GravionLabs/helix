import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ButtonModule } from '@helix/core/button';
import { StyleClassModule } from '@helix/core/styleclass';
import { LayoutStore } from '../../store';
import { HelixConfigurator } from '../configurator/configurator';

@Component({
  selector: 'helix-floating-configurator',
  standalone: true,
  imports: [CommonModule, ButtonModule, StyleClassModule, HelixConfigurator],
  templateUrl: './floating-configurator.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
