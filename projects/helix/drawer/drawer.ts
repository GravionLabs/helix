import { CommonModule } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, InjectionToken, input, model, NgModule, numberAttribute, TemplateRef, ViewEncapsulation, output, viewChild, contentChild, contentChildren } from '@angular/core';
import { MotionEvent, MotionOptions } from '@primeuix/motion';
import { addClass, appendChild, removeClass, setAttribute } from '@primeuix/utils';
import { PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { Button, ButtonProps } from '@gravionlabs/helix/button';
import { blockBodyScroll, unblockBodyScroll } from '@gravionlabs/helix/dom';
import { FocusTrapModule } from '@gravionlabs/helix/focustrap';
import { TimesIcon } from '@gravionlabs/helix/icons';
import { MotionModule } from '@gravionlabs/helix/motion';
import { Nullable, VoidListener } from '@gravionlabs/helix/ts-helpers';
import { DrawerPassThrough } from '@gravionlabs/helix/types/drawer';
import { ZIndexUtils } from '@gravionlabs/helix/utils';
import { DrawerStyle } from './style/drawerstyle';

const DRAWER_INSTANCE = new InjectionToken<Drawer>('DRAWER_INSTANCE');

/**
 * Sidebar is a panel component displayed as an overlay at the edges of the screen.
 * @group Components
 */
@Component({
    selector: 'h-drawer',
    standalone: true,
    imports: [CommonModule, Button, TimesIcon, SharedModule, Bind, FocusTrapModule, MotionModule],
    providers: [DrawerStyle, { provide: DRAWER_INSTANCE, useExisting: Drawer }, { provide: PARENT_INSTANCE, useExisting: Drawer }],
    hostDirectives: [Bind],
    templateUrl: './drawer.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class Drawer extends BaseComponent<DrawerPassThrough> {
    componentName = 'Drawer';

    $pcDrawer: Drawer | undefined = inject(DRAWER_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('host'));
    }
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);
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
     * Whether to block scrolling of the document when drawer is active.
     * @group Props
     */
    readonly blockScroll = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Inline style of the component.
     * @group Props
     */
    readonly style = input<{
    [klass: string]: any;
} | null>();
    /**
     * Style class of the component.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Aria label of the close icon.
     * @group Props
     */
    readonly ariaCloseLabel = input<string>();
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
     * Whether an overlay mask is displayed behind the drawer.
     * @group Props
     */
    readonly modal = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly closeButtonProps = input<ButtonProps>({ severity: 'secondary', text: true, rounded: true });
    /**
     * Whether to dismiss drawer on click of the mask.
     * @group Props
     */
    readonly dismissible = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether to display the close icon.
     * @group Props
     * @deprecated use 'closable' instead.
     */
    readonly showCloseIcon = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Specifies if pressing escape key should hide the drawer.
     * @group Props
     */
    readonly closeOnEscape = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Transition options of the animation.
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly transitionOptions = input<string>('150ms cubic-bezier(0, 0, 0.2, 1)');
    /**
     * The visible property is an input that determines the visibility of the component.
     * @defaultValue false
     * @group Props
     */
    readonly visible = model<boolean>(false);

    _visibleEffect = effect(() => {
        if (this.visible() && !this.modalVisible) {
            this.modalVisible = true;
        }
    });

    /**
     * Specifies the position of the drawer, valid values are "left", "right", "bottom" and "top".
     * @defaultValue 'left'
     * @group Props
     */
    position = input<'left' | 'right' | 'bottom' | 'top' | 'full'>('left');
    /**
     * Adds a close icon to the header to hide the dialog.
     * @defaultValue false
     * @group Props
     */
    fullScreen = input<boolean>(false);

    $enterAnimation = computed(() => (this.fullScreen() ? 'p-drawer-enter-full' : `p-drawer-enter-${this.position()}`));

    $leaveAnimation = computed(() => (this.fullScreen() ? 'p-drawer-leave-full' : `p-drawer-leave-${this.position()}`));

    /**
     * Title content of the dialog.
     * @group Props
     */
    readonly header = input<string>();
    /**
     * Style of the mask.
     * @group Props
     */
    readonly maskStyle = input<{
    [klass: string]: any;
} | null>();
    /**
     * Whether to display close button.
     * @group Props
     * @defaultValue true
     */
    readonly closable = input<boolean, unknown>(true, { transform: booleanAttribute });
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
     * Callback to invoke when dialog visibility is changed.
     * @param {boolean} value - Visible value.
     * @group Emits
     */
    readonly containerViewChild = viewChild<ElementRef>('container');

    readonly closeButtonViewChild = viewChild<ElementRef>('closeButton');

    initialized: boolean | undefined;

    _position: string = 'left';

    _fullScreen: boolean = false;

    modalVisible: boolean = false;

    container: Nullable<HTMLDivElement>;

    mask: Nullable<HTMLDivElement>;

    maskClickListener: VoidListener;

    documentEscapeListener: VoidListener;

    animationEndListener: VoidListener;

    _componentStyle = inject(DrawerStyle);

    onAfterViewInit() {
        this.initialized = true;
    }
    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });
    /**
     * Custom footer template.
     * @group Templates
     */
    readonly footerTemplate = contentChild<TemplateRef<void>>('footer', { descendants: false });
    /**
     * Custom content template.
     * @group Templates
     */
    readonly contentTemplate = contentChild<TemplateRef<void>>('content', { descendants: false });
    /**
     * Custom close icon template.
     * @group Templates
     */
    readonly closeIconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });
    /**
     * Custom headless template to replace the entire drawer content.
     * @group Templates
     */
    readonly headlessTemplate = contentChild<TemplateRef<void>>('headless', { descendants: false });

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    _headerTemplate: TemplateRef<void> | undefined;

    _footerTemplate: TemplateRef<void> | undefined;

    _contentTemplate: TemplateRef<void> | undefined;

    _closeIconTemplate: TemplateRef<void> | undefined;

    _headlessTemplate: TemplateRef<void> | undefined;

    readonly templates = contentChildren(PrimeTemplate);

    onAfterContentInit() {
        this.templates()?.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this._contentTemplate = item.template;
                    break;
                case 'header':
                    this._headerTemplate = item.template;
                    break;
                case 'footer':
                    this._footerTemplate = item.template;
                    break;
                case 'closeicon':
                    this._closeIconTemplate = item.template;
                    break;
                case 'headless':
                    this._headlessTemplate = item.template;
                    break;

                default:
                    this._contentTemplate = item.template;
                    break;
            }
        });
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.code === 'Escape') {
            this.hide(false);
        }
    }

    show() {
        this.container?.setAttribute(this.$attrSelector, '');

        if (this.autoZIndex()) {
            ZIndexUtils.set('modal', this.container, this.baseZIndex() || this.config.zIndex.modal);
        }

        if (this.modal()) {
            this.enableModality();
        }

        this.visible.set(true);
        this.onShow.emit({});
    }

    hide(emit: boolean = true) {
        if (emit) {
            this.onHide.emit({});
        }

        if (this.modal()) {
            this.disableModality();
        }
    }

    close(event: Event) {
        this.visible.set(false);
        this.hide();
        this.cd.markForCheck();
        event.preventDefault();
    }

    enableModality() {
        const activeDrawers = this.document.querySelectorAll('[data-p-open="true"]');
        const activeDrawersLength = activeDrawers.length;
        const zIndex = activeDrawersLength == 1 ? String(parseInt((this.container as HTMLDivElement).style.zIndex) - 1) : String(parseInt((activeDrawers[activeDrawersLength - 1] as HTMLElement).style.zIndex) - 1);

        if (!this.mask) {
            this.mask = this.renderer.createElement('div');

            if (this.mask) {
                const style = `z-index: ${zIndex};${this.getMaskStyle()}`;
                setAttribute(this.mask, 'style', style);
                setAttribute(this.mask, 'data-p', this.dataP);
                addClass(this.mask, this.cx('mask'));
            }

            if (this.dismissible()) {
                this.maskClickListener = this.renderer.listen(this.mask, 'click', (event: any) => {
                    if (this.dismissible()) {
                        this.close(event);
                    }
                });
            }

            this.renderer.appendChild(this.document.body, this.mask);
            if (this.blockScroll()) {
                blockBodyScroll();
            }
        }
    }

    getMaskStyle() {
        const maskStyle = this.maskStyle();
        return maskStyle
            ? Object.entries(maskStyle)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join('; ')
            : '';
    }

    disableModality() {
        if (this.mask) {
            !this.$unstyled() && removeClass(this.mask, 'p-overlay-mask-enter-active');
            !this.$unstyled() && addClass(this.mask, 'p-overlay-mask-leave-active');
            this.animationEndListener = this.renderer.listen(this.mask, 'animationend', this.destroyModal.bind(this));
        }
    }

    destroyModal() {
        this.unbindMaskClickListener();

        if (this.mask) {
            this.renderer.removeChild(this.document.body, this.mask);
        }

        if (this.blockScroll()) {
            unblockBodyScroll();
        }

        this.unbindAnimationEndListener();
        this.mask = null;
    }

    onBeforeEnter(event: MotionEvent) {
        this.container = event.element as HTMLDivElement;
        this.appendContainer();
        this.show();

        if (this.closeOnEscape()) {
            this.bindDocumentEscapeListener();
        }
    }

    onAfterLeave() {
        this.hide(false);
        ZIndexUtils.clear(this.container);
        this.unbindGlobalListeners();
        this.modalVisible = false;
        this.container = null;
    }

    appendContainer() {
        if (this.$appendTo() && this.$appendTo() !== 'self') {
            if (this.$appendTo() === 'body') {
                appendChild(this.document.body, this.container!);
            } else {
                appendChild(this.$appendTo(), this.container!);
            }
        }
    }

    bindDocumentEscapeListener() {
        const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : this.document;

        this.documentEscapeListener = this.renderer.listen(documentTarget, 'keydown', (event) => {
            if (event.which == 27) {
                if (parseInt((this.container as HTMLDivElement)?.style.zIndex) === ZIndexUtils.get(this.container)) {
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

    unbindMaskClickListener() {
        if (this.maskClickListener) {
            this.maskClickListener();
            this.maskClickListener = null;
        }
    }

    unbindGlobalListeners() {
        this.unbindMaskClickListener();
        this.unbindDocumentEscapeListener();
    }

    unbindAnimationEndListener() {
        if (this.animationEndListener && this.mask) {
            this.animationEndListener();
            this.animationEndListener = null;
        }
    }

    onDestroy() {
        this.initialized = false;

        if (this.visible() && this.modal()) {
            this.destroyModal();
        }

        if (this.$appendTo() && this.container) {
            this.renderer.appendChild(this.el.nativeElement, this.container);
        }

        if (this.container && this.autoZIndex()) {
            ZIndexUtils.clear(this.container);
        }

        this.container = null;
        this.unbindGlobalListeners();
        this.unbindAnimationEndListener();
    }

    get dataP() {
        return this.cn({
            'full-screen': this.position() === 'full',
            [this.position()]: this.position(),
            open: this.visible(),
            modal: this.modal()
        });
    }
}

@NgModule({
    imports: [Drawer, SharedModule],
    exports: [Drawer, SharedModule]
})
export class DrawerModule {}
