import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import {
  type HxDateRangeExpression,
  hxResolveRangeExpression,
} from '../internal/quick-select/quick-select';
import {
  HxDateRangeQuickSelect,
  type HxDateRangeQuickSelectValue,
} from './date-range-quick-select';

type Value = HxDateRangeQuickSelectValue;
/** Amounts the Quick select refuses: empty, zero, negative, fractional, too big or not a safe integer. */
const AMOUNTS = ['', '0', '-3', '1.5', '1e21', '9007199254740993', '9000000000000000'];
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
      id="labelled"
      locale="en-US"
      [recentStorageKey]="null"
      [labels]="{
        nowSummary: 'jetzt',
        agoSummary: 'vor {n} {unit}',
        resolvesTo: 'ergibt {date}',
        emptySide: 'leer',
        range: 'Beginn und Ende'
      }"
      [(value)]="labelledValue"
      [(expression)]="labelledExpr"
    />
    <hx-date-range-quick-select
      id="twin"
      locale="en-US"
      recentStorageKey="hx-test-recent"
      [(value)]="twinValue"
    />
    <hx-date-range-quick-select
      id="minOnly"
      locale="en-US"
      [recentStorageKey]="null"
      [minDate]="min"
      [(value)]="minOnlyValue"
    />
    <hx-date-range-quick-select
      id="maxOnly"
      locale="en-US"
      [recentStorageKey]="null"
      [maxDate]="max"
      [(value)]="maxOnlyValue"
    />
    <hx-date-range-quick-select
      id="toggle"
      locale="en-US"
      [recentStorageKey]="null"
      [disabled]="toggleOff()"
      [(value)]="toggleValue"
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
  labelledValue = signal<Value>(EMPTY);
  labelledExpr = signal<HxDateRangeExpression | null>(null);
  twinValue = signal<Value>(EMPTY);
  minOnlyValue = signal<Value>(EMPTY);
  maxOnlyValue = signal<Value>(EMPTY);
  toggleValue = signal<Value>(EMPTY);
  toggleOff = signal(false);
  offValue = signal<Value>(EMPTY);
  offExpr = signal<HxDateRangeExpression | null>({ from: 'now-15m', to: 'now' });
}

