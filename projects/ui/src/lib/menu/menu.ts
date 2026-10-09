import { CdkConnectedOverlay, type ConnectedPosition } from '@angular/cdk/overlay';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Injector,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { HxMenuItem } from '../menu-item';
import { HxMenuPanel } from './menu-panel';

/**
 * A menu of `HxMenuItem`s, inline or as a popup, with nested submenus, on `@angular/cdk/menu`.
 *
 * ```html
 * <button hx-button aria-haspopup="menu" (click)="menu.toggle($event)">Actions</button>
 * <hx-menu #menu popup ariaLabel="Actions" [model]="items" />
 *
 * <hx-menu [model]="items" ariaLabel="Account" />
 * ```
 *
 * An item with children and no action of its own, on the first level, is a group heading above its children; deeper
 * levels open as submenus. A popup menu opens at the element that called `toggle(event)` (or `show(event)`), moves the
 * focus into the menu and returns it to that element on Escape or when an item is chosen.
 *
 * Keyboard (the WAI-ARIA menu pattern from the CDK): Arrow Down/Up move, Home and End jump, typing jumps by
 * label, Right or Enter opens a submenu and Left closes it, Enter or Space activates, Escape closes.
 */
@Component({
  selector: 'hx-menu',
  imports: [CdkConnectedOverlay, HxMenuPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-menu', '[class.hx-menu-popup]': 'popup()' },
  template: `
    @if (popup()) {
      <ng-template
        cdkConnectedOverlay
        cdkConnectedOverlayPanelClass="hx-menu-overlay"
        [cdkConnectedOverlayOrigin]="origin() ?? fallbackOrigin"
        [cdkConnectedOverlayOpen]="open()"
        [cdkConnectedOverlayPositions]="positions"
        (overlayOutsideClick)="onOutsideClick($event)"
        (overlayKeydown)="onOverlayKeydown($event)"
        (attach)="onAttach()"
        (detach)="open.set(false)"
      >
        <hx-menu-panel class="hx-menu-root" [items]="model()" [ariaLabel]="ariaLabel()" (triggered)="onTriggered($event)" />
      </ng-template>
    } @else {
      <hx-menu-panel class="hx-menu-root" [items]="model()" [ariaLabel]="ariaLabel()" (triggered)="triggered.emit($event)" />
    }
  `,
})
export class HxMenu {
  readonly #injector = inject(Injector);
  readonly model = input<readonly HxMenuItem[]>([]);
  /** Shows the menu in an overlay when `toggle` or `show` is called. */
  readonly popup = input(false, { transform: booleanAttribute });
  /** Accessible name of the menu. */
  readonly ariaLabel = input<string>();

  /** An item was activated. */
  readonly triggered = output<HxMenuItem>();
  readonly shown = output<void>();
  readonly hidden = output<void>();

  readonly open = signal(false);
  protected readonly origin = signal<Element | null>(null);
  protected readonly fallbackOrigin = document.body;
  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 2 },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 2 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -2 },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -2 },
  ];
  private readonly panel = viewChild(HxMenuPanel);

  /** Opens the popup at the element of the event, or closes it when it is open. */
  toggle(event: Event): void {
    if (this.open()) this.hide();
    else this.show(event);
  }

  show(event: Event): void {
    if (!this.popup() || this.open()) return;
    const target = (event.currentTarget ?? event.target) as Element | null;
    this.origin.set(target);
    this.open.set(true);
    this.shown.emit();
  }

  hide(refocus = true): void {
    if (!this.open()) return;
    this.open.set(false);
    this.hidden.emit();
    if (refocus) (this.origin() as HTMLElement | null)?.focus?.();
  }

  protected onAttach(): void {
    afterNextRender(() => this.panel()?.focusFirst(), { injector: this.#injector });
  }

  protected onTriggered(item: HxMenuItem): void {
    this.triggered.emit(item);
    this.hide();
  }

  protected onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.hide();
    } else if (event.key === 'Tab') {
      this.hide(false);
    }
  }

  protected onOutsideClick(event: MouseEvent): void {
    if (!this.origin()?.contains(event.target as Node)) this.hide(false);
  }
}
