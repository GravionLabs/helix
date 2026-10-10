import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HxCarousel, HxCarouselItem } from './carousel';

@Component({
  imports: [HxCarousel, HxCarouselItem],
  template: `
    <hx-carousel [value]="items" [numVisible]="numVisible()" [numScroll]="numScroll()" [circular]="circular()" [(page)]="page" ariaLabel="Products" (pageChange)="changes.push($event)">
      <ng-template hxCarouselItem let-item let-index="index"><button class="item" type="button">{{ index }}: {{ item }}</button></ng-template>
    </hx-carousel>
  `,
})
class Host {
  items = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  numVisible = signal(3);
  numScroll = signal(1);
  circular = signal(false);
  page = signal(0);
  changes: number[] = [];
}

@Component({
  imports: [HxCarousel, HxCarouselItem],
  template: `
    <hx-carousel [value]="['a', 'b', 'c']" [autoplayInterval]="200" [(page)]="page">
      <ng-template hxCarouselItem let-item>{{ item }}</ng-template>
    </hx-carousel>
  `,
})
class AutoHost {
  page = signal(0);
}

describe('HxCarousel', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const root = () => fixture.nativeElement as HTMLElement;
  const q = (sel: string) => root().querySelector<HTMLElement>(sel) as HTMLElement;
  const qa = (sel: string) => [...root().querySelectorAll<HTMLElement>(sel)];
  const visibleItems = () =>
    qa('.hx-carousel-item:not([aria-hidden])').map((i) => i.textContent?.trim());
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

  it('is a carousel region with slides labelled "n of m" and hides the items outside the viewport', () => {
    const region = q('[role="region"]');
    expect(region.getAttribute('aria-roledescription')).toBe('carousel');
    expect(region.getAttribute('aria-label')).toBe('Products');
    const items = qa('.hx-carousel-item');
    expect(items).toHaveLength(7);
    expect(items[0].getAttribute('role')).toBe('group');
    expect(items[0].getAttribute('aria-roledescription')).toBe('slide');
    expect(items[0].getAttribute('aria-label')).toBe('1 of 7');
    expect(visibleItems()).toEqual(['0: a', '1: b', '2: c']);
    expect(items[3].getAttribute('aria-hidden')).toBe('true');
    expect(items[3].hasAttribute('inert')).toBe(true);
    expect(items[0].hasAttribute('inert')).toBe(false);
  });

  it('pages with the buttons, clamps at the ends and emits the page', async () => {
    expect(qa('.hx-carousel-indicator')).toHaveLength(5); // ceil((7-3)/1)+1
    expect(q('.hx-carousel-prev').hasAttribute('disabled')).toBe(true);
    await click(q('.hx-carousel-next'));
    expect(host.page()).toBe(1);
    expect(host.changes).toEqual([1]);
    expect(visibleItems()).toEqual(['1: b', '2: c', '3: d']);
    expect(q('.hx-carousel-track').style.transform).toContain('translateX(-33.33');
    for (let i = 0; i < 6; i++) await click(q('.hx-carousel-next'));
    expect(host.page()).toBe(4);
    expect(q('.hx-carousel-next').hasAttribute('disabled')).toBe(true);
    expect(visibleItems()).toEqual(['4: e', '5: f', '6: g']);
  });

  it('wraps around when circular', async () => {
    host.circular.set(true);
    await update();
    expect(q('.hx-carousel-prev').hasAttribute('disabled')).toBe(false);
    await click(q('.hx-carousel-prev'));
    expect(host.page()).toBe(4);
    await click(q('.hx-carousel-next'));
    expect(host.page()).toBe(0);
  });

  it('has a tablist of page indicators with the current page selected', async () => {
    const indicators = qa('.hx-carousel-indicator');
    expect(q('.hx-carousel-indicators').getAttribute('role')).toBe('tablist');
    expect(indicators[0].getAttribute('aria-selected')).toBe('true');
    expect(indicators[0].getAttribute('aria-label')).toBe('Page 1 of 5');
    expect(indicators[1].getAttribute('tabindex')).toBe('-1');
    await click(indicators[3]);
    expect(host.page()).toBe(3);
    expect(indicators[3].getAttribute('aria-selected')).toBe('true');
    expect(indicators[3].getAttribute('tabindex')).toBe('0');
  });

  it('moves with the arrow keys, Home and End on the viewport', async () => {
    const viewport = q('.hx-carousel-viewport');
    expect(viewport.getAttribute('tabindex')).toBe('0');
    await key(viewport, 'ArrowRight');
    expect(host.page()).toBe(1);
    await key(viewport, 'End');
    expect(host.page()).toBe(4);
    await key(viewport, 'ArrowLeft');
    expect(host.page()).toBe(3);
    await key(viewport, 'Home');
    expect(host.page()).toBe(0);
  });

  it('scrolls by numScroll and shows the last page without a gap', async () => {
    host.numScroll.set(3);
    await update();
    expect(qa('.hx-carousel-indicator')).toHaveLength(3); // ceil(4/3)+1
    await click(q('.hx-carousel-next'));
    expect(visibleItems()).toEqual(['3: d', '4: e', '5: f']);
    await click(q('.hx-carousel-next'));
    expect(visibleItems()).toEqual(['4: e', '5: f', '6: g']); // clamped to the end
  });

  it('shows everything on one page without indicators when the items fit', async () => {
    host.numVisible.set(7);
    await update();
    expect(q('.hx-carousel-indicators')).toBeNull();
    expect(visibleItems()).toHaveLength(7);
  });

  it('autoplays, pauses while hovered and starts over after the last page', async () => {
    vi.useFakeTimers();
    try {
      const f = TestBed.createComponent(AutoHost);
      f.detectChanges();
      await f.whenStable();
      f.detectChanges();
      const auto = f.componentInstance;
      vi.advanceTimersByTime(250);
      expect(auto.page()).toBe(1);
      const carousel = (f.nativeElement as HTMLElement).querySelector('hx-carousel') as HTMLElement;
      carousel.dispatchEvent(new MouseEvent('mouseenter'));
      f.detectChanges();
      vi.advanceTimersByTime(1000);
      expect(auto.page()).toBe(1);
      carousel.dispatchEvent(new MouseEvent('mouseleave'));
      f.detectChanges();
      vi.advanceTimersByTime(250);
      expect(auto.page()).toBe(2);
      vi.advanceTimersByTime(250);
      expect(auto.page()).toBe(0); // 3 pages, back to the start
      f.destroy();
    } finally {
      vi.useRealTimers();
    }
  });
});
