import { helixNavGroupsFromMenu } from './nav-rail.model';

const menu = [
  { label: 'Dashboard', path: '/dashboard' },
  {
    label: 'Components',
    icon: 'pi pi-th-large',
    items: [
      { label: 'Button', path: '/uikit/button' },
      { label: 'Auth', items: [{ label: 'Login', path: '/auth/login' }] },
    ],
  },
  { label: 'Docs', path: '/documentation' },
  { label: 'GitHub', path: '/github' },
  { label: 'Pages', items: [{ label: 'Landing', path: '/landing' }] },
];

describe('helixNavGroupsFromMenu', () => {
  describe("'sections' (default)", () => {
    it('turns top-level items with children into labeled sections', () => {
      const result = helixNavGroupsFromMenu(menu);

      expect(result.map((g) => g.section)).toEqual([undefined, 'Components', undefined, 'Pages']);
      expect(result[1].items).toBe(menu[1].items);
    });

    it('groups consecutive plain links into one unlabeled group, preserving order', () => {
      const result = helixNavGroupsFromMenu(menu);

      expect(result[0].items.map((i) => i.label)).toEqual(['Dashboard']);
      expect(result[2].items.map((i) => i.label)).toEqual(['Docs', 'GitHub']);
    });

    it('keeps deeper levels intact so they expand inline', () => {
      const result = helixNavGroupsFromMenu(menu);

      expect(result[1].items[1]).toEqual({
        label: 'Auth',
        items: [{ label: 'Login', path: '/auth/login' }],
      });
    });

    it('returns no groups for an empty menu', () => {
      expect(helixNavGroupsFromMenu([])).toEqual([]);
    });
  });

  describe("'tree'", () => {
    it('wraps the whole menu as a single unlabeled group', () => {
      expect(helixNavGroupsFromMenu(menu, 'tree')).toEqual([{ items: menu }]);
    });
  });
});
