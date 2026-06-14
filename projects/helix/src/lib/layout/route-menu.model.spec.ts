import type { ActivatedRouteSnapshot } from '@angular/router';
import type { HelixRouteMenuItem } from './route-menu.model';
import { helixMenuLinksFrom, helixRoutesFrom } from './route-menu.model';

describe('HelixRouteMenuItem breadcrumb', () => {
  it('should support static breadcrumb string', () => {
    const item: HelixRouteMenuItem = {
      path: 'home',
      label: 'Home',
      breadcrumb: 'Home',
      component: class Foo {},
    };
    const routes = helixRoutesFrom([item]);
    expect(routes[0].data?.['breadcrumb']).toBe('Home');
  });

  it('should support function breadcrumb resolver', () => {
    const resolver = (route: ActivatedRouteSnapshot) => `Edit ${route.params['id']}`;
    const item: HelixRouteMenuItem = {
      path: 'edit/:id',
      label: 'Edit',
      breadcrumb: resolver,
      component: class Foo {},
    };
    const routes = helixRoutesFrom([item]);
    expect(routes[0].data?.['breadcrumb']).toBe(resolver);
  });

  it('should not set breadcrumb data when not provided', () => {
    const item: HelixRouteMenuItem = {
      path: 'home',
      label: 'Home',
      component: class Foo {},
    };
    const routes = helixRoutesFrom([item]);
    expect(routes[0].data?.['breadcrumb']).toBeUndefined();
  });

  it('should preserve existing data alongside breadcrumb', () => {
    const item: HelixRouteMenuItem = {
      path: 'admin',
      label: 'Admin',
      breadcrumb: 'Admin',
      data: { title: 'Admin Page' },
      component: class Foo {},
    };
    const routes = helixRoutesFrom([item]);
    expect(routes[0].data?.['breadcrumb']).toBe('Admin');
    expect(routes[0].data?.['title']).toBe('Admin Page');
  });
});

describe('helixMenuLinksFrom breadcrumb', () => {
  it('should preserve breadcrumb in menu item data', () => {
    const items: HelixRouteMenuItem[] = [{ path: 'home', label: 'Home', breadcrumb: 'Home' }];
    const result = helixMenuLinksFrom(items, '/app');
    expect(result[0].data?.['breadcrumb']).toBe('Home');
  });
});
