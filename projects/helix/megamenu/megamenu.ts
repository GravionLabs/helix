import { CommonModule, isPlatformBrowser } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, effect, ElementRef, forwardRef, inject, InjectionToken, NgModule, numberAttribute, signal, TemplateRef, ViewEncapsulation, input, output, contentChild, contentChildren, viewChild, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { findLastIndex, findSingle, focus, isEmpty, isNotEmpty, isPrintableCharacter, isTouchDevice, resolve, uuid } from '@primeuix/utils';
import { MegaMenuItem, PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { BadgeModule } from '@gravionlabs/helix/badge';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { AngleDownIcon, AngleRightIcon, BarsIcon } from '@gravionlabs/helix/icons';
import { Ripple } from '@gravionlabs/helix/ripple';
import { TooltipModule } from '@gravionlabs/helix/tooltip';
import { VoidListener } from '@gravionlabs/helix/ts-helpers';
import { MegaMenuItemTemplateContext, MegaMenuPassThrough } from '@gravionlabs/helix/types/megamenu';
import { ZIndexUtils } from '@gravionlabs/helix/utils';
import { MegaMenuStyle } from './style/megamenustyle';

const MEGAMENU_INSTANCE = new InjectionToken<MegaMenu>('MEGAMENU_INSTANCE');
const MEGAMENU_SUB_INSTANCE = new InjectionToken<MegaMenuSub>('MEGAMENU_SUB_INSTANCE');

@Component({
    selector: 'h-megaMenuSub, h-megamenu-sub, ul[hMegaMenuSub]',
    standalone: true,
    imports: [CommonModule, RouterModule, Ripple, TooltipModule, AngleDownIcon, AngleRightIcon, BadgeModule, SharedModule, Bind],
    templateUrl: './megamenusub.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: MEGAMENU_SUB_INSTANCE, useExisting: MegaMenuSub },
        { provide: PARENT_INSTANCE, useExisting: MegaMenuSub }
    ],
    host: {
        '[class]': 'root() ? cx("rootList") : cx("submenu")',
        '[style]': 'sx("rootList")',
        '[style.display]': 'isSubmenuVisible(submenu) ? null : "none"',
        '[attr.role]': 'root() ? "menubar" : "menu"',
        '[attr.id]': 'id()',
        '[attr.aria-orientation]': 'orientation()',
        '[tabindex]': 'tabindex()',
        '[attr.aria-activedescendant]': 'focusedItemId()',
        '[attr.data-pc-section]': 'root() ? "rootlist" : "submenu"',
        '(keydown)': 'menuKeydown.emit($event)',
        '(focus)': 'menuFocus.emit($event)',
        '(blur)': 'menuBlur.emit($event)',
        '(mousedown)': 'menuMouseDown.emit($event)'
    },
    changeDetection: ChangeDetectionStrategy.Eager,
    hostDirectives: [Bind]
})
export class MegaMenuSub extends BaseComponent<MegaMenuPassThrough> {
    bindDirectiveInstance = inject(Bind, { self: true });

    $pcMegaMenu: MegaMenu | undefined = inject(MEGAMENU_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    $pcMegaMenuSub: MegaMenuSub | undefined = inject(MEGAMENU_SUB_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    readonly id = input<string>();

    readonly items = input<any[]>();

    readonly itemTemplate = input<TemplateRef<MegaMenuItemTemplateContext>>();

    readonly menuId = input<string>();

    readonly ariaLabel = input<string>();

    readonly ariaLabelledBy = input<string>();

    readonly level = input<number, unknown>(0, { transform: numberAttribute });

    readonly focusedItemId = input<string>();

    readonly disabled = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly orientation = input<string>();

    readonly activeItem = input<any>();

    readonly submenu = input<any>();

    readonly queryMatches = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly mobileActive = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly scrollHeight = input<string>(undefined!);

    readonly tabindex = input<number, unknown>(0, { transform: numberAttribute });

    readonly root = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly itemClick = output<any>();

    readonly itemMouseEnter = output<any>();

    readonly menuFocus = output<any>();

    readonly menuBlur = output<any>();

    readonly menuKeydown = output<any>();

    readonly menuMouseDown = output<any>();

    megaMenu: MegaMenu = inject(forwardRef(() => MegaMenu));

    _componentStyle = inject(MegaMenuStyle);

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm(this.root() ? 'rootList' : 'submenu'));
    }

