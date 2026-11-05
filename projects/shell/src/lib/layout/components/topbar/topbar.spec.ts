import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { HxMenuItem } from '@gravionlabs/helix-ui';
import { LayoutStore } from '../../store/layout.store';
import { HelixTopbar } from './topbar';

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

    it('renders no global actions: they live in the nav rail', () => {
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      expect(
        el.querySelector('.layout-config-menu, .layout-topbar-menu, helix-dark-mode-action'),
      ).toBeNull();
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
    <helix-topbar>
      <button helixTopbarEnd type="button" class="end-slot">End</button>
    </helix-topbar>
  `,
})
class TopbarEndHostComponent {}

describe('HelixTopbar [helixTopbarEnd] slot', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TopbarEndHostComponent, HelixTopbar],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  const render = async <T>(type: new () => T): Promise<HTMLElement> => {
    const fixture = TestBed.createComponent(type);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  it('renders projected content in the end cluster of the header', async () => {
    const root = await render(TopbarEndHostComponent);
    const end = root.querySelector('.end-slot') as HTMLElement;

    expect(root.querySelector('.layout-topbar-end')?.contains(end)).toBe(true);
    expect(root.querySelector('.layout-topbar-slot')?.contains(end)).toBe(true);
  });

  it('leaves the slot wrapper empty without projected content', async () => {
    const root = await render(HelixTopbar);
    const slot = root.querySelector('.layout-topbar-slot') as HTMLElement;

    expect(slot).toBeTruthy();
    expect(slot.children.length).toBe(0);
    expect(slot.matches(':not(:has(*))')).toBe(true);
  });
});
