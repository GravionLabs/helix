import { CommonModule, isPlatformBrowser } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, ElementRef, inject, InjectionToken, Input, NgModule, numberAttribute, signal, TemplateRef, ViewEncapsulation, input, output, viewChild, contentChild, contentChildren, computed, model, effect, untracked } from '@angular/core';
import { RouterModule } from '@angular/router';
import { find, findSingle, focus, hasClass, uuid } from '@primeuix/utils';
import { MenuItem, PrimeTemplate, SharedModule, TooltipOptions } from '@gravionlabs/helix/api';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { ButtonModule, ButtonProps } from '@gravionlabs/helix/button';
import { PlusIcon } from '@gravionlabs/helix/icons';
import { Ripple } from '@gravionlabs/helix/ripple';
import { TooltipModule } from '@gravionlabs/helix/tooltip';
import { SpeedDialButtonTemplateContext, SpeedDialItemTemplateContext, SpeedDialPassThrough } from '@gravionlabs/helix/types/speeddial';
import { asapScheduler } from 'rxjs';
import { SpeedDialStyle } from './style/speeddialstyle';

const SPEED_DIAL_INSTANCE = new InjectionToken<SpeedDial>('SPEED_DIAL_INSTANCE');

/**
 * When pressed, a floating action button can display multiple primary actions that can be performed on a page.
 * @group Components
 */
