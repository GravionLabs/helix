export type MenuMode = 'static' | 'overlay';

export interface LayoutConfig {
  preset: string;
  primary: string;
  surface: string | undefined | null;
  darkTheme: boolean;
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
  /** Keys of the expanded nav-rail items (several can be open at once). */
  expandedKeys: string[];
}
