/** What a menu item's `command` receives. */
export interface HxMenuItemCommandEvent {
  originalEvent: Event;
  item: HxMenuItem;
}

/**
 * One entry of a menu, menubar, split button or breadcrumb.
 *
 * A router link wins over `url`; an item with neither and without `command` is a plain label.
 */
export interface HxMenuItem {
  /** Text of the entry. */
  label?: string;
  /** CSS classes of an icon font, e.g. `pi pi-home`. */
  icon?: string;
  /** Router link: a path or commands. */
  routerLink?: string | readonly unknown[];
  /** Query parameters of the router link. */
  queryParams?: Record<string, unknown>;
  /** External address, opened as a normal link. */
  url?: string;
  /** Link target, e.g. `_blank`. */
  target?: string;
  /** Called when the entry is activated. */
  command?(event: HxMenuItemCommandEvent): void;
  /** Child entries: a submenu, or a group when the entry has no action of its own. */
  items?: HxMenuItem[];
  disabled?: boolean;
  /** `false` hides the entry. */
  visible?: boolean;
  /** Draws a line instead of an entry. */
  separator?: boolean;
  /** Id of the rendered element. */
  id?: string;
  /** Accessible name when the label is missing or not enough (icon-only entries). */
  ariaLabel?: string;
  /** A short text shown next to the label, e.g. a count. */
  badge?: string;
}
