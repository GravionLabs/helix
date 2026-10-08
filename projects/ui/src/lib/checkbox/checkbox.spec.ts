import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HxCheckbox, type HxCheckboxSize } from './checkbox';

@Component({
  imports: [HxCheckbox, FormsModule],
  template: `
    <label><input type="checkbox" hx-checkbox [size]="size()" [(ngModel)]="checked" /> Agree</label>
    <input type="checkbox" hx-checkbox [indeterminate]="some()" aria-label="All" id="all" />
  `,
})
class Host {
  size = signal<HxCheckboxSize>('medium');
  checked = false;
  some = signal(false);
}

describe('HxCheckbox', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  let box: HTMLInputElement;
  let all: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
    box = fixture.debugElement.query(By.css('label input')).nativeElement;
    all = fixture.debugElement.query(By.css('#all')).nativeElement;
  });

  const classes = (el: HTMLElement) => [...el.classList].filter((c) => c.startsWith('hx-'));

  it('is a medium checkbox by default', () => {
    expect(classes(box)).toEqual(['hx-checkbox']);
    expect(box.type).toBe('checkbox');
  });

  it.each([
    ['small', 'hx-checkbox-sm'],
    ['large', 'hx-checkbox-lg'],
  ] as const)('size="%s" adds %s', async (size, cls) => {
    host.size.set(size);
    await fixture.whenStable();
    expect(classes(box)).toEqual(['hx-checkbox', cls]);
  });

  it('toggles like a native checkbox, also from its label, and writes to ngModel', async () => {
    box.click();
    await fixture.whenStable();
    expect(box.checked).toBe(true);
    expect(host.checked).toBe(true);

    fixture.debugElement.query(By.css('label')).nativeElement.click();
    await fixture.whenStable();
    expect(box.checked).toBe(false);
    expect(host.checked).toBe(false);
  });

  it('supports the indeterminate state, which the stylesheet draws as a bar', async () => {
    host.some.set(true);
    await fixture.whenStable();
    expect(all.indeterminate).toBe(true);
    expect(all.matches(':indeterminate')).toBe(true);
  });

  it('is not toggled while disabled', async () => {
    box.disabled = true;
    box.click();
    await fixture.whenStable();
    expect(box.checked).toBe(false);
  });
});
