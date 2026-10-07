import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonModule } from '@gravionlabs/helix-core/button';
import {
  HxButton,
  type HxButtonSeverity,
  type HxButtonSize,
  type HxButtonVariant,
} from '@gravionlabs/helix-ui';

/** `@gravionlabs/helix-ui` Button next to the helix-core one: same tokens, same look. */
@Component({
  selector: 'app-hx-button-demo',
  standalone: true,
  imports: [HxButton, ButtonModule],
  templateUrl: './hx-button-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './hx-button-demo.scss',
})
export class HxButtonDemo {
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

  /** The core Button spells severity `undefined` for primary and `small`/`large` for sizes. */
  coreSeverity(severity: HxButtonSeverity) {
    return severity === 'primary' ? undefined : severity;
  }

  coreSize(size: HxButtonSize) {
    return size === 'medium' ? undefined : size;
  }
}
