import { CDK_DRAG_CONFIG, CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, InjectionToken, Input, NgModule, TemplateRef, ViewEncapsulation, booleanAttribute, computed, forwardRef, inject, input, numberAttribute, signal, output, viewChild, contentChild, contentChildren, effect } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { equals, findLastIndex, findSingle, focus, getFirstFocusableElement, isEmpty, isFunction, isNotEmpty, isPrintableCharacter, resolveFieldData, uuid } from '@primeuix/utils';
import { FilterService, Footer, Header, PrimeTemplate, ScrollerOptions, SharedModule } from '@gravionlabs/helix/api';
import { PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { BaseEditableHolder } from '@gravionlabs/helix/baseeditableholder';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import { Checkbox } from '@gravionlabs/helix/checkbox';
import { IconField } from '@gravionlabs/helix/iconfield';
import { BlankIcon, CheckIcon, SearchIcon } from '@gravionlabs/helix/icons';
import { InputIcon } from '@gravionlabs/helix/inputicon';
import { InputText } from '@gravionlabs/helix/inputtext';
import { Ripple } from '@gravionlabs/helix/ripple';
import { Scroller, ScrollerLazyLoadEvent } from '@gravionlabs/helix/scroller';
import { Nullable } from '@gravionlabs/helix/ts-helpers';
import {
    ListBoxPassThrough,
    ListboxChangeEvent,
    ListboxCheckIconTemplateContext,
    ListboxCheckmarkTemplateContext,
    ListboxClickEvent,
    ListboxDoubleClickEvent,
    ListboxFilterEvent,
    ListboxFilterOptions,
    ListboxFilterTemplateContext,
    ListboxFooterTemplateContext,
    ListboxGroupTemplateContext,
    ListboxHeaderTemplateContext,
    ListboxItemTemplateContext,
    ListboxLoaderTemplateContext,
    ListboxSelectAllChangeEvent
} from '@gravionlabs/helix/types/listbox';
import { Subscription } from 'rxjs';
import { ListBoxStyle } from './style/listboxstyle';

const LISTBOX_INSTANCE = new InjectionToken<Listbox>('LISTBOX_INSTANCE');

export const LISTBOX_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Listbox),
    multi: true
};
/**
 * ListBox is used to select one or more values from a list of items.
 * @group Components
 */
@Component({
    selector: 'h-listbox, h-listBox, h-list-box',
    standalone: true,
    imports: [CommonModule, Ripple, Scroller, InputIcon, SearchIcon, Checkbox, CheckIcon, IconField, InputText, BlankIcon, FormsModule, SharedModule, DragDropModule, BindModule],
    templateUrl: './listbox.html',
    providers: [
        LISTBOX_VALUE_ACCESSOR,
        ListBoxStyle,
        {
            provide: CDK_DRAG_CONFIG,
            useValue: {
                zIndex: 1200
            }
        },
        { provide: LISTBOX_INSTANCE, useExisting: Listbox },
        { provide: PARENT_INSTANCE, useExisting: Listbox }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[attr.id]': '$id()',
        '(focusout)': 'onHostFocusOut($event)',
        '[class]': "cn(cx('root'), styleClass())",
        '[attr.data-p]': 'containerDataP'
    },
    hostDirectives: [Bind]
})
export class Listbox extends BaseEditableHolder<ListBoxPassThrough> {
    componentName = 'Listbox';

    readonly hostName = input<any>('');

    bindDirectiveInstance = inject(Bind, { self: true });

    $pcListbox: Listbox | undefined = inject(LISTBOX_INSTANCE, { optional: true, skipSelf: true }) ?? undefined;

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    /**
     * Unique identifier of the component.
     * @group Props
     */
    readonly id = input<string>();

    private readonly autoId = uuid('pn_id_');

