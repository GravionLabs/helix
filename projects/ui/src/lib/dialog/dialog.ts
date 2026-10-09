import { Dialog, type DialogRef } from '@angular/cdk/dialog';
import { Overlay, type PositionStrategy } from '@angular/cdk/overlay';
import { NgComponentOutlet } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  Injectable,
  InjectionToken,
  Injector,
  inject,
  input,
  model,
  output,
  type TemplateRef,
  type Type,
  untracked,
  viewChild,
} from '@angular/core';
import type { Observable } from 'rxjs';
import { nextId } from '../internal/ids';

export type HxDialogPosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

/** Where a dialog sits on the screen, as a CDK global position strategy. */
function positionStrategy(overlay: Overlay, position: HxDialogPosition): PositionStrategy {
  const strategy = overlay.position().global();
  const [vertical, horizontal] = position.includes('-')
    ? (position.split('-') as ['top' | 'bottom', 'left' | 'right'])
    : position === 'left' || position === 'right'
      ? ['center', position]
      : [position, 'center'];
  if (vertical === 'top') strategy.top('1rem');
  else if (vertical === 'bottom') strategy.bottom('1rem');
  else strategy.centerVertically();
  if (horizontal === 'left') strategy.left('1rem');
  else if (horizontal === 'right') strategy.right('1rem');
  else strategy.centerHorizontally();
  return strategy;
}

/**
 * The box of a dialog: a title (the `header`, plus content marked `hxDialogHeader`), the content, a footer (content
 * marked `hxDialogFooter`) and a close button. Used by `hx-dialog` and by the dialogs opened with `HxDialogService`.
 * The close button comes last in the DOM, so the first control of the content gets the focus when the dialog opens.
 */
@Component({
  selector: 'hx-dialog-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-dialog' },
  template: `
    <h2 class="hx-dialog-title" [id]="titleId()">{{ header() }}<ng-content select="[hxDialogHeader]" /></h2>
    <div class="hx-dialog-content"><ng-content /></div>
    <div class="hx-dialog-footer"><ng-content select="[hxDialogFooter]" /></div>
    @if (closable()) {
      <button type="button" class="hx-dialog-close" [attr.aria-label]="closeLabel()" (click)="closeClick.emit()">
        <span class="hx-dialog-close-icon" aria-hidden="true"></span>
      </button>
    }
  `,
})
export class HxDialogFrame {
  readonly header = input<string>();
  readonly titleId = input<string>();
  readonly closable = input(true, { transform: booleanAttribute });
  readonly closeLabel = input('Close');
  readonly closeClick = output<void>();
}

/**
 * A modal or non-modal dialog, on `@angular/cdk/dialog`.
 *
 * ```html
 * <hx-dialog [(visible)]="open" header="Edit profile" width="30rem">
 *   <input hx-input [(ngModel)]="name" />
 *   <div hxDialogFooter>
 *     <button hx-button variant="text" (click)="open = false">Cancel</button>
 *     <button hx-button (click)="save()">Save</button>
 *   </div>
 * </hx-dialog>
 * ```
 *
 * `visible` is two-way: closing from the close button, Escape or the mask sets it to `false`. While it is `true` the
 * dialog is open; the content is created when it opens and destroyed when it closes. A modal dialog puts a mask behind
 * it, traps the focus, hides the rest of the page from assistive technology, and gives the focus back to the element
 * that had it when the dialog closes.
 */
@Component({
  selector: 'hx-dialog',
  imports: [HxDialogFrame],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-dialog-anchor' },
  template: `
    <ng-template #panel>
      <hx-dialog-frame [header]="header()" [titleId]="titleId" [closable]="closable()" [closeLabel]="closeLabel()" (closeClick)="visible.set(false)">
        <ng-container ngProjectAs="[hxDialogHeader]"><ng-content select="[hxDialogHeader]" /></ng-container>
        <ng-content />
        <ng-container ngProjectAs="[hxDialogFooter]"><ng-content select="[hxDialogFooter]" /></ng-container>
      </hx-dialog-frame>
    </ng-template>
  `,
})
export class HxDialog {
  readonly #dialog = inject(Dialog);
  readonly #overlay = inject(Overlay);
  private readonly panel = viewChild<TemplateRef<unknown>>('panel');
  readonly #destroyRef = inject(DestroyRef);

