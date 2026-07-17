import { CommonModule, isPlatformBrowser } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, ElementRef, inject, InjectionToken, input, KeyValueDiffers, NgModule, numberAttribute, QueryList, signal, SimpleChanges, TemplateRef, ViewEncapsulation, output, viewChild, contentChild, contentChildren, model, effect, untracked } from '@angular/core';
import { MotionEvent, MotionOptions } from '@primeuix/motion';
import { addClass, find, findSingle, focus, getAttribute, removeClass, setAttribute, uuid } from '@primeuix/utils';
import { PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import { blockBodyScroll, unblockBodyScroll } from '@gravionlabs/helix/dom';
import { FocusTrap } from '@gravionlabs/helix/focustrap';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, TimesIcon } from '@gravionlabs/helix/icons';
import { MotionModule } from '@gravionlabs/helix/motion';
import { Ripple } from '@gravionlabs/helix/ripple';
import { VoidListener } from '@gravionlabs/helix/ts-helpers';
import { GalleriaCaptionTemplateContext, GalleriaIndicatorTemplateContext, GalleriaItemTemplateContext, GalleriaPassThrough, GalleriaResponsiveOptions, GalleriaThumbnailTemplateContext } from '@gravionlabs/helix/types/galleria';
import { ZIndexUtils } from '@gravionlabs/helix/utils';
import { GalleriaStyle } from './style/galleriastyle';

const GALLERIA_INSTANCE = new InjectionToken<Galleria>('GALLERIA_INSTANCE');

/**
 * Galleria is an advanced content gallery component.
 * @group Components
 */
