import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HxBreadcrumb, type HxBreadcrumbItem } from './breadcrumb';

@Component({
  imports: [HxBreadcrumb],
  template: `<hx-breadcrumb [model]="items" [home]="home" />`,
})
class Host {
  home: HxBreadcrumbItem = { icon: 'pi pi-home', routerLink: '/' };
  items: HxBreadcrumbItem[] = [
    { label: 'Settings', routerLink: '/settings' },
    { label: 'Hidden', visible: false },
    { label: 'Docs', url: 'https://example.com/docs', target: '_blank' },
    { label: 'Profile' },
  ];
}

describe('HxBreadcrumb', () => {
  const setup = async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  it('is a labelled navigation landmark with a list', async () => {
    const el = await setup();
    expect(el.querySelector('nav')?.getAttribute('aria-label')).toBe('Breadcrumb');
    expect(el.querySelectorAll('ol > li.hx-breadcrumb-item').length).toBe(4);
  });

  it('renders the home item as a labelled icon link', async () => {
    const home = (await setup()).querySelector('a.hx-breadcrumb-link') as HTMLAnchorElement;
    expect(home.getAttribute('href')).toBe('/');
    expect(home.getAttribute('aria-label')).toBe('Home');
    expect(home.querySelector('.pi-home')).toBeTruthy();
  });

  it('skips hidden items and puts a separator between the others', async () => {
    const el = await setup();
    const labels = [...el.querySelectorAll('.hx-breadcrumb-item')].map((i) =>
      i.textContent?.trim(),
    );
    expect(labels).toEqual(['', 'Settings', 'Docs', 'Profile']);
    expect(el.querySelectorAll('.hx-breadcrumb-separator').length).toBe(3);
  });

  it('links router and url items, and marks the last one as the current page', async () => {
    const el = await setup();
    const links = [...el.querySelectorAll<HTMLAnchorElement>('a.hx-breadcrumb-link')];
    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      '/',
      '/settings',
      'https://example.com/docs',
    ]);
    expect(links[2].getAttribute('target')).toBe('_blank');
    const current = el.querySelector('[aria-current="page"]') as HTMLElement;
    expect(current.tagName).toBe('SPAN');
    expect(current.textContent?.trim()).toBe('Profile');
  });
});
