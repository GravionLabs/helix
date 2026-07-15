import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ContentChildren,
    ElementRef,
    EventEmitter,
    inject,
    InjectionToken,
    Input,
    NgModule,
    Output,
    QueryList,
    signal,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { find, findSingle, resolve, uuid } from '@primeuix/utils';
import { MenuItem, PrimeTemplate, SharedModule } from '@gravionlabs/helix/api';
import { Badge } from '@gravionlabs/helix/badge';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind } from '@gravionlabs/helix/bind';
import { Ripple } from '@gravionlabs/helix/ripple';
import { TooltipModule } from '@gravionlabs/helix/tooltip';
import { Nullable } from '@gravionlabs/helix/ts-helpers';
import { DockItemTemplateContext, DockPassThrough } from '@gravionlabs/helix/types/dock';
import { DockStyle } from './style/dockstyle';

const DOCK_INSTANCE = new InjectionToken<Dock>('DOCK_INSTANCE');

/**
 * Dock is a navigation component consisting of menuitems.
 * @group Components
 */
@Component({
    selector: 'h-dock',
    standalone: true,
    imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive, Ripple, TooltipModule, SharedModule, Bind, Badge],
    templateUrl: './dock.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [DockStyle, { provide: DOCK_INSTANCE, useExisting: Dock }, { provide: PARENT_INSTANCE, useExisting: Dock }],
    host: {
        '[class]': 'cn(cx("root"), styleClass)'
    },
    hostDirectives: [Bind]
})
export class Dock extends BaseComponent<DockPassThrough> {
    componentName = 'Dock';

    /**
     * Current id state as a string.
     * @group Props
     */
    @Input() id: string | undefined;
    /**
     * Class of the element.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    @Input() styleClass: string | undefined;
    /**
     * MenuModel instance to define the action items.
     * @group Props
     */
    @Input() model: MenuItem[] | undefined | null = null;
    /**
     * Position of element.
     * @group Props
     */
    @Input() position: 'bottom' | 'top' | 'left' | 'right' = 'bottom';
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    @Input() ariaLabel: string | undefined;
    /**
     * The breakpoint to define the maximum width boundary.
     * @defaultValue 960px
     * @group Props
     */
    @Input() breakpoint: string | undefined = '960px';
    /**
     * Defines a string that labels the dropdown button for accessibility.
     * @group Props
     */
    @Input() ariaLabelledBy: string | undefined;
    /**
     * Callback to execute when button is focused.
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    @Output() onFocus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();
    /**
     * Callback to invoke when the component loses focus.
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    @Output() onBlur: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

    @ViewChild('list', { static: false }) listViewChild: Nullable<ElementRef>;

    currentIndex: number;

    tabindex: number = 0;

    focused: boolean = false;

    focusedOptionIndex: string | number = -1;

    _componentStyle = inject(DockStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcDock: Dock | undefined = inject(DOCK_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    matchMediaListener: any;

    query: any;

    queryMatches = signal<boolean>(false);

    mobileActive = signal<boolean>(false);

    get focusedOptionId() {
        return this.focusedOptionIndex !== -1 && this.focusedOptionIndex !== '-1' ? String(this.focusedOptionIndex) : null;
    }

    constructor(public cd: ChangeDetectorRef) {
        super();
        this.currentIndex = -3;
    }

    onInit() {
        this.id = this.id || uuid('pn_id_');
        this.bindMatchMediaListener();
    }

    onDestroy() {
        this.unbindMatchMediaListener();
    }

    /**
     * Custom item template.
     * @param {DockItemTemplateContext} context - item template context.
     * @group Templates
     */
    @ContentChild('item') itemTemplate: TemplateRef<DockItemTemplateContext> | undefined;

    _itemTemplate: TemplateRef<DockItemTemplateContext> | undefined;

    getItemId(item, index) {
        return item && item?.id ? item.id : `${index}`;
    }

    getItemProp(processedItem, name) {
        return processedItem && processedItem.item ? resolve(processedItem.item[name]) : undefined;
    }

    disabled(item) {
        return typeof item.disabled === 'function' ? item.disabled() : item.disabled || false;
    }

    isItemActive(id) {
        return String(id) === String(this.focusedOptionIndex);
    }

    onListMouseLeave() {
        this.currentIndex = -3;
        this.cd.markForCheck();
    }

    onItemMouseEnter(index: number) {
        this.currentIndex = index;

        if (index === 1) {
        }

        this.cd.markForCheck();
    }

    onItemClick(e: Event, item: MenuItem) {
        if (item.command) {
            item.command({ originalEvent: e, item });
        }
    }

