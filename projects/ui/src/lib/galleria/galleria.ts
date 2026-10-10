import { Dialog, type DialogRef } from '@angular/cdk/dialog';
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
  viewChild,
} from '@angular/core';
import { nextId } from '../internal/ids';

/** One picture of a galleria. */
export interface HxGalleriaItem {
  src: string;
  alt: string;
  /** A smaller picture for the thumbnail strip (default: `src`). */
  thumbnailSrc?: string;
  title?: string;
  caption?: string;
}

export type HxGalleriaThumbnailsPosition = 'bottom' | 'top' | 'left' | 'right';

export interface HxGalleriaItemContext {
  $implicit: HxGalleriaItem;
  index: number;
}

/** The template of the stage: `<ng-template hxGalleriaItem let-item let-index="index">`. */
@Directive({ selector: 'ng-template[hxGalleriaItem]' })
export class HxGalleriaItemTemplate {
  readonly template = inject<TemplateRef<HxGalleriaItemContext>>(TemplateRef);
}

/** The template of a thumbnail: `<ng-template hxGalleriaThumbnail let-item>`. */
@Directive({ selector: 'ng-template[hxGalleriaThumbnail]' })
export class HxGalleriaThumbnail {
  readonly template = inject<TemplateRef<HxGalleriaItemContext>>(TemplateRef);
}

/** The template of the caption over the stage: `<ng-template hxGalleriaCaption let-item>`. */
@Directive({ selector: 'ng-template[hxGalleriaCaption]' })
export class HxGalleriaCaption {
  readonly template = inject<TemplateRef<HxGalleriaItemContext>>(TemplateRef);
}

/**
 * An image gallery: a stage with the current picture, a strip of thumbnails, previous/next buttons, captions and an
 * optional full-screen mode in a modal overlay.
 *
 * ```html
 * <hx-galleria [value]="pictures" [(activeIndex)]="index" [numVisible]="5" circular ariaLabel="Product pictures" />
 * <hx-galleria [value]="pictures" fullScreen [(visible)]="open" />
 * ```
 *
 * The stage is a `region` with `aria-roledescription="carousel"` and the arrow keys move between pictures; the
 * thumbnails are a `tablist`. Full screen is a modal dialog: the focus is trapped, Escape closes it and the focus goes
 * back to where it was.
 */
@Component({
  selector: 'hx-galleria',
  imports: [NgTemplateOutlet],
  templateUrl: './galleria.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hx-galleria-host',
    '(mouseenter)': 'hovered.set(true)',
    '(mouseleave)': 'hovered.set(false)',
  },
})
export class HxGalleria {
  readonly value = input<readonly HxGalleriaItem[]>([]);
  /** The picture on the stage (0-based); `activeIndexChange` is its output. */
  readonly activeIndex = model(0);
  /** Thumbnails shown at a time. */
  readonly numVisible = input(5, { transform: numberAttribute });
  /** After the last picture comes the first again. */
  readonly circular = input(false, { transform: booleanAttribute });
  readonly autoplay = input(false, { transform: booleanAttribute });
  readonly autoplayInterval = input(4000, { transform: numberAttribute });
  readonly showThumbnails = input(true, { transform: booleanAttribute });
  /** Dots over the stage. */
  readonly showIndicators = input(false, { transform: booleanAttribute });
  readonly showItemNavigators = input(true, { transform: booleanAttribute });
  readonly thumbnailsPosition = input<HxGalleriaThumbnailsPosition>('bottom');
  /** The gallery is not shown inline; `visible` opens it in a modal overlay. */
  readonly fullScreen = input(false, { transform: booleanAttribute });
  /** Full screen open (with `fullScreen`); `visibleChange` is its output. */
  readonly visible = model(false);
  /** CSS height of the stage inline (full screen uses the viewport). */
  readonly height = input('24rem');
  readonly ariaLabel = input('Gallery');
  readonly prevLabel = input('Previous picture');
  readonly nextLabel = input('Next picture');
  readonly closeLabel = input('Close');
  /** `{index}` and `{count}` are replaced. */
  readonly itemLabelTemplate = input('{index} of {count}');

  protected readonly itemTemplate = contentChild(HxGalleriaItemTemplate);
  protected readonly thumbnailTemplate = contentChild(HxGalleriaThumbnail);
  protected readonly captionTemplate = contentChild(HxGalleriaCaption);
  private readonly content = viewChild<TemplateRef<unknown>>('content');

  protected readonly hovered = signal(false);
  protected readonly focused = signal(false);
  protected readonly id = nextId('hx-galleria');
  readonly #dialog = inject(Dialog);
  #ref: DialogRef<unknown, unknown> | undefined;
  private readonly reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  protected readonly count = computed(() => this.value().length);
  protected readonly index = computed(() =>
    this.count() ? Math.min(Math.max(0, this.activeIndex()), this.count() - 1) : 0,
  );
  protected readonly current = computed<HxGalleriaItem | undefined>(
    () => this.value()[this.index()],
  );
  protected readonly isFirst = computed(() => this.index() === 0);
  protected readonly isLast = computed(() => this.index() >= this.count() - 1);
  protected readonly prevDisabled = computed(() => !this.circular() && this.isFirst());
  protected readonly nextDisabled = computed(() => !this.circular() && this.isLast());
  protected readonly indices = computed(() => Array.from({ length: this.count() }, (_, i) => i));
  protected readonly hasCaption = computed(
    () => !!this.captionTemplate() || !!this.current()?.title || !!this.current()?.caption,
  );

