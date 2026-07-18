import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  effect,
  ElementRef,
  inject,
  InjectionToken,
  input,
  model,
  NgModule,
  NgZone,
  numberAttribute,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  ViewEncapsulation,
  ViewRef,
  output,
  viewChild,
  contentChild,
  contentChildren
} from '@angular/core';
import { MotionEvent, MotionOptions } from '@primeuix/motion';
import { addStyle, appendChild, getOuterHeight, getOuterWidth, getViewport, hasClass, removeClass, setAttribute, uuid } from '@primeuix/utils';
import { OverlayService, PrimeTemplate, SharedModule, TranslationKeys } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { Button, ButtonProps } from '@gravionlabs/helix/button';
import { blockBodyScroll, DomHandler, unblockBodyScroll } from '@gravionlabs/helix/dom';
import { FocusTrap } from '@gravionlabs/helix/focustrap';
import { TimesIcon, WindowMaximizeIcon, WindowMinimizeIcon } from '@gravionlabs/helix/icons';
import { MotionModule } from '@gravionlabs/helix/motion';
import { Nullable, VoidListener } from '@gravionlabs/helix/ts-helpers';
import { DialogPassThrough } from '@gravionlabs/helix/types/dialog';
import { ZIndexUtils } from '@gravionlabs/helix/utils';
import { DialogStyle } from './style/dialogstyle';

const DIALOG_INSTANCE = new InjectionToken<Dialog>('DIALOG_INSTANCE');

/**
 * Dialog is a container to display content in an overlay window.
 * @group Components
 */
@Component({
    selector: 'h-dialog',
    standalone: true,
    imports: [CommonModule, Button, FocusTrap, TimesIcon, WindowMaximizeIcon, WindowMinimizeIcon, SharedModule, Bind, MotionModule],
    templateUrl: './dialog.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [DialogStyle, { provide: DIALOG_INSTANCE, useExisting: Dialog }, { provide: PARENT_INSTANCE, useExisting: Dialog }],
    hostDirectives: [Bind]
})
export class Dialog extends BaseComponent<DialogPassThrough> implements OnInit, AfterContentInit, OnDestroy {
    componentName = 'Dialog';

    readonly hostName = input<string>('');

