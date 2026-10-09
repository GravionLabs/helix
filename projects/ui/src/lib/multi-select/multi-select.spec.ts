import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import { HxMultiSelect } from './multi-select';

const CITIES = [
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN', disabled: true },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PAR' },
];

@Component({
  imports: [HxMultiSelect, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-multi-select id="plain" inputId="plain-trigger" placeholder="Pick" [options]="cities" optionLabel="name" optionValue="code" [(value)]="picked" [showClear]="true" filter showToggleAll [maxSelectedLabels]="3" />
    <hx-multi-select id="chips" ariaLabel="Chips" [options]="cities" optionLabel="name" optionValue="code" display="chip" [(ngModel)]="chips" />
    <hx-multi-select id="reactive" ariaLabel="Reactive" [options]="['a', 'b']" [formControl]="control" />
    <hx-multi-select id="signal" ariaLabel="Signal" [options]="['x', 'y']" [formField]="f.pick" />
  `,
})
class Host {
  cities = CITIES;
  picked = signal<string[]>([]);
  chips: string[] = ['NY', 'RM'];
  control = new FormControl<string[]>(['b']);
  state = signal({ pick: ['x'] });
  f = form(this.state);
}

describe('HxMultiSelect', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  const el = (id: string) =>
    fixture.debugElement.query(By.css(`#${id}`)).nativeElement as HTMLElement;
  const trigger = (id: string) => el(id).querySelector('.hx-multi-select-trigger') as HTMLElement;
  const label = (id: string) =>
    el(id).querySelector('.hx-multi-select-label')?.textContent?.replace(/\s+/g, ' ').trim();
  const panel = () => document.querySelector('.hx-multi-select-panel') as HTMLElement | null;
  const options = () => [...document.querySelectorAll<HTMLElement>('.hx-multi-select-option')];
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    // jsdom has no layout: the CDK listbox scrolls the active option into view
    Element.prototype.scrollIntoView = () => {};
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

  it('shows the placeholder and wires the trigger as a combobox', () => {
    expect(label('plain')).toBe('Pick');
    const t = trigger('plain');
    expect(t.getAttribute('role')).toBe('combobox');
    expect(t.getAttribute('aria-haspopup')).toBe('listbox');
    expect(t.getAttribute('aria-expanded')).toBe('false');
    expect(t.getAttribute('tabindex')).toBe('0');
    expect(t.id).toBe('plain-trigger');
  });

  it('opens a multiselectable listbox and stays open while choosing', async () => {
    trigger('plain').click();
    await settle();
    expect(trigger('plain').getAttribute('aria-expanded')).toBe('true');
    expect(panel()?.querySelector('[role=listbox]')?.getAttribute('aria-multiselectable')).toBe(
      'true',
    );
    options()[0].click();
    await settle();
    options()[1].click();
    await settle();
    expect(host.picked()).toEqual(['NY', 'RM']);
    expect(panel()).toBeTruthy();
    expect(label('plain')).toBe('New York, Rome');
    options()[0].click();
    await settle();
    expect(host.picked()).toEqual(['RM']);
  });

  it('does not select a disabled option', async () => {
    trigger('plain').click();
    await settle();
    expect(options()[2].getAttribute('aria-disabled')).toBe('true');
    options()[2].click();
    await settle();
    expect(host.picked()).toEqual([]);
  });

  it('opens with ArrowDown and closes with Escape, focus back on the trigger', async () => {
    trigger('plain').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    await settle();
    expect(panel()).toBeTruthy();
    document
      .querySelector('.cdk-overlay-pane')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settle();
    expect(panel()).toBeNull();
    expect(document.activeElement).toBe(trigger('plain'));
  });

  it('summarizes beyond maxSelectedLabels', async () => {
    host.picked.set(['NY', 'RM', 'IST', 'PAR']);
    await settle();
    expect(label('plain')).toBe('4 items selected');
  });

  it('filters the options by label', async () => {
    trigger('plain').click();
    await settle();
    const field = panel()?.querySelector('input.hx-multi-select-filter') as HTMLInputElement;
    expect(field.getAttribute('aria-label')).toBe('Search');
    field.value = 'ri';
    field.dispatchEvent(new Event('input'));
    await settle();
    expect(options().map((o) => o.textContent?.trim())).toEqual(['Paris']);
  });

  it('toggles all enabled, visible options with a labelled checkbox', async () => {
    trigger('plain').click();
    await settle();
    const all = panel()?.querySelector('input.hx-multi-select-toggle-all') as HTMLInputElement;
    expect(all.getAttribute('aria-label')).toBe('Select all');
    all.click();
    await settle();
    expect(host.picked()).toEqual(['NY', 'RM', 'IST', 'PAR']);
    expect(all.checked).toBe(true);
    all.click();
    await settle();
    expect(host.picked()).toEqual([]);
  });

  it('clears the selection', async () => {
    host.picked.set(['NY']);
    await settle();
    (el('plain').querySelector('.hx-multi-select-clear') as HTMLElement).click();
    await settle();
    expect(host.picked()).toEqual([]);
  });

  it('shows chips that can be removed', async () => {
    const chips = () => [...el('chips').querySelectorAll('.hx-multi-select-chip')];
    expect(chips().map((c) => c.textContent?.trim())).toEqual(['New York', 'Rome']);
    const remove = chips()[0].querySelector('button') as HTMLButtonElement;
    expect(remove.getAttribute('aria-label')).toBe('Remove New York');
    remove.click();
    await settle();
    expect(host.chips).toEqual(['RM']);
    expect(chips().length).toBe(1);
  });

  it('marks ngModel touched when focus leaves', async () => {
    el('chips').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await settle();
    expect(el('chips').classList).toContain('ng-touched');
  });

  it('works with a reactive FormControl, including disable()', async () => {
    expect(label('reactive')).toBe('b');
    host.control.disable();
    await settle();
    expect(el('reactive').classList).toContain('hx-multi-select-disabled');
    expect(trigger('reactive').getAttribute('aria-disabled')).toBe('true');
    trigger('reactive').click();
    await settle();
    expect(panel()).toBeNull();
  });

  it('works with a signal form field', async () => {
    expect(label('signal')).toBe('x');
    trigger('signal').click();
    await settle();
    options()[1].click();
    await settle();
    expect(host.state().pick).toEqual(['x', 'y']);
  });
});
