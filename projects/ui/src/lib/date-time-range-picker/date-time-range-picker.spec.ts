import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import { HxDatePicker } from '../date-picker/date-picker';
import { HxDateTimeRangePicker, type HxDateTimeRangeValue } from './date-time-range-picker';

@Component({
  imports: [HxDateTimeRangePicker, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-date-time-range-picker
      id="basic"
      locale="en-US"
      ariaLabel="Shift"
      inputId="shift-from"
      [stepMinute]="15"
      [(value)]="basic"
    />
    <hx-date-time-range-picker
      id="limits"
      locale="en-US"
      [minDate]="min"
      [maxDate]="max"
      [(value)]="limits"
    />
    <hx-date-time-range-picker
      id="clock"
      locale="en-US"
      timeOnly
      [showMinutes]="false"
      [(value)]="clock"
    />
    <hx-date-time-range-picker
      id="off"
      locale="en-US"
      [disabled]="true"
      [(value)]="basic"
    />
    <hx-date-time-range-picker
      id="labels"
      locale="en-US"
      fromLabel="Start"
      toLabel="End"
      separator="to"
    />
    <hx-date-time-range-picker
      id="model"
      locale="en-US"
      [(ngModel)]="modelValue"
    />
    <hx-date-time-range-picker
      id="reactive"
      locale="en-US"
      [formControl]="control"
    />
    <hx-date-time-range-picker
      id="signal"
      locale="en-US"
      [formField]="f.span"
    />
  `,
})
class Host {
  min = new Date(2026, 9, 5, 8, 0);
  max = new Date(2026, 9, 28, 17, 0);
  basic = signal<HxDateTimeRangeValue>({ from: null, to: null });
  limits = signal<HxDateTimeRangeValue>({ from: null, to: null });
  clock = signal<HxDateTimeRangeValue>({ from: null, to: null });
  modelValue: HxDateTimeRangeValue = {
    from: new Date(2026, 9, 9, 9, 0),
    to: null,
  };
  control = new FormControl<HxDateTimeRangeValue>({
    from: new Date(2026, 9, 3, 12, 0),
    to: null,
  });
  state = signal<{ span: HxDateTimeRangeValue }>({
    span: { from: null, to: null },
  });
  f = form(this.state);
}

describe('HxDateTimeRangePicker', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const input = (id: string, side: 'from' | 'to') =>
    el(id).querySelector(`.hx-date-time-range-picker-${side} input`) as HTMLInputElement;
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const type = async (id: string, side: 'from' | 'to', text: string) => {
    const field = input(id, side);
    field.value = text;
    field.dispatchEvent(new Event('input'));
    field.dispatchEvent(new Event('change'));
    await settle();
  };

  /** Sets a field the way a calendar choice does: through the model of the inner date picker. */
  const pick = async (id: string, side: 'from' | 'to', date: Date) => {
    const picker = fixture.debugElement
      .query(By.css(`#${id} .hx-date-time-range-picker-${side}`))
      .injector.get(HxDatePicker);
    picker.value.set(date);
    await settle();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
    }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  it('renders a named group with a From and a To field', () => {
    const group = el('basic').querySelector('[role=group]') as HTMLElement;
    expect(group.getAttribute('aria-label')).toBe('Shift');
    expect(input('basic', 'from').getAttribute('aria-label')).toBe('From');
    expect(input('basic', 'to').getAttribute('aria-label')).toBe('To');
    expect(input('basic', 'from').id).toBe('shift-from');
    expect(el('basic').querySelector('.hx-date-time-range-picker-separator')?.textContent).toBe(
      '–',
    );
  });

  it('takes its own labels and separator', () => {
    expect(input('labels', 'from').getAttribute('aria-label')).toBe('Start');
    expect(input('labels', 'to').getAttribute('aria-label')).toBe('End');
    expect(el('labels').querySelector('.hx-date-time-range-picker-separator')?.textContent).toBe(
      'to',
    );
  });

  it('chooses from and to with their times', async () => {
    await type('basic', 'from', '10/12/2026, 08:45');
    expect(host.basic()).toEqual({
      from: new Date(2026, 9, 12, 8, 45),
      to: null,
    });
    await type('basic', 'to', '10/12/2026, 17:30');
    expect(host.basic()).toEqual({
      from: new Date(2026, 9, 12, 8, 45),
      to: new Date(2026, 9, 12, 17, 30),
    });
    expect(input('basic', 'to').value).toBe('10/12/2026, 17:30');
  });

  it('moves to up to from when from is set later', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 13, 8, 0),
    });
    await settle();
    await pick('basic', 'from', new Date(2026, 9, 20, 9, 0));
    expect(host.basic()).toEqual({
      from: new Date(2026, 9, 20, 9, 0),
      to: new Date(2026, 9, 20, 9, 0),
    });
  });
  it('keeps to from going before from', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 13, 8, 0),
    });
    await settle();
    await pick('basic', 'to', new Date(2026, 9, 12, 7, 0));
    expect(host.basic()).toEqual({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 12, 8, 0),
    });
  });
  it('clearing one side keeps the other', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 13, 8, 0),
    });
    await settle();
    await type('basic', 'from', '');
    expect(host.basic()).toEqual({
      from: null,
      to: new Date(2026, 9, 13, 8, 0),
    });
    await type('basic', 'to', '');
    expect(host.basic()).toEqual({ from: null, to: null });
  });

  it('keeps the time when the day changes', async () => {
    host.basic.set({ from: new Date(2026, 9, 12, 8, 45), to: null });
    await settle();
    await type('basic', 'from', '10/14/2026, 08:45');
    expect(host.basic().from).toEqual(new Date(2026, 9, 14, 8, 45));
  });

  it('limits each field by the other side, including the time', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 15, 8, 0),
    });
    await settle();
    await type('basic', 'to', '10/12/2026, 07:00');
    expect(host.basic().to).toEqual(new Date(2026, 9, 15, 8, 0));
    await type('basic', 'from', '10/15/2026, 09:00');
    expect(host.basic().from).toEqual(new Date(2026, 9, 12, 8, 0));
    expect(input('basic', 'from').value).toBe('10/12/2026, 08:00');
    await type('basic', 'to', '10/12/2026, 09:30');
    expect(host.basic().to).toEqual(new Date(2026, 9, 12, 9, 30));
  });
  it('applies minDate and maxDate including the time', async () => {
    await type('limits', 'from', '10/05/2026, 06:00');
    expect(host.limits().from).toBeNull();
    await type('limits', 'from', '10/06/2026, 09:00');
    expect(host.limits().from).toEqual(new Date(2026, 9, 6, 9, 0));
    await type('limits', 'to', '10/28/2026, 20:00');
    expect(host.limits().to).toBeNull();
    await type('limits', 'to', '10/28/2026, 16:00');
    expect(host.limits().to).toEqual(new Date(2026, 9, 28, 16, 0));
  });
  it('passes timeOnly and showMinutes through', async () => {
    expect(el('clock').querySelector('.hx-date-picker-grid')).toBeNull();
    await type('clock', 'from', '09');
    await type('clock', 'to', '17');
    const { from, to } = host.clock();
    expect([from?.getHours(), from?.getMinutes()]).toEqual([9, 0]);
    expect([to?.getHours(), to?.getMinutes()]).toEqual([17, 0]);
  });

  it('is disabled as a whole', () => {
    expect(el('off').classList).toContain('hx-date-time-range-picker-disabled');
    expect(input('off', 'from').disabled).toBe(true);
    expect(input('off', 'to').disabled).toBe(true);
  });

  it('works with ngModel', async () => {
    expect(input('model', 'from').value).toBe('10/09/2026, 09:00');
    await type('model', 'to', '10/10/2026, 10:00');
    expect(host.modelValue).toEqual({
      from: new Date(2026, 9, 9, 9, 0),
      to: new Date(2026, 9, 10, 10, 0),
    });
  });

  it('works with a reactive FormControl, including disable()', async () => {
    expect(input('reactive', 'from').value).toBe('10/03/2026, 12:00');
    await type('reactive', 'to', '10/04/2026, 12:00');
    expect(host.control.value?.to).toEqual(new Date(2026, 9, 4, 12, 0));
    host.control.disable();
    await settle();
    expect(input('reactive', 'to').disabled).toBe(true);
  });

  it('works with a signal form field', async () => {
    host.state.set({ span: { from: new Date(2026, 9, 6, 7, 0), to: null } });
    await settle();
    expect(input('signal', 'from').value).toBe('10/06/2026, 07:00');
    await type('signal', 'to', '10/07/2026, 07:00');
    expect(host.state().span.to).toEqual(new Date(2026, 9, 7, 7, 0));
  });

  it('marks ngModel touched when focus leaves a field', async () => {
    input('model', 'from').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await settle();
    expect(el('model').classList).toContain('ng-touched');
  });
});
