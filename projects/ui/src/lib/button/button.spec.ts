import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HxButton } from './button';

@Component({
  imports: [HxButton],
  template: `
    <button
      hx-button
      [variant]="variant()"
      [severity]="severity()"
      [size]="size()"
      [rounded]="rounded()"
      [raised]="raised()"
      [fluid]="fluid()"
      [iconOnly]="iconOnly()"
      [loading]="loading()"
      (click)="clicks.update((n) => n + 1)"
    >
      Save
    </button>
    <a hx-button href="#top" aria-disabled="true" (click)="clicks.update((n) => n + 1)">Docs</a>
  `,
})
class Host {
  variant = signal<'filled' | 'outlined' | 'text' | 'link'>('filled');
  severity = signal<
    'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast'
  >('primary');
  size = signal<'small' | 'medium' | 'large'>('medium');
  rounded = signal(false);
  raised = signal(false);
  fluid = signal(false);
  iconOnly = signal(false);
  loading = signal(false);
  clicks = signal(0);
}

describe('HxButton', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  let button: HTMLButtonElement;
  let anchor: HTMLAnchorElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await fixture.whenStable();
    button = fixture.debugElement.query(By.css('button')).nativeElement;
    anchor = fixture.debugElement.query(By.css('a')).nativeElement;
  });

  const classes = () => [...button.classList].filter((c) => c.startsWith('hx-'));

  it('is a plain filled primary button by default', () => {
    expect(classes()).toEqual(['hx-button']);
    expect(button.getAttribute('aria-busy')).toBeNull();
  });

  it.each([
    ['variant', 'outlined', 'hx-button-outlined'],
    ['variant', 'text', 'hx-button-text'],
    ['variant', 'link', 'hx-button-link'],
    ['severity', 'secondary', 'hx-button-secondary'],
    ['severity', 'success', 'hx-button-success'],
    ['severity', 'info', 'hx-button-info'],
    ['severity', 'warn', 'hx-button-warn'],
    ['severity', 'help', 'hx-button-help'],
    ['severity', 'danger', 'hx-button-danger'],
    ['severity', 'contrast', 'hx-button-contrast'],
    ['size', 'small', 'hx-button-sm'],
    ['size', 'large', 'hx-button-lg'],
  ] as const)('%s="%s" adds %s', async (input, value, cls) => {
    (host[input] as { set(v: string): void }).set(value);
    await fixture.whenStable();
    expect(classes()).toEqual(['hx-button', cls]);
  });

  it.each([
    ['rounded', 'hx-button-rounded'],
    ['raised', 'hx-button-raised'],
    ['fluid', 'hx-button-fluid'],
    ['iconOnly', 'hx-button-icon-only'],
    ['loading', 'hx-button-loading'],
  ] as const)('%s adds %s', async (input, cls) => {
    host[input].set(true);
    await fixture.whenStable();
    expect(classes()).toContain(cls);
  });

  it('combines a variant, a severity and a size', async () => {
    host.variant.set('outlined');
    host.severity.set('danger');
    host.size.set('large');
    await fixture.whenStable();
    expect(classes().sort()).toEqual(
      ['hx-button', 'hx-button-danger', 'hx-button-lg', 'hx-button-outlined'].sort(),
    );
  });

  it('reports a running operation with aria-busy and ignores clicks', async () => {
    host.loading.set(true);
    await fixture.whenStable();
    expect(button.getAttribute('aria-busy')).toBe('true');

    button.click();
    expect(host.clicks()).toBe(0);

    host.loading.set(false);
    await fixture.whenStable();
    expect(button.getAttribute('aria-busy')).toBeNull();
    button.click();
    expect(host.clicks()).toBe(1);
  });

  it('lets a click through when idle and swallows it on an aria-disabled anchor', () => {
    button.click();
    expect(host.clicks()).toBe(1);
    anchor.click();
    expect(host.clicks()).toBe(1);
  });

  it('keeps the native disabled attribute of a button', async () => {
    button.disabled = true;
    button.click(); // a disabled button dispatches no click
    expect(host.clicks()).toBe(0);
  });

  it('stays focusable while loading: aria-busy, not disabled', async () => {
    host.loading.set(true);
    await fixture.whenStable();
    expect(button.disabled).toBe(false);
    button.focus();
    expect(document.activeElement).toBe(button);
  });
});
