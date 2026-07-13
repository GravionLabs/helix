import { helixBreadcrumbsFromRoutes } from './breadcrumb-utils';

describe('helixBreadcrumbsFromRoutes', () => {
  it('should return breadcrumbs from static route data', () => {
    const route = {
      snapshot: { data: { breadcrumb: 'Products' }, url: [{ path: 'products', parameters: {} }] },
      parent: {
        snapshot: { data: { breadcrumb: 'Home' }, url: [{ path: '', parameters: {} }] },
        parent: null,
      },
    } as any;

    const result = helixBreadcrumbsFromRoutes(route);
    expect(result.length).toBe(2);
    expect(result[0].label).toBe('Home');
    expect(result[1].label).toBe('Products');
  });

  it('should resolve function breadcrumb', () => {
    const route = {
      snapshot: {
        data: { breadcrumb: (s: any) => `Item ${s.params.id}` },
        url: [
          { path: 'items', parameters: {} },
          { path: '42', parameters: {} },
        ],
        params: { id: '42' },
      },
      parent: {
        snapshot: { data: {}, url: [{ path: '', parameters: {} }] },
        parent: null,
      },
    } as any;

    const result = helixBreadcrumbsFromRoutes(route);
    expect(result.length).toBe(1);
    expect(result[0].label).toBe('Item 42');
  });

  it('should return empty array when no breadcrumb data', () => {
    const route = {
      snapshot: { data: {}, url: [{ path: 'about', parameters: {} }] },
      parent: null,
    } as any;

    const result = helixBreadcrumbsFromRoutes(route);
    expect(result).toEqual([]);
  });

  it('should build breadcrumb chain for nested routes', () => {
    const route = {
      snapshot: {
        data: { breadcrumb: 'Settings' },
        url: [{ path: 'settings', parameters: {} }],
      },
      parent: {
        snapshot: {
          data: { breadcrumb: 'Dashboard' },
          url: [{ path: 'dashboard', parameters: {} }],
        },
        parent: {
          snapshot: { data: {}, url: [{ path: '', parameters: {} }] },
          parent: null,
        },
      },
    } as any;

    const result = helixBreadcrumbsFromRoutes(route);
    expect(result.length).toBe(2);
    expect(result[0].label).toBe('Dashboard');
    expect(result[1].label).toBe('Settings');
  });

  it('should skip routes without breadcrumb data in chain', () => {
    const route = {
      snapshot: {
        data: { breadcrumb: 'Child' },
        url: [{ path: 'child', parameters: {} }],
      },
      parent: {
        snapshot: { data: {}, url: [{ path: 'middle', parameters: {} }] },
        parent: {
          snapshot: {
            data: { breadcrumb: 'Parent' },
            url: [{ path: '', parameters: {} }],
          },
          parent: null,
        },
      },
    } as any;

    const result = helixBreadcrumbsFromRoutes(route);
    expect(result.length).toBe(2);
    expect(result[0].label).toBe('Parent');
    expect(result[1].label).toBe('Child');
  });
});
