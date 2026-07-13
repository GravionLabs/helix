vi.mock('@primeuix/themes', () => ({
  $t: vi.fn(() => ({
    preset: vi.fn().mockReturnThis(),
    surfacePalette: vi.fn().mockReturnThis(),
    use: vi.fn().mockReturnThis(),
  })),
  updatePreset: vi.fn(),
  updateSurfacePalette: vi.fn(),
}));
vi.mock('@primeuix/themes/aura', () => ({ default: { primitive: {} } }));
vi.mock('@primeuix/themes/lara', () => ({ default: { primitive: {} } }));
vi.mock('@primeuix/themes/nora', () => ({ default: { primitive: {} } }));

import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { MenuItem } from '@gravionlabs/helix/api';
import { LayoutStore } from '../../store/layout.store';
import { HelixAppLayout } from './app-layout';

describe('HelixAppLayout', () => {
  let component: HelixAppLayout;
  let fixture: ComponentFixture<HelixAppLayout>;
  let store: InstanceType<typeof LayoutStore>;

  beforeEach(async () => {
    // Override template, imports and styles BEFORE compileComponents() to prevent jsdom from
    // choking on PrimeNG CSS that uses `border: solid var(--surface-border)`. The computed
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

  it('containerClass() should have layout-static-inactive when staticMenuDesktopInactive is true and mode is static', () => {
    store.setMenuMode('static');
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    store.onMenuToggle();
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
    const priv = component as unknown as { effectiveMenu: () => MenuItem[] };
    expect(priv.effectiveMenu()).toEqual([]);
  });

  it('effectiveMenu() should return input menu when set', () => {
    const menu = [{ label: 'Home', routerLink: ['/'] }];
    fixture.componentRef.setInput('menu', menu);
    expect((component as unknown as { effectiveMenu: () => MenuItem[] }).effectiveMenu()).toEqual(
      menu,
    );
  });
});
