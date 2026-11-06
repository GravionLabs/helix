import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  HX_PRIMARY_COLORS,
  HX_SURFACE_NAMES,
  HX_SURFACES,
  type HxDensity,
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
 * The theme panel of the shell: preset, primary colour, surface, density and menu mode. The colours go to the theme service of
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
  /** The colour in use: the chosen one, else the one of the preset (none when the preset has a scale of its own). */
  activePrimaryColor = computed(() => this.store.activePrimary());
  selectedSurfaceColor = computed(() => this.store.activeSurface());
  /** The presets to choose from, bundled and the app's, as `Helix`, `Vitepress`, `Compact`. */
  presetOptions = computed(() =>
    this.store.presetNames().map((name) => ({
      label: name.charAt(0).toUpperCase() + name.slice(1),
      value: name,
    })),
  );
  preset = computed(() => this.store.preset());
  densityOptions = [
    { label: 'Comfortable', value: 'comfortable' },
    { label: 'Compact', value: 'compact' },
  ];
  density = computed(() => this.store.density());
  menuMode = computed(() => this.store.menuMode());

  updateColors(event: Event, type: 'primary' | 'surface', color: Swatch<string>) {
    if (type === 'primary') {
      this.store.setPrimary(color.name as HxPrimaryColor);
    } else {
      this.store.setSurface(color.name as HxSurface);
    }
    event.stopPropagation();
  }

  onPresetChange(preset: string) {
    this.store.setPreset(preset);
  }

  onDensityChange(density: string) {
    this.store.setDensity(density as HxDensity);
  }

  onMenuModeChange(event: string) {
    this.store.setMenuMode(event as 'static' | 'overlay');
  }
}
