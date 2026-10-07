export interface SidebarItem {
  text: string;
  link: string;
}

export interface SidebarGroup {
  text: string;
  collapsed?: boolean;
  items: SidebarItem[];
}

/**
 * One group per `## Heading` of `docs/components/README.md` ("Components (89)", "Directives (9)", …),
 * with the rows of its table (`| [Button](button.md) | … |`) as pages. A new component page is added in
 * one place: its row in that index.
 */
export function componentGroups(index: string): SidebarGroup[] {
  const groups: SidebarGroup[] = [];
  for (const line of index.split('\n')) {
    const heading = /^##\s+(.+?)(?:\s+\(\d+\))?\s*$/.exec(line);
    if (heading) {
      groups.push({ text: heading[1], collapsed: true, items: [] });
      continue;
    }
    const row = /^\|\s*\[([^\]]+)\]\(([^)#\s]+)\.md(?:#[^)\s]*)?\)\s*\|/.exec(line);
    if (row && groups.length)
      groups[groups.length - 1].items.push({ text: row[1], link: `/components/${row[2]}` });
  }
  return groups.filter((group) => group.items.length > 0);
}

/** The sidebar of the site: the guides, then the component pages in the order of the index. */
export function sidebarOf(componentIndex: string): SidebarGroup[] {
  return [
    {
      text: 'Guides',
      items: [
        { text: 'Overview', link: '/' },
        { text: 'Components', link: '/components/' },
        { text: 'Shell API', link: '/HELIX-SHELL' },
        { text: 'Helix UI', link: '/HELIX-UI' },
        { text: 'Theming', link: '/THEMING' },
        { text: 'Roadmap', link: '/ROADMAP' },
      ],
    },
    ...componentGroups(componentIndex),
  ];
}

/** The pages (`docs/components/<name>.md`) a sidebar links to, as file names without extension. */
export function componentPagesOf(groups: SidebarGroup[]): string[] {
  return groups.flatMap((group) =>
    group.items
      .filter((item) => item.link.startsWith('/components/') && item.link !== '/components/')
      .map((item) => item.link.slice('/components/'.length)),
  );
}
