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

  it('should have 3 default topbarActions', () => {
    expect(component.topbarActions().length).toBe(3);
  });

  it('should reflect custom topbarActions input', () => {
    const actions = [{ icon: 'pi pi-star', label: 'Star' }];
    fixture.componentRef.setInput('topbarActions', actions);
    fixture.detectChanges();
    expect(component.topbarActions()).toEqual(actions);
  });

  it('should have store injected', () => {
    const store = TestBed.inject(LayoutStore);
    expect(component.store).toBe(store);
  });

  it('should have 3 default items', () => {
    expect(component.items().length).toBe(3);
    expect(component.items()[0].type).toBe('darkmode');
    expect(component.items()[1].type).toBe('configurator');
    expect(component.items()[2].type).toBe('mobile');
  });

  it('should render alert item when items includes alert type', () => {
    fixture.componentRef.setInput('items', [{ type: 'alert', badgeCount: 3 }]);
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('helix-alert-action');
    expect(badge).toBeTruthy();
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

  describe('actions menu', () => {
    const menu = (): HTMLElement => fixture.nativeElement.querySelector('.layout-topbar-menu');
    const toggle = (): HTMLButtonElement =>
      fixture.nativeElement.querySelector('.layout-topbar-menu-button');

    it('is hidden by default and does not use the Tailwind lg breakpoint', () => {
      fixture.detectChanges();
      expect(menu().classList.contains('hidden')).toBe(true);
      expect(menu().classList.contains('lg:block')).toBe(false);
    });

    it('toggles the hidden class when the ellipsis button is clicked', () => {
      vi.useFakeTimers();
      try {
        fixture.detectChanges();
        toggle().click();
        expect(menu().classList.contains('hidden')).toBe(false);
        toggle().click();
        vi.advanceTimersByTime(400); // the close fade-out ends via its fallback timer
        expect(menu().classList.contains('hidden')).toBe(true);
      } finally {
        vi.useRealTimers();
      }
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
    <helix-topbar [topbarActions]="actions">
      <button helixTopbarEnd type="button" class="end-slot">End</button>
    </helix-topbar>
  `,
})
class TopbarEndHostComponent {
  actions = [{ icon: 'pi pi-star', label: 'Star' }];
}

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

  it('renders projected content in the end cluster, outside the collapsible menu', async () => {
    const root = await render(TopbarEndHostComponent);
    const end = root.querySelector('.end-slot') as HTMLElement;

    expect(root.querySelector('.layout-topbar-end')?.contains(end)).toBe(true);
    expect(root.querySelector('.layout-topbar-slot')?.contains(end)).toBe(true);
    expect(root.querySelector('.layout-topbar-menu')?.contains(end)).toBe(false);
    expect(root.querySelector('.layout-topbar-menu-content')?.contains(end)).toBe(false);
  });

  it('places projected content before the config items, the ellipsis button and the menu actions', async () => {
    const root = await render(TopbarEndHostComponent);
    const end = root.querySelector('.end-slot') as HTMLElement;
    const configMenu = root.querySelector('.layout-config-menu') as HTMLElement;
    const ellipsis = root.querySelector('.layout-topbar-menu-button') as HTMLElement;
    const action = root.querySelector('.layout-topbar-menu .layout-topbar-action') as HTMLElement;

    const follows = (a: Node, b: Node): boolean =>
      (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

    expect(follows(end, configMenu)).toBe(true);
    expect(follows(configMenu, ellipsis)).toBe(true);
    expect(follows(ellipsis, action)).toBe(true);
  });

  it('leaves the slot wrapper empty without projected content', async () => {
    const root = await render(HelixTopbar);
    const slot = root.querySelector('.layout-topbar-slot') as HTMLElement;

    expect(slot).toBeTruthy();
    expect(slot.childNodes.length).toBe(0);
    expect(slot.matches(':empty')).toBe(true);
  });
});
