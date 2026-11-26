import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink } from '@angular/router';
import { HxList, type HxListRole, HxListRow, type HxListRowCurrent } from './list';

const KEY_CODES = { ArrowDown: 40, ArrowUp: 38, Home: 36, End: 35, Tab: 9, a: 65 };

@Component({
  imports: [HxList, HxListRow, RouterLink],
  template: `
    <hx-list [role]="role()" aria-label="Branches">
      @for (name of names(); track name) {
        <button
          hx-list-row
          type="button"
          [disabled]="disabled().includes(name)"
          [hidden]="hidden().includes(name)"
          [selected]="selected() === name"
          [current]="current() === name"
          (click)="clicked.push(name)"
        >
          <span class="hx-list-row-label">{{ name }}</span>
        </button>
      }
      <a hx-list-row routerLink="/settings" [selected]="linkSelected()" [current]="linkCurrent()">
        settings
      </a>
      <input aria-label="filter" />
    </hx-list>
  `,
})
class Host {
  role = signal<HxListRole>('list');
  names = signal(['main', 'dev', 'docs']);
  disabled = signal<string[]>([]);
  hidden = signal<string[]>([]);
  selected = signal('');
  current = signal('');
  linkSelected = signal(false);
  linkCurrent = signal<HxListRowCurrent>(false);
  clicked: string[] = [];
}

@Component({
  imports: [HxList, HxListRow],
  template: `
    <hx-list data-test="outer">
      <button hx-list-row data-test="o1">o1</button>
      <hx-list data-test="inner">
        <button hx-list-row data-test="i1">i1</button>
        <button hx-list-row data-test="i2">i2</button>
      </hx-list>
      <button hx-list-row data-test="o2">o2</button>
    </hx-list>
    <button hx-list-row data-test="alone">alone</button>
    <a hx-list-row data-test="bare" href="#x" selected current>bare</a>
  `,
})
class Nested {}

