import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { HxSlider, type HxSliderValue } from './slider';

@Component({
  imports: [HxSlider, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-slider id="model" ariaLabel="Volume" inputId="vol" [(ngModel)]="volume" />
    <hx-slider id="range" range ariaLabelStart="Minimum" ariaLabelEnd="Maximum" [min]="0" [max]="200" [step]="10" [(value)]="span" />
    <hx-slider id="vertical" orientation="vertical" ariaLabel="Gain" [(value)]="gain" />
    <hx-slider id="reactive" ariaLabel="Reactive" [formControl]="control" />
    <hx-slider id="signal" ariaLabel="Signal" [formField]="f.level" />
  `,
})
class Host {
  volume = 30;
  span = signal<HxSliderValue>([20, 120]);
  gain = signal<HxSliderValue>(50);
  control = new FormControl(10);
  state = signal({ level: 5 });
  f = form(this.state);
}

describe('HxSlider', () => {
  let fixture: ComponentFixture<Host>;
  const inputs = (id: string) =>
    [...fixture.nativeElement.querySelectorAll(`#${id} input`)] as HTMLInputElement[];
  const host = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const slide = (field: HTMLInputElement, value: number) => {
    field.value = String(value);
    field.dispatchEvent(new Event('input'));
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    await settle();
  });

  it('is a native range input with a name, bounds and value', () => {
    const [field] = inputs('model');
    expect(field.type).toBe('range');
    expect(field.id).toBe('vol');
    expect(field.getAttribute('aria-label')).toBe('Volume');
    expect([field.min, field.max, field.step, field.value]).toEqual(['0', '100', '1', '30']);
    expect(field.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('names each thumb of a range and shows both values', () => {
    const [start, end] = inputs('range');
    expect(start.getAttribute('aria-label')).toBe('Minimum');
    expect(end.getAttribute('aria-label')).toBe('Maximum');
    expect([start.value, end.value]).toEqual(['20', '120']);
    expect(host('range').style.getPropertyValue('--hx-slider-start')).toBe('10%');
    expect(host('range').style.getPropertyValue('--hx-slider-end')).toBe('60%');
  });

  it('writes the value on input', async () => {
    slide(inputs('model')[0], 55);
    await settle();
    expect(fixture.componentInstance.volume).toBe(55);
    slide(inputs('range')[1], 150);
    await settle();
    expect(fixture.componentInstance.span()).toEqual([20, 150]);
  });

  it('keeps the start thumb at or below the end thumb', async () => {
    const [start, end] = inputs('range');
    slide(start, 180);
    await settle();
    expect(fixture.componentInstance.span()).toEqual([120, 120]);
    expect(start.value).toBe('120');
    slide(end, 10);
    await settle();
    expect(fixture.componentInstance.span()).toEqual([120, 120]);
  });

  it('is vertical on request', () => {
    expect(host('vertical').classList).toContain('hx-slider-vertical');
    expect(inputs('vertical')[0].getAttribute('aria-orientation')).toBe('vertical');
  });

  it('keeps the thumb focusable by keyboard', () => {
    inputs('model')[0].focus();
    expect(document.activeElement).toBe(inputs('model')[0]);
  });

  it('marks ngModel touched when focus leaves', async () => {
    inputs('model')[0].dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await settle();
    expect(host('model').classList).toContain('ng-touched');
  });

  it('works with a reactive FormControl, including disable()', async () => {
    expect(inputs('reactive')[0].value).toBe('10');
    slide(inputs('reactive')[0], 40);
    expect(fixture.componentInstance.control.value).toBe(40);
    fixture.componentInstance.control.disable();
    await settle();
    expect(inputs('reactive')[0].disabled).toBe(true);
    expect(host('reactive').classList).toContain('hx-slider-disabled');
  });

  it('works with a signal form field', async () => {
    slide(inputs('signal')[0], 70);
    await settle();
    expect(fixture.componentInstance.state().level).toBe(70);
  });
});
