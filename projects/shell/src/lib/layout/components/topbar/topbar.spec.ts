import { Component, signal, type TemplateRef, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { HxMenuItem } from '@gravionlabs/helix-ui';
import { LayoutStore } from '../../store/layout.store';
import type { AlertItem } from './actions/alert-action';
import { HelixTopbar } from './topbar';
import { defineTopbarActions, type HelixTopbarActionConfig } from './topbar.model';

type HelixTopbarPrivate = {
  effectiveBreadcrumbs: () => HxMenuItem[];
  showBreadcrumbs: () => boolean;
};

describe('HelixTopbar', () => {
  let component: HelixTopbar;
  let fixture: ComponentFixture<HelixTopbar>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HelixTopbar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HelixTopbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default appTitle "Helix"', () => {
    expect(component.appTitle()).toBe('Helix');
  });

  it('should reflect custom appTitle input', () => {
    fixture.componentRef.setInput('appTitle', 'MY APP');
    fixture.detectChanges();
    expect(component.appTitle()).toBe('MY APP');
  });

  it('should have store injected', () => {
    const store = TestBed.inject(LayoutStore);
    expect(component.store).toBe(store);
  });

  describe('breadcrumbs', () => {
    it('should have default effectiveBreadcrumbs empty', () => {
      const privateComp = component as unknown as HelixTopbarPrivate;
      expect(privateComp.effectiveBreadcrumbs()).toEqual([]);
    });

    it('should showBreadcrumbs be false when 0 or 1 items', () => {
      const privateComp = component as unknown as HelixTopbarPrivate;
      expect(privateComp.showBreadcrumbs()).toBe(false);
    });

    it('should reflect breadcrumbs input', () => {
      const crumbs = [{ label: 'Home' }, { label: 'Page' }];
      fixture.componentRef.setInput('breadcrumbs', crumbs);
      fixture.detectChanges();
      const privateComp = component as unknown as HelixTopbarPrivate;
      expect(privateComp.effectiveBreadcrumbs()).toEqual(crumbs);
    });

    it('should showBreadcrumbs be true with 2+ items', () => {
      fixture.componentRef.setInput('breadcrumbs', [{ label: 'Home' }, { label: 'Page' }]);
      fixture.detectChanges();
      const privateComp = component as unknown as HelixTopbarPrivate;
      expect(privateComp.showBreadcrumbs()).toBe(true);
    });
  });

  describe('page title', () => {
    const title = (): HTMLElement | null =>
      fixture.nativeElement.querySelector('.layout-topbar-title');

    it('shows the appTitle on a route without breadcrumbs or title', () => {
      fixture.componentRef.setInput('appTitle', 'MY APP');
      fixture.detectChanges();
      expect(title()?.textContent?.trim()).toBe('MY APP');
    });

    it('shows the pageTitle input in place of the breadcrumbs', () => {
      fixture.componentRef.setInput('pageTitle', 'Reports');
      fixture.detectChanges();
      expect(title()?.textContent?.trim()).toBe('Reports');
      expect(fixture.nativeElement.querySelector('hx-breadcrumb')).toBeNull();
    });

    it('shows the single breadcrumb label as the title', () => {
      fixture.componentRef.setInput('breadcrumbs', [{ label: 'Dashboard' }]);
      fixture.detectChanges();
      expect(title()?.textContent?.trim()).toBe('Dashboard');
    });

    it('shows the breadcrumbs and no title when there is a trail', () => {
      fixture.componentRef.setInput('breadcrumbs', [{ label: 'Home' }, { label: 'Page' }]);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('hx-breadcrumb')).toBeTruthy();
      expect(title()).toBeNull();
    });
  });

  describe('menu button', () => {
    const button = (): HTMLButtonElement =>
      fixture.nativeElement.querySelector('.layout-menu-button');

    it('is marked mobile-only (hidden above 991px) in static menu mode', () => {
      fixture.detectChanges();
      expect(button().classList.contains('layout-menu-button-mobile-only')).toBe(true);
    });

    it('stays visible on desktop in overlay menu mode', () => {
      TestBed.inject(LayoutStore).setMenuMode('overlay');
      fixture.detectChanges();
      expect(button().classList.contains('layout-menu-button-mobile-only')).toBe(false);
    });

    it('opens and closes the drawer on mobile', () => {
      const store = TestBed.inject(LayoutStore);
      const original = window.innerWidth;
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      fixture.detectChanges();

      button().click();
      expect(store.mobileMenuActive()).toBe(true);
      button().click();
      expect(store.mobileMenuActive()).toBe(false);
      expect(store.staticMenuDesktopInactive()).toBe(false);

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: original,
      });
    });
  });
});

