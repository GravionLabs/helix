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
import type { MenuItem } from 'primeng/api';
import { LayoutStore } from '../../store/layout.store';
import { HelixTopbar } from './topbar';

type HelixTopbarPrivate = {
  effectiveBreadcrumbs: () => MenuItem[];
  showBreadcrumbs: () => boolean;
};

describe('HelixTopbar', () => {
  let component: HelixTopbar;
  let fixture: ComponentFixture<HelixTopbar>;

  beforeEach(async () => {
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

  it('should have 3 default badges', () => {
    expect(component.badges().length).toBe(3);
    expect(component.badges()[0].type).toBe('darkmode');
    expect(component.badges()[1].type).toBe('configurator');
    expect(component.badges()[2].type).toBe('mobile');
  });

  it('should render environment badge when environment input set', () => {
    fixture.componentRef.setInput('environment', 'development');
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('helix-environment-badge');
    expect(badge).toBeTruthy();
  });

  it('should render alert badge when badges includes alert type', () => {
    fixture.componentRef.setInput('badges', [{ type: 'alert', badgeCount: 3 }]);
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('helix-alert-badge');
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
});
