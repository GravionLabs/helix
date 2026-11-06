import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

/**
 * The scrolling row of `hx-tab-list` and `hx-tab-bar`: the projected tabs in a scroller and, while `enabled` and the
 * tabs overflow, a ‹ › button at each end. It measures on resize and whenever tabs are added or removed.
 * With `wheel` the vertical mouse wheel scrolls the row sideways. The buttons are for the pointer, not tab stops.
 */
@Component({
  selector: 'hx-tab-scroller',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-tab-scroll' },
  template: `
    @if (enabled() && overflowing()) {
      <button #prev type="button" class="hx-tab-nav hx-tab-nav-prev" tabindex="-1" aria-label="Scroll tabs left" (click)="scroll(-1)">
        <span class="hx-tab-nav-icon-prev" aria-hidden="true"></span>
      </button>
    }
    <div #scroller class="hx-tab-scroller" (scroll)="measure()" (wheel)="onWheel($event)">
      <ng-content />
    </div>
    @if (enabled() && overflowing()) {
      <button #next type="button" class="hx-tab-nav hx-tab-nav-next" tabindex="-1" aria-label="Scroll tabs right" (click)="scroll(1)">
        <span class="hx-tab-nav-icon-next" aria-hidden="true"></span>
      </button>
    }
  `,
})
export class HxTabScroller {
  /** Show the scroll buttons while the tabs overflow. */
  readonly enabled = input(true, { transform: booleanAttribute });
  /** Scroll sideways with the vertical mouse wheel. */
  readonly wheel = input(false, { transform: booleanAttribute });

  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #destroyRef = inject(DestroyRef);
  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  private readonly prev = viewChild<ElementRef<HTMLElement>>('prev');
  private readonly next = viewChild<ElementRef<HTMLElement>>('next');
  /** The tabs are wider than the row. */
  readonly overflowing = signal(false);

  constructor() {
    afterNextRender(() => {
      this.measure();
      const el = this.scroller()?.nativeElement;
      if (!el) return;
      if (typeof ResizeObserver !== 'undefined') {
        const resize = new ResizeObserver(() => this.measure());
        resize.observe(this.#host.nativeElement);
        this.#destroyRef.onDestroy(() => resize.disconnect());
      }
      if (typeof MutationObserver !== 'undefined') {
        // tabs added or removed change the width of the content, not of the row
        const mutation = new MutationObserver(() => this.measure());
        mutation.observe(el, { childList: true, subtree: true, characterData: true });
        this.#destroyRef.onDestroy(() => mutation.disconnect());
      }
    });
  }

  measure(): void {
    const el = this.scroller()?.nativeElement;
    if (el) this.overflowing.set(el.scrollWidth > el.clientWidth + 1);
  }

  protected scroll(direction: 1 | -1): void {
    const el = this.scroller()?.nativeElement;
    el?.scrollBy?.({ left: direction * el.clientWidth * 0.6, behavior: 'smooth' });
  }

  protected onWheel(event: WheelEvent): void {
    const el = this.scroller()?.nativeElement;
    if (!el || !this.wheel() || el.scrollWidth <= el.clientWidth) return;
    // a sideways gesture scrolls the row by itself
    if (event.deltaY === 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    event.preventDefault();
    el.scrollLeft += event.deltaY;
  }

  /** Scrolls `tab` into the visible part of the row, clear of the scroll buttons. */
  reveal(tab: Element): void {
    const el = this.scroller()?.nativeElement;
    if (!el) return;
    const row = el.getBoundingClientRect();
    const at = tab.getBoundingClientRect();
    const start = row.left + (this.prev()?.nativeElement.offsetWidth ?? 0);
    const end = row.right - (this.next()?.nativeElement.offsetWidth ?? 0);
    if (at.left < start) el.scrollLeft -= start - at.left;
    else if (at.right > end) el.scrollLeft += at.right - end;
  }
}
