import { computed, DestroyRef, inject } from '@angular/core';
import { type HxPrimaryColor, type HxSurface, HxTheme } from '@gravionlabs/helix-ui';
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
  withComputed((store, theme = inject(HxTheme)) => ({
    /** Dark mode, primary colour and surface live in the theme service of helix-ui; these are its values. */
    darkTheme: computed(() => theme.dark()),
    primary: computed(() => theme.primary()),
    surface: computed(() => theme.surface()),
    isDarkTheme: computed(() => theme.dark()),
    isOverlay: computed(() => store.menuMode() === 'overlay'),
    isStatic: computed(() => store.menuMode() === 'static'),
    isSidebarActive: computed(() => store.overlayMenuActive() || store.mobileMenuActive()),
    /** Icon-only rail. Only applies on desktop — the mobile drawer always shows labels. */
    isCollapsed: computed(() => store.sidebarCollapsed() && store.desktop()),
  })),
  withMethods((store, theme = inject(HxTheme)) => ({
    toggleDarkMode(): void {
      theme.toggleDark();
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
    setPrimary(primary: HxPrimaryColor | null): void {
      theme.setPrimary(primary);
    },
    setSurface(surface: HxSurface | null): void {
      theme.setSurface(surface);
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
    },
  }),
);
