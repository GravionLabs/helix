import { helixNavGroupsFromMenu } from './nav-rail.model';

describe('helixNavGroupsFromMenu', () => {
  it('maps a top-level item with children to a labeled group', () => {
    const result = helixNavGroupsFromMenu([
      {
        label: 'Overview',
        items: [
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Analytics', path: '/analytics' },
        ],
      },
    ]);

    expect(result).toEqual([
      {
        section: 'Overview',
        items: [
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Analytics', path: '/analytics' },
        ],
      },
    ]);
  });

  it('maps a top-level item with no children to a single-item unlabeled group', () => {
    const result = helixNavGroupsFromMenu([{ label: 'Documentation', path: '/documentation' }]);

    expect(result).toEqual([{ items: [{ label: 'Documentation', path: '/documentation' }] }]);
  });

  it('preserves group order across a mixed tree', () => {
    const result = helixNavGroupsFromMenu([
      { label: 'Overview', items: [{ label: 'Dashboard', path: '/dashboard' }] },
      { label: 'Documentation', path: '/documentation' },
    ]);

    expect(result.map((g) => g.section)).toEqual(['Overview', undefined]);
  });
});
