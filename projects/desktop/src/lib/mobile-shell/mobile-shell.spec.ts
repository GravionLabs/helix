import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HX_BOTTOM_BAR_MAX_ITEMS, type HxBottomBarItem } from './bottom-bar';
import { HxMobileShell } from './mobile-shell';

const item = (id: string, extra: Partial<HxBottomBarItem> = {}): HxBottomBarItem => ({
  id,
  label: id,
  icon: `pi pi-${id}`,
  position: 'top',
  ...extra,
});

@Component({
  imports: [HxMobileShell],
  template: `
    <hx-mobile-shell #shell [items]="items()" [(activeId)]="activeId" [(drawerOpen)]="open" heading="Helix">
      <nav slot="drawer"><button id="pick" type="button" (click)="shell.chooseView('search')">Search</button></nav>
      <p id="content">Content</p>
    </hx-mobile-shell>
  `,
})
class Host {
  readonly items = signal<HxBottomBarItem[]>([
    item('files', { badge: 2 }),
    item('search'),
    item('sync', { kind: 'action', badge: true }),
  ]);
  readonly activeId = signal<string | null>('files');
  readonly open = signal(false);
}

describe('HxMobileShell', () => {
  const setup = () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const settle = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    };
    return { fixture, root, host: fixture.componentInstance, settle };
  };
  const bar = (root: HTMLElement) => [
    ...root.querySelectorAll<HTMLButtonElement>('.hx-bottom-bar-item'),
  ];

  afterEach(() => {
    TestBed.resetTestingModule();
    document.querySelectorAll('.cdk-overlay-container').forEach((e) => {
      e.replaceChildren();
    });
  });

  it('renders content, the bottom bar and no status bar or tooltips', () => {
    const { root } = setup();
    expect(root.querySelector('#content')?.textContent).toBe('Content');
    expect(bar(root).map((b) => b.dataset['id'])).toEqual(['files', 'search', 'sync']);
    expect(root.querySelector('hx-status-bar, .hx-status-bar')).toBeNull();
    expect(root.querySelectorAll('[title]').length).toBe(0);
  });

  it('shows at most five items', () => {
    const { fixture, host, root } = setup();
    host.items.set(['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((id) => item(id)));
    fixture.detectChanges();
    expect(bar(root).length).toBe(HX_BOTTOM_BAR_MAX_ITEMS);
  });

  it('marks the active view and sets it on tap; an action leaves it unchanged', () => {
    const { fixture, host, root } = setup();
    const [files, search, sync] = bar(root);
    expect(files?.getAttribute('aria-pressed')).toBe('true');
    expect(sync?.getAttribute('aria-pressed')).toBeNull();
    search?.click();
    fixture.detectChanges();
    expect(host.activeId()).toBe('search');
    expect(bar(root)[1]?.getAttribute('aria-pressed')).toBe('true');
    sync?.click();
    expect(host.activeId()).toBe('search');
  });

  it('renders badges', () => {
    const { root } = setup();
    expect(root.querySelector('[data-id="files"] .hx-bottom-bar-badge')?.textContent).toBe('2');
    expect(root.querySelector('[data-id="sync"] .hx-bottom-bar-badge-dot')).not.toBeNull();
  });

  it('opens the drawer with the menu button', async () => {
    const { host, root, settle } = setup();
    root.querySelector<HTMLButtonElement>('.hx-mobile-shell-menu')?.click();
    await settle();
    expect(host.open()).toBe(true);
    expect(document.querySelector('.hx-mobile-shell-drawer')).not.toBeNull();
    expect(document.querySelector('#pick')).not.toBeNull();
  });

  it('closes the drawer on a tap outside', async () => {
    const { host, settle } = setup();
    host.open.set(true);
    await settle();
    document.querySelector<HTMLElement>('.cdk-overlay-backdrop')?.click();
    await settle();
    expect(host.open()).toBe(false);
  });

  it('closes the drawer on a swipe toward its edge, not on a swipe the other way', async () => {
    const { host, settle } = setup();
    host.open.set(true);
    await settle();
    const body = document.querySelector('.hx-mobile-shell-drawer-body') as HTMLElement;
    const touch = (type: string, x: number) =>
      body.dispatchEvent(
        Object.assign(new Event(type, { bubbles: true }), { changedTouches: [{ clientX: x }] }),
      );
    touch('touchstart', 100);
    touch('touchend', 160);
    await settle();
    expect(host.open()).toBe(true);
    touch('touchstart', 160);
    touch('touchend', 100);
    await settle();
    expect(host.open()).toBe(false);
  });

  it('closes the drawer after a view was chosen, in the drawer or the bottom bar', async () => {
    const { host, root, settle } = setup();
    host.open.set(true);
    await settle();
    document.querySelector<HTMLButtonElement>('#pick')?.click();
    await settle();
    expect(host.activeId()).toBe('search');
    expect(host.open()).toBe(false);
    host.open.set(true);
    await settle();
    bar(root)[0]?.click();
    await settle();
    expect(host.activeId()).toBe('files');
    expect(host.open()).toBe(false);
  });
});
