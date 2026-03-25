import { TestBed } from '@angular/core/testing';
import { LayoutStore } from './layout.store';

describe('LayoutStore', () => {
  let store: InstanceType<typeof LayoutStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(LayoutStore);
    store.reset();
  });

  describe('initial state', () => {
    it('should have default preset "Aura"', () => {
      expect(store.preset()).toBe('Aura');
    });

    it('should have default primary "emerald"', () => {
      expect(store.primary()).toBe('emerald');
    });

    it('should have default surface null', () => {
      expect(store.surface()).toBeNull();
    });

    it('should have darkTheme false', () => {
      expect(store.darkTheme()).toBe(false);
    });

    it('should have menuMode "static"', () => {
      expect(store.menuMode()).toBe('static');
    });

    it('should have staticMenuDesktopInactive false', () => {
      expect(store.staticMenuDesktopInactive()).toBe(false);
    });

    it('should have overlayMenuActive false', () => {
      expect(store.overlayMenuActive()).toBe(false);
    });

    it('should have configSidebarVisible false', () => {
      expect(store.configSidebarVisible()).toBe(false);
    });

    it('should have mobileMenuActive false', () => {
      expect(store.mobileMenuActive()).toBe(false);
    });

    it('should have menuHoverActive false', () => {
      expect(store.menuHoverActive()).toBe(false);
    });

    it('should have activePath null', () => {
      expect(store.activePath()).toBeNull();
    });
  });

  describe('computed signals', () => {
    it('isDarkTheme should reflect darkTheme', () => {
      expect(store.isDarkTheme()).toBe(false);
      store.toggleDarkMode();
      expect(store.isDarkTheme()).toBe(true);
    });

    it('isOverlay should be true when menuMode is overlay', () => {
      store.setMenuMode('overlay');
      expect(store.isOverlay()).toBe(true);
      expect(store.isStatic()).toBe(false);
    });

    it('isStatic should be true when menuMode is static', () => {
      store.setMenuMode('static');
      expect(store.isStatic()).toBe(true);
      expect(store.isOverlay()).toBe(false);
    });

    it('isSidebarActive should be true when overlayMenuActive is true', () => {
      store.setMenuMode('overlay');
      store.onMenuToggle();
      expect(store.isSidebarActive()).toBe(true);
    });

    it('isSidebarActive should be true when mobileMenuActive is true', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      store.setMenuMode('static');
      store.onMenuToggle();
      expect(store.isSidebarActive()).toBe(true);
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('isSidebarActive should be false when all menu flags are false', () => {
      expect(store.isSidebarActive()).toBe(false);
    });
  });

  describe('toggleDarkMode()', () => {
    it('should toggle darkTheme from false to true', () => {
      store.toggleDarkMode();
      expect(store.darkTheme()).toBe(true);
    });

    it('should toggle darkTheme from true to false', () => {
      store.toggleDarkMode();
      store.toggleDarkMode();
      expect(store.darkTheme()).toBe(false);
    });
  });

  describe('setMenuMode()', () => {
    it('should set menuMode to overlay', () => {
      store.setMenuMode('overlay');
      expect(store.menuMode()).toBe('overlay');
    });

    it('should set menuMode to static', () => {
      store.setMenuMode('overlay');
      store.setMenuMode('static');
      expect(store.menuMode()).toBe('static');
    });
  });

  describe('showConfigSidebar() / hideConfigSidebar()', () => {
    it('should show config sidebar', () => {
      store.showConfigSidebar();
      expect(store.configSidebarVisible()).toBe(true);
    });

    it('should hide config sidebar', () => {
      store.showConfigSidebar();
      store.hideConfigSidebar();
      expect(store.configSidebarVisible()).toBe(false);
    });
  });

  describe('closeMobileMenu()', () => {
    it('should set overlayMenuActive, mobileMenuActive, and menuHoverActive to false', () => {
      store.setMenuMode('overlay');
      store.onMenuToggle();
      store.setMenuHoverActive(true);
      store.closeMobileMenu();
      expect(store.overlayMenuActive()).toBe(false);
      expect(store.mobileMenuActive()).toBe(false);
      expect(store.menuHoverActive()).toBe(false);
    });
  });

  describe('setActivePath()', () => {
    it('should update activePath', () => {
      store.setActivePath('/dashboard');
      expect(store.activePath()).toBe('/dashboard');
    });

    it('should set activePath to null', () => {
      store.setActivePath('/dashboard');
      store.setActivePath(null);
      expect(store.activePath()).toBeNull();
    });
  });

  describe('setMenuHoverActive()', () => {
    it('should set menuHoverActive to true', () => {
      store.setMenuHoverActive(true);
      expect(store.menuHoverActive()).toBe(true);
    });

    it('should set menuHoverActive to false', () => {
      store.setMenuHoverActive(true);
      store.setMenuHoverActive(false);
      expect(store.menuHoverActive()).toBe(false);
    });
  });

  describe('updateConfig()', () => {
    it('should apply partial config update', () => {
      store.updateConfig({ preset: 'Lara', primary: 'blue' });
      expect(store.preset()).toBe('Lara');
      expect(store.primary()).toBe('blue');
      expect(store.darkTheme()).toBe(false);
    });
  });

  describe('setPreset() / setPrimary() / setSurface()', () => {
    it('should set preset', () => {
      store.setPreset('Nora');
      expect(store.preset()).toBe('Nora');
    });

    it('should set primary', () => {
      store.setPrimary('blue');
      expect(store.primary()).toBe('blue');
    });

    it('should set surface to a value', () => {
      store.setSurface('slate');
      expect(store.surface()).toBe('slate');
    });

    it('should set surface to null', () => {
      store.setSurface('slate');
      store.setSurface(null);
      expect(store.surface()).toBeNull();
    });
  });

  describe('reset()', () => {
    it('should restore initial state after mutations', () => {
      store.setPreset('Nora');
      store.setPrimary('blue');
      store.setSurface('slate');
      store.toggleDarkMode();
      store.setMenuMode('overlay');
      store.showConfigSidebar();
      store.setActivePath('/test');

      store.reset();

      expect(store.preset()).toBe('Aura');
      expect(store.primary()).toBe('emerald');
      expect(store.surface()).toBeNull();
      expect(store.darkTheme()).toBe(false);
      expect(store.menuMode()).toBe('static');
      expect(store.configSidebarVisible()).toBe(false);
      expect(store.activePath()).toBeNull();
    });
  });

  describe('onMenuToggle()', () => {
    it('should toggle overlayMenuActive in overlay mode', () => {
      store.setMenuMode('overlay');
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      store.onMenuToggle();
      expect(store.overlayMenuActive()).toBe(true);
      store.onMenuToggle();
      expect(store.overlayMenuActive()).toBe(false);
    });

    it('should toggle staticMenuDesktopInactive in static mode on desktop', () => {
      store.setMenuMode('static');
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      store.onMenuToggle();
      expect(store.staticMenuDesktopInactive()).toBe(true);
      store.onMenuToggle();
      expect(store.staticMenuDesktopInactive()).toBe(false);
    });

    it('should toggle mobileMenuActive in static mode on mobile', () => {
      store.setMenuMode('static');
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });
      store.onMenuToggle();
      expect(store.mobileMenuActive()).toBe(true);
      store.onMenuToggle();
      expect(store.mobileMenuActive()).toBe(false);
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });
  });

  describe('dark mode effect', () => {
    it('should add app-dark class when darkTheme becomes true', () => {
      document.documentElement.classList.remove('app-dark');
      store.toggleDarkMode();
      TestBed.flushEffects();
      expect(document.documentElement.classList.contains('app-dark')).toBe(true);
    });

    it('should remove app-dark class when darkTheme becomes false', () => {
      document.documentElement.classList.add('app-dark');
      store.toggleDarkMode();
      TestBed.flushEffects();
      store.toggleDarkMode();
      TestBed.flushEffects();
      expect(document.documentElement.classList.contains('app-dark')).toBe(false);
    });
  });

  describe('isDesktop()', () => {
    it('should return true when innerWidth > 991', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      expect(store.isDesktop()).toBe(true);
    });

    it('should return false when innerWidth <= 991', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      expect(store.isDesktop()).toBe(false);
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });
  });
});
