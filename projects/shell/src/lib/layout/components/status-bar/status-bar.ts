import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, TemplateRef } from '@angular/core';
import type { EnvironmentValue } from '../../../ui/badge/environment-badge';
import { HelixEnvironmentBadge } from '../../../ui/badge/environment-badge';
import type { HelixStatusBarTone, HelixStatusBarVersion } from './status-bar.model';

// Neutral lies flat on the frame ground. The other tones are a filled strip; each pairs white text
// with a step of at least 4.5:1 (AA): amber-700 4.87, green-700 5.18, red-700 6.14, surface-800 16.05.
const TONE_BG: Record<HelixStatusBarTone, string> = {
  staging: 'var(--h-amber-700, #996548)',
  production: 'var(--h-surface-800, #202127)',
  success: 'var(--h-green-700, #4a7754)',
  danger: 'var(--h-red-700, #984b43)',
  neutral: 'transparent',
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
  imports: [HelixEnvironmentBadge, NgTemplateOutlet],
  templateUrl: './status-bar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './status-bar.scss',
})
export class HelixStatusBar {
  brand = input('');
  environment = input<EnvironmentValue | string | undefined>();
  /** Note text, or a template for richer content such as links. */
  note = input<string | TemplateRef<unknown> | undefined>();
  versions = input<HelixStatusBarVersion[]>([]);
  tone = input<HelixStatusBarTone>('neutral');
  height = input<string>('var(--helix-status-bar-height, 28px)');

  protected envForBadge = computed(() => this.environment() || undefined);
  protected noteTemplate = computed(() => {
    const n = this.note();
    return n instanceof TemplateRef ? n : undefined;
  });
  protected noteText = computed(() => {
    const n = this.note();
    return typeof n === 'string' ? n : '';
  });
  protected bgColor = computed(() => TONE_BG[this.tone()]);
  protected tinted = computed(() => this.tone() !== 'neutral');
  protected textColor = computed(() => TONE_TEXT[this.tone()]);
}
