import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import {
  getHxPlatform,
  getHxPlatformKind,
  HxStatusItem,
  HxStatusPopover,
  type HxStatusTone,
} from '@gravionlabs/helix-desktop';
import { HxUpdateService } from './update.service';

/**
 * The update state as a status item; the version, the notes and "Install and restart" are in its popover.
 * Not rendered on mobile and while there is nothing to show (idle, current).
 */
@Component({
  selector: 'hx-status-update',
  imports: [HxStatusItem, HxStatusPopover],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './status-update.html',
})
export class HxStatusUpdate {
  protected readonly service = inject(HxUpdateService);
  private readonly root = inject(DOCUMENT).documentElement;

  readonly checkingLabel = input('Checking for updates');
  readonly availableLabel = input('Update');
  readonly installingLabel = input('Installing update');
  readonly errorLabel = input('Update failed');
  readonly installLabel = input('Install and restart');
  readonly retryLabel = input('Try again');

  protected readonly open = signal(false);
  protected readonly state = this.service.state;

  protected readonly visible = computed(
    () =>
      getHxPlatformKind(getHxPlatform(this.root)) !== 'mobile' &&
      ['checking', 'available', 'installing', 'error'].includes(this.state().status),
  );

  protected readonly label = computed(() => {
    const s = this.state();
    switch (s.status) {
      case 'checking':
        return this.checkingLabel();
      case 'available':
        return `${this.availableLabel()} ${s.update.version}`;
      case 'installing':
        return this.installingLabel();
      case 'error':
        return this.errorLabel();
      default:
        return '';
    }
  });

  protected readonly tone = computed<HxStatusTone>(() => {
    const s = this.state().status;
    return s === 'error' ? 'error' : s === 'available' ? 'accent' : 'neutral';
  });

  protected readonly errorText = computed(() => {
    const s = this.state();
    return s.status === 'error' ? `${s.step}: ${s.message}` : '';
  });
}
