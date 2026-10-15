import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { HxMenuItem } from '@gravionlabs/helix-ui';
import { LayoutStore } from '../../store/layout.store';
import { HelixStatusBar } from '../status-bar/status-bar';
import { HelixTopbar } from '../topbar/topbar';
import { HelixAppLayout } from './app-layout';

describe('HelixAppLayout', () => {
  let component: HelixAppLayout;
  let fixture: ComponentFixture<HelixAppLayout>;
  let store: InstanceType<typeof LayoutStore>;

  beforeEach(async () => {
    localStorage.clear();
    // Override template, imports and styles BEFORE compileComponents() to prevent jsdom from
    // choking on HelixConfig CSS that uses `border: solid var(--surface-border)`. The computed
    // signals under test live on the class and need no rendered child components.
    await TestBed.configureTestingModule({
      imports: [HelixAppLayout],
      providers: [provideRouter([])],
    })
      .overrideComponent(HelixAppLayout, {
        set: { template: '<div></div>', imports: [], styles: [] },
      })
      .compileComponents();

    store = TestBed.inject(LayoutStore);
    store.reset();

    fixture = TestBed.createComponent(HelixAppLayout);
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
    expect(component.appTitle()).toBe('MY APP');
  });

  it('effectiveItems() should include darkmode, configurator, mobile by default', () => {
    const priv = component as unknown as { effectiveItems: () => { type: string }[] };
    const items = priv.effectiveItems();
    expect(items.length).toBe(3);
    expect(items[0].type).toBe('darkmode');
    expect(items[1].type).toBe('configurator');
    expect(items[2].type).toBe('mobile');
  });

  it('effectiveItems() should return custom items when topbarItems input is set', () => {
    const custom = [
      { type: 'action' as const, icon: 'pi pi-bell', label: 'Alerts', command: () => {} },
    ];
    fixture.componentRef.setInput('topbarItems', custom);
    const priv = component as unknown as { effectiveItems: () => { type: string }[] };
    expect(priv.effectiveItems()).toEqual(custom);
  });

  it('effectiveTopbarActions() should return default actions when topbarActions not set', () => {
    const priv = component as unknown as {
      effectiveTopbarActions: () => { icon: string; label: string }[];
    };
    const actions = priv.effectiveTopbarActions();
    expect(actions.length).toBe(3);
    expect(actions[0].icon).toBe('pi pi-calendar');
  });

  it('effectiveTopbarActions() should return custom actions when topbarActions input is set', () => {
    const custom = [{ icon: 'pi pi-cog', label: 'Settings', command: () => {} }];
    fixture.componentRef.setInput('topbarActions', custom);
    const priv = component as unknown as {
      effectiveTopbarActions: () => { icon: string; label: string }[];
    };
    expect(priv.effectiveTopbarActions()).toEqual(custom);
  });

  it('brandIcon() should reflect input', () => {
    expect(component.brandIcon()).toBeUndefined();
    fixture.componentRef.setInput('brandIcon', '<svg><path d="..." /></svg>');
    expect(component.brandIcon()).toBe('<svg><path d="..." /></svg>');
  });

  it('containerClass() should have layout-static when menuMode is static', () => {
    store.setMenuMode('static');
    const classes = component.containerClass();
    expect(classes['layout-static']).toBe(true);
    expect(classes['layout-overlay']).toBe(false);
  });

  it('containerClass() should have layout-overlay when menuMode is overlay', () => {
    store.setMenuMode('overlay');
    const classes = component.containerClass();
    expect(classes['layout-overlay']).toBe(true);
    expect(classes['layout-static']).toBe(false);
  });

  it('containerClass() should have layout-mobile-active when mobileMenuActive is true', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
    store.setMenuMode('static');
    store.onMenuToggle();
    const classes = component.containerClass();
    expect(classes['layout-mobile-active']).toBe(true);
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('containerClass() should have layout-overlay-active when overlayMenuActive is true', () => {
    store.setMenuMode('overlay');
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    store.onMenuToggle();
    const classes = component.containerClass();
    expect(classes['layout-overlay-active']).toBe(true);
  });

  it('containerClass() still honours the legacy staticMenuDesktopInactive flag in static mode', () => {
    store.setMenuMode('static');
    // No longer reachable from the UI; kept in the store for compatibility.
    store.updateConfig({ staticMenuDesktopInactive: true } as never);
    const classes = component.containerClass();
    expect(classes['layout-static-inactive']).toBe(true);
  });

  it('containerClass() should have layout-sidebar-collapsed when sidebarCollapsed is true', () => {
    store.toggleSidebar();
    const classes = component.containerClass();
    expect(classes['layout-sidebar-collapsed']).toBe(true);
  });

  it('containerClass() should not have layout-sidebar-collapsed when sidebarCollapsed is false', () => {
    const classes = component.containerClass();
    expect(classes['layout-sidebar-collapsed']).toBe(false);
  });

  it('effectiveMenu() should return empty array when no input or route data', () => {
    const priv = component as unknown as { effectiveMenu: () => HxMenuItem[] };
    expect(priv.effectiveMenu()).toEqual([]);
  });

  it('effectiveMenu() should return input menu when set', () => {
    const menu = [{ label: 'Home', routerLink: ['/'] }];
    fixture.componentRef.setInput('menu', menu);
    expect((component as unknown as { effectiveMenu: () => HxMenuItem[] }).effectiveMenu()).toEqual(
      menu,
    );
  });

  describe('nav groups', () => {
    const menu = [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Components', items: [{ label: 'Button', path: '/uikit/button' }] },
    ];
    const groups = () =>
      (component as unknown as { effectiveNavGroups: () => unknown[] }).effectiveNavGroups();

    it('navStyle defaults to "sections"', () => {
      fixture.componentRef.setInput('menu', menu);
      expect(groups()).toEqual([
        { items: [menu[0]] },
        { section: 'Components', items: menu[1].items },
      ]);
    });

    it('navStyle "tree" keeps a single unlabeled group', () => {
      fixture.componentRef.setInput('menu', menu);
      fixture.componentRef.setInput('navStyle', 'tree');
      expect(groups()).toEqual([{ items: menu }]);
    });

    it('explicit navGroups win over the mapped menu', () => {
      const explicit = [{ section: 'Mine', items: [{ label: 'X', path: '/x' }] }];
      fixture.componentRef.setInput('menu', menu);
      fixture.componentRef.setInput('navGroups', explicit);
      expect(groups()).toEqual(explicit);
    });
  });

  it('should pass a custom environment through effectiveEnvironment', () => {
    const custom = { label: 'Sample data', severity: 'warn' } as const;
    fixture.componentRef.setInput('environment', custom);
    const priv = component as unknown as { effectiveEnvironment: () => unknown };
    expect(priv.effectiveEnvironment()).toEqual(custom);
  });

  it('should accept a custom statusBarEnvironment', () => {
    const custom = { label: 'Sample data', severity: 'info' } as const;
    fixture.componentRef.setInput('statusBarEnvironment', custom);
    expect(component.statusBarEnvironment()).toEqual(custom);
  });
});

@Component({
  imports: [HelixAppLayout],
  template: `
    <ng-template #tpl>Docs <a href="/docs">here</a></ng-template>
    <helix-app-layout [statusBarNote]="useTemplate() ? tpl : 'Plain note'">
      @if (withTopbarEnd()) {
        <input helixTopbarEnd aria-label="Filter" />
      }
      @if (withEnd()) {
        <button hxStatusBarEnd type="button">Help</button>
      }
    </helix-app-layout>
  `,
})
class LayoutHostComponent {
  useTemplate = signal(false);
  withEnd = signal(true);
  withTopbarEnd = signal(true);
}

describe('HelixAppLayout status bar forwarding', () => {
  let fixture: ComponentFixture<LayoutHostComponent>;
  let host: LayoutHostComponent;

  const note = (): HTMLElement => fixture.nativeElement.querySelector('.helix-status-bar-note');
  const end = (): HTMLElement => fixture.nativeElement.querySelector('.helix-status-bar-end');

  async function render(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LayoutHostComponent],
      providers: [provideRouter([])],
    })
      .overrideComponent(HelixAppLayout, {
        // Real template; only the status bar is real. Topbar, nav-rail and router-outlet are
        // left unknown (their CSS chokes jsdom), hence the schema.
        set: { imports: [HelixStatusBar], styles: [], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(LayoutHostComponent);
    host = fixture.componentInstance;
  });

  it('projects [hxStatusBarEnd] content into the status bar end slot', async () => {
    await render();
    expect(end().querySelector('button')?.textContent).toContain('Help');
  });

  it('leaves the end slot empty when no content is projected', async () => {
    host.withEnd.set(false);
    await render();
    expect(end().children.length).toBe(0);
    expect(Array.from(end().childNodes).filter((n) => n.nodeType === Node.TEXT_NODE)).toEqual([]);
  });

  it('renders a string statusBarNote', async () => {
    await render();
    expect(note().textContent?.trim()).toBe('Plain note');
  });

  it('renders a TemplateRef statusBarNote', async () => {
    host.useTemplate.set(true);
    await render();
    expect(note().querySelector('a')?.getAttribute('href')).toBe('/docs');
  });

  it('switches the note between string and TemplateRef at runtime', async () => {
    await render();
    host.useTemplate.set(true);
    await render();
    expect(note().querySelector('a')).not.toBeNull();
    host.useTemplate.set(false);
    await render();
    expect(note().querySelector('a')).toBeNull();
    expect(note().textContent?.trim()).toBe('Plain note');
  });
});

