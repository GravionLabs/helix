import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HelixEmptyState } from './empty-state';

@Component({
  imports: [HelixEmptyState],
  template: `
    <helix-empty-state id="page" icon="pi pi-inbox" title="No invoices yet" description="Invoices you create appear here.">
      <button type="button">New invoice</button>
    </helix-empty-state>
    <helix-empty-state id="small" title="Nothing found" size="small" [headingLevel]="4" />
  `,
})
class Host {}

describe('HelixEmptyState', () => {
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('renders icon, heading, description and the projected action', () => {
    const page = el.querySelector('#page') as HTMLElement;
    expect(page.querySelector('.helix-empty-state__icon i')?.className).toBe('pi pi-inbox');
    expect(page.querySelector('h3')?.textContent).toBe('No invoices yet');
    expect(page.querySelector('.helix-empty-state__description')?.textContent).toBe(
      'Invoices you create appear here.',
    );
    expect(page.querySelector('.helix-empty-state__actions button')?.textContent).toBe(
      'New invoice',
    );
    expect(page.classList.contains('helix-empty-state--small')).toBe(false);
  });

  it('has a small size and a heading level', () => {
    const small = el.querySelector('#small') as HTMLElement;
    expect(small.classList.contains('helix-empty-state--small')).toBe(true);
    expect(small.querySelector('h4')?.textContent).toBe('Nothing found');
    expect(small.querySelector('.helix-empty-state__icon')).toBeNull();
    expect(small.querySelector('.helix-empty-state__description')).toBeNull();
  });
});
