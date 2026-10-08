import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HxSwitch } from './switch';

@Component({
  imports: [HxSwitch, FormsModule],
  template: `<label><input type="checkbox" hx-switch [(ngModel)]="on" /> Dark mode</label>`,
})
class Host {
  on = false;
}

describe('HxSwitch', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  let toggle: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
    toggle = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('is a native checkbox with the switch role and the hx-switch class', () => {
    expect(toggle.type).toBe('checkbox');
    expect(toggle.getAttribute('role')).toBe('switch');
    expect(toggle.classList).toContain('hx-switch');
  });

  it('toggles from the input and from its label, and writes to ngModel', async () => {
    toggle.click();
    await fixture.whenStable();
    expect(toggle.checked).toBe(true);
    expect(host.on).toBe(true);

    fixture.debugElement.query(By.css('label')).nativeElement.click();
    await fixture.whenStable();
    expect(toggle.checked).toBe(false);
    expect(host.on).toBe(false);
  });

  it('is not toggled while disabled', async () => {
    toggle.disabled = true;
    toggle.click();
    await fixture.whenStable();
    expect(toggle.checked).toBe(false);
  });
});
