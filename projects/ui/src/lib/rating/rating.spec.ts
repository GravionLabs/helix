import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { HxRating } from './rating';

@Component({
  imports: [HxRating, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-rating id="model" ariaLabel="Quality" [(ngModel)]="score" />
    <hx-rating id="ten" [stars]="10" [(value)]="ten" />
    <hx-rating id="ro" readonly [value]="3" />
    <hx-rating id="reactive" [formControl]="control" />
    <hx-rating id="signal" [formField]="f.pick" />
  `,
})
class Host {
  score: number | null = 2;
  ten = signal<number | null>(null);
  control = new FormControl<number | null>(4);
  state = signal<{ pick: number | null }>({ pick: null });
  f = form(this.state);
}

describe('HxRating', () => {
  let fixture: ComponentFixture<Host>;
  const host = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const radios = (id: string) => [...host(id).querySelectorAll('input')] as HTMLInputElement[];
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const choose = (field: HTMLInputElement) => {
    field.checked = true;
    field.dispatchEvent(new Event('change'));
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    await settle();
  });

  it('is a radio group of five labelled radios sharing one name', () => {
    expect(host('model').getAttribute('role')).toBe('radiogroup');
    expect(host('model').getAttribute('aria-label')).toBe('Quality');
    const list = radios('model');
    expect(list.length).toBe(5);
    expect(list.map((r) => r.getAttribute('aria-label'))).toEqual([
      '1 star',
      '2 stars',
      '3 stars',
      '4 stars',
      '5 stars',
    ]);
    expect(new Set(list.map((r) => r.name)).size).toBe(1);
    expect(list.every((r) => r.type === 'radio')).toBe(true);
    expect(radios('ten').length).toBe(10);
  });

  it('checks the star of the value and fills the stars up to it', () => {
    expect(radios('model').map((r) => r.checked)).toEqual([false, true, false, false, false]);
    expect(host('model').querySelectorAll('.hx-rating-star-active').length).toBe(2);
  });

  it('writes the value when a star is chosen', async () => {
    choose(radios('model')[3]);
    await settle();
    expect(fixture.componentInstance.score).toBe(4);
    choose(radios('ten')[6]);
    await settle();
    expect(fixture.componentInstance.ten()).toBe(7);
    expect(host('ten').querySelectorAll('.hx-rating-star-active').length).toBe(7);
  });

  it('keeps a star focusable by keyboard', () => {
    radios('model')[1].focus();
    expect(document.activeElement).toBe(radios('model')[1]);
  });

  it('is an image with a spoken value when read only', () => {
    expect(host('ro').getAttribute('role')).toBe('img');
    expect(host('ro').getAttribute('aria-label')).toBe('3 of 5 stars');
    expect(radios('ro').length).toBe(0);
    expect(host('ro').querySelectorAll('.hx-rating-star-active').length).toBe(3);
  });

  it('marks ngModel touched when focus leaves', async () => {
    host('model').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await settle();
    expect(host('model').classList).toContain('ng-touched');
  });

  it('works with a reactive FormControl, including disable()', async () => {
    expect(radios('reactive').map((r) => r.checked)).toEqual([false, false, false, true, false]);
    choose(radios('reactive')[0]);
    expect(fixture.componentInstance.control.value).toBe(1);
    fixture.componentInstance.control.disable();
    await settle();
    expect(radios('reactive').every((r) => r.disabled)).toBe(true);
  });

  it('works with a signal form field', async () => {
    choose(radios('signal')[2]);
    await settle();
    expect(fixture.componentInstance.state().pick).toBe(3);
  });
});
