import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxBadge, HxOverlayBadge } from './badge';

@Component({
  imports: [HxBadge, HxOverlayBadge],
  template: `
    <hx-badge id="plain" value="4" />
    <hx-badge id="danger" value="9" severity="danger" size="large" />
    <hx-badge id="dot" severity="success" />
    <hx-badge id="zero" [value]="0" size="small" />
    <hx-overlay-badge id="overlay" value="2" severity="info" size="xlarge">
      <button id="wrapped" aria-label="Inbox, 2 new">Inbox</button>
    </hx-overlay-badge>
  `,
})
class Host {}

describe('HxBadge', () => {
  let fixture: ComponentFixture<Host>;
  const el = (id: string) =>
    (fixture.nativeElement as HTMLElement).querySelector(`#${id}`) as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('shows the value as text', () => {
    expect(el('plain').textContent?.trim()).toBe('4');
    expect(el('plain').classList).not.toContain('hx-badge-dot');
  });

  it('sets the severity and size classes', () => {
    expect(el('danger').classList).toContain('hx-badge-danger');
    expect(el('danger').classList).toContain('hx-badge-lg');
  });

  it('is a dot without a value, but 0 is a value', () => {
    expect(el('dot').classList).toContain('hx-badge-dot');
    expect(el('dot').classList).toContain('hx-badge-success');
    expect(el('dot').textContent?.trim()).toBe('');
    expect(el('zero').classList).not.toContain('hx-badge-dot');
    expect(el('zero').textContent?.trim()).toBe('0');
  });

  it('overlays a badge after the wrapped content, with its inputs', () => {
    const badge = el('overlay').querySelector('.hx-overlay-badge-badge') as HTMLElement;
    expect(badge.textContent?.trim()).toBe('2');
    expect(badge.classList).toContain('hx-badge-info');
    expect(badge.classList).toContain('hx-badge-xl');
    expect(el('overlay').firstElementChild).toBe(el('wrapped'));
    expect(el('wrapped').getAttribute('aria-label')).toBe('Inbox, 2 new');
  });
});
