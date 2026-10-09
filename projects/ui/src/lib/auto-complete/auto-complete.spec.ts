import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import { HxAutoComplete, type HxAutoCompleteEvent } from './auto-complete';

const COUNTRIES = [
  { name: 'Germany', code: 'DE' },
  { name: 'Greece', code: 'GR' },
  { name: 'Ghana', code: 'GH', disabled: true },
  { name: 'France', code: 'FR' },
];

@Component({
  imports: [HxAutoComplete, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-auto-complete id="single" inputId="single-input" placeholder="Country" [suggestions]="found()" optionLabel="name" [delay]="10" dropdown (complete)="search($event)" [(value)]="country" />
    <hx-auto-complete id="forced" ariaLabel="Forced" [suggestions]="found()" optionLabel="name" [delay]="10" forceSelection (complete)="search($event)" [(ngModel)]="forced" />
    <hx-auto-complete id="multi" ariaLabel="Many" [suggestions]="found()" optionLabel="name" [delay]="10" multiple (complete)="search($event)" [(value)]="many" />
    <hx-auto-complete id="reactive" ariaLabel="Reactive" [suggestions]="['a', 'b']" [formControl]="control" />
    <hx-auto-complete id="signal" ariaLabel="Signal" [suggestions]="[]" [formField]="f.text" />
  `,
})
class Host {
  found = signal<unknown[]>([]);
  queries: string[] = [];
  country = signal<unknown>(null);
  forced: unknown = null;
  many = signal<unknown>([]);
  control = new FormControl<string | null>('a');
  state = signal({ text: 'hi' });
  f = form(this.state);
  search(event: HxAutoCompleteEvent) {
    this.queries.push(event.query);
    this.found.set(
      COUNTRIES.filter((c) => c.name.toLowerCase().includes(event.query.toLowerCase())),
    );
  }
}

describe('HxAutoComplete', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  const el = (id: string) =>
    fixture.debugElement.query(By.css(`#${id}`)).nativeElement as HTMLElement;
  const input = (id: string) => el(id).querySelector('input') as HTMLInputElement;
  const options = () => [...document.querySelectorAll<HTMLElement>('.hx-auto-complete-option')];
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const type = async (id: string, text: string) => {
    input(id).value = text;
    input(id).dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 30));
    await settle();
  };
  const key = (id: string, k: string) =>
    input(id).dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));

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

  it('is a combobox with list autocomplete', () => {
    const field = input('single');
    expect(field.getAttribute('role')).toBe('combobox');
    expect(field.getAttribute('aria-autocomplete')).toBe('list');
    expect(field.getAttribute('aria-expanded')).toBe('false');
    expect(field.id).toBe('single-input');
    expect(field.placeholder).toBe('Country');
  });

  it('emits complete with the query after the delay and shows the suggestions', async () => {
    await type('single', 'g');
    expect(host.queries).toEqual(['g']);
    expect(input('single').getAttribute('aria-expanded')).toBe('true');
    expect(options().map((o) => o.textContent?.trim())).toEqual(['Germany', 'Greece', 'Ghana']);
    expect(document.querySelector('[role=listbox]')).toBeTruthy();
  });

  it('announces the number of results in a polite live region', async () => {
    await type('single', 'g');
    const status = el('single').querySelector('[role=status]') as HTMLElement;
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.textContent).toBe('3 results');
    await type('single', 'zzz');
    expect(status.textContent).toBe('No results found');
  });

  it('waits for minLength characters', async () => {
    input('single').value = '';
    input('single').dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(host.queries).toEqual([]);
  });

  it('moves with the arrows, reports the active option and chooses with Enter', async () => {
    await type('single', 'g');
    key('single', 'ArrowDown');
    await settle();
    expect(input('single').getAttribute('aria-activedescendant')).toBe(options()[0].id);
    key('single', 'ArrowDown');
    await settle();
    key('single', 'Enter');
    await settle();
    expect(host.country()).toEqual(COUNTRIES[1]);
    expect(input('single').value).toBe('Greece');
    expect(input('single').getAttribute('aria-expanded')).toBe('false');
  });

  it('does not choose a disabled option and closes with Escape', async () => {
    await type('single', 'g');
    options()[2].click();
    await settle();
    expect(host.country()).toBe('g'); // still the typed text: the disabled option was not chosen
    key('single', 'Escape');
    await settle();
    expect(input('single').getAttribute('aria-expanded')).toBe('false');
  });

  it('keeps the typed text as the value without forceSelection', async () => {
    await type('single', 'xy');
    expect(host.country()).toBe('xy');
  });

  it('drops text that matches no suggestion with forceSelection', async () => {
    await type('forced', 'xy');
    input('forced').dispatchEvent(new Event('blur'));
    await settle();
    expect(input('forced').value).toBe('');
    expect(host.forced).toBeNull();
    await type('forced', 'fr');
    options()[0].click();
    await settle();
    expect(host.forced).toEqual(COUNTRIES[3]);
  });

  it('asks for all suggestions from the dropdown button', async () => {
    (el('single').querySelector('.hx-auto-complete-dropdown') as HTMLElement).click();
    await settle();
    expect(host.queries).toEqual(['']);
    expect(options().length).toBe(4);
    expect(
      el('single').querySelector('.hx-auto-complete-dropdown')?.getAttribute('aria-label'),
    ).toBe('Show suggestions');
  });

  it('collects chips with multiple and removes them', async () => {
    await type('multi', 'g');
    options()[0].click();
    await settle();
    options()[1].click();
    await settle();
    expect(host.many()).toEqual([COUNTRIES[0], COUNTRIES[1]]);
    const chips = () => [...el('multi').querySelectorAll('.hx-auto-complete-chip')];
    expect(chips().map((c) => c.textContent?.trim())).toEqual(['Germany', 'Greece']);
    (chips()[0].querySelector('button') as HTMLElement).click();
    await settle();
    expect(host.many()).toEqual([COUNTRIES[1]]);
    key('multi', 'Backspace');
    await settle();
    expect(host.many()).toEqual([]);
  });

  it('marks ngModel touched on blur', async () => {
    input('forced').dispatchEvent(new Event('blur'));
    await settle();
    expect(el('forced').classList).toContain('ng-touched');
  });

  it('works with a reactive FormControl, including disable()', async () => {
    expect(input('reactive').value).toBe('a');
    host.control.disable();
    await settle();
    expect(input('reactive').disabled).toBe(true);
    expect(el('reactive').classList).toContain('hx-auto-complete-disabled');
  });

  it('works with a signal form field', async () => {
    expect(input('signal').value).toBe('hi');
    await type('signal', 'ho');
    expect(host.state().text).toBe('ho');
  });
});
