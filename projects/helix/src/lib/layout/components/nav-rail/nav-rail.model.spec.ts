import { helixNavGroupsFromMenu } from './nav-rail.model';

describe('helixNavGroupsFromMenu', () => {
  it('wraps a flat menu as a single unlabeled group', () => {
    const result = helixNavGroupsFromMenu([
      { label: 'Overview', items: [{ label: 'Dashboard', path: '/dashboard' }] },
      { label: 'Documentation', path: '/documentation' },
    ]);

    expect(result).toEqual([
      {
        items: [
          { label: 'Overview', items: [{ label: 'Dashboard', path: '/dashboard' }] },
          { label: 'Documentation', path: '/documentation' },
        ],
      },
    ]);
  });

  it('preserves each top-level item identity, including its own children', () => {
    const result = helixNavGroupsFromMenu([
      {
        label: 'UI Components',
        icon: 'pi pi-th-large',
        items: [{ label: 'Button', path: '/uikit/button' }],
      },
    ]);

    expect(result[0].items[0]).toEqual({
      label: 'UI Components',
      icon: 'pi pi-th-large',
      items: [{ label: 'Button', path: '/uikit/button' }],
    });
  });

  it('preserves item order', () => {
    const result = helixNavGroupsFromMenu([
      { label: 'Overview', path: '/' },
      { label: 'Pages', path: '/pages' },
      { label: 'Get Started', path: '/documentation' },
    ]);

    expect(result[0].items.map((item) => item.label)).toEqual(['Overview', 'Pages', 'Get Started']);
  });
});
