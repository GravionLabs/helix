import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { HxSelectButton } from './select-button';

const MODES = [
  { label: 'Static', value: 'static' },
  { label: 'Overlay', value: 'overlay' },
  { label: 'Locked', value: 'locked', disabled: true },
];

@Component({
  imports: [HxSelectButton, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-select-button id="single" ariaLabel="Mode" [options]="modes" [(ngModel)]="mode" [allowEmpty]="false" />
    <hx-select-button id="optional" [options]="['A', 'B']" [(value)]="optional" />
    <hx-select-button id="multi" [options]="['x', 'y', 'z']" multiple [(ngModel)]="many" />
    <hx-select-button id="reactive" [options]="['a', 'b']" [formControl]="control" />
    <hx-select-button id="signal" [options]="['p', 'q']" [formField]="f.pick" />
  `,
})
class Host {
  modes = MODES;
  mode: string | null = 'static';
  optional = signal<unknown>(null);
  many: string[] = ['y'];
  control = new FormControl<string | null>('a');
  state = signal({ pick: 'p' });
  f = form(this.state);
}

describe('HxSelectButton', () => {
  let fixture: ComponentFixture<Host>;
  const buttons = (id: string) =>
    [...fixture.nativeElement.querySelectorAll(`#${id} button`)] as HTMLButtonElement[];
  const pressed = (id: string) =>
    buttons(id)
      .filter((b) => b.getAttribute('aria-pressed') === 'true')
      .map((b) => b.textContent?.trim());
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    await settle();
  });

  it('is a labelled group of buttons, one per option', () => {
    const group = fixture.nativeElement.querySelector('#single') as HTMLElement;
    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-label')).toBe('Mode');
    expect(buttons('single').map((b) => b.textContent?.trim())).toEqual([
      'Static',
      'Overlay',
      'Locked',
    ]);
    expect(pressed('single')).toEqual(['Static']);
  });

  it('chooses another option by click and writes its value', async () => {
    buttons('single')[1].click();
    await settle();
    expect(fixture.componentInstance.mode).toBe('overlay');
    expect(pressed('single')).toEqual(['Overlay']);
  });

  it('keeps the choice when allowEmpty is false, and clears it otherwise', async () => {
    buttons('single')[0].click();
    await settle();
    expect(fixture.componentInstance.mode).toBe('static');

    buttons('optional')[0].click();
    await settle();
    expect(fixture.componentInstance.optional()).toBe('A');
    buttons('optional')[0].click();
    await settle();
    expect(fixture.componentInstance.optional()).toBeNull();
  });

  it('does not choose a disabled option', async () => {
    expect(buttons('single')[2].disabled).toBe(true);
    buttons('single')[2].click();
    await settle();
    expect(fixture.componentInstance.mode).toBe('static');
  });

  it('collects several values with multiple', async () => {
    expect(pressed('multi')).toEqual(['y']);
    buttons('multi')[0].click();
    await settle();
    expect(fixture.componentInstance.many).toEqual(['y', 'x']);
    buttons('multi')[1].click();
    await settle();
    expect(fixture.componentInstance.many).toEqual(['x']);
  });

  it('works with a reactive FormControl, including disabling', async () => {
    expect(pressed('reactive')).toEqual(['a']);
    buttons('reactive')[1].click();
    expect(fixture.componentInstance.control.value).toBe('b');
    fixture.componentInstance.control.disable();
    await settle();
    expect(buttons('reactive').every((b) => b.disabled)).toBe(true);
  });

  it('works with a signal form field', async () => {
    expect(pressed('signal')).toEqual(['p']);
    buttons('signal')[1].click();
    await settle();
    expect(fixture.componentInstance.state().pick).toBe('q');
  });
});
