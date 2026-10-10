import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import { HxSelect } from './select';

interface City {
  name: string;
  code: string;
  disabled?: boolean;
}

const CITIES: City[] = [
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN', disabled: true },
  { name: 'Istanbul', code: 'IST' },
];

@Component({
  imports: [HxSelect, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-select id="plain" inputId="plain-trigger" placeholder="Pick" [options]="cities" optionLabel="name" optionValue="code" [(value)]="picked" [showClear]="clearable()" [disabled]="disabled()" [invalid]="invalid()" [size]="size()" />
    <hx-select id="strings" [options]="['Small', 'Medium', 'Large']" emptyMessage="Nothing" [(ngModel)]="sized" />
    <hx-select id="reactive" [options]="['a', 'b']" [formControl]="control" />
    <hx-select id="signal" [options]="['x', 'y']" [formField]="model.choice" />
    <hx-select id="filtered" filter filterPlaceholder="Find" [options]="cities" optionLabel="name" optionValue="code" [(value)]="chosen" />
    <hx-select id="by" filter [options]="cities" optionLabel="name" optionValue="code" [filterBy]="'code'" />
    <hx-select id="empty" [options]="[]" emptyMessage="No cities" />
  `,
})
class Host {
  cities = CITIES;
  picked = signal<string | null>(null);
  chosen = signal<string | null>('RM');
  clearable = signal(false);
  disabled = signal(false);
  invalid = signal(false);
  size = signal<'small' | 'medium' | 'large'>('medium');
  sized: string | null = 'Medium';
  control = new FormControl<string | null>('b');
  state = signal({ choice: 'x' });
  model = form(this.state);
}

describe('HxSelect', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  const select = (id: string) =>
    fixture.debugElement.query(By.css(`#${id}`)).nativeElement as HTMLElement;
  const trigger = (id: string) =>
    select(id).querySelector('button.hx-select-trigger') as HTMLButtonElement;
  const label = (id: string) => select(id).querySelector('.hx-select-label')?.textContent?.trim();
  const panel = () => document.querySelector('.hx-select-panel') as HTMLElement | null;
  const options = () => [...document.querySelectorAll<HTMLElement>('.hx-select-option')];
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
    expect(select('plain').querySelector('.hx-select-placeholder')).toBeTruthy();
    const t = trigger('plain');
    expect(t.getAttribute('role')).toBe('combobox');
    expect(t.getAttribute('aria-haspopup')).toBe('listbox');
    expect(t.getAttribute('aria-expanded')).toBe('false');
    expect(t.id).toBe('plain-trigger');
  });

  it('opens a listbox of the options on click and closes it again', async () => {
    trigger('plain').click();
    await settle();
    expect(trigger('plain').getAttribute('aria-expanded')).toBe('true');
    expect(panel()).toBeTruthy();
    expect(options().map((o) => o.textContent?.trim())).toEqual([
      'New York',
      'Rome',
      'London',
      'Istanbul',
    ]);
    expect(panel()?.querySelector('[role=listbox]')).toBeTruthy();
    expect(options()[0].getAttribute('role')).toBe('option');

    trigger('plain').click();
    await settle();
    expect(trigger('plain').getAttribute('aria-expanded')).toBe('false');
  });

  it('selects by click: value is the option value, the label is shown, the panel closes, the trigger regains focus', async () => {
    trigger('plain').click();
    await settle();
    options()[1].click();
    await settle();
    expect(host.picked()).toBe('RM');
    expect(label('plain')).toBe('Rome');
    expect(panel()).toBeNull();
    expect(document.activeElement).toBe(trigger('plain'));

    trigger('plain').click();
    await settle();
    expect(options()[1].getAttribute('aria-selected')).toBe('true');
  });

  it('does not select a disabled option', async () => {
    trigger('plain').click();
    await settle();
    expect(options()[2].getAttribute('aria-disabled')).toBe('true');
    options()[2].click();
    await settle();
    expect(host.picked()).toBeNull();
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

  it('accepts primitives as options', async () => {
    expect(label('strings')).toBe('Medium');
    trigger('strings').click();
    await settle();
    expect(options().map((o) => o.textContent?.trim())).toEqual(['Small', 'Medium', 'Large']);
  });

  it('shows the empty message when there are no options', async () => {
    trigger('empty').click();
    await settle();
    expect(document.querySelector('.hx-select-empty')?.textContent?.trim()).toBe('No cities');
  });

  it('clears to null with the clear button', async () => {
    host.clearable.set(true);
    trigger('plain').click();
    await settle();
    options()[0].click();
    await settle();
    const clear = select('plain').querySelector('.hx-select-clear') as HTMLButtonElement;
    expect(clear).toBeTruthy();
    clear.click();
    await settle();
    expect(host.picked()).toBeNull();
    expect(label('plain')).toBe('Pick');
    expect(select('plain').querySelector('.hx-select-clear')).toBeNull();
  });

  it('is not opened while disabled', async () => {
    host.disabled.set(true);
    await settle();
    expect(trigger('plain').disabled).toBe(true);
    expect(select('plain').classList).toContain('hx-select-disabled');
  });

  it('carries size and invalid as classes and aria-invalid', async () => {
    host.size.set('large');
    host.invalid.set(true);
    await settle();
    expect(select('plain').classList).toContain('hx-select-lg');
    expect(select('plain').classList).toContain('hx-select-invalid');
    expect(trigger('plain').getAttribute('aria-invalid')).toBe('true');
  });

  describe('filter', () => {
    const field = () => document.querySelector('.hx-select-filter') as HTMLInputElement | null;
    const type = async (text: string) => {
      const input = field() as HTMLInputElement;
      input.value = text;
      input.dispatchEvent(new Event('input'));
      await settle();
    };
    const labels = () => options().map((o) => o.textContent?.trim());

    it('has no field without the filter input', async () => {
      trigger('plain').click();
      await settle();
      expect(field()).toBeNull();
    });

    it('shows a named field and focuses it when the panel opens', async () => {
      trigger('filtered').click();
      await settle();
      expect(field()?.getAttribute('aria-label')).toBe('Find');
      expect(document.activeElement).toBe(field());
    });

    it('filters by label, case-insensitive contains', async () => {
      trigger('filtered').click();
      await settle();
      await type('ISTAN');
      expect(labels()).toEqual(['Istanbul']);
      await type('o');
      expect(labels()).toEqual(['New York', 'Rome', 'London']);
    });

    it('filters by filterBy', async () => {
      trigger('by').click();
      await settle();
      await type('ld');
      expect(labels()).toEqual(['London']);
    });

    it('shows the empty filter message and announces the count', async () => {
      trigger('filtered').click();
      await settle();
      await type('zzz');
      expect(document.querySelector('.hx-select-empty')?.textContent?.trim()).toBe('No results');
      const live = document.querySelector('.hx-select-sr-only');
      expect(live?.getAttribute('aria-live')).toBe('polite');
      expect(live?.textContent?.trim()).toBe('0 results');
    });

    it('clears the field when the panel closes and keeps the selection while filtered out', async () => {
      trigger('filtered').click();
      await settle();
      await type('york');
      expect(host.chosen()).toBe('RM');
      expect(label('filtered')).toBe('Rome');
      trigger('filtered').click();
      await settle();
      trigger('filtered').click();
      await settle();
      expect(field()?.value).toBe('');
      expect(labels().length).toBe(4);
    });

    it('moves from the field into the list with the arrow keys and closes with Escape', async () => {
      trigger('filtered').click();
      await settle();
      field()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await settle();
      expect(document.activeElement).toBe(document.querySelector('.hx-select-list'));
      field()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await settle();
      expect(panel()).toBeNull();
      expect(document.activeElement).toBe(trigger('filtered'));
    });
  });

  describe('forms', () => {
    it('ngModel writes the model value in and the choice out', async () => {
      expect(label('strings')).toBe('Medium');
      trigger('strings').click();
      await settle();
      options()[2].click();
      await settle();
      expect(host.sized).toBe('Large');
      expect(label('strings')).toBe('Large');
    });

    it('a reactive FormControl is read, written and disabled', async () => {
      expect(label('reactive')).toBe('b');
      trigger('reactive').click();
      await settle();
      options()[0].click();
      await settle();
      expect(host.control.value).toBe('a');

      host.control.setValue('b');
      await settle();
      expect(label('reactive')).toBe('b');

      host.control.disable();
      await settle();
      expect(trigger('reactive').disabled).toBe(true);
    });

    it('a signal form field is bound two-way through [formField]', async () => {
      expect(label('signal')).toBe('x');
      trigger('signal').click();
      await settle();
      options()[1].click();
      await settle();
      expect(host.state().choice).toBe('y');

      host.state.set({ choice: 'x' });
      await settle();
      expect(label('signal')).toBe('x');
    });
  });
});
