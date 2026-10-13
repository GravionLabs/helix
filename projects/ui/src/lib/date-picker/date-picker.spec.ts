import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
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

@Component({
  imports: [HxDatePicker, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-date-picker id="dt" inline showTime locale="en-US" [stepMinute]="15" [minDate]="min" [maxDate]="max" [(value)]="when" />
    <hx-date-picker id="h12" inline showTime hourFormat="12" showSeconds locale="en-US" [(value)]="clock" />
    <hx-date-picker id="only" inline timeOnly locale="en-US" [(value)]="only" />
    <hx-date-picker id="plain" inline locale="en-US" [(value)]="plain" />
    <hx-date-picker id="multiT" inline showTime selectionMode="multiple" locale="en-US" [(value)]="multiT" />
    <hx-date-picker id="off" inline showTime locale="en-US" [disabled]="true" [(value)]="off" />
    <hx-date-picker id="rng" inline showTime selectionMode="range" locale="en-US" [(value)]="rng" />
    <hx-date-picker id="model" inline showTime locale="en-US" [(ngModel)]="modelValue" />
    <hx-date-picker id="reactive" inline showTime locale="en-US" [formControl]="control" />
    <hx-date-picker id="signal" inline showTime locale="en-US" [formField]="f.at" />
    <hx-date-picker id="field" showTime locale="en-US" [minDate]="min" [maxDate]="max" [(value)]="typed" />
    <hx-date-picker id="field12" showTime hourFormat="12" locale="en-US" [(value)]="typed12" />
    <hx-date-picker id="fieldOnly" timeOnly locale="en-US" [(value)]="typedOnly" />
  `,
})
class TimeHost {
  min = new Date(2026, 9, 5, 8, 0);
  max = new Date(2026, 9, 28, 17, 0);
  when = signal<HxDatePickerValue>(new Date(2026, 9, 9, 10, 30));
  clock = signal<HxDatePickerValue>(new Date(2026, 9, 9, 15, 5, 7));
  only = signal<HxDatePickerValue>(null);
  plain = signal<HxDatePickerValue>(new Date(2026, 9, 9, 10, 30));
  rng = signal<HxDatePickerValue>(null);
  multiT = signal<HxDatePickerValue>([]);
  off = signal<HxDatePickerValue>(new Date(2026, 9, 9, 10, 30));
  modelValue: Date | null = new Date(2026, 9, 9, 10, 30);
  control = new FormControl<Date | null>(new Date(2026, 9, 3, 12, 0));
  state = signal<{ at: Date | null }>({ at: null });
  f = form(this.state);
  typed = signal<HxDatePickerValue>(null);
  typed12 = signal<HxDatePickerValue>(null);
  typedOnly = signal<HxDatePickerValue>(null);
}

describe('HxDatePicker time', () => {
  let fixture: ComponentFixture<TimeHost>;
  let host: TimeHost;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const spin = (id: string, name: string) =>
    el(id).querySelector(`[role=spinbutton][aria-label="${name}"]`) as HTMLElement;
  const day = (id: string, d: number) =>
    el(id).querySelector<HTMLButtonElement>(
      `.hx-date-picker-date[data-date="2026-10-${d}"]`,
    ) as HTMLButtonElement;
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const press = async (target: HTMLElement, key: string) => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    await settle();
  };
  const input = (id: string) => el(id).querySelector('input') as HTMLInputElement;
  const popup = () => document.querySelector('.hx-date-picker-popup') as HTMLElement | null;
  const type = async (id: string, text: string) => {
    input(id).value = text;
    input(id).dispatchEvent(new Event('input'));
    input(id).dispatchEvent(new Event('change'));
    await settle();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TimeHost] }).compileComponents();
    fixture = TestBed.createComponent(TimeHost);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((c) => {
      c.innerHTML = '';
    });
  });

  it('shows the time row only with showTime or timeOnly', () => {
    expect(el('dt').querySelector('.hx-date-picker-time')).toBeTruthy();
    expect(el('plain').querySelector('.hx-date-picker-time')).toBeNull();
    expect(el('rng').querySelector('.hx-date-picker-time')).toBeNull();
    expect(el('only').querySelector('[role=grid]')).toBeNull();
    expect(el('only').querySelector('.hx-date-picker-header')).toBeNull();
  });

  it('exposes every column as a spinbutton with its value and range', () => {
    const hour = spin('dt', 'Hour');
    expect(hour.getAttribute('aria-valuenow')).toBe('10');
    expect(hour.getAttribute('aria-valuemin')).toBe('0');
    expect(hour.getAttribute('aria-valuemax')).toBe('23');
    expect(hour.getAttribute('aria-valuetext')).toBe('10');
    expect(spin('dt', 'Minute').getAttribute('aria-valuenow')).toBe('30');
    expect(spin('dt', 'Second')).toBeNull();
    expect(spin('h12', 'Second').getAttribute('aria-valuenow')).toBe('7');
  });

  it('sets the time with the arrow buttons', async () => {
    const buttons = el('dt').querySelectorAll<HTMLButtonElement>('.hx-date-picker-time-button');
    buttons[0].click(); // hour up
    await settle();
    expect(host.when()).toEqual(new Date(2026, 9, 9, 11, 30));
    buttons[3].click(); // minute down, by the step of 15
    await settle();
    expect(host.when()).toEqual(new Date(2026, 9, 9, 11, 15));
  });

  it('changes by the step with Arrow Up and Down and wraps around', async () => {
    await press(spin('dt', 'Minute'), 'ArrowUp');
    expect(host.when()).toEqual(new Date(2026, 9, 9, 10, 45));
    await press(spin('dt', 'Minute'), 'ArrowUp');
    expect(host.when()).toEqual(new Date(2026, 9, 9, 10, 0));
    await press(spin('dt', 'Minute'), 'ArrowDown');
    expect(host.when()).toEqual(new Date(2026, 9, 9, 10, 45));
    expect(spin('dt', 'Minute').textContent?.trim()).toBe('45');
  });

  it('changes by a larger step with Page Up and Down and jumps with Home and End', async () => {
    await press(spin('dt', 'Hour'), 'PageUp');
    expect(host.when()).toEqual(new Date(2026, 9, 9, 16, 30));
    await press(spin('dt', 'Hour'), 'PageDown');
    await press(spin('dt', 'Hour'), 'PageDown');
    expect(host.when()).toEqual(new Date(2026, 9, 9, 4, 30));
    await press(spin('dt', 'Hour'), 'End');
    expect(host.when()).toEqual(new Date(2026, 9, 9, 23, 30));
    await press(spin('dt', 'Hour'), 'Home');
    expect(host.when()).toEqual(new Date(2026, 9, 9, 0, 30));
  });

  it('works in 12 hours with an AM/PM column', async () => {
    expect(spin('h12', 'Hour').getAttribute('aria-valuenow')).toBe('3');
    expect(spin('h12', 'Hour').getAttribute('aria-valuemin')).toBe('1');
    expect(spin('h12', 'Hour').getAttribute('aria-valuemax')).toBe('12');
    expect(spin('h12', 'AM/PM').getAttribute('aria-valuetext')).toBe('PM');
    await press(spin('h12', 'Hour'), 'End');
    expect(host.clock()).toEqual(new Date(2026, 9, 9, 12, 5, 7));
    await press(spin('h12', 'Hour'), 'ArrowUp'); // 12 PM wraps to 1 PM
    expect(host.clock()).toEqual(new Date(2026, 9, 9, 13, 5, 7));
    await press(spin('h12', 'AM/PM'), 'ArrowUp');
    expect(host.clock()).toEqual(new Date(2026, 9, 9, 1, 5, 7));
    expect(spin('h12', 'AM/PM').getAttribute('aria-valuetext')).toBe('AM');
    expect(spin('h12', 'Hour').textContent?.trim()).toBe('01');
  });

  it('has a seconds column with its own step', async () => {
    await press(spin('h12', 'Second'), 'ArrowUp');
    expect(host.clock()).toEqual(new Date(2026, 9, 9, 15, 5, 8));
    await press(spin('h12', 'Second'), 'End');
    expect(host.clock()).toEqual(new Date(2026, 9, 9, 15, 5, 59));
  });

  it('keeps the time when another day is chosen', async () => {
    day('dt', 14).click();
    await settle();
    expect(host.when()).toEqual(new Date(2026, 9, 14, 10, 30));
    // without showTime the day starts at midnight, as before
    day('plain', 14).click();
    await settle();
    expect(host.plain()).toEqual(new Date(2026, 9, 14));
  });

  it('takes today when a time is set without a date', async () => {
    await press(spin('only', 'Hour'), 'ArrowUp');
    const now = new Date();
    expect(host.only()).toEqual(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 0));
  });

  it('checks minDate and maxDate including the time', async () => {
    host.when.set(new Date(2026, 9, 28, 16, 30));
    await settle();
    await press(spin('dt', 'Hour'), 'ArrowUp'); // 17:30 is after 17:00
    expect(host.when()).toEqual(new Date(2026, 9, 28, 17, 0));
    host.when.set(new Date(2026, 9, 6, 9, 0));
    await settle();
    day('dt', 5).click(); // 9:00 on the 5th is after 8:00
    await settle();
    expect(host.when()).toEqual(new Date(2026, 9, 5, 9, 0));
    host.when.set(new Date(2026, 9, 6, 9, 0));
    await settle();
    await press(spin('dt', 'Hour'), 'Home');
    expect(host.when()).toEqual(new Date(2026, 9, 6, 0, 0));
    host.when.set(new Date(2026, 9, 5, 9, 0));
    await settle();
    await press(spin('dt', 'Hour'), 'Home'); // before 8:00 on the 5th: back to the minimum
    expect(host.when()).toEqual(new Date(2026, 9, 5, 8, 0));
  });

  it('ignores showTime for range and multiple', async () => {
    day('rng', 3).click();
    await settle();
    expect(host.rng()).toEqual([new Date(2026, 9, 3)]);
  });

  it('ignores showTime for multiple and changes nothing while disabled', async () => {
    expect(el('multiT').querySelector('.hx-date-picker-time')).toBeNull();
    day('multiT', 3).click();
    await settle();
    expect(host.multiT()).toEqual([new Date(2026, 9, 3)]);
    await press(spin('off', 'Hour'), 'ArrowUp');
    expect(host.off()).toEqual(new Date(2026, 9, 9, 10, 30));
    expect(spin('off', 'Hour').getAttribute('aria-disabled')).toBe('true');
  });

  it('writes to ngModel, reactive forms and signal forms', async () => {
    await press(spin('model', 'Hour'), 'ArrowUp');
    expect(host.modelValue).toEqual(new Date(2026, 9, 9, 11, 30));
    await press(spin('reactive', 'Minute'), 'ArrowUp');
    expect(host.control.value).toEqual(new Date(2026, 9, 3, 12, 1));
    host.state.set({ at: new Date(2026, 9, 6, 8, 0) });
    await settle();
    expect(spin('signal', 'Hour').getAttribute('aria-valuenow')).toBe('8');
    await press(spin('signal', 'Hour'), 'ArrowUp');
    expect(host.state().at).toEqual(new Date(2026, 9, 6, 9, 0));
  });

  it('formats the field with the time and parses it back', async () => {
    host.typed.set(new Date(2026, 9, 9, 14, 5));
    await settle();
    expect(input('field').value).toBe('10/09/2026, 14:05');
    await type('field', '10/12/2026, 08:45');
    expect(host.typed()).toEqual(new Date(2026, 9, 12, 8, 45));
    expect(input('field').value).toBe('10/12/2026, 08:45');
    await type('field', '2026-10-13 09:15');
    expect(host.typed()).toEqual(new Date(2026, 9, 13, 9, 15));
  });

  it('parses 12 hour text with AM/PM and rejects what is not a time', async () => {
    await type('field12', '10/09/2026, 03:45 PM');
    expect(host.typed12()).toEqual(new Date(2026, 9, 9, 15, 45));
    expect(input('field12').value).toBe('10/09/2026, 03:45 PM');
    await type('field12', '10/09/2026, 12:10 am');
    expect(host.typed12()).toEqual(new Date(2026, 9, 9, 0, 10));
    await type('field12', '10/09/2026, 13:10 PM');
    expect(host.typed12()).toEqual(new Date(2026, 9, 9, 0, 10));
    await type('field12', '10/09/2026, 25:10');
    expect(host.typed12()).toEqual(new Date(2026, 9, 9, 0, 10));
    await type('field12', '10/09/2026');
    expect(host.typed12()).toEqual(new Date(2026, 9, 9, 0, 10));
  });

  it('rejects typed text outside minDate and maxDate with the time', async () => {
    await type('field', '10/28/2026, 16:00');
    expect(host.typed()).toEqual(new Date(2026, 9, 28, 16, 0));
    await type('field', '10/28/2026, 18:00');
    expect(host.typed()).toEqual(new Date(2026, 9, 28, 16, 0));
  });

  it('shows and parses only the time for timeOnly', async () => {
    await type('fieldOnly', '07:30');
    const now = new Date();
    expect(host.typedOnly()).toEqual(
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 30),
    );
    expect(input('fieldOnly').value).toBe('07:30');
  });

  it('keeps the day of the value when a time is typed for timeOnly', async () => {
    host.typedOnly.set(new Date(2026, 9, 2, 10, 0));
    await settle();
    await type('fieldOnly', '07:30');
    expect(host.typedOnly()).toEqual(new Date(2026, 9, 2, 7, 30));
    await type('field', '10/12/2026, 08:45 foo');
    expect(host.typed()).toBeNull();
  });

  it('keeps the popup open on a day with showTime and closes it with Escape', async () => {
    input('field').click();
    await settle();
    await settle();
    popup()
      ?.querySelector<HTMLButtonElement>('.hx-date-picker-date:not([aria-disabled=true])')
      ?.click();
    await settle();
    expect(popup()).toBeTruthy();
    document
      .querySelector('.cdk-overlay-pane')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();
    expect(popup()).toBeNull();
  });

  it('closes when the focus leaves the control', async () => {
    input('field').click();
    await settle();
    await settle();
    const outside = document.createElement('button');
    document.body.append(outside);
    popup()?.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: outside }));
    await settle();
    expect(popup()).toBeNull();
    outside.remove();
  });

  it('closes with the button bar', async () => {
    const bar = TestBed.createComponent(BarHost);
    bar.detectChanges();
    await bar.whenStable();
    (bar.nativeElement.querySelector('input') as HTMLInputElement).click();
    bar.detectChanges();
    await bar.whenStable();
    ([...document.querySelectorAll('.hx-date-picker-button')][0] as HTMLElement).click();
    bar.detectChanges();
    await bar.whenStable();
    expect(document.querySelector('.hx-date-picker-popup')).toBeNull();
    const now = new Date();
    expect((bar.componentInstance.value() as Date).getDate()).toBe(now.getDate());
  });
});

@Component({
  imports: [HxDatePicker],
  template: `<hx-date-picker showTime showButtonBar [(value)]="value" />`,
})
class BarHost {
  value = signal<HxDatePickerValue>(null);
}
