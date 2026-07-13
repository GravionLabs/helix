import { TestBed } from '@angular/core/testing';
import type { HelixBreadcrumb } from './breadcrumb.model';
import { HELIX_BREADCRUMB } from './breadcrumb.model';

describe('HelixBreadcrumb', () => {
  it('should be a valid type with label and optional route', () => {
    const crumb: HelixBreadcrumb = { label: 'Home', route: '/' };
    expect(crumb.label).toBe('Home');
    expect(crumb.route).toBe('/');
  });

  it('should work without a route', () => {
    const crumb: HelixBreadcrumb = { label: 'Current Page' };
    expect(crumb.label).toBe('Current Page');
    expect(crumb.route).toBeUndefined();
  });
});

describe('HELIX_BREADCRUMB', () => {
  it('should default to an empty array', () => {
    const breadcrumbs = TestBed.inject(HELIX_BREADCRUMB);
    expect(breadcrumbs).toEqual([]);
  });

  it('should return provided value when configured', () => {
    const provided: HelixBreadcrumb[] = [{ label: 'Home', route: '/' }];
    TestBed.configureTestingModule({
      providers: [{ provide: HELIX_BREADCRUMB, useValue: provided }],
    });
    const breadcrumbs = TestBed.inject(HELIX_BREADCRUMB);
    expect(breadcrumbs).toEqual(provided);
  });
});
