import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';
import { HxInputNumber } from './input-number';

@Component({
  imports: [HxInputNumber, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-input-number id="plain" inputId="plain-field" [(value)]="qty" [min]="min()" [max]="max()" [step]="step()" [showButtons]="buttons()" [buttonLayout]="layout()" [disabled]="disabled()" [invalid]="invalid()" [locale]="locale()" [mode]="mode()" currency="EUR" [minFractionDigits]="minFd()" [maxFractionDigits]="maxFd()" prefix="~" suffix="" />
    <hx-input-number id="model" [ngModel]="modeled()" (ngModelChange)="modeled.set($event)" locale="en-US" />
    <hx-input-number id="reactive" [formControl]="control" locale="en-US" />
    <hx-input-number id="signal" [formField]="model.amount" locale="en-US" />
    <hx-input-number id="labels" showButtons incrementLabel="Mehr" decrementLabel="Weniger" locale="en-US" />
  `,
})
class Host {
  qty = signal<number | null>(5);
  min = signal<number | undefined>(0);
  max = signal<number | undefined>(10);
  step = signal(1);
  buttons = signal(true);
  layout = signal<'stacked' | 'horizontal'>('stacked');
  disabled = signal(false);
  invalid = signal(false);
  locale = signal('en-US');
  mode = signal<'decimal' | 'currency'>('decimal');
  minFd = signal<number | undefined>(undefined);
  maxFd = signal<number | undefined>(undefined);
  modeled = signal<number | null>(3);
  control = new FormControl<number | null>(7);
  state = signal<{ amount: number | null }>({ amount: 4 });
  model = form(this.state);
}

describe('HxInputNumber', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;

  const root = (id: string) =>
    fixture.debugElement.query(By.css(`#${id}`)).nativeElement as HTMLElement;
  const field = (id: string) => root(id).querySelector('input') as HTMLInputElement;
  const button = (id: string, which: 'increment' | 'decrement') =>
    root(id).querySelector(`.hx-input-number-${which}`) as HTMLButtonElement;
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const type = async (id: string, text: string) => {
    const input = field(id);
    input.value = text;
    input.dispatchEvent(new Event('input'));
    await settle();
  };
  const key = async (id: string, k: string) => {
    field(id).dispatchEvent(new KeyboardEvent('keydown', { key: k, cancelable: true }));
    await settle();
  };
  const blur = async (id: string) => {
    field(id).dispatchEvent(new Event('blur'));
    await settle();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering', () => {
    it('shows the formatted value in a spinbutton with the ARIA value states', () => {
      const input = field('plain');
      expect(input.id).toBe('plain-field');
      expect(input.value).toBe('~5');
      expect(input.getAttribute('role')).toBe('spinbutton');
      expect(input.getAttribute('inputmode')).toBe('decimal');
      expect(input.getAttribute('aria-valuenow')).toBe('5');
      expect(input.getAttribute('aria-valuemin')).toBe('0');
      expect(input.getAttribute('aria-valuemax')).toBe('10');
      expect(input.getAttribute('aria-valuetext')).toBe('~5');
    });

    it('formats with the locale, grouping and fraction digits', async () => {
      host.qty.set(1234567.891);
      host.max.set(undefined);
      await settle();
      expect(field('plain').value).toBe('~1,234,567.891');
      host.locale.set('de-DE');
      await settle();
      expect(field('plain').value).toBe('~1.234.567,891');
      host.maxFd.set(1);
      await settle();
      expect(field('plain').value).toBe('~1.234.567,9');
      host.minFd.set(2);
      host.maxFd.set(2);
      host.qty.set(3);
      await settle();
      expect(field('plain').value).toBe('~3,00');
    });

    it('formats currencies', async () => {
      host.mode.set('currency');
      host.locale.set('de-DE');
      host.qty.set(9.5);
      await settle();
      expect(field('plain').value).toContain('9,50');
      expect(field('plain').value).toContain('€');
    });

    it('is empty for null and carries the invalid state', async () => {
      host.qty.set(null);
      host.invalid.set(true);
      await settle();
      expect(field('plain').value).toBe('');
      expect(field('plain').hasAttribute('aria-valuenow')).toBe(false);
      expect(field('plain').getAttribute('aria-invalid')).toBe('true');
    });

    it('sets the layout classes and renders the buttons only when asked', async () => {
      expect(root('plain').classList).toContain('hx-input-number-stacked');
      expect(root('plain').querySelectorAll('.hx-input-number-button')).toHaveLength(2);
      host.layout.set('horizontal');
      await settle();
      expect(root('plain').classList).toContain('hx-input-number-horizontal');
      expect(root('plain').querySelectorAll('.hx-input-number-button')).toHaveLength(2);
      host.buttons.set(false);
      await settle();
      expect(root('plain').querySelectorAll('.hx-input-number-button')).toHaveLength(0);
    });

    it('labels the step buttons and keeps them out of the tab order', () => {
      const up = button('labels', 'increment');
      const down = button('labels', 'decrement');
      expect(up.getAttribute('aria-label')).toBe('Mehr');
      expect(down.getAttribute('aria-label')).toBe('Weniger');
      expect(up.getAttribute('tabindex')).toBe('-1');
      expect(down.getAttribute('tabindex')).toBe('-1');
      expect(button('plain', 'increment').getAttribute('aria-label')).toBe('Increment');
    });

    it('disables the field and the buttons', async () => {
      host.disabled.set(true);
      await settle();
      expect(field('plain').disabled).toBe(true);
      expect(button('plain', 'increment').disabled).toBe(true);
      expect(root('plain').classList).toContain('hx-input-number-disabled');
    });
  });

  describe('typing', () => {
    it('parses what is typed in the locale and updates the value', async () => {
      await type('plain', '8');
      expect(host.qty()).toBe(8);
      host.locale.set('de-DE');
      host.max.set(undefined);
      await settle();
      await type('plain', '1.234,5');
      expect(host.qty()).toBe(1234.5);
    });

    it('clamps to min and max and reformats on blur', async () => {
      await type('plain', '42');
      expect(host.qty()).toBe(10);
      expect(field('plain').value).toBe('42'); // not rewritten while typing
      await blur('plain');
      expect(field('plain').value).toBe('~10');
      await type('plain', '-3');
      expect(host.qty()).toBe(0);
    });

    it('rounds to the fraction digits', async () => {
      await type('plain', '2.34567');
      expect(host.qty()).toBe(2.346);
    });

    it('sets null for an empty text and keeps the value for an unparsable one', async () => {
      await type('plain', '');
      expect(host.qty()).toBeNull();
      await type('plain', '7');
      await type('plain', '7-');
      expect(host.qty()).toBe(7);
      await blur('plain');
      expect(field('plain').value).toBe('~7');
    });

    it('ignores the prefix and the currency symbol', async () => {
      await type('plain', '~6');
      expect(host.qty()).toBe(6);
    });
  });

  describe('keyboard', () => {
    it('steps with ArrowUp and ArrowDown and respects the limits', async () => {
      await key('plain', 'ArrowUp');
      expect(host.qty()).toBe(6);
      await key('plain', 'ArrowDown');
      await key('plain', 'ArrowDown');
      expect(host.qty()).toBe(4);
      host.qty.set(10);
      await settle();
      await key('plain', 'ArrowUp');
      expect(host.qty()).toBe(10);
    });

    it('prevents the default of the arrow keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true });
      field('plain').dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('steps by `step` without floating point noise', async () => {
      host.step.set(0.1);
      host.qty.set(0.2);
      await settle();
      await key('plain', 'ArrowUp');
      expect(host.qty()).toBe(0.3);
    });

    it('goes to min on Home and to max on End, and leaves them alone without limits', async () => {
      await key('plain', 'Home');
      expect(host.qty()).toBe(0);
      await key('plain', 'End');
      expect(host.qty()).toBe(10);
      host.min.set(undefined);
      host.max.set(undefined);
      await settle();
      const home = new KeyboardEvent('keydown', { key: 'Home', cancelable: true });
      field('plain').dispatchEvent(home);
      expect(home.defaultPrevented).toBe(false);
    });

    it('steps from the typed text', async () => {
      await type('plain', '3');
      await key('plain', 'ArrowUp');
      expect(host.qty()).toBe(4);
      expect(field('plain').value).toBe('~4');
    });

    it('starts at 0 when empty', async () => {
      host.qty.set(null);
      await settle();
      await key('plain', 'ArrowUp');
      expect(host.qty()).toBe(1);
    });
  });

  describe('step buttons', () => {
    it('step once per click', async () => {
      button('plain', 'increment').click();
      await settle();
      expect(host.qty()).toBe(6);
      button('plain', 'decrement').click();
      button('plain', 'decrement').click();
      await settle();
      expect(host.qty()).toBe(4);
    });

    it('are disabled at the limits', async () => {
      host.qty.set(10);
      await settle();
      expect(button('plain', 'increment').disabled).toBe(true);
      expect(button('plain', 'decrement').disabled).toBe(false);
      host.qty.set(0);
      await settle();
      expect(button('plain', 'decrement').disabled).toBe(true);
    });

    it('step on pointer down and repeat while held, then stop on release', async () => {
      vi.useFakeTimers();
      const up = button('plain', 'increment');
      up.dispatchEvent(new Event('pointerdown'));
      expect(host.qty()).toBe(6);
      vi.advanceTimersByTime(400);
      expect(host.qty()).toBe(7);
      vi.advanceTimersByTime(120);
      expect(host.qty()).toBe(9);
      up.dispatchEvent(new Event('pointerup'));
      vi.advanceTimersByTime(500);
      expect(host.qty()).toBe(9);
    });

    it('stop repeating at the limit', async () => {
      vi.useFakeTimers();
      button('plain', 'increment').dispatchEvent(new Event('pointerdown'));
      vi.advanceTimersByTime(3000);
      expect(host.qty()).toBe(10);
      expect(vi.getTimerCount()).toBe(0);
    });

    it('do not count the click that follows a pointer press as a second step', async () => {
      const up = button('plain', 'increment');
      up.dispatchEvent(new Event('pointerdown'));
      up.dispatchEvent(new Event('pointerup'));
      up.click();
      await settle();
      expect(host.qty()).toBe(6);
    });
  });

  describe('forms', () => {
    it('ngModel writes the model in and the typed number out', async () => {
      expect(field('model').value).toBe('3');
      await type('model', '12');
      expect(host.modeled()).toBe(12);
      host.modeled.set(20);
      await settle();
      await settle();
      expect(field('model').value).toBe('20');
    });

    it('a reactive FormControl is read, written, disabled and touched', async () => {
      expect(field('reactive').value).toBe('7');
      await type('reactive', '9');
      expect(host.control.value).toBe(9);
      host.control.setValue(2);
      await settle();
      expect(field('reactive').value).toBe('2');
      expect(host.control.touched).toBe(false);
      field('reactive').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      expect(host.control.touched).toBe(true);
      host.control.disable();
      await settle();
      expect(field('reactive').disabled).toBe(true);
      host.control.enable();
      await settle();
      expect(field('reactive').disabled).toBe(false);
    });

    it('a signal form field is bound two-way through [formField]', async () => {
      expect(field('signal').value).toBe('4');
      await type('signal', '15');
      expect(host.state().amount).toBe(15);
      host.state.set({ amount: 1 });
      await settle();
      expect(field('signal').value).toBe('1');
      expect(host.model.amount().touched()).toBe(false);
      field('signal').dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
      expect(host.model.amount().touched()).toBe(true);
    });

    it('does not mark the field touched when focus moves to its own button', () => {
      const control = host.control;
      field('reactive');
      root('reactive').dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, relatedTarget: root('reactive') }),
      );
      expect(control.touched).toBe(false);
    });
  });
});