    onItemClick(event: any, processedItem: any) {
        this.getItemProp(processedItem, 'command', { originalEvent: event, item: processedItem.item });
        this.itemClick.emit({ originalEvent: event, processedItem, isFocus: true });
    }

    getItemProp(processedItem: any, name: string, params: any | null = null): any {
        return processedItem && processedItem.item ? resolve(processedItem.item[name], params) : undefined;
    }

    getItemId(processedItem: any): string {
        return processedItem.item && processedItem.item?.id ? processedItem.item.id : `${this.menuId()}_${processedItem.key}`;
    }

    getSubListId(processedItem) {
        return `${this.getItemId(processedItem)}_list`;
    }

    getItemLabel(processedItem: any): string {
        return this.getItemProp(processedItem, 'label');
    }

    isSubmenuVisible(submenu: any) {
        if (this.submenu() && !this.root()) {
            return this.isItemVisible(submenu);
        } else {
            return true;
        }
    }

    isItemVisible(processedItem: any): boolean {
        return this.getItemProp(processedItem, 'visible') !== false;
    }

    isItemActive(processedItem) {
        const activeItem = this.activeItem();
        return isNotEmpty(activeItem) ? activeItem.key === processedItem.key : false;
    }

    isItemDisabled(processedItem: any): boolean {
        return this.getItemProp(processedItem, 'disabled');
    }

    isItemFocused(processedItem: any): boolean {
        return this.focusedItemId() === this.getItemId(processedItem);
    }

    isItemGroup(processedItem: any): boolean {
        return isNotEmpty(processedItem.items);
    }

    getAriaSetSize() {
        return this.items()?.filter((processedItem) => this.isItemVisible(processedItem) && !this.getItemProp(processedItem, 'separator')).length;
    }

    getAriaPosInset(index: number) {
        return index - (this.items()?.slice(0, index).filter((processedItem) => this.isItemVisible(processedItem) && this.getItemProp(processedItem, 'separator')).length || 0) + 1;
    }

    onItemMouseEnter(param: any) {
        const { event, processedItem } = param;
        this.itemMouseEnter.emit({ originalEvent: event, processedItem });
    }

    getPTOptions(processedItem: any, index: number, key: string) {
        const ptContext = {
            context: {
                item: processedItem.item,
                index,
                active: this.isItemActive(processedItem),
                focused: this.isItemFocused(processedItem),
                disabled: this.isItemDisabled(processedItem)
            }
        };

        return this.ptm(key, ptContext);
    }
}
/**
 * MegaMenu is navigation component that displays submenus together.
 * @group Components
 */
@Component({
    selector: 'h-megaMenu, h-megamenu, h-mega-menu',
    standalone: true,
    imports: [CommonModule, RouterModule, MegaMenuSub, TooltipModule, BarsIcon, BadgeModule, SharedModule, Bind],
    templateUrl: './megamenu.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [MegaMenuStyle, { provide: MEGAMENU_INSTANCE, useExisting: MegaMenu }, { provide: PARENT_INSTANCE, useExisting: MegaMenu }],
    host: {
        '[class]': 'cn(cx("root"), styleClass())',
        '[id]': 'id'
    },
    hostDirectives: [Bind]
})
export class MegaMenu extends BaseComponent<MegaMenuPassThrough> {
    componentName = 'MegaMenu';

    bindDirectiveInstance = inject(Bind, { self: true });
    /**
     * An array of menuitems.
     * @group Props
     */
    readonly model = input<MegaMenuItem[] | undefined>();
    /**
     * Class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Defines the orientation.
     * @group Props
     */
    readonly orientation = input<'horizontal' | 'vertical' | string>('horizontal');
    /**
     * Current id state as a string.
     * @group Props
     */
    readonly id = input<string>();

