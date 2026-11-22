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
 * Not rendered on mobile and while there is nothing to show (idle, current), unless `alwaysVisible` is set:
 * then it shows "Check for updates" and a click runs a manual check, whose result "Up to date" stays visible
 * for a moment. While installing it shows the download percent.
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
  readonly checkLabel = input('Check for updates');
  readonly upToDateLabel = input('Up to date');
  /** Show the item in `idle` and `current` too, as "Check for updates"; a click runs a manual check. */
  readonly alwaysVisible = input(false);

  protected readonly open = signal(false);
  protected readonly state = this.service.state;

  protected readonly visible = computed(() => {
    if (getHxPlatformKind(getHxPlatform(this.root)) === 'mobile') return false;
    const status = this.state().status;
    if (['checking', 'available', 'installing', 'error'].includes(status)) return true;
    return this.alwaysVisible() || (status === 'current' && this.service.currentShown());
  });

  /** An item that only starts a check (idle, current): no popover. */
  protected readonly checkOnly = computed(() => ['idle', 'current'].includes(this.state().status));

  protected checkNow(): void {
    void this.service.check({ manual: true });
  }

  /** A failed install step retries the install, any other error the check. */
  protected retry(): void {
    const s = this.state();
    void (s.status === 'error' && s.step === 'install'
      ? this.service.installAndRestart()
      : this.service.check());
  }

  protected readonly label = computed(() => {
    const s = this.state();
    switch (s.status) {
      case 'checking':
        return this.checkingLabel();
      case 'available':
        return `${this.availableLabel()} ${s.update.version}`;
      case 'installing':
        return s.percent === null
          ? this.installingLabel()
          : `${this.installingLabel()} ${s.percent}%`;
      case 'current':
        return this.service.currentShown() ? this.upToDateLabel() : this.checkLabel();
      case 'idle':
        return this.checkLabel();
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
