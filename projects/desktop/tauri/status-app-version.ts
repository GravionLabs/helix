import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HxStatusVersion } from '@gravionlabs/helix-desktop';
import { HX_APP_INFO } from './app-info';

/** The app version with the `RC` badge on a release candidate; reads `provideHxAppInfo()`. */
@Component({
  selector: 'hx-status-app-version',
  imports: [HxStatusVersion],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<hx-status-version [version]="info.version" [channel]="info.channel === 'rc' ? 'RC' : null" />`,
})
export class HxStatusAppVersion {
  protected readonly info = inject(HX_APP_INFO);
}