  /** The first thumbnail of the strip: the strip moves so the active picture stays visible. */
  private readonly thumbStart = signal(0);
  protected readonly thumbsVisible = computed(() =>
    Math.max(1, Math.min(this.numVisible(), this.count())),
  );
  protected readonly thumbNavigation = computed(() => this.count() > this.thumbsVisible());
  protected readonly thumbs = computed(() => {
    const start = this.thumbStart();
    return this.indices().slice(start, start + this.thumbsVisible());
  });
  protected readonly thumbPrevDisabled = computed(() => this.thumbStart() === 0);
  protected readonly thumbNextDisabled = computed(
    () => this.thumbStart() + this.thumbsVisible() >= this.count(),
  );

  constructor() {
    const destroyRef = inject(DestroyRef);
    // the strip follows the active picture
    effect(() => {
      const index = this.index();
      const visible = this.thumbsVisible();
      const max = Math.max(0, this.count() - visible);
      untracked(() => {
        const start = this.thumbStart();
        if (index < start) this.thumbStart.set(index);
        else if (index >= start + visible) this.thumbStart.set(Math.min(index - visible + 1, max));
        else if (start > max) this.thumbStart.set(max);
      });
    });
    // autoplay
    let timer: ReturnType<typeof setInterval> | undefined;
    const stop = () => {
      if (timer !== undefined) clearInterval(timer);
      timer = undefined;
    };
    effect(() => {
      const on = this.autoplay() && this.autoplayInterval() > 0 && this.count() > 1;
      const paused = this.hovered() || this.focused() || this.reducedMotion;
      stop();
      if (on && !paused)
        timer = setInterval(() => untracked(() => this.next(true)), this.autoplayInterval());
    });
    // full screen
    effect(() => {
      const open = this.fullScreen() && this.visible();
      const content = this.content();
      untracked(() => {
        if (open && content) this.#open(content);
        else if (!open) this.#close();
      });
    });
    destroyRef.onDestroy(() => {
      stop();
      this.#close();
    });
  }

  protected itemLabel(index: number): string {
    return this.itemLabelTemplate()
      .replace('{index}', String(index + 1))
      .replace('{count}', String(this.count()));
  }

  protected thumbnailSrc(item: HxGalleriaItem): string {
    return item.thumbnailSrc ?? item.src;
  }

  /** Shows a picture (0-based); wraps around when `circular`, else clamps. */
  goTo(index: number): void {
    const count = this.count();
    if (!count) return;
    const target = this.circular()
      ? ((index % count) + count) % count
      : Math.min(Math.max(0, index), count - 1);
    if (target !== this.index()) this.activeIndex.set(target);
  }

  next(auto = false): void {
    if (auto && !this.circular() && this.isLast()) {
      this.goTo(0);
      return;
    }
    this.goTo(this.index() + 1);
  }

  prev(): void {
    this.goTo(this.index() - 1);
  }

  protected scrollThumbs(delta: number): void {
    const max = Math.max(0, this.count() - this.thumbsVisible());
    this.thumbStart.set(Math.min(Math.max(0, this.thumbStart() + delta), max));
  }

  protected onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        this.prev();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        this.next();
        break;
      case 'Home':
        event.preventDefault();
        this.goTo(0);
        break;
      case 'End':
        event.preventDefault();
        this.goTo(this.count() - 1);
        break;
    }
  }

  protected onThumbKeydown(event: KeyboardEvent): void {
    this.onKeydown(event);
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      const list = (event.currentTarget as HTMLElement).closest('.hx-galleria-thumbnail-list');
      queueMicrotask(() => list?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus());
    }
  }

  protected onFocusIn(): void {
    this.focused.set(true);
  }

  protected onFocusOut(event: FocusEvent): void {
    const host = event.currentTarget as HTMLElement;
    if (!event.relatedTarget || !host.contains(event.relatedTarget as Node))
      this.focused.set(false);
  }

  protected close(): void {
    this.visible.set(false);
  }

  #open(content: TemplateRef<unknown>): void {
    if (this.#ref) return;
    const ref = this.#dialog.open(content, {
      hasBackdrop: true,
      backdropClass: 'hx-galleria-backdrop',
      panelClass: 'hx-galleria-panel',
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      ariaModal: true,
      ariaLabel: this.ariaLabel(),
      disableClose: true,
      autoFocus: 'first-tabbable',
      restoreFocus: true,
    });
    this.#ref = ref;
    ref.keydownEvents.subscribe((event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.visible.set(false);
      }
    });
    ref.backdropClick.subscribe(() => this.visible.set(false));
    ref.closed.subscribe(() => {
      if (this.#ref === ref) {
        this.#ref = undefined;
        this.visible.set(false);
      }
    });
  }

  #close(): void {
    this.#ref?.close();
  }
}