@Component({
  imports: [HelixTopbar],
  template: `
    <ng-template #tplA><button type="button" class="custom-a">A</button></ng-template>
    <ng-template #tplB><button type="button" class="custom-b">B</button></ng-template>
    <helix-topbar [actions]="actions()" [alerts]="alerts()" />
  `,
})
class TopbarActionsHostComponent {
  tplA = viewChild.required<TemplateRef<unknown>>('tplA');
  tplB = viewChild.required<TemplateRef<unknown>>('tplB');
  actions = signal<HelixTopbarActionConfig[] | undefined>(undefined);
  alerts = signal<AlertItem[]>([]);
}

describe('HelixTopbar actions', () => {
  let fixture: ComponentFixture<TopbarActionsHostComponent>;
  let host: TopbarActionsHostComponent;
  let narrowQuery: { matches: boolean; listener?: (e: { matches: boolean }) => void };

  const root = (): HTMLElement => fixture.nativeElement;
  const zone = (name: string): HTMLElement | null => root().querySelector(`.layout-topbar-${name}`);
  const tags = (name: string): string[] =>
    Array.from(
      zone(name)?.querySelectorAll(
        'helix-search-action, helix-dark-mode-action, helix-configurator-action, helix-alert-action',
      ) ?? [],
    ).map((el) => el.tagName.toLowerCase());

  async function render(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    localStorage.clear();
    narrowQuery = { matches: false };
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        get matches() {
          return narrowQuery.matches;
        },
        addEventListener: (_: string, l: (e: { matches: boolean }) => void) => {
          narrowQuery.listener = l;
        },
        removeEventListener: () => undefined,
      })),
    );
    await TestBed.configureTestingModule({
      imports: [TopbarActionsHostComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(TopbarActionsHostComponent);
    host = fixture.componentInstance;
  });

  afterEach(() => vi.unstubAllGlobals());

  it('renders the default toolbar: search in the center, dark mode and configurator at the end', async () => {
    await render();
    expect(zone('center')?.querySelector('helix-search-action')).not.toBeNull();
    expect(tags('end')).toEqual(['helix-dark-mode-action', 'helix-configurator-action']);
    expect(zone('center')?.querySelector('input.hx-input')).not.toBeNull();
  });

  it('adds alerts to the default toolbar when alert items are given', async () => {
    host.alerts.set([{ id: '1', label: 'Down', severity: 'error' }]);
    await render();
    expect(tags('end')).toEqual([
      'helix-dark-mode-action',
      'helix-configurator-action',
      'helix-alert-action',
    ]);
  });

  it('renders no actions and no zones for []', async () => {
    host.actions.set([]);
    await render();
    expect(zone('center')).toBeNull();
    expect(zone('end')).toBeNull();
    expect(root().querySelector('helix-dark-mode-action, helix-search-action')).toBeNull();
  });

  it('defaults position to end and places entries by position', async () => {
    host.actions.set([
      { action: 'darkMode' },
      { action: 'search', position: 'center' },
      { action: 'configurator', position: 'start' },
    ]);
    await render();
    expect(zone('zone-start')?.querySelector('helix-configurator-action')).not.toBeNull();
    expect(zone('center')?.querySelector('helix-search-action')).not.toBeNull();
    expect(zone('end')?.querySelector('helix-dark-mode-action')).not.toBeNull();
  });

  it('sorts by order within a position and keeps list order for equal order', async () => {
    host.actions.set([
      { action: 'configurator', order: 2 },
      { action: 'alerts', order: 1 },
      { action: 'darkMode', order: 1 },
    ]);
    await render();
    expect(tags('end')).toEqual([
      'helix-alert-action',
      'helix-dark-mode-action',
      'helix-configurator-action',
    ]);
  });

  it('skips hidden entries', async () => {
    host.actions.set([{ action: 'darkMode', hidden: true }, { action: 'configurator' }]);
    await render();
    expect(tags('end')).toEqual(['helix-configurator-action']);
  });

  it('renders a custom template action in its zone', async () => {
    host.actions.set([
      { action: { id: 'a', template: host.tplA() }, position: 'center' },
      { action: { id: 'b', template: host.tplB() } },
    ]);
    await render();
    expect(zone('center')?.querySelector('button.custom-a')).not.toBeNull();
    expect(zone('end')?.querySelector('button.custom-b')).not.toBeNull();
  });

  it('keeps the menu toggle and the title in the start zone regardless of actions', async () => {
    host.actions.set([]);
    await render();
    expect(zone('start')?.querySelector('.layout-menu-button')).not.toBeNull();
    expect(zone('start')?.querySelector('.layout-topbar-title')).not.toBeNull();
  });

  describe('narrow screens', () => {
    it('folds the center actions into the end zone', async () => {
      narrowQuery.matches = true;
      await render();
      expect(zone('center')).toBeNull();
      expect(zone('end')?.querySelector('helix-search-action')).not.toBeNull();
    });

    it('follows the viewport when it crosses the breakpoint', async () => {
      await render();
      expect(zone('center')).not.toBeNull();
      narrowQuery.listener?.({ matches: true });
      await render();
      expect(zone('center')).toBeNull();
      expect(zone('end')?.querySelector('helix-search-action')).not.toBeNull();
    });
  });
});

