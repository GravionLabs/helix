import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import {
  HX_DATE_RANGE_DAY_PRESETS,
  type HxDateTimeRangePreset,
  hxDateRangePresets,
} from '../date-range-presets/date-range-presets';
import { HxRangePresets } from '../internal/range-presets/range-presets';
import { HxDatePicker, type HxDatePickerValue } from './date-picker';

@Component({
  imports: [HxDatePicker, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-date-picker id="single" inline ariaLabel="Arrival" locale="en-US" [minDate]="min" [maxDate]="max" [disabledDates]="blocked" [(ngModel)]="arrival" />
    <hx-date-picker id="range" inline selectionMode="range" locale="en-US" [firstDayOfWeek]="1" [(value)]="stay" />
    <hx-date-picker id="multi" inline selectionMode="multiple" locale="en-US" [(value)]="days" />
    <hx-date-picker id="reactive" inline locale="en-US" [formControl]="control" />
    <hx-date-picker id="signal" inline locale="en-US" [formField]="f.day" />
  `,
})
class Host {
  min = new Date(2026, 9, 5);
  max = new Date(2026, 9, 28);
  blocked = [new Date(2026, 9, 12)];
  arrival: Date | null = new Date(2026, 9, 9);
  stay = signal<HxDatePickerValue>(null);
  days = signal<HxDatePickerValue>([]);
  control = new FormControl<Date | null>(new Date(2026, 9, 3));
  state = signal<{ day: Date | null }>({ day: null });
  f = form(this.state);
}

describe('HxDatePicker', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const day = (id: string, d: number) =>
    el(id).querySelector<HTMLButtonElement>(
      `.hx-date-picker-date[data-date="2026-10-${d}"]`,
    ) as HTMLButtonElement;
  const selected = (id: string) =>
    [...el(id).querySelectorAll('[role=gridcell][aria-selected=true] button')].map((b) =>
      b.textContent?.trim(),
    );
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  it('is a date grid: weekday headers, gridcells, the value selected', () => {
    const grid = el('single').querySelector('[role=grid]') as HTMLElement;
    expect(grid).toBeTruthy();
    expect([...grid.querySelectorAll('th')].map((h) => h.textContent?.trim())).toEqual([
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ]);
    expect(grid.querySelector('th')?.getAttribute('abbr')).toBe('Sunday');
    expect(el('single').querySelector('.hx-date-picker-title-button')?.textContent?.trim()).toBe(
      'October',
    );
    expect(selected('single')).toEqual(['9']);
    expect(day('single', 9).getAttribute('aria-label')).toBe('Friday, October 9, 2026');
  });

  it('starts the week on firstDayOfWeek', () => {
    expect(el('range').querySelector('th')?.textContent?.trim()).toBe('Mon');
  });

  it('chooses a day by click and writes a Date', async () => {
    day('single', 15).click();
    await settle();
    expect(host.arrival).toEqual(new Date(2026, 9, 15));
    expect(selected('single')).toEqual(['15']);
  });

  it('writes the start of the day and has no time row', async () => {
    host.arrival = new Date(2026, 9, 9, 14, 30, 15);
    fixture.changeDetectorRef.markForCheck();
    await settle();
    day('single', 15).click();
    await settle();
    expect(host.arrival).toEqual(new Date(2026, 9, 15, 0, 0, 0));
    expect(el('single').querySelector('.hx-date-picker-time')).toBeNull();
  });

  it('does not choose days outside min/max or disabled dates', async () => {
    for (const d of [4, 12, 29]) {
      expect(day('single', d).getAttribute('aria-disabled')).toBe('true');
      day('single', d).click();
    }
    await settle();
    expect(host.arrival).toEqual(new Date(2026, 9, 9));
  });

  it('marks today with aria-current in the month that shows it', () => {
    // 'range' has no value, so it shows the current month
    const today = el('range').querySelectorAll('.hx-date-picker-date-today');
    expect(today.length).toBe(1);
    expect(today[0].getAttribute('aria-current')).toBe('date');
  });

  it('selects a range with two clicks and highlights the days between', async () => {
    host.stay.set([new Date(2026, 9, 1)]);
    await settle();
    day('range', 6).click();
    await settle();
    expect(host.stay()).toEqual([new Date(2026, 9, 1), new Date(2026, 9, 6)]);
    expect(el('range').querySelectorAll('.hx-date-picker-date-in-range').length).toBe(4);
    day('range', 3).click();
    await settle();
    expect(host.stay()).toEqual([new Date(2026, 9, 3)]);
  });

  it('selects several days and toggles them off', async () => {
    host.days.set([new Date(2026, 9, 1)]);
    await settle();
    day('multi', 2).click();
    day('multi', 4).click();
    await settle();
    expect(host.days()).toEqual([new Date(2026, 9, 1), new Date(2026, 9, 2), new Date(2026, 9, 4)]);
    day('multi', 2).click();
    await settle();
    expect(selected('multi')).toEqual(['1', '4']);
    expect(el('multi').querySelector('[role=grid]')?.getAttribute('aria-multiselectable')).toBe(
      'true',
    );
  });

  it('moves the focus with the arrow keys across months', async () => {
    const key = (k: string, extra: KeyboardEventInit = {}) =>
      (document.activeElement as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: k, bubbles: true, ...extra }),
      );
    day('single', 9).focus();
    key('ArrowRight');
    await settle();
    expect(document.activeElement).toBe(day('single', 10));
    key('ArrowDown');
    await settle();
    expect(document.activeElement).toBe(day('single', 17));
    key('Home'); // Sunday of that week
    await settle();
    expect(document.activeElement).toBe(day('single', 11));
    key('End');
    await settle();
    expect(document.activeElement).toBe(day('single', 17));
    key('PageDown');
    await settle();
    expect(el('single').querySelector('.hx-date-picker-title-button')?.textContent?.trim()).toBe(
      'November',
    );
    expect((document.activeElement as HTMLElement).getAttribute('data-date')).toBe('2026-11-17');
  });

  it('keeps one tab stop in the grid', () => {
    const stops = el('single').querySelectorAll('.hx-date-picker-date[tabindex="0"]');
    expect(stops.length).toBe(1);
    // the focused day is today while the shown month is today's, else the selected day (9 October)
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    expect(['2026-10-9', todayKey]).toContain(stops[0].getAttribute('data-date'));
  });

  it('goes to the next month and back with the header buttons', async () => {
    (el('single').querySelector('.hx-date-picker-next') as HTMLElement).click();
    await settle();
    expect(el('single').querySelector('.hx-date-picker-title-button')?.textContent?.trim()).toBe(
      'November',
    );
    (el('single').querySelector('.hx-date-picker-prev') as HTMLElement).click();
    (el('single').querySelector('.hx-date-picker-prev') as HTMLElement).click();
    await settle();
    expect(el('single').querySelector('.hx-date-picker-title-button')?.textContent?.trim()).toBe(
      'September',
    );
  });

  it('opens the month and year views from the title', async () => {
    const buttons = el('single').querySelectorAll<HTMLElement>('.hx-date-picker-title-button');
    buttons[0].click(); // month
    await settle();
    expect(el('single').querySelectorAll('.hx-date-picker-month').length).toBe(12);
    (el('single').querySelectorAll('.hx-date-picker-month')[0] as HTMLElement).click();
    await settle();
    expect(el('single').querySelector('[role=grid]')).toBeTruthy();
    expect(el('single').querySelector('.hx-date-picker-title-button')?.textContent?.trim()).toBe(
      'January',
    );

    el('single').querySelectorAll<HTMLElement>('.hx-date-picker-title-button')[1].click(); // year
    await settle();
    expect(el('single').querySelectorAll('.hx-date-picker-year').length).toBe(12);
    (el('single').querySelector('.hx-date-picker-year') as HTMLElement).click();
    await settle();
    expect(el('single').querySelectorAll('.hx-date-picker-month').length).toBe(12);
  });

  it('marks ngModel touched when focus leaves', async () => {
    el('single')
      .querySelector('.hx-date-picker-panel')
      ?.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await settle();
    expect(el('single').classList).toContain('ng-touched');
  });

  it('works with a reactive FormControl, including disable()', async () => {
    expect(selected('reactive')).toEqual(['3']);
    day('reactive', 20).click();
    expect(host.control.value).toEqual(new Date(2026, 9, 20));
    host.control.disable();
    await settle();
    expect(el('reactive').classList).toContain('hx-date-picker-disabled');
    expect(day('reactive', 21).disabled).toBe(true);
  });

  it('works with a signal form field', async () => {
    host.state.set({ day: new Date(2026, 9, 6) });
    await settle();
    day('signal', 8).click();
    await settle();
    expect(host.state().day).toEqual(new Date(2026, 9, 8));
  });
});

@Component({
  imports: [HxDatePicker, FormsModule],
  template: `
    <hx-date-picker id="field" inputId="arrival" ariaLabel="Arrival" placeholder="dd.mm.yyyy" locale="de-DE" showIcon showButtonBar [(ngModel)]="date" />
    <hx-date-picker id="de" ariaLabel="Stay" locale="de-DE" selectionMode="range" [(value)]="range" />
  `,
})
class FieldHost {
  date: Date | null = new Date(2026, 9, 9);
  range = signal<HxDatePickerValue>(null);
}

describe('HxDatePicker field and popup', () => {
  let fixture: ComponentFixture<FieldHost>;
  let host: FieldHost;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const input = (id: string) => el(id).querySelector('input') as HTMLInputElement;
  const popup = () => document.querySelector('.hx-date-picker-popup') as HTMLElement | null;
  const day = (d: number) =>
    popup()?.querySelector<HTMLButtonElement>(`[data-date="2026-10-${d}"]`) as HTMLButtonElement;
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const type = async (id: string, text: string) => {
    input(id).value = text;
    input(id).dispatchEvent(new Event('input'));
    input(id).dispatchEvent(new Event('change'));
    await settle();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FieldHost] }).compileComponents();
    fixture = TestBed.createComponent(FieldHost);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((c) => {
      c.innerHTML = '';
    });
  });

  it('shows the formatted value and a labelled field', () => {
    expect(input('field').value).toBe('09.10.2026');
    expect(input('field').id).toBe('arrival');
    expect(input('field').getAttribute('aria-label')).toBe('Arrival');
    expect(input('field').getAttribute('aria-haspopup')).toBe('dialog');
    expect(input('field').getAttribute('aria-expanded')).toBe('false');
    expect(popup()).toBeNull();
  });

  it('opens a non-modal dialog with the calendar from the icon button and focuses the selected day', async () => {
    const button = el('field').querySelector('.hx-date-picker-trigger') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Choose date');
    button.click();
    await settle();
    await settle();
    expect(popup()?.getAttribute('role')).toBe('dialog');
    expect(popup()?.getAttribute('aria-modal')).toBe('false');
    expect(popup()?.getAttribute('aria-label')).toBe('Arrival');
    expect(input('field').getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(day(9));
  });

  it('chooses a day, writes the value, closes and returns the focus to the field', async () => {
    input('field').click();
    await settle();
    await settle();
    day(15).click();
    await settle();
    expect(host.date).toEqual(new Date(2026, 9, 15));
    expect(input('field').value).toBe('15.10.2026');
    expect(popup()).toBeNull();
    expect(document.activeElement).toBe(input('field'));
  });

  it('closes with Escape and returns the focus to the field', async () => {
    input('field').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await settle();
    await settle();
    document
      .querySelector('.cdk-overlay-pane')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();
    expect(popup()).toBeNull();
    expect(document.activeElement).toBe(input('field'));
  });

  it('parses a typed date in the order of the locale', async () => {
    await type('field', '3.11.2027');
    expect(host.date).toEqual(new Date(2027, 10, 3));
    expect(input('field').value).toBe('03.11.2027');
  });

  it('puts the value back when the typed text is not a date', async () => {
    await type('field', 'soon');
    expect(host.date).toEqual(new Date(2026, 9, 9));
    expect(input('field').value).toBe('09.10.2026');
    await type('field', '31.02.2026');
    expect(host.date).toEqual(new Date(2026, 9, 9));
  });

  it('rejects a typed text with a time, as the picker is days only', async () => {
    await type('field', '03.11.2027 14:05');
    expect(host.date).toEqual(new Date(2026, 9, 9));
    expect(input('field').value).toBe('09.10.2026');
  });

  it('clears the value when the text is emptied', async () => {
    await type('field', '');
    expect(host.date).toBeNull();
  });

  it('has Today and Clear in the button bar', async () => {
    input('field').click();
    await settle();
    const [today, clear] = [
      ...(popup()?.querySelectorAll('.hx-date-picker-button') ?? []),
    ] as HTMLElement[];
    expect(today.textContent?.trim()).toBe('Today');
    clear.click();
    await settle();
    expect(host.date).toBeNull();
    expect(popup()).toBeNull();
    input('field').click();
    await settle();
    ([...(popup()?.querySelectorAll('.hx-date-picker-button') ?? [])][0] as HTMLElement).click();
    await settle();
    const now = new Date();
    expect(host.date).toEqual(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  });

  it('keeps the popup open until the second date of a range', async () => {
    input('de').click();
    await settle();
    await settle();
    const first = popup()?.querySelector<HTMLButtonElement>(
      '.hx-date-picker-date',
    ) as HTMLButtonElement;
    first.click();
    await settle();
    expect(popup()).toBeTruthy();
    const days = popup()?.querySelectorAll<HTMLButtonElement>(
      '.hx-date-picker-date',
    ) as NodeListOf<HTMLButtonElement>;
    days[days.length - 1].click();
    await settle();
    expect(popup()).toBeNull();
    const range = host.range() as Date[];
    expect(range.length).toBe(2);
    expect(input('de').value).toContain(' – ');
  });

  it('marks ngModel touched when focus leaves the field', async () => {
    input('field').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await settle();
    expect(el('field').classList).toContain('ng-touched');
  });
});

const at = (d: number, h = 0, m = 0) => new Date(2026, 9, d, h, m);
const preset = (label: string, from: Date, to: Date): HxDateTimeRangePreset => ({
  label,
  from: () => from,
  to: () => to,
});

@Component({
  imports: [HxDatePicker, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-date-picker id="buttons" inline selectionMode="range" locale="en-US" presetsLabel="Quick ranges" [presets]="list" [(value)]="buttons" />
    <hx-date-picker id="none" inline selectionMode="range" locale="en-US" [(value)]="buttons" />
    <hx-date-picker id="single" inline locale="en-US" [presets]="list" [(value)]="single" />
    <hx-date-picker id="select" inline selectionMode="range" locale="en-US" presetDisplay="select" [presets]="selectList()" [(value)]="select" />
    <hx-date-picker id="limits" inline selectionMode="range" locale="en-US" [minDate]="min" [maxDate]="max" [disabledDates]="blocked()" [presets]="limitList" [(value)]="limits" />
    <hx-date-picker id="limitsSelect" inline selectionMode="range" locale="en-US" presetDisplay="select" [minDate]="min" [maxDate]="max" [disabledDates]="blocked()" [presets]="limitList" [(value)]="limits" />
    <hx-date-picker id="builtIn" inline selectionMode="range" locale="en-US" [presets]="dayPresets" [(value)]="builtIn" />
    <hx-date-picker id="week" inline selectionMode="range" locale="en-US" [firstDayOfWeek]="1" [presets]="weekPresets" [(value)]="week" />
    <hx-date-picker id="popup" selectionMode="range" locale="en-US" ariaLabel="Stay" [presets]="list" [(value)]="popup" />
    <hx-date-picker id="popupLimits" selectionMode="range" locale="en-US" ariaLabel="Limited stay" [minDate]="min" [maxDate]="max" [presets]="limitList" [(value)]="limits" />
    <hx-date-picker id="popupSelect" selectionMode="range" locale="en-US" ariaLabel="Stay" presetDisplay="select" [presets]="list" [(value)]="popup" />
    <hx-date-picker id="model" inline selectionMode="range" locale="en-US" [presets]="list" [(ngModel)]="model" />
    <hx-date-picker id="reactive" inline selectionMode="range" locale="en-US" presetDisplay="select" [presets]="list" [formControl]="control" />
    <hx-date-picker id="signal" inline selectionMode="range" locale="en-US" [presets]="list" [formField]="f.stay" />
    <hx-date-picker id="off" inline selectionMode="range" locale="en-US" [disabled]="true" [presets]="list" [(value)]="buttons" />
    <hx-date-picker id="offSelect" inline selectionMode="range" locale="en-US" presetDisplay="select" [disabled]="true" [presets]="list" [(value)]="buttons" />
    <hx-date-picker id="modelSelect" inline selectionMode="range" locale="en-US" presetDisplay="select" [presets]="list" [(ngModel)]="modelSel" />
  `,
})
class PresetHost {
  list = [
    preset('Two days', at(8, 9, 30), at(10, 18, 15)),
    preset('Reversed', at(20), at(16)),
    preset('Wide', new Date(2026, 8, 1), new Date(2026, 11, 31)),
    preset('Over a blocked day', at(11), at(12, 8)),
  ];
  selectList = signal(this.list);
  limitList = [
    ...this.list,
    preset('Before', new Date(2026, 8, 1), at(4)),
    preset('After', at(29), new Date(2026, 10, 5)),
    preset('Overlap', at(1), at(10)),
  ];
  dayPresets = HX_DATE_RANGE_DAY_PRESETS;
  weekPresets = hxDateRangePresets({ thisWeek: 'Diese Woche' }).filter(
    (p) => p.label === 'Diese Woche',
  );
  min = new Date(2026, 9, 5, 12, 0);
  max = new Date(2026, 9, 28, 6, 0);
  blocked = signal([new Date(2026, 9, 12)]);
  buttons = signal<HxDatePickerValue>(null);
  single = signal<HxDatePickerValue>(null);
  select = signal<HxDatePickerValue>(null);
  limits = signal<HxDatePickerValue>(null);
  builtIn = signal<HxDatePickerValue>(null);
  week = signal<HxDatePickerValue>(null);
  popup = signal<HxDatePickerValue>(null);
  model: HxDatePickerValue = null;
  modelSel: HxDatePickerValue = null;
  control = new FormControl<HxDatePickerValue>(null);
  state = signal<{ stay: HxDatePickerValue }>({ stay: null });
  f = form(this.state);
}

describe('HxDatePicker range presets', () => {
  let fixture: ComponentFixture<PresetHost>;
  let host: PresetHost;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const presetButton = (id: string, label: string) =>
    [...el(id).querySelectorAll<HTMLButtonElement>('.hx-range-preset')].find(
      (b) => b.textContent?.trim() === label,
    ) as HTMLButtonElement;
  const choose = async (id: string, label: string) => {
    presetButton(id, label).click();
    await settle();
  };
  const trigger = (root: HTMLElement) =>
    root.querySelector('.hx-select-trigger') as HTMLButtonElement;
  const options = () =>
    [...document.querySelectorAll<HTMLElement>('.hx-select-option')].map((o) =>
      o.textContent?.trim(),
    );
  const pick = async (root: HTMLElement, label: string) => {
    trigger(root).click();
    await settle();
    const option = [...document.querySelectorAll<HTMLElement>('.hx-select-option')].find(
      (o) => o.textContent?.trim() === label,
    );
    if (!option) throw new Error(`no option ${label}`);
    option.click();
    await settle();
  };
  const popup = () => document.querySelector('.hx-date-picker-popup') as HTMLElement | null;
  const field = (id: string) => el(id).querySelector('input') as HTMLInputElement;
  const selectedDays = (id: string) =>
    [...el(id).querySelectorAll('[role=gridcell][aria-selected=true] button')].map((b) =>
      b.textContent?.trim(),
    );
  const openPopup = async (id: string) => {
    field(id).click();
    await settle();
    await settle();
  };

  const scrollIntoView = Element.prototype.scrollIntoView;
  beforeEach(async () => {
    // jsdom has no layout: the CDK listbox of the preset select scrolls the active option into view
    Element.prototype.scrollIntoView = () => {};
    await TestBed.configureTestingModule({ imports: [PresetHost] }).compileComponents();
    fixture = TestBed.createComponent(PresetHost);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(() => {
    fixture.destroy();
    Element.prototype.scrollIntoView = scrollIntoView;
    document.querySelectorAll('.cdk-overlay-container').forEach((c) => {
      c.innerHTML = '';
    });
  });

  it('lists no presets by default and none outside range mode', () => {
    expect(el('none').querySelector('.hx-range-presets')).toBeNull();
    expect(el('single').querySelector('.hx-range-presets')).toBeNull();
  });

  it('names the preset group with presetsLabel and lists native buttons', () => {
    const group = el('buttons').querySelector('.hx-range-presets') as HTMLElement;
    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-label')).toBe('Quick ranges');
    const buttons = [...group.querySelectorAll('button')];
    expect(buttons.map((b) => b.textContent?.trim())).toEqual([
      'Two days',
      'Reversed',
      'Wide',
      'Over a blocked day',
    ]);
    expect(buttons.every((b) => b.type === 'button')).toBe(true);
    expect(el('buttons').querySelector('hx-select')).toBeNull();
  });

  it('sets the value to the days of a preset at midnight', async () => {
    await choose('buttons', 'Two days');
    expect(host.buttons()).toEqual([new Date(2026, 9, 8), new Date(2026, 9, 10)]);
    expect(el('buttons').querySelector('.hx-date-picker-title-button')?.textContent?.trim()).toBe(
      'October',
    );
    expect(el('buttons').querySelectorAll('.hx-date-picker-date-in-range').length).toBe(1);
  });

  it('orders a preset whose to is before its from', async () => {
    await choose('buttons', 'Reversed');
    expect(host.buttons()).toEqual([new Date(2026, 9, 16), new Date(2026, 9, 20)]);
  });

  it('moves a preset into minDate and maxDate and refuses one over a disabled day', async () => {
    await choose('limits', 'Wide');
    expect(host.limits()).toEqual([new Date(2026, 9, 5), new Date(2026, 9, 28)]);
    await choose('limits', 'Over a blocked day');
    expect(host.limits()).toEqual([new Date(2026, 9, 5), new Date(2026, 9, 28)]);
  });

  it('refuses a preset that a limit moves onto a disabled day', async () => {
    host.blocked.set([new Date(2026, 9, 5)]);
    await settle();
    await choose('limits', 'Wide');
    expect(host.limits()).toBeNull();
  });

  it('does not apply a preset while disabled', async () => {
    const button = presetButton('off', 'Two days');
    expect(button.disabled).toBe(true);
    button.click();
    await settle();
    expect(host.buttons()).toBeNull();
  });

  describe('built-in day presets', () => {
    beforeEach(() =>
      vi.useFakeTimers({ now: new Date(2026, 9, 14, 15, 30, 20), toFake: ['Date'] }),
    );
    afterEach(() => vi.useRealTimers());

    it('offers Today, Last 7 days and This month and keeps midnight', async () => {
      expect(
        [...el('builtIn').querySelectorAll('.hx-range-preset')].map((b) => b.textContent?.trim()),
      ).toEqual(['Today', 'Last 7 days', 'This month']);
      await choose('builtIn', 'Today');
      expect(host.builtIn()).toEqual([new Date(2026, 9, 14), new Date(2026, 9, 14)]);
      await choose('builtIn', 'Last 7 days');
      expect(host.builtIn()).toEqual([new Date(2026, 9, 8), new Date(2026, 9, 14)]);
      await choose('builtIn', 'This month');
      expect(host.builtIn()).toEqual([new Date(2026, 9, 1), new Date(2026, 9, 31)]);
    });

    it('starts This week on the firstDayOfWeek of the picker', async () => {
      await choose('week', 'Diese Woche');
      expect(host.week()).toEqual([new Date(2026, 9, 12), new Date(2026, 9, 18)]);
    });
  });

  describe('select', () => {
    it('shows the presets in a select named by presetsLabel', async () => {
      const root = el('select');
      expect(root.querySelector('.hx-range-preset')).toBeNull();
      expect(trigger(root).getAttribute('aria-label')).toBe('Presets');
      trigger(root).click();
      await settle();
      expect(options()).toEqual(['Two days', 'Reversed', 'Wide', 'Over a blocked day']);
    });

    it('sets the value with a preset chosen in the select and shows it', async () => {
      await pick(el('select'), 'Two days');
      expect(host.select()).toEqual([new Date(2026, 9, 8), new Date(2026, 9, 10)]);
      expect(trigger(el('select')).textContent?.trim()).toBe('Two days');
    });

    it('empties the select once the value changes otherwise', async () => {
      await pick(el('select'), 'Two days');
      el('select').querySelector<HTMLButtonElement>('[data-date="2026-10-20"]')?.click();
      await settle();
      expect(host.select()).toEqual([new Date(2026, 9, 20)]);
      expect(trigger(el('select')).textContent?.trim()).toBe('Presets');
    });

    it('puts the select back when a preset is refused', async () => {
      await pick(el('limitsSelect'), 'Wide');
      await pick(el('limitsSelect'), 'Over a blocked day');
      expect(host.limits()).toEqual([new Date(2026, 9, 5), new Date(2026, 9, 28)]);
      expect(trigger(el('limitsSelect')).textContent?.trim()).toBe('Wide');
    });

    it('is usable with the keyboard only', async () => {
      const root = el('select');
      trigger(root).focus();
      trigger(root).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
      );
      await settle();
      // the CDK listbox reads keyCode
      const list = document.querySelector('.hx-select-list') as HTMLElement;
      const key = async (k: string, keyCode: number) => {
        list.dispatchEvent(new KeyboardEvent('keydown', { key: k, keyCode, bubbles: true }));
        await settle();
      };
      await key('ArrowDown', 40);
      await key('ArrowDown', 40);
      await key('Enter', 13);
      expect(document.querySelector('.hx-select-list')).toBeNull();
      expect(trigger(root).textContent?.trim()).toBe('Reversed');
      expect(host.select()).toEqual([new Date(2026, 9, 16), new Date(2026, 9, 20)]);
    });
  });

  describe('popup', () => {
    it('sets the value, closes the popup and returns the focus to the field', async () => {
      await openPopup('popup');
      const button = [
        ...(popup()?.querySelectorAll<HTMLButtonElement>('.hx-range-preset') ?? []),
      ][0];
      expect(button.textContent?.trim()).toBe('Two days');
      button.click();
      await settle();
      expect(host.popup()).toEqual([new Date(2026, 9, 8), new Date(2026, 9, 10)]);
      expect(popup()).toBeNull();
      expect(document.activeElement).toBe(field('popup'));
      expect(field('popup').value).toBe('10/08/2026 – 10/10/2026');
    });

    it('keeps the popup open while the select list is clicked and applies the choice', async () => {
      await openPopup('popupSelect');
      await pick(popup() as HTMLElement, 'Reversed');
      expect(host.popup()).toEqual([new Date(2026, 9, 16), new Date(2026, 9, 20)]);
      expect(popup()).toBeNull();
    });

    it('focuses the day and keeps the preset buttons as tab stops before the calendar', async () => {
      await openPopup('popup');
      const focused = document.activeElement as HTMLElement;
      expect(focused.classList).toContain('hx-date-picker-date');
      const first = popup()?.querySelector('.hx-range-preset') as HTMLButtonElement;
      expect(first.tabIndex).toBe(0);
      expect(
        first.compareDocumentPosition(focused) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });
  });

  it('works with ngModel, a reactive FormControl and a signal form field', async () => {
    const twoDays = [new Date(2026, 9, 8), new Date(2026, 9, 10)];
    await choose('model', 'Two days');
    expect(host.model).toEqual(twoDays);
    await pick(el('reactive'), 'Two days');
    expect(host.control.value).toEqual(twoDays);
    expect(host.control.dirty).toBe(true);
    await choose('signal', 'Two days');
    expect(host.state().stay).toEqual(twoDays);
  });

  it('disables the preset select with a disabled FormControl', async () => {
    host.control.disable();
    await settle();
    expect(trigger(el('reactive')).disabled).toBe(true);
  });

  describe('refused presets', () => {
    const error = (id: string) =>
      el(id).querySelector('.hx-date-picker-error') as HTMLElement | null;

    it('refuses a preset wholly before minDate or after maxDate instead of cutting it to one day', async () => {
      await choose('limits', 'Before');
      expect(host.limits()).toBeNull();
      await choose('limits', 'After');
      expect(host.limits()).toBeNull();
    });

    it('cuts a preset that overlaps the limits', async () => {
      await choose('limits', 'Overlap');
      expect(host.limits()).toEqual([new Date(2026, 9, 5), new Date(2026, 9, 10)]);
    });

    it('says so in an alert named by the preset buttons, until the next choice', async () => {
      expect(error('limits')).toBeNull();
      await choose('limits', 'Before');
      const message = error('limits') as HTMLElement;
      expect(message.getAttribute('role')).toBe('alert');
      expect(message.textContent?.trim()).toBe('This range cannot be chosen.');
      expect(presetButton('limits', 'Wide').getAttribute('aria-describedby')).toBe(message.id);
      el('limits').querySelector<HTMLButtonElement>('[data-date="2026-10-20"]')?.click();
      await settle();
      expect(error('limits')).toBeNull();
      expect(presetButton('limits', 'Wide').getAttribute('aria-describedby')).toBeNull();
      await choose('limits', 'Over a blocked day');
      expect(error('limits')).not.toBeNull();
      await choose('limits', 'Overlap');
      expect(error('limits')).toBeNull();
    });

    it('names the message from the select and clears it when a preset is taken', async () => {
      await pick(el('limitsSelect'), 'After');
      const message = error('limitsSelect') as HTMLElement;
      expect(trigger(el('limitsSelect')).getAttribute('aria-describedby')).toBe(message.id);
      expect(trigger(el('limitsSelect')).textContent?.trim()).toBe('Presets');
      await pick(el('limitsSelect'), 'Overlap');
      expect(error('limitsSelect')).toBeNull();
      expect(trigger(el('limitsSelect')).textContent?.trim()).toBe('Overlap');
    });

    it('keeps the popup open on a refused preset and drops the message when it opens again', async () => {
      await openPopup('popupLimits');
      const before = [
        ...(popup()?.querySelectorAll<HTMLButtonElement>('.hx-range-preset') ?? []),
      ].find((b) => b.textContent?.trim() === 'Before') as HTMLButtonElement;
      before.click();
      await settle();
      expect(popup()).not.toBeNull();
      expect(popup()?.querySelector('.hx-date-picker-error')).not.toBeNull();
      expect(host.limits()).toBeNull();
      popup()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await settle();
      expect(popup()).toBeNull();
      await openPopup('popupLimits');
      expect(popup()?.querySelector('.hx-date-picker-error')).toBeNull();
    });
  });

  describe('disabled', () => {
    it('disables the preset select with the disabled input', () => {
      expect(trigger(el('offSelect')).disabled).toBe(true);
    });

    it('ignores a preset reported while disabled', async () => {
      const presets = fixture.debugElement.query(By.css('#off')).query(By.directive(HxRangePresets))
        .componentInstance as HxRangePresets;
      presets.chosen.emit(host.list[0]);
      await settle();
      expect(host.buttons()).toBeNull();
      expect(el('off').querySelector('.hx-date-picker-error')).toBeNull();
    });
  });

  describe('selected preset', () => {
    it('keeps the chosen preset when the presets array is replaced by an equal one', async () => {
      await pick(el('select'), 'Two days');
      host.selectList.set(host.list.map((p) => ({ ...p })));
      await settle();
      expect(trigger(el('select')).textContent?.trim()).toBe('Two days');
      host.selectList.set(host.list.filter((p) => p.label !== 'Two days'));
      await settle();
      expect(trigger(el('select')).textContent?.trim()).toBe('Presets');
    });

    it('resets on control.reset() and takes the same preset again', async () => {
      const twoDays = [new Date(2026, 9, 8), new Date(2026, 9, 10)];
      await pick(el('reactive'), 'Two days');
      expect(trigger(el('reactive')).textContent?.trim()).toBe('Two days');
      host.control.reset();
      await settle();
      expect(trigger(el('reactive')).textContent?.trim()).toBe('Presets');
      await pick(el('reactive'), 'Two days');
      expect(host.control.value).toEqual(twoDays);
      expect(trigger(el('reactive')).textContent?.trim()).toBe('Two days');
    });

    it('resets on a value written through ngModel and takes the same preset again', async () => {
      await pick(el('modelSelect'), 'Reversed');
      expect(trigger(el('modelSelect')).textContent?.trim()).toBe('Reversed');
      // what ngModel does when the bound property changes: the control writes the value into the picker
      const ngModel = fixture.debugElement.query(By.css('#modelSelect')).injector.get(NgModel);
      ngModel.control.setValue([new Date(2026, 9, 1), new Date(2026, 9, 2)]);
      await settle();
      expect(selectedDays('modelSelect')).toEqual(['1', '2']);
      expect(trigger(el('modelSelect')).textContent?.trim()).toBe('Presets');
      await pick(el('modelSelect'), 'Reversed');
      expect(host.modelSel).toEqual([new Date(2026, 9, 16), new Date(2026, 9, 20)]);
      expect(trigger(el('modelSelect')).textContent?.trim()).toBe('Reversed');
    });

    it('resets on a value set from outside and takes the same preset again', async () => {
      await pick(el('select'), 'Two days');
      host.select.set([new Date(2026, 9, 1)]);
      await settle();
      expect(trigger(el('select')).textContent?.trim()).toBe('Presets');
      await pick(el('select'), 'Two days');
      expect(host.select()).toEqual([new Date(2026, 9, 8), new Date(2026, 9, 10)]);
      expect(trigger(el('select')).textContent?.trim()).toBe('Two days');
    });
  });

  describe('focus and keyboard', () => {
    const listbox = () => document.querySelector('.hx-select-list') as HTMLElement | null;
    const key = async (target: HTMLElement, k: string, keyCode = 0) => {
      target.dispatchEvent(
        new KeyboardEvent('keydown', { key: k, keyCode, bubbles: true, cancelable: true }),
      );
      await settle();
    };

    it('does not touch an inline picker when the focus moves into the select list, but does when it leaves', async () => {
      const panel = el('reactive').querySelector('.hx-date-picker-panel') as HTMLElement;
      trigger(el('reactive')).click();
      await settle();
      const option = document.querySelector('.hx-select-option') as HTMLElement;
      panel.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: option }));
      await settle();
      expect(host.control.touched).toBe(false);
      panel.dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }),
      );
      await settle();
      expect(host.control.touched).toBe(true);
    });

    it('closes only the preset list with Escape: the popup stays and the select keeps the focus', async () => {
      await openPopup('popupSelect');
      const t = trigger(popup() as HTMLElement);
      t.focus();
      await key(t, 'ArrowDown');
      expect(listbox()).not.toBeNull();
      const panes = document.querySelectorAll('.cdk-overlay-pane');
      await key(panes[panes.length - 1] as HTMLElement, 'Escape');
      expect(listbox()).toBeNull();
      expect(popup()).not.toBeNull();
      expect(document.activeElement).toBe(t);
      // a second Escape closes the popup and returns the focus to the field
      await key(t, 'Escape');
      expect(popup()).toBeNull();
      expect(document.activeElement).toBe(field('popupSelect'));
    });

    it('chooses a preset in the popup select with the keyboard only', async () => {
      await openPopup('popupSelect');
      const t = trigger(popup() as HTMLElement);
      t.focus();
      await key(t, 'ArrowDown');
      const list = listbox() as HTMLElement;
      await key(list, 'ArrowDown', 40);
      await key(list, 'ArrowDown', 40);
      await key(list, 'Enter', 13);
      expect(host.popup()).toEqual([new Date(2026, 9, 16), new Date(2026, 9, 20)]);
      expect(popup()).toBeNull();
      expect(document.activeElement).toBe(field('popupSelect'));
    });

    it('opens with Arrow Down, reaches a preset button and closes with Escape from it', async () => {
      field('popup').focus();
      await key(field('popup'), 'ArrowDown');
      await settle();
      expect(popup()).not.toBeNull();
      const first = popup()?.querySelector('.hx-range-preset') as HTMLButtonElement;
      first.focus();
      expect(document.activeElement).toBe(first);
      await key(first, 'Escape');
      expect(popup()).toBeNull();
      expect(document.activeElement).toBe(field('popup'));
      expect(host.popup()).toBeNull();
    });
  });
});
