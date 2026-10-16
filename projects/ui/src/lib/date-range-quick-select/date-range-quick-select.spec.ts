import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import type { HxDateRangeExpression } from '../internal/quick-select/quick-select';
import {
  HxDateRangeQuickSelect,
  type HxDateRangeQuickSelectValue,
} from './date-range-quick-select';

type Value = HxDateRangeQuickSelectValue;
const EMPTY: Value = { from: null, to: null };

@Component({
  imports: [HxDateRangeQuickSelect, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-date-range-quick-select
      id="quick"
      locale="en-US"
      ariaLabel="Time range"
      inputId="span"
      placeholder="Pick a range"
      recentStorageKey="hx-test-recent"
      [(value)]="quick"
      [(expression)]="quickExpr"
    />
    <hx-date-range-quick-select
      id="memory"
      locale="en-US"
      [recentStorageKey]="null"
      [(value)]="memory"
    />
    <hx-date-range-quick-select
      id="limits"
      locale="en-US"
      [recentStorageKey]="null"
      [minDate]="min"
      [maxDate]="max"
      [(value)]="limits"
      [(expression)]="limitsExpr"
    />
    <hx-date-range-quick-select
      id="custom"
      locale="en-US"
      [recentStorageKey]="null"
      [labels]="{ quickSelect: 'Schnellauswahl', apply: 'Anwenden', start: 'Beginn' }"
      [commonlyUsed]="[{ label: 'Heute', from: 'now/d', to: 'now/d' }]"
      [(value)]="custom"
    />
    <hx-date-range-quick-select
      id="none"
      locale="en-US"
      [recentStorageKey]="null"
      [commonlyUsed]="[]"
    />
    <hx-date-range-quick-select
      id="model"
      locale="en-US"
      [recentStorageKey]="null"
      [(ngModel)]="modelValue"
      [(expression)]="modelExpr"
    />
    <hx-date-range-quick-select
      id="reactive"
      locale="en-US"
      [recentStorageKey]="null"
      [formControl]="control"
      [(expression)]="reactiveExpr"
    />
    <hx-date-range-quick-select
      id="signal"
      locale="en-US"
      [recentStorageKey]="null"
      [formField]="f.span"
      [(expression)]="signalExpr"
    />
    <hx-date-range-quick-select
      id="off"
      locale="en-US"
      [disabled]="true"
      [(value)]="offValue"
      [(expression)]="offExpr"
    />
  `,
})
class Host {
  quick = signal<Value>(EMPTY);
  quickExpr = signal<HxDateRangeExpression | null>(null);
  memory = signal<Value>(EMPTY);
  min = new Date(2026, 9, 5, 8, 0);
  max = new Date(2026, 9, 28, 17, 0);
  limits = signal<Value>(EMPTY);
  limitsExpr = signal<HxDateRangeExpression | null>(null);
  custom = signal<Value>(EMPTY);
  modelValue = signal<Value>(EMPTY);
  modelExpr = signal<HxDateRangeExpression | null>(null);
  control = new FormControl<Value>(EMPTY);
  reactiveExpr = signal<HxDateRangeExpression | null>(null);
  state = signal<{ span: Value }>({ span: EMPTY });
  f = form(this.state);
  signalExpr = signal<HxDateRangeExpression | null>(null);
  offValue = signal<Value>(EMPTY);
  offExpr = signal<HxDateRangeExpression | null>({ from: 'now-15m', to: 'now' });
}

describe('HxDateRangeQuickSelect', () => {
  const NOW = new Date(2026, 9, 14, 15, 30, 20);
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const input = (id: string) => el(id).querySelector('input') as HTMLInputElement;
  const popup = () =>
    document.querySelector('.hx-date-range-quick-select-popup') as HTMLElement | null;
  const q = <T extends Element = HTMLElement>(selector: string) =>
    popup()!.querySelector(selector) as T;
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const click = async (target: HTMLElement) => {
    target.click();
    await settle();
  };
  const open = (id: string) =>
    click(el(id).querySelector<HTMLButtonElement>('.hx-date-picker-trigger')!);
  const press = async (target: HTMLElement, key: string, init: KeyboardEventInit = {}) => {
    target.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }),
    );
    await settle();
  };
  const fill = async (field: HTMLInputElement, text: string) => {
    field.value = text;
    field.dispatchEvent(new Event('input'));
    await settle();
  };
  const choose = async (selectClass: string, label: string) => {
    await click(q(`.${selectClass} .hx-select-trigger`));
    const opt = [...document.querySelectorAll<HTMLElement>('.hx-select-option')].find(
      (o) => o.textContent?.trim() === label,
    );
    if (!opt) throw new Error(`no option ${label}`);
    await click(opt);
  };
  const listed = (cls: string) =>
    [...popup()!.querySelectorAll(`.${cls} button`)].map((b) => b.textContent?.trim());
  const rangeButton = (cls: string, label: string) =>
    [...popup()!.querySelectorAll<HTMLElement>(`.${cls} button`)].find(
      (b) => b.textContent?.trim() === label,
    ) as HTMLElement;
  const common = (label: string) => click(rangeButton('hx-date-range-quick-select-common', label));
  const amount = () => q<HTMLInputElement>('.hx-date-range-quick-select-amount');
  const applyButton = () => q<HTMLButtonElement>('.hx-date-range-quick-select-apply');
  const applyQuick = () => click(applyButton());
  const error = () => popup()?.querySelector('.hx-date-range-quick-select-error') ?? null;
  const summary = (side: 'from' | 'to') =>
    q(`.hx-date-range-quick-select-side-line-${side}`).textContent?.replace(/\s+/g, ' ').trim();
  const pressEscape = () => press(popup()!, 'Escape');

  const scrollIntoView = Element.prototype.scrollIntoView;
  beforeEach(async () => {
    localStorage.clear();
    vi.useFakeTimers({ now: NOW, toFake: ['Date'] });
    // jsdom has no layout: the CDK listbox of the selects scrolls the active option into view
    Element.prototype.scrollIntoView = () => {};
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(() => {
    fixture.destroy();
    Element.prototype.scrollIntoView = scrollIntoView;
    vi.useRealTimers();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('is one read-only field with one button', () => {
    expect(el('quick').querySelectorAll('input').length).toBe(1);
    expect(el('quick').querySelectorAll('button').length).toBe(1);
    expect(input('quick').readOnly).toBe(true);
    expect(input('quick').id).toBe('span');
    expect(input('quick').placeholder).toBe('Pick a range');
    expect(input('quick').value).toBe('');
    expect(input('quick').getAttribute('aria-label')).toBe('Time range');
    expect(input('quick').getAttribute('aria-haspopup')).toBe('dialog');
  });

  describe('compact view', () => {
    it('shows only Quick select, Commonly used and the start and end summary', async () => {
      await open('quick');
      expect(
        [...popup()!.querySelectorAll('.hx-date-range-quick-select-caption')].map(
          (c) => c.textContent,
        ),
      ).toEqual(['Quick select', 'Commonly used']);
      expect(listed('hx-date-range-quick-select-common')).toEqual([
        'Today',
        'This week',
        'Last 15 minutes',
        'Last 30 minutes',
        'Last 1 hour',
        'Last 24 hours',
        'Last 7 days',
        'Last 30 days',
        'Last 90 days',
        'Last 1 year',
      ]);
      // nothing applied yet: no Recently used list, both sides not set
      expect(popup()!.querySelector('.hx-date-range-quick-select-recent')).toBeNull();
      expect(summary('from')).toBe('Start Not set');
      expect(summary('to')).toBe('End Not set');
      // no calendar, no tabs, no time pickers in the compact view
      expect(popup()!.querySelector('[role=tablist]')).toBeNull();
      expect(popup()!.querySelector('hx-date-picker, hx-time-picker')).toBeNull();
    });

    it('is a dialog named by ariaLabel with the summary as a named group', async () => {
      await open('quick');
      expect(popup()!.getAttribute('role')).toBe('dialog');
      expect(popup()!.getAttribute('aria-label')).toBe('Time range');
      expect(input('quick').getAttribute('aria-controls')).toBe(popup()!.id);
      expect(input('quick').getAttribute('aria-expanded')).toBe('true');
      const group = q('.hx-date-range-quick-select-summary');
      expect(group.getAttribute('role')).toBe('group');
      expect(group.getAttribute('aria-label')).toBe('Start and end');
      const section = q('.hx-date-range-quick-select-section');
      expect(document.getElementById(section.getAttribute('aria-labelledby')!)?.textContent).toBe(
        'Quick select',
      );
    });

    it('summarises the applied sides', async () => {
      await open('quick');
      await applyQuick();
      await open('quick');
      expect(summary('from')).toBe('Start ~ 15 minutes ago');
      expect(summary('to')).toBe('End now');
      await common('Today');
      await open('quick');
      expect(summary('from')).toBe('Start now, rounded to the day');
    });

    it('summarises an absolute value with its dates', async () => {
      host.quick.set({ from: new Date(2026, 9, 1, 8, 0), to: null });
      await settle();
      await open('quick');
      expect(summary('from')).toBe('Start 10/1/2026 08:00');
      expect(summary('to')).toBe('End Not set');
    });

    it('renders no Commonly used section for an empty list', async () => {
      await open('none');
      expect(popup()!.querySelector('.hx-date-range-quick-select-common')).toBeNull();
    });
  });

  describe('quick select', () => {
    it('applies Last 15 minutes against the current time and sets the expression', async () => {
      await open('quick');
      await applyQuick();
      expect(host.quick()).toEqual({ from: new Date(2026, 9, 14, 15, 15, 20), to: NOW });
      expect(host.quickExpr()).toEqual({ from: 'now-15m', to: 'now' });
      expect(popup()).toBeNull();
      expect(document.activeElement).toBe(input('quick'));
      expect(input('quick').value).toBe('Last 15 minutes');
    });

    it('applies Next N unit chosen with the selects and the amount', async () => {
      await open('quick');
      await choose('hx-date-range-quick-select-direction', 'Next');
      // the select list is its own overlay: choosing in it keeps the popup open
      expect(popup()).not.toBeNull();
      await fill(amount(), '2');
      await choose('hx-date-range-quick-select-unit', 'days');
      await applyQuick();
      expect(host.quick()).toEqual({ from: NOW, to: new Date(2026, 9, 16, 15, 30, 20) });
      expect(host.quickExpr()).toEqual({ from: 'now', to: 'now+2d' });
      expect(input('quick').value).toBe('Next 2 days');
    });

    it('resolves the expression when applied, not when the popup opened', async () => {
      await open('quick');
      vi.setSystemTime(new Date(2026, 9, 14, 16, 0, 0));
      await applyQuick();
      expect(host.quick().to).toEqual(new Date(2026, 9, 14, 16, 0, 0));
    });

    it('refuses an amount that is not a positive whole number with an inline error', async () => {
      await open('quick');
      for (const text of ['', '0', '-3', '1.5', '1e21', '9007199254740993', '9000000000000000']) {
        await fill(amount(), text);
        // a new attempt drops the message
        expect(error()).toBeNull();
        expect(applyButton().hasAttribute('aria-describedby')).toBe(false);
        await applyQuick();
        expect({ text, open: popup() !== null }).toEqual({ text, open: true });
        expect(error()?.getAttribute('role')).toBe('alert');
        expect(error()?.textContent?.trim()).toBe('Choose a start and an end that can be applied.');
        expect(applyButton().getAttribute('aria-describedby')).toBe(error()!.id);
        expect(amount().getAttribute('aria-describedby')).toBe(error()!.id);
        expect(amount().getAttribute('aria-invalid')).toBe('true');
      }
      expect(host.quick()).toEqual(EMPTY);
      expect(host.quickExpr()).toBeNull();
    });

    it('drops the message when the popup opens again', async () => {
      await open('quick');
      await fill(amount(), '0');
      await applyQuick();
      expect(error()).not.toBeNull();
      await pressEscape();
      await open('quick');
      expect(error()).toBeNull();
    });
  });

  describe('commonly used', () => {
    it('applies a commonly used range, rounding the end up', async () => {
      await open('quick');
      await common('Today');
      expect(host.quick()).toEqual({
        from: new Date(2026, 9, 14),
        to: new Date(2026, 9, 14, 23, 59, 59, 999),
      });
      expect(host.quickExpr()).toEqual({ from: 'now/d', to: 'now/d' });
      expect(input('quick').value).toBe('Today');
    });

    it('takes its own list and labels', async () => {
      await open('custom');
      expect(q('.hx-date-range-quick-select-caption').textContent).toBe('Schnellauswahl');
      expect(applyButton().textContent?.trim()).toBe('Anwenden');
      expect(summary('from')).toBe('Beginn Not set');
      expect(listed('hx-date-range-quick-select-common')).toEqual(['Heute']);
      await common('Heute');
      expect(host.custom()).toEqual({
        from: new Date(2026, 9, 14),
        to: new Date(2026, 9, 14, 23, 59, 59, 999),
      });
      expect(input('custom').value).toBe('Heute');
    });
  });

  describe('recently used', () => {
    it('lists recently used ranges, newest first, de-duplicated, at most five', async () => {
      for (const label of [
        'Today',
        'Last 1 hour',
        'Today',
        'Last 7 days',
        'Last 30 days',
        'Last 90 days',
        'Last 1 year',
      ]) {
        await open('quick');
        await common(label);
      }
      await open('quick');
      expect(listed('hx-date-range-quick-select-recent')).toEqual([
        'Last 1 year',
        'Last 90 days',
        'Last 30 days',
        'Last 7 days',
        'Today',
      ]);
      expect(JSON.parse(localStorage.getItem('hx-test-recent')!)).toEqual([
        { from: 'now-1y', to: 'now' },
        { from: 'now-90d', to: 'now' },
        { from: 'now-30d', to: 'now' },
        { from: 'now-7d', to: 'now' },
        { from: 'now/d', to: 'now/d' },
      ]);
    });

    it('reads the list from localStorage and applies a relative and an absolute entry', async () => {
      localStorage.setItem(
        'hx-test-recent',
        JSON.stringify([
          { from: 'now-45m', to: 'now' },
          {
            from: new Date(2026, 9, 1, 8, 0).toISOString(),
            to: new Date(2026, 9, 2, 8, 0).toISOString(),
          },
        ]),
      );
      await open('quick');
      expect(listed('hx-date-range-quick-select-recent')).toEqual([
        'Last 45 minutes',
        '10/1/2026 08:00 - 10/2/2026 08:00',
      ]);
      await click(rangeButton('hx-date-range-quick-select-recent', 'Last 45 minutes'));
      expect(host.quick().from).toEqual(new Date(2026, 9, 14, 14, 45, 20));
      await open('quick');
      await click(
        rangeButton('hx-date-range-quick-select-recent', '10/1/2026 08:00 - 10/2/2026 08:00'),
      );
      // an absolute recent range is applied as is and clears the expression
      expect(host.quick()).toEqual({
        from: new Date(2026, 9, 1, 8, 0),
        to: new Date(2026, 9, 2, 8, 0),
      });
      expect(host.quickExpr()).toBeNull();
      expect(input('quick').value).toBe('10/1/2026 08:00 - 10/2/2026 08:00');
    });

    it('works when the storage is blocked, keeping the list in memory', async () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new DOMException('blocked', 'SecurityError');
      });
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('blocked', 'SecurityError');
      });
      await open('quick');
      await applyQuick();
      expect(host.quickExpr()).toEqual({ from: 'now-15m', to: 'now' });
      await open('quick');
      expect(listed('hx-date-range-quick-select-recent')).toEqual(['Last 15 minutes']);
      await common('Today');
      await open('quick');
      expect(listed('hx-date-range-quick-select-recent')).toEqual(['Today', 'Last 15 minutes']);
    });

    it('keeps the list in memory without a storage key', async () => {
      await open('memory');
      await common('Last 1 hour');
      await open('memory');
      expect(listed('hx-date-range-quick-select-recent')).toEqual(['Last 1 hour']);
      expect(localStorage.length).toBe(0);
    });

    it('refuses an unreadable entry with the inline error', async () => {
      localStorage.setItem('hx-test-recent', JSON.stringify([{ from: 'soon', to: 'now' }]));
      await open('quick');
      await click(
        popup()!.querySelector<HTMLElement>('.hx-date-range-quick-select-recent button')!,
      );
      expect(popup()).not.toBeNull();
      expect(error()).not.toBeNull();
      expect(host.quick()).toEqual(EMPTY);
    });

    it('swaps the expression with reversed ends, so from belongs to value.from', async () => {
      localStorage.setItem('hx-test-recent', JSON.stringify([{ from: 'now+1d', to: 'now' }]));
      await open('quick');
      await click(
        popup()!.querySelector<HTMLElement>('.hx-date-range-quick-select-recent button')!,
      );
      expect(host.quick()).toEqual({ from: NOW, to: new Date(2026, 9, 15, 15, 30, 20) });
      expect(host.quickExpr()).toEqual({ from: 'now', to: 'now+1d' });
    });
  });

  describe('expression model', () => {
    const later = { from: new Date(2026, 9, 1, 8, 0), to: new Date(2026, 9, 2, 8, 0) };

    it('shows an expression set from outside in the field and the summary', async () => {
      host.quickExpr.set({ from: 'now-1d/d', to: 'now' });
      await settle();
      expect(input('quick').value).toBe('now-1d/d - now');
      // setting it does not change the value
      expect(host.quick()).toEqual(EMPTY);
      await open('quick');
      expect(summary('from')).toBe('Start ~ 1 day ago, rounded to the day');
      expect(summary('to')).toBe('End now');
    });

    it('keeps an expression set from outside together with the value', async () => {
      host.quick.set(later);
      host.quickExpr.set({ from: 'now-1h', to: 'now' });
      await settle();
      expect(host.quickExpr()).toEqual({ from: 'now-1h', to: 'now' });
      expect(input('quick').value).toBe('Last 1 hour');
    });

    it('drops the expression when [value] is set from outside', async () => {
      await open('quick');
      await applyQuick();
      host.quick.set(later);
      await settle();
      expect(host.quickExpr()).toBeNull();
      expect(input('quick').value).toBe('10/1/2026 08:00 - 10/2/2026 08:00');
    });
  });

  describe('forms', () => {
    it('works with ngModel and drops the expression on writeValue', async () => {
      await open('model');
      await applyQuick();
      expect(host.modelValue()).toEqual({ from: new Date(2026, 9, 14, 15, 15, 20), to: NOW });
      expect(host.modelExpr()).toEqual({ from: 'now-15m', to: 'now' });
      host.modelValue.set({ from: new Date(2026, 9, 1, 8, 0), to: new Date(2026, 9, 2, 8, 0) });
      await settle();
      await settle();
      expect(input('model').value).toBe('10/1/2026 08:00 - 10/2/2026 08:00');
      expect(host.modelExpr()).toBeNull();
    });

    it('works with a reactive FormControl: dirty, touched, setValue and reset', async () => {
      expect(input('reactive').value).toBe('');
      await open('reactive');
      await common('Last 1 hour');
      expect(host.control.value).toEqual({ from: new Date(2026, 9, 14, 14, 30, 20), to: NOW });
      expect(host.control.dirty).toBe(true);
      input('reactive').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      expect(host.control.touched).toBe(true);
      host.control.setValue({ from: new Date(2026, 9, 3, 12, 0), to: null });
      await settle();
      expect(input('reactive').value).toBe('10/3/2026 12:00 -');
      expect(host.reactiveExpr()).toBeNull();
      await open('reactive');
      await applyQuick();
      expect(host.reactiveExpr()).not.toBeNull();
      host.control.reset(EMPTY);
      await settle();
      expect(host.reactiveExpr()).toBeNull();
      expect(input('reactive').value).toBe('');
    });

    it('works with a signal form field', async () => {
      await open('signal');
      await common('Today');
      expect(host.state().span).toEqual({
        from: new Date(2026, 9, 14),
        to: new Date(2026, 9, 14, 23, 59, 59, 999),
      });
      expect(host.signalExpr()).toEqual({ from: 'now/d', to: 'now/d' });
      host.state.set({ span: { from: new Date(2026, 9, 1, 8, 0), to: null } });
      await settle();
      expect(input('signal').value).toBe('10/1/2026 08:00 -');
      expect(host.signalExpr()).toBeNull();
    });
  });

  describe('disabled', () => {
    it('does not open while disabled and keeps the value and the expression', async () => {
      expect(input('off').disabled).toBe(true);
      expect(el('off').querySelector<HTMLButtonElement>('.hx-date-picker-trigger')!.disabled).toBe(
        true,
      );
      await open('off');
      await click(input('off'));
      await press(input('off'), 'ArrowDown');
      expect(popup()).toBeNull();
      expect(host.offValue()).toEqual(EMPTY);
      expect(host.offExpr()).toEqual({ from: 'now-15m', to: 'now' });
    });

    it('follows a disabled FormControl', async () => {
      host.control.disable();
      await settle();
      expect(input('reactive').disabled).toBe(true);
      await open('reactive');
      expect(popup()).toBeNull();
      host.control.enable();
      await settle();
      await open('reactive');
      expect(popup()).not.toBeNull();
    });
  });

  describe('minDate and maxDate', () => {
    it('keeps an applied range inside minDate and maxDate', async () => {
      await open('limits');
      await common('Last 30 days');
      expect(host.limits()).toEqual({ from: host.min, to: NOW });
      expect(host.limitsExpr()).toEqual({ from: 'now-30d', to: 'now' });
      await open('limits');
      await choose('hx-date-range-quick-select-direction', 'Next');
      await fill(amount(), '1');
      await choose('hx-date-range-quick-select-unit', 'months');
      await applyQuick();
      expect(host.limits()).toEqual({ from: NOW, to: host.max });
    });
  });

  describe('keyboard only', () => {
    it('opens from the field, focuses Quick select, applies with Enter and returns the focus', async () => {
      input('quick').focus();
      await press(input('quick'), 'ArrowDown');
      expect(popup()).not.toBeNull();
      expect(document.activeElement).toBe(
        q('.hx-date-range-quick-select-direction .hx-select-trigger'),
      );
      await fill(amount(), '30');
      await press(amount(), 'Enter');
      expect(host.quickExpr()).toEqual({ from: 'now-30m', to: 'now' });
      expect(popup()).toBeNull();
      expect(document.activeElement).toBe(input('quick'));
    });

    it('opens with Enter, Space and Alt+Arrow Up and leaves other keys alone', async () => {
      for (const [key, init] of [
        ['Enter', {}],
        [' ', {}],
        ['ArrowUp', { altKey: true }],
      ] as const) {
        await press(input('quick'), key, init);
        expect({ key, open: popup() !== null }).toEqual({ key, open: true });
        await pressEscape();
      }
      await press(input('quick'), 'a');
      await press(input('quick'), 'ArrowUp');
      expect(popup()).toBeNull();
    });

    it('closes with Escape without applying and refocuses the field', async () => {
      await open('quick');
      await fill(amount(), '30');
      await pressEscape();
      expect(popup()).toBeNull();
      expect(document.activeElement).toBe(input('quick'));
      expect(host.quick()).toEqual(EMPTY);
      expect(host.quickExpr()).toBeNull();
    });

    it('offers Apply and the list entries as native buttons in the tab order', async () => {
      localStorage.setItem('hx-test-recent', JSON.stringify([{ from: 'now-45m', to: 'now' }]));
      await open('quick');
      const buttons = [
        applyButton(),
        rangeButton('hx-date-range-quick-select-common', 'Today') as HTMLButtonElement,
        rangeButton('hx-date-range-quick-select-recent', 'Last 45 minutes') as HTMLButtonElement,
      ];
      for (const button of buttons) {
        expect(button.tagName).toBe('BUTTON');
        expect(button.type).toBe('button');
        expect(button.disabled).toBe(false);
        expect(button.tabIndex).toBe(0);
      }
    });

    it('closes and is touched when the focus leaves the control', async () => {
      const touched = vi.fn();
      fixture.debugElement
        .query((d) => d.nativeElement === el('quick'))
        .componentInstance.touch.subscribe(touched);
      await open('quick');
      const outside = document.createElement('button');
      document.body.append(outside);
      popup()!.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: outside }));
      await settle();
      expect(popup()).toBeNull();
      expect(touched).toHaveBeenCalled();
      outside.remove();
    });
  });
});
