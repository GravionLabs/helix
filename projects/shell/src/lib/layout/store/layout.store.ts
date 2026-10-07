import { computed, DestroyRef, effect, inject } from '@angular/core';
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

/** Mobile breakpoint: above this width the rail is static and collapsible, below it is a drawer. */
const DESKTOP_MIN_WIDTH = 992;
const COLLAPSED_STORAGE_KEY = 'helix.nav-rail.collapsed';

const isDesktopViewport = () =>
  typeof window === 'undefined' || window.innerWidth >= DESKTOP_MIN_WIDTH;

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSED_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function writeCollapsed(collapsed: boolean): void {
  try {
    localStorage.setItem(COLLAPSED_STORAGE_KEY, String(collapsed));
  } catch {
    // Storage unavailable (private mode, blocked): the state just isn't remembered.
  }
}

const initialState: LayoutStoreState = {
  // Config
  preset: 'Helix',
  primary: null,
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
  desktop: true,
  expandedKeys: [],
};

export const LayoutStore = signalStore(
  { providedIn: 'root' },
  withState<LayoutStoreState>(initialState),
  withComputed((store) => ({
    isDarkTheme: computed(() => store.darkTheme()),
    isOverlay: computed(() => store.menuMode() === 'overlay'),
    isStatic: computed(() => store.menuMode() === 'static'),
    isSidebarActive: computed(() => store.overlayMenuActive() || store.mobileMenuActive()),
    /** Icon-only rail. Only applies on desktop — the mobile drawer always shows labels. */
    isCollapsed: computed(() => store.sidebarCollapsed() && store.desktop()),
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
        // Desktop: the rail is never hidden completely, the toggle collapses it to icons.
        if (store.menuMode() === 'static') {
          const sidebarCollapsed = !store.sidebarCollapsed();
          patchState(store, { sidebarCollapsed });
          writeCollapsed(sidebarCollapsed);
        }
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
    setExpanded(key: string, expanded: boolean): void {
      const keys = store.expandedKeys();
      if (keys.includes(key) === expanded) return;
      patchState(store, {
        expandedKeys: expanded ? [...keys, key] : keys.filter((k) => k !== key),
      });
    },
    toggleSidebar(): void {
      const sidebarCollapsed = !store.sidebarCollapsed();
      patchState(store, { sidebarCollapsed });
      writeCollapsed(sidebarCollapsed);
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
    setPrimary(primary: string | null): void {
      patchState(store, { primary });
    },
    setSurface(surface: string | null): void {
      patchState(store, { surface });
    },
    isDesktop(): boolean {
      return window.innerWidth > 991;
    },
    setDesktop(desktop: boolean): void {
      patchState(store, { desktop });
    },
    reset(): void {
      patchState(store, { ...initialState, desktop: isDesktopViewport() });
    },
  })),
  withHooks({
    onInit(store) {
      patchState(store, { sidebarCollapsed: readCollapsed(), desktop: isDesktopViewport() });
      if (typeof window !== 'undefined') {
        const onResize = () => store.setDesktop(isDesktopViewport());
        window.addEventListener('resize', onResize);
        inject(DestroyRef).onDestroy(() => window.removeEventListener('resize', onResize));
      }

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
