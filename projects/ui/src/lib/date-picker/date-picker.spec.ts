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
    expect(stops[0].getAttribute('data-date')).toBe('2026-10-9');
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
