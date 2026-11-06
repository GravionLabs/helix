import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxTabBar, type HxTabBarItem, type HxTabBarMenuItem } from './tab-bar';

@Component({
  imports: [HxTabBar],
  template: `
    <hx-tab-bar
      id="a"
      groupId="left"
      ariaLabel="Editors"
      allTabsButton
      [tabs]="left()"
      [(value)]="active"
      [menu]="menu"
      (closed)="log.push('closed:' + $event)"
      (pinned)="log.push('pinned:' + $event)"
      (moved)="log.push('moved:' + $event.from + '>' + $event.to)"
      (received)="log.push('received:' + $event.from + ':' + $event.id + '@' + $event.index)"
      (menuAction)="log.push('menu:' + $event.id + ':' + $event.action)"
    >
      <ng-template #tabContent let-tab><span class="badge">{{ tab.id }}</span></ng-template>
      <button type="button" class="extra">+</button>
    </hx-tab-bar>
    <hx-tab-bar
      id="b"
      groupId="right"
      [tabs]="right()"
      (received)="log.push('b-received:' + $event.from + ':' + $event.id + '@' + $event.index)"
    />
    <hx-tab-bar id="plain" [tabs]="left()" />
  `,
})
class Host {
  log: string[] = [];
  active = signal<string | null>('b');
  left = signal<HxTabBarItem[]>([
    { id: 'a', label: 'alpha' },
    { id: 'b', label: 'beta', group: 'ws', title: 'Beta tab' },
    { id: 'c', label: 'gamma', preview: true },
    { id: 'd', label: 'delta', attention: true },
    { id: 'e', label: 'epsilon', unread: true },
  ]);
  right = signal<HxTabBarItem[]>([{ id: 'x', label: 'xi' }]);
  menu: HxTabBarMenuItem[] = [
    { action: 'close', label: 'Close', shortcut: 'Ctrl+W' },
    { action: 'only-c', label: 'Only gamma', appliesTo: (id) => id === 'c' },
    { action: 'off', label: 'Disabled', disabled: true },
  ];
}

