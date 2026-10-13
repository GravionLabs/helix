import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { HxDateTimeRangePicker, type HxDateTimeRangeValue } from './date-time-range-picker';

@Component({
  imports: [HxDateTimeRangePicker, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-date-time-range-picker
      id="basic"
      locale="en-US"
      ariaLabel="Shift"
      inputId="shift"
      placeholder="Pick a range"
      showButtonBar
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
      [(value)]="labels"
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
  labels = signal<HxDateTimeRangeValue>({
    from: new Date(2026, 0, 1, 0, 0),
    to: new Date(2026, 0, 2, 0, 15),
  });
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
  const input = (id: string) => el(id).querySelector('input') as HTMLInputElement;
  const popup = () =>
    document.querySelector('.hx-date-time-range-picker-popup') as HTMLElement | null;
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const open = async (id: string) => {
    el(id).querySelector<HTMLButtonElement>('.hx-date-picker-trigger')?.click();
    await settle();
  };
  const day = (d: number, month = 10) =>
    popup()?.querySelector<HTMLButtonElement>(
      `.hx-date-picker-date[data-date="2026-${month}-${d}"]`,
    ) as HTMLButtonElement;
  const click = async (button: HTMLElement) => {
    button.click();
    await settle();
  };
  const submit = async () =>
    click(popup()?.querySelector('.hx-date-time-range-picker-submit') as HTMLElement);
  const spin = (side: 'from' | 'to', name: string) =>
    popup()?.querySelector(
      `.hx-date-time-range-picker-${side} [role=spinbutton][aria-label="${name}"]`,
    ) as HTMLElement;
  const press = async (target: HTMLElement, key: string) => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
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

  afterEach(() => fixture.destroy());

  it('is one read-only field with one button', () => {
    expect(el('basic').querySelectorAll('input').length).toBe(1);
    expect(el('basic').querySelectorAll('button').length).toBe(1);
    expect(input('basic').readOnly).toBe(true);
    expect(input('basic').id).toBe('shift');
    expect(input('basic').placeholder).toBe('Pick a range');
    expect(input('basic').getAttribute('aria-label')).toBe('Shift');
  });

  it('shows the range as one text', () => {
    expect(input('labels').value).toBe('1/1/2026 00:00 to 1/2/2026 00:15');
    expect(input('basic').value).toBe('');
  });

  it('opens one calendar with a time row for from and for to', async () => {
    await open('basic');
    expect(popup()?.getAttribute('role')).toBe('dialog');
    expect(popup()?.querySelectorAll('[role=grid]').length).toBe(1);
    expect(spin('from', 'Hour')).not.toBeNull();
    expect(spin('to', 'Hour')).not.toBeNull();
    expect(popup()?.querySelector('.hx-date-time-range-picker-to [role=grid]')).toBeNull();
  });

  it('takes the labels of the time rows', async () => {
    await open('labels');
    const captions = [...popup()!.querySelectorAll('.hx-date-time-range-picker-caption')];
    expect(captions.map((c) => c.textContent?.trim())).toEqual(['Start', 'End']);
  });

  it('chooses the range with two day clicks and applies it with Submit', async () => {
    await open('basic');
    await click(day(12));
    await click(day(15));
    expect(host.basic()).toEqual({ from: null, to: null });
    expect(input('basic').value).toBe('');
    await submit();
    expect(host.basic()).toEqual({
      from: new Date(2026, 9, 12, 0, 0),
      to: new Date(2026, 9, 15, 0, 0),
    });
    expect(input('basic').value).toBe('10/12/2026 00:00 - 10/15/2026 00:00');
    expect(popup()).toBeNull();
  });

  it('drops the changes with Cancel', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 13, 9, 0),
    });
    await settle();
    await open('basic');
    await click(day(20));
    await click(day(22));
    await click(popup()!.querySelector('.hx-date-time-range-picker-cancel') as HTMLElement);
    expect(popup()).toBeNull();
    expect(host.basic()).toEqual({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 13, 9, 0),
    });
    await open('basic');
    expect(
      day(12).getAttribute('aria-selected') ?? day(12).parentElement?.getAttribute('aria-selected'),
    ).toBe('true');
  });

  it('drops the changes with Escape', async () => {
    await open('basic');
    await click(day(12));
    await click(day(15));
    popup()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();
    expect(host.basic()).toEqual({ from: null, to: null });
  });
  it('marks the range in the calendar', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 14, 9, 0),
    });
    await settle();
    await open('basic');
    const selected = [
      ...popup()!.querySelectorAll(
        '[role=gridcell][aria-selected=true] button, .hx-date-picker-date-in-range',
      ),
    ];
    expect(selected.map((b) => b.textContent?.trim()).sort()).toEqual(['12', '13', '14']);
  });

  it('keeps the times when the days change', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 45),
      to: new Date(2026, 9, 13, 17, 30),
    });
    await settle();
    await open('basic');
    await click(day(20));
    await click(day(22));
    await submit();
    expect(host.basic()).toEqual({
      from: new Date(2026, 9, 20, 8, 45),
      to: new Date(2026, 9, 22, 17, 30),
    });
  });

  it('changes the time of each end with its time row', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 13, 9, 0),
    });
    await settle();
    await open('basic');
    await press(spin('from', 'Minute'), 'ArrowUp');
    expect(popup()?.querySelector('.hx-date-time-range-picker-from')?.textContent).toContain('15');
    expect(host.basic().from).toEqual(new Date(2026, 9, 12, 8, 0));
    await press(spin('to', 'Hour'), 'ArrowUp');
    await submit();
    expect(host.basic().to).toEqual(new Date(2026, 9, 13, 10, 0));
  });

  it('starts from at the to time when only to is changed on an empty range', async () => {
    await open('basic');
    await press(spin('to', 'Hour'), 'ArrowUp');
    await submit();
    const { from, to } = host.basic();
    expect(to).not.toBeNull();
    expect(from).toEqual(to);
    expect(input('basic').value.trim().startsWith('-')).toBe(false);
  });

  it('keeps to from going before from on the same day', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 12, 9, 0),
    });
    await settle();
    await open('basic');
    await press(spin('to', 'Hour'), 'ArrowDown');
    await press(spin('to', 'Hour'), 'ArrowDown');
    await submit();
    const { from, to } = host.basic();
    expect(from && to && to.getTime() >= from.getTime()).toBe(true);
  });

  it('moves from to to when a day click is the same day with an earlier to time', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 13, 7, 0),
    });
    await settle();
    await open('basic');
    await click(day(18));
    await click(day(18));
    await submit();
    const { from, to } = host.basic();
    expect(from?.getDate()).toBe(18);
    expect(to && from && to >= from).toBe(true);
  });

  it('applies minDate and maxDate to the days and the times', async () => {
    await open('limits');
    expect(day(4).getAttribute('aria-disabled')).toBe('true');
    expect(day(29).getAttribute('aria-disabled')).toBe('true');
    await click(day(5));
    await submit();
    expect(host.limits().from).toEqual(new Date(2026, 9, 5, 8, 0));
  });

  it('shows only the time rows with timeOnly', async () => {
    await open('clock');
    expect(popup()?.querySelector('[role=grid]')).toBeNull();
    expect(spin('from', 'Minute')).toBeNull();
    await press(spin('from', 'Hour'), 'ArrowUp');
    await press(spin('to', 'Hour'), 'ArrowUp');
    await submit();
    const { from, to } = host.clock();
    expect([from?.getMinutes(), to?.getMinutes()]).toEqual([0, 0]);
    expect(input('clock').value).toMatch(/\d - \d/);
  });

  it('clears the draft with the Clear button, applied with Submit', async () => {
    host.basic.set({
      from: new Date(2026, 9, 12, 8, 0),
      to: new Date(2026, 9, 13, 9, 0),
    });
    await settle();
    await open('basic');
    await click(popup()!.querySelector('.hx-date-picker-button') as HTMLElement);
    expect(host.basic().from).not.toBeNull();
    await submit();
    expect(host.basic()).toEqual({ from: null, to: null });
    expect(popup()).toBeNull();
  });
  it('closes with Escape and returns the focus to the field', async () => {
    await open('basic');
    popup()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();
    expect(popup()).toBeNull();
    expect(document.activeElement).toBe(input('basic'));
  });

  it('opens with Arrow Down on the field', async () => {
    input('basic').dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      }),
    );
    await settle();
    expect(popup()).not.toBeNull();
  });

  it('is disabled as a whole', async () => {
    expect(input('off').disabled).toBe(true);
    expect(el('off').querySelector<HTMLButtonElement>('button')?.disabled).toBe(true);
    await open('off');
    expect(popup()).toBeNull();
  });

  it('works with ngModel', async () => {
    expect(input('model').value).toBe('9/9/2026'.replace('9/9', '10/9') + ' 09:00 -');
    await open('model');
    await click(day(12));
    await submit();
    expect(host.modelValue).toEqual({
      from: new Date(2026, 9, 9, 9, 0),
      to: new Date(2026, 9, 12, 9, 0),
    });
  });

  it('works with a reactive FormControl, including disable()', async () => {
    expect(input('reactive').value).toBe('10/3/2026 12:00 -');
    host.control.disable();
    await settle();
    expect(input('reactive').disabled).toBe(true);
  });

  it('works with a signal form field', async () => {
    host.state.set({
      span: {
        from: new Date(2026, 9, 6, 7, 0),
        to: new Date(2026, 9, 7, 7, 0),
      },
    });
    await settle();
    expect(input('signal').value).toBe('10/6/2026 07:00 - 10/7/2026 07:00');
    await open('signal');
    await click(day(10));
    await click(day(11));
    await submit();
    expect(host.state().span).toEqual({
      from: new Date(2026, 9, 10, 7, 0),
      to: new Date(2026, 9, 11, 7, 0),
    });
  });

  it('marks ngModel touched when the focus leaves', async () => {
    el('model').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await settle();
    expect(el('model').classList).toContain('ng-touched');
  });
});
