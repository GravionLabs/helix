import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HxRadio, type HxRadioSize } from './radio';

@Component({
  imports: [HxRadio, FormsModule],
  template: `
    <label><input type="radio" hxRadio name="plan" value="free" [size]="size()" [(ngModel)]="plan" /> Free</label>
    <label><input type="radio" hxRadio name="plan" value="pro" [(ngModel)]="plan" /> Pro</label>
  `,
})
class Host {
  size = signal<HxRadioSize>('medium');
  plan = 'free';
}

describe('HxRadio', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  let radios: HTMLInputElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
    radios = fixture.debugElement.queryAll(By.css('input')).map((d) => d.nativeElement);
  });

  const classes = (el: HTMLElement) => [...el.classList].filter((c) => c.startsWith('hx-'));

  it('is a medium radio by default', () => {
    expect(classes(radios[0])).toEqual(['hx-radio']);
  });

  it.each([
    ['small', 'hx-radio-sm'],
    ['large', 'hx-radio-lg'],
  ] as const)('size="%s" adds %s', async (size, cls) => {
    host.size.set(size);
    await fixture.whenStable();
    expect(classes(radios[0])).toEqual(['hx-radio', cls]);
  });

  it('selects exactly one of the group and writes the value to ngModel', async () => {
    expect(radios[0].checked).toBe(true);
    radios[1].click();
    await fixture.whenStable();
    expect(radios[1].checked).toBe(true);
    expect(radios[0].checked).toBe(false);
    expect(host.plan).toBe('pro');
  });
});