    readonly $id = computed(() => this.id() || this.autoId);
    /**
     * Text to display when the search is active. Defaults to global value in i18n translation configuration.
     * @group Props
     * @defaultValue '{0} results are available'
     */
    readonly searchMessage = input<string>();
    /**
     * Text to display when filtering does not return any results. Defaults to global value in i18n translation configuration.
     * @group Props
     * @defaultValue 'No selected item'
     */
    readonly emptySelectionMessage = input<string>();
    /**
     * Text to be displayed in hidden accessible field when options are selected. Defaults to global value in i18n translation configuration.
     * @group Props
     * @defaultValue '{0} items selected'
     */
    readonly selectionMessage = input<string>();
    /**
     * Whether to focus on the first visible or selected element when the overlay panel is shown.
     * @group Props
     */
    readonly autoOptionFocus = input<boolean | undefined, unknown>(true, { transform: booleanAttribute });
    /**
     * Defines a string that labels the input for accessibility.
     * @group Props
     */
    readonly ariaLabel = input<string>();
    /**
     * When enabled, the focused option is selected.
     * @group Props
     */
    readonly selectOnFocus = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Locale to use in searching. The default locale is the host environment's current locale.
     * @group Props
     */
    readonly searchLocale = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When enabled, the hovered option will be focused.
     * @group Props
     */
    readonly focusOnHover = input<boolean | undefined, unknown>(true, { transform: booleanAttribute });
    /**
     * Text to display when filtering.
     * @group Props
     */
    readonly filterMessage = input<string>();
    /**
     * Fields used when filtering the options, defaults to optionLabel.
     * @group Props
     */
    readonly filterFields = input<any[]>();
    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    readonly lazy = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    readonly virtualScroll = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Height of an item in the list for VirtualScrolling.
     * @group Props
     */
    readonly virtualScrollItemSize = input<number, unknown>(undefined, { transform: numberAttribute });
    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    readonly virtualScrollOptions = input<ScrollerOptions>();
    /**
     * Height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    readonly scrollHeight = input<string>('14rem');
    /**
     * Index of the element in tabbing order.
     * @group Props
     */
    readonly tabindex = input<number | undefined, unknown>(0, { transform: numberAttribute });
    /**
     * When specified, allows selecting multiple values.
     * @group Props
     */
    readonly multiple = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Style class of the container.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Inline style of the list element.
     * @group Props
     */
    readonly listStyle = input<{
    [klass: string]: any;
} | null>();
    /**
     * Style class of the list element.
     * @group Props
     */
    readonly listStyleClass = input<string>();
    /**
     * When present, it specifies that the element value cannot be changed.
     * @group Props
     */
    readonly readonly = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When specified, allows selecting items with checkboxes.
     * @group Props
     */
    readonly checkbox = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * When specified, displays a filter input at header.
     * @group Props
     */
    readonly filter = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * When filtering is enabled, filterBy decides which field or fields (comma separated) to search against.
     * @group Props
     */
    readonly filterBy = input<string>();
    /**
     * Defines how the items are filtered.
     * @group Props
     */
    readonly filterMatchMode = input<'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'lt' | 'lte' | 'gt' | 'gte' | string>('contains');
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    readonly filterLocale = input<string>();
    /**
     * Defines how multiple items can be selected, when true metaKey needs to be pressed to select or unselect an item and when set to false selection of each item can be toggled individually. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    readonly metaKeySelection = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * A property to uniquely identify a value in options.
     * @group Props
     */
    readonly dataKey = input<string>();
    /**
     * Whether header checkbox is shown in multiple mode.
     * @group Props
     */
    readonly showToggleAll = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Name of the label field of an option.
     * @group Props
     */
    readonly optionLabel = input<string>();
    /**
     * Name of the value field of an option.
     * @group Props
     */
    readonly optionValue = input<string>();
    /**
     * Name of the options field of an option group.
     * @group Props
     */
    readonly optionGroupChildren = input<string | undefined>('items');
    /**
     * Name of the label field of an option group.
     * @group Props
     */
    readonly optionGroupLabel = input<string | undefined>('label');
    /**
     * Name of the disabled field of an option or function to determine disabled state.
     * @group Props
     */
    readonly optionDisabled = input<string | ((item: any) => boolean)>();
    /**
     * Defines a string that labels the filter input.
     * @group Props
     */
    readonly ariaFilterLabel = input<string>();
    /**
     * Defines placeholder of the filter input.
     * @group Props
     */
    readonly filterPlaceHolder = input<string>();
    /**
     * Text to display when filtering does not return any results.
     * @group Props
     */
    readonly emptyFilterMessage = input<string>();
    /**
     * Text to display when there is no data. Defaults to global value in i18n translation configuration.
     * @group Props
     */
    readonly emptyMessage = input<string>();
    /**
     * Whether to display options as grouped when nested options are provided.
     * @group Props
     */
    readonly group = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * An array of selectitems to display as the available options.
     * @group Props
     */
    readonly options = input<any[]>(undefined!);

    public _options = signal<any>(null);
    /**
     * When specified, filter displays with this value.
     * @group Props
     */
    readonly filterValue = input<string>();
    /**
     * Whether all data is selected.
     * @group Props
     */
    readonly selectAll = input<boolean | undefined | null>(null);
    /**
     * Whether to displays rows with alternating colors.
     * @group Props
     * @defaultValue false
     */
    readonly striped = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether the selected option will be add highlight class.
     * @group Props
     * @defaultValue true
     */
    readonly highlightOnSelect = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether the selected option will be shown with a check mark.
     * @group Props
     * @defaultValue false
     */
    readonly checkmark = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether to enable dragdrop based reordering.
     * @group Props
     */
    readonly dragdrop = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Array to use for CDK drop list data binding. When not provided, uses options array.
     * @group Props
     */
    readonly dropListData = input<any[]>();

    /**
     * Computed property for stable CDK drop list data reference
     */
    cdkDropData = computed(() => {
        return this.dropListData() || this._options();
    });
    /**
     * Spans 100% width of the container when enabled.
     * @defaultValue undefined
     * @group Props
     */
    fluid = input(undefined, { transform: booleanAttribute });
    /**
     * Callback to invoke on value change.
     * @param {ListboxChangeEvent} event - Custom change event.
     * @group Emits
     */
    readonly onChange = output<ListboxChangeEvent>();
    /**
     * Callback to invoke when option is clicked.
     * @param {ListboxClickEvent} event - Custom click event.
     * @group Emits
     */
    readonly onClick = output<ListboxClickEvent>();
    /**
     * Callback to invoke when option is double clicked.
     * @param {ListboxDoubleClickEvent} event - Custom double click event.
     * @group Emits
     */
    readonly onDblClick = output<ListboxDoubleClickEvent>();
    /**
     * Callback to invoke when data is filtered.
     * @param {ListboxFilterEvent} event - Custom filter event.
     * @group Emits
     */
    readonly onFilter = output<ListboxFilterEvent>();
    /**
     * Callback to invoke when component receives focus.
     * @param {FocusEvent} event - Focus event.
     * @group Emits
     */
    readonly onFocus = output<FocusEvent>();
    /**
     * Callback to invoke when component loses focus.
     * @param {FocusEvent} event - Blur event.
     * @group Emits
     */
    readonly onBlur = output<FocusEvent>();
    /**
     * Callback to invoke when all data is selected.
     * @param {ListboxSelectAllChangeEvent} event - Custom select event.
     * @group Emits
     */
    readonly onSelectAllChange = output<ListboxSelectAllChangeEvent>();
    /**
     * Emits on lazy load.
     * @param {ScrollerLazyLoadEvent} event - Scroller lazy load event.
     * @group Emits
     */
    readonly onLazyLoad = output<ScrollerLazyLoadEvent>();
    /**
     * Emits on item is dropped.
     * @param {CdkDragDrop<string[]>} event - Scroller lazy load event.
     * @group Emits
     */
    readonly onDrop = output<CdkDragDrop<string[]>>();

