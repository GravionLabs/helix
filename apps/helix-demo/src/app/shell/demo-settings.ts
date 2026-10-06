import { Injectable, signal } from '@angular/core';
import type { HelixNavStyle } from '@gravionlabs/helix-shell';

/** Demo-only settings shared between the shell and the pages that expose them. */
@Injectable({ providedIn: 'root' })
export class DemoSettings {
  /** How the demo menu renders in the nav rail — see HelixAppLayout `navStyle`. */
  readonly navStyle = signal<HelixNavStyle>('sections');
}
