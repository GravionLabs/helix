import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ContentChild, effect, ElementRef, forwardRef, inject, InjectionToken, signal, TemplateRef, ViewEncapsulation, contentChildren, viewChild } from '@angular/core';
import { findSingle, getOffset, getOuterWidth, getWidth, isRTL } from '@primeuix/utils';
import { PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import { ChevronLeftIcon, ChevronRightIcon } from '@gravionlabs/helix/icons';
import { RippleModule } from '@gravionlabs/helix/ripple';
import { TabListStyle } from './style/tabliststyle';
import { Tabs } from './tabs';
import { TabListPassThrough } from '@gravionlabs/helix/types/tabs';

const TABLIST_INSTANCE = new InjectionToken<TabList>('TABLIST_INSTANCE');

/**
 * TabList is a helper component for Tabs component.
 * @group Components
 */
@Component({
    selector: 'h-tablist',
    standalone: true,
    imports: [CommonModule, ChevronLeftIcon, ChevronRightIcon, RippleModule, SharedModule, BindModule],
    templateUrl: './tablist.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': 'cx("root")'
    },
    providers: [TabListStyle, { provide: TABLIST_INSTANCE, useExisting: TabList }, { provide: PARENT_INSTANCE, useExisting: TabList }],
    hostDirectives: [Bind]
})
export class TabList extends BaseComponent<TabListPassThrough> {
    componentName = 'TabList';

    $pcTabList: TabList | undefined = inject(TABLIST_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });
    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * A template reference variable that represents the previous icon in a UI component.
     * @type {TemplateRef<any> | undefined}
     * @group Templates
     */
    @ContentChild('previcon', { descendants: false }) prevIconTemplate: TemplateRef<any> | undefined;
    /**
     * A template reference variable that represents the next icon in a UI component.
     * @type {TemplateRef<any> | undefined}
     * @group Templates
     */
    @ContentChild('nexticon', { descendants: false }) nextIconTemplate: TemplateRef<any> | undefined;

    readonly templates = contentChildren(PrimeTemplate);

    readonly content = viewChild.required<ElementRef<HTMLDivElement>>('content');

    readonly prevButton = viewChild.required<ElementRef<HTMLButtonElement>>('prevButton');

    readonly nextButton = viewChild.required<ElementRef<HTMLButtonElement>>('nextButton');

    readonly inkbar = viewChild.required<ElementRef<HTMLSpanElement>>('inkbar');

    readonly tabs = viewChild.required<ElementRef<HTMLDivElement>>('tabs');

    pcTabs = inject(forwardRef(() => Tabs));

    isPrevButtonEnabled = signal<boolean>(false);

    isNextButtonEnabled = signal<boolean>(false);

    resizeObserver!: ResizeObserver;

    showNavigators = computed(() => this.pcTabs.showNavigators());

    tabindex = computed(() => this.pcTabs.tabindex());

    scrollable = computed(() => this.pcTabs.scrollable());

    _componentStyle = inject(TabListStyle);

    constructor() {
        super();
        effect(() => {
            this.pcTabs.value();
            if (isPlatformBrowser(this.platformId)) {
                setTimeout(() => {
                    this.updateInkBar();
                });
            }
        });
    }

    get prevButtonAriaLabel() {
        return this.config?.translation?.aria?.previous;
    }

    get nextButtonAriaLabel() {
        return this.config?.translation?.aria?.next;
    }

    onAfterViewInit() {
        if (this.showNavigators() && isPlatformBrowser(this.platformId)) {
            this.updateButtonState();
            this.bindResizeObserver();
        }
    }

    _prevIconTemplate: TemplateRef<any> | undefined;

    _nextIconTemplate: TemplateRef<any> | undefined;

    onAfterContentInit() {
        this.templates()?.forEach((t) => {
            switch (t.getType()) {
                case 'previcon':
                    this._prevIconTemplate = t.template;
                    break;
                case 'nexticon':
                    this._nextIconTemplate = t.template;
                    break;
            }
        });
    }

    onDestroy() {
        this.unbindResizeObserver();
    }

    onScroll(event: Event) {
        this.showNavigators() && this.updateButtonState();

        event.preventDefault();
    }

    onPrevButtonClick() {
        const _content = this.content().nativeElement;
        const width = getWidth(_content);
        const pos = Math.abs(_content.scrollLeft) - width;
        const scrollLeft = pos <= 0 ? 0 : pos;

        _content.scrollLeft = isRTL(_content) ? -1 * scrollLeft : scrollLeft;
    }

    onNextButtonClick() {
        const _content = this.content().nativeElement;
        const width = getWidth(_content) - this.getVisibleButtonWidths();
        const pos = _content.scrollLeft + width;
        const lastPos = _content.scrollWidth - width;
        const scrollLeft = pos >= lastPos ? lastPos : pos;

        _content.scrollLeft = isRTL(_content) ? -1 * scrollLeft : scrollLeft;
    }

    updateButtonState() {
        const _content = this.content()?.nativeElement;
        const _list = this.el?.nativeElement;

        const { scrollWidth, offsetWidth } = _content;
        const scrollLeft = Math.abs(_content.scrollLeft);
        const width = getWidth(_content);

        this.isPrevButtonEnabled.set(scrollLeft !== 0);
        this.isNextButtonEnabled.set(_list.offsetWidth >= offsetWidth && Math.abs(scrollLeft - scrollWidth + width) > 1);
    }

    updateInkBar() {
        const _content = this.content()?.nativeElement;
        const _inkbar = this.inkbar()?.nativeElement;
        const _tabs = this.tabs()?.nativeElement;

        const activeTab = findSingle(_content, '[data-pc-name="tab"][data-p-active="true"]');
        if (_inkbar) {
            _inkbar.style.width = getOuterWidth(activeTab) + 'px';
            _inkbar.style.left = <any>getOffset(activeTab).left - <any>getOffset(_tabs).left + 'px';
        }
    }

    getVisibleButtonWidths() {
        const _prevBtn = this.prevButton()?.nativeElement;
        const _nextBtn = this.nextButton()?.nativeElement;

        return [_prevBtn, _nextBtn].reduce((acc, el) => (el ? acc + getWidth(el) : acc), 0);
    }

    bindResizeObserver() {
        this.resizeObserver = new ResizeObserver(() => this.updateButtonState());
        this.resizeObserver.observe(this.el.nativeElement);
    }

    unbindResizeObserver() {
        if (this.resizeObserver) {
            this.resizeObserver.unobserve(this.el.nativeElement);
            this.resizeObserver = null!;
        }
    }
}
