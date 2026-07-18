import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  model,
  NgModule,
  NgZone,
  numberAttribute,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  input,
  output,
  viewChild,
  contentChild,
  contentChildren
} from '@angular/core';
import { addClass, find, findSingle, getAttribute, removeClass, setAttribute, uuid } from '@primeuix/utils';
import { Footer, Header, PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import { ButtonModule, ButtonProps } from '@gravionlabs/helix/button';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from '@gravionlabs/helix/icons';
import { CarouselItemTemplateContext, CarouselPageEvent, CarouselResponsiveOptions } from '@gravionlabs/helix/types/carousel';
import { CarouselStyle } from './style/carouselstyle';

/**
 * Carousel is a content slider featuring various customization options.
 * @group Components
 */
@Component({
    selector: 'h-carousel',
    standalone: true,
    imports: [CommonModule, ChevronRightIcon, ButtonModule, ChevronLeftIcon, ChevronDownIcon, ChevronUpIcon, SharedModule, BindModule],
    templateUrl: './carousel.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [CarouselStyle, { provide: PARENT_INSTANCE, useExisting: Carousel }],
    hostDirectives: [Bind],
    host: {
        '[attr.id]': 'id',
        '[attr.role]': "'region'",
        '[class]': "cn(cx('root'), styleClass())"
    }
})
export class Carousel extends BaseComponent {
    componentName = 'Carousel';

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('root'));
    }

    /**
     * Index of the first item.
     * @defaultValue 0
     * @group Props
     */
    readonly page = model<number>(0);

    /**
     * Number of items per page.
     * @defaultValue 1
     * @group Props
     */
    readonly numVisible = model<number>(1);

    /**
     * Number of items to scroll.
     * @defaultValue 1
     * @group Props
     */
    readonly numScroll = model<number>(1);

    /**
     * An array of options for responsive design.
     * @see {CarouselResponsiveOptions}
     * @group Props
     */
    readonly responsiveOptions = input<CarouselResponsiveOptions[]>();
    /**
     * Specifies the layout of the component.
     * @group Props
     */
    readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
    /**
     * Height of the viewport in vertical layout.
     * @group Props
     */
    readonly verticalViewPortHeight = input<string>('300px');
    /**
     * Style class of main content.
     * @group Props
     */
    readonly contentClass = input<string>('');
    /**
     * Style class of the indicator items.
     * @group Props
     */
    readonly indicatorsContentClass = input<string>('');
    /**
     * Inline style of the indicator items.
     * @group Props
     */
    readonly indicatorsContentStyle = input<{
    [klass: string]: any;
} | null>();
    /**
     * Style class of the indicators.
     * @group Props
     */
    readonly indicatorStyleClass = input<string>('');
    /**
     * Style of the indicators.
     * @group Props
     */
    readonly indicatorStyle = input<{
    [klass: string]: any;
} | null>();

    /**
     * An array of objects to display.
     * @defaultValue null
     * @group Props
     */
    readonly value = input<any[]>(undefined!);

    /**
     * Defines if scrolling would be infinite.
     * @group Props
     */
    readonly circular = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether to display indicator container.
     * @group Props
     */
    readonly showIndicators = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether to display navigation buttons in container.
     * @group Props
     */
    readonly showNavigators = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Time in milliseconds to scroll items automatically.
     * @group Props
     */
    readonly autoplayInterval = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * Style class of the viewport container.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly prevButtonProps = input<ButtonProps>({
    severity: 'secondary',
    text: true,
    rounded: true
});
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly nextButtonProps = input<ButtonProps>({
    severity: 'secondary',
    text: true,
    rounded: true
});
    /**
     * Callback to invoke after scroll.
     * @param {CarouselPageEvent} event - Custom page event.
     * @group Emits
     */
    readonly onPage = output<CarouselPageEvent>();

    readonly itemsContainer = viewChild<ElementRef>('itemsContainer');

    readonly indicatorContent = viewChild<ElementRef>('indicatorContent');

    readonly headerFacet = contentChild(Header);

    readonly footerFacet = contentChild(Footer);

    _oldNumScroll: number = 0;

    prevState: any = {
        numScroll: 0,
        numVisible: 0,
        value: []
    };

    defaultNumScroll: number = 1;

    defaultNumVisible: number = 1;

    _page: number = 0;


    carouselStyle: any;

    id: string | undefined;

    totalShiftedItems;

    isRemainingItemsAdded: boolean = false;

    animationTimeout: any;

    translateTimeout: any;

    remainingItems: number = 0;

    _items: any[] | undefined;

    startPos: any;

    documentResizeListener: any;

    clonedItemsForStarting: any[] | undefined;

    clonedItemsForFinishing: any[] | undefined;

    allowAutoplay: boolean | undefined;

    interval: any;

    isCreated: boolean | undefined;

    swipeThreshold: number = 20;

    /**
     * Custom item template.
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<CarouselItemTemplateContext>>('item', { descendants: false });

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
     * Custom previous icon template.
     * @group Templates
     */
    readonly previousIconTemplate = contentChild<TemplateRef<void>>('previousicon', { descendants: false });

    /**
     * Custom next icon template.
     * @group Templates
     */
    readonly nextIconTemplate = contentChild<TemplateRef<void>>('nexticon', { descendants: false });

    _itemTemplate: TemplateRef<CarouselItemTemplateContext> | undefined;

    _headerTemplate: TemplateRef<void> | undefined;

    _footerTemplate: TemplateRef<void> | undefined;

    _previousIconTemplate: TemplateRef<void> | undefined;

    _nextIconTemplate: TemplateRef<void> | undefined;

    window: Window;

    _componentStyle = inject(CarouselStyle);

    constructor(
        public el: ElementRef,
        public zone: NgZone
    ) {
        super();
        this.totalShiftedItems = this.page() * this.numScroll() * -1;
        this.window = this.document.defaultView as Window;

        let oldPage = 0;
        effect(() => {
            const val = this.page();
            if (this.isCreated && val !== oldPage) {
                if (this.autoplayInterval()) {
                    this.stopAutoplay();
                }

                if (val > oldPage && val <= this.totalDots() - 1) {
                    this.step(-1, val);
                } else if (val < oldPage) {
                    this.step(1, val);
                }
            }
            this._page = val;
            oldPage = val;
        });
    }

    onChanges(simpleChange: SimpleChanges) {
        if (isPlatformBrowser(this.platformId)) {
            if (simpleChange.value) {
                if (this.circular() && this.value()) {
                    this.setCloneItems();
                }
            }

            if (this.isCreated) {
                const responsiveOptions = this.responsiveOptions();
                if (simpleChange.numVisible) {
                    if (responsiveOptions) {
                        this.defaultNumVisible = this.numVisible();
                    }

                    if (this.isCircular()) {
                        this.setCloneItems();
                    }

                    this.createStyle();
                    this.calculatePosition();
                }

                if (simpleChange.numScroll) {
                    if (responsiveOptions) {
                        this.defaultNumScroll = this.numScroll();
                    }
                }
            }
        }
        this.cd.markForCheck();
    }

    readonly templates = contentChildren(PrimeTemplate);

    onAfterContentInit() {
        this.id = uuid('pn_id_');
        if (isPlatformBrowser(this.platformId)) {
            this.allowAutoplay = !!this.autoplayInterval();

            if (this.circular()) {
                this.setCloneItems();
            }

            const responsiveOptions = this.responsiveOptions();
            if (responsiveOptions) {
                this.defaultNumScroll = this.numScroll();
                this.defaultNumVisible = this.numVisible();
            }

            this.createStyle();
            this.calculatePosition();

            if (responsiveOptions) {
                this.bindDocumentListeners();
            }
        }

        this.templates()?.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this._itemTemplate = item.template;
                    break;

                case 'header':
                    this._headerTemplate = item.template;
                    break;

                case 'footer':
                    this._footerTemplate = item.template;
                    break;

                case 'previousicon':
                    this._previousIconTemplate = item.template;
                    break;

                case 'nexticon':
                    this._nextIconTemplate = item.template;
                    break;

                default:
                    this._itemTemplate = item.template;
                    break;
            }
        });

        this.cd.detectChanges();
    }

    onAfterContentChecked() {
        if (isPlatformBrowser(this.platformId)) {
            const isCircular = this.isCircular();
            let totalShiftedItems = this.totalShiftedItems;

            const itemsContainer = this.itemsContainer();
            if (this.value() && itemsContainer && (this.prevState.numScroll !== this.numScroll() || this.prevState.numVisible !== this.numVisible() || this.prevState.value.length !== this.value().length)) {
                const autoplayInterval = this.autoplayInterval();
                if (autoplayInterval) {
                    this.stopAutoplay(false);
                }

                this.remainingItems = (this.value().length - this.numVisible()) % this.numScroll();

                let page = this._page;
                if (this.totalDots() !== 0 && page >= this.totalDots()) {
                    page = this.totalDots() - 1;
                    this._page = page;
                    this.onPage.emit({
                        page: this.page()
                    });
                }

                totalShiftedItems = page * this.numScroll() * -1;
                if (isCircular) {
                    totalShiftedItems -= this.numVisible();
                }

                if (page === this.totalDots() - 1 && this.remainingItems > 0) {
                    totalShiftedItems += -1 * this.remainingItems + this.numScroll();
                    this.isRemainingItemsAdded = true;
                } else {
                    this.isRemainingItemsAdded = false;
                }

                if (totalShiftedItems !== this.totalShiftedItems) {
                    this.totalShiftedItems = totalShiftedItems;
                }

                this._oldNumScroll = this.numScroll();
                this.prevState.numScroll = this.numScroll();
                this.prevState.numVisible = this.numVisible();
                this.prevState.value = [...(this.value() as any[])];

                if (this.totalDots() > 0 && itemsContainer.nativeElement) {
                    itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / this.numVisible())}%, 0)` : `translate3d(${totalShiftedItems * (100 / this.numVisible())}%, 0, 0)`;
                }

                this.isCreated = true;

                if (autoplayInterval && this.isAutoplay()) {
                    this.startAutoplay();
                }
            }

            if (isCircular) {
                if (this.page() === 0) {
                    totalShiftedItems = -1 * this.numVisible();
                } else if (totalShiftedItems === 0) {
                    totalShiftedItems = -1 * this.value().length;
                    if (this.remainingItems > 0) {
                        this.isRemainingItemsAdded = true;
                    }
                }

                if (totalShiftedItems !== this.totalShiftedItems) {
                    this.totalShiftedItems = totalShiftedItems;
                }
            }
        }
    }

    createStyle() {
        if (!this.carouselStyle) {
            this.carouselStyle = this.renderer.createElement('style');
            this.carouselStyle.type = 'text/css';
            setAttribute(this.carouselStyle, 'nonce', this.config?.csp()?.nonce);
            this.renderer.appendChild(this.document.head, this.carouselStyle);
            setAttribute(this.carouselStyle, 'nonce', this.config?.csp()?.nonce);
        }

        let innerHTML = `
            #${this.id} .p-carousel-item {
				flex: 1 0 ${100 / this.numVisible()}%
			}
        `;

        const responsiveOptions = this.responsiveOptions();
        if (responsiveOptions && !this.$unstyled()) {
            responsiveOptions.sort((data1, data2) => {
                const value1 = data1.breakpoint;
                const value2 = data2.breakpoint;
                let result: number | null = null;

                if (value1 == null && value2 != null) result = -1;
                else if (value1 != null && value2 == null) result = 1;
                else if (value1 == null && value2 == null) result = 0;
                else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2, undefined, { numeric: true });
                else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

                return -1 * result;
            });

            for (let i = 0; i < responsiveOptions.length; i++) {
                let res = responsiveOptions[i];

                innerHTML += `
                    @media screen and (max-width: ${res.breakpoint}) {
                        #${this.id} .p-carousel-item {
                            flex: 1 0 ${100 / res.numVisible}%
                        }
                    }
                `;
            }
        }

        this.carouselStyle.innerHTML = innerHTML;
    }

    calculatePosition() {
        const responsiveOptions = this.responsiveOptions();
        if (responsiveOptions) {
            let matchedResponsiveData = {
                numVisible: this.defaultNumVisible,
                numScroll: this.defaultNumScroll
            };

            if (typeof window !== 'undefined') {
                let windowWidth = window.innerWidth;
                for (let i = 0; i < responsiveOptions.length; i++) {
                    let res = responsiveOptions[i];

                    if (parseInt(res.breakpoint, 10) >= windowWidth) {
                        matchedResponsiveData = res;
                    }
                }
            }

            if (this.numScroll() !== matchedResponsiveData.numScroll) {
                let page = this._page;
                page = Math.floor((page * this.numScroll()) / matchedResponsiveData.numScroll);

                let totalShiftedItems = matchedResponsiveData.numScroll * this.page() * -1;

                if (this.isCircular()) {
                    totalShiftedItems -= matchedResponsiveData.numVisible;
                }

                this.totalShiftedItems = totalShiftedItems;
                this.numScroll.set(matchedResponsiveData.numScroll);

                this._page = page;
                this.onPage.emit({
                    page: this.page()
                });
            }

            if (this.numVisible() !== matchedResponsiveData.numVisible) {
                this.numVisible.set(matchedResponsiveData.numVisible);
                this.setCloneItems();
            }

            this.cd.markForCheck();
        }
    }

    setCloneItems() {
        this.clonedItemsForStarting = [];
        this.clonedItemsForFinishing = [];
        if (this.isCircular()) {
            this.clonedItemsForStarting.push(...this.value().slice(-1 * this.numVisible()));
            this.clonedItemsForFinishing.push(...this.value().slice(0, this.numVisible()));
        }
    }

    firstIndex() {
        return this.isCircular() ? -1 * (this.totalShiftedItems + this.numVisible()) : this.totalShiftedItems * -1;
    }

    lastIndex() {
        return this.firstIndex() + this.numVisible() - 1;
    }

    totalDots() {
        return this.value()?.length ? Math.ceil((this.value().length - this.numVisible()) / this.numScroll()) + 1 : 0;
    }

    totalDotsArray() {
        const totalDots = this.totalDots();
        return totalDots <= 0 ? [] : Array(totalDots).fill(0);
    }

    isVertical() {
        return this.orientation() === 'vertical';
    }

    isCircular() {
        return this.circular() && this.value() && this.value().length >= this.numVisible();
    }

    isAutoplay() {
        return this.autoplayInterval() && this.allowAutoplay;
    }

    isForwardNavDisabled() {
        return this.isEmpty() || (this._page >= this.totalDots() - 1 && !this.isCircular());
    }

    isBackwardNavDisabled() {
        return this.isEmpty() || (this._page <= 0 && !this.isCircular());
    }

    isEmpty() {
        return !this.value() || this.value().length === 0;
    }

    navForward(e: MouseEvent | TouchEvent, index?: number) {
        if (this.isCircular() || this._page < this.totalDots() - 1) {
            this.step(-1, index);
        }

        if (this.autoplayInterval()) {
            this.stopAutoplay();
        }

        if (e && e.cancelable) {
            e.preventDefault();
        }
    }

    navBackward(e: MouseEvent | TouchEvent, index?: number) {
        if (this.isCircular() || this._page !== 0) {
            this.step(1, index);
        }

        if (this.autoplayInterval()) {
            this.stopAutoplay();
        }

        if (e && e.cancelable) {
            e.preventDefault();
        }
    }

    onDotClick(e: MouseEvent, index: number) {
        let page = this._page;

        if (this.autoplayInterval()) {
            this.stopAutoplay();
        }

        if (index > page) {
            this.navForward(e, index);
        } else if (index < page) {
            this.navBackward(e, index);
        }
    }

    onIndicatorKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowRight':
                this.onRightKey();
                break;

            case 'ArrowLeft':
                this.onLeftKey();
                break;
        }
    }

    onRightKey() {
        const indicators = [...find(this.indicatorContent()?.nativeElement, '[data-pc-section="indicator"]')];
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
        const indicators = [...find(this.indicatorContent()?.nativeElement, '[data-pc-section="indicator"]')];
        const activeIndex = this.findFocusedIndicatorIndex();

        this.changedFocusedIndicator(activeIndex, indicators.length - 1);
    }

    onTabKey() {
        const indicatorContent = this.indicatorContent();
        const indicators = <any>[...find(indicatorContent?.nativeElement, '[data-pc-section="indicator"]')];
        const highlightedIndex = indicators.findIndex((ind) => getAttribute(ind, 'data-p-highlight') === true);

        const activeIndicator = <any>findSingle(indicatorContent?.nativeElement, '[data-pc-section="indicator"] > button[tabindex="0"]');
        const activeIndex = indicators.findIndex((ind) => ind === activeIndicator.parentElement);

        indicators[activeIndex].children[0].tabIndex = '-1';
        indicators[highlightedIndex].children[0].tabIndex = '0';
    }

    findFocusedIndicatorIndex() {
        const indicatorContent = this.indicatorContent();
        const indicators = [...find(indicatorContent?.nativeElement, '[data-pc-section="indicator"]')];
        const activeIndicator = findSingle(indicatorContent?.nativeElement, '[data-pc-section="indicator"] > button[tabindex="0"]');

        return indicators.findIndex((ind) => ind === activeIndicator?.parentElement);
    }

    changedFocusedIndicator(prevInd, nextInd) {
        const indicators = <any>[...find(this.indicatorContent()?.nativeElement, '[data-pc-section="indicator"]')];

        indicators[prevInd].children[0].tabIndex = '-1';
        indicators[nextInd].children[0].tabIndex = '0';
        indicators[nextInd].children[0].focus();
    }

    step(dir: number, page?: number) {
        let totalShiftedItems = this.totalShiftedItems;
        const isCircular = this.isCircular();

        if (page != null) {
            totalShiftedItems = this.numScroll() * page * -1;

            if (isCircular) {
                totalShiftedItems -= this.numVisible();
            }

            this.isRemainingItemsAdded = false;
        } else {
            totalShiftedItems += this.numScroll() * dir;
            if (this.isRemainingItemsAdded) {
                totalShiftedItems += this.remainingItems - this.numScroll() * dir;
                this.isRemainingItemsAdded = false;
            }

            let originalShiftedItems = isCircular ? totalShiftedItems + this.numVisible() : totalShiftedItems;
            page = Math.abs(Math.floor(originalShiftedItems / this.numScroll()));
        }

        if (isCircular && this.page() === this.totalDots() - 1 && dir === -1) {
            totalShiftedItems = -1 * (this.value().length + this.numVisible());
            page = 0;
        } else if (isCircular && this.page() === 0 && dir === 1) {
            totalShiftedItems = 0;
            page = this.totalDots() - 1;
        } else if (page === this.totalDots() - 1 && this.remainingItems > 0) {
            totalShiftedItems += this.remainingItems * -1 - this.numScroll() * dir;
            this.isRemainingItemsAdded = true;
        }

        const itemsContainer = this.itemsContainer();
        if (itemsContainer) {
            !this.$unstyled() && removeClass(itemsContainer.nativeElement, 'p-items-hidden');
            itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${totalShiftedItems * (100 / this.numVisible())}%, 0)` : `translate3d(${totalShiftedItems * (100 / this.numVisible())}%, 0, 0)`;
            itemsContainer.nativeElement.style.transition = 'transform 500ms ease 0s';
        }

        this.totalShiftedItems = totalShiftedItems;
        this._page = page;
        this.onPage.emit({
            page: this.page()
        });
        this.cd.markForCheck();
    }

    startAutoplay() {
        this.interval = setInterval(() => {
            if (this.totalDots() > 0) {
                if (this.page() === this.totalDots() - 1) {
                    this.step(-1, 0);
                } else {
                    this.step(-1, this.page() + 1);
                }
            }
        }, this.autoplayInterval());
        this.allowAutoplay = true;
        this.cd.markForCheck();
    }

    stopAutoplay(changeAllow: boolean = true) {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
            if (changeAllow) {
                this.allowAutoplay = false;
            }
        }
        this.cd.markForCheck();
    }

    isPlaying(): boolean {
        return !!this.interval;
    }

    onTransitionEnd() {
        const itemsContainer = this.itemsContainer();
        if (itemsContainer) {
            !this.$unstyled() && addClass(itemsContainer.nativeElement, 'p-items-hidden');
            itemsContainer.nativeElement.style.transition = '';

            if ((this.page() === 0 || this.page() === this.totalDots() - 1) && this.isCircular()) {
                itemsContainer.nativeElement.style.transform = this.isVertical() ? `translate3d(0, ${this.totalShiftedItems * (100 / this.numVisible())}%, 0)` : `translate3d(${this.totalShiftedItems * (100 / this.numVisible())}%, 0, 0)`;
            }
        }
    }

    onTouchStart(e: TouchEvent) {
        let touchobj = e.changedTouches[0];

        this.startPos = {
            x: touchobj.pageX,
            y: touchobj.pageY
        };
    }

    onTouchMove(e: TouchEvent | MouseEvent) {
        if (e.cancelable) {
            e.preventDefault();
        }
    }

    onTouchEnd(e: TouchEvent) {
        let touchobj = e.changedTouches[0];

        if (this.isVertical()) {
            this.changePageOnTouch(e, touchobj.pageY - this.startPos.y);
        } else {
            this.changePageOnTouch(e, touchobj.pageX - this.startPos.x);
        }
    }

    changePageOnTouch(e: TouchEvent | MouseEvent, diff: number) {
        if (Math.abs(diff) > this.swipeThreshold) {
            if (diff < 0) {
                this.navForward(e);
            } else {
                this.navBackward(e);
            }
        }
    }

    ariaPrevButtonLabel() {
        return this.config.translation.aria ? this.config.translation.aria?.prevPageLabel : undefined;
    }

    ariaSlideLabel() {
        return this.config.translation.aria ? this.config.translation.aria?.slide : undefined;
    }

    ariaNextButtonLabel() {
        return this.config.translation.aria ? this.config.translation.aria?.nextPageLabel : undefined;
    }

    ariaSlideNumber(value) {
        return this.config.translation.aria ? this.config.translation.aria?.slideNumber?.replace(/{slideNumber}/g, value) : undefined;
    }

    ariaPageLabel(value) {
        return this.config.translation.aria ? this.config.translation.aria?.pageLabel?.replace(/{page}/g, value) : undefined;
    }

    getIndicatorPTOptions(key: string, index: number) {
        return this.ptm(key, {
            context: {
                highlighted: index === this._page
            }
        });
    }

    getItemPTOptions(key: string, index: number) {
        return this.ptm(key, {
            context: {
                index,
                active: this.firstIndex() <= index && this.lastIndex() >= index,
                start: this.firstIndex() === index,
                end: this.lastIndex() === index
            }
        });
    }

    bindDocumentListeners() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentResizeListener) {
                this.documentResizeListener = this.renderer.listen(this.window, 'resize', (event) => {
                    this.calculatePosition();
                });
            }
        }
    }

    unbindDocumentListeners() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.documentResizeListener) {
                this.documentResizeListener();
                this.documentResizeListener = null;
            }
        }
    }

    onDestroy() {
        if (this.responsiveOptions()) {
            this.unbindDocumentListeners();
        }
        if (this.autoplayInterval()) {
            this.stopAutoplay();
        }
    }
}

@NgModule({
    imports: [Carousel, SharedModule],
    exports: [Carousel, SharedModule]
})
export class CarouselModule {}
