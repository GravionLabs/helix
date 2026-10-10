import { Dialog, type DialogRef } from '@angular/cdk/dialog';
import { NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  Directive,
  inject,
  input,
  numberAttribute,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';

/** The content of the hover indicator over a previewable image: `<ng-template hxImageIndicator>`. */
@Directive({ selector: 'ng-template[hxImageIndicator]' })
export class HxImageIndicator {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

/**
 * An image, optionally with a preview: a click (or Enter on the button over it) opens the picture in a modal
 * overlay with a toolbar to rotate, zoom and close.
 *
 * ```html
 * <hx-image src="product.jpg" alt="Bamboo watch" width="250" preview />
 * <hx-image src="thumb.jpg" previewImageSrc="large.jpg" alt="Bamboo watch" preview />
 * ```
 *
 * The preview trigger is a button named "Preview {alt}"; the overlay is a modal dialog (focus trap, Escape closes,
 * focus restored); the toolbar buttons are labelled; + and - zoom from the keyboard.
 */
@Component({
  selector: 'hx-image',
  imports: [NgStyle, NgTemplateOutlet],
  templateUrl: './image.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-image', '[class.hx-image-preview]': 'preview()' },
})
export class HxImage {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  /** Width and height of the inline image (CSS or number of pixels). */
  readonly width = input<string | number>();
  readonly height = input<string | number>();
  /** A click opens the picture in an overlay. */
  readonly preview = input(false, { transform: booleanAttribute });
  /** A larger picture for the overlay (default: `src`). */
  readonly previewImageSrc = input<string>();
  readonly imageClass = input<string>();
  readonly imageStyle = input<Record<string, string>>();
  readonly showToolbar = input(true, { transform: booleanAttribute });
  readonly zoomStep = input(0.25, { transform: numberAttribute });
  readonly zoomMin = input(0.5, { transform: numberAttribute });
  readonly zoomMax = input(3, { transform: numberAttribute });
  /** `{alt}` is replaced. */
  readonly previewLabelTemplate = input('Preview {alt}');
  readonly rotateLeftLabel = input('Rotate left');
  readonly rotateRightLabel = input('Rotate right');
  readonly zoomOutLabel = input('Zoom out');
  readonly zoomInLabel = input('Zoom in');
  readonly closeLabel = input('Close');

  /** The preview opened. */
  readonly show = output<void>();
  /** The preview closed. */
  readonly hide = output<void>();

  protected readonly indicatorTemplate = contentChild(HxImageIndicator);
  private readonly overlay = viewChild<TemplateRef<unknown>>('overlay');
  readonly #dialog = inject(Dialog);
  #ref: DialogRef<unknown, unknown> | undefined;

  protected readonly rotation = signal(0);
  protected readonly scale = signal(1);
  protected readonly transform = computed(
    () => `rotate(${this.rotation()}deg) scale(${this.scale()})`,
  );
  protected readonly previewLabel = computed(() =>
    this.previewLabelTemplate().replace('{alt}', this.alt()),
  );
  protected readonly previewSrc = computed(() => this.previewImageSrc() ?? this.src());
  protected readonly zoomOutDisabled = computed(() => this.scale() <= this.zoomMin() + 1e-9);
  protected readonly zoomInDisabled = computed(() => this.scale() >= this.zoomMax() - 1e-9);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.#ref?.close());
  }

  protected cssSize(value: string | number | undefined): string | null {
    if (value === undefined || value === null || value === '') return null;
    return typeof value === 'number' || /^\d+$/.test(value) ? `${value}px` : value;
  }

  /** Opens the preview. */
  open(): void {
    const overlay = this.overlay();
    if (!this.preview() || this.#ref || !overlay) return;
    this.rotation.set(0);
    this.scale.set(1);
    const ref = this.#dialog.open(overlay, {
      hasBackdrop: true,
      backdropClass: 'hx-image-backdrop',
      panelClass: 'hx-image-panel',
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      ariaModal: true,
      ariaLabel: this.alt(),
      disableClose: true,
      autoFocus: 'first-tabbable',
      restoreFocus: true,
    });
    this.#ref = ref;
    ref.keydownEvents.subscribe((event) => this.onKeydown(event));
    ref.backdropClick.subscribe(() => this.close());
    ref.closed.subscribe(() => {
      if (this.#ref === ref) {
        this.#ref = undefined;
        this.hide.emit();
      }
    });
    this.show.emit();
  }

  /** Closes the preview. */
  close(): void {
    this.#ref?.close();
  }

  protected rotate(degrees: number): void {
    this.rotation.update((r) => r + degrees);
  }

  protected zoom(direction: 1 | -1): void {
    const next = this.scale() + direction * this.zoomStep();
    this.scale.set(
      Math.min(this.zoomMax(), Math.max(this.zoomMin(), Math.round(next * 1000) / 1000)),
    );
  }

  protected onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case '+':
      case '=':
        event.preventDefault();
        this.zoom(1);
        break;
      case '-':
        event.preventDefault();
        this.zoom(-1);
        break;
    }
  }
}