    onListFocus(event) {
        this.focused = true;
        this.changeFocusedOptionIndex(0);
        this.onFocus.emit(event);
    }

    onListBlur(event) {
        this.focused = false;
        this.focusedOptionIndex = -1;
        this.onBlur.emit(event);
    }

    onListKeyDown(event) {
        switch (event.code) {
            case 'ArrowDown': {
                if (this.position === 'left' || this.position === 'right') this.onArrowDownKey();
                event.preventDefault();
                break;
            }

            case 'ArrowUp': {
                if (this.position === 'left' || this.position === 'right') this.onArrowUpKey();
                event.preventDefault();
                break;
            }

            case 'ArrowRight': {
                if (this.position === 'top' || this.position === 'bottom') this.onArrowDownKey();
                event.preventDefault();
                break;
            }

            case 'ArrowLeft': {
                if (this.position === 'top' || this.position === 'bottom') this.onArrowUpKey();
                event.preventDefault();
                break;
            }

            case 'Home': {
                this.onHomeKey();
                event.preventDefault();
                break;
            }

            case 'End': {
                this.onEndKey();
                event.preventDefault();
                break;
            }

            case 'Enter':

            case 'Space': {
                this.onSpaceKey();
                event.preventDefault();
                break;
            }

            default:
                break;
        }
    }

    onArrowDownKey() {
        const optionIndex = this.findNextOptionIndex(this.focusedOptionIndex);

        this.changeFocusedOptionIndex(optionIndex);
    }

    onArrowUpKey() {
        const optionIndex = this.findPrevOptionIndex(this.focusedOptionIndex);

        this.changeFocusedOptionIndex(optionIndex);
    }

    onHomeKey() {
        this.changeFocusedOptionIndex(0);
    }

    onEndKey() {
        this.changeFocusedOptionIndex(find(this.listViewChild?.nativeElement, 'li[data-pc-section="item"][data-p-disabled="false"]').length - 1);
    }

    onSpaceKey() {
        const element = <HTMLElement>findSingle(this.listViewChild?.nativeElement, `li[id="${`${this.focusedOptionIndex}`}"]`);
        const anchorElement = element && <HTMLElement>findSingle(element, 'a,button');

        anchorElement ? anchorElement.click() : element && element.click();
    }

    findNextOptionIndex(index) {
        const menuitems = find(this.listViewChild?.nativeElement, 'li[data-pc-section="item"][data-p-disabled="false"]');
        const matchedOptionIndex = [...menuitems].findIndex((link) => link.id === index);

        return matchedOptionIndex > -1 ? matchedOptionIndex + 1 : 0;
    }

    changeFocusedOptionIndex(index) {
        const menuitems = <any>find(this.listViewChild?.nativeElement, 'li[data-pc-section="item"][data-p-disabled="false"]');

        let order = index >= menuitems.length ? menuitems.length - 1 : index < 0 ? 0 : index;

        this.focusedOptionIndex = menuitems[order]?.getAttribute('id');
    }

    findPrevOptionIndex(index) {
        const menuitems = find(this.listViewChild?.nativeElement, 'li[data-pc-section="item"][data-p-disabled="false"]');
        const matchedOptionIndex = [...menuitems].findIndex((link) => link.id === index);

        return matchedOptionIndex > -1 ? matchedOptionIndex - 1 : 0;
    }

    isClickableRouterLink(item: any) {
        return !!item.routerLink && !this.disabled(item);
    }

    @ContentChildren(PrimeTemplate) templates: QueryList<PrimeTemplate> | undefined;

    onAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this._itemTemplate = item.template;
                    break;

                default:
                    this._itemTemplate = item.template;
                    break;
            }
        });
    }

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    getPTOptions(item: MenuItem, index: number, key: string) {
        return this.ptm(key, {
            context: {
                item,
                index
            }
        });
    }

    bindMatchMediaListener() {
        if (!this.matchMediaListener) {
            const query = window.matchMedia(`(max-width: ${this.breakpoint})`);
            this.query = query;
            this.queryMatches.set(query.matches);

            this.matchMediaListener = () => {
                this.queryMatches.set(query.matches);
                this.mobileActive.set(false);
            };

            this.renderer.listen(this.query, 'change', this.matchMediaListener.bind(this));
        }
    }

    unbindMatchMediaListener() {
        if (this.matchMediaListener) {
            this.matchMediaListener();
            this.matchMediaListener = null;
            this.query = null;
        }
    }
}

@NgModule({
    imports: [Dock, SharedModule],
    exports: [Dock, SharedModule]
})
export class DockModule {}