    private readonly autoId = uuid('pn_id_');

    readonly $id = computed(() => this.id() || this.autoId);
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
     * The breakpoint to define the maximum width boundary.
     * @group Props
     */
    readonly breakpoint = input<string>('960px');
    /**
     * Height of the viewport, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    readonly scrollHeight = input<string>('20rem');
    /**
     * When present, it specifies that the component should be disabled.
     * @group Props
     */
    readonly disabled = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number, unknown>(0, { transform: numberAttribute });
    /**
     * Defines template option for start.
     * @group Templates
     */
    readonly startTemplate = contentChild<TemplateRef<void>>('start', { descendants: false });
    /**
     * Defines template option for end.
     * @group Templates
     */
    readonly endTemplate = contentChild<TemplateRef<void>>('end', { descendants: false });
    /**
     * Defines template option for menu icon.
     * @group Templates
     */
    readonly menuIconTemplate = contentChild<TemplateRef<void>>('menuicon', { descendants: false });
    /**
     * Defines template option for submenu icon.
     * @group Templates
     */
    readonly submenuIconTemplate = contentChild<TemplateRef<void>>('submenuicon', { descendants: false });
    /**
     * Custom item template.
     * @param {MegaMenuItemTemplateContext} context - item context.
     * @see {@link MegaMenuItemTemplateContext}
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<MegaMenuItemTemplateContext>>('item', { descendants: false });
    /**
     * Custom menu button template on responsive mode.
     * @group Templates
     */
    readonly buttonTemplate = contentChild<TemplateRef<void>>('button', { descendants: false });
    /**
     * Custom menu button icon template on responsive mode.
     * @group Templates
     */
    readonly buttonIconTemplate = contentChild<TemplateRef<void>>('buttonicon', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    readonly menubuttonViewChild = viewChild<ElementRef>('menubutton');

    readonly rootmenu = viewChild<MegaMenuSub>('rootmenu');

    _startTemplate: TemplateRef<void> | undefined;

    _endTemplate: TemplateRef<void> | undefined;

    _menuIconTemplate: TemplateRef<void> | undefined;

    _submenuIconTemplate: TemplateRef<void> | undefined;

    _itemTemplate: TemplateRef<MegaMenuItemTemplateContext> | undefined;

    _buttonTemplate: TemplateRef<void> | undefined;

    _buttonIconTemplate: TemplateRef<void> | undefined;

    outsideClickListener: VoidListener;

    resizeListener: (event: any) => void;

    dirty: boolean = false;

    focused: boolean = false;

    activeItem = signal<any>(null);

    focusedItemInfo = signal<any>({ index: -1, level: 0, parentKey: '', item: null });

    searchValue: string = '';

    searchTimeout: any;

    _processedItems: any[];

    _componentStyle = inject(MegaMenuStyle);

    private matchMediaListener: () => void;

    private query: MediaQueryList;

    public queryMatches = signal<boolean>(false);

    public mobileActive: boolean = false;

    get visibleItems() {
        const processedItem = isNotEmpty(this.activeItem()) ? this.activeItem() : null;

        return processedItem
            ? processedItem.items.reduce((items, col) => {
                  col.forEach((submenu) => {
                      submenu.items.forEach((a) => {
                          items.push(a);
                      });
                  });

                  return items;
              }, [])
            : this.processedItems;
    }

    get processedItems() {
        if (!this._processedItems || !this._processedItems.length) {
            this._processedItems = this.createProcessedItems(this.model() || []);
        }
        return this._processedItems;
    }

    get focusedItemId() {
        const focusedItem = this.focusedItemInfo();
        return focusedItem?.item && focusedItem.item?.id ? focusedItem.item.id : isNotEmpty(focusedItem.key) ? `${this.$id()}_${focusedItem.key}` : null;
    }

    constructor() {
        super();
        effect(() => {
            const activeItem = this.activeItem();
            if (isNotEmpty(activeItem)) {
                this.bindOutsideClickListener();
                this.bindResizeListener();
            } else {
                this.unbindOutsideClickListener();
                this.unbindResizeListener();
            }
        });
        effect(() => {
            const model = this.model();
            this._processedItems = this.createProcessedItems(model || []);
        });
    }

    onInit(): void {
        this.bindMatchMediaListener();
    }

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    onAfterContentInit() {
        this.templates()?.forEach((item) => {
            switch (item.getType()) {
                case 'start':
                    this._startTemplate = item.template;
                    break;

                case 'end':
                    this._endTemplate = item.template;
                    break;

                case 'menuicon':
                    this._menuIconTemplate = item.template;
                    break;

                case 'submenuicon':
                    this._submenuIconTemplate = item.template;
                    break;

                case 'item':
                    this._itemTemplate = item.template;
                    break;

                case 'button':
                    this._buttonTemplate = item.template;
                    break;

                case 'buttonicon':
                    this._buttonIconTemplate = item.template;
                    break;

                default:
                    this._itemTemplate = item.template;
                    break;
            }
        });
    }

    bindMatchMediaListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.matchMediaListener) {
                const query = window.matchMedia(`(max-width: ${this.breakpoint()})`);

                this.query = query;
                this.queryMatches.set(query.matches);

                this.matchMediaListener = () => {
                    this.queryMatches.set(query.matches);
                    this.mobileActive = false;
                    this.cd.markForCheck();
                };

                query.addEventListener('change', this.matchMediaListener);
            }
        }
    }

    unbindMatchMediaListener() {
        if (this.matchMediaListener) {
            this.query.removeEventListener('change', this.matchMediaListener);
            this.matchMediaListener = null!;
        }
    }

    createProcessedItems(items, level = 0, parent = {}, parentKey = '', columnIndex?) {
        const processedItems: any[] = [];

        items &&
            items.forEach((item, index) => {
                const key = (parentKey !== '' ? parentKey + '_' : '') + (columnIndex !== undefined ? columnIndex + '_' : '') + index;
                const newItem = {
                    item,
                    index,
                    level,
                    key,
                    parent,
                    parentKey,
                    columnIndex: columnIndex !== undefined ? columnIndex : (<any>parent).columnIndex !== undefined ? (<any>parent).columnIndex : index
                };

                newItem['items'] =
                    level === 0 && item.items && item.items.length > 0
                        ? item.items.map((_items: any, _index: any) => this.createProcessedItems(_items, level + 1, newItem, key, _index))
                        : this.createProcessedItems(item.items, level + 1, newItem, key);
                processedItems.push(newItem);
            });
        return processedItems;
    }

    getItemProp(item: any, name: string) {
        return item ? resolve(item[name]) : undefined;
    }

    onItemClick(event: any) {
        this.dirty = true;
        const { originalEvent, processedItem } = event;
        const grouped = this.isProcessedItemGroup(processedItem);
        const root = isEmpty(processedItem.parent);
        const selected = this.isSelected(processedItem);

        if (selected) {
            const { index, key, parentKey, item } = processedItem;

            this.activeItem.set(null);
            this.focusedItemInfo.set({ index, key, parentKey, item });

            this.dirty = !root;
            if (!this.mobileActive) {
                focus(this.rootmenu()?.el?.nativeElement, { preventScroll: true });
            }
        } else {
            if (grouped) {
                this.onItemChange(event);
            } else {
                this.hide(originalEvent);
            }
        }
    }

    onItemMouseEnter(event) {
        if (!this.mobileActive && this.dirty) {
            this.onItemChange(event);
        }
    }

    menuButtonClick(event) {
        this.toggle(event);
    }

    menuButtonKeydown(event) {
        (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Space') && this.menuButtonClick(event);
    }

    toggle(event: MouseEvent) {
        if (this.mobileActive) {
            this.mobileActive = false;
            ZIndexUtils.clear(this.rootmenu()?.el.nativeElement);
            this.hide();
        } else {
            this.mobileActive = true;
            ZIndexUtils.set('menu', this.rootmenu()?.el.nativeElement, this.config.zIndex.menu);
            setTimeout(() => {
                this.show();
            }, 0);
        }

        this.bindOutsideClickListener();
        event.preventDefault();
    }

    show() {
        this.focusedItemInfo.set({ index: this.findFirstFocusedItemIndex(), level: 0, parentKey: '' });

        focus(this.rootmenu()?.el.nativeElement);
    }

    scrollInView(index: number = -1) {
        const id = index !== -1 ? `${this.$id()}_${index}` : this.focusedItemId;

        let element;

        if (id === null && this.queryMatches()) {
            element = this.menubuttonViewChild()?.nativeElement;
        } else {
            element = findSingle(this.rootmenu()?.el?.nativeElement, `li[id="${id}"]`);
        }

        if (element) {
            element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
        }
    }

    onItemChange(event: any) {
        const { processedItem, isFocus } = event;

        if (isEmpty(processedItem)) return;

        const { index, key, parentKey, items, item } = processedItem;
        const grouped = isNotEmpty(items);

        if (grouped) {
            this.activeItem.set(processedItem);
        }
        this.focusedItemInfo.set({ index, key, parentKey, item });

        grouped && (this.dirty = true);
        isFocus && focus(this.rootmenu()?.el?.nativeElement);
    }

    hide(event?, isFocus?: boolean) {
        if (this.mobileActive) {
            this.mobileActive = false;
            setTimeout(() => {
                focus(this.menubuttonViewChild()?.nativeElement);
                this.scrollInView();
            }, 100);
        }

        this.activeItem.set(null);
        this.focusedItemInfo.set({ index: -1, key: '', parentKey: '', item: null });

        isFocus && focus(this.rootmenu()?.el?.nativeElement);
        this.dirty = false;
    }

    onMenuMouseDown(event: any) {
        this.dirty = true;
    }

    onMenuFocus(event: any) {
        this.focused = true;

        const relatedTarget = event.relatedTarget;
        const isFromOutside = !relatedTarget || !this.el.nativeElement.contains(relatedTarget);

        if (isFromOutside && this.focusedItemInfo().index === -1 && isEmpty(this.activeItem()) && !this.dirty) {
            const index = this.findFirstFocusedItemIndex();
            const processedItem = this.findVisibleItem(index);

            this.focusedItemInfo.set({ index, key: processedItem.key, parentKey: processedItem.parentKey, item: processedItem.item });
        }
    }

    onMenuBlur(event: any) {
        const relatedTarget = event.relatedTarget;
        if (relatedTarget && this.el.nativeElement.contains(relatedTarget)) {
            return;
        }

        setTimeout(() => {
            const activeElement = this.document.activeElement;
            if (activeElement && this.el.nativeElement.contains(activeElement)) {
                return;
            }

            this.focused = false;
            this.focusedItemInfo.set({ index: -1, level: 0, parentKey: '', item: null });
            this.searchValue = '';
            this.dirty = false;
        });
    }

    onKeyDown(event: KeyboardEvent) {
        const metaKey = event.metaKey || event.ctrlKey;

        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            case 'ArrowUp':
                this.onArrowUpKey(event);
                break;

            case 'ArrowLeft':
                this.onArrowLeftKey(event);
                break;

            case 'ArrowRight':
                this.onArrowRightKey(event);
                break;

            case 'Home':
                this.onHomeKey(event);
                break;

            case 'End':
                this.onEndKey(event);
                break;

            case 'Space':
                this.onSpaceKey(event);
                break;

            case 'Enter':
                this.onEnterKey(event);
                break;

            case 'Escape':
                this.onEscapeKey(event);
                break;

            case 'Tab':
                this.onTabKey(event);
                break;

            case 'PageDown':
            case 'PageUp':
            case 'Backspace':
            case 'ShiftLeft':
            case 'ShiftRight':
                //NOOP
                break;

            default:
                if (!metaKey && isPrintableCharacter(event.key)) {
                    this.searchItems(event, event.key);
                }

                break;
        }
    }

    findFirstFocusedItemIndex() {
        const selectedIndex = this.findSelectedItemIndex();

        return selectedIndex < 0 ? this.findFirstItemIndex() : selectedIndex;
    }

    findFirstItemIndex() {
        return this.visibleItems.findIndex((processedItem) => this.isValidItem(processedItem));
    }

    findSelectedItemIndex() {
        return this.visibleItems.findIndex((processedItem) => this.isValidSelectedItem(processedItem));
    }

    isProcessedItemGroup(processedItem: any): boolean {
        return processedItem && isNotEmpty(processedItem.items);
    }

    isSelected(processedItem: any): boolean {
        return isNotEmpty(this.activeItem()) ? this.activeItem().key === processedItem.key : false;
    }

    isValidSelectedItem(processedItem: any): boolean {
        return this.isValidItem(processedItem) && this.isSelected(processedItem);
    }

    isValidItem(processedItem: any): boolean {
        return !!processedItem && !this.isItemDisabled(processedItem.item) && !this.isItemSeparator(processedItem.item);
    }

    isItemDisabled(item: any): boolean {
        return this.getItemProp(item, 'disabled');
    }

    isItemSeparator(item: any): boolean {
        return this.getItemProp(item, 'separator');
    }

    isItemMatched(processedItem: any): boolean {
        return this.isValidItem(processedItem) && this.getProccessedItemLabel(processedItem).toLocaleLowerCase().startsWith(this.searchValue.toLocaleLowerCase());
    }

    isProccessedItemGroup(processedItem: any): boolean {
        return processedItem && isNotEmpty(processedItem.items);
    }

    searchItems(event: any, char: string) {
        this.searchValue = (this.searchValue || '') + char;

        let itemIndex = -1;
        let matched = false;

        if (this.focusedItemInfo().index !== -1) {
            itemIndex = this.visibleItems.slice(this.focusedItemInfo().index).findIndex((processedItem) => this.isItemMatched(processedItem));
            itemIndex = itemIndex === -1 ? this.visibleItems.slice(0, this.focusedItemInfo().index).findIndex((processedItem) => this.isItemMatched(processedItem)) : itemIndex + this.focusedItemInfo().index;
        } else {
            itemIndex = this.visibleItems.findIndex((processedItem) => this.isItemMatched(processedItem));
        }

        if (itemIndex !== -1) {
            matched = true;
        }

        if (itemIndex === -1 && this.focusedItemInfo().index === -1) {
            itemIndex = this.findFirstFocusedItemIndex();
        }

        if (itemIndex !== -1) {
            this.changeFocusedItemInfo(event, itemIndex);
        }

        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTimeout = setTimeout(() => {
            this.searchValue = '';
            this.searchTimeout = null;
        }, 500);

        return matched;
    }

    getProccessedItemLabel(processedItem: any) {
        return processedItem ? this.getItemLabel(processedItem.item) : undefined;
    }

    getItemLabel(item: any) {
        return this.getItemProp(item, 'label');
    }

    changeFocusedItemInfo(event, index) {
        const processedItem = this.findVisibleItem(index);
        if (isNotEmpty(processedItem)) {
            const { key, parentKey, item } = processedItem;
            this.focusedItemInfo.set({ index, key: key ? key : '', parentKey, item });
        }

        this.scrollInView();
    }

    onArrowDownKey(event: KeyboardEvent) {
        if (this.orientation() === 'horizontal') {
            if (isNotEmpty(this.activeItem()) && this.activeItem().key === this.focusedItemInfo().key) {
                const { key, item } = this.activeItem();
                this.focusedItemInfo.set({ index: -1, key: '', parentKey: key, item });
            } else {
                const processedItem = this.findVisibleItem(this.focusedItemInfo().index);
                const grouped = this.isProccessedItemGroup(processedItem);

                if (grouped) {
                    const { parentKey, key, item } = processedItem;
                    this.onItemChange({ originalEvent: event, processedItem });
                    this.focusedItemInfo.set({ index: -1, key: key, parentKey: parentKey, item: item });
                    this.searchValue = '';
                }
            }
        }

        const itemIndex = this.focusedItemInfo().index !== -1 ? this.findNextItemIndex(this.focusedItemInfo().index) : this.findFirstFocusedItemIndex();
        this.changeFocusedItemInfo(event, itemIndex);
        event.preventDefault();
    }

    onArrowRightKey(event: KeyboardEvent) {
        const processedItem = this.findVisibleItem(this.focusedItemInfo().index);
        const grouped = this.isProccessedItemGroup(processedItem);

        if (grouped) {
            if (this.orientation() === 'vertical') {
                if (isNotEmpty(this.activeItem()) && this.activeItem().key === processedItem.key) {
                    this.focusedItemInfo.set({ index: -1, key: '', parentKey: this.activeItem().key, item: processedItem.item });
                } else {
                    const processedItem = this.findVisibleItem(this.focusedItemInfo().index);
                    const grouped = this.isProccessedItemGroup(processedItem);

                    if (grouped) {
                        this.onItemChange({ originalEvent: event, processedItem });
                        this.focusedItemInfo.set({
                            index: -1,
                            key: processedItem.key,
                            parentKey: processedItem.parentKey,
                            item: processedItem.item
                        });
                        this.searchValue = '';
                    }
                }
            }

            const itemIndex = this.focusedItemInfo().index !== -1 ? this.findNextItemIndex(this.focusedItemInfo().index) : this.findFirstFocusedItemIndex();

            this.changeFocusedItemInfo(event, itemIndex);
        } else {
            const columnIndex = processedItem.columnIndex + 1;
            const itemIndex = this.visibleItems.findIndex((item) => item.columnIndex === columnIndex);

            itemIndex !== -1 && this.changeFocusedItemInfo(event, itemIndex);
        }

        event.preventDefault();
    }

    onArrowUpKey(event: KeyboardEvent) {
        if (event.altKey && this.orientation() === 'horizontal') {
            if (this.focusedItemInfo().index !== -1) {
                const processedItem = this.findVisibleItem(this.focusedItemInfo().index);
                const grouped = this.isProccessedItemGroup(processedItem);

                if (!grouped && isNotEmpty(this.activeItem)) {
                    if (this.focusedItemInfo().index === 0) {
                        this.focusedItemInfo.set({
                            index: this.activeItem().index,
                            key: this.activeItem().key,
                            parentKey: this.activeItem().parentKey,
                            item: processedItem.item
                        });
                        this.activeItem.set(null);
                    } else {
                        this.changeFocusedItemInfo(event, this.findFirstItemIndex());
                    }
                }
            }

            event.preventDefault();
        } else {
            const itemIndex = this.focusedItemInfo().index !== -1 ? this.findPrevItemIndex(this.focusedItemInfo().index) : this.findLastFocusedItemIndex();

            this.changeFocusedItemInfo(event, itemIndex);
            event.preventDefault();
        }
    }

    onArrowLeftKey(event: KeyboardEvent) {
        const processedItem = this.findVisibleItem(this.focusedItemInfo().index);
        const grouped = this.isProccessedItemGroup(processedItem);

        if (grouped) {
            if (this.orientation() === 'horizontal') {
                const itemIndex = this.focusedItemInfo().index !== -1 ? this.findPrevItemIndex(this.focusedItemInfo().index) : this.findLastFocusedItemIndex();

                this.changeFocusedItemInfo(event, itemIndex);
            }
        } else {
            if (this.orientation() === 'vertical' && isNotEmpty(this.activeItem())) {
                if (processedItem.columnIndex === 0) {
                    this.focusedItemInfo.set({
                        index: this.activeItem().index,
                        key: this.activeItem().key,
                        parentKey: this.activeItem().parentKey,
                        item: processedItem.item
                    });
                    this.activeItem.set(null);
                }
            }

            const columnIndex = processedItem.columnIndex - 1;
            const itemIndex = this.visibleItems.findIndex((item) => item.columnIndex === columnIndex);

            itemIndex !== -1 && this.changeFocusedItemInfo(event, itemIndex);
        }

        event.preventDefault();
    }

    onHomeKey(event: KeyboardEvent) {
        this.changeFocusedItemInfo(event, this.findFirstItemIndex());
        event.preventDefault();
    }

    onEndKey(event: KeyboardEvent) {
        this.changeFocusedItemInfo(event, this.findLastItemIndex());
        event.preventDefault();
    }

    onSpaceKey(event: KeyboardEvent) {
        this.onEnterKey(event);
    }

    onEscapeKey(event: KeyboardEvent) {
        if (isNotEmpty(this.activeItem())) {
            this.focusedItemInfo.set({ index: this.activeItem().index, key: this.activeItem().key, item: this.activeItem().item });
            this.activeItem.set(null);
        }

        event.preventDefault();
    }

    onTabKey(event: KeyboardEvent) {
        if (this.focusedItemInfo().index !== -1) {
            const processedItem = this.findVisibleItem(this.focusedItemInfo().index);
            const grouped = this.isProccessedItemGroup(processedItem);

            !grouped && this.onItemChange({ originalEvent: event, processedItem });
        }

        this.hide();
    }

    onEnterKey(event: KeyboardEvent) {
        if (this.focusedItemInfo().index !== -1) {
            const element = <any>findSingle(this.rootmenu()?.el?.nativeElement, `li[id="${`${this.focusedItemId}`}"]`);
            const anchorElement = element && (<any>findSingle(element, '[data-pc-section="itemlink"]') || findSingle(element, 'a,button'));

            anchorElement ? anchorElement.click() : element && element.click();

            const processedItem = this.visibleItems[this.focusedItemInfo().index];
            const grouped = this.isProccessedItemGroup(processedItem);

            !grouped && this.changeFocusedItemInfo(event, this.findFirstFocusedItemIndex());
        }

        event.preventDefault();
    }

    findVisibleItem(index) {
        return isNotEmpty(this.visibleItems) ? this.visibleItems[index] : null;
    }

    findLastFocusedItemIndex() {
        const selectedIndex = this.findSelectedItemIndex();
        return selectedIndex < 0 ? this.findLastItemIndex() : selectedIndex;
    }

    findLastItemIndex() {
        return findLastIndex(this.visibleItems, (processedItem) => this.isValidItem(processedItem));
    }

    findPrevItemIndex(index: number) {
        const matchedItemIndex = index > 0 ? findLastIndex(this.visibleItems.slice(0, index), (processedItem) => this.isValidItem(processedItem)) : -1;

        return matchedItemIndex > -1 ? matchedItemIndex : index;
    }

    findNextItemIndex(index: number) {
        const matchedItemIndex = index < this.visibleItems.length - 1 ? this.visibleItems.slice(index + 1).findIndex((processedItem) => this.isValidItem(processedItem)) : -1;

        return matchedItemIndex > -1 ? matchedItemIndex + index + 1 : index;
    }

    bindResizeListener() {
        if (!this.resizeListener) {
            this.resizeListener = (event) => {
                if (!isTouchDevice()) {
                    this.hide(event, true);
                }

                this.mobileActive = false;
            };

            window.addEventListener('resize', this.resizeListener);
        }
    }

    bindOutsideClickListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.outsideClickListener) {
                this.outsideClickListener = this.renderer.listen(this.document, 'click', (event) => {
                    const isOutsideContainer = this.el?.nativeElement !== event.target && !this.el?.nativeElement.contains(event.target);

                    if (isOutsideContainer) {
                        this.hide();
                    }
                });
            }
        }
    }

    unbindOutsideClickListener() {
        if (this.outsideClickListener) {
            this.outsideClickListener();
            this.outsideClickListener = null;
        }
    }

    unbindResizeListener() {
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
            this.resizeListener = null!;
        }
    }

    onDestroy() {
        this.unbindOutsideClickListener();
        this.unbindResizeListener();
        this.unbindMatchMediaListener();
    }
}

@NgModule({
    imports: [MegaMenu, SharedModule],
    exports: [MegaMenu, SharedModule]
})
export class MegaMenuModule {}
