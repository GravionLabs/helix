import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HxInput } from '../input/input';
import { HxInputNumber } from '../input-number/input-number';
import { HxPassword } from '../password/password';
import { HxSelect } from '../select/select';
import { HxFloatLabel, type HxFloatLabelVariant } from './float-label';

@Component({
  imports: [HxFloatLabel, HxInput, HxSelect, HxPassword, HxInputNumber],
  template: `
    <hx-float-label id="plain" [variant]="variant()">
      <input hx-input id="email" />
      <label for="email">Email</label>
    </hx-float-label>
    <hx-float-label id="hint">
      <input hx-input id="hinted" placeholder="you@example.com" />
      <label for="hinted">Hinted</label>
    </hx-float-label>
    <hx-float-label id="area">
      <textarea hx-input id="notes"></textarea>
      <label for="notes">Notes</label>
    </hx-float-label>
    <hx-float-label id="sel">
      <hx-select inputId="color" [options]="['red', 'green']" [(value)]="color" />
      <label for="color">Color</label>
    </hx-float-label>
    <hx-float-label id="pw">
      <hx-password inputId="secret" [(value)]="secret" />
      <label for="secret">Secret</label>
    </hx-float-label>
    <hx-float-label id="num">
      <hx-input-number inputId="qty" [(value)]="qty" />
      <label for="qty">Quantity</label>
    </hx-float-label>
  `,
})
class Host {
  readonly variant = signal<HxFloatLabelVariant>('over');
  readonly color = signal<string | null>(null);
  readonly secret = signal('');
  readonly qty = signal<number | null>(null);
}

describe('HxFloatLabel', () => {
  let fixture: ComponentFixture<Host>;
  const el = (id: string) =>
    fixture.debugElement.query(By.css(`#${id}`)).nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  it('keeps a real label bound to the control', () => {
    const label = el('plain').querySelector('label') as HTMLLabelElement;
    expect(label.htmlFor).toBe('email');
    expect((el('plain').querySelector('input') as HTMLInputElement).labels?.[0]).toBe(label);
  });

  it('maps the variant to a class', async () => {
    expect(el('plain').classList).toContain('hx-float-label');
    expect(el('plain').classList).not.toContain('hx-float-label-in');
    fixture.componentInstance.variant.set('in');
    await fixture.whenStable();
    expect(el('plain').classList).toContain('hx-float-label-in');
    fixture.componentInstance.variant.set('on');
    await fixture.whenStable();
    expect(el('plain').classList).toContain('hx-float-label-on');
    expect(el('plain').classList).not.toContain('hx-float-label-in');
  });

  it('hides the placeholder of a native field without one, and keeps an explicit one', () => {
    expect(el('plain').querySelector('input')?.getAttribute('placeholder')).toBe(' ');
    expect(el('area').querySelector('textarea')?.getAttribute('placeholder')).toBe(' ');
    expect(el('hint').querySelector('input')?.getAttribute('placeholder')).toBe('you@example.com');
  });

  it('floats a native input with a value (not :placeholder-shown) and not an empty one', async () => {
    const input = el('plain').querySelector('input') as HTMLInputElement;
    expect(input.matches(':placeholder-shown')).toBe(true);
    input.value = 'a@b.c';
    expect(input.matches(':placeholder-shown')).toBe(false);
  });

  it('floats on keyboard focus of the control', () => {
    const input = el('plain').querySelector('input') as HTMLInputElement;
    input.focus();
    expect(el('plain').matches(':focus-within')).toBe(true);
  });

  it('marks Select, Password and InputNumber with hx-filled while they hold a value', async () => {
    const host = fixture.componentInstance;
    const filled = (id: string) => el(id).querySelector('.hx-filled') !== null;
    expect(['sel', 'pw', 'num'].map(filled)).toEqual([false, false, false]);
    host.color.set('green');
    host.secret.set('x');
    host.qty.set(3);
    await fixture.whenStable();
    expect(['sel', 'pw', 'num'].map(filled)).toEqual([true, true, true]);
    host.color.set(null);
    await fixture.whenStable();
    expect(filled('sel')).toBe(false);
  });
});
