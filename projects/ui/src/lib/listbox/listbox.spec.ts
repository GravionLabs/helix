import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { HxListbox } from './listbox';

const CITIES = [
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN', disabled: true },
  { name: 'Istanbul', code: 'IST' },
];

@Component({
  imports: [HxListbox, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-listbox id="single" ariaLabel="City" [options]="cities" optionLabel="name" optionValue="code" [(ngModel)]="city" scrollHeight="8rem" />
    <hx-listbox id="multi" ariaLabel="Toppings" [options]="['cheese', 'ham', 'olives']" multiple checkmark filter [(value)]="toppings" />
    <hx-listbox id="reactive" ariaLabel="Reactive" [options]="['a', 'b']" [formControl]="control" />
    <hx-listbox id="signal" ariaLabel="Signal" [options]="['x', 'y']" [formField]="f.pick" />
    <hx-listbox id="empty" ariaLabel="Empty" [options]="[]" emptyMessage="Nothing here" />
  `,
})
class Host {
  cities = CITIES;
  city: string | null = 'RM';
  toppings = signal<unknown>(['ham']);
  control = new FormControl<string | null>('b');
  state = signal({ pick: 'x' });
  f = form(this.state);
}

describe('HxListbox', () => {
  let fixture: ComponentFixture<Host>;
  const host = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  const list = (id: string) => host(id).querySelector('[role="listbox"]') as HTMLElement;
  const options = (id: string) => [...host(id).querySelectorAll<HTMLElement>('[role="option"]')];
  const selected = (id: string) =>
    options(id)
      .filter((o) => o.getAttribute('aria-selected') === 'true')
      .map((o) => o.textContent?.trim());
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    // jsdom has no layout: the CDK listbox scrolls the active option into view
    Element.prototype.scrollIntoView = () => {};
    fixture = TestBed.createComponent(Host);
    await settle();
  });

  it('is a labelled listbox with an option per entry', () => {
    expect(list('single').getAttribute('aria-label')).toBe('City');
    expect(list('single').getAttribute('aria-multiselectable')).toBe('false');
    expect(options('single').map((o) => o.textContent?.trim())).toEqual([
      'New York',
      'Rome',
      'London',
      'Istanbul',
    ]);
    expect(selected('single')).toEqual(['Rome']);
    expect(options('single')[2].getAttribute('aria-disabled')).toBe('true');
    expect(host('single').querySelector<HTMLElement>('.hx-listbox-scroll')?.style.maxHeight).toBe(
      '8rem',
    );
  });

  it('chooses an option by click, not a disabled one, and keeps the choice on a second click', async () => {
    options('single')[0].click();
    await settle();
    expect(fixture.componentInstance.city).toBe('NY');
    options('single')[2].click();
    await settle();
    expect(fixture.componentInstance.city).toBe('NY');
    options('single')[0].click();
    await settle();
    expect(fixture.componentInstance.city).toBe('NY');
  });

  it('is multiselectable with checkmarks and collects values', async () => {
    expect(list('multi').getAttribute('aria-multiselectable')).toBe('true');
    expect(host('multi').classList).toContain('hx-listbox-checkmark');
    expect(selected('multi')).toEqual(['ham']);
    options('multi')[0].click();
    await settle();
    expect(fixture.componentInstance.toppings()).toEqual(['ham', 'cheese']);
    options('multi')[1].click();
    await settle();
    expect(fixture.componentInstance.toppings()).toEqual(['cheese']);
  });

  it('filters the options by label and keeps the hidden selection', async () => {
    const filter = host('multi').querySelector('input.hx-listbox-filter') as HTMLInputElement;
    expect(filter.getAttribute('aria-label')).toBe('Filter');
    filter.value = 'ol';
    filter.dispatchEvent(new Event('input'));
    await settle();
    expect(options('multi').map((o) => o.textContent?.trim())).toEqual(['olives']);
    options('multi')[0].click();
    await settle();
    expect(fixture.componentInstance.toppings()).toEqual(['ham', 'olives']);
  });

  it('shows the empty message', () => {
    expect(host('empty').querySelector('.hx-listbox-empty')?.textContent).toBe('Nothing here');
  });

  it('moves with the arrow keys and chooses with Enter', async () => {
    list('reactive').focus();
    // the CDK reads `keyCode`
    const key = (keyCode: number) =>
      list('reactive').dispatchEvent(new KeyboardEvent('keydown', { keyCode, bubbles: true }));
    key(38); // ArrowUp
    await settle();
    key(13); // Enter
    await settle();
    expect(fixture.componentInstance.control.value).toBe('a');
  });

  it('marks ngModel touched when focus leaves', async () => {
    host('single').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await settle();
    expect(host('single').classList).toContain('ng-touched');
  });

  it('works with a reactive FormControl, including disable()', async () => {
    expect(selected('reactive')).toEqual(['b']);
    options('reactive')[0].click();
    expect(fixture.componentInstance.control.value).toBe('a');
    fixture.componentInstance.control.disable();
    await settle();
    expect(host('reactive').classList).toContain('hx-listbox-disabled');
    expect(list('reactive').getAttribute('aria-disabled')).toBe('true');
  });

  it('works with a signal form field', async () => {
    options('signal')[1].click();
    await settle();
    expect(fixture.componentInstance.state().pick).toBe('y');
  });
});