@Component({
    selector: 'h-galleria',
    standalone: false,
    templateUrl: './galleria.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [GalleriaStyle, { provide: GALLERIA_INSTANCE, useExisting: Galleria }, { provide: PARENT_INSTANCE, useExisting: Galleria }],
    hostDirectives: [Bind]
})
export class Galleria extends BaseComponent<GalleriaPassThrough> {
    componentName = 'Galleria';

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcGalleria: Galleria | undefined = inject(GALLERIA_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('host'));
    }
    /**
     * Index of the first item.
     * @group Props
     */
    readonly activeIndex = model<number>(0);
    /**
     * Whether to display the component on fullscreen.
     * @group Props
     */
    readonly fullScreen = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Unique identifier of the element.
     * @group Props
     */
    readonly id = input<string>();
    /**
     * An array of objects to display.
     * @group Props
     */
    readonly value = input<any[]>();
    /**
     * Number of items per page.
     * @group Props
     */
    readonly numVisible = input<number, unknown>(3, { transform: numberAttribute });
    /**
     * An array of options for responsive design.
     * @see {GalleriaResponsiveOptions}
     * @group Props
     */
    readonly responsiveOptions = input<GalleriaResponsiveOptions[]>();
    /**
     * Whether to display navigation buttons in item section.
     * @group Props
     */
    readonly showItemNavigators = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether to display navigation buttons in thumbnail container.
     * @group Props
     */
    readonly showThumbnailNavigators = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether to display navigation buttons on item hover.
     * @group Props
     */
    readonly showItemNavigatorsOnHover = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * When enabled, item is changed on indicator hover.
     * @group Props
     */
    readonly changeItemOnIndicatorHover = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Defines if scrolling would be infinite.
     * @group Props
     */
    readonly circular = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Items are displayed with a slideshow in autoPlay mode.
     * @group Props
     */
    readonly autoPlay = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * When enabled, autorun should stop by click.
     * @group Props
     */
    readonly shouldStopAutoplayByClick = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Time in milliseconds to scroll items.
     * @group Props
     */
    readonly transitionInterval = input<number, unknown>(4000, { transform: numberAttribute });
    /**
     * Whether to display thumbnail container.
     * @group Props
     */
    readonly showThumbnails = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Position of thumbnails.
     * @group Props
     */
    readonly thumbnailsPosition = input<'bottom' | 'top' | 'left' | 'right' | undefined>('bottom');
    /**
     * Height of the viewport in vertical thumbnail.
     * @group Props
     */
    readonly verticalThumbnailViewPortHeight = input<string>('300px');
    /**
     * Whether to display indicator container.
     * @group Props
     */
    readonly showIndicators = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * When enabled, indicator container is displayed on item container.
     * @group Props
     */
    readonly showIndicatorsOnItem = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Position of indicators.
     * @group Props
     */
    readonly indicatorsPosition = input<'bottom' | 'top' | 'left' | 'right' | undefined>('bottom');
    /**
     * Base zIndex value to use in layering.
     * @group Props
     */
    readonly baseZIndex = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * Style class of the mask on fullscreen mode.
     * @group Props
     */
    readonly maskClass = input<string>();
    /**
     * Style class of the component on fullscreen mode. Otherwise, the 'class' property can be used.
     * @group Props
     */
    readonly containerClass = input<string>();
    /**
     * Inline style of the component on fullscreen mode. Otherwise, the 'style' property can be used.
     * @group Props
     */
    readonly containerStyle = input<{
    [klass: string]: any;
} | null>();
    /**
     * Transition options of the show animation.
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     * @group Props
     */
    readonly showTransitionOptions = input<string>('150ms cubic-bezier(0, 0, 0.2, 1)');
    /**
     * Transition options of the hide animation.
     * @deprecated since v21.0.0. Use `motionOptions` instead.
     * @group Props
     */
    readonly hideTransitionOptions = input<string>('150ms cubic-bezier(0, 0, 0.2, 1)');
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
     * The mask motion options.
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
     * Specifies the visibility of the mask on fullscreen mode.
     * @group Props
     */
    readonly visible = model<boolean>(false);

    renderMask = signal<boolean>(false);
    renderContent = signal<boolean>(false);

    readonly container = viewChild<ElementRef>('container');

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<void>>('header', { descendants: false });
    headerFacet: TemplateRef<void> | undefined;

    /**
     * Custom footer template.
     * @group Templates
     */
    readonly footerTemplate = contentChild<TemplateRef<void>>('footer', { descendants: false });
    footerFacet: TemplateRef<void> | undefined;

    /**
     * Custom indicator template.
     * @group Templates
     */
    readonly indicatorTemplate = contentChild<TemplateRef<GalleriaIndicatorTemplateContext>>('indicator', { descendants: false });
    indicatorFacet: TemplateRef<GalleriaIndicatorTemplateContext> | undefined;

    /**
     * Custom caption template.
     * @group Templates
     */
    readonly captionTemplate = contentChild<TemplateRef<GalleriaCaptionTemplateContext>>('caption', { descendants: false });
    captionFacet: TemplateRef<GalleriaCaptionTemplateContext> | undefined;

    /**
     * Custom close icon template.
     * @group Templates
     */
    readonly _closeIconTemplate = contentChild<TemplateRef<void>>('closeicon', { descendants: false });
    closeIconTemplate: TemplateRef<void> | undefined;

    /**
     * Custom previous thumbnail icon template.
     * @group Templates
     */
    readonly _previousThumbnailIconTemplate = contentChild<TemplateRef<void>>('previousthumbnailicon', { descendants: false });
    previousThumbnailIconTemplate: TemplateRef<void> | undefined;

    /**
     * Custom next thumbnail icon template.
     * @group Templates
     */
    readonly _nextThumbnailIconTemplate = contentChild<TemplateRef<void>>('nextthumbnailicon', { descendants: false });
    nextThumbnailIconTemplate: TemplateRef<void> | undefined;

    /**
     * Custom item previous icon template.
     * @group Templates
     */
    readonly _itemPreviousIconTemplate = contentChild<TemplateRef<void>>('itempreviousicon', { descendants: false });
    itemPreviousIconTemplate: TemplateRef<void> | undefined;

    /**
     * Custom item next icon template.
     * @group Templates
     */
    readonly _itemNextIconTemplate = contentChild<TemplateRef<void>>('itemnexticon', { descendants: false });
    itemNextIconTemplate: TemplateRef<void> | undefined;

    /**
     * Custom item template.
     * @group Templates
     */
    readonly _itemTemplate = contentChild<TemplateRef<GalleriaItemTemplateContext>>('item', { descendants: false });
    itemTemplate: TemplateRef<GalleriaItemTemplateContext> | undefined;

    /**
     * Custom thumbnail template.
     * @group Templates
     */
    readonly _thumbnailTemplate = contentChild<TemplateRef<GalleriaThumbnailTemplateContext>>('thumbnail', { descendants: false });
    thumbnailTemplate: TemplateRef<GalleriaThumbnailTemplateContext> | undefined;

    maskVisible: boolean = false;

    numVisibleLimit = 0;

    _componentStyle = inject(GalleriaStyle);

    mask: HTMLElement;

    readonly templates = contentChildren(PrimeTemplate);

    constructor(public element: ElementRef) {
        super();
        effect(() => {
            const visible = this.visible();
            untracked(() => {
                if (visible && !this.maskVisible) {
                    this.maskVisible = true;
                    this.renderMask.set(true);
                    this.renderContent.set(true);
                } else if (!visible && this.maskVisible) {
                    this.maskVisible = false;
                }
            });
        });
    }

    onAfterContentInit() {
        this.templates().forEach((item) => {
            switch (item.getType()) {
                case 'header':
                    this.headerFacet = item.template;
                    break;

                case 'footer':
                    this.footerFacet = item.template;
                    break;

                case 'indicator':
                    this.indicatorFacet = item.template;
                    break;

                case 'closeicon':
                    this.closeIconTemplate = item.template;
                    break;

                case 'itemnexticon':
                    this.itemNextIconTemplate = item.template;
                    break;

                case 'itempreviousicon':
                    this.itemPreviousIconTemplate = item.template;
                    break;

                case 'previousthumbnailicon':
                    this.previousThumbnailIconTemplate = item.template;
                    break;

                case 'nextthumbnailicon':
                    this.nextThumbnailIconTemplate = item.template;
                    break;

                case 'caption':
                    this.captionFacet = item.template;
                    break;

                case 'item':
                    this.itemTemplate = item.template;
                    break;

                case 'thumbnail':
                    this.thumbnailTemplate = item.template;
                    break;
            }
        });
    }

    onChanges(simpleChanges: SimpleChanges) {
        if (simpleChanges.value && simpleChanges.value.currentValue?.length < this.numVisible()) {
            this.numVisibleLimit = simpleChanges.value.currentValue.length;
        } else {
            this.numVisibleLimit = 0;
        }
    }

    onMaskHide(event?: MouseEvent) {
        if (!event || event.target === event.currentTarget) {
            this.visible.set(false);
        }
    }

    onActiveItemChange(index: number) {
        if (this.activeIndex() !== index) {
            this.activeIndex.set(index);
        }
    }

    onBeforeEnter(event: MotionEvent) {
        this.mask = <HTMLElement>event.element?.parentElement;
        this.enableModality();
        setTimeout(() => {
            const focusTarget = findSingle(this.container()?.nativeElement, '[data-pc-section="closebutton"]');
            if (focusTarget) focus(focusTarget as HTMLElement);
        }, 25);
    }

    onBeforeLeave() {
        if (this.mask) {
            this.maskVisible = false;
        }
    }

    onAfterLeave() {
        this.disableModality();
        this.renderContent.set(false);
    }

    onMaskAfterLeave() {
        if (!this.renderContent()) {
            this.renderMask.set(false);
        }
    }

    enableModality() {
        //@ts-ignore
        blockBodyScroll();
        this.cd.markForCheck();
        if (this.mask) {
            ZIndexUtils.set('modal', this.mask, this.baseZIndex() || this.config.zIndex.modal);
        }
    }

    disableModality() {
        //@ts-ignore
        unblockBodyScroll();
        this.cd.markForCheck();
        if (this.mask) {
            ZIndexUtils.clear(this.mask);
        }
    }

    onDestroy() {
        if (this.fullScreen()) {
            removeClass(this.document.body, 'p-overflow-hidden');
        }

        if (this.mask) {
            this.disableModality();
        }
    }
}

