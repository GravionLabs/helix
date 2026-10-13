import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { disabled, FormField, form } from '@angular/forms/signals';
import { HxDateTimePicker, type HxDateTimePickerValue } from './date-time-picker';

@Component({
  imports: [HxDateTimePicker],
  template: `<hx-date-time-picker showButtonBar locale="en-US" [disabled]="off()" [(value)]="value" />`,
})
class BarHost {
  value = signal<HxDateTimePickerValue>(null);
  off = signal(false);
}

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
    <hx-date-time-picker id="field" locale="en-US" [minDate]="min" [maxDate]="max" [disabledDates]="blocked" [(value)]="typed" />
    <hx-date-time-picker id="fieldOff" locale="en-US" showIcon [disabled]="true" [(value)]="typedOff" />
    <hx-date-time-picker id="fieldIcon" locale="en-US" showIcon [(value)]="typedIcon" />
    <hx-date-time-picker id="fieldInvalid" locale="en-US" [invalid]="true" />
    <hx-date-time-picker id="ngField" locale="en-US" [ngModel]="ngValue()" (ngModelChange)="ngValue.set($event)" />
    <hx-date-time-picker id="rfField" locale="en-US" [formControl]="rfControl" />
    <hx-date-time-picker id="sfField" locale="en-US" [formField]="f2.at" />
    <hx-date-time-picker id="field12" hourFormat="12" locale="en-US" [(value)]="typed12" />
  `,
})
class DateTimeHost {
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
  blocked = [new Date(2026, 9, 15)];
  typedOff = signal<HxDateTimePickerValue>(new Date(2026, 9, 9, 10, 30));
  typedIcon = signal<HxDateTimePickerValue>(null);
  ngValue = signal<Date | null>(new Date(2026, 9, 9, 10, 30));
  rfControl = new FormControl<Date | null>(new Date(2026, 9, 3, 12, 0));
  sfOff = signal(false);
  state2 = signal<{ at: Date | null }>({ at: new Date(2026, 9, 3, 12, 0) });
  f2 = form(this.state2, (p) => {
    disabled(p.at, () => this.sfOff());
  });
  typed12 = signal<HxDateTimePickerValue>(null);
}

describe('HxDateTimePicker', () => {
  let fixture: ComponentFixture<DateTimeHost>;
  let host: DateTimeHost;
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
    await TestBed.configureTestingModule({ imports: [DateTimeHost] }).compileComponents();
    fixture = TestBed.createComponent(DateTimeHost);
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

  it('clamps a time step to maxDate including the time', async () => {
    host.when.set(new Date(2026, 9, 28, 16, 30));
    await settle();
    await press(spin('dt', 'Hour'), 'ArrowUp'); // 17:30 is after 17:00
    expect(host.when()).toEqual(new Date(2026, 9, 28, 17, 0));
  });

  it('clamps a chosen day to minDate including the time', async () => {
    host.when.set(new Date(2026, 9, 6, 9, 0));
    await settle();
    day('dt', 5).click(); // 9:00 on the 5th is after 8:00
    await settle();
    expect(host.when()).toEqual(new Date(2026, 9, 5, 9, 0));
  });

  it('allows any time on a day between minDate and maxDate', async () => {
    host.when.set(new Date(2026, 9, 6, 9, 0));
    await settle();
    await press(spin('dt', 'Hour'), 'Home');
    expect(host.when()).toEqual(new Date(2026, 9, 6, 0, 0));
  });

  it('moves a time before minDate on its day back to the minimum', async () => {
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

  describe('forms', () => {
    const at = (h: number, m = 0) => new Date(2026, 9, 3, h, m);
    const leave = async (id: string) => {
      input(id).dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }),
      );
      await settle();
    };

    it('ngModel: the model shows in the field', async () => {
      expect(input('ngField').value).toBe('10/09/2026, 10:30');
      host.ngValue.set(at(15, 45));
      await settle();
      await settle();
      expect(input('ngField').value).toBe('10/03/2026, 15:45');
    });

    it('ngModel: null empties the field', async () => {
      host.ngValue.set(null);
      await settle();
      await settle();
      expect(input('ngField').value).toBe('');
    });

    it('ngModel: typing writes the model', async () => {
      await type('ngField', '10/12/2026, 08:45');
      expect(host.ngValue()).toEqual(new Date(2026, 9, 12, 8, 45));
    });

    it('reactive: setValue shows in the field', async () => {
      host.rfControl.setValue(at(7, 5));
      await settle();
      expect(input('rfField').value).toBe('10/03/2026, 07:05');
    });

    it('reactive: patchValue shows in the field', async () => {
      host.rfControl.patchValue(at(18, 20));
      await settle();
      expect(input('rfField').value).toBe('10/03/2026, 18:20');
    });

    it('reactive: reset to null empties the field', async () => {
      host.rfControl.reset(null);
      await settle();
      expect(input('rfField').value).toBe('');
    });

    it('reactive: setValue drops text typed and not committed', async () => {
      input('rfField').value = 'half typed';
      input('rfField').dispatchEvent(new Event('input'));
      await settle();
      host.rfControl.setValue(at(7, 5));
      await settle();
      expect(input('rfField').value).toBe('10/03/2026, 07:05');
    });

    it('signal forms: the model shows in the field and null empties it', async () => {
      expect(input('sfField').value).toBe('10/03/2026, 12:00');
      host.state2.set({ at: at(9, 30) });
      await settle();
      expect(input('sfField').value).toBe('10/03/2026, 09:30');
      host.state2.set({ at: null });
      await settle();
      expect(input('sfField').value).toBe('');
    });

    it('signal forms: typing writes the model', async () => {
      await type('sfField', '10/12/2026, 08:45');
      expect(host.f2.at().value()).toEqual(new Date(2026, 9, 12, 8, 45));
    });

    it('reactive: disable() and enable() toggle the field', async () => {
      host.rfControl.disable();
      await settle();
      expect(input('rfField').disabled).toBe(true);
      expect(el('rfField').classList).toContain('hx-date-time-picker-disabled');
      host.rfControl.enable();
      await settle();
      expect(input('rfField').disabled).toBe(false);
      expect(el('rfField').classList).not.toContain('hx-date-time-picker-disabled');
    });

    it('ngModel: setDisabledState disables the field through the directive', async () => {
      const picker = fixture.debugElement.query((d) => d.nativeElement.id === 'ngField')
        .componentInstance as HxDateTimePicker;
      picker.setDisabledState(true);
      await settle();
      expect(input('ngField').disabled).toBe(true);
      picker.setDisabledState(false);
      await settle();
      expect(input('ngField').disabled).toBe(false);
    });

    it('signal forms: disabled() toggles the field', async () => {
      host.sfOff.set(true);
      await settle();
      expect(input('sfField').disabled).toBe(true);
      expect(el('sfField').classList).toContain('hx-date-time-picker-disabled');
      host.sfOff.set(false);
      await settle();
      expect(input('sfField').disabled).toBe(false);
    });

    it('ngModel: marks touched when the focus leaves the field', async () => {
      const model = fixture.debugElement.query((d) => d.nativeElement.id === 'ngField').injector;
      const ngModel = model.get(NgModel);
      expect(ngModel.touched).toBe(false);
      await leave('ngField');
      expect(ngModel.touched).toBe(true);
    });

    it('reactive: marks touched when the focus leaves the field', async () => {
      expect(host.rfControl.touched).toBe(false);
      await leave('rfField');
      expect(host.rfControl.touched).toBe(true);
    });

    it('signal forms: marks touched when the focus leaves the field', async () => {
      expect(host.f2.at().touched()).toBe(false);
      await leave('sfField');
      expect(host.f2.at().touched()).toBe(true);
    });

    it('invalid: sets the class and aria-invalid', () => {
      expect(el('fieldInvalid').classList).toContain('hx-date-time-picker-invalid');
      expect(input('fieldInvalid').getAttribute('aria-invalid')).toBe('true');
      expect(input('field').getAttribute('aria-invalid')).toBeNull();
    });
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

  it('accepts typed text inside maxDate and rejects it after, with the time', async () => {
    await type('field', '10/28/2026, 16:00');
    expect(host.typed()).toEqual(new Date(2026, 9, 28, 16, 0));
    await type('field', '10/28/2026, 18:00');
    expect(host.typed()).toEqual(new Date(2026, 9, 28, 16, 0));
    expect(input('field').value).toBe('10/28/2026, 16:00');
  });

  it('rejects typed text before minDate and puts the text back', async () => {
    host.typed.set(new Date(2026, 9, 9, 14, 5));
    await settle();
    await type('field', '10/05/2026, 07:00');
    expect(host.typed()).toEqual(new Date(2026, 9, 9, 14, 5));
    expect(input('field').value).toBe('10/09/2026, 14:05');
  });

  it('rejects typed text on a disabled date and puts the text back', async () => {
    host.typed.set(new Date(2026, 9, 9, 14, 5));
    await settle();
    await type('field', '10/15/2026, 10:00');
    expect(host.typed()).toEqual(new Date(2026, 9, 9, 14, 5));
    expect(input('field').value).toBe('10/09/2026, 14:05');
  });

  it('commits typed text with Enter', async () => {
    input('field').value = '10/12/2026, 08:45';
    input('field').dispatchEvent(new Event('input'));
    await press(input('field'), 'Enter');
    expect(host.typed()).toEqual(new Date(2026, 9, 12, 8, 45));
  });

  it('commits typed text when the focus leaves the field', async () => {
    input('field').value = '10/12/2026, 08:45';
    input('field').dispatchEvent(new Event('input'));
    input('field').dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }),
    );
    await settle();
    expect(host.typed()).toEqual(new Date(2026, 9, 12, 8, 45));
  });

  it('does not commit null for empty text while the value is null', async () => {
    const changes: unknown[] = [];
    const picker = fixture.debugElement.query((d) => d.nativeElement.id === 'ngField')
      .componentInstance as HxDateTimePicker;
    picker.registerOnChange((v) => changes.push(v));
    host.ngValue.set(null);
    await settle();
    await settle();
    await type('ngField', '');
    expect(changes).toEqual([]);
  });

  describe('disabled field', () => {
    it('has the disabled class and attribute', () => {
      expect(input('fieldOff').disabled).toBe(true);
      expect(el('fieldOff').classList).toContain('hx-date-time-picker-disabled');
      expect(
        (el('fieldOff').querySelector('.hx-date-time-picker-trigger') as HTMLButtonElement)
          .disabled,
      ).toBe(true);
    });

    it('does not open', async () => {
      input('fieldOff').click();
      await press(input('fieldOff'), 'ArrowDown');
      expect(popup()).toBeNull();
    });

    it('does not commit typed text', async () => {
      await type('fieldOff', '10/12/2026, 08:45');
      expect(host.typedOff()).toEqual(new Date(2026, 9, 9, 10, 30));
    });

    it('closes an open popup when the control becomes disabled', async () => {
      const bar = TestBed.createComponent(BarHost);
      bar.detectChanges();
      await bar.whenStable();
      (bar.nativeElement.querySelector('input') as HTMLInputElement).click();
      bar.detectChanges();
      await bar.whenStable();
      expect(popup()).toBeTruthy();
      bar.componentInstance.off.set(true);
      bar.detectChanges();
      await bar.whenStable();
      bar.detectChanges();
      expect(popup()).toBeNull();
    });
  });

  describe('popup', () => {
    const openPopup = async (id: string) => {
      input(id).click();
      await settle();
      await settle();
    };

    it('opens with the calendar button', async () => {
      (el('fieldIcon').querySelector('.hx-date-time-picker-trigger') as HTMLElement).click();
      await settle();
      await settle();
      expect(popup()).toBeTruthy();
      (el('fieldIcon').querySelector('.hx-date-time-picker-trigger') as HTMLElement).click();
      await settle();
      expect(popup()).toBeNull();
    });

    it('opens with Arrow Down', async () => {
      await press(input('field'), 'ArrowDown');
      expect(popup()).toBeTruthy();
    });

    it('opens with Alt+Arrow Up', async () => {
      input('field').dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'ArrowUp',
          altKey: true,
          bubbles: true,
          cancelable: true,
        }),
      );
      await settle();
      expect(popup()).toBeTruthy();
    });

    it('does not name the inner group again', async () => {
      await openPopup('field');
      expect(popup()?.getAttribute('aria-label')).toBe('Choose date and time');
      expect(popup()?.querySelector('.hx-date-time-picker-panel')?.hasAttribute('aria-label')).toBe(
        false,
      );
    });

    it('names the inline group with the label', () => {
      expect(el('dt').querySelector('.hx-date-time-picker-panel')?.getAttribute('aria-label')).toBe(
        'Choose date and time',
      );
    });

    it('closes on a click outside', async () => {
      await openPopup('field');
      expect(popup()).toBeTruthy();
      document.body.click();
      await settle();
      expect(popup()).toBeNull();
    });
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

  it('clears the value with the Clear button and closes', async () => {
    const bar = TestBed.createComponent(BarHost);
    bar.componentInstance.value.set(new Date(2026, 9, 9, 10, 30));
    bar.detectChanges();
    await bar.whenStable();
    (bar.nativeElement.querySelector('input') as HTMLInputElement).click();
    bar.detectChanges();
    await bar.whenStable();
    ([...document.querySelectorAll('.hx-date-time-picker-button')][1] as HTMLElement).click();
    bar.detectChanges();
    await bar.whenStable();
    expect(bar.componentInstance.value()).toBeNull();
    expect(document.querySelector('.hx-date-time-picker-popup')).toBeNull();
  });
});
