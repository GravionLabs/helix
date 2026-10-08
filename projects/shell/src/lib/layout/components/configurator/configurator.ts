import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  HX_PRIMARY_COLORS,
  HX_SURFACE_NAMES,
  HX_SURFACES,
  type HxPrimaryColor,
  HxSelectButton,
  type HxSurface,
} from '@gravionlabs/helix-ui';
import { LayoutStore } from '../../store/layout.store';

/** One choice of the chooser: its name and the colour of its round swatch. */
interface Swatch<Name extends string> {
  name: Name;
  swatch: string;
}

/**
 * The theme panel of the shell: primary colour, surface and menu mode. The colours go to the theme service of
 * helix-ui (through the layout store), which changes CSS variables only; the panel itself knows no theme engine.
 */
@Component({
  selector: 'helix-configurator',
  standalone: true,
  imports: [CommonModule, FormsModule, HxSelectButton],
  templateUrl: './configurator.html',
  styleUrl: './configurator.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    class:
      'hidden absolute top-13 right-0 w-72 p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]',
  },
})
export class HelixConfigurator {
  router = inject(Router);
  store = inject(LayoutStore);

  showMenuModeButton = signal(!this.router.url.includes('auth'));
  menuModeOptions = [
    { label: 'Static', value: 'static' },
    { label: 'Overlay', value: 'overlay' },
  ];

  /** Black and white first, then the colours; a swatch shows the colour of step 500 of the scale. */
  primaryColors: Swatch<HxPrimaryColor>[] = [
    'noir' as const,
    ...HX_PRIMARY_COLORS.filter((name) => name !== 'noir'),
  ].map((name) => ({
    name,
    swatch: name === 'noir' ? 'var(--text-color)' : `var(--h-${name}-500)`,
  }));

  surfaces: Swatch<HxSurface>[] = HX_SURFACE_NAMES.map((name) => ({
    name,
    swatch: HX_SURFACES[name][500],
  }));

  selectedPrimaryColor = computed(() => this.store.primary());
  /** The colour in use: the chosen one, else the one of the Helix preset (indigo). */
  activePrimaryColor = computed(() => this.store.primary() ?? 'indigo');
  selectedSurfaceColor = computed(() => this.store.surface());
  menuMode = computed(() => this.store.menuMode());

  updateColors(event: Event, type: 'primary' | 'surface', color: Swatch<string>) {
    if (type === 'primary') {
      this.store.setPrimary(color.name as HxPrimaryColor);
    } else {
      this.store.setSurface(color.name as HxSurface);
    }
    event.stopPropagation();
  }

  onMenuModeChange(event: string) {
    this.store.setMenuMode(event as 'static' | 'overlay');
  }
}
