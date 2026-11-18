import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  HELIX_DESKTOP_VERSION,
  HxActivityBar,
  type HxActivityBarItem,
} from '@gravionlabs/helix-desktop';

/** The package page of `@gravionlabs/helix-desktop`: the components with a live demo. */
@Component({
  selector: 'app-desktop-demo',
  standalone: true,
  imports: [HxActivityBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>&#64;gravionlabs/helix-desktop</h2>
    <p>The desktop frame of Helix: activity bar, views, status bar and the platform switch. Version {{ version }}.</p>

    <h3>HxActivityBar</h3>
    <div style="display: flex; height: 280px; border: 1px solid var(--h-content-border-color)">
      <hx-activity-bar [items]="items" [activeId]="activeId()" [expanded]="expanded()" (selected)="select($event)" />
      <div style="padding: 1rem">
        <p>Selected: {{ activeId() }}. Last: {{ last() }}. Sidebar {{ expanded() ? 'open' : 'collapsed' }}.</p>
        <button type="button" (click)="expanded.set(!expanded())">Toggle sidebar</button>
      </div>
    </div>
  `,
})
export class DesktopDemo {
  protected readonly version = HELIX_DESKTOP_VERSION;
  protected readonly activeId = signal<string | null>('files');
  protected readonly expanded = signal(true);
  protected readonly last = signal('none');
  protected readonly items: HxActivityBarItem[] = [
    { id: 'files', label: 'Files', icon: 'pi pi-folder', position: 'top' },
    { id: 'search', label: 'Search', icon: 'pi pi-search', position: 'top', badge: 3 },
    {
      id: 'sync',
      label: 'Sync now',
      icon: 'pi pi-sync',
      position: 'top',
      kind: 'action',
      badge: true,
    },
    { id: 'settings', label: 'Settings', icon: 'pi pi-cog', position: 'bottom' },
  ];

  protected select(id: string): void {
    this.last.set(id);
    if (this.items.find((i) => i.id === id)?.kind !== 'action') this.activeId.set(id);
  }
}