  /** Whether the dialog is open. */
  readonly visible = model(false);
  /** Title; content marked `hxDialogHeader` is added after it. */
  readonly header = input<string>();
  /** A mask behind the dialog, a focus trap, and the page behind hidden from assistive technology. */
  readonly modal = input(true, { transform: booleanAttribute });
  readonly closable = input(true, { transform: booleanAttribute });
  readonly closeOnEscape = input(true, { transform: booleanAttribute });
  /** Clicking the mask closes a modal dialog. */
  readonly dismissableMask = input(false, { transform: booleanAttribute });
  readonly position = input<HxDialogPosition>('center');
  /** CSS width, e.g. `30rem`. */
  readonly width = input<string>();
  readonly height = input<string>();
  /** Extra CSS classes for the overlay pane. */
  readonly panelClass = input<string | string[]>();
  /** Accessible name of the close button. */
  readonly closeLabel = input('Close');
  /** Accessible name of the dialog when there is no `header`. */
  readonly ariaLabel = input<string>();

  /** The dialog opened. */
  readonly shown = output<void>();
  /** The dialog closed, by whatever means. */
  readonly hidden = output<void>();

  protected readonly titleId = nextId('hx-dialog-title');
  #ref: DialogRef<unknown, unknown> | undefined;

  constructor() {
    effect(() => {
      const visible = this.visible();
      const panel = this.panel();
      untracked(() => {
        if (visible && panel) this.#open(panel);
        else if (!visible) this.#close();
      });
    });
    this.#destroyRef.onDestroy(() => this.#close());
  }

  #open(panel: TemplateRef<unknown>): void {
    if (this.#ref) return;
    const modal = this.modal();
    const header = this.header();
    const ref = this.#dialog.open(panel, {
      hasBackdrop: modal,
      backdropClass: 'hx-dialog-backdrop',
      panelClass: ['hx-dialog-panel', ...[this.panelClass() ?? []].flat()],
      width: this.width(),
      height: this.height(),
      maxWidth: 'calc(100vw - 2rem)',
      maxHeight: 'calc(100vh - 2rem)',
      positionStrategy: positionStrategy(this.#overlay, this.position()),
      ariaModal: modal,
      ariaLabelledBy: header ? this.titleId : null,
      ariaLabel: header ? null : (this.ariaLabel() ?? null),
      // Escape and the mask are handled below, so each can be switched off on its own
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
      if (this.dismissableMask()) this.visible.set(false);
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

  #close(): void {
    this.#ref?.close();
  }
}

/** The data of a dialog opened with `HxDialogService`, for the component inside: `inject(HX_DIALOG_DATA)`. */
export const HX_DIALOG_DATA = new InjectionToken<unknown>('HX_DIALOG_DATA');

/** A dialog opened with `HxDialogService`: close it, and wait for its result. */
export class HxDialogRef<R = unknown, C = unknown> {
  /** The component shown inside, once it exists. */
  componentInstance: C | null = null;
  /** Emits the result (or `undefined`) once, when the dialog has closed. */
  readonly closed: Observable<R | undefined>;

  constructor(private readonly ref: DialogRef<R, unknown>) {
    this.closed = ref.closed;
  }

