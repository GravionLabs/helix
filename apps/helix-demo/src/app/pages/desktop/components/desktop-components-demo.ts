import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  HELIX_DESKTOP_VERSION,
  HxActivityBar,
  type HxActivityBarItem,
  HxAppShell,
  HxAppToolbar,
  type HxBottomBarItem,
  HxMobileShell,
  HxStatusBar,
  HxStatusItem,
  HxStatusPopover,
  HxStatusVersion,
  HxStatusZoom,
} from '@gravionlabs/helix-desktop';

/** The components of `@gravionlabs/helix-desktop` one by one, each with a live demo. */
@Component({
  selector: 'app-desktop-components-demo',
  standalone: true,
  imports: [
    HxActivityBar,
    HxAppShell,
    HxAppToolbar,
    HxMobileShell,
    HxStatusBar,
    HxStatusItem,
    HxStatusPopover,
    HxStatusZoom,
    HxStatusVersion,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './desktop-components-demo.html',
})
export class DesktopComponentsDemo {
  protected readonly version = HELIX_DESKTOP_VERSION;
  protected readonly activeId = signal<string | null>('files');
  protected readonly expanded = signal(true);
  protected readonly last = signal('none');
  protected readonly zoom = signal(100);
  protected readonly sidebarWidth = signal(220);
  protected readonly collapsed = signal(false);
  protected readonly viewId = signal<string | null>('files');
  protected readonly synced = signal(true);
  protected readonly updateOpen = signal(false);
  protected readonly mobileView = signal<string | null>('files');
  protected readonly drawerOpen = signal(false);
  protected readonly mobileItems: HxBottomBarItem[] = [
    { id: 'files', label: 'Files', icon: 'pi pi-folder', position: 'top' },
    { id: 'search', label: 'Search', icon: 'pi pi-search', position: 'top', badge: 3 },
    { id: 'settings', label: 'Settings', icon: 'pi pi-cog', position: 'bottom' },
  ];
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
