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

/** The package page of `@gravionlabs/helix-desktop`: the components with a live demo. */
@Component({
  selector: 'app-desktop-demo',
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

    <h3>HxAppShell and HxAppToolbar</h3>
    <div style="height: 320px; border: 1px solid var(--h-content-border-color)">
      <hx-app-shell #shell [(sidebarWidth)]="sidebarWidth" [(collapsed)]="collapsed" [(activeId)]="viewId">
        <hx-app-toolbar slot="toolbar">
          <button slot="start" type="button" (click)="shell.selectView(viewId() ?? 'files')">Sidebar</button>
          <span slot="centre">Helix project</span>
          <span slot="end">Share</span>
        </hx-app-toolbar>
        <hx-activity-bar slot="activity" [items]="items" [activeId]="shell.activeId()" [expanded]="!shell.collapsed()" (selected)="shell.selectView($event)" />
        <nav slot="sidebar" style="padding: 8px">View: {{ shell.activeId() }}</nav>
        <div style="padding: 1rem">
          Content (the app's tab layout goes here). Sidebar {{ collapsed() ? 'collapsed' : sidebarWidth() + ' px' }}.
          Drag the splitter or focus it and use the arrow keys.
        </div>
        <aside slot="panel" style="width: 120px; padding: 8px">Panel</aside>
        <hx-status-bar slot="status"><hx-status-item slot="start">Ready</hx-status-item></hx-status-bar>
      </hx-app-shell>
    </div>

    <h3>HxMobileShell and HxBottomBar</h3>
    <p>The phone shell at 375 px: top bar with the menu button, content, bottom bar (up to five items) and a drawer for the sidebar views.</p>
    <div style="width: 375px; height: 560px; transform: translateZ(0); border: 1px solid var(--h-content-border-color)">
      <hx-mobile-shell #phone [items]="mobileItems" [(activeId)]="mobileView" [(drawerOpen)]="drawerOpen" heading="Helix">
        <nav slot="drawer" style="display: flex; flex-direction: column; padding: 8px">
          <button type="button" (click)="phone.chooseView('files')">Files</button>
          <button type="button" (click)="phone.chooseView('search')">Search</button>
        </nav>
        <p style="padding: 1rem">View: {{ mobileView() }}.</p>
      </hx-mobile-shell>
    </div>

    <h3>HxStatusBar</h3>
    <div style="border: 1px solid var(--h-content-border-color)">
      <hx-status-bar>
        <hx-status-item slot="start" [announce]="true">{{ synced() ? 'Synced' : 'Syncing...' }}</hx-status-item>
        <hx-status-item slot="start" kind="button" tone="warn" title="Show problems" ariaLabel="2 warnings">2 warnings</hx-status-item>
        <hx-status-item slot="start" tone="error">1 error</hx-status-item>
        <hx-status-item slot="end" kind="button" tone="accent" title="Update available" ariaLabel="Update details" [(popoverOpen)]="updateOpen">
          Update 1.5.0
          <div hxStatusPopover>
            <strong>1.5.0 is ready.</strong>
            <p>Restart to install. Escape or a click outside closes this.</p>
          </div>
        </hx-status-item>
        <hx-status-zoom slot="end" [(value)]="zoom" />
        <hx-status-version slot="end" version="1.4.0" channel="RC" />
      </hx-status-bar>
    </div>
    <p>Zoom {{ zoom() }}%.
      <button type="button" (click)="synced.set(!synced())">Toggle sync state</button></p>
  `,
})
export class DesktopDemo {
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
