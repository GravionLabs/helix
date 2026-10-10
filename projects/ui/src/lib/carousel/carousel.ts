import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  Directive,
  effect,
  inject,
  input,
  model,
  numberAttribute,
  signal,
  TemplateRef,
  untracked,
} from '@angular/core';
import { nextId } from '../internal/ids';

export type HxCarouselOrientation = 'horizontal' | 'vertical';

/** How many items are visible and scrolled at a viewport width (`breakpoint` is a max-width, `'1024px'`). */
export interface HxCarouselResponsiveOption {
  breakpoint: string;
  numVisible: number;
  numScroll: number;
}

export interface HxCarouselItemContext<T = unknown> {
  $implicit: T;
  index: number;
}

/** The template of one item: `<ng-template hxCarouselItem let-item let-index="index">`. */
@Directive({ selector: 'ng-template[hxCarouselItem]' })
export class HxCarouselItem {
  readonly template = inject<TemplateRef<HxCarouselItemContext>>(TemplateRef);
}

/**
 * A slider over a list of items: `numVisible` items at a time, moved by `numScroll` with the previous/next buttons,
 * the page indicators or the arrow keys; optional autoplay and circular paging.
 *
 * ```html
 * <hx-carousel [value]="products" [numVisible]="3" [numScroll]="1" [responsiveOptions]="responsive" ariaLabel="Products">
 *   <ng-template hxCarouselItem let-product>…</ng-template>
 * </hx-carousel>
 * ```
 *
 * The carousel is a `region` with `aria-roledescription="carousel"`; the items are `group`s named "n of m"; items
 * outside the viewport are hidden from assistive technology and the tab order. Autoplay pauses while the pointer or
 * the focus is inside and stays off when the user prefers reduced motion.
 */
@Component({
  selector: 'hx-carousel',
  imports: [NgTemplateOutlet],
  templateUrl: './carousel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-carousel',
    '[class.hx-carousel-vertical]': "orientation() === 'vertical'",
    '(mouseenter)': 'hovered.set(true)',
    '(mouseleave)': 'hovered.set(false)',
    '(focusin)': 'focused.set(true)',
    '(focusout)': 'onFocusOut($event)',
    '(window:resize)': 'onResize()',
  },
})
export class HxCarousel<T = unknown> {
  readonly value = input<readonly T[]>([]);
  readonly numVisible = input(1, { transform: numberAttribute });
  readonly numScroll = input(1, { transform: numberAttribute });
  /** After the last page comes the first again. */
  readonly circular = input(false, { transform: booleanAttribute });
  /** Milliseconds between automatic page changes; 0 is off. */
  readonly autoplayInterval = input(0, { transform: numberAttribute });
  readonly orientation = input<HxCarouselOrientation>('horizontal');
  /** Height of the viewport when vertical. */
  readonly verticalViewPortHeight = input('300px');
  readonly showIndicators = input(true, { transform: booleanAttribute });
  readonly showNavigators = input(true, { transform: booleanAttribute });
  readonly responsiveOptions = input<readonly HxCarouselResponsiveOption[]>();
  /** The current page (0-based); `pageChange` is its output. */
  readonly page = model(0);
  readonly ariaLabel = input('Carousel');
  readonly prevLabel = input('Previous page');
  readonly nextLabel = input('Next page');
  /** `{page}` and `{pageCount}` are replaced. */
  readonly pageLabelTemplate = input('Page {page} of {pageCount}');
  /** `{index}` and `{count}` are replaced. */
  readonly itemLabelTemplate = input('{index} of {count}');

  protected readonly itemTemplate = contentChild(HxCarouselItem);
  protected readonly hovered = signal(false);
  protected readonly focused = signal(false);
  protected readonly id = nextId('hx-carousel');
  private readonly viewportWidth = signal(typeof window === 'undefined' ? 1024 : window.innerWidth);
  private readonly reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  /** The visible/scroll counts for the current viewport (the smallest matching breakpoint wins). */
  private readonly counts = computed(() => {
    const options = [...(this.responsiveOptions() ?? [])]
      .map((o) => ({ ...o, px: Number.parseFloat(o.breakpoint) }))
      .filter((o) => !Number.isNaN(o.px))
      .sort((a, b) => a.px - b.px);
    const match = options.find((o) => this.viewportWidth() <= o.px);
    const visible = Math.max(1, match?.numVisible ?? this.numVisible());
    const scroll = Math.max(1, match?.numScroll ?? this.numScroll());
    return { visible, scroll };
  });
  protected readonly visible = computed(() => this.counts().visible);
  protected readonly scroll = computed(() => this.counts().scroll);

