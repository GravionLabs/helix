import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HELIX_DESKTOP_VERSION } from '@gravionlabs/helix-desktop';

/** The package page of `@gravionlabs/helix-desktop`: an empty shell until the components land. */
@Component({
  selector: 'app-desktop-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>&#64;gravionlabs/helix-desktop</h2>
    <p>
      The desktop frame of Helix: activity bar, views, status bar and the platform switch. Version
      {{ version }}. The package is a scaffold; the components follow.
    </p>
  `,
})
export class DesktopDemo {
  protected readonly version = HELIX_DESKTOP_VERSION;
}
