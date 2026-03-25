import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { GV_MENU_MODEL } from '../../menu-model.token';
import { GvSidebar } from './sidebar';

/** Exposes private members of GvSidebar for unit testing. */
type GvSidebarPrivate = { effectiveMenu: () => MenuItem[] };

describe('GvSidebar', () => {
  let component: GvSidebar;
  let fixture: ComponentFixture<GvSidebar>;

  describe('with empty token menu', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [GvSidebar],
        providers: [provideRouter([]), { provide: GV_MENU_MODEL, useValue: [] }],
      }).compileComponents();

      fixture = TestBed.createComponent(GvSidebar);
      component = fixture.componentInstance;
      await fixture.whenStable();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('effectiveMenu() should return empty array when no input menu and empty token', () => {
      expect((component as unknown as GvSidebarPrivate).effectiveMenu()).toEqual([]);
    });

    it('effectiveMenu() should return input menu when menu input is set', () => {
      const menu: MenuItem[] = [{ label: 'Home', routerLink: ['/'] }];
      fixture.componentRef.setInput('menu', menu);
      fixture.detectChanges();
      expect((component as unknown as GvSidebarPrivate).effectiveMenu()).toEqual(menu);
    });
  });

  describe('with token menu', () => {
    const tokenMenu: MenuItem[] = [{ label: 'Token Item', routerLink: ['/token'] }];

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [GvSidebar],
        providers: [provideRouter([]), { provide: GV_MENU_MODEL, useValue: tokenMenu }],
      }).compileComponents();

      fixture = TestBed.createComponent(GvSidebar);
      component = fixture.componentInstance;
      await fixture.whenStable();
    });

    it('effectiveMenu() should return token menu when input is empty but token has items', () => {
      expect((component as unknown as GvSidebarPrivate).effectiveMenu()).toEqual(tokenMenu);
    });

    it('effectiveMenu() should prefer input menu over token menu', () => {
      const inputMenu: MenuItem[] = [{ label: 'Input Item', routerLink: ['/input'] }];
      fixture.componentRef.setInput('menu', inputMenu);
      fixture.detectChanges();
      expect((component as unknown as GvSidebarPrivate).effectiveMenu()).toEqual(inputMenu);
    });
  });
});
