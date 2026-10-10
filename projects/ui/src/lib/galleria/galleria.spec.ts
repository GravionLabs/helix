import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HxGalleria, type HxGalleriaItem } from './galleria';

const PICTURES: HxGalleriaItem[] = Array.from({ length: 8 }, (_, i) => ({
  src: `/img/${i}.jpg`,
  thumbnailSrc: `/img/${i}-s.jpg`,
  alt: `Picture ${i + 1}`,
  title: `Title ${i + 1}`,
  caption: i === 0 ? 'First caption' : undefined,
}));

@Component({
  imports: [HxGalleria],
  template: `
    <hx-galleria [value]="pictures" [(activeIndex)]="index" [numVisible]="3" [circular]="circular()" [showIndicators]="indicators()" ariaLabel="Product pictures" />
    <hx-galleria id="full" [value]="pictures" fullScreen [(visible)]="open" ariaLabel="Full screen pictures" />
    <button id="opener" type="button" (click)="open.set(true)">open</button>
  `,
})
class Host {
  pictures = PICTURES;
  index = signal(0);
  circular = signal(false);
  indicators = signal(false);
  open = signal(false);
}

describe('HxGalleria', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const root = () => fixture.nativeElement as HTMLElement;
  const inline = () => root().querySelector('hx-galleria:not(#full)') as HTMLElement;
  const q = (sel: string) => inline().querySelector<HTMLElement>(sel) as HTMLElement;
  const qa = (sel: string) => [...inline().querySelectorAll<HTMLElement>(sel)];
  const update = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const click = async (el: HTMLElement) => {
    el.click();
    await update();
  };
  const key = async (el: HTMLElement, k: string) => {
    el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
    await update();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await update();
  });

  afterEach(() => {
    host.open.set(false);
    fixture.detectChanges();
    fixture.destroy();
  });

  it('shows the active picture on a carousel region with its alt, caption and "n of m" label', () => {
    const stage = q('.hx-galleria-stage');
    expect(stage.getAttribute('role')).toBe('region');
    expect(stage.getAttribute('aria-roledescription')).toBe('carousel');
    expect(stage.getAttribute('aria-label')).toBe('Product pictures');
    expect(stage.getAttribute('tabindex')).toBe('0');
    const img = q('.hx-galleria-image') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('/img/0.jpg');
    expect(img.alt).toBe('Picture 1');
    expect(q('.hx-galleria-item').getAttribute('aria-label')).toBe('1 of 8');
    expect(q('.hx-galleria-caption-title').textContent).toBe('Title 1');
    expect(q('.hx-galleria-caption-text').textContent).toBe('First caption');
  });

  it('moves with the buttons and the arrow keys and clamps at the ends', async () => {
    expect(q('.hx-galleria-prev').hasAttribute('disabled')).toBe(true);
    await click(q('.hx-galleria-next'));
    expect(host.index()).toBe(1);
    expect((q('.hx-galleria-image') as HTMLImageElement).getAttribute('src')).toBe('/img/1.jpg');
    await key(q('.hx-galleria-stage'), 'End');
    expect(host.index()).toBe(7);
    expect(q('.hx-galleria-next').hasAttribute('disabled')).toBe(true);
    await key(q('.hx-galleria-stage'), 'ArrowLeft');
    expect(host.index()).toBe(6);
    await key(q('.hx-galleria-stage'), 'Home');
    expect(host.index()).toBe(0);
  });

  it('wraps around when circular', async () => {
    host.circular.set(true);
    await update();
    await click(q('.hx-galleria-prev'));
    expect(host.index()).toBe(7);
    await click(q('.hx-galleria-next'));
    expect(host.index()).toBe(0);
  });

  it('shows a strip of numVisible thumbnails as a tablist that follows the active picture', async () => {
    const list = q('.hx-galleria-thumbnail-list');
    expect(list.getAttribute('role')).toBe('tablist');
    expect(qa('.hx-galleria-thumbnail')).toHaveLength(3);
    expect(qa('.hx-galleria-thumbnail').map((t) => t.getAttribute('aria-label'))).toEqual([
      'Picture 1',
      'Picture 2',
      'Picture 3',
    ]);
    expect(qa('.hx-galleria-thumbnail-image').map((i) => i.getAttribute('src'))[0]).toBe(
      '/img/0-s.jpg',
    );
    expect(qa('.hx-galleria-thumbnail')[0].getAttribute('aria-selected')).toBe('true');
    expect(qa('.hx-galleria-thumbnail')[1].getAttribute('tabindex')).toBe('-1');
    await click(qa('.hx-galleria-thumbnail')[2]);
    expect(host.index()).toBe(2);
    await click(q('.hx-galleria-next'));
    expect(host.index()).toBe(3);
    expect(qa('.hx-galleria-thumbnail').map((t) => t.getAttribute('aria-label'))).toEqual([
      'Picture 2',
      'Picture 3',
      'Picture 4',
    ]);
    await click(q('.hx-galleria-thumbnail-next'));
    expect(qa('.hx-galleria-thumbnail').map((t) => t.getAttribute('aria-label'))).toEqual([
      'Picture 3',
      'Picture 4',
      'Picture 5',
    ]);
    expect(host.index()).toBe(3);
  });

  it('can show indicator dots on the stage', async () => {
    expect(q('.hx-galleria-indicators')).toBeNull();
    host.indicators.set(true);
    await update();
    const dots = qa('.hx-galleria-indicator');
    expect(dots).toHaveLength(8);
    expect(dots[0].getAttribute('aria-selected')).toBe('true');
    await click(dots[4]);
    expect(host.index()).toBe(4);
  });

  it('renders nothing inline in full screen mode and opens a modal dialog that Escape closes', async () => {
    const full = root().querySelector('#full') as HTMLElement;
    expect(full.querySelector('.hx-galleria')).toBeNull();
    expect(document.querySelector('.hx-galleria-fullscreen')).toBeNull();
    await click(root().querySelector('#opener') as HTMLElement);
    const dialog = document.querySelector('.hx-galleria-panel') as HTMLElement;
    expect(dialog).toBeTruthy();
    expect(document.querySelector('.hx-galleria-fullscreen')).toBeTruthy();
    expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-modal')).toBe('true');
    expect(document.querySelector('.hx-galleria-close')?.getAttribute('aria-label')).toBe('Close');
    document
      .querySelector('.hx-galleria-fullscreen')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await update();
    expect(host.open()).toBe(false);
    await update();
    expect(document.querySelector('.hx-galleria-fullscreen')).toBeNull();
  });
});