/** An app that restores a persisted expression with the range resolved from it, through ngModel. */
@Component({
  imports: [HxDateRangeQuickSelect, FormsModule],
  template: `
    <hx-date-range-quick-select
      locale="en-US"
      [recentStorageKey]="null"
      [(ngModel)]="range"
      [(expression)]="expression"
    />
  `,
})
class RestoreHost {
  readonly persisted: HxDateRangeExpression = { from: 'now-1h', to: 'now' };
  expression = signal<HxDateRangeExpression | null>(this.persisted);
  range: Value = hxResolveRangeExpression(this.persisted);
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
    // destroying the control leaves no popup behind, whatever the test left open
    const left = popup();
    left?.closest('.cdk-overlay-pane')?.remove();
    expect(left).toBeNull();
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
      for (const text of AMOUNTS) {
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
      // a valid retry takes the refusal back and applies
      await fill(amount(), '3');
      expect(error()).toBeNull();
      expect(amount().hasAttribute('aria-invalid')).toBe(false);
      expect(amount().hasAttribute('aria-describedby')).toBe(false);
      expect(applyButton().hasAttribute('aria-describedby')).toBe(false);
      await applyQuick();
      expect(popup()).toBeNull();
      expect(host.quickExpr()).toEqual({ from: 'now-3m', to: 'now' });
    });

    it('refuses the same amounts for Next N with the error described by the fields', async () => {
      await open('quick');
      await choose('hx-date-range-quick-select-direction', 'Next');
      for (const text of AMOUNTS) {
        await fill(amount(), text);
        expect(error()).toBeNull();
        await applyQuick();
        expect({ text, open: popup() !== null }).toEqual({ text, open: true });
        expect(error()?.textContent?.trim()).toBe('Choose a start and an end that can be applied.');
        expect(amount().getAttribute('aria-describedby')).toBe(error()!.id);
        expect(amount().getAttribute('aria-invalid')).toBe('true');
        expect(applyButton().getAttribute('aria-describedby')).toBe(error()!.id);
      }
      expect(host.quick()).toEqual(EMPTY);
      expect(host.quickExpr()).toBeNull();
      await fill(amount(), '2');
      expect(error()).toBeNull();
      expect(amount().hasAttribute('aria-invalid')).toBe(false);
      expect(amount().hasAttribute('aria-describedby')).toBe(false);
      expect(applyButton().hasAttribute('aria-describedby')).toBe(false);
      await applyQuick();
      expect(host.quickExpr()).toEqual({ from: 'now', to: 'now+2m' });
    });

    it('keeps an emptied amount empty instead of turning it into 0', async () => {
      await open('quick');
      await fill(amount(), '');
      expect(amount().value).toBe('');
      await applyQuick();
      expect(amount().value).toBe('');
      expect(error()).not.toBeNull();
      await fill(amount(), '3');
      expect(amount().value).toBe('3');
      await applyQuick();
      expect(host.quickExpr()).toEqual({ from: 'now-3m', to: 'now' });
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

    it('does not list a stored entry that cannot be read', async () => {
      localStorage.setItem('hx-test-recent', JSON.stringify([{ from: 'soon', to: 'now' }]));
      await open('quick');
      expect(popup()!.querySelector('.hx-date-range-quick-select-recent button')).toBeNull();
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

    it('keeps a persisted expression when ngModel writes the range resolved from it', async () => {
      const restore = TestBed.createComponent(RestoreHost);
      // the write comes a moment after the app resolved the range
      vi.setSystemTime(NOW.getTime() + 500);
      await restore.whenStable();
      restore.detectChanges();
      await restore.whenStable();
      restore.detectChanges();
      expect(restore.componentInstance.expression()).toEqual({ from: 'now-1h', to: 'now' });
      const field = restore.nativeElement.querySelector('input') as HTMLInputElement;
      expect(field.value).toBe('Last 1 hour');
      restore.destroy();
    });

    it('keeps an expression set with the range it resolves to, and drops it for another range', async () => {
      host.modelExpr.set({ from: 'now/d', to: 'now/d' });
      host.modelValue.set(hxResolveRangeExpression({ from: 'now/d', to: 'now/d' }));
      await settle();
      await settle();
      expect(host.modelExpr()).toEqual({ from: 'now/d', to: 'now/d' });
      expect(input('model').value).toBe('Today');

      // the same times as a new object keep it too
      host.modelValue.set({
        from: new Date(2026, 9, 14),
        to: new Date(2026, 9, 14, 23, 59, 59, 999),
      });
      await settle();
      await settle();
      expect(host.modelExpr()).toEqual({ from: 'now/d', to: 'now/d' });

      // a range a few seconds off is another range
      host.modelValue.set({ from: new Date(2026, 9, 14, 0, 0, 5), to: new Date(2026, 9, 15) });
      await settle();
      await settle();
      expect(host.modelExpr()).toBeNull();
      expect(input('model').value).toBe('10/14/2026 00:00 - 10/15/2026 00:00');
    });

    it('keeps the expression when a FormControl gets the same range again', async () => {
      await open('reactive');
      await common('Last 1 hour');
      expect(host.reactiveExpr()).toEqual({ from: 'now-1h', to: 'now' });
      const { from, to } = host.control.value!;
      // later, when `now` has moved on: the same times keep it, other ones drop it
      vi.setSystemTime(new Date(2026, 9, 14, 15, 40, 0));
      host.control.setValue({ from: new Date(from!), to: new Date(to!) });
      await settle();
      expect(host.reactiveExpr()).toEqual({ from: 'now-1h', to: 'now' });
      host.control.setValue({ from: new Date(from!), to: new Date(2026, 9, 14, 15, 40, 0) });
      await settle();
      expect(host.reactiveExpr()).toBeNull();
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

    it('closes and marks a form control touched when the focus leaves the control', async () => {
      const outside = document.createElement('button');
      document.body.append(outside);
      try {
        await open('reactive');
        expect(host.control.touched).toBe(false);
        popup()!.dispatchEvent(
          new FocusEvent('focusout', { bubbles: true, relatedTarget: outside }),
        );
        await settle();
        expect(popup()).toBeNull();
        expect(host.control.touched).toBe(true);
        expect(el('reactive').classList).toContain('ng-touched');
      } finally {
        outside.remove();
      }
    });
  });

  describe('keyboard flow', () => {
    it('keeps Tab free, in the order of the popup, and returns the focus after Enter on a Commonly used button', async () => {
      localStorage.setItem('hx-test-recent', JSON.stringify([{ from: 'now-45m', to: 'now' }]));
      input('quick').focus();
      await press(input('quick'), 'ArrowDown');
      const order = [...popup()!.querySelectorAll<HTMLElement>('button, input')].map((e) => {
        if (e.tagName === 'INPUT') return 'amount';
        if (e.classList.contains('hx-select-trigger')) return 'select';
        return e.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      });
      expect(order).toEqual([
        'select',
        'amount',
        'select',
        'Apply',
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
        'Last 45 minutes',
        'Start Not set',
        'End Not set',
      ]);
      // Tab is not trapped or taken over: the keydown is left to the browser
      const button = rangeButton('hx-date-range-quick-select-common', 'Today');
      button.focus();
      const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
      button.dispatchEvent(tab);
      expect(tab.defaultPrevented).toBe(false);
      expect(popup()).not.toBeNull();
      // Enter on a native button activates it, which applies the range
      const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
      button.dispatchEvent(enter);
      expect(enter.defaultPrevented).toBe(false);
      await click(button);
      expect(host.quickExpr()).toEqual({ from: 'now/d', to: 'now/d' });
      expect(popup()).toBeNull();
      expect(document.activeElement).toBe(input('quick'));
    });

    it('returns the focus to the field after Apply with the keyboard and focuses Quick select again on reopening', async () => {
      input('quick').focus();
      await press(input('quick'), 'ArrowDown');
      await fill(amount(), '5');
      await press(amount(), 'Enter');
      expect(host.quickExpr()).toEqual({ from: 'now-5m', to: 'now' });
      expect(document.activeElement).toBe(input('quick'));
      await press(input('quick'), 'ArrowDown');
      expect(document.activeElement).toBe(
        q('.hx-date-range-quick-select-direction .hx-select-trigger'),
      );
      expect(amount().value).toBe('5');
    });
  });

  describe('teardown', () => {
    it('removes the popup overlay when the control is destroyed while it is open', async () => {
      await open('quick');
      expect(popup()).not.toBeNull();
      fixture.destroy();
      expect(popup()).toBeNull();
      expect(
        document.querySelector('.cdk-overlay-pane:has(.hx-date-range-quick-select-popup)'),
      ).toBeNull();
    });
  });

  describe('summary labels', () => {
    const side = (s: 'from' | 'to') =>
      q(`.hx-date-range-quick-select-side-line-${s}`).textContent?.replace(/\s+/g, ' ').trim();

    it('uses labels given in part and keeps the others English', async () => {
      await open('labelled');
      expect(popup()!.querySelector('[role=group]')!.getAttribute('aria-label')).toBe(
        'Beginn und Ende',
      );
      expect(side('from')).toBe('Start leer');
      expect(side('to')).toBe('End leer');
      await click(rangeButton('hx-date-range-quick-select-common', 'Last 15 minutes'));
      await open('labelled');
      expect(side('from')).toBe('Start vor 15 minutes');
      expect(side('to')).toBe('End jetzt');
      await click(q('.hx-date-range-quick-select-side-line-from'));
      await click(q('[role=tab]:nth-of-type(2)'));
      expect(q('.hx-date-range-quick-select-resolved-date').textContent?.trim()).toBe(
        'ergibt 10/14/2026 15:15',
      );
      expect(q('.hx-date-range-quick-select-caption').textContent).toBe('Quick select');
    });
  });

  describe('expression from outside', () => {
    it('shows an unreadable expression as typed, keeps the value and summarises the value', async () => {
      host.quick.set({ from: new Date(2026, 9, 1, 8, 0), to: new Date(2026, 9, 2, 8, 0) });
      host.quickExpr.set({ from: 'now-1h', to: 'now' });
      await settle();
      host.quickExpr.set({ from: 'soon', to: 'now' });
      await settle();
      expect(input('quick').value).toBe('soon - now');
      expect(host.quick()).toEqual({
        from: new Date(2026, 9, 1, 8, 0),
        to: new Date(2026, 9, 2, 8, 0),
      });
      await open('quick');
      // the side editor cannot read the expression, so the summary falls back to the dates of the value
      expect(summary('from')).toBe('Start 10/1/2026 08:00');
      expect(summary('to')).toBe('End now');
    });
  });

  describe('disabled while open', () => {
    it('closes the popup, so Apply cannot change the value of a disabled control', async () => {
      await open('toggle');
      expect(popup()).not.toBeNull();
      host.toggleOff.set(true);
      await settle();
      expect(popup()).toBeNull();
      expect(input('toggle').disabled).toBe(true);
      expect(host.toggleValue()).toEqual(EMPTY);
      await open('toggle');
      expect(popup()).toBeNull();
      host.toggleOff.set(false);
      await settle();
      await open('toggle');
      await applyQuick();
      expect(host.toggleValue().to).toEqual(NOW);
    });
  });

  describe('Recently used shared by storage key', () => {
    it('shows a range applied in one control in another with the same key', async () => {
      await open('quick');
      await common('Last 7 days');
      await open('twin');
      expect(listed('hx-date-range-quick-select-recent')).toEqual(['Last 7 days']);
      await pressEscape();
      await open('twin');
      await common('Today');
      await open('quick');
      expect(listed('hx-date-range-quick-select-recent')).toEqual(['Today', 'Last 7 days']);
    });

    it.each([
      ['not JSON', '{not json'],
      ['not a list', '{"from":"now-1h","to":"now"}'],
      ['a list of other things', '[1, "a", null, {"from":5}]'],
    ])('starts with an empty list when the storage holds %s', async (_name, text) => {
      localStorage.setItem('hx-test-recent', text);
      await open('quick');
      expect(popup()!.querySelector('.hx-date-range-quick-select-recent')).toBeNull();
      await applyQuick();
      await open('quick');
      expect(listed('hx-date-range-quick-select-recent')).toEqual(['Last 15 minutes']);
    });
  });

  describe('only one limit', () => {
    it('keeps an applied range after minDate when only minDate is set', async () => {
      await open('minOnly');
      await common('Last 30 days');
      expect(host.minOnlyValue()).toEqual({ from: host.min, to: NOW });
      await open('minOnly');
      await choose('hx-date-range-quick-select-direction', 'Next');
      await fill(amount(), '2');
      await choose('hx-date-range-quick-select-unit', 'years');
      await applyQuick();
      expect(host.minOnlyValue()).toEqual({ from: NOW, to: new Date(2028, 9, 14, 15, 30, 20) });
    });

    it('keeps an applied range before maxDate when only maxDate is set', async () => {
      await open('maxOnly');
      await common('Last 30 days');
      expect(host.maxOnlyValue()).toEqual({ from: new Date(2026, 8, 14, 15, 30, 20), to: NOW });
      await open('maxOnly');
      await choose('hx-date-range-quick-select-direction', 'Next');
      await fill(amount(), '2');
      await choose('hx-date-range-quick-select-unit', 'years');
      await applyQuick();
      expect(host.maxOnlyValue()).toEqual({ from: NOW, to: host.max });
    });
  });

  describe('side editor', () => {
    const sideButton = (side: 'from' | 'to') =>
      q<HTMLButtonElement>(`.hx-date-range-quick-select-side-line-${side}`);
    const editor = () =>
      popup()?.querySelector<HTMLElement>('.hx-date-range-quick-select-editor') ?? null;
    const tabs = () => [...popup()!.querySelectorAll<HTMLButtonElement>('[role=tab]')];
    const tab = (label: string) => tabs().find((t) => t.textContent?.trim() === label)!;
    const panel = () => q('[role=tabpanel]');
    const calendar = () => popup()?.querySelector('hx-calendar') ?? null;
    const day = (date: string) => q<HTMLButtonElement>(`.hx-date-picker-date[data-date="${date}"]`);
    const sideAmount = () => q<HTMLInputElement>('.hx-date-range-quick-select-side-amount');
    const sideDate = () => q<HTMLInputElement>('.hx-date-range-quick-select-side-date');
    const resolved = () => q('.hx-date-range-quick-select-resolved-date').textContent?.trim();
    const typeDate = async (text: string) => {
      sideDate().value = text;
      sideDate().dispatchEvent(new Event('change'));
      await settle();
    };
    /** The popup of `quick` with Last 15 minutes applied and the editor of `side` open. */
    const editAfterLast15 = async (side: 'from' | 'to') => {
      await open('quick');
      await applyQuick();
      await open('quick');
      await click(sideButton(side));
    };

    it('opens the editor of one side from its summary button and closes it with a second click', async () => {
      await open('quick');
      expect(editor()).toBeNull();
      expect(sideButton('from').tagName).toBe('BUTTON');
      expect(sideButton('from').type).toBe('button');
      expect(sideButton('from').getAttribute('aria-expanded')).toBe('false');
      expect(sideButton('from').getAttribute('aria-controls')).toBeNull();

      await click(sideButton('from'));
      expect(sideButton('from').getAttribute('aria-expanded')).toBe('true');
      expect(sideButton('from').getAttribute('aria-controls')).toBe(editor()!.id);
      expect(editor()!.getAttribute('aria-labelledby')).toBe(sideButton('from').id);
      expect(q('[role=tablist]').getAttribute('aria-labelledby')).toBe(sideButton('from').id);
      expect(tabs().map((t) => t.textContent?.trim())).toEqual(['Absolute', 'Relative', 'Now']);
      // the selected tab takes the focus
      expect(document.activeElement).toBe(tab('Absolute'));

      // the other side opens alone
      await click(sideButton('to'));
      expect(popup()!.querySelectorAll('.hx-date-range-quick-select-editor').length).toBe(1);
      expect(editor()!.classList).toContain('hx-date-range-quick-select-editor-to');
      expect(sideButton('from').getAttribute('aria-expanded')).toBe('false');

      await click(sideButton('to'));
      expect(editor()).toBeNull();
      expect(popup()).not.toBeNull();
    });

    it('opens on the tab of the applied side and switches tabs with roving focus and ARIA', async () => {
      await editAfterLast15('from');
      expect(tab('Relative').getAttribute('aria-selected')).toBe('true');
      expect(tabs().map((t) => t.tabIndex)).toEqual([-1, 0, -1]);
      expect(panel().getAttribute('aria-labelledby')).toBe(tab('Relative').id);
      for (const t of tabs()) expect(t.getAttribute('aria-controls')).toBe(panel().id);
      expect(panel().tabIndex).toBe(0);

      await click(tab('Now'));
      expect(tab('Now').getAttribute('aria-selected')).toBe('true');
      expect(tab('Relative').getAttribute('aria-selected')).toBe('false');
      expect(panel().getAttribute('aria-labelledby')).toBe(tab('Now').id);
      expect(q('.hx-date-range-quick-select-now-hint').textContent?.trim()).toBe(
        'Set to the current time when the range is applied.',
      );
    });

    it('moves between the tabs with Arrow Left/Right (wrapping), Home and End', async () => {
      await open('quick');
      await click(sideButton('from'));
      const list = q('[role=tablist]');
      const selected = () => tabs().find((t) => t.getAttribute('aria-selected') === 'true')!;
      await press(list, 'ArrowRight');
      expect(selected().textContent?.trim()).toBe('Relative');
      expect(document.activeElement).toBe(selected());
      await press(list, 'End');
      expect(selected().textContent?.trim()).toBe('Now');
      await press(list, 'ArrowRight');
      expect(selected().textContent?.trim()).toBe('Absolute');
      await press(list, 'ArrowLeft');
      expect(selected().textContent?.trim()).toBe('Now');
      await press(list, 'Home');
      expect(selected().textContent?.trim()).toBe('Absolute');
      expect(document.activeElement).toBe(selected());
      // other keys leave the tabs alone
      await press(list, 'a');
      expect(selected().textContent?.trim()).toBe('Absolute');
    });

    it('renders the calendar only in the Absolute tab', async () => {
      await open('quick');
      await click(sideButton('from'));
      expect(calendar()).not.toBeNull();
      expect(sideDate()).not.toBeNull();
      await click(tab('Relative'));
      expect(calendar()).toBeNull();
      expect(popup()!.querySelector('.hx-date-range-quick-select-side-date')).toBeNull();
      await click(tab('Now'));
      expect(calendar()).toBeNull();
      await click(tab('Absolute'));
      expect(calendar()).not.toBeNull();
      await click(sideButton('from'));
      expect(calendar()).toBeNull();
    });

    it('applies a Relative side at once, keeping the popup open, with the round option and the resolved date', async () => {
      await editAfterLast15('from');
      expect(sideAmount().value).toBe('15');
      expect(q('.hx-date-range-quick-select-side-unit .hx-select-trigger').textContent).toContain(
        'Minutes ago',
      );
      expect(q('.hx-date-range-quick-select-side-round').textContent?.trim()).toBe(
        'Round to the minute',
      );
      expect(q('.hx-date-range-quick-select-expression').textContent).toBe('now-15m');
      expect(resolved()).toBe('Resolves to 10/14/2026 15:15');

      await fill(sideAmount(), '2');
      expect(host.quick()).toEqual({ from: new Date(2026, 9, 14, 15, 28, 20), to: NOW });
      expect(host.quickExpr()).toEqual({ from: 'now-2m', to: 'now' });
      expect(summary('from')).toBe('Start ~ 2 minutes ago');
      expect(popup()).not.toBeNull();
      expect(editor()).not.toBeNull();

      const round = q<HTMLInputElement>('.hx-date-range-quick-select-side-round input');
      round.click();
      await settle();
      expect(host.quickExpr()).toEqual({ from: 'now-2m/m', to: 'now' });
      expect(host.quick().from).toEqual(new Date(2026, 9, 14, 15, 28, 0));
      expect(summary('from')).toBe('Start ~ 2 minutes ago, rounded to the minute');

      await choose('hx-date-range-quick-select-side-unit', 'Hours ago');
      expect(host.quickExpr()).toEqual({ from: 'now-2h/h', to: 'now' });
      expect(q('.hx-date-range-quick-select-side-round').textContent?.trim()).toBe(
        'Round to the hour',
      );
      expect(resolved()).toBe('Resolves to 10/14/2026 13:00');
      expect(input('quick').value).toBe('now-2h/h - now');
    });

    it('applies the end as a relative side from now, rounding it up', async () => {
      await editAfterLast15('to');
      await click(tab('Relative'));
      await choose('hx-date-range-quick-select-side-unit', 'Days from now');
      await fill(sideAmount(), '1');
      await click(q('.hx-date-range-quick-select-side-round input'));
      expect(host.quickExpr()).toEqual({ from: 'now-15m', to: 'now+1d/d' });
      expect(host.quick().to).toEqual(new Date(2026, 9, 15, 23, 59, 59, 999));
      expect(summary('to')).toBe('End ~ 1 day from now, rounded to the day');
    });

    it('applies the Now tab with the resolved date', async () => {
      await editAfterLast15('to');
      await click(tab('Relative'));
      await fill(sideAmount(), '5');
      expect(host.quickExpr()).toEqual({ from: 'now-15m', to: 'now-5m' });
      await click(tab('Now'));
      expect(host.quickExpr()).toEqual({ from: 'now-15m', to: 'now' });
      expect(host.quick().to).toEqual(NOW);
      expect(resolved()).toBe('Resolves to 10/14/2026 15:30');
      expect(summary('to')).toBe('End now');
    });

    it('makes a side absolute with its date, keeping the time when a day is picked', async () => {
      await editAfterLast15('from');
      await click(tab('Absolute'));
      const start = new Date(2026, 9, 14, 15, 15, 20);
      // the side keeps its date; the other side stays relative
      expect(host.quick()).toEqual({ from: start, to: NOW });
      expect(host.quickExpr()).toEqual({ from: start.toISOString(), to: 'now' });
      expect(sideDate().value).toBe('10/14/2026 15:15');
      expect(day('2026-10-14').classList).toContain('hx-date-picker-date-selected');

      await click(day('2026-10-10'));
      expect(host.quick().from).toEqual(new Date(2026, 9, 10, 15, 15, 20));
      expect(summary('from')).toBe('Start 10/10/2026 15:15');
      expect(sideDate().value).toBe('10/10/2026 15:15');
      expect(popup()).not.toBeNull();
    });

    it('sets an empty side alone and drops the expression for an absolute range', async () => {
      await open('quick');
      await click(sideButton('from'));
      await click(day('2026-10-10'));
      expect(host.quick()).toEqual({ from: new Date(2026, 9, 10), to: null });
      expect(host.quickExpr()).toBeNull();
      expect(summary('to')).toBe('End Not set');

      await click(sideButton('to'));
      await click(day('2026-10-12'));
      // an empty end takes the end of the day
      expect(host.quick()).toEqual({
        from: new Date(2026, 9, 10),
        to: new Date(2026, 9, 12, 23, 59, 59, 999),
      });
      expect(host.quickExpr()).toBeNull();
      expect(input('quick').value).toBe('10/10/2026 00:00 - 10/12/2026 23:59');
    });

    it('takes a typed date on the Absolute tab and refuses an unreadable one', async () => {
      await open('quick');
      await click(sideButton('from'));
      await typeDate('10/9/2026 08:30');
      expect(host.quick().from).toEqual(new Date(2026, 9, 9, 8, 30));
      expect(resolved()).toBe('Resolves to 10/9/2026 08:30');
      expect(error()).toBeNull();
      expect(sideDate().getAttribute('aria-invalid')).toBeNull();

      await typeDate('soon');
      expect(host.quick().from).toEqual(new Date(2026, 9, 9, 8, 30));
      expect(error()?.textContent).toBe('Choose a start and an end that can be applied.');
      expect(error()?.getAttribute('role')).toBe('alert');
      expect(sideDate().getAttribute('aria-invalid')).toBe('true');
      expect(sideDate().getAttribute('aria-describedby')).toBe(error()!.id);
      expect(panel().getAttribute('aria-describedby')).toBe(error()!.id);
      // the Quick select fields are not the cause
      expect(applyButton().getAttribute('aria-describedby')).toBeNull();
      expect(amount().getAttribute('aria-invalid')).toBeNull();

      // a date alone is midnight; the message goes
      await typeDate('10/11/2026');
      expect(host.quick().from).toEqual(new Date(2026, 9, 11));
      expect(error()).toBeNull();

      // an emptied field clears the side
      await typeDate('');
      expect(host.quick()).toEqual(EMPTY);
    });

    it('commits a typed date once when Enter is followed by change', async () => {
      const changes = vi.fn();
      fixture.debugElement
        .query((d) => d.nativeElement === el('quick'))
        .componentInstance.value.subscribe(changes);
      await open('quick');
      await click(sideButton('from'));
      sideDate().value = '10/9/2026 08:30';
      await press(sideDate(), 'Enter');
      sideDate().dispatchEvent(new Event('change'));
      await settle();
      expect(changes).toHaveBeenCalledTimes(1);
      expect(host.quick().from).toEqual(new Date(2026, 9, 9, 8, 30));

      // typing the applied date back after a refused one only drops the message
      await typeDate('soon');
      expect(error()).not.toBeNull();
      await typeDate('10/9/2026 08:30');
      expect(error()).toBeNull();
      expect(changes).toHaveBeenCalledTimes(1);
    });

    it('refuses an empty, negative or too big relative amount and keeps the applied range', async () => {
      await editAfterLast15('from');
      const applied = host.quick();
      for (const text of ['', '-3', '1e21']) {
        await fill(sideAmount(), text);
        expect({ text, value: host.quick() }).toEqual({ text, value: applied });
        expect(host.quickExpr()).toEqual({ from: 'now-15m', to: 'now' });
        expect(error()?.textContent).toBe('Choose a start and an end that can be applied.');
        expect(sideAmount().getAttribute('aria-invalid')).toBe('true');
        expect(sideAmount().getAttribute('aria-describedby')).toBe(error()!.id);
        // the summary keeps the applied side
        expect(summary('from')).toBe('Start ~ 15 minutes ago');
      }
      await fill(sideAmount(), '20');
      expect(error()).toBeNull();
      expect(sideAmount().getAttribute('aria-invalid')).toBeNull();
      expect(sideAmount().hasAttribute('aria-describedby')).toBe(false);
      expect(host.quickExpr()).toEqual({ from: 'now-20m', to: 'now' });
    });

    it('swaps a relative start after the end, as Apply does, and the editor follows it', async () => {
      await editAfterLast15('from');
      await choose('hx-date-range-quick-select-side-unit', 'Minutes from now');
      // now+15m to now: the ends are ordered and the expression is swapped with them
      expect(host.quick()).toEqual({ from: NOW, to: new Date(2026, 9, 14, 15, 45, 20) });
      expect(host.quickExpr()).toEqual({ from: 'now', to: 'now+15m' });
      expect(error()).toBeNull();
      expect(summary('from')).toBe('Start now');
      expect(summary('to')).toBe('End ~ 15 minutes from now');
      // the edited side is the end now: its editor stays open
      expect(editor()!.classList).toContain('hx-date-range-quick-select-editor-to');
      expect(sideButton('to').getAttribute('aria-expanded')).toBe('true');
      expect(tab('Relative').getAttribute('aria-selected')).toBe('true');
      expect(sideAmount().value).toBe('15');
    });

    it('swaps a picked or typed start after the end', async () => {
      await editAfterLast15('from');
      await click(tab('Absolute'));
      await click(day('2026-10-20'));
      expect(host.quick()).toEqual({ from: NOW, to: new Date(2026, 9, 20, 15, 15, 20) });
      expect(host.quickExpr()).toEqual({
        from: 'now',
        to: new Date(2026, 9, 20, 15, 15, 20).toISOString(),
      });
      expect(error()).toBeNull();
      expect(editor()!.classList).toContain('hx-date-range-quick-select-editor-to');
      expect(sideDate().value).toBe('10/20/2026 15:15');

      // two absolute sides: a typed start after the end swaps them too
      await click(sideButton('from'));
      await click(tab('Absolute'));
      await typeDate('10/25/2026 08:00');
      expect(host.quick()).toEqual({
        from: new Date(2026, 9, 20, 15, 15, 20),
        to: new Date(2026, 9, 25, 8, 0),
      });
      expect(host.quickExpr()).toBeNull();
      expect(editor()!.classList).toContain('hx-date-range-quick-select-editor-to');
      expect(sideDate().value).toBe('10/25/2026 08:00');
      await pressEscape();
      await pressEscape();
      await open('quick');
      expect(listed('hx-date-range-quick-select-recent')[0]).toBe(
        '10/20/2026 15:15 - 10/25/2026 08:00',
      );
    });

    it('drops a refused edit when its editor closes', async () => {
      await editAfterLast15('from');
      await fill(sideAmount(), '');
      expect(error()).not.toBeNull();
      await click(sideButton('from'));
      expect(error()).toBeNull();
      await click(sideButton('from'));
      expect(sideAmount().value).toBe('15');
      expect(host.quickExpr()).toEqual({ from: 'now-15m', to: 'now' });
    });

    it('keeps the side editor inside minDate and maxDate', async () => {
      await open('limits');
      await click(sideButton('from'));
      // days outside the limits are disabled and ignored
      expect(day('2026-10-4').getAttribute('aria-disabled')).toBe('true');
      await click(day('2026-10-4'));
      expect(host.limits()).toEqual(EMPTY);
      // a typed date outside the limits is refused
      await typeDate('10/29/2026 08:00');
      expect(host.limits()).toEqual(EMPTY);
      expect(error()).not.toBeNull();
      // a relative side is moved inside the limits, and so is its resolved date
      await click(tab('Relative'));
      await choose('hx-date-range-quick-select-side-unit', 'Days ago');
      await fill(sideAmount(), '30');
      expect(host.limits().from).toEqual(host.min);
      expect(host.limitsExpr()).toBeNull();
      expect(resolved()).toBe('Resolves to 10/5/2026 08:00');
      // a picked day keeps an empty start at 00:00, moved up to the minimum time
      await click(tab('Absolute'));
      await click(day('2026-10-5'));
      expect(host.limits().from).toEqual(host.min);
    });

    it('adds the range of the side editor to Recently used when the popup closes', async () => {
      await editAfterLast15('from');
      await fill(sideAmount(), '45');
      expect(listed('hx-date-range-quick-select-recent')).toEqual(['Last 15 minutes']);
      await pressEscape();
      await pressEscape();
      await open('quick');
      expect(listed('hx-date-range-quick-select-recent')).toEqual([
        'Last 45 minutes',
        'Last 15 minutes',
      ]);
      expect(JSON.parse(localStorage.getItem('hx-test-recent')!)[0]).toEqual({
        from: 'now-45m',
        to: 'now',
      });
    });

    it('sets the tabs again from an expression set from outside', async () => {
      host.quickExpr.set({ from: 'now-1h', to: 'now' });
      await settle();
      await open('quick');
      await click(sideButton('from'));
      expect(tab('Relative').getAttribute('aria-selected')).toBe('true');
      expect(sideAmount().value).toBe('1');
      await click(sideButton('to'));
      expect(tab('Now').getAttribute('aria-selected')).toBe('true');
    });

    describe('when the overlay detaches itself', () => {
      /** Detaches the overlay as the CDK does (a scroll strategy, the origin going away), not through `open`. */
      const detach = async () => {
        const node = fixture.debugElement
          .query((d) => d.nativeElement === el('quick'))
          .queryAllNodes((n) => !!n.injector.get(CdkConnectedOverlay, null, { self: true }))[0];
        node.injector.get(CdkConnectedOverlay).overlayRef.detach();
        await settle();
      };

      it('adds the range of the side editor to Recently used', async () => {
        await editAfterLast15('from');
        await fill(sideAmount(), '45');
        await detach();
        expect(popup()).toBeNull();
        await open('quick');
        expect(editor()).toBeNull();
        expect(listed('hx-date-range-quick-select-recent')).toEqual([
          'Last 45 minutes',
          'Last 15 minutes',
        ]);
      });

      it('drops a refused edit and its message', async () => {
        await editAfterLast15('from');
        await fill(sideAmount(), '');
        expect(error()).not.toBeNull();
        await detach();
        await open('quick');
        expect(error()).toBeNull();
        await click(sideButton('from'));
        expect(sideAmount().value).toBe('15');
        expect(sideAmount().getAttribute('aria-invalid')).toBeNull();
      });
    });

    describe('Escape', () => {
      it('closes the side editor first and focuses its summary button, then the popup', async () => {
        await open('quick');
        await click(sideButton('to'));
        await pressEscape();
        expect(editor()).toBeNull();
        expect(popup()).not.toBeNull();
        expect(document.activeElement).toBe(sideButton('to'));
        await pressEscape();
        expect(popup()).toBeNull();
        expect(document.activeElement).toBe(input('quick'));
      });

      it('closes the side editor from the calendar and from a tab', async () => {
        await open('quick');
        await click(sideButton('from'));
        await press(day('2026-10-14'), 'Escape');
        expect(editor()).toBeNull();
        expect(popup()).not.toBeNull();
        await click(sideButton('from'));
        await press(tab('Absolute'), 'Escape');
        expect(editor()).toBeNull();
        expect(popup()).not.toBeNull();
      });

      it('opens the popup again with the editor closed', async () => {
        await open('quick');
        await click(sideButton('from'));
        await click(el('quick').querySelector<HTMLButtonElement>('.hx-date-picker-trigger')!);
        expect(popup()).toBeNull();
        await open('quick');
        expect(editor()).toBeNull();
      });
    });
  });
});