    $pcDialog: Dialog | undefined = inject(DIALOG_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('host'));
    }

    /**
     * Title text of the dialog.
     * @group Props
     */
    readonly header = input<string>();
    /**
     * Enables dragging to change the position using header.
     * @group Props
     */
    readonly draggable = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Enables resizing of the content.
     * @group Props
     */
    readonly resizable = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Style of the content section.
     * @group Props
     */
    readonly contentStyle = input<any>();
    /**
     * Style class of the content.
     * @group Props
     */
    readonly contentStyleClass = input<string>();
    /**
     * Defines if background should be blocked when dialog is displayed.
     * @group Props
     */
    readonly modal = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Specifies if pressing escape key should hide the dialog.
     * @group Props
     */
    readonly closeOnEscape = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Specifies if clicking the modal background should hide the dialog.
     * @group Props
     */
    readonly dismissableMask = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * When enabled dialog is displayed in RTL direction.
     * @group Props
     */
    readonly rtl = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Adds a close icon to the header to hide the dialog.
     * @group Props
     */
    readonly closable = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Object literal to define widths per screen size.
     * @group Props
     */
    readonly breakpoints = input<any>();
    /**
     * Style class of the component.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Style class of the mask.
     * @group Props
     */
    readonly maskStyleClass = input<string>();
    /**
     * Style of the mask.
     * @group Props
     */
    readonly maskStyle = input<{
    [klass: string]: any;
} | null>();
    /**
     * Whether to show the header or not.
     * @group Props
     */
    readonly showHeader = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether background scroll should be blocked when dialog is visible.
     * @group Props
     */
    readonly blockScroll = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether to automatically manage layering.
     * @group Props
     */
    readonly autoZIndex = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    readonly baseZIndex = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * Minimum value for the left coordinate of dialog in dragging.
     * @group Props
     */
    readonly minX = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * Minimum value for the top coordinate of dialog in dragging.
     * @group Props
     */
    readonly minY = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * When enabled, first focusable element receives focus on show.
     * @group Props
     */
    readonly focusOnShow = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether the dialog can be displayed full screen.
     * @group Props
     */
    readonly maximizable = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Keeps dialog in the viewport.
     * @group Props
     */
    readonly keepInViewport = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * When enabled, can only focus on elements inside the dialog.
     * @group Props
     */
    readonly focusTrap = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Transition options of the animation.
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     * @group Props
     */
    readonly transitionOptions = input<string>('150ms cubic-bezier(0, 0, 0.2, 1)');
    /**
     * The motion options for the mask.
     * @group Props
     */
    maskMotionOptions = input<MotionOptions | undefined>(undefined);

    computedMaskMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('maskMotion'),
            ...this.maskMotionOptions()
        };
    });
    /**
     * The motion options.
     * @group Props
     */
    motionOptions = input<MotionOptions | undefined>(undefined);

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });
    /**
     * Name of the close icon.
     * @group Props
     */
    readonly closeIcon = input<string>();
    /**
     * Defines a string that labels the close button for accessibility.
     * @group Props
     */
    readonly closeAriaLabel = input<string>();
    /**
     * Index of the close button in tabbing order.
     * @group Props
     */
    readonly closeTabindex = input<string>('0');
    /**
     * Name of the minimize icon.
     * @group Props
     */
    readonly minimizeIcon = input<string>();
    /**
     * Name of the maximize icon.
     * @group Props
     */
    readonly maximizeIcon = input<string>();
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly closeButtonProps = input<ButtonProps>({
    severity: 'secondary',
    variant: 'text',
    rounded: true
});
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly maximizeButtonProps = input<ButtonProps>({
    severity: 'secondary',
    variant: 'text',
    rounded: true
});
    /**
     * Specifies the visibility of the dialog.
     * @group Props
     */
    readonly visible = model<boolean>(false);

    _visibleEffect = effect(() => {
        if (this.visible() && !this.maskVisible) {
            this.maskVisible = true;
            this.renderMask.set(true);
            this.renderDialog.set(true);
        }
    });
    /**
     * Inline style of the component.
     * @group Props
     */
    readonly style = input<any>(undefined);

    _styleEffect = effect(() => {
        const value = this.style();
        if (value) {
            this._style = { ...value };
            this.originalStyle = value;
        }
    });
    /**
     * Position of the dialog.
     * @group Props
     */
    readonly position = input<'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright'>(undefined!);
    /**
     * Role attribute of html element.
     * @group Emits
     */
    readonly role = input<string>('dialog');
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);
    /**
     * Callback to invoke when dialog is shown.
     * @group Emits
     */
    readonly onShow = output<any>();
    /**
     * Callback to invoke when dialog is hidden.
     * @group Emits
     */
    readonly onHide = output<any>();
    /**
     * Callback to invoke when dialog resizing is initiated.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onResizeInit = output<MouseEvent>();
    /**
     * Callback to invoke when dialog resizing is completed.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onResizeEnd = output<MouseEvent>();
    /**
     * Callback to invoke when dialog dragging is completed.
     * @param {DragEvent} event - Drag event.
     * @group Emits
     */
    readonly onDragEnd = output<DragEvent>();
    /**
     * Callback to invoke when dialog maximized or unmaximized.
     * @group Emits
     */
    readonly onMaximize = output<any>();

    readonly headerViewChild = viewChild<Nullable<ElementRef>>('titlebar');

    readonly contentViewChild = viewChild<Nullable<ElementRef>>('content');

    readonly footerViewChild = viewChild<Nullable<ElementRef>>('footer');
    /**
     * Header template.
     * @group Templates
     */
    readonly headerTemplate = input<TemplateRef<void>>(undefined, { alias: "content" });
    /**
     * Content template.
     * @group Templates
     */
    readonly contentTemplate = input<TemplateRef<void>>();
    /**
     * Footer template.
     * @group Templates
     */
    readonly footerTemplate = input<TemplateRef<void>>();
    /**
     * Close icon template.
     * @group Templates
     */
    readonly closeIconTemplate = input<TemplateRef<void>>();
    /**
     * Maximize icon template.
     * @group Templates
     */
    readonly maximizeIconTemplate = input<TemplateRef<void>>();
    /**
     * Minimize icon template.
     * @group Templates
     */
    readonly minimizeIconTemplate = input<TemplateRef<void>>();
    /**
     * Headless template.
     * @group Templates
     */
    readonly headlessTemplate = input<TemplateRef<void>>();

    /**
     * Custom header template.
     * @group Templates
     */
    readonly _headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });

    /**
     * Custom content template.
     * @group Templates
     */
    readonly _contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });

    /**
     * Custom footer template.
     * @group Templates
     */
    readonly _footerTemplate = contentChild<TemplateRef<void>>('footer', { descendants: false });

    /**
     * Custom close icon template.
     * @group Templates
     */
    readonly _closeiconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });

    /**
     * Custom maximize icon template.
     * @group Templates
     */
    readonly _maximizeiconTemplate = contentChild<TemplateRef<void>>('maximizeicon', { descendants: false });

    /**
     * Custom minimize icon template.
     * @group Templates
     */
    readonly _minimizeiconTemplate = contentChild<TemplateRef<void>>('minimizeicon', { descendants: false });

    /**
     * Custom headless template.
     * @group Templates
     */
    readonly _headlessTemplate = contentChild<TemplateRef<void>>('headless', { descendants: false });

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    renderMask = signal<boolean>(false);

    renderDialog = signal<boolean>(false);

    maskVisible: boolean | undefined;

    container = signal<Nullable<HTMLElement>>(null);

    wrapper: Nullable<HTMLElement>;

    dragging: boolean | undefined;

    ariaLabelledBy: string | null = this.getAriaLabelledBy();

    documentDragListener: VoidListener;

    documentDragEndListener: VoidListener;

    resizing: boolean | undefined;

    documentResizeListener: VoidListener;

    documentResizeEndListener: VoidListener;

    documentEscapeListener: VoidListener;

    maskClickListener: VoidListener;

    lastPageX: number | undefined;

    lastPageY: number | undefined;

    preventVisibleChangePropagation: boolean | undefined;

    maximized: boolean | undefined;

    preMaximizeContentHeight: number | undefined;

    preMaximizeContainerWidth: number | undefined;

    preMaximizeContainerHeight: number | undefined;

    preMaximizePageX: number | undefined;

    preMaximizePageY: number | undefined;

    id: string = uuid('pn_id_');

    _style: any = {};

    originalStyle: any;

    transformOptions: any = 'scale(0.7)';

    styleElement: any;

    private window: Window;

    _componentStyle = inject(DialogStyle);

    headerT: TemplateRef<void> | undefined;

    contentT: TemplateRef<void> | undefined;

    footerT: TemplateRef<void> | undefined;

    closeIconT: TemplateRef<void> | undefined;

    maximizeIconT: TemplateRef<void> | undefined;

    minimizeIconT: TemplateRef<void> | undefined;

    headlessT: TemplateRef<void> | undefined;

    private zIndexForLayering?: number;

    get maximizeLabel(): string {
        return this.config.getTranslation(TranslationKeys.ARIA)['maximizeLabel'];
    }

    get minimizeLabel(): string {
        return this.config.getTranslation(TranslationKeys.ARIA)['minimizeLabel'];
    }
    zone: NgZone = inject(NgZone);

    private overlayService: OverlayService = inject(OverlayService);

    get maskClass() {
        const positions = ['left', 'right', 'top', 'topleft', 'topright', 'bottom', 'bottomleft', 'bottomright'];
        const pos = positions.find((item) => item === this.position());

        return {
            'p-dialog-mask': true,
            'p-overlay-mask': this.modal() || this.dismissableMask(),
            [`p-dialog-${pos}`]: pos
        };
    }

    onInit() {
        if (this.breakpoints()) {
            this.createStyle();
        }
    }

    readonly templates = contentChildren(PrimeTemplate);

    onAfterContentInit() {
        this.templates()?.forEach((item) => {
            switch (item.getType()) {
                case 'header':
                    this.headerT = item.template;
                    break;

                case 'content':
                    this.contentT = item.template;
                    break;

                case 'footer':
                    this.footerT = item.template;
                    break;

                case 'closeicon':
                    this.closeIconT = item.template;
                    break;

                case 'maximizeicon':
                    this.maximizeIconT = item.template;
                    break;

                case 'minimizeicon':
                    this.minimizeIconT = item.template;
                    break;

                case 'headless':
                    this.headlessT = item.template;
                    break;

                default:
                    this.contentT = item.template;
                    break;
            }
        });
    }

    getAriaLabelledBy() {
        return this.header() !== null ? uuid('pn_id_') + '_header' : null;
    }

    parseDurationToMilliseconds(durationString: string): number | undefined {
        const transitionTimeRegex = /([\d\.]+)(ms|s)\b/g;
        let totalMilliseconds = 0;
        let match;
        while ((match = transitionTimeRegex.exec(durationString)) !== null) {
            const value = parseFloat(match[1]);
            const unit = match[2];
            if (unit === 'ms') {
                totalMilliseconds += value;
            } else if (unit === 's') {
                totalMilliseconds += value * 1000;
            }
        }
        if (totalMilliseconds === 0) {
            return undefined;
        }
        return totalMilliseconds;
    }

    _focus(focusParentElement?: HTMLElement): boolean {
        if (focusParentElement) {
            const timeoutDuration = this.parseDurationToMilliseconds(this.transitionOptions());
            let _focusableElements = DomHandler.getFocusableElements(focusParentElement);
            if (_focusableElements && _focusableElements.length > 0) {
                this.zone.runOutsideAngular(() => {
                    setTimeout(() => _focusableElements[0].focus(), timeoutDuration || 5);
                });
                return true;
            }
        }

        return false;
    }

    focus(focusParentElement: HTMLElement = this.contentViewChild()?.nativeElement) {
        let focused = this._focus(focusParentElement);

        if (!focused) {
            focused = this._focus(this.footerViewChild()?.nativeElement);
            if (!focused) {
                focused = this._focus(this.headerViewChild()?.nativeElement);
                if (!focused) {
                    this._focus(this.contentViewChild()?.nativeElement);
                }
            }
        }
    }

    close(event: Event) {
        this.visible.set(false);
        event.preventDefault();
    }

    enableModality() {
        if (this.closable() && this.dismissableMask()) {
            this.maskClickListener = this.renderer.listen(this.wrapper, 'mousedown', (event: any) => {
                if (this.wrapper && this.wrapper.isSameNode(event.target)) {
                    this.close(event);
                }
            });
        }

        if (this.modal()) {
            blockBodyScroll();
        }
    }

    disableModality() {
        if (this.wrapper) {
            if (this.dismissableMask()) {
                this.unbindMaskClickListener();
            }

            // for nested dialogs w/modal
            const scrollBlockers = document.querySelectorAll('[data-p-scrollblocker-active="true"]');

            if (this.modal() && scrollBlockers && scrollBlockers.length == 1) {
                unblockBodyScroll();
            }

            if (!(this.cd as ViewRef).destroyed) {
                this.cd.detectChanges();
            }
        }
    }

    maximize() {
        this.maximized = !this.maximized;

        if (!this.modal() && !this.blockScroll()) {
            if (this.maximized) {
                blockBodyScroll();
            } else {
                unblockBodyScroll();
            }
        }

        this.onMaximize.emit({ maximized: this.maximized });
    }

    unbindMaskClickListener() {
        if (this.maskClickListener) {
            this.maskClickListener();
            this.maskClickListener = null;
        }
    }

    moveOnTop() {
        if (this.autoZIndex()) {
            ZIndexUtils.set('modal', this.container(), this.baseZIndex() + this.config.zIndex.modal);
            (this.wrapper as HTMLElement).style.zIndex = String(parseInt((this.container() as HTMLDivElement).style.zIndex, 10) - 1);
        } else {
            this.zIndexForLayering = ZIndexUtils.generateZIndex('modal', (this.baseZIndex() ?? 0) + this.config.zIndex.modal);
        }
    }

    createStyle() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.styleElement && !this.$unstyled()) {
                this.styleElement = this.renderer.createElement('style');
                this.styleElement.type = 'text/css';
                setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
                this.renderer.appendChild(this.document.head, this.styleElement);
                let innerHTML = '';
                for (let breakpoint in this.breakpoints()) {
                    innerHTML += `
                        @media screen and (max-width: ${breakpoint}) {
                            .p-dialog[${this.id}]:not(.p-dialog-maximized) {
                                width: ${this.breakpoints()[breakpoint]} !important;
                            }
                        }
                    `;
                }

                this.renderer.setProperty(this.styleElement, 'innerHTML', innerHTML);
                setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
            }
        }
    }

    initDrag(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const closestDiv = target.closest('div');

        if (closestDiv?.getAttribute('data-pc-section') === 'headeractions') {
            return;
        }

        if (this.draggable()) {
            this.dragging = true;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;

            (this.container() as HTMLDivElement).style.margin = '0';
            this.document.body.setAttribute('data-p-unselectable-text', 'true');
            !this.$unstyled() && addStyle(this.document.body, { 'user-select': 'none' });
        }
    }

    onDrag(event: MouseEvent) {
        if (this.dragging && this.container()) {
            const containerWidth = getOuterWidth(this.container() as HTMLDivElement);
            const containerHeight = getOuterHeight(this.container() as HTMLDivElement);
            const deltaX = event.pageX - (this.lastPageX as number);
            const deltaY = event.pageY - (this.lastPageY as number);
            const offset = this.container()!.getBoundingClientRect();

            const containerComputedStyle = getComputedStyle(this.container() as HTMLDivElement);

            const leftMargin = parseFloat(containerComputedStyle.marginLeft);
            const topMargin = parseFloat(containerComputedStyle.marginTop);

            const leftPos = offset.left + deltaX - leftMargin;
            const topPos = offset.top + deltaY - topMargin;
            const viewport = getViewport();

            this.container()!.style.position = 'fixed';

            if (this.keepInViewport()) {
                if (leftPos >= this.minX() && leftPos + containerWidth < viewport.width) {
                    this._style.left = `${leftPos}px`;
                    this.lastPageX = event.pageX;
                    this.container()!.style.left = `${leftPos}px`;
                }

                if (topPos >= this.minY() && topPos + containerHeight < viewport.height) {
                    this._style.top = `${topPos}px`;
                    this.lastPageY = event.pageY;
                    this.container()!.style.top = `${topPos}px`;
                }
            } else {
                this.lastPageX = event.pageX;
                this.container()!.style.left = `${leftPos}px`;
                this.lastPageY = event.pageY;
                this.container()!.style.top = `${topPos}px`;
            }

            this.overlayService.emitParentDrag(this.container()!);
        }
    }

    endDrag(event: DragEvent) {
        if (this.dragging) {
            this.dragging = false;
            this.document.body.removeAttribute('data-p-unselectable-text');
            !this.$unstyled() && (this.document.body.style['user-select'] = '');
            this.cd.detectChanges();
            this.onDragEnd.emit(event);
        }
    }

    resetPosition() {
        (this.container() as HTMLDivElement).style.position = '';
        (this.container() as HTMLDivElement).style.left = '';
        (this.container() as HTMLDivElement).style.top = '';
        (this.container() as HTMLDivElement).style.margin = '';
    }

    //backward compatibility
    center() {
        this.resetPosition();
    }

    initResize(event: MouseEvent) {
        if (this.resizable()) {
            this.resizing = true;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;

            this.document.body.setAttribute('data-p-unselectable-text', 'true');
            !this.$unstyled() && addStyle(this.document.body, { 'user-select': 'none' });
            this.onResizeInit.emit(event);
        }
    }

    onResize(event: MouseEvent) {
        if (this.resizing) {
            let deltaX = event.pageX - (this.lastPageX as number);
            let deltaY = event.pageY - (this.lastPageY as number);
            let containerWidth = getOuterWidth(this.container() as HTMLDivElement);
            let containerHeight = getOuterHeight(this.container() as HTMLDivElement);
            const contentViewChild = this.contentViewChild();
            let contentHeight = getOuterHeight(contentViewChild?.nativeElement);
            let newWidth = containerWidth + deltaX;
            let newHeight = containerHeight + deltaY;
            let minWidth = (this.container() as HTMLDivElement).style.minWidth;
            let minHeight = (this.container() as HTMLDivElement).style.minHeight;
            let offset = (this.container() as HTMLDivElement).getBoundingClientRect();
            let viewport = getViewport();
            let hasBeenDragged = !parseInt((this.container() as HTMLDivElement).style.top) || !parseInt((this.container() as HTMLDivElement).style.left);

            if (hasBeenDragged) {
                newWidth += deltaX;
                newHeight += deltaY;
            }

            if ((!minWidth || newWidth > parseInt(minWidth)) && offset.left + newWidth < viewport.width) {
                this._style.width = newWidth + 'px';
                (this.container() as HTMLDivElement).style.width = this._style.width;
            }

            if ((!minHeight || newHeight > parseInt(minHeight)) && offset.top + newHeight < viewport.height) {
                (<ElementRef>contentViewChild).nativeElement.style.height = contentHeight + newHeight - containerHeight + 'px';

                if (this._style.height) {
                    this._style.height = newHeight + 'px';
                    (this.container() as HTMLDivElement).style.height = this._style.height;
                }
            }

            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
        }
    }

    resizeEnd(event: MouseEvent) {
        if (this.resizing) {
            this.resizing = false;
            this.document.body.removeAttribute('data-p-unselectable-text');
            !this.$unstyled() && (this.document.body.style['user-select'] = '');
            this.onResizeEnd.emit(event);
        }
    }

    bindGlobalListeners() {
        if (this.draggable()) {
            this.bindDocumentDragListener();
            this.bindDocumentDragEndListener();
        }

        if (this.resizable()) {
            this.bindDocumentResizeListeners();
        }

        if (this.closeOnEscape() && this.closable()) {
            this.bindDocumentEscapeListener();
        }
    }

    unbindGlobalListeners() {
        this.unbindDocumentDragListener();
        this.unbindDocumentDragEndListener();
        this.unbindDocumentResizeListeners();
        this.unbindDocumentEscapeListener();
    }

    bindDocumentDragListener() {
        if (!this.documentDragListener) {
            this.zone.runOutsideAngular(() => {
                this.documentDragListener = this.renderer.listen(this.document.defaultView, 'mousemove', this.onDrag.bind(this));
            });
        }
    }

    unbindDocumentDragListener() {
        if (this.documentDragListener) {
            this.documentDragListener();
            this.documentDragListener = null;
        }
    }

    bindDocumentDragEndListener() {
        if (!this.documentDragEndListener) {
            this.zone.runOutsideAngular(() => {
                this.documentDragEndListener = this.renderer.listen(this.document.defaultView, 'mouseup', this.endDrag.bind(this));
            });
        }
    }

    unbindDocumentDragEndListener() {
        if (this.documentDragEndListener) {
            this.documentDragEndListener();
            this.documentDragEndListener = null;
        }
    }

    bindDocumentResizeListeners() {
        if (!this.documentResizeListener && !this.documentResizeEndListener) {
            this.zone.runOutsideAngular(() => {
                this.documentResizeListener = this.renderer.listen(this.document.defaultView, 'mousemove', this.onResize.bind(this));
                this.documentResizeEndListener = this.renderer.listen(this.document.defaultView, 'mouseup', this.resizeEnd.bind(this));
            });
        }
    }

    unbindDocumentResizeListeners() {
        if (this.documentResizeListener && this.documentResizeEndListener) {
            this.documentResizeListener();
            this.documentResizeEndListener();
            this.documentResizeListener = null;
            this.documentResizeEndListener = null;
        }
    }

    bindDocumentEscapeListener() {
        const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : 'document';

        this.documentEscapeListener = this.renderer.listen(documentTarget, 'keydown', (event) => {
            if (event.key == 'Escape') {
                const container = this.container();
                if (!container) {
                    return;
                }
                const currentZIndex = ZIndexUtils.getCurrent();
                if (parseInt(container.style.zIndex) == currentZIndex || this.zIndexForLayering == currentZIndex) {
                    this.close(event);
                }
            }
        });
    }

    unbindDocumentEscapeListener() {
        if (this.documentEscapeListener) {
            this.documentEscapeListener();
            this.documentEscapeListener = null;
        }
    }

    appendContainer() {
        if (this.$appendTo() !== 'self') {
            appendChild(this.document.body, this.wrapper as HTMLElement);
        }
    }

    restoreAppend() {
        if (this.container() && this.$appendTo() !== 'self') {
            this.renderer.appendChild(this.el.nativeElement, this.wrapper);
        }
    }

    onBeforeEnter(event: MotionEvent) {
        this.container.set(event.element as HTMLDivElement);
        this.wrapper = this.container()?.parentElement;
        this.$attrSelector && this.container()?.setAttribute(this.$attrSelector, '');
        this.appendContainer();
        this.moveOnTop();
        this.bindGlobalListeners();
        this.container()?.setAttribute(this.id, '');

        if (this.modal()) {
            this.enableModality();
        }
    }

    onAfterEnter() {
        if (this.focusOnShow()) {
            this.focus();
        }

        this.onShow.emit({});
    }

    onBeforeLeave() {
        if (this.modal()) {
            this.maskVisible = false;
        }
    }

    onAfterLeave() {
        this.onContainerDestroy();
        this.renderDialog.set(false);

        if (this.modal()) {
            this.renderMask.set(false);
        } else {
            this.maskVisible = false;
        }

        this.onHide.emit({});
        this.cd.markForCheck();
    }

    onMaskAfterLeave() {
        if (!this.renderDialog()) {
            this.renderMask.set(false);
        }
    }

    onContainerDestroy() {
        this.unbindGlobalListeners();
        this.dragging = false;

        if (this.maximized) {
            removeClass(this.document.body, 'p-overflow-hidden');
            this.document.body.style.removeProperty('--scrollbar-width');
            this.maximized = false;
        }

        if (this.modal()) {
            this.disableModality();
        }

        if (hasClass(this.document.body, 'p-overflow-hidden')) {
            removeClass(this.document.body, 'p-overflow-hidden');
        }

        if (this.container() && this.autoZIndex()) {
            ZIndexUtils.clear(this.container());
        }
        if (this.zIndexForLayering) {
            ZIndexUtils.revertZIndex(this.zIndexForLayering);
        }

        this.container.set(null);
        this.wrapper = null;

        this._style = this.originalStyle ? { ...this.originalStyle } : {};
    }

    destroyStyle() {
        if (this.styleElement) {
            this.renderer.removeChild(this.document.head, this.styleElement);
            this.styleElement = null;
        }
    }

    onDestroy() {
        if (this.container()) {
            this.restoreAppend();
            this.onContainerDestroy();
        }

        this.destroyStyle();
    }

    get dataP() {
        return this.cn({
            maximized: this.maximized,
            modal: this.modal()
        });
    }
}

@NgModule({
    imports: [Dialog, SharedModule],
    exports: [Dialog, SharedModule]
})
export class DialogModule {}
