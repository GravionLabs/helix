import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Environment } from '../../../ui/badge/environment-badge';
import { HelixEnvironmentBadge } from '../../../ui/badge/environment-badge';
import type { HelixStatusBarTone, HelixStatusBarVersion } from './status-bar.model';

const TONE_BG: Record<HelixStatusBarTone, string> = {
  staging: 'var(--p-amber-600, #d97706)',
  production: 'var(--p-surface-800, #1e293b)',
  success: 'var(--p-green-600, #16a34a)',
  danger: 'var(--p-red-600, #dc2626)',
  neutral: 'var(--helix-surface-chrome, var(--surface-card))',
};

const TONE_TEXT: Record<HelixStatusBarTone, string> = {
  staging: '#fff',
  production: '#fff',
  success: '#fff',
  danger: '#fff',
  neutral: 'var(--text-color)',
};

@Component({
  selector: 'helix-status-bar',
  standalone: true,
  imports: [HelixEnvironmentBadge],
  templateUrl: './status-bar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './status-bar.scss',
})
export class HelixStatusBar {
  brand = input('');
  environment = input<string | undefined>();
  note = input<string | undefined>();
  versions = input<HelixStatusBarVersion[]>([]);
  tone = input<HelixStatusBarTone>('neutral');
  height = input<string>('var(--helix-status-bar-height, 3rem)');

  protected envForBadge = computed(() => this.environment() as Environment | undefined);
  protected bgColor = computed(() => TONE_BG[this.tone()]);
  protected textColor = computed(() => TONE_TEXT[this.tone()]);
}
