import { Dialog, type DialogRef } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  output,
  type TemplateRef,
  untracked,
  viewChild,
} from '@angular/core';
import { HxDialogFrame } from '../dialog/dialog';
import { nextId } from '../internal/ids';

export type HxDrawerPosition = 'left' | 'right' | 'top' | 'bottom';

/**
 * A panel that slides in from an edge of the screen, with the same dialog semantics as `hx-dialog`, on
 * `@angular/cdk/dialog`.
 *
 * ```html
 * <hx-drawer [(visible)]="open" header="Filters" position="right">
 *   …
 *   <div hxDialogFooter><button hx-button (click)="open = false">Done</button></div>
 * </hx-drawer>
 * ```
 *
 * `visible` is two-way. A modal drawer puts a mask behind it, traps the focus and returns it when it closes; a click
 * on the mask (`dismissable`, on by default) or Escape closes it. The slide-in stops under `prefers-reduced-motion`.
 */
@Component({
  selector: 'hx-drawer',
  imports: [HxDialogFrame],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-drawer-anchor' },
  template: `
    <ng-template #panel>
      <hx-dialog-frame class="hx-drawer" [header]="header()" [titleId]="titleId" [closable]="closable()" [closeLabel]="closeLabel()" (closeClick)="visible.set(false)">
        <ng-container ngProjectAs="[hxDialogHeader]"><ng-content select="[hxDialogHeader]" /></ng-container>
        <ng-content />
        <ng-container ngProjectAs="[hxDialogFooter]"><ng-content select="[hxDialogFooter]" /></ng-container>
      </hx-dialog-frame>
    </ng-template>
  `,
})
export class HxDrawer {
  readonly #dialog = inject(Dialog);
  readonly #overlay = inject(Overlay);
  private readonly panel = viewChild<TemplateRef<unknown>>('panel');

  /** Whether the drawer is open. */
  readonly visible = model(false);
  readonly header = input<string>();
  readonly position = input<HxDrawerPosition>('left');
  /** A mask behind the drawer, a focus trap, and the page behind hidden from assistive technology. */
  readonly modal = input(true, { transform: booleanAttribute });
  /** A click on the mask closes a modal drawer. */
  readonly dismissable = input(true, { transform: booleanAttribute });
  readonly closable = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  /** Covers the whole screen. */
  readonly fullScreen = input(false, { transform: booleanAttribute });
  /** CSS width of a left or right drawer (`20rem` by default). */
  readonly width = input<string>();
  /** CSS height of a top or bottom drawer (`20rem` by default). */
  readonly height = input<string>();
  readonly panelClass = input<string | string[]>();
  readonly closeLabel = input('Close');
  /** Accessible name of the drawer when there is no `header`. */
  readonly ariaLabel = input<string>();

  readonly shown = output<void>();
  readonly hidden = output<void>();

  protected readonly titleId = nextId('hx-drawer-title');
  #ref: DialogRef<unknown, unknown> | undefined;

  constructor() {
    effect(() => {
      const visible = this.visible();
      const panel = this.panel();
      untracked(() => {
        if (visible && panel) this.#open(panel);
        else if (!visible) this.#ref?.close();
      });
    });
    inject(DestroyRef).onDestroy(() => this.#ref?.close());
  }

  #open(panel: TemplateRef<unknown>): void {
    if (this.#ref) return;
    const position = this.position();
    const modal = this.modal();
    const header = this.header();
    const full = this.fullScreen();
    const sideways = position === 'left' || position === 'right';
    const strategy = this.#overlay.position().global();
    if (full) strategy.top('0').left('0');
    else if (position === 'left') strategy.top('0').left('0');
    else if (position === 'right') strategy.top('0').right('0');
    else if (position === 'top') strategy.top('0').left('0');
    else strategy.bottom('0').left('0');
    const size = (sideways ? this.width() : this.height()) ?? '20rem';
    const ref = this.#dialog.open(panel, {
      hasBackdrop: modal,
      backdropClass: 'hx-dialog-backdrop',
      panelClass: [
        'hx-drawer-panel',
        `hx-drawer-panel-${full ? 'full' : position}`,
        ...[this.panelClass() ?? []].flat(),
      ],
      width: full ? '100vw' : sideways ? size : '100vw',
      height: full ? '100vh' : sideways ? '100vh' : size,
      maxWidth: '100vw',
      maxHeight: '100vh',
      positionStrategy: strategy,
      ariaModal: modal,
      ariaLabelledBy: header ? this.titleId : null,
      ariaLabel: header ? null : (this.ariaLabel() ?? null),
      disableClose: true,
      autoFocus: 'first-tabbable',
      restoreFocus: true,
    });
    this.#ref = ref;
    ref.keydownEvents.subscribe((event) => {
      if (
        event.key === 'Escape' &&
        this.closeOnEscape() &&
        !event.shiftKey &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        event.preventDefault();
        this.visible.set(false);
      }
    });
    ref.backdropClick.subscribe(() => {
      if (this.dismissable()) this.visible.set(false);
    });
    ref.closed.subscribe(() => {
      if (this.#ref === ref) {
        this.#ref = undefined;
        this.visible.set(false);
        this.hidden.emit();
      }
    });
    this.shown.emit();
  }
}
