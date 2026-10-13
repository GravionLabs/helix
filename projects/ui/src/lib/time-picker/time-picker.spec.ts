import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { HxTimePicker, type HxTimePickerValue } from './time-picker';

const at = (h: number, m = 0, s = 0) => {
  const d = new Date();
  d.setHours(h, m, s, 0);
  return d;
};

@Component({
  imports: [HxTimePicker, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-time-picker id="t24" inline locale="en-US" [(value)]="t24" />
    <hx-time-picker id="t12" inline hourFormat="12" showSeconds locale="en-US" [(value)]="t12" />
    <hx-time-picker id="hour" inline [showMinutes]="false" showSeconds locale="en-US" [(value)]="hour" />
    <hx-time-picker id="steps" inline [stepHour]="2" [stepMinute]="15" [stepSecond]="10" showSeconds locale="en-US" [(value)]="steps" />
    <hx-time-picker id="range" inline locale="en-US" [minTime]="min" [maxTime]="max" [(value)]="range" />
    <hx-time-picker id="off" inline locale="en-US" [disabled]="true" [(value)]="off" />
    <hx-time-picker id="model" inline locale="en-US" [(ngModel)]="modelValue" />
    <hx-time-picker id="reactive" inline locale="en-US" [formControl]="control" />
    <hx-time-picker id="signal" inline locale="en-US" [formField]="f.at" />
    <hx-time-picker id="field" showButtonBar showIcon locale="en-US" [minTime]="min" [maxTime]="max" [(value)]="typed" />
    <hx-time-picker id="field12" hourFormat="12" locale="en-US" [(value)]="typed12" />
    <hx-time-picker id="fieldHour" [showMinutes]="false" locale="en-US" [(value)]="typedHour" />
  `,
})
class Host {
  min = at(8, 0);
  max = at(17, 30);
  t24 = signal<HxTimePickerValue>(at(14, 30));
  t12 = signal<HxTimePickerValue>(at(15, 5, 7));
  hour = signal<HxTimePickerValue>(at(10, 30, 15));
  steps = signal<HxTimePickerValue>(at(10, 0));
  range = signal<HxTimePickerValue>(at(12, 0));
  off = signal<HxTimePickerValue>(at(9, 0));
  modelValue: Date | null = at(9, 15);
  control = new FormControl<Date | null>(at(11, 0));
  state = signal<{ at: Date | null }>({ at: null });
  f = form(this.state);
  typed = signal<HxTimePickerValue>(null);
  typed12 = signal<HxTimePickerValue>(null);
  typedHour = signal<HxTimePickerValue>(null);
}

describe('HxTimePicker', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const spin = (id: string, name: string) =>
    el(id).querySelector(`[role=spinbutton][aria-label="${name}"]`) as HTMLElement;
  const input = (id: string) => el(id).querySelector('input') as HTMLInputElement;
  const popup = () => document.querySelector('.hx-time-picker-popup') as HTMLElement | null;
  const bar = (i: number) =>
    (popup() as HTMLElement).querySelectorAll<HTMLButtonElement>('.hx-time-picker-button')[i];
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const press = async (target: HTMLElement, key: string) => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    await settle();
  };
  const type = async (id: string, text: string) => {
    input(id).value = text;
    input(id).dispatchEvent(new Event('input'));
    input(id).dispatchEvent(new Event('change'));
    await settle();
  };
  const hm = (d: Date | null) => d && [d.getHours(), d.getMinutes(), d.getSeconds()];

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

  it('shows the time row alone, inline, with the value in its columns', () => {
    expect(el('t24').querySelector('[role=grid]')).toBeNull();
    expect(spin('t24', 'Hour').textContent?.trim()).toBe('14');
    expect(spin('t24', 'Minute').textContent?.trim()).toBe('30');
    expect(spin('t24', 'Second')).toBeNull();
    expect(spin('t24', 'AM/PM')).toBeNull();
  });

  it('24 h: arrow keys change a column and give today at that time', async () => {
    await press(spin('t24', 'Hour'), 'ArrowUp');
    expect(hm(host.t24())).toEqual([15, 30, 0]);
    expect(host.t24()?.toDateString()).toBe(new Date().toDateString());
    await press(spin('t24', 'Minute'), 'ArrowDown');
    expect(hm(host.t24())).toEqual([15, 29, 0]);
  });

  it('12 h: an AM/PM column, hours 1 to 12 and seconds', async () => {
    expect(spin('t12', 'Hour').textContent?.trim()).toBe('03');
    expect(spin('t12', 'Second').textContent?.trim()).toBe('07');
    expect(spin('t12', 'AM/PM').textContent?.trim()).toBe('PM');
    await press(spin('t12', 'AM/PM'), 'ArrowUp');
    expect(hm(host.t12())).toEqual([3, 5, 7]);
    await press(spin('t12', 'Hour'), 'End');
    expect(hm(host.t12())).toEqual([0, 5, 7]);
  });

  it('hour only: no minute column, minutes and seconds are 0', async () => {
    expect(spin('hour', 'Minute')).toBeNull();
    expect(spin('hour', 'Second')).toBeNull();
    await press(spin('hour', 'Hour'), 'ArrowUp');
    expect(hm(host.hour())).toEqual([11, 0, 0]);
  });

  it('steps: the arrow keys move by the step of the column', async () => {
    await press(spin('steps', 'Hour'), 'ArrowUp');
    expect(hm(host.steps())).toEqual([12, 0, 0]);
    await press(spin('steps', 'Minute'), 'ArrowUp');
    expect(hm(host.steps())).toEqual([12, 15, 0]);
    await press(spin('steps', 'Second'), 'ArrowUp');
    expect(hm(host.steps())).toEqual([12, 15, 10]);
  });

  it('minTime and maxTime move the value into the range, comparing only the time of day', async () => {
    await press(spin('range', 'Hour'), 'End');
    expect(hm(host.range())).toEqual([17, 30, 0]);
    await press(spin('range', 'Hour'), 'Home');
    expect(hm(host.range())).toEqual([8, 0, 0]);
  });

  it('disabled: the keys change nothing and the spinbuttons leave the tab order', async () => {
    expect(spin('off', 'Hour').getAttribute('aria-disabled')).toBe('true');
    await press(spin('off', 'Hour'), 'ArrowUp');
    expect(hm(host.off())).toEqual([9, 0, 0]);
  });

  it('inline has no field and no popup', () => {
    expect(el('t24').querySelector('input')).toBeNull();
    expect(el('t24').classList).toContain('hx-time-picker-inline');
  });

  describe('field', () => {
    it('shows the value formatted and opens the popup with the time row', async () => {
      host.typed.set(at(14, 5));
      await settle();
      expect(input('field').value).toBe('14:05');
      input('field').click();
      await settle();
      expect(popup()?.querySelector('[role=spinbutton]')).toBeTruthy();
      expect(popup()?.getAttribute('role')).toBe('dialog');
    });

    it('the button toggles the popup and Escape closes it', async () => {
      const trigger = el('field').querySelector('.hx-time-picker-trigger') as HTMLButtonElement;
      trigger.click();
      await settle();
      expect(popup()).toBeTruthy();
      popup()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await settle();
      expect(popup()).toBeNull();
    });

    it('a column change in the popup sets the value and keeps the popup open', async () => {
      input('field').click();
      await settle();
      await press(popup()?.querySelector('[role=spinbutton]') as HTMLElement, 'ArrowUp');
      expect(hm(host.typed())).toEqual([8, 0, 0]);
      expect(popup()).toBeTruthy();
    });

    it('Now sets the current time, Clear empties the value', async () => {
      input('field').click();
      await settle();
      bar(0).click();
      await settle();
      expect(host.typed()).not.toBeNull();
      input('field').click();
      await settle();
      bar(1).click();
      await settle();
      expect(host.typed()).toBeNull();
      expect(input('field').value).toBe('');
    });

    it('typed input parses 24 h time', async () => {
      await type('field', '14:30');
      expect(hm(host.typed())).toEqual([14, 30, 0]);
      expect(host.typed()?.toDateString()).toBe(new Date().toDateString());
    });

    it('typed input parses 12 h time with AM/PM', async () => {
      await type('field12', '2:30 PM');
      expect(hm(host.typed12())).toEqual([14, 30, 0]);
      await type('field12', '12:15 am');
      expect(hm(host.typed12())).toEqual([0, 15, 0]);
    });

    it('typed input parses an hour alone with showMinutes off', async () => {
      await type('fieldHour', '14');
      expect(hm(host.typedHour())).toEqual([14, 0, 0]);
      await type('fieldHour', '2 PM');
      expect(hm(host.typedHour())).toEqual([14, 0, 0]);
    });

    it('typed input outside minTime..maxTime or unreadable keeps the value', async () => {
      host.typed.set(at(9, 0));
      await settle();
      await type('field', '18:00');
      expect(hm(host.typed())).toEqual([9, 0, 0]);
      expect(input('field').value).toBe('09:00');
      await type('field', 'noon');
      expect(hm(host.typed())).toEqual([9, 0, 0]);
    });

    it('typing nothing clears the value', async () => {
      host.typed.set(at(9, 0));
      await settle();
      await type('field', '');
      expect(host.typed()).toBeNull();
    });
  });

  describe('forms', () => {
    it('works with ngModel', async () => {
      expect(spin('model', 'Hour').textContent?.trim()).toBe('09');
      await press(spin('model', 'Hour'), 'ArrowUp');
      expect(hm(host.modelValue)).toEqual([10, 15, 0]);
    });

    it('works with reactive forms, including disable()', async () => {
      expect(spin('reactive', 'Hour').textContent?.trim()).toBe('11');
      await press(spin('reactive', 'Hour'), 'ArrowUp');
      expect(hm(host.control.value)).toEqual([12, 0, 0]);
      host.control.disable();
      await settle();
      expect(spin('reactive', 'Hour').getAttribute('aria-disabled')).toBe('true');
      expect(el('reactive').classList).toContain('hx-time-picker-disabled');
    });

    it('works with a signal form field', async () => {
      expect(host.f.at().value()).toBeNull();
      await press(spin('signal', 'Hour'), 'ArrowUp');
      expect(hm(host.f.at().value())).toEqual([1, 0, 0]);
      host.state.set({ at: at(16, 45) });
      await settle();
      expect(spin('signal', 'Hour').textContent?.trim()).toBe('16');
      expect(spin('signal', 'Minute').textContent?.trim()).toBe('45');
    });

    it('marks the form field touched when the focus leaves an inline row', async () => {
      const first = spin('reactive', 'Hour');
      first.focus();
      first.dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }),
      );
      await settle();
      expect(host.control.touched).toBe(true);
    });
  });
});