describe('defineTopbarActions', () => {
  const defaults: HelixTopbarActionConfig[] = [
    { action: 'search', position: 'center' },
    { action: 'darkMode', position: 'end', order: 1 },
  ];

  it('changes single fields of the matching entry and keeps the rest', () => {
    const result = defineTopbarActions(defaults, [{ action: 'darkMode', hidden: true }]);
    expect(result).toEqual([
      { action: 'search', position: 'center' },
      { action: 'darkMode', position: 'end', order: 1, hidden: true },
    ]);
  });

  it('appends an override without a match', () => {
    const result = defineTopbarActions(defaults, [{ action: 'alerts', position: 'start' }]);
    expect(result.at(-1)).toEqual({ action: 'alerts', position: 'start' });
    expect(result.length).toBe(3);
  });

  it('matches custom actions by id and does not mutate the defaults', () => {
    const template = {} as TemplateRef<unknown>;
    const base: HelixTopbarActionConfig[] = [{ action: { id: 'x', template } }];
    const result = defineTopbarActions(base, [{ action: { id: 'x', template }, order: 5 }]);
    expect(result.length).toBe(1);
    expect(result[0].order).toBe(5);
    expect(base[0].order).toBeUndefined();
  });

  it('returns a copy of the defaults without overrides', () => {
    const result = defineTopbarActions(defaults);
    expect(result).toEqual(defaults);
    expect(result).not.toBe(defaults);
  });
});

describe('HelixTopbar styles', () => {
  it('insets the actions equally at the start and the end of the page header', async () => {
    await TestBed.configureTestingModule({
      imports: [HelixTopbar],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(HelixTopbar);
    await fixture.whenStable();
    const bar = (fixture.nativeElement as HTMLElement).querySelector(
      '.layout-topbar',
    ) as HTMLElement;
    const style = getComputedStyle(bar);
    expect(style.paddingLeft).toBe('16px');
    expect(style.paddingRight).toBe('16px');
  });
});
