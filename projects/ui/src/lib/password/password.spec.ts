import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { HxPassword } from './password';

@Component({
  imports: [HxPassword, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-password id="model" inputId="pw" placeholder="Password" toggleMask [(ngModel)]="secret" />
    <hx-password id="plain" />
    <hx-password id="reactive" [formControl]="control" />
    <hx-password id="signal" [formField]="f.pw" />
    <hx-password id="off" [disabled]="true" toggleMask />
  `,
})
class Host {
  secret = 'abc';
  control = new FormControl('x', { nonNullable: true });
  state = signal({ pw: 's' });
  f = form(this.state);
}

describe('HxPassword', () => {
  let fixture: ComponentFixture<Host>;
  const input = (id: string) =>
    fixture.nativeElement.querySelector(`#${id} input`) as HTMLInputElement;
  const toggle = (id: string) =>
    fixture.nativeElement.querySelector(`#${id} .hx-password-toggle`) as HTMLButtonElement | null;
  const type = (el: HTMLInputElement, value: string) => {
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    await settle();
  });

  it('is a masked hx-input with the given id and placeholder', () => {
    const el = input('model');
    expect(el.type).toBe('password');
    expect(el.id).toBe('pw');
    expect(el.placeholder).toBe('Password');
    expect(el.classList).toContain('hx-input');
  });

  it('has no toggle unless toggleMask is set', () => {
    expect(toggle('plain')).toBeNull();
    expect(toggle('model')).toBeTruthy();
  });

  it('reveals and hides the text with the toggle', async () => {
    const button = toggle('model') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Show password');
    button.click();
    await settle();
    expect(input('model').type).toBe('text');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.getAttribute('aria-label')).toBe('Hide password');
    button.click();
    await settle();
    expect(input('model').type).toBe('password');
  });

  it('works with ngModel', async () => {
    expect(input('model').value).toBe('abc');
    type(input('model'), 'secret');
    await settle();
    expect(fixture.componentInstance.secret).toBe('secret');
  });

  it('works with a reactive FormControl, including disabling', async () => {
    expect(input('reactive').value).toBe('x');
    type(input('reactive'), 'y');
    expect(fixture.componentInstance.control.value).toBe('y');
    fixture.componentInstance.control.disable();
    await settle();
    expect(input('reactive').disabled).toBe(true);
  });

  it('works with a signal form field', async () => {
    expect(input('signal').value).toBe('s');
    type(input('signal'), 'new');
    await settle();
    expect(fixture.componentInstance.state().pw).toBe('new');
  });

  it('disables the field and the toggle', () => {
    expect(input('off').disabled).toBe(true);
    expect(toggle('off')?.disabled).toBe(true);
  });
});
