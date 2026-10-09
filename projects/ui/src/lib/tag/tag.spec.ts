import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxTag } from './tag';

@Component({
  imports: [HxTag],
  template: `
    <hx-tag id="value" value="New" />
    <hx-tag id="content" severity="warn" rounded icon="pi pi-clock">Pending</hx-tag>
    <hx-tag id="danger" value="Late" severity="danger" />
  `,
})
class Host {}

describe('HxTag', () => {
  let fixture: ComponentFixture<Host>;
  const el = (id: string) =>
    (fixture.nativeElement as HTMLElement).querySelector(`#${id}`) as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('shows the value or the projected content as plain text', () => {
    expect(el('value').textContent?.trim()).toBe('New');
    expect(el('content').textContent?.trim()).toBe('Pending');
    expect(el('value').getAttribute('role')).toBeNull();
  });

  it('sets severity and rounded classes', () => {
    expect(el('value').className).not.toMatch(/hx-tag-(success|warn|danger)/);
    expect(el('content').classList).toContain('hx-tag-warn');
    expect(el('content').classList).toContain('hx-tag-rounded');
    expect(el('danger').classList).toContain('hx-tag-danger');
  });

  it('hides the icon from assistive technology', () => {
    const icon = el('content').querySelector('.hx-tag-icon') as HTMLElement;
    expect(icon.classList).toContain('pi-clock');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(el('value').querySelector('.hx-tag-icon')).toBeNull();
  });
});
