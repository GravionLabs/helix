import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  HELIX_DESKTOP_VERSION,
  HxActivityBar,
  type HxActivityBarItem,
  HxAppShell,
  HxAppToolbar,
  HxStatusBar,
  HxStatusItem,
  HxStatusVersion,
} from '@gravionlabs/helix-desktop';
import { HxInput, HxTabBar, type HxTabBarItem } from '@gravionlabs/helix-ui';
import { SourceTabsComponent } from '../../../shared/source-tabs/source-tabs';

type PaneState = 'working' | 'blocked' | 'done' | 'idle';

interface Pane {
  readonly id: string;
  readonly label: string;
  readonly kind: 'agent' | 'terminal';
  readonly state: PaneState;
  /** The mock terminal output shown when the pane is open in a tab. */
  readonly lines: readonly string[];
}

interface Space {
  readonly id: string;
  readonly name: string;
  readonly state: Exclude<PaneState, 'idle'>;
  readonly branch: string;
  readonly path: string;
  readonly panes: readonly Pane[];
}

const SETTINGS_TAB = 'settings';

const SPACES: readonly Space[] = [
  {
    id: 'api-gateway',
    name: 'api-gateway',
    state: 'working',
    branch: 'feat/rate-limit',
    path: '~/projects/api-gateway',
    panes: [
      {
        id: 'api-gateway/claude',
        label: 'claude',
        kind: 'agent',
        state: 'working',
        lines: [
          '● Claude Code  demo session',
          '',
          '> Add a rate limit to the public routes',
          '',
          '● Reading src/middleware/rate-limit.ts',
          '● Writing tests for the token bucket',
        ],
      },
      {
        id: 'api-gateway/terminal',
        label: 'terminal',
        kind: 'terminal',
        state: 'idle',
        lines: [
          'demo % pnpm test',
          '',
          ' Test Files  42 passed (42)',
          '      Tests  318 passed (318)',
          '',
          'demo %',
        ],
      },
    ],
  },
  {
    id: 'web-app',
    name: 'web-app',
    state: 'blocked',
    branch: 'fix/login-redirect',
    path: '~/projects/web-app',
    panes: [
      {
        id: 'web-app/claude',
        label: 'claude',
        kind: 'agent',
        state: 'blocked',
        lines: [
          '● Claude Code  demo session',
          '',
          '> Fix the redirect after login',
          '',
          '● The redirect uses a stale return URL.',
          '',
          '  Do you want to edit src/auth/redirect.ts?',
          '  ❯ 1. Yes',
          '    2. Yes, allow all edits this session',
          '    3. No',
        ],
      },
    ],
  },
  {
    id: 'docs-site',
    name: 'docs-site',
    state: 'done',
    branch: 'main',
    path: '~/projects/docs-site',
    panes: [
      {
        id: 'docs-site/claude',
        label: 'claude',
        kind: 'agent',
        state: 'done',
        lines: [
          '● Claude Code  demo session',
          '',
          '> Update the install guide',
          '',
          '● Done. 3 files changed.',
        ],
      },
    ],
  },
];

const FILES = [
  'src/',
  'src/app/',
  'src/app/app.ts',
  'src/app/app.html',
  'package.json',
  'README.md',
];

/**
 * The poimen interface rebuilt on `@gravionlabs/helix-desktop` with sample data: toolbar, activity bar, the
 * spaces sidebar, editor tabs on `HxTabBar` with preview and pinned tabs, an output panel and the status bar.
 */