describe('HxTabBar', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const bar = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const tabs = (id = 'a') => [...bar(id).querySelectorAll<HTMLElement>('[role=tab]')];
  const scroller = (id = 'a') => bar(id).querySelector('.hx-tab-scroller') as HTMLElement;
  const navButtons = (id = 'a') => [...bar(id).querySelectorAll<HTMLElement>('.hx-tab-nav')];
  const allButton = (id = 'a') => bar(id).querySelector('.hx-tab-bar-all') as HTMLElement | null;
  const menuItems = () => [
    ...document.querySelectorAll<HTMLElement>('.cdk-overlay-container [role=menuitem]'),
  ];
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
  };
  const key = (target: HTMLElement, key: string, init: KeyboardEventInit = {}) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(event);
    return event;
  };
  const drag = (target: HTMLElement, type: string) => {
    const event = new Event(type, { bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    return event;
  };
  /** Makes the strip of bar `id` overflow (or not) and lets the bar notice. */
  const overflow = async (width: number, id = 'a') => {
    const el = scroller(id);
    Object.defineProperty(el, 'scrollWidth', { configurable: true, value: width });
    Object.defineProperty(el, 'clientWidth', { configurable: true, value: 300 });
    el.dispatchEvent(new Event('scroll'));
    await settle();
  };
  const place = (el: HTMLElement, left: number, right: number) =>
    (el.getBoundingClientRect = () => ({ left, right, top: 0, bottom: 30 }) as DOMRect);

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((c) => {
      c.innerHTML = '';
    });
  });

  describe('markup and accessibility', () => {
    it('has a named tablist of tabs, without panels', () => {
      const list = bar('a').querySelector('[role=tablist]') as HTMLElement;
      expect(list.getAttribute('aria-label')).toBe('Editors');
      expect(list.getAttribute('aria-orientation')).toBe('horizontal');
      expect(tabs().length).toBe(5);
      expect(bar('a').querySelector('[role=tabpanel]')).toBeNull();
    });

    it('marks the active tab selected, with a roving tabindex', async () => {
      expect(tabs().map((t) => t.getAttribute('aria-selected'))).toEqual([
        'false',
        'true',
        'false',
        'false',
        'false',
      ]);
      expect(tabs().map((t) => t.tabIndex)).toEqual([-1, 0, -1, -1, -1]);
      host.active.set(null);
      await settle();
      expect(tabs().map((t) => t.tabIndex)).toEqual([0, -1, -1, -1, -1]);
    });

    it('shows the group before the label, the tooltip, preview and unread marks and the tab content', () => {
      const [a, b, c, , e] = tabs();
      expect(b.querySelector('.hx-tab-bar-group')?.textContent?.trim()).toBe('ws /');
      expect(a.querySelector('.hx-tab-bar-group')).toBeNull();
      expect(b.title).toBe('Beta tab');
      expect(a.title).toBe('alpha');
      expect(tabs().map((t) => t.classList.contains('hx-tab-bar-tab-preview'))).toEqual([
        false,
        false,
        true,
        false,
        false,
      ]);
      expect(tabs().map((t) => t.querySelector('.hx-tab-bar-unread') !== null)).toEqual([
        false,
        false,
        false,
        false,
        true,
      ]);
      expect(c.querySelector('.badge')?.textContent).toBe('c');
      expect(e.querySelector('.badge')?.textContent).toBe('e');
      expect(bar('a').querySelector('.extra')).toBeTruthy();
    });

    it('rings a tab that needs attention and says so in its name', () => {
      expect(tabs().map((t) => t.classList.contains('hx-tab-bar-tab-attention'))).toEqual([
        false,
        false,
        false,
        true,
        false,
      ]);
      expect(tabs().map((t) => t.getAttribute('aria-label'))).toEqual([
        'alpha',
        'ws / beta',
        'gamma',
        'delta, needs attention',
        'epsilon',
      ]);
    });

    it('names the close button with the group so equal labels differ', async () => {
      host.left.set([
        { id: '1', label: 'terminal', group: 'alpha' },
        { id: '2', label: 'terminal', group: 'beta' },
        { id: '3', label: 'solo' },
      ]);
      await settle();
      expect(
        [...bar('a').querySelectorAll('.hx-tab-bar-close')].map((b) =>
          b.getAttribute('aria-label'),
        ),
      ).toEqual(['Close alpha / terminal', 'Close beta / terminal', 'Close solo']);
    });
  });

  describe('selecting and closing', () => {
    it('selects by click and writes the value', async () => {
      tabs()[3].click();
      await settle();
      expect(host.active()).toBe('d');
      expect(tabs()[3].getAttribute('aria-selected')).toBe('true');
    });

    it('reports a double click as pinned', () => {
      tabs()[2].dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      expect(host.log).toEqual(['pinned:c']);
    });

    it('closes with the close button without selecting the tab', () => {
      (tabs()[0].querySelector('.hx-tab-bar-close') as HTMLElement).click();
      expect(host.log).toEqual(['closed:a']);
      expect(host.active()).toBe('b');
    });

    it('closes with the middle button only', () => {
      tabs()[4].dispatchEvent(new MouseEvent('auxclick', { button: 2, bubbles: true }));
      expect(host.log).toEqual([]);
      tabs()[4].dispatchEvent(new MouseEvent('auxclick', { button: 1, bubbles: true }));
      expect(host.log).toEqual(['closed:e']);
    });
  });

  describe('keyboard', () => {
    it('moves with the arrows, wrapping, and with Home and End, selecting the tab it reaches', async () => {
      tabs()[1].focus();
      key(tabs()[1], 'ArrowRight');
      await settle();
      expect(host.active()).toBe('c');
      expect(document.activeElement).toBe(tabs()[2]);
      key(tabs()[2], 'End');
      await settle();
      expect(host.active()).toBe('e');
      key(tabs()[4], 'ArrowRight');
      await settle();
      expect(host.active()).toBe('a');
      key(tabs()[0], 'ArrowLeft');
      await settle();
      expect(host.active()).toBe('e');
      key(tabs()[4], 'Home');
      await settle();
      expect(host.active()).toBe('a');
      expect(document.activeElement).toBe(tabs()[0]);
    });

    it('selects with Enter and Space', async () => {
      key(tabs()[3], 'Enter');
      await settle();
      expect(host.active()).toBe('d');
      key(tabs()[0], ' ');
      await settle();
      expect(host.active()).toBe('a');
    });

    it('closes the focused tab with Delete or Ctrl+W, and ignores a plain w', () => {
      expect(key(tabs()[2], 'Delete').defaultPrevented).toBe(true);
      expect(key(tabs()[3], 'w', { ctrlKey: true }).defaultPrevented).toBe(true);
      key(tabs()[4], 'w');
      expect(host.log).toEqual(['closed:c', 'closed:d']);
    });

    it('moves the focus to the neighbour of a tab closed with the keyboard', async () => {
      tabs()[2].focus();
      key(tabs()[2], 'Delete');
      host.left.set(host.left().filter((t) => t.id !== 'c'));
      await settle();
      expect(tabs().map((t) => t.getAttribute('aria-label'))).not.toContain('gamma');
      expect(document.activeElement).toBe(tabs()[2]);
      expect(tabs()[2].getAttribute('aria-label')).toBe('delta, needs attention');
    });

    it('does nothing for other keys', () => {
      expect(key(tabs()[0], 'x').defaultPrevented).toBe(false);
      expect(host.log).toEqual([]);
    });
  });

  describe('drag and drop', () => {
    it('moves a tab to the tab it is dropped on, forwards and backwards', async () => {
      drag(tabs()[0], 'dragstart');
      drag(tabs()[3], 'dragover');
      await settle();
      expect(tabs()[3].classList.contains('hx-tab-bar-drop-after')).toBe(true);
      drag(tabs()[3], 'drop');
      expect(host.log).toEqual(['moved:0>3']);
      drag(tabs()[4], 'dragstart');
      drag(tabs()[1], 'dragover');
      await settle();
      expect(tabs()[1].classList.contains('hx-tab-bar-drop-before')).toBe(true);
      drag(tabs()[1], 'drop');
      expect(host.log).toEqual(['moved:0>3', 'moved:4>1']);
    });

    it('reports nothing when dropped on itself or when nothing was dragged', () => {
      drag(tabs()[2], 'dragstart');
      drag(tabs()[2], 'drop');
      drag(tabs()[1], 'drop');
      expect(host.log).toEqual([]);
    });

    it('clears the drop marks when the drag ends', async () => {
      drag(tabs()[0], 'dragstart');
      drag(tabs()[2], 'dragover');
      await settle();
      expect(bar('a').querySelector('.hx-tab-bar-drop-after')).toBeTruthy();
      drag(tabs()[0], 'dragend');
      await settle();
      expect(bar('a').querySelector('.hx-tab-bar-drop-after')).toBeNull();
    });

    it('hands a tab from another bar over with its bar, id and position', async () => {
      drag(tabs('b')[0], 'dragstart');
      const over = drag(tabs()[2], 'dragover');
      expect(over.defaultPrevented).toBe(true);
      await settle();
      expect(tabs()[2].classList.contains('hx-tab-bar-drop-before')).toBe(true);
      drag(tabs()[2], 'drop');
      expect(host.log).toEqual(['received:right:x@2']);
    });

    it('drops a tab from another bar at the end on the free part of the strip', async () => {
      drag(tabs('b')[0], 'dragstart');
      const tablist = bar('a').querySelector('[role=tablist]') as HTMLElement;
      drag(tablist, 'dragover');
      await settle();
      expect(tablist.classList.contains('hx-tab-bar-drop-end')).toBe(true);
      drag(tablist, 'drop');
      expect(host.log).toEqual(['received:right:x@5']);
    });

    it('works while the strip is scrolled', async () => {
      await overflow(1200);
      scroller().scrollLeft = 400;
      drag(tabs()[1], 'dragstart');
      drag(tabs()[4], 'dragover');
      drag(tabs()[4], 'drop');
      expect(host.log).toEqual(['moved:1>4']);
    });
  });

  describe('context menu', () => {
    const rightClick = async (index: number) => {
      const event = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 30,
        clientY: 20,
      });
      tabs()[index].dispatchEvent(event);
      await settle();
      return event;
    };

    it('opens an hx-menu with the entries that apply to the tab', async () => {
      const event = await rightClick(0);
      expect(event.defaultPrevented).toBe(true);
      expect(
        document.querySelector('.hx-menu-overlay [role=menu]')?.getAttribute('aria-label'),
      ).toBe('Tab actions');
      expect(menuItems().map((i) => i.textContent?.trim())).toEqual(['CloseCtrl+W', 'Disabled']);
      await rightClick(2); // the open menu closes first
      expect(menuItems().map((i) => i.textContent?.trim())).toEqual([
        'CloseCtrl+W',
        'Only gamma',
        'Disabled',
      ]);
    });

    it('stays open through the mouse release of the right click that opened it', async () => {
      await rightClick(3);
      // the browser fires auxclick (button 2) on the tab after the contextmenu event
      tabs()[3].dispatchEvent(new MouseEvent('auxclick', { bubbles: true, button: 2 }));
      await settle();
      expect(menuItems().length).toBe(2);
      menuItems()[0].click();
      await settle();
      expect(host.log).toEqual(['menu:d:close']);
      expect(menuItems()).toEqual([]);
    });

    it('closes on a click outside and on Escape', async () => {
      await rightClick(3);
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await settle();
      expect(menuItems()).toEqual([]);
      await rightClick(3);
      menuItems()[0].dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      );
      await settle();
      expect(menuItems()).toEqual([]);
      expect(host.log).toEqual([]);
    });

    it('runs the focused action with Enter from the keyboard', async () => {
      key(tabs()[3], 'ContextMenu');
      await settle();
      menuItems()[0].dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
      );
      menuItems()[0].click(); // Enter on a menu item button activates it
      await settle();
      expect(host.log).toEqual(['menu:d:close']);
      expect(menuItems()).toEqual([]);
    });

    it('reports the chosen action with the tab id and closes the menu', async () => {
      await rightClick(3);
      menuItems()[0].click();
      await settle();
      expect(host.log).toEqual(['menu:d:close']);
      expect(menuItems()).toEqual([]);
    });

    it('does not run a disabled entry', async () => {
      await rightClick(0);
      menuItems()[1].click();
      await settle();
      expect(host.log).toEqual([]);
    });

    it('opens from the keyboard with the Menu key and Shift+F10 and returns the focus on Escape', async () => {
      tabs()[1].focus();
      expect(key(tabs()[1], 'ContextMenu').defaultPrevented).toBe(true);
      await settle();
      await settle();
      expect(menuItems().length).toBe(2);
      expect(menuItems()[0].matches(':focus')).toBe(true);
      document
        .querySelector('.cdk-overlay-pane')
        ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await settle();
      expect(menuItems()).toEqual([]);
      expect(document.activeElement).toBe(tabs()[1]);
      key(tabs()[1], 'F10', { shiftKey: true });
      await settle();
      expect(menuItems().length).toBe(2);
    });

    it('leaves the browser menu alone without a menu', async () => {
      const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
      tabs('plain')[0].dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('overflow', () => {
    it('shows the scroll buttons and the all tabs button only while the strip overflows', async () => {
      expect(navButtons()).toEqual([]);
      expect(allButton()).toBeNull();
      await overflow(1200);
      expect(navButtons().map((b) => b.getAttribute('aria-label'))).toEqual([
        'Scroll tabs left',
        'Scroll tabs right',
      ]);
      expect(allButton()).toBeTruthy();
      await overflow(200);
      expect(navButtons()).toEqual([]);
      expect(allButton()).toBeNull();
    });

    it('offers the all tabs button only when asked for', async () => {
      await overflow(1200, 'b');
      expect(navButtons('b').length).toBe(2);
      expect(allButton('b')).toBeNull();
    });

    it('scrolls by a share of the strip width with the buttons', async () => {
      await overflow(1200);
      const scrollBy = vi.fn();
      scroller().scrollBy = scrollBy;
      navButtons()[1].click();
      navButtons()[0].click();
      expect(scrollBy.mock.calls.map(([o]) => o.left)).toEqual([180, -180]);
    });

    it('scrolls sideways with the vertical wheel while it overflows', async () => {
      const wheel = (init: WheelEventInit) => {
        const event = new WheelEvent('wheel', { bubbles: true, cancelable: true, ...init });
        scroller().dispatchEvent(event);
        return event;
      };
      expect(wheel({ deltaY: 100 }).defaultPrevented).toBe(false); // nothing to scroll
      await overflow(1200);
      const down = wheel({ deltaY: 100 });
      expect(down.defaultPrevented).toBe(true);
      expect(scroller().scrollLeft).toBe(100);
      wheel({ deltaY: -40 });
      expect(scroller().scrollLeft).toBe(60);
      expect(wheel({ deltaX: 50, deltaY: 5 }).defaultPrevented).toBe(false);
      expect(scroller().scrollLeft).toBe(60);
    });

    it('lists every tab with its attention mark and activates the chosen one', async () => {
      await overflow(1200);
      (allButton() as HTMLElement).click();
      await settle();
      expect(menuItems().map((i) => i.textContent?.trim())).toEqual([
        'alpha',
        'ws / beta',
        'gamma',
        'delta!',
        'epsilon',
      ]);
      expect(menuItems()[3].getAttribute('aria-label')).toBe('delta, needs attention');
      menuItems()[4].click();
      await settle();
      expect(host.active()).toBe('e');
      expect(menuItems()).toEqual([]);
    });

    it('scrolls the active tab into view when it changes', async () => {
      await overflow(1200);
      scroller().getBoundingClientRect = () => ({ left: 0, right: 300 }) as DOMRect;
      place(tabs()[4], 520, 620);
      host.active.set('e');
      await settle();
      expect(scroller().scrollLeft).toBe(320);
      place(tabs()[0], -150, -50);
      host.active.set('a');
      await settle();
      expect(scroller().scrollLeft).toBe(170);
    });

    it('leaves the strip alone when the active tab is already visible', async () => {
      await overflow(1200);
      scroller().getBoundingClientRect = () => ({ left: 0, right: 300 }) as DOMRect;
      place(tabs()[2], 100, 200);
      host.active.set('c');
      await settle();
      expect(scroller().scrollLeft).toBe(0);
    });
  });
});
