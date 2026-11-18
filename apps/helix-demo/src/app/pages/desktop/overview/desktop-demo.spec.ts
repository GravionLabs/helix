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
});
