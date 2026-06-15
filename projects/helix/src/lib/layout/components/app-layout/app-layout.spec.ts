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
import { HELIX_MENU_MODEL } from '../../menu-model.token';
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
      providers: [provideRouter([]), { provide: HELIX_MENU_MODEL, useValue: [] }],
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

  it('should have default appTitle "SAKAI"', () => {
    expect(component.appTitle()).toBe('SAKAI');
  });

  it('should reflect custom appTitle input', () => {
    fixture.componentRef.setInput('appTitle', 'MY APP');
    expect(component.appTitle()).toBe('MY APP');
  });

  it('should have default alertCount 0', () => {
    expect(component.alertCount()).toBe(0);
  });

  it('should reflect custom environment input', () => {
    fixture.componentRef.setInput('environment', 'development');
    expect(component.environment()).toBe('development');
  });

  it('should reflect custom alertCount and alerts inputs', () => {
    const alerts = [{ id: '1', label: 'Test', severity: 'error' }];
    fixture.componentRef.setInput('alertCount', 3);
    fixture.componentRef.setInput('alerts', alerts);
    expect(component.alertCount()).toBe(3);
    expect(component.alerts()).toEqual(alerts);
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
});
