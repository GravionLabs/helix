import { Component, computed, input } from '@angular/core';
import type { HelixStatusBarTone, HelixStatusBarVersion } from './status-bar.model';

const TONE_BG: Record<HelixStatusBarTone, string> = {
  staging: 'var(--p-amber-600, #d97706)',
  production: 'var(--p-surface-800, #1e293b)',
  success: 'var(--p-green-600, #16a34a)',
  danger: 'var(--p-red-600, #dc2626)',
  neutral: 'var(--p-surface-400, #94a3b8)',
};

const TONE_TEXT: Record<HelixStatusBarTone, string> = {
  staging: '#fff',
  production: '#fff',
  success: '#fff',
  danger: '#fff',
  neutral: '#fff',
};

@Component({
  selector: 'helix-status-bar',
  standalone: true,
  templateUrl: './status-bar.html',
  styleUrl: './status-bar.scss',
})
export class HelixStatusBar {
  brand = input('');
  environment = input<string | undefined>();
  note = input<string | undefined>();
  versions = input<HelixStatusBarVersion[]>([]);
  tone = input<HelixStatusBarTone>('neutral');
  height = input<string>('var(--helix-status-bar-height, 2rem)');

  protected bgColor = computed(() => TONE_BG[this.tone()]);
  protected textColor = computed(() => TONE_TEXT[this.tone()]);
}
