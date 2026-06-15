import { computed, effect } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import type { LayoutConfig, LayoutState, MenuMode } from './layout.models';

type LayoutStoreState = LayoutConfig & LayoutState;

const initialState: LayoutStoreState = {
  // Config
  preset: 'Aura',
  primary: 'emerald',
  surface: null,
  darkTheme: false,
  menuMode: 'static',
  // State
  staticMenuDesktopInactive: false,
  overlayMenuActive: false,
  configSidebarVisible: false,
  mobileMenuActive: false,
  menuHoverActive: false,
  activePath: null,
  sidebarCollapsed: false,
};

export const LayoutStore = signalStore(
  { providedIn: 'root' },
  withState<LayoutStoreState>(initialState),
  withComputed((store) => ({
    isDarkTheme: computed(() => store.darkTheme()),
    isOverlay: computed(() => store.menuMode() === 'overlay'),
    isStatic: computed(() => store.menuMode() === 'static'),
    isSidebarActive: computed(() => store.overlayMenuActive() || store.mobileMenuActive()),
    isCollapsed: computed(() => store.sidebarCollapsed()),
  })),
  withMethods((store) => ({
    toggleDarkMode(): void {
      patchState(store, { darkTheme: !store.darkTheme() });
    },
    setMenuMode(menuMode: MenuMode): void {
      patchState(store, { menuMode });
    },
    showConfigSidebar(): void {
      patchState(store, { configSidebarVisible: true });
    },
    hideConfigSidebar(): void {
      patchState(store, { configSidebarVisible: false });
    },
    onMenuToggle(): void {
      if (store.menuMode() === 'overlay') {
        patchState(store, { overlayMenuActive: !store.overlayMenuActive() });
      }
      if (window.innerWidth > 991) {
        patchState(store, { staticMenuDesktopInactive: !store.staticMenuDesktopInactive() });
      } else {
        patchState(store, { mobileMenuActive: !store.mobileMenuActive() });
      }
    },
    closeMobileMenu(): void {
      patchState(store, {
        overlayMenuActive: false,
        mobileMenuActive: false,
        menuHoverActive: false,
      });
    },
    setActivePath(activePath: string | null): void {
      patchState(store, { activePath });
    },
    toggleSidebar(): void {
      patchState(store, { sidebarCollapsed: !store.sidebarCollapsed() });
    },
    setMenuHoverActive(menuHoverActive: boolean): void {
      patchState(store, { menuHoverActive });
    },
    updateConfig(config: Partial<LayoutConfig>): void {
      patchState(store, config);
    },
    setPreset(preset: string): void {
      patchState(store, { preset });
    },
    setPrimary(primary: string): void {
      patchState(store, { primary });
    },
    setSurface(surface: string | null): void {
      patchState(store, { surface });
    },
    isDesktop(): boolean {
      return window.innerWidth > 991;
    },
    reset(): void {
      patchState(store, initialState);
    },
  })),
  withHooks({
    onInit(store) {
      effect(() => {
        const isDark = store.darkTheme();
        const supportsViewTransition = 'startViewTransition' in document;

        const applyDarkMode = () => {
          if (isDark) {
            document.documentElement.classList.add('app-dark');
          } else {
            document.documentElement.classList.remove('app-dark');
          }
        };

        if (supportsViewTransition) {
          (document as any).startViewTransition(() => applyDarkMode());
        } else {
          applyDarkMode();
        }
      });
    },
  }),
);
