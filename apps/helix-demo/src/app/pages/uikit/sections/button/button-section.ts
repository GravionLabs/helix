import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  HxButton,
  HxButtonGroup,
  type HxButtonSeverity,
  type HxButtonSize,
  type HxButtonVariant,
} from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` Button: variants, severities, sizes, shapes, icons, loading and anchors. */
@Component({
  selector: 'app-button-section',
  standalone: true,
  imports: [HxButton, HxButtonGroup],
  templateUrl: './button-section.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './button-section.scss',
})
export class HxButtonSection {
  readonly severities: HxButtonSeverity[] = [
    'primary',
    'secondary',
    'success',
    'info',
    'warn',
    'help',
    'danger',
    'contrast',
  ];
  readonly variants: HxButtonVariant[] = ['filled', 'outlined', 'text', 'link'];
  readonly sizes: HxButtonSize[] = ['small', 'medium', 'large'];

  readonly saving = signal(false);
  readonly clicks = signal(0);

  save() {
    this.clicks.update((n) => n + 1);
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 1500);
  }
}
