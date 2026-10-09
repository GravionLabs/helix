import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HxInput } from '../input/input';
import { HxIconField, HxInputIcon } from './icon-field';

@Component({
  imports: [HxIconField, HxInputIcon, HxInput],
  template: `
    <hx-icon-field id="a" [iconPosition]="position()">
      <i class="pi pi-search" hx-input-icon></i>
      <input hx-input size="small" aria-label="Search" />
    </hx-icon-field>
    <hx-icon-field id="b">
      <svg hx-input-icon aria-label="Warning" role="img"></svg>
      <input hx-input aria-label="Name" />
    </hx-icon-field>
  `,
})
class Host {
  position = signal<'left' | 'right'>('left');
}

describe('HxIconField', () => {
  let fixture: ComponentFixture<Host>;
  const el = (id: string) =>
    fixture.debugElement.query(By.css(`#${id}`)).nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
  });

  it('puts the icon on the start edge by default and projects field and icon', () => {
    expect(el('a').classList).toContain('hx-icon-field');
    expect(el('a').classList).toContain('hx-icon-field-left');
    expect(el('a').querySelector('i.hx-input-icon')).toBeTruthy();
    expect(el('a').querySelector('input.hx-input')).toBeTruthy();
  });

  it('moves the icon to the end edge', async () => {
    fixture.componentInstance.position.set('right');
    await fixture.whenStable();
    expect(el('a').classList).toContain('hx-icon-field-right');
    expect(el('a').classList).not.toContain('hx-icon-field-left');
  });

  it('hides a decorative icon from assistive technology', () => {
    expect(el('a').querySelector('.hx-input-icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('keeps an icon with an aria-label exposed', () => {
    expect(el('b').querySelector('.hx-input-icon')?.hasAttribute('aria-hidden')).toBe(false);
  });
});
