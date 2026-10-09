export type MenuMode = 'static' | 'overlay';

/**
 * The layout settings the store owns. Dark mode, the primary colour and the surface are not among them: they
 * belong to the theme service of helix-ui (`HxTheme`), which the store only exposes.
 */
export interface LayoutConfig {
  menuMode: MenuMode;
}

export interface LayoutState {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  configSidebarVisible: boolean;
  mobileMenuActive: boolean;
  menuHoverActive: boolean;
  activePath: string | null;
  sidebarCollapsed: boolean;
  /** Viewport is above the mobile breakpoint (> 991px). Kept in sync on window resize. */
  desktop: boolean;
  /** Keys of the expanded nav-rail items (several can be open at once). */
  expandedKeys: string[];
}