@Component({
    selector: 'div[hGalleriaContent]',
    standalone: false,
    templateUrl: './galleriacontent.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [GalleriaStyle],
    host: {
        '[attr.id]': 'id',
        '[attr.role]': '"region"',
        '[style]': '!galleria.fullScreen() ? galleria.containerStyle() : {}',
        '[class]': "cn(cx('root'))",
        '(document:fullscreenchange)': 'handleFullscreenChange($event)'
    },
    hostDirectives: [Bind]
})
export class GalleriaContent extends BaseComponent<GalleriaPassThrough> {
    hostName: string = 'Galleria';

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.getPTOptions('root'));
    }

    readonly activeIndex = input<number>(0);

    readonly value = input<any[]>([]);

    readonly numVisible = input<number, unknown>(undefined, { transform: numberAttribute });

    fullScreenState: boolean | undefined;

    readonly fullScreen = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    readonly maskHide = output<boolean>();

    readonly activeItemChange = output<number>();

    readonly closeButton = viewChild<ElementRef>('closeButton');

    _componentStyle = inject(GalleriaStyle);

    $pcGalleria: Galleria | undefined = inject(GALLERIA_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    id: string;

    _activeIndex: number = 0;

    slideShowActive: boolean = true;

    interval: any;

    styleClass: string | undefined;

    private differ: any;

    constructor(
        public galleria: Galleria,
        private differs: KeyValueDiffers
    ) {
        super();
        this.id = this.galleria.id() || uuid('pn_id_');
        this.differ = this.differs.find(this.galleria).create();
        effect(() => {
            this._activeIndex = this.activeIndex();
        });
    }

    // For custom fullscreen
    handleFullscreenChange(event: Event) {
        if (document?.fullscreenElement === this.el.nativeElement?.children[0]) {
            this.fullScreenState = true;
        } else {
            this.fullScreenState = false;
        }
    }

    onDoCheck(): void {
        if (isPlatformBrowser(this.galleria.platformId)) {
            const changes = this.differ.diff(this.galleria as unknown as Record<string, unknown>);
            if (changes && changes.forEachItem.length > 0) {
                // Because we change the properties of the parent component,
                // and the children take our entity from the injector.
                // We can tell the children to redraw themselves when we change the properties of the parent component.
                // Since we have an onPush strategy
                this.cd.markForCheck();
            }
        }
    }

    shouldRenderFooter() {
        return (this.galleria.footerFacet && this.galleria.templates().length > 0) || this.galleria.footerTemplate();
    }

    startSlideShow() {
        if (isPlatformBrowser(this.galleria.platformId)) {
            this.interval = setInterval(() => {
                let activeIndex = this.galleria.circular() && this.value().length - 1 === this._activeIndex ? 0 : this._activeIndex + 1;
                this.onActiveIndexChange(activeIndex);
                this._activeIndex = activeIndex;
            }, this.galleria.transitionInterval());

            this.slideShowActive = true;
        }
    }

    stopSlideShow() {
        if (this.galleria.autoPlay() && !this.galleria.shouldStopAutoplayByClick()) {
            return;
        }

        if (this.interval) {
            clearInterval(this.interval);
        }

        this.slideShowActive = false;
    }

    getPositionClass(preClassName: string, position: string) {
        const positions = ['top', 'left', 'bottom', 'right'];
        const pos = positions.find((item) => item === position);

        return pos ? `${preClassName}-${pos}` : '';
    }

    isVertical() {
        const thumbnailsPosition = this.galleria.thumbnailsPosition();
        return thumbnailsPosition === 'left' || thumbnailsPosition === 'right';
    }

    onActiveIndexChange(index: number) {
        if (this._activeIndex !== index) {
            this._activeIndex = index;
            this.activeItemChange.emit(this._activeIndex);
        }
    }

    closeAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria.close : undefined;
    }

    getPTOptions(key: string) {
        return this.ptm(key, {
            context: {
                pt: this.pt(),
                unstyled: this.unstyled()
            }
        });
    }
}