describe('HelixAppLayout topbar forwarding', () => {
  let fixture: ComponentFixture<LayoutHostComponent>;
  let host: LayoutHostComponent;

  const topbar = (): HTMLElement => fixture.nativeElement.querySelector('helix-topbar');
  const filter = (): HTMLElement | null => fixture.nativeElement.querySelector('[helixTopbarEnd]');

  async function render(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LayoutHostComponent],
      providers: [provideRouter([])],
    })
      .overrideComponent(HelixAppLayout, {
        // Topbar, nav-rail and router-outlet are left unknown (their CSS chokes jsdom), so the
        // projected node is rendered as a direct child of the <helix-topbar> element.
        set: { imports: [], styles: [], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(LayoutHostComponent);
    host = fixture.componentInstance;
  });

  it('projects [helixTopbarEnd] content into helix-topbar', async () => {
    await render();
    expect(topbar().contains(filter())).toBe(true);
    expect(filter()?.getAttribute('aria-label')).toBe('Filter');
  });

  it('renders nothing inside helix-topbar when no content is projected', async () => {
    host.withTopbarEnd.set(false);
    await render();
    expect(filter()).toBeNull();
    expect(topbar().children.length).toBe(0);
  });
});

describe('HelixAppLayout topbar forwarding into the real HelixTopbar', () => {
  let fixture: ComponentFixture<LayoutHostComponent>;
  let host: LayoutHostComponent;

  const slot = (): HTMLElement => fixture.nativeElement.querySelector('.layout-topbar-slot');
  const filter = (): HTMLElement | null => fixture.nativeElement.querySelector('[helixTopbarEnd]');

  async function render(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LayoutHostComponent],
      providers: [provideRouter([])],
    })
      .overrideComponent(HelixAppLayout, {
        // Real topbar so ngProjectAs is exercised end-to-end; nav-rail and router-outlet stay
        // unknown (their CSS chokes jsdom), hence the schema.
        set: { imports: [HelixTopbar], styles: [], schemas: [NO_ERRORS_SCHEMA] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(LayoutHostComponent);
    host = fixture.componentInstance;
  });

  it('lands [helixTopbarEnd] content inside the topbar slot wrapper', async () => {
    await render();
    expect(slot().contains(filter())).toBe(true);
    expect(filter()?.getAttribute('aria-label')).toBe('Filter');
    expect(fixture.nativeElement.querySelector('.layout-topbar-menu')?.contains(filter())).toBe(
      false,
    );
  });

  it('leaves the topbar slot wrapper empty when nothing is projected', async () => {
    host.withTopbarEnd.set(false);
    await render();
    expect(filter()).toBeNull();
    // The host's @if anchor comment is projected too, so only element children count.
    expect(slot().children.length).toBe(0);
    expect(slot().matches(':not(:has(*))')).toBe(true);
  });
});