    readonly headerCheckboxViewChild = viewChild<Nullable<ElementRef>>('headerchkbox');

    readonly filterViewChild = viewChild<Nullable<ElementRef>>('filter');

    readonly lastHiddenFocusableElement = viewChild<Nullable<ElementRef>>('lastHiddenFocusableElement');

    readonly firstHiddenFocusableElement = viewChild<Nullable<ElementRef>>('firstHiddenFocusableElement');

    readonly scroller = viewChild<Nullable<Scroller>>('scroller');

    readonly listViewChild = viewChild<Nullable<ElementRef>>('list');

    readonly containerViewChild = viewChild<Nullable<ElementRef>>('container');

    readonly headerFacet = contentChild(Header);

    readonly footerFacet = contentChild(Footer);

    /**
     * Custom item template.
     * @param {ListboxItemTemplateContext} context - item context.
     * @see {@link ListboxItemTemplateContext}
     * @group Templates
     */
    readonly itemTemplate = contentChild<TemplateRef<ListboxItemTemplateContext>>('item', { descendants: false });

    /**
     * Custom group template.
     * @param {ListboxGroupTemplateContext} context - group context.
     * @see {@link ListboxGroupTemplateContext}
     * @group Templates
     */
    readonly groupTemplate = contentChild<TemplateRef<ListboxGroupTemplateContext>>('group', { descendants: false });

    /**
     * Custom header template.
     * @param {ListboxHeaderTemplateContext} context - header context.
     * @see {@link ListboxHeaderTemplateContext}
     * @group Templates
     */
    readonly headerTemplate = contentChild<TemplateRef<ListboxHeaderTemplateContext>>('header', { descendants: false });

    /**
     * Custom filter template.
     * @param {ListboxFilterTemplateContext} context - filter context.
     * @see {@link ListboxFilterTemplateContext}
     * @group Templates
     */
    readonly filterTemplate = contentChild<TemplateRef<ListboxFilterTemplateContext>>('filter', { descendants: false });

    /**
     * Custom footer template.
     * @param {ListboxFooterTemplateContext} context - footer context.
     * @see {@link ListboxFooterTemplateContext}
     * @group Templates
     */
    readonly footerTemplate = contentChild<TemplateRef<ListboxFooterTemplateContext>>('footer', { descendants: false });

    /**
     * Custom empty filter message template.
     * @group Templates
     */
    readonly emptyFilterTemplate = contentChild<TemplateRef<void>>('emptyfilter', { descendants: false });

    /**
     * Custom empty message template.
     * @group Templates
     */
    readonly emptyTemplate = contentChild<TemplateRef<void>>('empty', { descendants: false });

    /**
     * Custom filter icon template.
     * @group Templates
     */
    readonly filterIconTemplate = contentChild<TemplateRef<void>>('filtericon', { descendants: false });

    /**
     * Custom check icon template.
     * @param {ListboxCheckIconTemplateContext} context - check icon context.
     * @see {@link ListboxCheckIconTemplateContext}
     * @group Templates
     */
    readonly checkIconTemplate = contentChild<TemplateRef<ListboxCheckIconTemplateContext>>('checkicon', { descendants: false });

    /**
     * Custom checkmark icon template.
     * @param {ListboxCheckmarkTemplateContext} context - checkmark context.
     * @see {@link ListboxCheckmarkTemplateContext}
     * @group Templates
     */
    readonly checkmarkTemplate = contentChild<TemplateRef<ListboxCheckmarkTemplateContext>>('checkmark', { descendants: false });

    /**
     * Custom loader template.
     * @param {ListboxLoaderTemplateContext} context - loader context.
     * @see {@link ListboxLoaderTemplateContext}
     * @group Templates
     */
    readonly loaderTemplate = contentChild<TemplateRef<ListboxLoaderTemplateContext>>('loader', { descendants: false });

    readonly templates = contentChildren(PrimeTemplate);

    _itemTemplate: TemplateRef<ListboxItemTemplateContext> | undefined;

    _groupTemplate: TemplateRef<ListboxGroupTemplateContext> | undefined;

    _headerTemplate: TemplateRef<ListboxHeaderTemplateContext> | undefined;

    _filterTemplate: TemplateRef<ListboxFilterTemplateContext> | undefined;

    _footerTemplate: TemplateRef<ListboxFooterTemplateContext> | undefined;

    _emptyFilterTemplate: TemplateRef<void> | undefined;

    _emptyTemplate: TemplateRef<void> | undefined;

    _filterIconTemplate: TemplateRef<void> | undefined;

    _checkIconTemplate: TemplateRef<ListboxCheckIconTemplateContext> | undefined;

    _checkmarkTemplate: TemplateRef<ListboxCheckmarkTemplateContext> | undefined;

    _loaderTemplate: TemplateRef<ListboxLoaderTemplateContext> | undefined;

    public _filterValue = signal<string | null | undefined>(null);

    public _filteredOptions: any[] | undefined | null;

    filterOptions: ListboxFilterOptions | undefined;

