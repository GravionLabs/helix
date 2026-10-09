// biome-ignore-all lint/suspicious/noExplicitAny: helix-core types these fields as `any`; the copy keeps that
import { expectTypeOf } from 'vitest';
import type { HxBreadcrumbItem } from './breadcrumb/breadcrumb';
import type { HxMenuItem } from './menu-item';

/**
 * The menu item type of helix-core (`MenuItem` and `MenuItemCommandEvent` of `@gravionlabs/helix-core/api`),
 * copied here as plain types: helix-ui must not import helix-core. If this stops compiling, apps that pass
 * such items to helix-ui components break.
 */
interface CoreMenuItemCommandEvent {
  originalEvent?: Event;
  item?: CoreMenuItem;
  index?: number;
}
interface CoreMenuItem {
  label?: string;
  icon?: string;
  command?(event: CoreMenuItemCommandEvent): void;
  url?: string;
  items?: CoreMenuItem[];
  expanded?: boolean;
  disabled?: boolean;
  visible?: boolean;
  target?: string;
  escape?: boolean;
  routerLinkActiveOptions?: any;
  separator?: boolean;
  badge?: string;
  tooltip?: string;
  style?: { [klass: string]: any } | null | undefined;
  styleClass?: string;
  title?: string;
  id?: string;
  automationId?: any;
  tabindex?: string;
  routerLink?: any;
  queryParams?: { [k: string]: any };
  iconClass?: string;
  state?: { [k: string]: any };
}

describe('HxMenuItem', () => {
  it('accepts a menu item of helix-core as it is', () => {
    const fromCore: CoreMenuItem = {
      label: 'Settings',
      icon: 'pi pi-cog',
      routerLink: ['/settings'],
      items: [{ label: 'Profile', url: '/profile', target: '_blank' }],
      command: () => {},
    };
    const item: HxMenuItem = fromCore;
    expect(item.label).toBe('Settings');
    expectTypeOf<CoreMenuItem>().toExtend<HxMenuItem>();
  });

  it('carries the fields of the menu components', () => {
    const item: HxMenuItem = {
      id: 'save',
      label: 'Save',
      ariaLabel: 'Save the document',
      icon: 'pi pi-save',
      routerLink: '/save',
      queryParams: { draft: true },
      badge: '3',
      disabled: false,
      visible: true,
      separator: false,
      command: (event) => {
        expect(event.originalEvent).toBeInstanceOf(Event);
        expect(event.item.label).toBe('Save');
      },
    };
    item.command?.({ originalEvent: new Event('click'), item });
  });

  it('is what a breadcrumb takes', () => {
    expectTypeOf<HxBreadcrumbItem>().toEqualTypeOf<HxMenuItem>();
  });
});
