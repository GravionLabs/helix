import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { HxDateTimePicker, type HxDateTimePickerValue } from './date-time-picker';

@Component({
  imports: [HxDateTimePicker, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-date-time-picker id="dt" inline locale="en-US" [stepMinute]="15" [minDate]="min" [maxDate]="max" [(value)]="when" />
    <hx-date-time-picker id="h12" inline hourFormat="12" showSeconds locale="en-US" [(value)]="clock" />
    <hx-date-time-picker id="off" inline locale="en-US" [disabled]="true" [(value)]="off" />
    <hx-date-time-picker id="hrs" inline [showMinutes]="false" showSeconds locale="en-US" [(value)]="hrs" />
    <hx-date-time-picker id="hrsField" [showMinutes]="false" locale="en-US" [(value)]="hrsTyped" />
    <hx-date-time-picker id="model" inline locale="en-US" [(ngModel)]="modelValue" />
    <hx-date-time-picker id="reactive" inline locale="en-US" [formControl]="control" />
    <hx-date-time-picker id="signal" inline locale="en-US" [formField]="f.at" />
    <hx-date-time-picker id="field" locale="en-US" [minDate]="min" [maxDate]="max" [(value)]="typed" />
    <hx-date-time-picker id="field12" hourFormat="12" locale="en-US" [(value)]="typed12" />
  `,
})
class TimeHost {
  min = new Date(2026, 9, 5, 8, 0);
  max = new Date(2026, 9, 28, 17, 0);
  when = signal<HxDateTimePickerValue>(new Date(2026, 9, 9, 10, 30));
  clock = signal<HxDateTimePickerValue>(new Date(2026, 9, 9, 15, 5, 7));
  hrs = signal<HxDateTimePickerValue>(new Date(2026, 9, 9, 10, 30, 15));
  hrsTyped = signal<HxDateTimePickerValue>(null);
  off = signal<HxDateTimePickerValue>(new Date(2026, 9, 9, 10, 30));
  modelValue: Date | null = new Date(2026, 9, 9, 10, 30);
  control = new FormControl<Date | null>(new Date(2026, 9, 3, 12, 0));
  state = signal<{ at: Date | null }>({ at: null });
  f = form(this.state);
  typed = signal<HxDateTimePickerValue>(null);
  typed12 = signal<HxDateTimePickerValue>(null);
}

describe('HxDateTimePicker', () => {
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
  const popup = () => document.querySelector('.hx-date-time-picker-popup') as HTMLElement | null;
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

  it('shows the calendar and the time row', () => {
    expect(el('dt').querySelector('.hx-date-picker-time')).toBeTruthy();
    expect(el('dt').querySelector('[role=grid]')).toBeTruthy();
    expect(el('dt').querySelector('.hx-date-picker-header')).toBeTruthy();
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

  it('picks only the hour with showMinutes off: no minute or second column', async () => {
    expect(spin('hrs', 'Hour').getAttribute('aria-valuenow')).toBe('10');
    expect(spin('hrs', 'Minute')).toBeNull();
    expect(spin('hrs', 'Second')).toBeNull(); // showSeconds is ignored
    expect(el('hrs').querySelectorAll('[role=spinbutton]').length).toBe(1);
    await press(spin('hrs', 'Hour'), 'ArrowUp');
    expect(host.hrs()).toEqual(new Date(2026, 9, 9, 11, 0, 0));
    day('hrs', 14).click();
    await settle();
    expect(host.hrs()).toEqual(new Date(2026, 9, 14, 11, 0, 0));
  });

  it('formats and parses the hour only', async () => {
    host.hrsTyped.set(new Date(2026, 9, 9, 14, 30));
    await settle();
    expect(input('hrsField').value).toBe('10/09/2026, 14');
    await type('hrsField', '10/12/2026, 08');
    expect(host.hrsTyped()).toEqual(new Date(2026, 9, 12, 8, 0));
    await type('hrsField', '10/13/2026 9:00');
    expect(host.hrsTyped()).toEqual(new Date(2026, 9, 13, 9, 0));
    await type('hrsField', '10/14/2026, 9:30');
    expect(host.hrsTyped()).toEqual(new Date(2026, 9, 13, 9, 0));
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

  it('takes today when a time is set without a date', async () => {
    host.when.set(null);
    await settle();
    await press(spin('dt', 'Hour'), 'ArrowUp');
    const now = new Date();
    expect(host.when()).toEqual(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 0));
  });

  it('changes nothing while disabled', async () => {
    await press(spin('off', 'Hour'), 'ArrowUp');
    expect(host.off()).toEqual(new Date(2026, 9, 9, 10, 30));
    expect(spin('off', 'Hour').getAttribute('aria-disabled')).toBe('true');
    day('off', 14).click();
    await settle();
    expect(host.off()).toEqual(new Date(2026, 9, 9, 10, 30));
  });

  it('clears the value when the text is emptied and puts it back when it is not a date', async () => {
    host.typed.set(new Date(2026, 9, 9, 14, 5));
    await settle();
    await type('field', 'soon');
    expect(host.typed()).toEqual(new Date(2026, 9, 9, 14, 5));
    expect(input('field').value).toBe('10/09/2026, 14:05');
    await type('field', '10/12/2026, 08:45 foo');
    expect(host.typed()).toEqual(new Date(2026, 9, 9, 14, 5));
    await type('field', '');
    expect(host.typed()).toBeNull();
  });

  it('rejects typed text outside minDate and maxDate with the time', async () => {
    await type('field', '10/28/2026, 16:00');
    expect(host.typed()).toEqual(new Date(2026, 9, 28, 16, 0));
    await type('field', '10/28/2026, 18:00');
    expect(host.typed()).toEqual(new Date(2026, 9, 28, 16, 0));
  });

  it('keeps the popup open on a day with and closes it with Escape', async () => {
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
    ([...document.querySelectorAll('.hx-date-time-picker-button')][0] as HTMLElement).click();
    bar.detectChanges();
    await bar.whenStable();
    expect(document.querySelector('.hx-date-time-picker-popup')).toBeNull();
    const now = new Date();
    expect((bar.componentInstance.value() as Date).getDate()).toBe(now.getDate());
  });
});

@Component({
  imports: [HxDateTimePicker],
  template: `<hx-date-time-picker showButtonBar [(value)]="value" />`,
})
class BarHost {
  value = signal<HxDateTimePickerValue>(null);
}