    public filtered: boolean | undefined | null;

    public value: any | undefined | null;

    public optionTouched: boolean | undefined | null;

    public focus: boolean | undefined | null;

    public headerCheckboxFocus: boolean | undefined | null;

    translationSubscription: Nullable<Subscription>;

    focused: boolean | undefined;

    scrollerTabIndex: string = '0';

    _componentStyle = inject(ListBoxStyle);

    get focusedOptionId() {
        return this.focusedOptionIndex() !== -1 ? `${this.$id()}_${this.focusedOptionIndex()}` : null;
    }

    get filterResultMessageText() {
        return isNotEmpty(this.visibleOptions()) ? this.filterMessageText.replaceAll('{0}', this.visibleOptions().length) : this.emptyFilterMessageText;
    }

    get filterMessageText() {
        return this.filterMessage() || this.config.translation.searchMessage || '';
    }

    get searchMessageText() {
        return this.searchMessage() || this.config.translation.searchMessage || '';
    }

    get emptyFilterMessageText() {
        return this.emptyFilterMessage() || this.config.translation.emptySearchMessage || this.config.translation.emptyFilterMessage || '';
    }

    get selectionMessageText() {
        return this.selectionMessage() || this.config.translation.selectionMessage || '';
    }

    get emptySelectionMessageText() {
        return this.emptySelectionMessage() || this.config.translation.emptySelectionMessage || '';
    }

    get selectedMessageText() {
        return this.hasSelectedOption() ? this.selectionMessageText.replaceAll('{0}', this.multiple() ? this.modelValue().length : '1') : this.emptySelectionMessageText;
    }

    get ariaSetSize() {
        return this.visibleOptions().filter((option) => !this.isOptionGroup(option)).length;
    }

    get virtualScrollerDisabled() {
        return !this.virtualScroll();
    }

    get searchFields() {
        return this.filterBy()?.split(',') || this.filterFields() || [this.optionLabel()];
    }

    get toggleAllAriaLabel() {
        return this.config.translation.aria ? this.config.translation.aria[this.allSelected() ? 'selectAll' : 'unselectAll'] : undefined;
    }

    searchValue: string | undefined;

    searchTimeout: any;

    startRangeIndex = signal<number>(-1);

    focusedOptionIndex = signal<number>(-1);

    isDragging = signal<boolean>(false);

    onHostFocusOut(event: FocusEvent) {
        this.onFocusout(event);
    }

    visibleOptions = computed(() => {
        const options = this.group() ? this.flatOptions(this._options()) : this._options() || [];
        return this._filterValue() ? this.filterService.filter(options, this.searchFields, this._filterValue(), this.filterMatchMode(), this.filterLocale()) : options;
    });

    constructor(public filterService: FilterService) {
        super();
        effect(() => {
            this._filterValue.set(this.filterValue());
        });
        effect(() => {
            this._options.set(this.options());
        });
    }

    onInit() {
        this.translationSubscription = this.config.translationObserver.subscribe(() => {
            this.cd.markForCheck();
        });

        this.autoUpdateModel();

        if (this.filterBy()) {
            this.filterOptions = {
                filter: (value) => this.onFilterChange(value),
                reset: () => this.resetFilter()
            };
        }
    }