@Component({
  selector: 'app-desktop-overview-demo',
  standalone: true,
  imports: [
    HxActivityBar,
    HxAppShell,
    HxAppToolbar,
    HxStatusBar,
    HxStatusItem,
    HxStatusVersion,
    HxInput,
    HxTabBar,
    SourceTabsComponent,
  ],
  templateUrl: './desktop-overview-demo.html',
  styleUrl: './desktop-overview-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesktopOverviewDemo {
  protected readonly version = HELIX_DESKTOP_VERSION;
  protected readonly files = FILES;

  protected readonly view = signal<string | null>('spaces');
  protected readonly collapsed = signal(false);
  protected readonly sidebarWidth = signal(300);
  protected readonly outputOpen = signal(false);
  protected readonly filter = signal('');
  /** Spaces whose panes are hidden. */
  protected readonly folded = signal<ReadonlySet<string>>(new Set());

  protected readonly tabs = signal<readonly HxTabBarItem[]>([]);
  protected readonly activeTab = signal<string | null>(null);

  private readonly panes = new Map(
    SPACES.flatMap((s) => s.panes.map((p) => [p.id, { space: s, pane: p }] as const)),
  );

  protected readonly waiting = computed(
    () => SPACES.flatMap((s) => s.panes).filter((p) => p.state === 'blocked').length,
  );

  protected readonly activity = computed<HxActivityBarItem[]>(() => [
    { id: 'spaces', label: 'Spaces', icon: 'pi pi-objects-column', position: 'top' },
    { id: 'explorer', label: 'Explorer', icon: 'pi pi-folder', position: 'top' },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'pi pi-bell',
      position: 'top',
      badge: this.waiting() || null,
    },
    { id: 'settings', label: 'Settings', icon: 'pi pi-cog', position: 'bottom', kind: 'action' },
  ]);

  /** The spaces that match the filter by name, branch or pane label. */
  protected readonly spaces = computed(() => {
    const term = this.filter().trim().toLowerCase();
    if (!term) return SPACES;
    return SPACES.filter((s) =>
      [s.name, s.branch, ...s.panes.map((p) => p.label)].some((v) =>
        v.toLowerCase().includes(term),
      ),
    );
  });

  protected readonly blocked = computed(() =>
    SPACES.flatMap((s) =>
      s.panes.filter((p) => p.state === 'blocked').map((pane) => ({ space: s, pane })),
    ),
  );

  /** The pane of the active tab; null for the settings tab and when no tab is open. */
  protected readonly activePane = computed(() => this.panes.get(this.activeTab() ?? '') ?? null);

  protected select(id: string, shell: HxAppShell): void {
    if (id === SETTINGS_TAB) this.openSettings();
    else shell.selectView(id);
  }

  /** Shows the notifications; unlike the activity bar, a second click does not collapse the sidebar. */
  protected showWaiting(shell: HxAppShell): void {
    if (shell.activeId() !== 'notifications' || shell.collapsed())
      shell.selectView('notifications');
  }

  protected toggleSpace(id: string): void {
    this.folded.update((set) => {
      const next = new Set(set);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }

  /** A click previews a pane: it replaces the preview tab, or activates the pane's tab when it is open. */
  protected preview(paneId: string): void {
    this.open(paneId, true);
  }

  /** A double click pins a pane: its tab stays when another pane is previewed. */
  protected pin(paneId: string): void {
    this.open(paneId, false);
  }

  protected pinTab(id: string): void {
    this.tabs.update((tabs) => tabs.map((t) => (t.id === id ? { ...t, preview: false } : t)));
  }

  protected close(id: string): void {
    const tabs = this.tabs();
    const at = tabs.findIndex((t) => t.id === id);
    this.tabs.set(tabs.filter((t) => t.id !== id));
    if (this.activeTab() === id) this.activeTab.set(tabs[at + 1]?.id ?? tabs[at - 1]?.id ?? null);
  }

  protected isOpen(paneId: string): boolean {
    return this.activeTab() === paneId;
  }

  protected isFolded(spaceId: string): boolean {
    return this.folded().has(spaceId);
  }

  private open(paneId: string, preview: boolean): void {
    const entry = this.panes.get(paneId);
    if (!entry) return;
    const tab: HxTabBarItem = {
      id: paneId,
      label: entry.pane.label,
      group: entry.space.name,
      preview,
      attention: entry.pane.state === 'blocked',
    };
    this.tabs.update((tabs) => {
      const existing = tabs.find((t) => t.id === paneId);
      if (existing)
        return preview ? tabs : tabs.map((t) => (t.id === paneId ? { ...t, preview: false } : t));
      const previewAt = preview ? tabs.findIndex((t) => t.preview) : -1;
      if (previewAt < 0) return [...tabs, tab];
      return tabs.map((t, i) => (i === previewAt ? tab : t));
    });
    this.activeTab.set(paneId);
  }

  private openSettings(): void {
    if (!this.tabs().some((t) => t.id === SETTINGS_TAB))
      this.tabs.update((tabs) => [...tabs, { id: SETTINGS_TAB, label: 'Settings' }]);
    this.activeTab.set(SETTINGS_TAB);
  }
}
