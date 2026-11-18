import { TestBed } from '@angular/core/testing';
import { HELIX_DESKTOP_VERSION } from '@gravionlabs/helix-desktop';
import { DesktopDemo } from './desktop-demo';

describe('DesktopDemo', () => {
  it('lists the package with its version', () => {
    const fixture = TestBed.createComponent(DesktopDemo);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('@gravionlabs/helix-desktop');
    expect(text).toContain(HELIX_DESKTOP_VERSION);
  });

  it('shows the mobile shell at phone width', () => {
    const fixture = TestBed.createComponent(DesktopDemo);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('hx-mobile-shell .hx-bottom-bar')).not.toBeNull();
    expect(root.querySelectorAll('hx-mobile-shell .hx-bottom-bar-item').length).toBe(3);
  });
});
