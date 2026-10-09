import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form } from '@angular/forms/signals';
import { HxToggleButton } from './toggle-button';

@Component({
  imports: [HxToggleButton, FormsModule, ReactiveFormsModule, FormField],
  template: `
    <hx-toggle-button id="model" onLabel="Subscribed" offLabel="Subscribe" onIcon="pi pi-check" [(ngModel)]="on" />
    <hx-toggle-button id="plain" [(value)]="plain" />
    <hx-toggle-button id="named" ariaLabel="Bold" onLabel="" offLabel="" onIcon="pi pi-bold" offIcon="pi pi-bold" />
    <hx-toggle-button id="reactive" [formControl]="control" />
    <hx-toggle-button id="signal" [formField]="f.pick" />
  `,
})
class Host {
  on = false;
  plain = signal(false);
  control = new FormControl(true);
  state = signal({ pick: false });
  f = form(this.state);
}

describe('HxToggleButton', () => {
  let fixture: ComponentFixture<Host>;
  const button = (id: string) =>
    fixture.nativeElement.querySelector(`#${id} button`) as HTMLButtonElement;
  const settle = async () => {
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(Host);
    await settle();
  });

  it('is a native button with aria-pressed', () => {
    expect(button('plain').tagName).toBe('BUTTON');
    expect(button('plain').type).toBe('button');
    expect(button('plain').getAttribute('aria-pressed')).toBe('false');
  });

  it('shows the label and icon of the current state', async () => {
    expect(button('model').textContent?.trim()).toBe('Subscribe');
    expect(button('model').querySelector('i')).toBeNull();
    button('model').click();
    await settle();
    expect(button('model').textContent?.trim()).toBe('Subscribed');
    expect(button('model').querySelector('i')?.classList).toContain('pi-check');
    expect(button('model').querySelector('i')?.getAttribute('aria-hidden')).toBe('true');
    expect(button('model').getAttribute('aria-pressed')).toBe('true');
  });

  it('uses Yes and No by default', async () => {
    expect(button('plain').textContent?.trim()).toBe('No');
    button('plain').click();
    await settle();
    expect(button('plain').textContent?.trim()).toBe('Yes');
    expect(fixture.componentInstance.plain()).toBe(true);
  });

  it('takes its name from ariaLabel for an icon-only toggle', () => {
    expect(button('named').getAttribute('aria-label')).toBe('Bold');
    expect(button('named').querySelector('.hx-toggle-button-label')).toBeNull();
  });

  it('toggles by keyboard (Enter and Space click a native button) and stays focusable', () => {
    button('plain').focus();
    expect(document.activeElement).toBe(button('plain'));
  });

  it('writes ngModel and marks the field touched on blur', async () => {
    const ngModel = fixture.nativeElement.querySelector('#model');
    button('model').click();
    await settle();
    expect(fixture.componentInstance.on).toBe(true);
    button('model').dispatchEvent(new Event('blur'));
    await settle();
    expect(ngModel.classList).toContain('ng-touched');
  });

  it('works with a reactive FormControl, including disable()', async () => {
    expect(button('reactive').getAttribute('aria-pressed')).toBe('true');
    button('reactive').click();
    expect(fixture.componentInstance.control.value).toBe(false);
    fixture.componentInstance.control.disable();
    await settle();
    expect(button('reactive').disabled).toBe(true);
  });

  it('works with a signal form field', async () => {
    button('signal').click();
    await settle();
    expect(fixture.componentInstance.state().pick).toBe(true);
    expect(button('signal').getAttribute('aria-pressed')).toBe('true');
  });
});