  /** Closes the dialog; `result` is what `closed` emits. */
  close(result?: R): void {
    this.ref.close(result);
  }
}

export interface HxDialogConfig<D = unknown> {
  /** Handed to the component: `inject(HX_DIALOG_DATA)`. */
  data?: D;
  header?: string;
  width?: string;
  height?: string;
  modal?: boolean;
  closable?: boolean;
  closeOnEscape?: boolean;
  dismissableMask?: boolean;
  position?: HxDialogPosition;
  panelClass?: string | string[];
  closeLabel?: string;
  /** Accessible name when there is no `header`. */
  ariaLabel?: string;
}

interface HostData {
  component: Type<unknown>;
  config: HxDialogConfig;
  ref: HxDialogRef;
  titleId: string;
}

const HX_DIALOG_HOST_DATA = new InjectionToken<HostData>('HX_DIALOG_HOST_DATA');

/** The inside of a service dialog: a frame around the component that was asked for. */
@Component({
  selector: 'hx-dialog-host',
  imports: [HxDialogFrame, NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hx-dialog-frame
      [header]="data.config.header"
      [titleId]="data.titleId"
      [closable]="data.config.closable ?? true"
      [closeLabel]="data.config.closeLabel ?? 'Close'"
      (closeClick)="data.ref.close()"
    >
      <ng-container [ngComponentOutlet]="data.component" [ngComponentOutletInjector]="injector" />
    </hx-dialog-frame>
  `,
})
export class HxDialogHost {
  protected readonly data = inject<HostData>(HX_DIALOG_HOST_DATA);
  protected readonly injector = Injector.create({
    providers: [
      { provide: HX_DIALOG_DATA, useValue: this.data.config.data },
      { provide: HxDialogRef, useValue: this.data.ref },
    ],
    parent: inject(Injector),
  });
  private readonly outlet = viewChild(NgComponentOutlet);

  constructor() {
    afterNextRender(() => {
      this.data.ref.componentInstance = (this.outlet()?.componentInstance as unknown) ?? null;
    });
  }
}

/**
 * Opens a component in a dialog.
 *
 * ```ts
 * const ref = inject(HxDialogService).open(EditUser, { header: 'Edit user', width: '30rem', data: { id: 7 } });
 * ref.closed.subscribe((result) => console.log(result));
 * ```
 *
 * Inside `EditUser`: `inject(HX_DIALOG_DATA)` is the `data`, `inject(HxDialogRef).close(result)` closes the dialog
 * with a result. The options are those of `<hx-dialog>`; Escape and (with `dismissableMask`) the mask close it with
 * no result.
 */
@Injectable({ providedIn: 'root' })
export class HxDialogService {
  readonly #dialog = inject(Dialog);
  readonly #overlay = inject(Overlay);

  open<C, R = unknown, D = unknown>(
    component: Type<C>,
    config: HxDialogConfig<D> = {},
  ): HxDialogRef<R, C> {
    const modal = config.modal ?? true;
    const titleId = nextId('hx-dialog-title');
    let hxRef!: HxDialogRef<R, C>;
    const ref = this.#dialog.open<R, unknown, HxDialogHost>(HxDialogHost, {
      hasBackdrop: modal,
      backdropClass: 'hx-dialog-backdrop',
      panelClass: ['hx-dialog-panel', ...[config.panelClass ?? []].flat()],
      width: config.width,
      height: config.height,
      maxWidth: 'calc(100vw - 2rem)',
      maxHeight: 'calc(100vh - 2rem)',
      positionStrategy: positionStrategy(this.#overlay, config.position ?? 'center'),
      ariaModal: modal,
      ariaLabelledBy: config.header ? titleId : null,
      ariaLabel: config.header ? null : (config.ariaLabel ?? null),
      disableClose: true,
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      providers: (cdkRef) => {
        hxRef = new HxDialogRef<R, C>(cdkRef as DialogRef<R, unknown>);
        return [
          { provide: HX_DIALOG_HOST_DATA, useValue: { component, config, ref: hxRef, titleId } },
        ];
      },
    });
    ref.keydownEvents.subscribe((event) => {
      if (
        (config.closeOnEscape ?? true) &&
        event.key === 'Escape' &&
        !event.shiftKey &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        event.preventDefault();
        ref.close();
      }
    });
    ref.backdropClick.subscribe(() => {
      if (config.dismissableMask) ref.close();
    });
    return hxRef;
  }
}
