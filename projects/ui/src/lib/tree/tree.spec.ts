import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HxTree,
  type HxTreeNode,
  HxTreeNodeTemplate,
  type HxTreeSelection,
  type HxTreeSelectionMode,
} from './tree';

const nodes = (): HxTreeNode[] => [
  {
    key: 'docs',
    label: 'Documents',
    icon: 'pi pi-folder',
    expanded: true,
    children: [
      { key: 'work', label: 'Work', children: [{ key: 'report', label: 'Report.pdf' }] },
      {
        key: 'home',
        label: 'Home',
        children: [
          { key: 'tax', label: 'Taxes.xlsx' },
          { key: 'pic', label: 'Picture.png' },
        ],
      },
    ],
  },
  { key: 'music', label: 'Music', children: [{ key: 'song', label: 'Song.mp3' }] },
  { key: 'lazy', label: 'Lazy', leaf: false },
  { key: 'readme', label: 'Readme.md', disabled: true },
];

@Component({
  imports: [HxTree, HxTreeNodeTemplate],
  template: `
    <hx-tree
      id="t"
      ariaLabel="Files"
      [value]="value()"
      [selectionMode]="mode()"
      [(selection)]="selection"
      [filter]="filter()"
      [filterMode]="filterMode()"
      (nodeExpand)="expanded.push($event.node.key)"
      (nodeCollapse)="collapsed.push($event.node.key)"
    />
    <hx-tree id="custom" [value]="value()">
      <ng-template hxTreeNode let-node let-level="level"><b class="custom">{{ level }}-{{ node.label }}</b></ng-template>
    </hx-tree>
  `,
})
class Host {
  value = signal(nodes());
  mode = signal<HxTreeSelectionMode>('single');
  selection = signal<HxTreeSelection>(null);
  filter = signal(false);
  filterMode = signal<'lenient' | 'strict'>('lenient');
  expanded: string[] = [];
  collapsed: string[] = [];
}