@Component({
    selector: 'h-speeddial, h-speedDial, h-speed-dial',
    standalone: true,
    imports: [CommonModule, ButtonModule, Ripple, TooltipModule, RouterModule, PlusIcon, SharedModule, Bind],
    templateUrl: './speeddial.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [SpeedDialStyle, { provide: SPEED_DIAL_INSTANCE, useExisting: SpeedDial }, { provide: PARENT_INSTANCE, useExisting: SpeedDial }],
    hostDirectives: [Bind]
})
export class SpeedDial extends BaseComponent<SpeedDialPassThrough> {
    componentName = 'SpeedDial';
    $pcSpeedDial: SpeedDial | undefined = inject(SPEED_DIAL_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('host'));
    }

    /**
     * List of items id.
     * @group Props
     */
    readonly id = input<string>();

    private readonly autoId = uuid('pn_id_');

    readonly $id = computed(() => this.id() || this.autoId);
    /**
     * MenuModel instance to define the action items.
     * @group Props
     */
    readonly model = input<MenuItem[] | null>(null);
    /**
     * Specifies the visibility of the overlay.
     * @defaultValue false
     * @group Props
     */
    readonly visible = model<boolean>(false);
    /**
     * Inline style of the element.
     * @group Props
     */
    readonly style = input<{
    [klass: string]: any;
} | null>();
    /**
     * Style class of the element.
     * @group Props
     */
    readonly className = input<string>();
    /**
     * Specifies the opening direction of actions.
     * @gruop Props
     */
    readonly direction = input<'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right' | undefined>('up');
    /**
     * Transition delay step for each action item.
     * @group Props
     */
    readonly transitionDelay = input<number, unknown>(30, { transform: numberAttribute });
    /**
     * Specifies the opening type of actions.
     * @group Props
     */
    readonly type = input<'linear' | 'circle' | 'semi-circle' | 'quarter-circle' | undefined>('linear');
    /**
     * Radius for *circle types.
     * @group Props
     */
    readonly radius = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * Whether to show a mask element behind the speeddial.
     * @group Props
     */
    readonly mask = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the component is disabled.
     * @group Props
     */
    readonly disabled = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the actions close when clicked outside.
     * @group Props
     */
    readonly hideOnClickOutside = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Inline style of the button element.
     * @group Props
     */
    readonly buttonStyle = input<{
    [klass: string]: any;
} | null>();
    /**
     * Style class of the button element.
     * @group Props
     */
    readonly buttonClassName = input<string>();
    /**
     * Inline style of the mask element.
     * @group Props
     */
    readonly maskStyle = input<{
    [klass: string]: any;
} | null>();
    /**
     * Style class of the mask element.
     * @group Props
     */
    readonly maskClassName = input<string>();
    /**
     * Show icon of the button element.
     * @group Props
     */
    readonly showIcon = input<string>();
    /**
     * Hide icon of the button element.
     * @group Props
     */
    readonly hideIcon = input<string>();
    /**
     * Defined to rotate showIcon when hideIcon is not present.
     * @group Props
     */
    readonly rotateAnimation = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Defines a string value that labels an interactive element.
     * @group Props
     */
    readonly ariaLabel = input<string>();
    /**
     * Identifier of the underlying input element.
     * @group Props
     */
    readonly ariaLabelledBy = input<string>();
    /**
     * Whether to display the tooltip on items. The modifiers of Tooltip can be used like an object in it. Valid keys are 'event' and 'position'.
     * @group Props
     */
    readonly tooltipOptions = input<TooltipOptions>(undefined!);
    /**
     * Used to pass all properties of the ButtonProps to the Button component.
     * @group Props
     */
    readonly buttonProps = input<ButtonProps>(undefined!);
    /**
     * Fired when the visibility of element changed.
     * @param {boolean} boolean - Visibility value.
     * @group Emits
     */
    readonly onVisibleChange = output<boolean>();
    /**
     * Fired when the button element clicked.
     * @param {MouseEvent} event - Mouse event.
     * @group Emits
     */
    readonly onClick = output<MouseEvent>();
    /**
     * Fired when the actions are visible.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onShow = output<Event | undefined>();
    /**
     * Fired when the actions are hidden.
     * @param {Event} event - Browser event.
     * @group Emits
     */
    readonly onHide = output<Event | undefined>();

    readonly container = viewChild<ElementRef>('container');

    readonly list = viewChild<ElementRef>('list');
    /**
     * Custom button template.
     * @param {SpeedDialButtonTemplateContext} context - button context.
     * @see {@link SpeedDialButtonTemplateContext}
     * @group Templates
     */
    readonly buttonTemplate = contentChild<TemplateRef<SpeedDialButtonTemplateContext>>('button', { descendants: false });
    /**
     * Custom item template.
     * @param {SpeedDialItemTemplateContext} context - item context.
     * @see {@link SpeedDialItemTemplateContext}
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<SpeedDialItemTemplateContext>>('item', { descendants: false });
    /**
     * Custom icon template.
     * @group Templates
     */
    readonly iconTemplate = contentChild<TemplateRef<void>>('icon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    _buttonTemplate: TemplateRef<SpeedDialButtonTemplateContext> | undefined;

    _itemTemplate: TemplateRef<SpeedDialItemTemplateContext> | undefined;

    _iconTemplate: TemplateRef<void> | undefined;

    isItemClicked: boolean = false;


    documentClickListener: any;

    focusedOptionIndex = signal<any>(null);

    focused: boolean = false;

    _componentStyle = inject(SpeedDialStyle);

    constructor() {
        super();
        effect(() => {
            if (this.visible()) {
                untracked(() => this.bindDocumentClickListener());
            } else {
                untracked(() => this.unbindDocumentClickListener());
            }
        });
    }

    get focusedOptionId() {
        return this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : null;
    }

    getTooltipOptions(item: MenuItem) {
        return { ...this.tooltipOptions(), tooltipLabel: item.label, disabled: !this.tooltipOptions() };
    }

    getPTOptions(id: string, key: string) {
        return this.ptm(key, {
            context: {
                active: this.isItemActive(id),
                hidden: !this.visible()
            }
        });
    }

    isItemActive(id: string) {
        return id === this.focusedOptionId;
    }

    onInit() {
    }

    onAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.type() !== 'linear') {
                const button = <any>findSingle(this.container()?.nativeElement, '[data-pc-name="pcbutton"]');
                const list = this.list();
                const firstItem = <any>findSingle(list?.nativeElement, '[data-pc-section="item"]');

                if (button && firstItem) {
                    const wDiff = Math.abs(button.offsetWidth - firstItem.offsetWidth);
                    const hDiff = Math.abs(button.offsetHeight - firstItem.offsetHeight);
                    list?.nativeElement.style.setProperty('--item-diff-x', `${wDiff / 2}px`);
                    list?.nativeElement.style.setProperty('--item-diff-y', `${hDiff / 2}px`);
                }
            }
        }
    }

    onAfterContentInit() {
        this.templates()?.forEach((item) => {
            switch (item.getType()) {
                case 'button':
                    this._buttonTemplate = item.template;
                    break;
                case 'item':
                    this._itemTemplate = item.template;
                    break;
                case 'icon':
                    this._iconTemplate = item.template;
                    break;
            }
        });
    }

    show() {
        this.onVisibleChange.emit(true);
        this.visibleChange.emit(true);
        this.visible() = true;
        this.onShow.emit();
        this.bindDocumentClickListener();
        this.cd.markForCheck();
    }

    hide() {
        this.onVisibleChange.emit(false);
        this.visibleChange.emit(false);
        this.visible() = false;
        this.onHide.emit();
        this.unbindDocumentClickListener();
        this.cd.markForCheck();
    }

    onButtonClick(event: MouseEvent) {
        this.visible() ? this.hide() : this.show();
        this.onClick.emit(event);
        this.isItemClicked = true;
    }

    onItemClick(e: Event, item: MenuItem) {
        if (item.command) {
            item.command({ originalEvent: e, item });
        }

        this.hide();

        this.isItemClicked = true;
    }

    onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDown(event);
                break;

            case 'ArrowUp':
                this.onArrowUp(event);
                break;

            case 'ArrowLeft':
                this.onArrowLeft(event);
                break;

            case 'ArrowRight':
                this.onArrowRight(event);
                break;

            case 'Enter':
            case 'Space':
                this.onEnterKey(event);
                break;

            case 'Escape':
                this.onEscapeKey(event);
                break;

            case 'Home':
                this.onHomeKey(event);
                break;

            case 'End':
                this.onEndKey(event);
                break;

            default:
                break;
        }
    }

    onFocus(event) {
        this.focused = true;
    }

    onBlur(event) {
        this.focused = false;
        asapScheduler.schedule(() => this.focusedOptionIndex.set(-1));
    }

    onArrowUp(event) {
        const direction = this.direction();
        if (direction === 'up') {
            this.navigateNextItem(event);
        } else if (direction === 'down') {
            this.navigatePrevItem(event);
        } else {
            this.navigateNextItem(event);
        }
    }

    onArrowDown(event) {
        const direction = this.direction();
        if (direction === 'up') {
            this.navigatePrevItem(event);
        } else if (direction === 'down') {
            this.navigateNextItem(event);
        } else {
            this.navigatePrevItem(event);
        }
    }

    onArrowLeft(event) {
        const leftValidDirections = ['left', 'up-right', 'down-left'];
        const rightValidDirections = ['right', 'up-left', 'down-right'];

        const direction = this.direction();
        if (leftValidDirections.includes(direction || '')) {
            this.navigateNextItem(event);
        } else if (rightValidDirections.includes(direction || '')) {
            this.navigatePrevItem(event);
        } else {
            this.navigatePrevItem(event);
        }
    }

    onArrowRight(event) {
        const leftValidDirections = ['left', 'up-right', 'down-left'];
        const rightValidDirections = ['right', 'up-left', 'down-right'];

        const direction = this.direction();
        if (leftValidDirections.includes(direction || '')) {
            this.navigatePrevItem(event);
        } else if (rightValidDirections.includes(direction || '')) {
            this.navigateNextItem(event);
        } else {
            this.navigateNextItem(event);
        }
    }

    onEndKey(event: any) {
        event.preventDefault();

        this.focusedOptionIndex.set(-1);
        this.navigatePrevItem(event);
    }

    onHomeKey(event: any) {
        event.preventDefault();

        this.focusedOptionIndex.set(-1);
        this.navigateNextItem(event);
    }

    onEnterKey(event: any) {
        const container = this.container();
        const items = find(container?.nativeElement, '[data-pc-section="item"]');
        const itemIndex = [...items].findIndex((item) => item.id === this.focusedOptionIndex());

        const model = this.model();
        if (itemIndex !== -1 && model && model[itemIndex]) {
            this.onItemClick(event, model[itemIndex]);
        }
        this.onBlur(event);

        const buttonEl = <any>findSingle(container?.nativeElement, 'button');

        buttonEl && focus(buttonEl);
    }

    onEscapeKey(event: KeyboardEvent) {
        this.hide();

        const buttonEl = <any>findSingle(this.container()?.nativeElement, 'button');

        buttonEl && focus(buttonEl);
    }

    onTogglerKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowDown':
            case 'ArrowLeft':
                this.onTogglerArrowDown(event);

                break;

            case 'ArrowUp':
            case 'ArrowRight':
                this.onTogglerArrowUp(event);

                break;

            case 'Escape':
                this.onEscapeKey(event);

                break;

            default:
                break;
        }
    }

    onTogglerArrowUp(event) {
        this.focused = true;
        focus(this.list()?.nativeElement);

        this.show();
        this.navigatePrevItem(event);

        event.preventDefault();
    }

    onTogglerArrowDown(event) {
        this.focused = true;
        focus(this.list()?.nativeElement);

        this.show();
        this.navigateNextItem(event);

        event.preventDefault();
    }

    navigateNextItem(event) {
        const optionIndex = this.findNextOptionIndex(this.focusedOptionIndex());

        this.changeFocusedOptionIndex(optionIndex);

        event.preventDefault();
    }

    navigatePrevItem(event) {
        const optionIndex = this.findPrevOptionIndex(this.focusedOptionIndex());

        this.changeFocusedOptionIndex(optionIndex);

        event.preventDefault();
    }

    findPrevOptionIndex(index) {
        const items = find(this.container()?.nativeElement, '[data-pc-section="item"]');

        const filteredItems = [...items].filter((item) => !hasClass(findSingle(item, 'a')!, 'p-disabled'));
        const newIndex = index === -1 ? filteredItems[filteredItems.length - 1].id : index;
        let matchedOptionIndex = filteredItems.findIndex((link) => link.getAttribute('id') === newIndex);

        matchedOptionIndex = index === -1 ? filteredItems.length - 1 : matchedOptionIndex - 1;

        return matchedOptionIndex;
    }

    findNextOptionIndex(index) {
        const items = find(this.container()?.nativeElement, '[data-pc-section="item"]');
        const filteredItems = [...items].filter((item) => !hasClass(findSingle(item, 'a')!, 'p-disabled'));
        const newIndex = index === -1 ? filteredItems[0].id : index;
        let matchedOptionIndex = filteredItems.findIndex((link) => link.getAttribute('id') === newIndex);

        matchedOptionIndex = index === -1 ? 0 : matchedOptionIndex + 1;

        return matchedOptionIndex;
    }

    changeFocusedOptionIndex(index) {
        const items = find(this.container()?.nativeElement, '[data-pc-section="item"]');
        const filteredItems = [...items].filter((item) => !hasClass(findSingle(item, 'a')!, 'p-disabled'));

        if (filteredItems[index]) {
            this.focusedOptionIndex.set(filteredItems[index].getAttribute('id'));
        }
    }

    calculatePointStyle(index: number) {
        const type = this.type();

        if (type !== 'linear') {
            const length = (this.model() as MenuItem[]).length;
            const radius = this.radius() || length * 20;

            if (type === 'circle') {
                const step = (2 * Math.PI) / length;

                return {
                    left: `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`,
                    top: `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`
                };
            } else if (type === 'semi-circle') {
                const direction = this.direction();
                const step = Math.PI / (length - 1);
                const x = `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`;
                const y = `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`;
                if (direction === 'up') {
                    return { left: x, bottom: y };
                } else if (direction === 'down') {
                    return { left: x, top: y };
                } else if (direction === 'left') {
                    return { right: y, top: x };
                } else if (direction === 'right') {
                    return { left: y, top: x };
                }
            } else if (type === 'quarter-circle') {
                const direction = this.direction();
                const step = Math.PI / (2 * (length - 1));
                const x = `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`;
                const y = `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`;
                if (direction === 'up-left') {
                    return { right: x, bottom: y };
                } else if (direction === 'up-right') {
                    return { left: x, bottom: y };
                } else if (direction === 'down-left') {
                    return { right: y, top: x };
                } else if (direction === 'down-right') {
                    return { left: y, top: x };
                }
            }
        }

        return {};
    }

    calculateTransitionDelay(index: number) {
        const length = (this.model() as MenuItem[]).length;

        return (this.visible() ? index : length - index - 1) * this.transitionDelay();
    }

    get buttonIconClass() {
        const showIcon = this.showIcon();
        if (!this.visible() && showIcon) {
            return showIcon;
        }
        const hideIcon = this.hideIcon();
        if (this.visible() && hideIcon) {
            return hideIcon;
        }
        return showIcon;
    }

    getItemStyle(index: number) {
        const transitionDelay = this.calculateTransitionDelay(index);
        const pointStyle = this.calculatePointStyle(index);
        return {
            transitionDelay: `${transitionDelay}ms`,
            ...pointStyle
        };
    }

    isClickableRouterLink(item: MenuItem) {
        return item.routerLink && !this.disabled() && !item.disabled;
    }

    isOutsideClicked(event: Event) {
        const container = this.container();
        return container && !(container.nativeElement.isSameNode(event.target) || container.nativeElement.contains(event.target) || this.isItemClicked);
    }

    bindDocumentClickListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.documentClickListener && this.hideOnClickOutside()) {
                this.documentClickListener = this.renderer.listen(this.document, 'click', (event) => {
                    if (this.visible() && this.isOutsideClicked(event)) {
                        this.hide();
                    }

                    this.isItemClicked = false;
                });
            }
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }

    onDestroy() {
        this.unbindDocumentClickListener();
    }
}

@NgModule({
    imports: [SpeedDial, SharedModule],
    exports: [SpeedDial, SharedModule]
})
export class SpeedDialModule {}
