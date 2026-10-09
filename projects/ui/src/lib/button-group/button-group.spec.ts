import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxButton } from '../button/button';
import { HxButtonGroup } from './button-group';

@Component({
  imports: [HxButtonGroup, HxButton],
  template: `
    <hx-button-group id="g" ariaLabel="Alignment">
      <button hx-button variant="outlined">Left</button>
      <button hx-button variant="outlined">Right</button>
    </hx-button-group>
    <hx-button-group id="plain"><button hx-button>One</button></hx-button-group>
  `,
})
class Host {}

describe('HxButtonGroup', () => {
  let fixture: ComponentFixture<Host>;
  const el = (id: string) =>
    (fixture.nativeElement as HTMLElement).querySelector(`#${id}`) as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('is a named group around its buttons', () => {
    expect(el('g').getAttribute('role')).toBe('group');
    expect(el('g').getAttribute('aria-label')).toBe('Alignment');
    expect(el('g').querySelectorAll('button.hx-button').length).toBe(2);
  });

  it('has no label attribute when none is given', () => {
    expect(el('plain').getAttribute('role')).toBe('group');
    expect(el('plain').hasAttribute('aria-label')).toBe(false);
  });
});
