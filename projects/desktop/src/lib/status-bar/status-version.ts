import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The app version with an optional channel badge (`RC`). */
@Component({
  selector: 'hx-status-version',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-status-version' },
  templateUrl: './status-version.html',
})
export class HxStatusVersion {
  readonly version = input.required<string>();
  /** A channel badge such as `RC` or `beta`; none for a stable release. */
  readonly channel = input<string | null>(null);
}