describe('HxList', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  const el = () => fixture.nativeElement as HTMLElement;
  const list = () => el().querySelector('hx-list') as HTMLElement;
  const rows = () => [...el().querySelectorAll<HTMLElement>('[hx-list-row]')];
  const row = (name: string) => rows().find((r) => r.textContent!.trim() === name)!;
  const tabStops = () => rows().filter((r) => r.tabIndex === 0);
  const focused = () => document.activeElement?.textContent?.trim();

  function press(key: keyof typeof KEY_CODES, target = document.activeElement as HTMLElement) {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    // the CDK key manager reads `keyCode`, which jsdom does not derive from `key`
    Object.defineProperty(event, 'keyCode', { get: () => KEY_CODES[key] });
    target.dispatchEvent(event);
    return event;
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    document.body.appendChild(fixture.nativeElement);
    await fixture.whenStable();
  });

  afterEach(() => el().remove());

  describe('keyboard', () => {
    it('has one tab stop: the first row', () => {
      expect(tabStops()).toEqual([row('main')]);
      expect(rows().map((r) => r.tabIndex)).toEqual([0, -1, -1, -1]);
    });

    it('moves the focus and the tab stop with Arrow Down and Up, buttons and links alike', () => {
      row('main').focus();
      press('ArrowDown');
      expect(focused()).toBe('dev');
      press('ArrowDown');
      press('ArrowDown');
      expect(focused()).toBe('settings');
      expect(tabStops()).toEqual([row('settings')]);
      press('ArrowUp');
      expect(focused()).toBe('docs');
      expect(tabStops()).toEqual([row('docs')]);
    });

    it('does not wrap', () => {
      row('main').focus();
      press('ArrowUp');
      expect(focused()).toBe('main');
      row('settings').focus();
      press('ArrowDown');
      expect(focused()).toBe('settings');
    });

    it('jumps to the last and first row with End and Home', () => {
      row('dev').focus();
      expect(press('End').defaultPrevented).toBe(true);
      expect(focused()).toBe('settings');
      expect(press('Home').defaultPrevented).toBe(true);
      expect(focused()).toBe('main');
    });

    it('continues from a row focused by pointer', () => {
      row('docs').focus();
      press('ArrowUp');
      expect(focused()).toBe('dev');
    });

    it('leaves Tab to the browser and keeps the last focused row as the tab stop', () => {
      row('dev').focus();
      expect(press('Tab').defaultPrevented).toBe(false);
      expect(focused()).toBe('dev');
      row('dev').blur();
      expect(tabStops()).toEqual([row('dev')]);
    });

    it('ignores keys of other content in the list', () => {
      const field = el().querySelector('input')!;
      field.focus();
      expect(press('Home', field).defaultPrevented).toBe(false);
      expect(document.activeElement).toBe(field);
    });

    it('ignores letters (no typeahead)', () => {
      row('main').focus();
      press('a');
      expect(focused()).toBe('main');
    });

    it('skips disabled and hidden rows', async () => {
      host.disabled.set(['main']);
      host.hidden.set(['docs']);
      await fixture.whenStable();
      expect(tabStops()).toEqual([row('dev')]);
      row('dev').focus();
      press('ArrowDown');
      expect(focused()).toBe('settings');
      press('Home');
      expect(focused()).toBe('dev');
    });

    it('moves the tab stop when the focused row is disabled or removed', async () => {
      row('dev').focus();
      row('dev').blur();
      host.disabled.set(['dev']);
      await fixture.whenStable();
      expect(tabStops()).toEqual([row('main')]);
      host.disabled.set([]);
      row('docs').focus();
      host.names.set(['main', 'dev']);
      await fixture.whenStable();
      expect(tabStops()).toEqual([row('main')]);
    });

    it('takes over rows added later', async () => {
      host.names.set(['main', 'dev', 'docs', 'next']);
      await fixture.whenStable();
      expect(tabStops()).toHaveLength(1);
      row('docs').focus();
      press('ArrowDown');
      expect(focused()).toBe('next');
    });

    it('copes with no row left to focus', async () => {
      host.disabled.set(['main', 'dev', 'docs']);
      await fixture.whenStable();
      row('settings').setAttribute('aria-disabled', 'true');
      host.selected.set('main');
      await fixture.whenStable();
      expect(tabStops()).toEqual([]);
    });

    it('puts the tab stop on the selected row, and on the current row before it', async () => {
      host.selected.set('docs');
      await fixture.whenStable();
      expect(tabStops()).toEqual([row('docs')]);
      host.current.set('dev');
      await fixture.whenStable();
      expect(tabStops()).toEqual([row('dev')]);
    });

    it('keeps native activation', () => {
      row('dev').click();
      expect(host.clicked).toEqual(['dev']);
    });
  });

  describe('ARIA and states in a list', () => {
    it('is a named group of native buttons and links', () => {
      expect(list().getAttribute('role')).toBe('group');
      expect(list().getAttribute('aria-label')).toBe('Branches');
      expect(rows().map((r) => r.getAttribute('role'))).toEqual([null, null, null, null]);
      expect(row('settings').getAttribute('href')).toBe('/settings');
    });

    it('sets aria-pressed and the selected class on buttons', async () => {
      host.selected.set('dev');
      await fixture.whenStable();
      expect(row('dev').getAttribute('aria-pressed')).toBe('true');
      expect(row('main').getAttribute('aria-pressed')).toBe('false');
      expect(row('dev').hasAttribute('aria-selected')).toBe(false);
      expect(row('dev').classList).toContain('hx-list-row-selected');
      expect(row('main').classList).not.toContain('hx-list-row-selected');
    });

    it('sets aria-current and the current class', async () => {
      host.current.set('dev');
      host.linkCurrent.set('page');
      await fixture.whenStable();
      expect(row('dev').getAttribute('aria-current')).toBe('true');
      expect(row('settings').getAttribute('aria-current')).toBe('page');
      expect(row('settings').classList).toContain('hx-list-row-current');
      expect(row('main').hasAttribute('aria-current')).toBe(false);
      expect(row('main').classList).not.toContain('hx-list-row-current');
    });

    it('marks a selected link with aria-current, never aria-pressed', async () => {
      host.linkSelected.set(true);
      await fixture.whenStable();
      expect(row('settings').getAttribute('aria-current')).toBe('true');
      expect(row('settings').hasAttribute('aria-pressed')).toBe(false);
      expect(row('settings').classList).toContain('hx-list-row-selected');
      expect(row('settings').classList).not.toContain('hx-list-row-current');
    });
  });

  describe('ARIA in a listbox', () => {
    beforeEach(async () => {
      host.role.set('listbox');
      host.selected.set('dev');
      host.linkSelected.set(true);
      await fixture.whenStable();
    });

    it('is a listbox of options with aria-selected', () => {
      expect(list().getAttribute('role')).toBe('listbox');
      expect(rows().map((r) => r.getAttribute('role'))).toEqual(Array(4).fill('option'));
      expect(rows().map((r) => r.getAttribute('aria-selected'))).toEqual([
        'false',
        'true',
        'false',
        'true',
      ]);
      expect(rows().some((r) => r.hasAttribute('aria-pressed'))).toBe(false);
      expect(row('settings').hasAttribute('aria-current')).toBe(false);
    });
  });

  describe('without a binding, nested or without a list', () => {
    let nested: HTMLElement;
    const part = (id: string) => nested.querySelector<HTMLElement>(`[data-test="${id}"]`)!;

    beforeEach(async () => {
      const f = TestBed.createComponent(Nested);
      nested = f.nativeElement;
      document.body.appendChild(nested);
      await f.whenStable();
    });

    afterEach(() => nested.remove());

    it('leaves an unselected button a plain button', () => {
      expect(part('o1').hasAttribute('aria-pressed')).toBe(false);
      expect(part('o1').hasAttribute('aria-current')).toBe(false);
    });

    it('gives each list its own tab stop and rows', () => {
      expect(['o1', 'i1', 'i2', 'o2'].map((id) => part(id).tabIndex)).toEqual([0, 0, -1, -1]);
      part('o1').focus();
      press('ArrowDown');
      expect(document.activeElement).toBe(part('o2'));
      part('i1').focus();
      press('End');
      expect(document.activeElement).toBe(part('i2'));
    });

    it('leaves a row outside a list in the tab order', () => {
      expect(part('alone').tabIndex).toBe(0);
      expect(part('alone').hasAttribute('role')).toBe(false);
    });

    it('accepts bare selected and current attributes', () => {
      expect(part('bare').getAttribute('aria-current')).toBe('true');
      expect(part('bare').classList).toContain('hx-list-row-selected');
      expect(part('bare').classList).toContain('hx-list-row-current');
    });
  });
});
