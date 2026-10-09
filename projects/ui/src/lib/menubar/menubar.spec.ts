import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { HxMenuItem } from '../menu-item';
import { HxMenubar } from './menubar';

@Component({
  imports: [HxMenubar],
  template: `
    <hx-menubar id="bar" ariaLabel="Main" [breakpoint]="breakpoint()" [model]="items" (triggered)="triggered = triggered + 1">
      <span hxMenubarStart id="start">Logo</span>
      <span hxMenubarEnd id="end">End</span>
    </hx-menubar>
  `,
})
class Host {
  triggered = 0;
  log: string[] = [];
  breakpoint = signal(960);
  items: HxMenuItem[] = [
    { label: 'Home', command: () => this.log.push('home') },
    { label: 'Hidden', visible: false },
    { label: 'Off', disabled: true, command: () => this.log.push('off') },
    { separator: true },
    { label: 'Docs', url: 'https://example.com/docs', target: '_blank' },
    { label: 'Inbox', routerLink: '/inbox' },
    {
      label: 'Products',
      items: [
        { label: 'Components', command: () => this.log.push('components') },
        { label: 'Pricing', items: [{ label: 'Free' }] },
      ],
    },
  ];
}

describe('HxMenubar', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  let narrow = false;
  const listeners = new Set<() => void>();
  const bar = () => fixture.nativeElement.querySelector('#bar') as HTMLElement;
  const topItems = () => [
    ...bar().querySelectorAll<HTMLElement>('[role=menubar] > [role=menuitem]'),
  ];
  const overlayItems = () => [
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
  const setNarrow = async (value: boolean) => {
    narrow = value;
    for (const l of listeners) l();
    await settle();
  };

  beforeEach(async () => {
    narrow = false;
    listeners.clear();
    vi.stubGlobal('matchMedia', () => ({
      get matches() {
        return narrow;
      },
      addEventListener: (_: string, l: () => void) => listeners.add(l),
      removeEventListener: (_: string, l: () => void) => listeners.delete(l),
    }));
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.querySelectorAll('.cdk-overlay-container').forEach((c) => {
      c.innerHTML = '';
    });
  });

  it('is a menubar with its name; hidden items are left out and a separator is drawn', () => {
    const list = bar().querySelector('[role=menubar]') as HTMLElement;
    expect(list.getAttribute('aria-label')).toBe('Main');
    expect(topItems().map((i) => i.textContent?.trim())).toEqual([
      'Home',
      'Off',
      'Docs',
      'Inbox',
      'Products',
    ]);
    expect(list.querySelector('[role=separator]')).toBeTruthy();
  });

  it('projects the start and end content', () => {
    expect(bar().querySelector('.hx-menubar-start #start')).toBeTruthy();
    expect(bar().querySelector('.hx-menubar-end #end')).toBeTruthy();
  });

  it('renders links and a disabled item', () => {
    const docs = topItems()[2] as HTMLAnchorElement;
    expect(docs.getAttribute('href')).toBe('https://example.com/docs');
    expect(docs.getAttribute('target')).toBe('_blank');
    expect(topItems()[1].getAttribute('aria-disabled')).toBe('true');
    expect(topItems()[3].getAttribute('href')).toBe('/inbox');
  });

  it('runs the command of an item and emits triggered, but not for a disabled one', async () => {
    topItems()[0].click();
    topItems()[1].click();
    await settle();
    expect(host.log).toEqual(['home']);
    expect(host.triggered).toBe(1);
  });

  it('opens a submenu with Down and runs a command from it', async () => {
    const products = topItems()[4];
    expect(products.getAttribute('aria-haspopup')).toBe('menu');
    products.focus();
    press(40); // ArrowDown
    await settle();
    await settle();
    expect(products.getAttribute('aria-expanded')).toBe('true');
    expect(overlayItems().map((i) => i.textContent?.trim())).toEqual(['Components', 'Pricing']);
    overlayItems()[0].click();
    await settle();
    expect(host.log).toEqual(['components']);
    expect(host.triggered).toBe(1);
  });

  it('moves between the top items with Left and Right', async () => {
    topItems()[0].focus();
    press(39); // ArrowRight: the key manager starts at the first item
    await settle();
    press(39);
    await settle();
    const second = document.activeElement;
    expect(second).not.toBe(topItems()[0]);
    expect(topItems()).toContain(second as HTMLElement);
    press(37); // ArrowLeft
    await settle();
    expect(document.activeElement).toBe(topItems()[0]);
  });

  it('collapses into a button below the breakpoint and opens the items as a menu', async () => {
    await setNarrow(true);
    expect(bar().querySelector('[role=menubar]')).toBeNull();
    expect(bar().classList).toContain('hx-menubar-collapsed');
    expect(bar().querySelector('#start')).toBeTruthy();
    const button = bar().querySelector('.hx-menubar-button') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Menu');
    button.click();
    await settle();
    await settle();
    expect(document.querySelector('.hx-menu-overlay [role=menu]')).toBeTruthy();
    expect(overlayItems().some((i) => i.textContent?.trim() === 'Home')).toBe(true);
    await setNarrow(false);
    expect(bar().querySelector('[role=menubar]')).toBeTruthy();
  });

  it('reads the breakpoint into the media query', async () => {
    const queries: string[] = [];
    vi.stubGlobal('matchMedia', (q: string) => {
      queries.push(q);
      return {
        matches: false,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      };
    });
    host.breakpoint.set(600);
    await settle();
    expect(queries.at(-1)).toBe('(max-width: 599.98px)');
  });
});
