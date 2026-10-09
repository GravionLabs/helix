import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxProgressBar, HxProgressSpinner } from './progress';

@Component({
  imports: [HxProgressBar, HxProgressSpinner],
  template: `
    <hx-progress-bar id="bar" ariaLabel="Upload" [value]="value()" />
    <hx-progress-bar id="hidden" [value]="30" [showValue]="false" unit=" MB" />
    <hx-progress-bar id="unit" [value]="30" unit=" MB" />
    <hx-progress-bar id="indeterminate" mode="indeterminate" ariaLabel="Loading" />
    <hx-progress-spinner id="spinner" strokeWidth="4" animationDuration="3s" />
    <hx-progress-spinner id="named" ariaLabel="Saving" />
  `,
})
class Host {
  value = signal(40);
}

describe('HxProgress', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const el = (id: string) =>
    (fixture.nativeElement as HTMLElement).querySelector(`#${id}`) as HTMLElement;
  const fill = (id: string) => el(id).querySelector('.hx-progress-bar-value') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('is a named progressbar with min, max and now', () => {
    expect(el('bar').getAttribute('role')).toBe('progressbar');
    expect(el('bar').getAttribute('aria-label')).toBe('Upload');
    expect(el('bar').getAttribute('aria-valuemin')).toBe('0');
    expect(el('bar').getAttribute('aria-valuemax')).toBe('100');
    expect(el('bar').getAttribute('aria-valuenow')).toBe('40');
  });

  it('fills to the value and shows it with the unit', () => {
    expect(fill('bar').style.width).toBe('40%');
    expect(el('bar').textContent?.trim()).toBe('40%');
    expect(el('unit').textContent?.trim()).toBe('30 MB');
    expect(el('hidden').querySelector('.hx-progress-bar-label')).toBeNull();
  });

  it('updates and clamps', () => {
    host.value.set(150);
    fixture.detectChanges();
    expect(el('bar').getAttribute('aria-valuenow')).toBe('100');
    host.value.set(-5);
    fixture.detectChanges();
    expect(el('bar').getAttribute('aria-valuenow')).toBe('0');
    expect(fill('bar').style.width).toBe('0%');
  });

  it('indeterminate leaves out aria-valuenow, the width and the label', () => {
    expect(el('indeterminate').getAttribute('aria-valuenow')).toBeNull();
    expect(el('indeterminate').classList).toContain('hx-progress-bar-indeterminate');
    expect(fill('indeterminate').style.width).toBe('');
    expect(el('indeterminate').querySelector('.hx-progress-bar-label')).toBeNull();
  });

  it('the spinner is an indeterminate progressbar named Loading by default', () => {
    expect(el('spinner').getAttribute('role')).toBe('progressbar');
    expect(el('spinner').getAttribute('aria-valuenow')).toBeNull();
    expect(el('spinner').getAttribute('aria-label')).toBe('Loading');
    expect(el('named').getAttribute('aria-label')).toBe('Saving');
    expect(el('spinner').querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('the spinner takes strokeWidth and animationDuration', () => {
    const circle = el('spinner').querySelector('circle') as SVGElement;
    expect(circle.getAttribute('stroke-width')).toBe('4');
    expect((el('spinner').querySelector('svg') as SVGElement).style.animationDuration).toBe('3s');
  });
});
