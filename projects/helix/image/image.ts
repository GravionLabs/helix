import { CommonModule } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, ElementRef, inject, InjectionToken, input, NgModule, signal, TemplateRef, ViewEncapsulation, contentChild, contentChildren, viewChild, output } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { MotionEvent, MotionOptions } from '@primeuix/motion';
import { appendChild, focus } from '@primeuix/utils';
import { PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import { blockBodyScroll, unblockBodyScroll } from '@gravionlabs/helix/dom';
import { FocusTrap } from '@gravionlabs/helix/focustrap';
import { EyeIcon, RefreshIcon, SearchMinusIcon, SearchPlusIcon, TimesIcon, UndoIcon } from '@gravionlabs/helix/icons';
import { MotionModule } from '@gravionlabs/helix/motion';
import { Nullable } from '@gravionlabs/helix/ts-helpers';
import { ImageImageTemplateContext, ImagePassThrough, ImagePreviewTemplateContext } from '@gravionlabs/helix/types/image';
import { ZIndexUtils } from '@gravionlabs/helix/utils';
import { ImageStyle } from './style/imagestyle';

const IMAGE_INSTANCE = new InjectionToken<Image>('IMAGE_INSTANCE');

/**
 * Displays an image with preview and tranformation options. For multiple image, see Galleria.
 * @group Components
 */
@Component({
    selector: 'h-image',
    standalone: true,
    imports: [CommonModule, RefreshIcon, EyeIcon, UndoIcon, SearchMinusIcon, SearchPlusIcon, TimesIcon, FocusTrap, SharedModule, BindModule, MotionModule],
    templateUrl: './image.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ImageStyle, { provide: IMAGE_INSTANCE, useExisting: Image }, { provide: PARENT_INSTANCE, useExisting: Image }],
    host: {
        '[class]': "cn(cx('root'),styleClass())",
        '(document:keydown.escape)': 'onKeydownHandler()'
    },
    hostDirectives: [Bind]
})
export class Image extends BaseComponent<ImagePassThrough> {
    componentName = 'Image';

    $pcImage: Image | undefined = inject(IMAGE_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });
    /**
     * Style class of the image element.
     * @group Props
     */
    readonly imageClass = input<string>();
    /**
     * Inline style of the image element.
     * @group Props
     */
    readonly imageStyle = input<{
    [klass: string]: any;
} | null>();
    /**
     * Class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * The source path for the main image.
     * @group Props
     */
    readonly src = input<string | SafeUrl>();
    /**
     * The srcset definition for the main image.
     * @group Props
     */
    readonly srcSet = input<string | SafeUrl>();
    /**
     * The sizes definition for the main image.
     * @group Props
     */
    readonly sizes = input<string>();
    /**
     * The source path for the preview image.
     * @group Props
     */
    readonly previewImageSrc = input<string | SafeUrl>();
    /**
     * The srcset definition for the preview image.
     * @group Props
     */
    readonly previewImageSrcSet = input<string | SafeUrl>();
    /**
     * The sizes definition for the preview image.
     * @group Props
     */
    readonly previewImageSizes = input<string>();
    /**
     * Attribute of the preview image element.
     * @group Props
     */
    readonly alt = input<string>();
    /**
     * Attribute of the image element.
     * @group Props
     */
    readonly width = input<string>();
    /**
     * Attribute of the image element.
     * @group Props
     */
    readonly height = input<string>();
    /**
     * Attribute of the image element.
     * @group Props
     */
    readonly loading = input<'lazy' | 'eager'>();
    /**
     * Controls the preview functionality.
     * @group Props
     */
    readonly preview = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Transition options of the show animation
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly showTransitionOptions = input<string>('150ms cubic-bezier(0, 0, 0.2, 1)');
    /**
     * Transition options of the hide animation
     * @group Props
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     */
    readonly hideTransitionOptions = input<string>('150ms cubic-bezier(0, 0, 0.2, 1)');
    /**
     * Enter animation class name of modal.
     * @defaultValue 'p-modal-enter'
     * @group Props
     */
    modalEnterAnimation = input<string | null | undefined>('p-modal-enter');
    /**
     * Leave animation class name of modal.
     * @defaultValue 'p-modal-leave'
     * @group Props
     */
    modalLeaveAnimation = input<string | null | undefined>('p-modal-leave');
    /**
     * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @defaultValue 'self'
     * @group Props
     */
    appendTo = input<HTMLElement | ElementRef | TemplateRef<any> | 'self' | 'body' | null | undefined | any>(undefined);
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
     * Triggered when the preview overlay is shown.
     * @group Emits
     */
    readonly onShow = output<any>();
    /**
     * Triggered when the preview overlay is hidden.
     * @group Emits
     */
    readonly onHide = output<any>();
    /**
     * This event is triggered if an error occurs while loading an image file.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onImageError = output<Event>();

    readonly mask = viewChild<ElementRef>('mask');

    readonly previewButton = viewChild<ElementRef>('previewButton');

    readonly closeButton = viewChild<ElementRef>('closeButton');

    /**
     * Custom indicator template.
     * @group Templates
     */
    readonly indicatorTemplate = contentChild<TemplateRef<void>>('indicator', { descendants: false });

    /**
     * Custom rotate right icon template.
     * @group Templates
     */
    readonly rotateRightIconTemplate = contentChild<TemplateRef<void>>('rotaterighticon', { descendants: false });

    /**
     * Custom rotate left icon template.
     * @group Templates
     */
    readonly rotateLeftIconTemplate = contentChild<TemplateRef<void>>('rotatelefticon', { descendants: false });

    /**
     * Custom zoom out icon template.
     * @group Templates
     */
    readonly zoomOutIconTemplate = contentChild<TemplateRef<void>>('zoomouticon', { descendants: false });

    /**
     * Custom zoom in icon template.
     * @group Templates
     */
    readonly zoomInIconTemplate = contentChild<TemplateRef<void>>('zoominicon', { descendants: false });

    /**
     * Custom close icon template.
     * @group Templates
     */
    readonly closeIconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });

    /**
     * Custom preview template.
     * @group Templates
     */
    readonly previewTemplate = contentChild<TemplateRef<ImagePreviewTemplateContext>>('preview', { descendants: false });

    /**
     * Custom image template.
     * @group Templates
     */
    readonly imageTemplate = contentChild<TemplateRef<ImageImageTemplateContext>>('image', { descendants: false });

    renderMask = signal<boolean>(false);

    renderPreview = signal<boolean>(false);

    maskVisible: boolean = false;

    previewVisible: boolean = false;

    rotate: number = 0;

    scale: number = 1;

    previewClick: boolean = false;

    container: Nullable<HTMLElement>;

    wrapper: Nullable<HTMLElement>;

    _componentStyle = inject(ImageStyle);

    $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo());

    public get isZoomOutDisabled(): boolean {
        return this.scale - this.zoomSettings.step <= this.zoomSettings.min;
    }

    public get isZoomInDisabled(): boolean {
        return this.scale + this.zoomSettings.step >= this.zoomSettings.max;
    }

    private zoomSettings = {
        default: 1,
        step: 0.1,
        max: 1.5,
        min: 0.5
    };

    readonly templates = contentChildren(PrimeTemplate);

    _indicatorTemplate: TemplateRef<void> | undefined;

    _rotateRightIconTemplate: TemplateRef<void> | undefined;

    _rotateLeftIconTemplate: TemplateRef<void> | undefined;

    _zoomOutIconTemplate: TemplateRef<void> | undefined;

    _zoomInIconTemplate: TemplateRef<void> | undefined;

    _closeIconTemplate: TemplateRef<void> | undefined;

    _imageTemplate: TemplateRef<ImageImageTemplateContext> | undefined;

    _previewTemplate: TemplateRef<ImagePreviewTemplateContext> | undefined;

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    onAfterContentInit() {
        this.templates().forEach((item) => {
            switch (item.getType()) {
                case 'indicator':
                    this._indicatorTemplate = item.template;
                    break;

                case 'rotaterighticon':
                    this._rotateRightIconTemplate = item.template;
                    break;

                case 'rotatelefticon':
                    this._rotateLeftIconTemplate = item.template;
                    break;

                case 'zoomouticon':
                    this._zoomOutIconTemplate = item.template;
                    break;

                case 'zoominicon':
                    this._zoomInIconTemplate = item.template;
                    break;

                case 'closeicon':
                    this._closeIconTemplate = item.template;
                    break;

                case 'image':
                    this._imageTemplate = item.template;
                    break;

                case 'preview':
                    this._previewTemplate = item.template;
                    break;

                default:
                    this._indicatorTemplate = item.template;
                    break;
            }
        });
    }

    onImageClick() {
        if (this.preview()) {
            this.maskVisible = true;
            this.previewVisible = true;
            this.renderMask.set(true);
            this.renderPreview.set(true);
            blockBodyScroll();
        }
    }

    onMaskClick() {
        if (!this.previewClick) {
            this.closePreview();
        }

        this.previewClick = false;
    }

    onMaskKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'Escape':
                this.onMaskClick();
                setTimeout(() => {
                    focus(this.previewButton()?.nativeElement);
                }, 25);
                event.preventDefault();

                break;

            default:
                break;
        }
    }

    onPreviewImageClick() {
        this.previewClick = true;
    }

    rotateRight() {
        this.rotate += 90;
        this.previewClick = true;
    }

    rotateLeft() {
        this.rotate -= 90;
        this.previewClick = true;
    }

    zoomIn() {
        this.scale = this.scale + this.zoomSettings.step;
        this.previewClick = true;
    }

    zoomOut() {
        this.scale = this.scale - this.zoomSettings.step;
        this.previewClick = true;
    }

    onAnimationStart(event: MotionEvent) {
        this.container = event.element as HTMLDivElement;
        this.wrapper = this.container?.parentElement;
        this.$attrSelector && this.wrapper?.setAttribute(this.$attrSelector, '');
        this.appendContainer();
        this.moveOnTop();
        this.onShow.emit({});
        setTimeout(() => {
            focus(this.closeButton()?.nativeElement);
        }, 25);
    }

    onBeforeLeave() {
        this.maskVisible = false;
    }

    onAnimationEnd() {
        this.renderPreview.set(false);
    }

    onMaskAfterLeave() {
        if (!this.renderPreview()) {
            this.renderMask.set(false);
        }
        ZIndexUtils.clear(this.wrapper);
        this.container = null;
        this.wrapper = null;
        this.rotate = 0;
        this.scale = this.zoomSettings.default;
        unblockBodyScroll();
        this.onHide.emit({});
        this.cd.markForCheck();
    }

    moveOnTop() {
        ZIndexUtils.set('modal', this.wrapper, this.config.zIndex.modal);
    }

    appendContainer() {
        if (this.$appendTo() && this.$appendTo() !== 'self') {
            if (this.$appendTo() === 'body' && this.wrapper) {
                this.document.body.appendChild(this.wrapper as HTMLElement);
            } else if (this.wrapper) {
                appendChild(this.$appendTo(), this.wrapper);
            }
        }
    }

    imagePreviewStyle() {
        return { transform: 'rotate(' + this.rotate + 'deg) scale(' + this.scale + ')' };
    }

    get zoomImageAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.zoomImage : undefined;
    }

    handleToolbarClick(event: MouseEvent): void {
        event.stopPropagation();
    }

    closePreview(): void {
        this.previewVisible = false;
    }

    imageError(event: Event) {
        this.onImageError.emit(event);
    }

    rightAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.rotateRight : undefined;
    }

    leftAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.rotateLeft : undefined;
    }

    zoomInAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.zoomIn : undefined;
    }

    zoomOutAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.zoomOut : undefined;
    }

    closeAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.close : undefined;
    }

    onKeydownHandler() {
        if (this.previewVisible) {
            this.closePreview();
        }
    }
}

@NgModule({
    imports: [Image, SharedModule],
    exports: [Image, SharedModule]
})
export class ImageModule {}