  protected readonly pageCount = computed(() => {
    const n = this.value().length;
    const { visible, scroll } = this.counts();
    return n <= visible ? 1 : Math.ceil((n - visible) / scroll) + 1;
  });
  protected readonly currentPage = computed(() =>
    Math.min(Math.max(0, this.page()), this.pageCount() - 1),
  );
  /** The index of the first visible item. */
  protected readonly first = computed(() => {
    const n = this.value().length;
    const { visible, scroll } = this.counts();
    return Math.max(0, Math.min(this.currentPage() * scroll, n - visible));
  });
  protected readonly pages = computed(() => Array.from({ length: this.pageCount() }, (_, i) => i));
  protected readonly isFirst = computed(() => this.currentPage() === 0);
  protected readonly isLast = computed(() => this.currentPage() >= this.pageCount() - 1);
  protected readonly prevDisabled = computed(() => !this.circular() && this.isFirst());
  protected readonly nextDisabled = computed(() => !this.circular() && this.isLast());
  protected readonly itemSize = computed(() => 100 / this.visible());
  protected readonly offset = computed(() => -this.first() * this.itemSize());
  protected readonly transform = computed(() =>
    this.orientation() === 'vertical'
      ? `translateY(${this.offset()}%)`
      : `translateX(${this.offset()}%)`,
  );

  constructor() {
    const destroyRef = inject(DestroyRef);
    let timer: ReturnType<typeof setInterval> | undefined;
    const stop = () => {
      if (timer !== undefined) clearInterval(timer);
      timer = undefined;
    };
    // autoplay: runs while nothing is hovered or focused and motion is not reduced
    effect(() => {
      const interval = this.autoplayInterval();
      const paused = this.hovered() || this.focused() || this.reducedMotion || this.pageCount() < 2;
      stop();
      if (interval > 0 && !paused) {
        timer = setInterval(() => untracked(() => this.next(true)), interval);
      }
    });
    destroyRef.onDestroy(stop);
  }

  protected isVisible(index: number): boolean {
    return index >= this.first() && index < this.first() + this.visible();
  }

  protected itemLabel(index: number): string {
    return this.itemLabelTemplate()
      .replace('{index}', String(index + 1))
      .replace('{count}', String(this.value().length));
  }

  protected pageLabel(page: number): string {
    return this.pageLabelTemplate()
      .replace('{page}', String(page + 1))
      .replace('{pageCount}', String(this.pageCount()));
  }

  /** Goes to a page (0-based); wraps around when `circular`, else clamps. */
  goTo(page: number): void {
    const count = this.pageCount();
    let target = page;
    if (this.circular()) target = ((page % count) + count) % count;
    else target = Math.min(Math.max(0, page), count - 1);
    if (target === this.currentPage()) return;
    this.page.set(target);
  }

  next(auto = false): void {
    if (auto && !this.circular() && this.isLast()) {
      this.goTo(0);
      return;
    }
    this.goTo(this.currentPage() + 1);
  }

  prev(): void {
    this.goTo(this.currentPage() - 1);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const vertical = this.orientation() === 'vertical';
    const back = vertical ? 'ArrowUp' : 'ArrowLeft';
    const forward = vertical ? 'ArrowDown' : 'ArrowRight';
    switch (event.key) {
      case back:
        event.preventDefault();
        this.prev();
        break;
      case forward:
        event.preventDefault();
        this.next();
        break;
      case 'Home':
        event.preventDefault();
        this.goTo(0);
        break;
      case 'End':
        event.preventDefault();
        this.goTo(this.pageCount() - 1);
        break;
    }
  }

  protected onIndicatorKeydown(event: KeyboardEvent): void {
    this.onKeydown(event);
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      // keep the focus on the indicator of the new page
      queueMicrotask(() => {
        const host = (event.currentTarget as HTMLElement).closest('.hx-carousel-indicators');
        host?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
      });
    }
  }

  protected onFocusOut(event: FocusEvent): void {
    const host = event.currentTarget as HTMLElement;
    if (!event.relatedTarget || !host.contains(event.relatedTarget as Node))
      this.focused.set(false);
  }

  protected onResize(): void {
    this.viewportWidth.set(window.innerWidth);
  }
}
