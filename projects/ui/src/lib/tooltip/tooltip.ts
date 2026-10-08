import { Overlay, type OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

export type HxTooltipPosition = 'top' | 'right' | 'bottom' | 'left';
export type HxTooltipEvent = 'hover' | 'focus' | 'both';

let nextId = 0;

/** The bubble. Created by the directive in a CDK overlay. */
@Component({
  selector: 'hx-tooltip-bubble',
  template: '{{ text() }}',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-tooltip', role: 'tooltip', '[id]': 'id' },
})
export class HxTooltipBubble {
  readonly text = signal('');
  id = '';
}

const POSITIONS = {
  top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' },
  bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
  left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' },
  right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' },
} as const;

/** Where to flip to when the preferred side does not fit. */
const OPPOSITE: Record<HxTooltipPosition, HxTooltipPosition> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

/**
 * A short text that explains an element, shown on hover and/or keyboard focus (CDK overlay, `role="tooltip"`,
 * `aria-describedby` on the host). Escape closes it. It is a hint, not a place for essential information.
 *
 * ```html
 * <button hx-button iconOnly aria-label="Add" hx-tooltip="Add item" hxTooltipPosition="right">+</button>
 * ```
 */
@Directive({
  selector: '[hx-tooltip]',
  host: {
    '[attr.aria-describedby]': 'shown() ? bubbleId : null',
    '(mouseenter)': 'onEnter("hover")',
    '(mouseleave)': 'onLeave("hover")',
    '(focusin)': 'onEnter("focus")',
    '(focusout)': 'onLeave("focus")',
    '(keydown.escape)': 'hide()',
    '(click)': 'hide()',
  },
})
export class HxTooltip {
  readonly #overlay = inject(Overlay);
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** The text. Empty or null shows nothing. */
  readonly text = input<string | null | undefined>('', { alias: 'hx-tooltip' });
  readonly position = input<HxTooltipPosition>('top', { alias: 'hxTooltipPosition' });
  readonly event = input<HxTooltipEvent>('both', { alias: 'hxTooltipEvent' });
  readonly disabled = input(false, { alias: 'hxTooltipDisabled' });
  /** Milliseconds before it appears. */
  readonly showDelay = input(0, { alias: 'hxTooltipShowDelay' });

  protected readonly bubbleId = `hx-tooltip-${nextId++}`;
  protected readonly shown = signal(false);
  #ref: OverlayRef | null = null;
  #bubble: HxTooltipBubble | null = null;
  #timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.dispose());
    // keep a visible bubble in sync with the inputs, and drop it when it has nothing to say
    effect(() => {
      const text = this.text();
      if (this.disabled() || !text) this.hide();
      else if (this.#bubble) this.#bubble.text.set(text);
      this.position();
      this.#ref?.updatePositionStrategy(this.#strategy());
    });
  }

  protected onEnter(source: 'hover' | 'focus'): void {
    const event = this.event();
    if (event !== 'both' && event !== source) return;
    this.show();
  }

  protected onLeave(source: 'hover' | 'focus'): void {
    const event = this.event();
    if (event !== 'both' && event !== source) return;
    this.hide();
  }

  #strategy() {
    const preferred = this.position();
    const margin = 4;
    const offset = (p: HxTooltipPosition) =>
      p === 'top'
        ? { offsetY: -margin }
        : p === 'bottom'
          ? { offsetY: margin }
          : p === 'left'
            ? { offsetX: -margin }
            : { offsetX: margin };
    return this.#overlay
      .position()
      .flexibleConnectedTo(this.#host)
      .withPositions(
        [preferred, OPPOSITE[preferred]].map((p) => ({ ...POSITIONS[p], ...offset(p) })),
      )
      .withPush(true);
  }

  show(): void {
    const text = this.text();
    if (this.disabled() || !text || this.#ref) return;
    clearTimeout(this.#timer);
    const delay = this.showDelay();
    if (delay > 0) this.#timer = setTimeout(() => this.#create(text), delay);
    else this.#create(text);
  }

  #create(text: string): void {
    if (this.#ref) return;
    this.#ref = this.#overlay.create({
      positionStrategy: this.#strategy(),
      scrollStrategy: this.#overlay.scrollStrategies.close(),
      panelClass: 'hx-tooltip-overlay',
    });
    const bubble = this.#ref.attach(new ComponentPortal(HxTooltipBubble));
    bubble.instance.id = this.bubbleId;
    bubble.instance.text.set(text);
    this.#bubble = bubble.instance;
    this.shown.set(true);
  }

  hide(): void {
    clearTimeout(this.#timer);
    this.dispose();
  }

  private dispose(): void {
    clearTimeout(this.#timer);
    this.#ref?.dispose();
    this.#ref = null;
    this.#bubble = null;
    this.shown.set(false);
  }
}