describe('HxTree', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const root = () => fixture.nativeElement as HTMLElement;
  const item = (key: string, tree = 't') =>
    root().querySelector<HTMLElement>(`#${tree} [role=treeitem][data-key="${key}"]`);
  const keys = (tree = 't') =>
    [...root().querySelectorAll<HTMLElement>(`#${tree} [role=treeitem]`)].map((e) =>
      e.getAttribute('data-key'),
    );
  const toggle = (key: string) =>
    item(key)?.querySelector<HTMLElement>('.hx-tree-node-toggle')?.click();
  const row = (key: string) =>
    item(key)?.querySelector(':scope > .hx-tree-node-content') as HTMLElement;
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const press = (key: string, target: HTMLElement | null) =>
    target?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  it('is a named tree of treeitems with level, size and position; nodes start collapsed except expanded ones', () => {
    expect(root().querySelector('#t [role=tree]')?.getAttribute('aria-label')).toBe('Files');
    expect(keys()).toEqual(['docs', 'work', 'home', 'music', 'lazy', 'readme']);
    expect(item('docs')?.getAttribute('aria-level')).toBe('1');
    expect(item('work')?.getAttribute('aria-level')).toBe('2');
    expect(item('work')?.getAttribute('aria-setsize')).toBe('2');
    expect(item('home')?.getAttribute('aria-posinset')).toBe('2');
    expect(item('docs')?.querySelector(':scope > [role=group]')).toBeTruthy();
    expect(item('docs')?.getAttribute('aria-expanded')).toBe('true');
    expect(item('music')?.getAttribute('aria-expanded')).toBe('false');
    expect(item('readme')?.hasAttribute('aria-expanded')).toBe(false);
  });

  it('expands and collapses from the toggle and reports it', async () => {
    toggle('music');
    await settle();
    expect(keys()).toContain('song');
    expect(host.expanded).toEqual(['music']);
    toggle('music');
    await settle();
    expect(keys()).not.toContain('song');
    expect(host.collapsed).toEqual(['music']);
  });

  it('a lazy node (leaf: false) has a toggle and reports the expansion; the app then supplies children', async () => {
    toggle('lazy');
    await settle();
    expect(host.expanded).toEqual(['lazy']);
    host.value.set(
      nodes().map((n) =>
        n.key === 'lazy' ? { ...n, children: [{ key: 'late', label: 'Late' }] } : n,
      ),
    );
    await settle();
    expect(keys()).toContain('late');
  });

  it('shows a spinner instead of the toggle while a node is loading', async () => {
    host.value.set(nodes().map((n) => (n.key === 'lazy' ? { ...n, loading: true } : n)));
    await settle();
    expect(item('lazy')?.querySelector('.hx-tree-loading-icon')).toBeTruthy();
  });

  it('single selection: click selects, aria-selected follows, ctrl-click deselects, disabled does nothing', async () => {
    row('work').click();
    await settle();
    expect(host.selection()).toBe('work');
    expect(item('work')?.getAttribute('aria-selected')).toBe('true');
    expect(item('home')?.getAttribute('aria-selected')).toBe('false');
    row('home').click();
    await settle();
    expect(host.selection()).toBe('home');
    row('home').dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }));
    await settle();
    expect(host.selection()).toBeNull();
    row('readme').click();
    await settle();
    expect(host.selection()).toBeNull();
  });

  it('multiple selection toggles keys and is multiselectable', async () => {
    host.mode.set('multiple');
    await settle();
    expect(root().querySelector('#t [role=tree]')?.getAttribute('aria-multiselectable')).toBe(
      'true',
    );
    row('work').click();
    row('home').click();
    await settle();
    expect(host.selection()).toEqual(['work', 'home']);
    row('work').click();
    await settle();
    expect(host.selection()).toEqual(['home']);
  });

  it('no selection mode has no aria-selected and does not select', async () => {
    host.mode.set('none');
    await settle();
    row('work').click();
    await settle();
    expect(host.selection()).toBeNull();
    expect(item('work')?.hasAttribute('aria-selected')).toBe(false);
  });

  it('checkbox mode: checking a parent checks its subtree, parents are mixed or checked from their children', async () => {
    host.mode.set('checkbox');
    await settle();
    row('home').click();
    await settle();
    expect(new Set(host.selection() as string[])).toEqual(new Set(['home', 'tax', 'pic']));
    expect(item('home')?.getAttribute('aria-checked')).toBe('true');
    expect(item('docs')?.getAttribute('aria-checked')).toBe('mixed');
    expect(item('work')?.getAttribute('aria-checked')).toBe('false');
    row('work').click(); // checks Work and Report.pdf: Documents is now complete
    await settle();
    expect(item('docs')?.getAttribute('aria-checked')).toBe('true');
    expect(new Set(host.selection() as string[])).toEqual(
      new Set(['docs', 'work', 'report', 'home', 'tax', 'pic']),
    );
    row('home').click(); // unchecking removes the subtree and the parent
    await settle();
    expect(new Set(host.selection() as string[])).toEqual(new Set(['work', 'report']));
    expect(item('docs')?.getAttribute('aria-checked')).toBe('mixed');
    const box = item('home')?.querySelector('input[type=checkbox]') as HTMLInputElement;
    expect(box.getAttribute('aria-hidden')).toBe('true');
    expect(box.indeterminate).toBe(false);
  });

  it('has one tab stop that follows the focus', async () => {
    const stops = () => [
      ...root().querySelectorAll<HTMLElement>('#t [role=treeitem][tabindex="0"]'),
    ];
    expect(stops().map((e) => e.getAttribute('data-key'))).toEqual(['docs']);
    item('home')?.focus();
    await settle();
    expect(stops().map((e) => e.getAttribute('data-key'))).toEqual(['home']);
  });

  it('Up, Down, Home and End move the focus', async () => {
    item('docs')?.focus();
    press('ArrowDown', item('docs'));
    expect(document.activeElement).toBe(item('work'));
    press('ArrowUp', item('work'));
    expect(document.activeElement).toBe(item('docs'));
    press('End', item('docs'));
    expect(document.activeElement).toBe(item('readme'));
    press('Home', item('readme'));
    expect(document.activeElement).toBe(item('docs'));
  });

  it('Right expands, then enters the first child; Left collapses, then goes to the parent', async () => {
    item('music')?.focus();
    press('ArrowRight', item('music'));
    await settle();
    expect(item('music')?.getAttribute('aria-expanded')).toBe('true');
    press('ArrowRight', item('music'));
    expect(document.activeElement).toBe(item('song'));
    press('ArrowLeft', item('song'));
    expect(document.activeElement).toBe(item('music'));
    press('ArrowLeft', item('music'));
    await settle();
    expect(item('music')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('Enter and Space select the focused node', async () => {
    item('work')?.focus();
    press('Enter', item('work'));
    await settle();
    expect(host.selection()).toBe('work');
    host.mode.set('multiple');
    await settle();
    press(' ', item('home'));
    await settle();
    expect(host.selection()).toEqual(['work', 'home']);
  });

  it('typing jumps to the next label that starts with it', async () => {
    item('docs')?.focus();
    press('m', item('docs'));
    expect(document.activeElement).toBe(item('music'));
    await new Promise((resolve) => setTimeout(resolve, 520));
    press('h', document.activeElement as HTMLElement);
    expect(document.activeElement).toBe(item('home'));
  });

  it('filters lenient (matching node keeps its children) and strict (only matches and ancestors)', async () => {
    host.filter.set(true);
    await settle();
    const input = root().querySelector('#t input[type=search]') as HTMLInputElement;
    expect(input.getAttribute('aria-label')).toBe('Filter');
    input.value = 'home';
    input.dispatchEvent(new Event('input'));
    await settle();
    expect(keys()).toEqual(['docs', 'home', 'tax', 'pic']);
    host.filterMode.set('strict');
    await settle();
    expect(keys()).toEqual(['docs', 'home']);
    input.value = 'tax';
    input.dispatchEvent(new Event('input'));
    await settle();
    expect(keys()).toEqual(['docs', 'home', 'tax']); // ancestors are opened to show the match
    input.value = 'zzz';
    input.dispatchEvent(new Event('input'));
    await settle();
    expect(keys()).toEqual([]);
    expect(root().querySelector('#t [role=status]')?.textContent).toBe('No results found');
  });

  it('renders the node template with the node and level, instead of the label', () => {
    expect([...root().querySelectorAll('#custom .custom')].map((e) => e.textContent)).toEqual([
      '1-Documents',
      '2-Work',
      '2-Home',
      '1-Music',
      '1-Lazy',
      '1-Readme.md',
    ]);
    expect(root().querySelector('#custom .hx-tree-node-label')).toBeNull();
  });

  it('expandAll and collapseAll', async () => {
    const tree = fixture.debugElement.children[0].componentInstance as HxTree;
    tree.expandAll();
    await settle();
    expect(keys()).toEqual([
      'docs',
      'work',
      'report',
      'home',
      'tax',
      'pic',
      'music',
      'song',
      'lazy',
      'readme',
    ]);
    tree.collapseAll();
    await settle();
    expect(keys()).toEqual(['docs', 'music', 'lazy', 'readme']);
  });
});
