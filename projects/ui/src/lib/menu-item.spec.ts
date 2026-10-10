import { expectTypeOf } from 'vitest';
import type { HxBreadcrumbItem } from './breadcrumb/breadcrumb';
import type { HxMenuItem } from './menu-item';

describe('HxMenuItem', () => {
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
