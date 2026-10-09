import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxSkeleton } from './skeleton';

@Component({
  imports: [HxSkeleton],
  template: `
    <hx-skeleton id="default" />
    <hx-skeleton id="line" width="10rem" height="2rem" borderRadius="4px" animation="none" />
    <hx-skeleton id="circle" shape="circle" size="4rem" width="1px" />
  `,
})
class Host {}

describe('HxSkeleton', () => {
  let fixture: ComponentFixture<Host>;
  const el = (id: string) =>
    (fixture.nativeElement as HTMLElement).querySelector(`#${id}`) as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('is hidden from assistive technology and has no content', () => {
    expect(el('default').getAttribute('aria-hidden')).toBe('true');
    expect(el('default').textContent).toBe('');
  });

  it('defaults to a full-width rem-high wave', () => {
    expect(el('default').style.width).toBe('100%');
    expect(el('default').style.height).toBe('1rem');
    expect(el('default').classList).toContain('hx-skeleton-wave');
  });

  it('takes width, height, radius and animation none', () => {
    expect(el('line').style.width).toBe('10rem');
    expect(el('line').style.height).toBe('2rem');
    expect(el('line').style.borderRadius).toBe('4px');
    expect(el('line').classList).not.toContain('hx-skeleton-wave');
  });

  it('size wins over width and height; a circle is round', () => {
    expect(el('circle').style.width).toBe('4rem');
    expect(el('circle').style.height).toBe('4rem');
    expect(el('circle').classList).toContain('hx-skeleton-circle');
  });
});
