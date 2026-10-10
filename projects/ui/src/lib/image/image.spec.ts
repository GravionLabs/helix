import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxImage } from './image';

@Component({
  imports: [HxImage],
  template: `
    <hx-image id="plain" src="/img/a.jpg" alt="A watch" width="200" />
    <hx-image id="prev" src="/img/b.jpg" previewImageSrc="/img/b-large.jpg" alt="A band" preview [zoomMax]="1.5" (show)="shown.set(shown() + 1)" (hide)="hidden.set(hidden() + 1)" />
  `,
})
class Host {
  shown = signal(0);
  hidden = signal(0);
}

describe('HxImage', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const root = () => fixture.nativeElement as HTMLElement;
  const update = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const overlay = () => document.querySelector('.hx-image-overlay') as HTMLElement | null;
  const action = (cls: string) => overlay()?.querySelector(`.${cls}`) as HTMLButtonElement;
  const original = () => overlay()?.querySelector('.hx-image-original') as HTMLImageElement;
  const click = async (el: HTMLElement) => {
    el.click();
    await update();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await update();
  });

  afterEach(async () => {
    action('hx-image-close')?.click();
    await update();
    fixture.destroy();
  });

  it('renders the image with alt and size, and a preview button only with preview', () => {
    const plain = root().querySelector('#plain') as HTMLElement;
    const img = plain.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('/img/a.jpg');
    expect(img.alt).toBe('A watch');
    expect(img.style.width).toBe('200px');
    expect(plain.querySelector('button')).toBeNull();
    const prev = root().querySelector('#prev') as HTMLElement;
    expect(prev.querySelector('button')?.getAttribute('aria-label')).toBe('Preview A band');
  });

  it('opens a modal preview with the large picture and a labelled toolbar, and closes it', async () => {
    const button = root().querySelector('#prev button') as HTMLElement;
    await click(button);
    expect(overlay()).toBeTruthy();
    expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-modal')).toBe('true');
    expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe('A band');
    expect(original().getAttribute('src')).toBe('/img/b-large.jpg');
    expect(original().alt).toBe('A band');
    expect(
      [
        'hx-image-rotate-left',
        'hx-image-rotate-right',
        'hx-image-zoom-out',
        'hx-image-zoom-in',
        'hx-image-close',
      ].map((c) => action(c).getAttribute('aria-label')),
    ).toEqual(['Rotate left', 'Rotate right', 'Zoom out', 'Zoom in', 'Close']);
    expect(host.shown()).toBe(1);
    await click(action('hx-image-close'));
    await update();
    expect(overlay()).toBeNull();
    expect(host.hidden()).toBe(1);
  });

  it('rotates and zooms with the toolbar and the keys, within the limits', async () => {
    await click(root().querySelector('#prev button') as HTMLElement);
    expect(original().style.transform).toBe('rotate(0deg) scale(1)');
    await click(action('hx-image-rotate-right'));
    expect(original().style.transform).toBe('rotate(90deg) scale(1)');
    await click(action('hx-image-rotate-left'));
    await click(action('hx-image-rotate-left'));
    expect(original().style.transform).toBe('rotate(-90deg) scale(1)');
    await click(action('hx-image-zoom-in'));
    expect(original().style.transform).toBe('rotate(-90deg) scale(1.25)');
    await click(action('hx-image-zoom-in'));
    expect(original().style.transform).toBe('rotate(-90deg) scale(1.5)');
    expect(action('hx-image-zoom-in').disabled).toBe(true);
    overlay()?.dispatchEvent(new KeyboardEvent('keydown', { key: '-', bubbles: true }));
    await update();
    expect(original().style.transform).toBe('rotate(-90deg) scale(1.25)');
    for (let i = 0; i < 5; i++) await click(action('hx-image-zoom-out'));
    expect(original().style.transform).toBe('rotate(-90deg) scale(0.5)');
    expect(action('hx-image-zoom-out').disabled).toBe(true);
  });

  it('closes on Escape and starts fresh the next time', async () => {
    await click(root().querySelector('#prev button') as HTMLElement);
    await click(action('hx-image-zoom-in'));
    overlay()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await update();
    expect(overlay()).toBeNull();
    await click(root().querySelector('#prev button') as HTMLElement);
    expect(original().style.transform).toBe('rotate(0deg) scale(1)');
  });
});
