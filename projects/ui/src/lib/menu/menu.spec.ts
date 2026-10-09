import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { HxMenuItem } from '../menu-item';
import { HxMenu } from './menu';

@Component({
  imports: [HxMenu],
  template: `
    <button id="trigger" type="button" aria-haspopup="menu" (click)="menu.toggle($event)">Actions</button>
    <hx-menu #menu popup ariaLabel="Actions" [model]="items()" (triggered)="triggered = triggered + 1" />
    <hx-menu id="inline" ariaLabel="Account" [model]="inlineItems" />
  `,
})
class Host {
  triggered = 0;
  log: string[] = [];
  items = signal<HxMenuItem[]>([
    { label: 'New', icon: 'pi pi-plus', command: () => this.log.push('new') },
    { label: 'Hidden', visible: false },
    { label: 'Disabled', disabled: true, command: () => this.log.push('disabled') },
    { separator: true },
    { label: 'Docs', url: 'https://example.com/docs', target: '_blank' },
    { label: 'Inbox', badge: '3', routerLink: '/inbox' },
    {
      label: 'More',
      items: [
        { label: 'Export', command: () => this.log.push('export') },
        { label: 'Deeper', items: [{ label: 'Deepest' }] },
      ],
    },
  ]);
  inlineItems: HxMenuItem[] = [
    { label: 'Profile', items: [{ label: 'Settings' }, { label: 'Sign out' }] },
    { label: 'Help', items: [{ label: 'Docs' }] },
  ];
}

describe('HxMenu', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const trigger = () => fixture.nativeElement.querySelector('#trigger') as HTMLButtonElement;
  const popupMenu = () =>
    document.querySelector('.hx-menu-overlay [role=menu]') as HTMLElement | null;
  // the items of the popup (and its submenus), not those of the inline menu
  const items = () => [
    ...document.querySelectorAll<HTMLElement>('.cdk-overlay-container [role=menuitem]'),
  ];
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
  };
  // the CDK reads `keyCode`
  const press = (keyCode: number, target: HTMLElement = document.activeElement as HTMLElement) =>
    target.dispatchEvent(new KeyboardEvent('keydown', { keyCode, bubbles: true }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((c) => {
      c.innerHTML = '';
    });
  });

  it('renders an inline menu with group headings, no overlay', () => {
    const inline = fixture.nativeElement.querySelector('#inline') as HTMLElement;
    expect(inline.querySelector('[role=menu]')?.getAttribute('aria-label')).toBe('Account');
    expect(
      [...inline.querySelectorAll('.hx-menu-heading')].map((h) => h.textContent?.trim()),
    ).toEqual(['Profile', 'Help']);
    expect(
      [...inline.querySelectorAll('[role=menuitem]')].map((i) => i.textContent?.trim()),
    ).toEqual(['Settings', 'Sign out', 'Docs']);
    expect(inline.querySelector('[role=group]')?.getAttribute('aria-label')).toBe('Profile');
  });

  it('opens a popup at the trigger with menuitems, separators, links and a badge; hidden items are left out', async () => {
    trigger().click();
    await settle();
    expect(popupMenu()?.getAttribute('aria-label')).toBe('Actions');
    expect(items().map((i) => i.textContent?.trim())).toEqual([
      'New',
      'Disabled',
      'Docs',
      'Inbox3',
      'Export',
      'Deeper',
    ]);
    expect(popupMenu()?.querySelector('[role=separator]')).toBeTruthy();
    const docs = items()[2] as HTMLAnchorElement;
    expect(docs.getAttribute('href')).toBe('https://example.com/docs');
    expect(docs.getAttribute('target')).toBe('_blank');
    expect(items()[1].getAttribute('aria-disabled')).toBe('true');
    expect(popupMenu()?.querySelector('.hx-menu-badge')?.textContent).toBe('3');
    expect(popupMenu()?.querySelector('.hx-menu-icon.pi-plus')).toBeTruthy();
  });

  it('moves the focus into the menu and arrows move between items', async () => {
    trigger().click();
    await settle();
    await settle();
    expect(document.activeElement).toBe(items()[0]);
    press(40); // ArrowDown
    await settle();
    expect(document.activeElement).not.toBe(items()[0]);
  });

  it('runs the command of an item, emits triggered, closes and returns the focus to the trigger', async () => {
    trigger().click();
    await settle();
    items()[0].click();
    await settle();
    expect(host.log).toEqual(['new']);
    expect(host.triggered).toBe(1);
    expect(popupMenu()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('reports an item of a submenu as triggered and closes the menu', async () => {
    trigger().click();
    await settle();
    const byText = (text: string) =>
      items().find((i) => i.textContent?.trim() === text) as HTMLElement;
    byText('Deeper').click();
    await settle();
    await settle();
    byText('Deepest').click();
    await settle();
    expect(host.triggered).toBe(1);
    expect(popupMenu()).toBeNull();
  });

  it('does not run the command of a disabled item', async () => {
    trigger().click();
    await settle();
    items()[1].click();
    await settle();
    expect(host.log).toEqual([]);
  });

  it('closes with Escape and returns the focus to the trigger', async () => {
    trigger().click();
    await settle();
    document
      .querySelector('.cdk-overlay-pane')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();
    expect(popupMenu()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('toggles: a second call closes the menu', async () => {
    trigger().click();
    await settle();
    expect(popupMenu()).toBeTruthy();
    trigger().click();
    await settle();
    expect(popupMenu()).toBeNull();
  });

  it('opens nested submenus from a submenu item below the first level', async () => {
    trigger().click();
    await settle();
    // 'More' is a group heading on the first level; 'Deeper' inside it has children and opens a submenu
    const deeper = items()[5];
    expect(deeper.getAttribute('aria-haspopup')).toBe('menu');
    deeper.click();
    await settle();
    expect(deeper.getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelectorAll('.cdk-overlay-container [role=menu]').length).toBe(2); // popup and submenu
    const deepest = items().find((i) => i.textContent?.trim() === 'Deepest') as HTMLElement;
    expect(deepest).toBeTruthy();
    expect(deepest.closest('.hx-menu-submenu')).toBeTruthy();
    const exported = items().find((i) => i.textContent?.trim() === 'Export') as HTMLElement;
    exported.click();
    await settle();
    expect(host.log).toEqual(['export']);
  });
});
