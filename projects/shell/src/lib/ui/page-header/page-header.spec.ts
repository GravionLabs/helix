import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HelixPageHeader } from './page-header';

@Component({
  imports: [HelixPageHeader],
  template: `
    <helix-page-header title="Invoices" subtitle="Open and paid" [breadcrumb]="crumbs" [home]="{ icon: 'pi pi-home', routerLink: '/' }">
      <button helixPageActions type="button">New</button>
    </helix-page-header>
    <helix-page-header id="plain" title="Plain" [headingLevel]="2" />
  `,
})
class Host {
  crumbs = [{ label: 'Finance', routerLink: '/finance' }, { label: 'Invoices' }];
}

describe('HelixPageHeader', () => {
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('renders the title as an h1, the subtitle and the breadcrumb', () => {
    const header = el.querySelector('helix-page-header') as HTMLElement;
    expect(header.querySelector('h1')?.textContent).toBe('Invoices');
    expect(header.querySelector('.helix-page-header__subtitle')?.textContent).toBe('Open and paid');
    const crumbs = [...header.querySelectorAll('.hx-breadcrumb-link')].map((c) =>
      c.textContent?.trim(),
    );
    expect(crumbs).toEqual(['', 'Finance', 'Invoices']);
    expect(header.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('Invoices');
  });

  it('projects the actions', () => {
    const actions = el.querySelector(
      'helix-page-header .helix-page-header__actions',
    ) as HTMLElement;
    expect(actions.querySelector('button')?.textContent).toBe('New');
  });

  it('uses the heading level and leaves out the breadcrumb when there is none', () => {
    const plain = el.querySelector('#plain') as HTMLElement;
    expect(plain.querySelector('h2')?.textContent).toBe('Plain');
    expect(plain.querySelector('h1')).toBeNull();
    expect(plain.querySelector('hx-breadcrumb')).toBeNull();
    expect(plain.querySelector('.helix-page-header__subtitle')).toBeNull();
  });
});
