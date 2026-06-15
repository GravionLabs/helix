import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import { HELIX_MENU_MODEL } from '../../menu-model.token';
import { LayoutStore } from '../../store/layout.store';
import { HelixSidebar } from './sidebar';

/** Exposes private members of HelixSidebar for unit testing. */
type HelixSidebarPrivate = { effectiveMenu: () => MenuItem[] };

describe('HelixSidebar', () => {
  let component: HelixSidebar;
  let fixture: ComponentFixture<HelixSidebar>;

  describe('with empty token menu', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [HelixSidebar],
        providers: [provideRouter([]), { provide: HELIX_MENU_MODEL, useValue: [] }],
      }).compileComponents();

      fixture = TestBed.createComponent(HelixSidebar);
      component = fixture.componentInstance;
      await fixture.whenStable();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have a collapse toggle button', () => {
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('.layout-sidebar-collapse-button');
      expect(button).toBeTruthy();
    });

    it('should toggle sidebarCollapsed on collapse button click', () => {
      fixture.detectChanges();
      const store = TestBed.inject(LayoutStore);
      expect(store.sidebarCollapsed()).toBe(false);

      const button = fixture.nativeElement.querySelector('.layout-sidebar-collapse-button');
      button.click();
      fixture.detectChanges();
      expect(store.sidebarCollapsed()).toBe(true);
    });

    it('should render brand header with default title', () => {
      fixture.detectChanges();
      const logoText = fixture.nativeElement.querySelector('.layout-sidebar-logo-text');
      expect(logoText).toBeTruthy();
      expect(logoText.textContent).toContain('SAKAI');
    });

    it('should render brand header with custom title', () => {
      fixture.componentRef.setInput('appTitle', 'Helix');
      fixture.detectChanges();
      const logoText = fixture.nativeElement.querySelector('.layout-sidebar-logo-text');
      expect(logoText.textContent).toContain('Helix');
    });

    it('effectiveMenu() should return empty array when no input menu and empty token', () => {
      expect((component as unknown as HelixSidebarPrivate).effectiveMenu()).toEqual([]);
    });

    it('effectiveMenu() should return input menu when menu input is set', () => {
      const menu: MenuItem[] = [{ label: 'Home', routerLink: ['/'] }];
      fixture.componentRef.setInput('menu', menu);
      fixture.detectChanges();
      expect((component as unknown as HelixSidebarPrivate).effectiveMenu()).toEqual(menu);
    });
  });

  describe('with token menu', () => {
    const tokenMenu: MenuItem[] = [{ label: 'Token Item', routerLink: ['/token'] }];

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [HelixSidebar],
        providers: [provideRouter([]), { provide: HELIX_MENU_MODEL, useValue: tokenMenu }],
      }).compileComponents();

      fixture = TestBed.createComponent(HelixSidebar);
      component = fixture.componentInstance;
      await fixture.whenStable();
    });

    it('effectiveMenu() should return token menu when input is empty but token has items', () => {
      expect((component as unknown as HelixSidebarPrivate).effectiveMenu()).toEqual(tokenMenu);
    });

    it('effectiveMenu() should prefer input menu over token menu', () => {
      const inputMenu: MenuItem[] = [{ label: 'Input Item', routerLink: ['/input'] }];
      fixture.componentRef.setInput('menu', inputMenu);
      fixture.detectChanges();
      expect((component as unknown as HelixSidebarPrivate).effectiveMenu()).toEqual(inputMenu);
    });
  });
});
