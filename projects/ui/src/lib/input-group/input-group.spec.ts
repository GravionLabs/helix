import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HxButton } from '../button/button';
import { HxInput } from '../input/input';
import { HxInputGroup, HxInputGroupAddon } from './input-group';

@Component({
  imports: [HxInputGroup, HxInputGroupAddon, HxInput, HxButton],
  template: `
    <hx-input-group id="g">
      <hx-input-group-addon id="scheme">https://</hx-input-group-addon>
      <input hx-input aria-label="Domain" aria-describedby="scheme" />
      <button hx-button type="button">Go</button>
    </hx-input-group>
  `,
})
class Host {}

describe('HxInputGroup', () => {
  let fixture: ComponentFixture<Host>;
  const group = () => fixture.debugElement.query(By.css('#g')).nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  it('renders the group with its addon, field and button in order', () => {
    expect(group().classList).toContain('hx-input-group');
    const kinds = [...group().children].map((c) => c.tagName.toLowerCase());
    expect(kinds).toEqual(['hx-input-group-addon', 'input', 'button']);
    expect(group().querySelector('.hx-input-group-addon')?.textContent).toBe('https://');
  });

  it('adds no role of its own and leaves the addon out of the field name', () => {
    expect(group().hasAttribute('role')).toBe(false);
    expect(group().querySelector('.hx-input-group-addon')?.hasAttribute('role')).toBe(false);
    const input = group().querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-label')).toBe('Domain');
    expect(input.getAttribute('aria-describedby')).toBe('scheme');
  });

  it('keeps the field reachable by keyboard', () => {
    const input = group().querySelector('input') as HTMLInputElement;
    input.focus();
    expect(document.activeElement).toBe(input);
  });
});