@Component({
    selector: 'div[hGalleriaItemSlot]',
    standalone: false,
    template: `
        @if (shouldRender()) {
          <ng-container *ngTemplateOutlet="contentTemplate; context: context"></ng-container>
        }
        `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleriaItemSlot extends BaseComponent<GalleriaPassThrough> {
    hostName: string = 'Galleria';

    readonly templates = input<QueryList<PrimeTemplate>>();

    readonly index = input<number, unknown>(undefined, { transform: numberAttribute });

    readonly item = input<any>();

    constructor() {
        super();
        effect(() => {
            const item = this.item();
            untracked(() => {
            this._item = item;
            const templates = this.templates();
            if (templates && templates?.toArray().length > 0) {
                templates.forEach((item) => {
                    const type = this.type();
                    if (item.getType() === type) {
                        switch (type) {
                            case 'item':
                            case 'caption':
                            case 'thumbnail':
                                this.context = { $implicit: this._item };
                                this.contentTemplate = item.template;
                                break;
                            case 'footer':
                                this.context = { $implicit: this._item };
                                this.contentTemplate = item.template;
                                break;
                        }
                    }
                });
            } else {
                this.getContentTemplate();
            }
            });
        });
    }

    shouldRender() {
        const captionTemplate = this.galleria.captionTemplate();
        return (
            this.contentTemplate ||
            this.galleria._itemTemplate() ||
            this.galleria.itemTemplate ||
            captionTemplate ||
            captionTemplate ||
            this.galleria.captionFacet ||
            this.galleria.thumbnailTemplate ||
            this.galleria._thumbnailTemplate() ||
            this.galleria.footerTemplate()
        );
    }

    galleria: Galleria = inject(Galleria);

    $pcGalleria: Galleria | undefined = inject(GALLERIA_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;


    getTemplateFromQueryList(type: string): TemplateRef<any> | undefined {
        return this.galleria.templates().find((item) => item.getType() === type)?.template;
    }

    getContentTemplate() {
        switch (this.type()) {
            case 'item':
                this.context = { $implicit: this._item };
                this.contentTemplate = this.galleria._itemTemplate() || this.getTemplateFromQueryList('item');
                break;
            case 'caption':
                this.context = { $implicit: this._item };
                this.contentTemplate = this.galleria.captionTemplate() || this.getTemplateFromQueryList('caption');
                break;
            case 'thumbnail':
                this.context = { $implicit: this._item };
                this.contentTemplate = this.galleria._thumbnailTemplate() || this.getTemplateFromQueryList('thumbnail');
                break;
            case 'indicator':
                this.context = { $implicit: this.index() };
                this.contentTemplate = this.galleria.indicatorTemplate() || this.getTemplateFromQueryList('indicator');
                break;
            case 'footer':
                this.context = { $implicit: this._item };
                this.contentTemplate = this.galleria.footerTemplate() || this.getTemplateFromQueryList('footer');
                break;
            default:
                this.context = { $implicit: this._item };
                this.contentTemplate = this.galleria._itemTemplate() || this.getTemplateFromQueryList('item');
        }
    }

    readonly type = input<string>();

    contentTemplate: TemplateRef<any> | undefined;

    context: any;

    _item: any;

    onAfterContentInit() {
        const templates = this.templates();
        if (templates && templates.toArray().length > 0) {
            templates?.forEach((item) => {
                const type = this.type();
                if (item.getType() === type) {
                    switch (type) {
                        case 'item':
                        case 'caption':
                        case 'thumbnail':
                            this.context = { $implicit: this._item };
                            this.contentTemplate = item.template;
                            break;

                        case 'indicator':
                            this.context = { $implicit: this.index() };
                            this.contentTemplate = item.template;
                            break;

                        case 'footer':
                            this.context = { $implicit: this._item };
                            this.contentTemplate = item.template;
                            break;

                        default:
                            this.context = { $implicit: this._item };
                            this.contentTemplate = item.template;
                            break;
                    }
                }
            });
        } else {
            this.getContentTemplate();
        }
    }
}

@Component({
    selector: 'div[hGalleriaItem]',
    standalone: false,
    templateUrl: './galleriaitem.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [GalleriaStyle],
    hostDirectives: [Bind]
})
export class GalleriaItem extends BaseComponent<GalleriaPassThrough> {
    hostName: string = 'Galleria';

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('itemsContainer'));
    }

    readonly id = input<string>();

    readonly circular = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly value = input<any[]>();

    readonly showItemNavigators = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly showIndicators = input<boolean, unknown>(true, { transform: booleanAttribute });

    readonly slideShowActive = input<boolean, unknown>(true, { transform: booleanAttribute });

    readonly changeItemOnIndicatorHover = input<boolean, unknown>(true, { transform: booleanAttribute });

    readonly autoPlay = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly templates = input<QueryList<PrimeTemplate>>();

    readonly indicatorFacet = input<any>();

    readonly captionFacet = input<any>();

    readonly startSlideShow = output<void>();

    readonly stopSlideShow = output<void>();

    readonly onActiveIndexChange = output<number>();

    _componentStyle = inject(GalleriaStyle);

    readonly activeIndex = input<number>(0);

    get activeItem() {
        const value = this.value();
        return value && value[this._activeIndex];
    }

    _activeIndex: number = 0;

    leftButtonFocused: boolean = false;

    rightButtonFocused: boolean = false;

    constructor(public galleria: Galleria) {
        super();
        effect(() => {
            this._activeIndex = this.activeIndex();
        });
    }

    getIndicatorPTOptions(index: number) {
        return this.ptm('indicator', {
            context: {
                highlighted: this._activeIndex === index
            }
        });
    }

    onChanges({ autoPlay }: SimpleChanges): void {
        if (autoPlay?.currentValue) {
            this.startSlideShow.emit();
        }

        if (autoPlay && autoPlay.currentValue === false) {
            this.stopTheSlideShow();
        }
    }

    next() {
        let nextItemIndex = this._activeIndex + 1;
        let activeIndex = this.circular() && (<any[]>this.value()).length - 1 === this._activeIndex ? 0 : nextItemIndex;
        this.onActiveIndexChange.emit(activeIndex);
    }

    prev() {
        let prevItemIndex = this._activeIndex !== 0 ? this._activeIndex - 1 : 0;
        let activeIndex = this.circular() && this._activeIndex === 0 ? (<any[]>this.value()).length - 1 : prevItemIndex;
        this.onActiveIndexChange.emit(activeIndex);
    }

    onButtonFocus(pos: 'left' | 'right') {
        if (pos === 'left') {
            this.leftButtonFocused = true;
        } else this.rightButtonFocused = true;
    }

    onButtonBlur(pos: 'left' | 'right') {
        if (pos === 'left') {
            this.leftButtonFocused = false;
        } else this.rightButtonFocused = false;
    }

    stopTheSlideShow() {
        if (this.slideShowActive() && this.stopSlideShow) {
            this.stopSlideShow.emit();
        }
    }

    navForward(e: MouseEvent) {
        this.stopTheSlideShow();
        this.next();

        if (e && e.cancelable) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    navBackward(e: MouseEvent) {
        this.stopTheSlideShow();
        this.prev();

        if (e && e.cancelable) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    onIndicatorClick(index: number) {
        this.stopTheSlideShow();
        this.onActiveIndexChange.emit(index);
    }

    onIndicatorMouseEnter(index: number) {
        if (this.changeItemOnIndicatorHover()) {
            this.stopTheSlideShow();
            this.onActiveIndexChange.emit(index);
        }
    }

    onIndicatorKeyDown(event, index: number) {
        switch (event.code) {
            case 'Enter':
            case 'Space':
                this.stopTheSlideShow();
                this.onActiveIndexChange.emit(index);
                event.preventDefault();
                break;

            case 'ArrowDown':
            case 'ArrowUp':
                event.preventDefault();
                break;

            default:
                break;
        }
    }

    isNavForwardDisabled() {
        return !this.circular() && this._activeIndex === (<any[]>this.value()).length - 1;
    }

    isNavBackwardDisabled() {
        return !this.circular() && this._activeIndex === 0;
    }

    isIndicatorItemActive(index: number) {
        return this._activeIndex === index;
    }

    ariaSlideLabel() {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.slide : undefined;
    }

    ariaSlideNumber(value: any) {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.slideNumber?.replace(/{slideNumber}/g, value) : undefined;
    }

    ariaPageLabel(value: any) {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.pageLabel?.replace(/{page}/g, value) : undefined;
    }
}

@Component({
    selector: 'div[hGalleriaThumbnails]',
    standalone: false,
    templateUrl: './galleriathumbnails.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [GalleriaStyle],
    host: {
        '[class]': 'cx("thumbnails")'
    },
    hostDirectives: [Bind]
})
export class GalleriaThumbnails extends BaseComponent<GalleriaPassThrough> {
    hostName: string = 'Galleria';

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('thumbnails'));
    }

    readonly containerId = input<string>();

    readonly value = input<any[]>();

    readonly isVertical = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly slideShowActive = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly circular = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly responsiveOptions = input<GalleriaResponsiveOptions[]>();

    readonly contentHeight = input<string>('300px');

    readonly showThumbnailNavigators = input(true);

    readonly templates = input<QueryList<PrimeTemplate>>();

    readonly onActiveIndexChange = output<number>();

    readonly stopSlideShow = output<void>();

    readonly itemsContainer = viewChild<ElementRef>('itemsContainer');

    readonly numVisible = input<number>(0);

    readonly activeIndex = input<number>(0);

    index: number | undefined;

    startPos: { x: number; y: number } | null = null;

    thumbnailsStyle: HTMLStyleElement | null = null;

    sortedResponsiveOptions: GalleriaResponsiveOptions[] | null = null;

    totalShiftedItems: number = 0;

    page: number = 0;

    documentResizeListener: VoidListener;

    _numVisible: number = 0;

    d_numVisible: number = 0;

    _oldNumVisible: number = 0;

    _activeIndex: number = 0;

    _oldactiveIndex: number = 0;

    _componentStyle = inject(GalleriaStyle);

    constructor(public galleria: Galleria) {
        super();
        effect(() => {
            const numVisible = this.numVisible();
            untracked(() => {
                this._numVisible = numVisible;
                this._oldNumVisible = this.d_numVisible;
                this.d_numVisible = numVisible;
            });
        });
        effect(() => {
            const activeIndex = this.activeIndex();
            untracked(() => {
                this._oldactiveIndex = this._activeIndex;
                this._activeIndex = activeIndex;
            });
        });
    }

    onInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.createStyle();

            if (this.responsiveOptions()) {
                this.bindDocumentListeners();
            }
        }
    }

    onAfterContentChecked() {
        let totalShiftedItems = this.totalShiftedItems;

        const itemsContainer = this.itemsContainer();
        if ((this._oldNumVisible !== this.d_numVisible || this._oldactiveIndex !== this._activeIndex) && itemsContainer) {
            if (this._activeIndex <= this.getMedianItemIndex()) {
                totalShiftedItems = 0;
            } else if ((<any[]>this.value()).length - this.d_numVisible + this.getMedianItemIndex() < this._activeIndex) {
                totalShiftedItems = this.d_numVisible - (<any[]>this.value()).length;
            } else if ((<any[]>this.value()).length - this.d_numVisible < this._activeIndex && this.d_numVisible % 2 === 0) {
                totalShiftedItems = this._activeIndex * -1 + this.getMedianItemIndex() + 1;
            } else {
                totalShiftedItems = this._activeIndex * -1 + this.getMedianItemIndex();
            }

            if (totalShiftedItems !== this.totalShiftedItems) {
                this.totalShiftedItems = totalShiftedItems;
            }

            if (itemsContainer && itemsContainer.nativeElement) {
                itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / this.d_numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this.d_numVisible)}%, 0, 0)`;
            }

            if (this._oldactiveIndex !== this._activeIndex) {
                this.document.body.setAttribute('data-p-items-hidden', 'false');
                !this.$unstyled() && removeClass(itemsContainer.nativeElement, 'p-items-hidden');
                itemsContainer.nativeElement.style.transition = 'transform 500ms ease 0s';
            }

            this._oldactiveIndex = this._activeIndex;
            this._oldNumVisible = this.d_numVisible;
        }
    }

    onAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.calculatePosition();
        }
    }

    createStyle() {
        if (!this.thumbnailsStyle) {
            this.thumbnailsStyle = this.document.createElement('style');
            setAttribute(this.thumbnailsStyle, 'nonce', this.galleria.config?.csp()?.nonce);
            this.document.body.appendChild(this.thumbnailsStyle);
        }

        let innerHTML = `
            #${this.containerId()} .p-galleria-thumbnail-item {
                flex: 1 0 ${100 / this.d_numVisible}%
            }
        `;

        const responsiveOptions = this.responsiveOptions();
        if (responsiveOptions && !this.$unstyled()) {
            this.sortedResponsiveOptions = [...responsiveOptions];
            this.sortedResponsiveOptions.sort((data1, data2) => {
                const value1 = data1.breakpoint;
                const value2 = data2.breakpoint;
                let result: number;

                if (value1 == null && value2 != null) result = -1;
                else if (value1 != null && value2 == null) result = 1;
                else if (value1 == null && value2 == null) result = 0;
                else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2, undefined, { numeric: true });
                else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

                return -1 * result;
            });

            for (let i = 0; i < this.sortedResponsiveOptions.length; i++) {
                let res = this.sortedResponsiveOptions[i];

                innerHTML += `
                    @media screen and (max-width: ${res.breakpoint}) {
                        #${this.containerId()} .p-galleria-thumbnail-item {
                            flex: 1 0 ${100 / res.numVisible}%
                        }
                    }
                `;
            }
        }

        this.thumbnailsStyle.innerHTML = innerHTML;
        setAttribute(this.thumbnailsStyle, 'nonce', this.galleria.config?.csp()?.nonce);
    }

    calculatePosition() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.itemsContainer() && this.sortedResponsiveOptions) {
                let windowWidth = window.innerWidth;
                let matchedResponsiveData = {
                    numVisible: this._numVisible
                };

                for (let i = 0; i < this.sortedResponsiveOptions.length; i++) {
                    let res = this.sortedResponsiveOptions[i];

                    if (parseInt(res.breakpoint, 10) >= windowWidth) {
                        matchedResponsiveData = res;
                    }
                }

                if (this.d_numVisible !== matchedResponsiveData.numVisible) {
                    this.d_numVisible = matchedResponsiveData.numVisible;
                    this.cd.markForCheck();
                }
            }
        }
    }

    getTabIndex(index: number) {
        return this.isItemActive(index) ? 0 : null;
    }

    navForward(e: TouchEvent | MouseEvent) {
        this.stopTheSlideShow();

        let nextItemIndex = this._activeIndex + 1;
        const circular = this.circular();
        if (nextItemIndex + this.totalShiftedItems > this.getMedianItemIndex() && (-1 * this.totalShiftedItems < this.getTotalPageNumber() - 1 || circular)) {
            this.step(-1);
        }

        let activeIndex = circular && (<any[]>this.value()).length - 1 === this._activeIndex ? 0 : nextItemIndex;
        this.onActiveIndexChange.emit(activeIndex);

        if (e.cancelable) {
            e.preventDefault();
        }
    }

    navBackward(e: TouchEvent | MouseEvent) {
        this.stopTheSlideShow();

        let prevItemIndex = this._activeIndex !== 0 ? this._activeIndex - 1 : 0;
        let diff = prevItemIndex + this.totalShiftedItems;
        const circular = this.circular();
        if (this.d_numVisible - diff - 1 > this.getMedianItemIndex() && (-1 * this.totalShiftedItems !== 0 || circular)) {
            this.step(1);
        }

        let activeIndex = circular && this._activeIndex === 0 ? (<any[]>this.value()).length - 1 : prevItemIndex;
        this.onActiveIndexChange.emit(activeIndex);

        if (e.cancelable) {
            e.preventDefault();
        }
    }

    onItemClick(index: number) {
        this.stopTheSlideShow();

        let selectedItemIndex = index;
        if (selectedItemIndex !== this._activeIndex) {
            const diff = selectedItemIndex + this.totalShiftedItems;
            let dir = 0;
            if (selectedItemIndex < this._activeIndex) {
                dir = this.d_numVisible - diff - 1 - this.getMedianItemIndex();
                if (dir > 0 && -1 * this.totalShiftedItems !== 0) {
                    this.step(dir);
                }
            } else {
                dir = this.getMedianItemIndex() - diff;
                if (dir < 0 && -1 * this.totalShiftedItems < this.getTotalPageNumber() - 1) {
                    this.step(dir);
                }
            }

            this._activeIndex = selectedItemIndex;
            this.onActiveIndexChange.emit(this._activeIndex);
        }
    }

    onThumbnailKeydown(event: KeyboardEvent, index: number) {
        if (event.code === 'Enter' || event.code === 'Space') {
            this.onItemClick(index);
            event.preventDefault();
        }

        switch (event.code) {
            case 'ArrowRight':
                this.onRightKey();
                break;

            case 'ArrowLeft':
                this.onLeftKey();
                break;

            case 'Home':
                this.onHomeKey();
                event.preventDefault();
                break;

            case 'End':
                this.onEndKey();
                event.preventDefault();
                break;

            case 'ArrowUp':
            case 'ArrowDown':
                event.preventDefault();
                break;

            case 'Tab':
                this.onTabKey();
                break;

            default:
                break;
        }
    }

    onRightKey() {
        const indicators = find(this.itemsContainer()?.nativeElement, '[data-pc-section="thumbnailitem"]');
        const activeIndex = this.findFocusedIndicatorIndex();

        this.changedFocusedIndicator(activeIndex, activeIndex + 1 === indicators.length ? indicators.length - 1 : activeIndex + 1);
    }

    onLeftKey() {
        const activeIndex = this.findFocusedIndicatorIndex();

        this.changedFocusedIndicator(activeIndex, activeIndex - 1 <= 0 ? 0 : activeIndex - 1);
    }

    onHomeKey() {
        const activeIndex = this.findFocusedIndicatorIndex();

        this.changedFocusedIndicator(activeIndex, 0);
    }

    onEndKey() {
        const indicators = find(this.itemsContainer()?.nativeElement, '[data-pc-section="thumbnailitem"]');
        const activeIndex = this.findFocusedIndicatorIndex();

        this.changedFocusedIndicator(activeIndex, indicators.length - 1);
    }

    onTabKey() {
        const itemsContainer = this.itemsContainer();
        const indicators = <any>[...find(itemsContainer?.nativeElement, '[data-pc-section="thumbnailitem"]')];
        const highlightedIndex = indicators.findIndex((ind: any) => getAttribute(ind, 'data-p-active') === true);

        const activeIndicator = <any>findSingle(itemsContainer?.nativeElement, '[tabindex="0"]');

        const activeIndex = indicators.findIndex((ind: any) => ind === activeIndicator?.parentElement);

        indicators[activeIndex].children[0].tabIndex = '-1';
        indicators[highlightedIndex].children[0].tabIndex = '0';
    }

    findFocusedIndicatorIndex() {
        const itemsContainer = this.itemsContainer();
        const indicators = [...find(itemsContainer?.nativeElement, '[data-pc-section="thumbnailitem"]')];
        const activeIndicator = findSingle(itemsContainer?.nativeElement, '[data-pc-section="thumbnailitem"] > [tabindex="0"]');

        return indicators.findIndex((ind) => ind === activeIndicator?.parentElement);
    }

    changedFocusedIndicator(prevInd: number, nextInd: number) {
        const indicators = <any>find(this.itemsContainer()?.nativeElement, '[data-pc-section="thumbnailitem"]');

        indicators[prevInd].children[0].tabIndex = '-1';
        indicators[nextInd].children[0].tabIndex = '0';
        indicators[nextInd].children[0].focus();
    }

    step(dir: number) {
        let totalShiftedItems = this.totalShiftedItems + dir;

        if (dir < 0 && -1 * totalShiftedItems + this.d_numVisible > (<any[]>this.value()).length - 1) {
            totalShiftedItems = this.d_numVisible - (<any[]>this.value()).length;
        } else if (dir > 0 && totalShiftedItems > 0) {
            totalShiftedItems = 0;
        }

        if (this.circular()) {
            const value = this.value();
            if (dir < 0 && (<any[]>value).length - 1 === this._activeIndex) {
                totalShiftedItems = 0;
            } else if (dir > 0 && this._activeIndex === 0) {
                totalShiftedItems = this.d_numVisible - (<any[]>value).length;
            }
        }

        const itemsContainer = this.itemsContainer();
        if (itemsContainer) {
            this.document.body.setAttribute('data-p-items-hidden', 'false');
            !this.$unstyled() && removeClass(itemsContainer.nativeElement, 'p-items-hidden');
            itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / this.d_numVisible)}%, 0)` : `translate3d(${totalShiftedItems * (100 / this.d_numVisible)}%, 0, 0)`;
            itemsContainer.nativeElement.style.transition = 'transform 500ms ease 0s';
        }

        this.totalShiftedItems = totalShiftedItems;
    }

    stopTheSlideShow() {
        if (this.slideShowActive() && this.stopSlideShow) {
            this.stopSlideShow.emit();
        }
    }

    changePageOnTouch(e: TouchEvent, diff: number) {
        if (diff < 0) {
            // left
            this.navForward(e);
        } else {
            // right
            this.navBackward(e);
        }
    }

    getTotalPageNumber() {
        return (<any[]>this.value()).length > this.d_numVisible ? (<any[]>this.value()).length - this.d_numVisible + 1 : 0;
    }

    getMedianItemIndex() {
        let index = Math.floor(this.d_numVisible / 2);

        return this.d_numVisible % 2 ? index : index - 1;
    }

    onTransitionEnd() {
        const itemsContainer = this.itemsContainer();
        if (itemsContainer && itemsContainer.nativeElement) {
            this.document.body.setAttribute('data-p-items-hidden', 'true');
            !this.$unstyled() && addClass(itemsContainer.nativeElement, 'p-items-hidden');
            itemsContainer.nativeElement.style.transition = '';
        }
    }

    onTouchEnd(e: TouchEvent) {
        let touchobj = e.changedTouches[0];

        if (this.isVertical()) {
            this.changePageOnTouch(e, touchobj.pageY - (<{ x: number; y: number }>this.startPos).y);
        } else {
            this.changePageOnTouch(e, touchobj.pageX - (<{ x: number; y: number }>this.startPos).x);
        }
    }

    onTouchMove(e: TouchEvent) {
        if (e.cancelable) {
            e.preventDefault();
        }
    }

    onTouchStart(e: TouchEvent) {
        let touchobj = e.changedTouches[0];

        this.startPos = {
            x: touchobj.pageX,
            y: touchobj.pageY
        };
    }

    isNavBackwardDisabled() {
        return (!this.circular() && this._activeIndex === 0) || (<any[]>this.value()).length <= this.d_numVisible;
    }

    isNavForwardDisabled() {
        const value = this.value();
        return (!this.circular() && this._activeIndex === (<any[]>value).length - 1) || (<any[]>value).length <= this.d_numVisible;
    }

    firstItemAciveIndex() {
        return this.totalShiftedItems * -1;
    }

    lastItemActiveIndex() {
        return this.firstItemAciveIndex() + this.d_numVisible - 1;
    }

    isItemActive(index: number) {
        return this.firstItemAciveIndex() <= index && this.lastItemActiveIndex() >= index;
    }

    bindDocumentListeners() {
        if (isPlatformBrowser(this.platformId)) {
            const window = this.document.defaultView || 'window';
            this.documentResizeListener = this.renderer.listen(window, 'resize', () => {
                this.calculatePosition();
            });
        }
    }

    unbindDocumentListeners() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }

    onDestroy() {
        if (this.responsiveOptions()) {
            this.unbindDocumentListeners();
        }

        if (this.thumbnailsStyle) {
            this.thumbnailsStyle.parentNode?.removeChild(this.thumbnailsStyle);
        }
    }

    ariaPrevButtonLabel() {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.prevPageLabel : undefined;
    }

    ariaNextButtonLabel() {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.nextPageLabel : undefined;
    }

    ariaPageLabel(value: any) {
        return this.galleria.config.translation.aria ? this.galleria.config.translation.aria.pageLabel?.replace(/{page}/g, value) : undefined;
    }
}

@NgModule({
    imports: [CommonModule, SharedModule, Ripple, TimesIcon, ChevronRightIcon, ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, FocusTrap, BindModule, MotionModule],
    exports: [CommonModule, Galleria, GalleriaContent, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails, SharedModule],
    declarations: [Galleria, GalleriaContent, GalleriaItemSlot, GalleriaItem, GalleriaThumbnails]
})
export class GalleriaModule {}
