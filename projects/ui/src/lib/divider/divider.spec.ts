import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HxDivider } from './divider';

@Component({
  imports: [HxDivider],
  template: `
    <hx-divider id="plain" />
    <hx-divider id="label" type="dashed" align="center">or</hx-divider>
    <hx-divider id="vertical" layout="vertical" type="dotted" />
  `,
})
class Host {}

describe('HxDivider', () => {
  const setup = () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;
  };

  it('is a horizontal separator by default', () => {
    const el = setup()('plain');
    expect(el.getAttribute('role')).toBe('separator');
    expect(el.getAttribute('aria-orientation')).toBe('horizontal');
    expect(el.classList).toContain('hx-divider-horizontal');
  });

  it('carries type, alignment and its label', () => {
    const el = setup()('label');
    expect(el.classList).toContain('hx-divider-dashed');
    expect(el.classList).toContain('hx-divider-center');
    expect(el.textContent?.trim()).toBe('or');
  });

  it('can be vertical', () => {
    const el = setup()('vertical');
    expect(el.getAttribute('aria-orientation')).toBe('vertical');
    expect(el.classList).toContain('hx-divider-vertical');
    expect(el.classList).toContain('hx-divider-dotted');
  });
});