    onAfterContentInit() {
        this.templates().forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this._itemTemplate = item.template;
                    break;

                case 'group':
                    this._groupTemplate = item.template;
                    break;

                case 'header':
                    this._headerTemplate = item.template;
                    break;

                case 'filter':
                    this._filterTemplate = item.template;
                    break;

                case 'footer':
                    this._footerTemplate = item.template;
                    break;

                case 'empty':
                    this._emptyTemplate = item.template;
                    break;

                case 'emptyfilter':
                    this._emptyFilterTemplate = item.template;
                    break;

                case 'filtericon':
                    this._filterIconTemplate = item.template;
                    break;

                case 'checkicon':
                    this._checkIconTemplate = item.template;
                    break;

                case 'checkmark':
                    this._checkmarkTemplate = item.template;
                    break;

                case 'loader':
                    this._loaderTemplate = item.template;
                    break;

                default:
                    this._itemTemplate = item.template;
                    break;
            }
        });
    }

    flatOptions(options) {
        return (options || []).reduce((result, option, index) => {
            result.push({ optionGroup: option, group: true, index });

            const optionGroupChildren = this.getOptionGroupChildren(option);

            optionGroupChildren && optionGroupChildren.forEach((o) => result.push(o));

            return result;
        }, []);
    }

    autoUpdateModel() {
        if (this.selectOnFocus() && this.autoOptionFocus() && !this.hasSelectedOption() && !this.multiple()) {
            const focusedOptionIndex = this.findFirstFocusedOptionIndex();
            this.focusedOptionIndex.set(focusedOptionIndex);
            this.onOptionSelect(null, this.visibleOptions()[this.focusedOptionIndex()]);
        }
    }
    /**
     * Updates the model value.
     * @group Method
     */
    public updateModel(value, event?) {
        this.value = value;
        this.writeModelValue(value);
        this.onModelChange(value);

        this.onChange.emit({ originalEvent: event, value: this.value });
    }

    removeOption(option) {
        return this.modelValue().filter((val) => !equals(val, this.getOptionValue(option), this.equalityKey() || ''));
    }

    onOptionSelect(event, option, index = -1) {
        if (this.$disabled() || this.isOptionDisabled(option) || this.readonly()) {
            return;
        }

        event && this.onClick.emit({ originalEvent: event, option, value: this.value });
        this.multiple() ? this.onOptionSelectMultiple(event, option) : this.onOptionSelectSingle(event, option);
        this.optionTouched = false;
        index !== -1 && this.focusedOptionIndex.set(index);
    }

    onOptionSelectMultiple(event, option) {
        let selected = this.isSelected(option);
        let value: any[] = [];
        let metaSelection = this.optionTouched ? false : this.metaKeySelection();

        if (metaSelection) {
            let metaKey = event.metaKey || event.ctrlKey;

            if (selected) {
                value = metaKey ? this.removeOption(option) : [this.getOptionValue(option)];
            } else {
                value = metaKey ? this.modelValue() || [] : [];
                value = [...(value || []), this.getOptionValue(option)];
            }
        } else {
            value = selected ? this.removeOption(option) : [...(this.modelValue() || []), this.getOptionValue(option)];
        }

        this.updateModel(value, event);
    }

    onOptionSelectSingle(event, option) {
        let selected = this.isSelected(option);
        let valueChanged = false;
        let value = null;
        let metaSelection = this.optionTouched ? false : this.metaKeySelection();

        if (metaSelection) {
            let metaKey = event.metaKey || event.ctrlKey;

            if (selected) {
                if (metaKey) {
                    value = null;
                    valueChanged = true;
                }
            } else {
                value = this.getOptionValue(option);
                valueChanged = true;
            }
        } else {
            value = selected ? null : this.getOptionValue(option);
            valueChanged = true;
        }

        if (valueChanged) {
            this.updateModel(value, event);
        }
    }

    onOptionSelectRange(event, start = -1, end = -1) {
        start === -1 && (start = this.findNearestSelectedOptionIndex(end, true));
        end === -1 && (end = this.findNearestSelectedOptionIndex(start));

        if (start !== -1 && end !== -1) {
            const rangeStart = Math.min(start, end);
            const rangeEnd = Math.max(start, end);
            const value = this.visibleOptions()
                .slice(rangeStart, rangeEnd + 1)
                .filter((option) => this.isValidOption(option))
                .map((option) => this.getOptionValue(option));

            this.updateModel(value, event);
        }
    }

    onToggleAll(event) {
        if (this.$disabled() || this.readonly()) {
            return;
        }
        focus(this.headerCheckboxViewChild()?.nativeElement);

        if (this.selectAll() !== null) {
            this.onSelectAllChange.emit({
                originalEvent: event,
                checked: !this.allSelected()
            });
        } else {
            const value = this.allSelected()
                ? []
                : this.visibleOptions()
                      .filter((option) => this.isValidOption(option))
                      .map((option) => this.getOptionValue(option));

            this.updateModel(value, event);
            this.onChange.emit({ originalEvent: event, value: this.value });
        }
    }

    allSelected() {
        return this.selectAll() !== null ? this.selectAll() : isNotEmpty(this.visibleOptions()) && this.visibleOptions().every((option) => this.isOptionGroup(option) || this.isOptionDisabled(option) || this.isSelected(option));
    }

    onOptionTouchEnd() {
        if (this.$disabled()) {
            return;
        }

        this.optionTouched = true;
    }

    onOptionMouseDown(event: MouseEvent, index: number) {
        this.changeFocusedOptionIndex(event, index);
    }

    onOptionMouseEnter(event: MouseEvent, index: number) {
        if (this.focusOnHover() && this.focused) {
            this.changeFocusedOptionIndex(event, index);
        }
    }

    onOptionDoubleClick(event: MouseEvent, option: any) {
        if (this.$disabled() || this.isOptionDisabled(option) || this.readonly()) {
            return;
        }

        this.onDblClick.emit({
            originalEvent: event,
            option: option,
            value: this.value
        });
    }

    onFirstHiddenFocus(event: FocusEvent) {
        focus(this.listViewChild()?.nativeElement);
        const firstFocusableEl = getFirstFocusableElement(this.el?.nativeElement, ':not([data-p-hidden-focusable="true"])');
        this.lastHiddenFocusableElement()?.nativeElement && (this.lastHiddenFocusableElement()!.nativeElement.tabIndex = isEmpty(firstFocusableEl) ? -1 : undefined);
        this.firstHiddenFocusableElement()?.nativeElement && (this.firstHiddenFocusableElement()!.nativeElement.tabIndex = -1);
    }

    onLastHiddenFocus(event: FocusEvent) {
        const relatedTarget = event.relatedTarget;

        if (relatedTarget === this.listViewChild()?.nativeElement) {
            const firstFocusableEl = <any>getFirstFocusableElement(this.el?.nativeElement, ':not([data-p-hidden-focusable="true"])');

            focus(firstFocusableEl);
            this.firstHiddenFocusableElement()?.nativeElement && (this.firstHiddenFocusableElement()!.nativeElement.tabIndex = undefined);
        } else {
            focus(this.firstHiddenFocusableElement()?.nativeElement);
        }
        this.lastHiddenFocusableElement()?.nativeElement && (this.lastHiddenFocusableElement()!.nativeElement.tabIndex = -1);
    }

    onFocusout(event: FocusEvent) {
        const lastHiddenFocusableElement = this.lastHiddenFocusableElement();
        const firstHiddenFocusableElement = this.firstHiddenFocusableElement();
        if (!this.el.nativeElement.contains(event.relatedTarget) && lastHiddenFocusableElement && firstHiddenFocusableElement) {
            firstHiddenFocusableElement.nativeElement.tabIndex = lastHiddenFocusableElement.nativeElement.tabIndex = undefined;
            this.scrollerTabIndex = '0';
        }
    }

    onListFocus(event: FocusEvent) {
        this.focused = true;
        const focusedOptionIndex = this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : this.autoOptionFocus() ? this.findFirstFocusedOptionIndex() : this.findSelectedOptionIndex();
        this.focusedOptionIndex.set(focusedOptionIndex);
        this.scrollInView(focusedOptionIndex);
        this.onFocus.emit(event);

        this.scrollerTabIndex = '-1';
    }

    onListBlur(event: FocusEvent) {
        this.focused = false;
        this.focusedOptionIndex.set(-1);
        this.startRangeIndex.set(-1);
        this.searchValue = '';
        this.onBlur.emit(event);
    }

    onHeaderCheckboxKeyDown(event) {
        if (this.$disabled()) {
            event.preventDefault();

            return;
        }

        switch (event.code) {
            case 'Space':
                this.onToggleAll(event);
                break;
            case 'Enter':
                this.onToggleAll(event);
                break;
            case 'Tab':
                this.onHeaderCheckboxTabKeyDown(event);
                break;
            default:
                break;
        }
    }

    onHeaderCheckboxTabKeyDown(event) {
        focus(this.listViewChild()?.nativeElement);
        event.preventDefault();
    }

    onFilterChange(event: Event) {
        let value: string = (event.target as HTMLInputElement).value?.trim();
        this._filterValue.set(value);
        this.focusedOptionIndex.set(-1);
        this.startRangeIndex.set(-1);
        this.onFilter.emit({ originalEvent: event, filter: this._filterValue() });

        !this.virtualScrollerDisabled && this.scroller()?.scrollToIndex(0);
    }

    onFilterBlur(event: FocusEvent) {
        this.focusedOptionIndex.set(-1);
        this.startRangeIndex.set(-1);
    }

    onListKeyDown(event: KeyboardEvent) {
        const metaKey = event.metaKey || event.ctrlKey;

        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            case 'ArrowUp':
                this.onArrowUpKey(event);
                break;

            case 'Home':
                this.onHomeKey(event);
                break;

            case 'End':
                this.onEndKey(event);
                break;

            case 'PageDown':
                this.onPageDownKey(event);
                break;

            case 'PageUp':
                this.onPageUpKey(event);
                break;

            case 'Enter':
            case 'Space':
            case 'NumpadEnter':
                this.onSpaceKey(event);
                break;

            case 'Tab':
                //NOOP
                break;

            case 'ShiftLeft':
            case 'ShiftRight':
                this.onShiftKey();
                break;

            default:
                if (this.multiple() && event.code === 'KeyA' && metaKey) {
                    const value = this.visibleOptions()
                        .filter((option) => this.isValidOption(option))
                        .map((option) => this.getOptionValue(option));

                    this.updateModel(value, event);

                    event.preventDefault();
                    break;
                }

                if (!metaKey && isPrintableCharacter(event.key)) {
                    this.searchOptions(event, event.key);
                    event.preventDefault();
                }

                break;
        }
    }

    onFilterKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            case 'ArrowUp':
                this.onArrowUpKey(event);
                break;

            case 'ArrowLeft':
            case 'ArrowRight':
                this.onArrowLeftKey(event, true);
                break;

            case 'Home':
                this.onHomeKey(event, true);
                break;

            case 'End':
                this.onEndKey(event, true);
                break;

            case 'Enter':
                this.onEnterKey(event);
                break;

            case 'ShiftLeft':
            case 'ShiftRight':
                this.onShiftKey();
                break;

            default:
                break;
        }
    }

    onArrowDownKey(event: KeyboardEvent) {
        const optionIndex = this.focusedOptionIndex() !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex()) : this.findFirstFocusedOptionIndex();

        if (this.multiple() && event.shiftKey) {
            this.onOptionSelectRange(event, this.startRangeIndex(), optionIndex);
        }

        this.changeFocusedOptionIndex(event, optionIndex);
        event.preventDefault();
    }

    onArrowUpKey(event: KeyboardEvent) {
        const optionIndex = this.focusedOptionIndex() !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex()) : this.findLastFocusedOptionIndex();

        if (this.multiple() && event.shiftKey) {
            this.onOptionSelectRange(event, optionIndex, this.startRangeIndex());
        }

        this.changeFocusedOptionIndex(event, optionIndex);
        event.preventDefault();
    }

    onArrowLeftKey(event: KeyboardEvent, pressedInInputText = false) {
        pressedInInputText && this.focusedOptionIndex.set(-1);
    }

    onHomeKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        if (pressedInInputText) {
            (event.currentTarget as HTMLInputElement).setSelectionRange(0, 0);
            this.focusedOptionIndex.set(-1);
        } else {
            let metaKey = event.metaKey || event.ctrlKey;
            let optionIndex = this.findFirstOptionIndex();

            if (this.multiple() && event.shiftKey && metaKey) {
                this.onOptionSelectRange(event, optionIndex, this.startRangeIndex());
            }

            this.changeFocusedOptionIndex(event, optionIndex);
        }

        event.preventDefault();
    }

    onEndKey(event: KeyboardEvent, pressedInInputText: boolean = false) {
        if (pressedInInputText) {
            const target = event.currentTarget as HTMLInputElement;
            const len = target.value.length;

            target.setSelectionRange(len, len);
            this.focusedOptionIndex.set(-1);
        } else {
            let metaKey = event.metaKey || event.ctrlKey;
            let optionIndex = this.findLastOptionIndex();

            if (this.multiple() && event.shiftKey && metaKey) {
                this.onOptionSelectRange(event, this.startRangeIndex(), optionIndex);
            }

            this.changeFocusedOptionIndex(event, optionIndex);
        }

        event.preventDefault();
    }

    onPageDownKey(event: KeyboardEvent) {
        this.scrollInView(0);
        event.preventDefault();
    }

    onPageUpKey(event: KeyboardEvent) {
        this.scrollInView(this.visibleOptions().length - 1);
        event.preventDefault();
    }

    onEnterKey(event) {
        if (this.focusedOptionIndex() !== -1) {
            if (this.multiple() && event.shiftKey) this.onOptionSelectRange(event, this.focusedOptionIndex());
            else this.onOptionSelect(event, this.visibleOptions()[this.focusedOptionIndex()]);
        }

        event.preventDefault();
    }

    onSpaceKey(event: KeyboardEvent) {
        this.onEnterKey(event);
    }

    onShiftKey() {
        const focusedOptionIndex = this.focusedOptionIndex();
        this.startRangeIndex.set(focusedOptionIndex);
    }

    getOptionGroupChildren(optionGroup) {
        const optionGroupChildren = this.optionGroupChildren();
        return optionGroupChildren ? resolveFieldData(optionGroup, optionGroupChildren) : optionGroup.items;
    }

    getOptionGroupLabel(optionGroup: any) {
        const optionGroupLabel = this.optionGroupLabel();
        return optionGroupLabel ? resolveFieldData(optionGroup, optionGroupLabel) : optionGroup && optionGroup.label !== undefined ? optionGroup.label : optionGroup;
    }

    getOptionLabel(option) {
        const optionLabel = this.optionLabel();
        return optionLabel ? resolveFieldData(option, optionLabel) : option.label != undefined ? option.label : option;
    }

    getOptionIndex(index, scrollerOptions) {
        return this.virtualScrollerDisabled ? index : scrollerOptions && scrollerOptions.getItemOptions(index)['index'];
    }

    getOptionValue(option: any) {
        const optionValue = this.optionValue();
        return optionValue ? resolveFieldData(option, optionValue) : !this.optionLabel() && option && option.value !== undefined ? option.value : option;
    }

    getAriaPosInset(index: number) {
        return (
            (this.optionGroupLabel()
                ? index -
                  this.visibleOptions()
                      .slice(0, index)
                      .filter((option) => this.isOptionGroup(option)).length
                : index) + 1
        );
    }

    getPTOptions(option: any, itemOptions: any, index: number, key: string) {
        return this.ptm(key, {
            context: {
                selected: this.isSelected(option),
                focused: this.focusedOptionIndex() === this.getOptionIndex(index, itemOptions),
                disabled: this.isOptionDisabled(option)
            }
        });
    }

    hasSelectedOption() {
        return isNotEmpty(this.modelValue());
    }

    isOptionGroup(option) {
        return this.optionGroupLabel() && option.optionGroup && option.group;
    }

    changeFocusedOptionIndex(event, index) {
        if (this.focusedOptionIndex() !== index) {
            this.focusedOptionIndex.set(index);
            this.scrollInView();

            if (this.selectOnFocus() && !this.multiple()) {
                this.onOptionSelect(event, this.visibleOptions()[index]);
            }
        }
    }

    searchOptions(event, char) {
        this.searchValue = (this.searchValue || '') + char;

        let optionIndex = -1;
        let matched = false;

        if (this.focusedOptionIndex() !== -1) {
            optionIndex = this.visibleOptions()
                .slice(this.focusedOptionIndex())
                .findIndex((option) => this.isOptionMatched(option));
            optionIndex =
                optionIndex === -1
                    ? this.visibleOptions()
                          .slice(0, this.focusedOptionIndex())
                          .findIndex((option) => this.isOptionMatched(option))
                    : optionIndex + this.focusedOptionIndex();
        } else {
            optionIndex = this.visibleOptions().findIndex((option) => this.isOptionMatched(option));
        }

        if (optionIndex !== -1) {
            matched = true;
        }

        if (optionIndex === -1 && this.focusedOptionIndex() === -1) {
            optionIndex = this.findFirstFocusedOptionIndex();
        }

        if (optionIndex !== -1) {
            this.changeFocusedOptionIndex(event, optionIndex);
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

    isOptionMatched(option) {
        return this.isValidOption(option) && this.getOptionLabel(option)?.toLocaleLowerCase(this.filterLocale()).startsWith(this.searchValue?.toLocaleLowerCase(this.filterLocale()));
    }

    scrollInView(index = -1) {
        const id = index !== -1 ? `${this.$id()}_${index}` : this.focusedOptionId;
        const element = findSingle(this.listViewChild()?.nativeElement, `li[id="${id}"]`);

        if (element) {
            element.scrollIntoView && element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        } else if (!this.virtualScrollerDisabled) {
            this.virtualScroll() && this.scroller()?.scrollToIndex(index !== -1 ? index : this.focusedOptionIndex());
        }
    }

    findFirstOptionIndex() {
        return this.visibleOptions().findIndex((option) => this.isValidOption(option));
    }

    findLastOptionIndex() {
        return findLastIndex(this.visibleOptions(), (option) => this.isValidOption(option));
    }

    findFirstFocusedOptionIndex() {
        const selectedIndex = this.findFirstSelectedOptionIndex();

        return selectedIndex < 0 ? this.findFirstOptionIndex() : selectedIndex;
    }

    findLastFocusedOptionIndex() {
        const selectedIndex = this.findLastSelectedOptionIndex();

        return selectedIndex < 0 ? this.findLastOptionIndex() : selectedIndex;
    }

    findLastSelectedOptionIndex() {
        return this.hasSelectedOption() ? findLastIndex(this.visibleOptions(), (option) => this.isValidSelectedOption(option)) : -1;
    }

    findNextOptionIndex(index) {
        const matchedOptionIndex =
            index < this.visibleOptions().length - 1
                ? this.visibleOptions()
                      .slice(index + 1)
                      .findIndex((option) => this.isValidOption(option))
                : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : index;
    }

    findNextSelectedOptionIndex(index) {
        const matchedOptionIndex =
            this.hasSelectedOption() && index < this.visibleOptions().length - 1
                ? this.visibleOptions()
                      .slice(index + 1)
                      .findIndex((option) => this.isValidSelectedOption(option))
                : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex + index + 1 : -1;
    }

    findPrevSelectedOptionIndex(index) {
        const matchedOptionIndex = this.hasSelectedOption() && index > 0 ? findLastIndex(this.visibleOptions().slice(0, index), (option) => this.isValidSelectedOption(option)) : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex : -1;
    }

    findFirstSelectedOptionIndex() {
        return this.hasSelectedOption() ? this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option)) : -1;
    }

    findPrevOptionIndex(index) {
        const matchedOptionIndex = index > 0 ? findLastIndex(this.visibleOptions().slice(0, index), (option) => this.isValidOption(option)) : -1;

        return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    }

    findSelectedOptionIndex() {
        if (this.$filled()) {
            if (this.multiple()) {
                for (let index = this.modelValue().length - 1; index >= 0; index--) {
                    const value = this.modelValue()[index];
                    const matchedOptionIndex = this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option) && this.isEquals(value, this.getOptionValue(option)));

                    if (matchedOptionIndex > -1) return matchedOptionIndex;
                }
            } else {
                return this.visibleOptions().findIndex((option) => this.isValidSelectedOption(option));
            }
        }

        return -1;
    }

    findNearestSelectedOptionIndex(index, firstCheckUp = false) {
        let matchedOptionIndex = -1;

        if (this.hasSelectedOption()) {
            if (firstCheckUp) {
                matchedOptionIndex = this.findPrevSelectedOptionIndex(index);
                matchedOptionIndex = matchedOptionIndex === -1 ? this.findNextSelectedOptionIndex(index) : matchedOptionIndex;
            } else {
                matchedOptionIndex = this.findNextSelectedOptionIndex(index);
                matchedOptionIndex = matchedOptionIndex === -1 ? this.findPrevSelectedOptionIndex(index) : matchedOptionIndex;
            }
        }

        return matchedOptionIndex > -1 ? matchedOptionIndex : index;
    }

    equalityKey() {
        return this.optionValue() ? null : this.dataKey();
    }

    isValidSelectedOption(option) {
        return this.isValidOption(option) && this.isSelected(option);
    }

    isOptionDisabled(option: any) {
        const optionDisabled = this.optionDisabled();
        if (isFunction(optionDisabled)) {
            return optionDisabled(option);
        }
        return optionDisabled ? resolveFieldData(option, optionDisabled) : false;
    }

    isEquals(value1, value2) {
        return equals(value1, value2, this.equalityKey() || '');
    }

    isSelected(option) {
        const optionValue = this.getOptionValue(option);

        if (this.multiple()) return (this.modelValue() || []).some((value) => this.isEquals(value, optionValue));
        else return this.isEquals(this.modelValue(), optionValue);
    }

    isValidOption(option) {
        return option && !(this.isOptionDisabled(option) || this.isOptionGroup(option));
    }

    isEmpty() {
        return !this._options()?.length || !this.visibleOptions()?.length;
    }

    hasFilter() {
        return this._filterValue() && (this._filterValue()?.trim().length || 0) > 0;
    }

    resetFilter() {
        const filterViewChild = this.filterViewChild();
        if (filterViewChild && filterViewChild.nativeElement) {
            filterViewChild.nativeElement.value = '';
        }

        this._filterValue.set(null);
    }

    onDragEntered() {
        this.isDragging.set(true);
        this.el.nativeElement.setAttribute('p-listbox-dragging', 'true');
    }

    onDragExited() {
        this.isDragging.set(false);
        this.el.nativeElement.setAttribute('p-listbox-dragging', 'false');
    }

    drop(event: CdkDragDrop<string[]>) {
        this.isDragging.set(false);
        if (event) {
            // If dragdrop is enabled and same container (reordering), automatically handle reordering
            if (this.dragdrop() && event.previousContainer === event.container) {
                const currentOptions = [...this._options()];
                moveItemInArray(currentOptions, event.previousIndex, event.currentIndex);
                this._options.set(currentOptions);
                this.changeFocusedOptionIndex(event, event.currentIndex);

                // Update model value if needed for selection preservation
                if (this.modelValue()) {
                    this.writeModelValue(this.modelValue());
                    this.onModelChange(this.modelValue());
                }

                // Mark for change detection
                this.cd.markForCheck();
            }

            // Always emit the event for custom handling
            this.onDrop.emit(event);
        }
    }

    get containerDataP() {
        return this.cn({
            invalid: this.invalid(),
            disabled: this.$disabled()
        });
    }

    /**
     * @override
     *
     * @see {@link BaseEditableHolder.writeControlValue}
     * Writes the value to the control.
     */
    writeControlValue(value: any, setModelValue: (value: any) => void): void {
        this.value = value;
        setModelValue(this.value);
        this.cd.markForCheck();
    }

    onDestroy() {
        if (this.translationSubscription) {
            this.translationSubscription.unsubscribe();
        }
    }
}

@NgModule({
    imports: [Listbox, SharedModule],
    exports: [Listbox, SharedModule]
})
export class ListboxModule {}
