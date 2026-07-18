import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  HostListener,
  inject,
  Injectable,
  InjectionToken,
  Input,
  NgModule,
  NgZone,
  numberAttribute,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  input,
  output,
  viewChild,
  contentChild,
  contentChildren
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    addClass,
    addStyle,
    calculateScrollbarHeight,
    calculateScrollbarWidth,
    clearSelection,
    equals,
    find,
    findSingle,
    focus,
    getAttribute,
    getHiddenElementOuterHeight,
    getHiddenElementOuterWidth,
    getIndex,
    getOffset,
    invokeElementMethod,
    isClickable,
    isEmpty,
    isNotEmpty,
    removeClass,
    reorderArray,
    resolveFieldData
} from '@primeuix/utils';
import { BlockableUI, FilterMetadata, FilterService, PrimeTemplate, ScrollerOptions, SharedModule, SortMeta, TreeNode, TreeTableNode } from '@gravionlabs/helix/api';
import { BadgeModule } from '@gravionlabs/helix/badge';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import { Checkbox } from '@gravionlabs/helix/checkbox';
import { DomHandler } from '@gravionlabs/helix/dom';
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, ChevronDownIcon, ChevronRightIcon, SortAltIcon, SortAmountDownIcon, SortAmountUpAltIcon, SpinnerIcon } from '@gravionlabs/helix/icons';
import { PaginatorModule } from '@gravionlabs/helix/paginator';
import { Ripple } from '@gravionlabs/helix/ripple';
import { Scroller } from '@gravionlabs/helix/scroller';
import { Nullable, VoidListener } from '@gravionlabs/helix/ts-helpers';
import {
    TreeTableBodyTemplateContext,
    TreeTableCheckboxIconTemplateContext,
    TreeTableColResizeEvent,
    TreeTableColumnReorderEvent,
    TreeTableColumnsTemplateContext,
    TreeTableContextMenuSelectEvent,
    TreeTableEditEvent,
    TreeTableEmptyMessageTemplateContext,
    TreeTableFilterEvent,
    TreeTableFilterOptions,
    TreeTableHeaderCheckboxIconTemplateContext,
    TreeTableHeaderCheckboxToggleEvent,
    TreeTableLazyLoadEvent,
    TreeTableNodeCollapseEvent,
    TreeTableNodeExpandEvent,
    TreeTableNodeUnSelectEvent,
    TreeTablePaginatorState,
    TreeTablePassThrough,
    TreeTableSortEvent,
    TreeTableSortIconTemplateContext,
    TreeTableTogglerIconTemplateContext
} from '@gravionlabs/helix/types/treetable';
import { Subject, Subscription } from 'rxjs';
import { TreeTableStyle } from './style/treetablestyle';

const TREETABLE_INSTANCE = new InjectionToken<TreeTable>('TREETABLE_INSTANCE');

@Injectable()
export class TreeTableService {
    private sortSource = new Subject<SortMeta | SortMeta[] | null>();
    private selectionSource = new Subject();
    private contextMenuSource = new Subject<any>();
    private uiUpdateSource = new Subject<any>();
    private totalRecordsSource = new Subject<any>();

    sortSource$ = this.sortSource.asObservable();
    selectionSource$ = this.selectionSource.asObservable();
    contextMenuSource$ = this.contextMenuSource.asObservable();
    uiUpdateSource$ = this.uiUpdateSource.asObservable();
    totalRecordsSource$ = this.totalRecordsSource.asObservable();

    onSort(sortMeta: SortMeta | SortMeta[] | null) {
        this.sortSource.next(sortMeta);
    }

    onSelectionChange() {
        this.selectionSource.next(null);
    }

    onContextMenu(node: any) {
        this.contextMenuSource.next(node);
    }

    onUIUpdate(value: any) {
        this.uiUpdateSource.next(value);
    }

    onTotalRecordsChange(value: number) {
        this.totalRecordsSource.next(value);
    }
}

/**
 * TreeTable is used to display hierarchical data in tabular format.
 * @group Components
 */
@Component({
    selector: 'h-treeTable, h-treetable, h-tree-table',
    standalone: false,
    templateUrl: './treetable.html',
    providers: [TreeTableService, TreeTableStyle, { provide: TREETABLE_INSTANCE, useExisting: TreeTable }, { provide: PARENT_INSTANCE, useExisting: TreeTable }],
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[attr.data-p]': 'dataP',
        '[attr.data-scrollselectors]': "'.p-treetable-scrollable-body'"
    },
    changeDetection: ChangeDetectionStrategy.Eager,
    hostDirectives: [Bind]
})
export class TreeTable extends BaseComponent<TreeTablePassThrough> implements BlockableUI {
    componentName = 'TreeTable';

    _componentStyle = inject(TreeTableStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }
    /**
     * An array of objects to represent dynamic columns.
     * @group Props
     */
    readonly columns = input<any[]>();
    /**
     * Style class of the component.
     * @deprecated since v20.0.0, use `class` instead.
     * @group Props
     */
    readonly styleClass = input<string>();
    /**
     * Inline style of the table.
     * @group Props
     */
    readonly tableStyle = input<{
    [klass: string]: any;
} | null>();
    /**
     * Style class of the table.
     * @group Props
     */
    readonly tableStyleClass = input<string>();
    /**
     * Whether the cell widths scale according to their content or not.
     * @group Props
     */
    readonly autoLayout = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Defines if data is loaded and interacted with in lazy manner.
     * @group Props
     */
    readonly lazy = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Whether to call lazy loading on initialization.
     * @group Props
     */
    readonly lazyLoadOnInit = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * When specified as true, enables the pagination.
     * @group Props
     */
    readonly paginator = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Number of rows to display per page.
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input({ transform: numberAttribute }) rows: number | undefined;
    /**
     * Index of the first row to be displayed.
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input({ transform: numberAttribute }) first: number = 0;
    /**
     * Number of page links to display in paginator.
     * @group Props
     */
    readonly pageLinks = input<number, unknown>(5, { transform: numberAttribute });
    /**
     * Array of integer/object values to display inside rows per page dropdown of paginator
     * @group Props
     */
    readonly rowsPerPageOptions = input<any[]>();
    /**
     * Whether to show it even there is only one page.
     * @group Props
     */
    readonly alwaysShowPaginator = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Position of the paginator.
     * @group Props
     */
    readonly paginatorPosition = input<'top' | 'bottom' | 'both'>('bottom');
    /**
     * Custom style class for paginator
     * @group Props
     */
    readonly paginatorStyleClass = input<string>();
    /**
     * Target element to attach the paginator dropdown overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
     * @group Props
     */
    readonly paginatorDropdownAppendTo = input<HTMLElement | ElementRef | TemplateRef<any> | string | null | any>();
    /**
     * Template of the current page report element. Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords}
     * @group Props
     */
    readonly currentPageReportTemplate = input<string>('{currentPage} of {totalPages}');
    /**
     * Whether to display current page report.
     * @group Props
     */
    readonly showCurrentPageReport = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether to display a dropdown to navigate to any page.
     * @group Props
     */
    readonly showJumpToPageDropdown = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * When enabled, icons are displayed on paginator to go first and last page.
     * @group Props
     */
    readonly showFirstLastIcon = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether to show page links.
     * @group Props
     */
    readonly showPageLinks = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Sort order to use when an unsorted column gets sorted by user interaction.
     * @group Props
     */
    readonly defaultSortOrder = input<number, unknown>(1, { transform: numberAttribute });
    /**
     * Defines whether sorting works on single column or on multiple columns.
     * @group Props
     */
    readonly sortMode = input<'single' | 'multiple'>('single');
    /**
     * When true, resets paginator to first page after sorting.
     * @group Props
     */
    readonly resetPageOnSort = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Whether to use the default sorting or a custom one using sortFunction.
     * @group Props
     */
    readonly customSort = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Specifies the selection mode, valid values are "single" and "multiple".
     * @group Props
     */
    readonly selectionMode = input<string>();
    /**
     * Selected row with a context menu.
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input() contextMenuSelection: any;
    /**
     * Mode of the contet menu selection.
     * @group Props
     */
    readonly contextMenuSelectionMode = input<string>('separate');
    /**
     * A property to uniquely identify a record in data.
     * @group Props
     */
    readonly dataKey = input<string>();
    /**
     * Defines whether metaKey is should be considered for the selection. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    readonly metaKeySelection = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
    /**
     * Algorithm to define if a row is selected, valid values are "equals" that compares by reference and "deepEquals" that compares all fields.
     * @group Props
     */
    readonly compareSelectionBy = input<string>('deepEquals');
    /**
     * Adds hover effect to rows without the need for selectionMode.
     * @group Props
     */
    readonly rowHover = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Displays a loader to indicate data load is in progress.
     * @group Props
     */
    readonly loading = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * The icon to show while indicating data load is in progress.
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    @Input() loadingIcon: string | undefined;
    /**
     * Whether to show the loading mask when loading property is true.
     * @group Props
     */
    readonly showLoader = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * When specified, enables horizontal and/or vertical scrolling.
     * @group Props
     */
    readonly scrollable = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Height of the scroll viewport in fixed pixels or the "flex" keyword for a dynamic size.
     * @group Props
     */
    readonly scrollHeight = input<string>();
    /**
     * Whether the data should be loaded on demand during scroll.
     * @group Props
     */
    readonly virtualScroll = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Height of a row to use in calculations of virtual scrolling.
     * @group Props
     */
    readonly virtualScrollItemSize = input<number, unknown>(undefined, { transform: numberAttribute });
    /**
     * Whether to use the scroller feature. The properties of scroller component can be used like an object in it.
     * @group Props
     */
    readonly virtualScrollOptions = input<ScrollerOptions>();
    /**
     * The delay (in milliseconds) before triggering the virtual scroll. This determines the time gap between the user's scroll action and the actual rendering of the next set of items in the virtual scroll.
     * @group Props
     */
    readonly virtualScrollDelay = input<number, unknown>(150, { transform: numberAttribute });
    /**
     * Width of the frozen columns container.
     * @group Props
     */
    readonly frozenWidth = input<string>();
    /**
     * An array of objects to represent dynamic columns that are frozen.
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
    //  and migrating would break narrowing currently.
    @Input() frozenColumns: { [klass: string]: any } | null | undefined;
    /**
     * When enabled, columns can be resized using drag and drop.
     * @group Props
     */
    readonly resizableColumns = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Defines whether the overall table width should change on column resize, valid values are "fit" and "expand".
     * @group Props
     */
    readonly columnResizeMode = input<string>('fit');
    /**
     * When enabled, columns can be reordered using drag and drop.
     * @group Props
     */
    readonly reorderableColumns = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Local ng-template varilable of a ContextMenu.
     * @group Props
     */
    readonly contextMenu = input<any>();
    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity.
     * @group Props
     */
    readonly rowTrackBy = input<Function>((index: number, item: any) => item);
    /**
     * An array of FilterMetadata objects to provide external filters.
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  Your application code writes to the input. This prevents migration.
    @Input() filters: { [s: string]: FilterMetadata | undefined } = {};
    /**
     * An array of fields as string to use in global filtering.
     * @group Props
     */
    readonly globalFilterFields = input<string[]>();
    /**
     * Delay in milliseconds before filtering the data.
     * @group Props
     */
    readonly filterDelay = input<number, unknown>(300, { transform: numberAttribute });
    /**
     * Mode for filtering valid values are "lenient" and "strict". Default is lenient.
     * @group Props
     */
    readonly filterMode = input<string>('lenient');
    /**
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    readonly filterLocale = input<string>();
    /**
     * Locale to be used in paginator formatting.
     * @group Props
     */
    readonly paginatorLocale = input<string>();
    /**
     * Number of total records, defaults to length of value when not defined.
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  Accessor inputs cannot be migrated as they are too complex.
    @Input() get totalRecords(): number {
        return this._totalRecords;
    }
    set totalRecords(val: number) {
        this._totalRecords = val;
        this.tableService.onTotalRecordsChange(this._totalRecords);
    }
    /**
     * Name of the field to sort data by default.
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  Accessor inputs cannot be migrated as they are too complex.
    @Input() get sortField(): string | undefined | null {
        return this._sortField;
    }
    set sortField(val: string | undefined | null) {
        this._sortField = val;
    }
    /**
     * Order to sort when default sorting is enabled.
     * @defaultValue 1
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  Accessor inputs cannot be migrated as they are too complex.
    @Input() get sortOrder(): number {
        return this._sortOrder;
    }
    set sortOrder(val: number) {
        this._sortOrder = val;
    }
    /**
     * An array of SortMeta objects to sort the data by default in multiple sort mode.
     * @defaultValue null
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  Accessor inputs cannot be migrated as they are too complex.
    @Input() get multiSortMeta(): SortMeta[] | undefined | null {
        return this._multiSortMeta;
    }
    set multiSortMeta(val: SortMeta[] | undefined | null) {
        this._multiSortMeta = val;
    }
    /**
     * Selected row in single mode or an array of values in multiple mode.
     * @defaultValue null
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  Accessor inputs cannot be migrated as they are too complex.
    @Input() get selection(): any {
        return this._selection;
    }
    set selection(val: any) {
        this._selection = val;
    }
    /**
     * An array of objects to display.
     * @defaultValue null
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  Accessor inputs cannot be migrated as they are too complex.
    @Input() get value(): TreeNode<any>[] | undefined {
        return this._value;
    }
    set value(val: TreeNode<any>[] | undefined) {
        this._value = val;
    }
    /**
     * Indicates the height of rows to be scrolled.
     * @defaultValue 28
     * @group Props
     * @deprecated use virtualScrollItemSize property instead.
     */
    // TODO: Skipped for migration because:
    //  Accessor inputs cannot be migrated as they are too complex.
    @Input() get virtualRowHeight(): number {
        return this._virtualRowHeight;
    }
    set virtualRowHeight(val: number) {
        this._virtualRowHeight = val;
        console.log('The virtualRowHeight property is deprecated, use virtualScrollItemSize property instead.');
    }
    /**
     * A map of keys to control the selection state.
     * @group Props
     */
    // TODO: Skipped for migration because:
    //  Accessor inputs cannot be migrated as they are too complex.
    @Input() get selectionKeys(): any {
        return this._selectionKeys;
    }
    set selectionKeys(value: any) {
        this._selectionKeys = value;
        this.selectionKeysChange.emit(this._selectionKeys);
    }
    /**
     * Whether to show grid lines between cells.
     * @defaultValue false
     * @group Props
     */
    readonly showGridlines = input<boolean, unknown>(false, { transform: booleanAttribute });
    /**
     * Callback to invoke on selected node change.
     * @param {TreeTableNode} object - Node instance.
     * @group Emits
     */
    readonly selectionChange = output<TreeTableNode<any> | TreeTableNode<any>[] | null>();
    /**
     * Callback to invoke on context menu selection change.
     * @param {TreeTableNode} object - Node instance.
     * @group Emits
     */
    readonly contextMenuSelectionChange = output<TreeTableNode>();
    /**
     * Callback to invoke when data is filtered.
     * @param {TreeTableFilterEvent} event - Custom filter event.
     * @group Emits
     */
    readonly onFilter = output<TreeTableFilterEvent>();
    /**
     * Callback to invoke when a node is expanded.
     * @param {TreeTableNodeExpandEvent} event - Node expand event.
     * @group Emits
     */
    readonly onNodeExpand = output<TreeTableNodeExpandEvent>();
    /**
     * Callback to invoke when a node is collapsed.
     * @param {TreeTableNodeCollapseEvent} event - Node collapse event.
     * @group Emits
     */
    readonly onNodeCollapse = output<TreeTableNodeCollapseEvent>();
    /**
     * Callback to invoke when pagination occurs.
     * @param {TreeTablePaginatorState} object - Paginator state.
     * @group Emits
     */
    readonly onPage = output<TreeTablePaginatorState>();
    /**
     * Callback to invoke when a column gets sorted.
     * @param {Object} Object - Sort data.
     * @group Emits
     */
    readonly onSort = output<any>();
    /**
     * Callback to invoke when paging, sorting or filtering happens in lazy mode.
     * @param {TreeTableLazyLoadEvent} event - Custom lazy load event.
     * @group Emits
     */
    readonly onLazyLoad = output<TreeTableLazyLoadEvent>();
    /**
     * An event emitter to invoke on custom sorting, refer to sorting section for details.
     * @param {TreeTableSortEvent} event - Custom sort event.
     * @group Emits
     */
    readonly sortFunction = output<TreeTableSortEvent>();
    /**
     * Callback to invoke when a column is resized.
     * @param {TreeTableColResizeEvent} event - Custom column resize event.
     * @group Emits
     */
    readonly onColResize = output<TreeTableColResizeEvent>();
    /**
     * Callback to invoke when a column is reordered.
     * @param {TreeTableColumnReorderEvent} event - Custom column reorder.
     * @group Emits
     */
    readonly onColReorder = output<TreeTableColumnReorderEvent>();
    /**
     * Callback to invoke when a node is selected.
     * @param {TreeTableNode} object - Node instance.
     * @group Emits
     */
    readonly onNodeSelect = output<TreeTableNode>();
    /**
     * Callback to invoke when a node is unselected.
     * @param {TreeTableNodeUnSelectEvent} event - Custom node unselect event.
     * @group Emits
     */
    readonly onNodeUnselect = output<TreeTableNodeUnSelectEvent>();
    /**
     * Callback to invoke when a node is selected with right click.
     * @param {TreeTableContextMenuSelectEvent} event - Custom context menu select event.
     * @group Emits
     */
    readonly onContextMenuSelect = output<TreeTableContextMenuSelectEvent>();
    /**
     * Callback to invoke when state of header checkbox changes.
     * @param {TreeTableHeaderCheckboxToggleEvent} event - Custom checkbox toggle event.
     * @group Emits
     */
    readonly onHeaderCheckboxToggle = output<TreeTableHeaderCheckboxToggleEvent>();
    /**
     * Callback to invoke when a cell switches to edit mode.
     * @param {TreeTableEditEvent} event - Custom edit event.
     * @group Emits
     */
    readonly onEditInit = output<TreeTableEditEvent>();
    /**
     * Callback to invoke when cell edit is completed.
     * @param {TreeTableEditEvent} event - Custom edit event.
     * @group Emits
     */
    readonly onEditComplete = output<TreeTableEditEvent>();
    /**
     * Callback to invoke when cell edit is cancelled with escape key.
     * @param {TreeTableEditEvent} event - Custom edit event.
     * @group Emits
     */
    readonly onEditCancel = output<TreeTableEditEvent>();
    /**
     * Callback to invoke when selectionKeys are changed.
     * @param {Object} object - updated value of the selectionKeys.
     * @group Emits
     */
    readonly selectionKeysChange = output<any>();

    readonly resizeHelperViewChild = viewChild<Nullable<ElementRef>>('resizeHelper');

    readonly reorderIndicatorUpViewChild = viewChild<Nullable<ElementRef>>('reorderIndicatorUp');

    readonly reorderIndicatorDownViewChild = viewChild<Nullable<ElementRef>>('reorderIndicatorDown');

    readonly tableViewChild = viewChild<Nullable<ElementRef>>('table');

    readonly scrollableViewChild = viewChild<Nullable<ElementRef>>('scrollableView');

    readonly scrollableFrozenViewChild = viewChild<Nullable<ElementRef>>('scrollableFrozenView');

    _value: TreeNode<any>[] | undefined = [];

    _virtualRowHeight: number = 28;

    _selectionKeys: any;

    serializedValue: any[] | undefined | null;

    _totalRecords: number = 0;

    _multiSortMeta: SortMeta[] | undefined | null;

    _sortField: string | undefined | null;

    _sortOrder: number = 1;

    filteredNodes: Nullable<any[]>;

    filterTimeout: any;

    readonly _colGroupTemplate = contentChild<Nullable<TemplateRef<TreeTableColumnsTemplateContext>>>('colgroup', { descendants: false });
    colGroupTemplate: Nullable<TemplateRef<TreeTableColumnsTemplateContext>>;

    @ContentChild('caption', { descendants: false }) _captionTemplate: Nullable<TemplateRef<void>>;
    captionTemplate: Nullable<TemplateRef<void>>;

    readonly _headerTemplate = contentChild<Nullable<TemplateRef<TreeTableColumnsTemplateContext>>>('header', { descendants: false });
    headerTemplate: Nullable<TemplateRef<TreeTableColumnsTemplateContext>>;

    readonly _bodyTemplate = contentChild<Nullable<TemplateRef<TreeTableBodyTemplateContext>>>('body', { descendants: false });
    bodyTemplate: Nullable<TemplateRef<TreeTableBodyTemplateContext>>;

    @ContentChild('footer', { descendants: false }) _footerTemplate: Nullable<TemplateRef<TreeTableColumnsTemplateContext>>;
    footerTemplate: Nullable<TemplateRef<TreeTableColumnsTemplateContext>>;

    @ContentChild('summary', { descendants: false }) _summaryTemplate: Nullable<TemplateRef<void>>;
    summaryTemplate: Nullable<TemplateRef<void>>;

    readonly _emptyMessageTemplate = contentChild<Nullable<TemplateRef<TreeTableEmptyMessageTemplateContext>>>('emptymessage', { descendants: false });
    emptyMessageTemplate: Nullable<TemplateRef<TreeTableEmptyMessageTemplateContext>>;

    readonly _paginatorLeftTemplate = contentChild<Nullable<TemplateRef<void>>>('paginatorleft', { descendants: false });
    paginatorLeftTemplate: Nullable<TemplateRef<void>>;

    readonly _paginatorRightTemplate = contentChild<Nullable<TemplateRef<void>>>('paginatorright', { descendants: false });
    paginatorRightTemplate: Nullable<TemplateRef<void>>;

    readonly _paginatorDropdownItemTemplate = contentChild<Nullable<TemplateRef<void>>>('paginatordropdownitem', { descendants: false });
    paginatorDropdownItemTemplate: Nullable<TemplateRef<void>>;

    readonly _frozenHeaderTemplate = contentChild<Nullable<TemplateRef<TreeTableColumnsTemplateContext>>>('frozenheader', { descendants: false });
    frozenHeaderTemplate: Nullable<TemplateRef<TreeTableColumnsTemplateContext>>;

    readonly _frozenBodyTemplate = contentChild<Nullable<TemplateRef<void>>>('frozenbody', { descendants: false });
    frozenBodyTemplate: Nullable<TemplateRef<void>>;

    readonly _frozenFooterTemplate = contentChild<Nullable<TemplateRef<TreeTableColumnsTemplateContext>>>('frozenfooter', { descendants: false });
    frozenFooterTemplate: Nullable<TemplateRef<TreeTableColumnsTemplateContext>>;

    readonly _frozenColGroupTemplate = contentChild<Nullable<TemplateRef<TreeTableColumnsTemplateContext>>>('frozencolgroup', { descendants: false });
    frozenColGroupTemplate: Nullable<TemplateRef<TreeTableColumnsTemplateContext>>;

    @ContentChild('loadingicon', { descendants: false }) _loadingIconTemplate: Nullable<TemplateRef<void>>;
    loadingIconTemplate: Nullable<TemplateRef<void>>;

    readonly _reorderIndicatorUpIconTemplate = contentChild<Nullable<TemplateRef<void>>>('reorderindicatorupicon', { descendants: false });
    reorderIndicatorUpIconTemplate: Nullable<TemplateRef<void>>;

    readonly _reorderIndicatorDownIconTemplate = contentChild<Nullable<TemplateRef<void>>>('reorderindicatordownicon', { descendants: false });
    reorderIndicatorDownIconTemplate: Nullable<TemplateRef<void>>;

    @ContentChild('sorticon', { descendants: false }) _sortIconTemplate: Nullable<TemplateRef<TreeTableSortIconTemplateContext>>;
    sortIconTemplate: Nullable<TemplateRef<TreeTableSortIconTemplateContext>>;

    @ContentChild('checkboxicon', { descendants: false }) _checkboxIconTemplate: Nullable<TemplateRef<TreeTableCheckboxIconTemplateContext>>;
    checkboxIconTemplate: Nullable<TemplateRef<TreeTableCheckboxIconTemplateContext>>;

    @ContentChild('headercheckboxicon', { descendants: false }) _headerCheckboxIconTemplate: Nullable<TemplateRef<TreeTableHeaderCheckboxIconTemplateContext>>;
    headerCheckboxIconTemplate: Nullable<TemplateRef<TreeTableHeaderCheckboxIconTemplateContext>>;

    readonly _togglerIconTemplate = contentChild<Nullable<TemplateRef<TreeTableTogglerIconTemplateContext>>>('togglericon', { descendants: false });
    togglerIconTemplate: Nullable<TemplateRef<TreeTableTogglerIconTemplateContext>>;

    @ContentChild('paginatorfirstpagelinkicon', { descendants: false }) _paginatorFirstPageLinkIconTemplate: Nullable<TemplateRef<void>>;
    paginatorFirstPageLinkIconTemplate: Nullable<TemplateRef<void>>;

    @ContentChild('paginatorlastpagelinkicon', { descendants: false }) _paginatorLastPageLinkIconTemplate: Nullable<TemplateRef<void>>;
    paginatorLastPageLinkIconTemplate: Nullable<TemplateRef<void>>;

    @ContentChild('paginatorpreviouspagelinkicon', { descendants: false }) _paginatorPreviousPageLinkIconTemplate: Nullable<TemplateRef<void>>;
    paginatorPreviousPageLinkIconTemplate: Nullable<TemplateRef<void>>;

    @ContentChild('paginatornextpagelinkicon', { descendants: false }) _paginatorNextPageLinkIconTemplate: Nullable<TemplateRef<void>>;
    paginatorNextPageLinkIconTemplate: Nullable<TemplateRef<void>>;

    @ContentChild('loader', { descendants: false }) _loaderTemplate: Nullable<TemplateRef<void>>;
    loaderTemplate: Nullable<TemplateRef<void>>;

    lastResizerHelperX: Nullable<number>;

    reorderIconWidth: Nullable<number>;

    reorderIconHeight: Nullable<number>;

    draggedColumn: Nullable<any[]>;

    dropPosition: Nullable<number>;

    preventSelectionSetterPropagation: Nullable<boolean>;

    _selection: any;

    selectedKeys: any = {};

    rowTouched: Nullable<boolean>;

    editingCell: Nullable<Element>;

    editingCellData: any | undefined | null;

    editingCellField: any | undefined | null;

    editingCellClick: Nullable<boolean>;

    documentEditListener: VoidListener;

    initialized: Nullable<boolean>;

    toggleRowIndex: Nullable<number>;

    onInit() {
        if (this.lazy() && this.lazyLoadOnInit() && !this.virtualScroll()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }
        this.initialized = true;
    }

    readonly templates = contentChildren(PrimeTemplate);

    onAfterContentInit() {
        this.templates().forEach((item) => {
            switch (item.getType()) {
                case 'caption':
                    this.captionTemplate = item.template;
                    break;

                case 'header':
                    this.headerTemplate = item.template;
                    break;

                case 'body':
                    this.bodyTemplate = item.template;
                    break;

                case 'footer':
                    this.footerTemplate = item.template;
                    break;

                case 'summary':
                    this.summaryTemplate = item.template;
                    break;

                case 'colgroup':
                    this.colGroupTemplate = item.template;
                    break;

                case 'emptymessage':
                    this.emptyMessageTemplate = item.template;
                    break;

                case 'paginatorleft':
                    this.paginatorLeftTemplate = item.template;
                    break;

                case 'paginatorright':
                    this.paginatorRightTemplate = item.template;
                    break;

                case 'paginatordropdownitem':
                    this.paginatorDropdownItemTemplate = item.template;
                    break;

                case 'frozenheader':
                    this.frozenHeaderTemplate = item.template;
                    break;

                case 'frozenbody':
                    this.frozenBodyTemplate = item.template;
                    break;

                case 'frozenfooter':
                    this.frozenFooterTemplate = item.template;
                    break;

                case 'frozencolgroup':
                    this.frozenColGroupTemplate = item.template;
                    break;

                case 'loadingicon':
                    this.loadingIconTemplate = item.template;
                    break;

                case 'reorderindicatorupicon':
                    this.reorderIndicatorUpIconTemplate = item.template;
                    break;

                case 'reorderindicatordownicon':
                    this.reorderIndicatorDownIconTemplate = item.template;
                    break;

                case 'sorticon':
                    this.sortIconTemplate = item.template;
                    break;

                case 'checkboxicon':
                    this.checkboxIconTemplate = item.template;
                    break;

                case 'headercheckboxicon':
                    this.headerCheckboxIconTemplate = item.template;
                    break;

                case 'togglericon':
                    this.togglerIconTemplate = item.template;
                    break;

                case 'paginatorfirstpagelinkicon':
                    this.paginatorFirstPageLinkIconTemplate = item.template;
                    break;

                case 'paginatorlastpagelinkicon':
                    this.paginatorLastPageLinkIconTemplate = item.template;
                    break;

                case 'paginatorpreviouspagelinkicon':
                    this.paginatorPreviousPageLinkIconTemplate = item.template;
                    break;

                case 'paginatornextpagelinkicon':
                    this.paginatorNextPageLinkIconTemplate = item.template;
                    break;

                case 'loader':
                    this.loaderTemplate = item.template;
                    break;
            }
        });
    }

    filterService = inject(FilterService);

    tableService = inject(TreeTableService);

    zone = inject(NgZone);

    onChanges(simpleChange: SimpleChanges) {
        if (simpleChange.value) {
            this._value = simpleChange.value.currentValue;

            if (!this.lazy()) {
                this.totalRecords = this._value ? this._value.length : 0;

                const sortMode = this.sortMode();
                if (sortMode == 'single' && this.sortField) this.sortSingle();
                else if (sortMode == 'multiple' && this.multiSortMeta) this.sortMultiple();
                else if (this.hasFilter())
                    //sort already filters
                    this._filter();
            }

            this.updateSerializedValue();
            this.tableService.onUIUpdate(this.value);
        }

        const lazy = this.lazy();
        const sortMode = this.sortMode();
        if (simpleChange.sortField) {
            this._sortField = simpleChange.sortField.currentValue;

            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!lazy || this.initialized) {
                if (sortMode === 'single') {
                    this.sortSingle();
                }
            }
        }

        if (simpleChange.sortOrder) {
            this._sortOrder = simpleChange.sortOrder.currentValue;

            //avoid triggering lazy load prior to lazy initialization at onInit
            if (!lazy || this.initialized) {
                if (sortMode === 'single') {
                    this.sortSingle();
                }
            }
        }

        if (simpleChange.multiSortMeta) {
            this._multiSortMeta = simpleChange.multiSortMeta.currentValue;
            if (sortMode === 'multiple') {
                this.sortMultiple();
            }
        }

        if (simpleChange.selection) {
            this._selection = simpleChange.selection.currentValue;

            if (!this.preventSelectionSetterPropagation) {
                this.updateselectedKeys();
                this.tableService.onSelectionChange();
            }
            this.preventSelectionSetterPropagation = false;
        }
    }

    updateSerializedValue() {
        this.serializedValue = [];

        if (this.paginator()) this.serializePageNodes();
        else this.serializeNodes(null, this.filteredNodes || this.value, 0, true);
    }

    serializeNodes(parent: Nullable<TreeTableNode>, nodes: Nullable<TreeNode[]>, level: Nullable<number>, visible: Nullable<boolean>) {
        if (nodes && nodes.length) {
            for (let node of nodes) {
                node.parent = <TreeTableNode>parent;
                const rowNode = {
                    node: node,
                    parent: parent,
                    level: level,
                    visible: visible && (parent ? parent.expanded : true)
                };
                (<TreeNode[]>this.serializedValue).push(<TreeTableNode>rowNode);

                if (rowNode.visible && node.expanded) {
                    this.serializeNodes(node, node.children, <number>level + 1, rowNode.visible);
                }
            }
        }
    }

    serializePageNodes() {
        let data = this.filteredNodes || this.value;
        this.serializedValue = [];
        if (data && data.length) {
            const first = this.lazy() ? 0 : this.first;

            for (let i = first; i < first + <number>this.rows; i++) {
                let node = data[i];
                if (node) {
                    this.serializedValue.push({
                        node: node,
                        parent: <any>null,
                        level: 0,
                        visible: true
                    });

                    this.serializeNodes(node, node.children, 1, true);
                }
            }
        }
    }

    updateselectedKeys() {
        const dataKey = this.dataKey();
        if (dataKey && this._selection) {
            this.selectedKeys = {};
            if (Array.isArray(this._selection)) {
                for (let node of this._selection) {
                    this.selectedKeys[String(resolveFieldData(node.data, dataKey))] = 1;
                }
            } else {
                this.selectedKeys[String(resolveFieldData((<any>this._selection).data, dataKey))] = 1;
            }
        }
    }

    onPageChange(event: TreeTablePaginatorState) {
        this.first = <number>event.first;
        this.rows = <number>event.rows;

        if (this.lazy()) this.onLazyLoad.emit(this.createLazyLoadMetadata());
        else this.serializePageNodes();

        this.onPage.emit({
            first: this.first,
            rows: this.rows
        });

        this.tableService.onUIUpdate(this.value);

        if (this.scrollable()) {
            this.resetScrollTop();
        }
    }

    sort(event: TreeTableSortEvent) {
        let originalEvent = event.originalEvent;

        const sortMode = this.sortMode();
        const scrollable = this.scrollable();
        const resetPageOnSort = this.resetPageOnSort();
        if (sortMode === 'single') {
            this._sortOrder = this.sortField === event.field ? this.sortOrder * -1 : this.defaultSortOrder();
            this._sortField = event.field;
            this.sortSingle();

            if (resetPageOnSort && scrollable) {
                this.resetScrollTop();
            }
        }
        if (sortMode === 'multiple') {
            let metaKey = (<KeyboardEvent>originalEvent).metaKey || (<KeyboardEvent>originalEvent).ctrlKey;
            let sortMeta = this.getSortMeta(<string>event.field);

            if (sortMeta) {
                if (!metaKey) {
                    this._multiSortMeta = [{ field: <string>event.field, order: sortMeta.order * -1 }];

                    if (resetPageOnSort && scrollable) {
                        this.resetScrollTop();
                    }
                } else {
                    sortMeta.order = sortMeta.order * -1;
                }
            } else {
                if (!metaKey || !this.multiSortMeta) {
                    this._multiSortMeta = [];

                    if (resetPageOnSort && scrollable) {
                        this.resetScrollTop();
                    }
                }
                (<SortMeta[]>this.multiSortMeta).push({ field: <string>event.field, order: this.defaultSortOrder() });
            }

            this.sortMultiple();
        }
    }

    sortSingle() {
        if (this.sortField && this.sortOrder) {
            if (this.lazy()) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            } else if (this.value) {
                this.sortNodes(this.value);

                if (this.hasFilter()) {
                    this._filter();
                }
            }

            let sortMeta: SortMeta = {
                field: this.sortField,
                order: this.sortOrder
            };

            this.onSort.emit(sortMeta);
            this.tableService.onSort(sortMeta);
            this.updateSerializedValue();
        }
    }

    sortNodes(nodes: TreeNode[]) {
        if (!nodes || nodes.length === 0) {
            return;
        }

        if (this.customSort()) {
            this.sortFunction.emit({
                data: nodes,
                mode: this.sortMode(),
                field: <string>this.sortField,
                order: this.sortOrder
            });
        } else {
            nodes.sort((node1, node2) => {
                let value1 = resolveFieldData(node1.data, this.sortField);
                let value2 = resolveFieldData(node2.data, this.sortField);
                let result: number = 0;

                if (value1 == null && value2 != null) result = -1;
                else if (value1 != null && value2 == null) result = 1;
                else if (value1 == null && value2 == null) result = 0;
                else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2, undefined, { numeric: true });
                else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

                return this.sortOrder * result;
            });
        }

        for (let node of nodes) {
            this.sortNodes(node.children as TreeNode[]);
        }
    }

    sortMultiple() {
        if (this.multiSortMeta) {
            if (this.lazy()) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            } else if (this.value) {
                this.sortMultipleNodes(this.value);

                if (this.hasFilter()) {
                    this._filter();
                }
            }

            this.onSort.emit({
                multisortmeta: this.multiSortMeta
            });
            this.updateSerializedValue();
            this.tableService.onSort(this.multiSortMeta);
        }
    }

    sortMultipleNodes(nodes: TreeNode[]) {
        if (!nodes || nodes.length === 0) {
            return;
        }

        if (this.customSort()) {
            this.sortFunction.emit({
                data: this.value,
                mode: this.sortMode(),
                multiSortMeta: this.multiSortMeta
            });
        } else {
            nodes.sort((node1, node2) => {
                return this.multisortField(node1, node2, <SortMeta[]>this.multiSortMeta, 0);
            });
        }

        for (let node of nodes) {
            this.sortMultipleNodes(node.children as TreeNode[]);
        }
    }

    multisortField(node1: TreeTableNode, node2: TreeTableNode, multiSortMeta: SortMeta[], index: number): number {
        if (isEmpty(this.multiSortMeta) || isEmpty(multiSortMeta[index])) {
            return 0;
        }

        let value1 = resolveFieldData(node1.data, multiSortMeta[index].field);
        let value2 = resolveFieldData(node2.data, multiSortMeta[index].field);
        let result: number = 0;

        if (value1 == null && value2 != null) result = -1;
        else if (value1 != null && value2 == null) result = 1;
        else if (value1 == null && value2 == null) result = 0;
        if (typeof value1 == 'string' || value1 instanceof String) {
            if (value1.localeCompare && value1 != value2) {
                return multiSortMeta[index].order * value1.localeCompare(value2, undefined, { numeric: true });
            }
        } else {
            result = value1 < value2 ? -1 : 1;
        }

        if (value1 == value2) {
            return multiSortMeta.length - 1 > index ? this.multisortField(node1, node2, multiSortMeta, index + 1) : 0;
        }

        return multiSortMeta[index].order * result;
    }

    getSortMeta(field: string) {
        if (this.multiSortMeta && this.multiSortMeta.length) {
            for (let i = 0; i < this.multiSortMeta.length; i++) {
                if (this.multiSortMeta[i].field === field) {
                    return this.multiSortMeta[i];
                }
            }
        }

        return null;
    }

    isSorted(field: string) {
        const sortMode = this.sortMode();
        if (sortMode === 'single') {
            return this.sortField && this.sortField === field;
        } else if (sortMode === 'multiple') {
            let sorted = false;
            if (this.multiSortMeta) {
                for (let i = 0; i < this.multiSortMeta.length; i++) {
                    if (this.multiSortMeta[i].field == field) {
                        sorted = true;
                        break;
                    }
                }
            }
            return sorted;
        }
    }

    createLazyLoadMetadata(): any {
        return {
            first: this.first,
            rows: this.rows,
            sortField: this.sortField,
            sortOrder: this.sortOrder,
            filters: this.filters,
            globalFilter: this.filters && this.filters['global'] ? this.filters['global'].value : null,
            multiSortMeta: this.multiSortMeta,
            forceUpdate: () => this.cd.detectChanges()
        };
    }

    onLazyItemLoad(event: TreeTableLazyLoadEvent) {
        this.onLazyLoad.emit({
            ...this.createLazyLoadMetadata(),
            ...event,
            rows: event.last - event.first
        });
    }
    /**
     * Resets scroll to top.
     * @group Method
     */
    public resetScrollTop() {
        if (this.virtualScroll()) this.scrollToVirtualIndex(0);
        else this.scrollTo({ top: 0 });
    }
    /**
     * Scrolls to given index when using virtual scroll.
     * @param {number} index - index of the element.
     * @group Method
     */
    public scrollToVirtualIndex(index: number) {
        const scrollableViewChild = this.scrollableViewChild();
        if (scrollableViewChild) {
            (<any>scrollableViewChild).scrollToVirtualIndex(<number>index);
        }

        if (this.scrollableFrozenViewChild()) {
            (<any>scrollableViewChild).scrollToVirtualIndex(index);
        }
    }
    /**
     * Scrolls to given index.
     * @param {ScrollToOptions} options - Scroll options.
     * @group Method
     */
    public scrollTo(options: ScrollToOptions) {
        const scrollableViewChild = this.scrollableViewChild();
        if (scrollableViewChild) {
            (<any>scrollableViewChild).scrollTo(options);
        }

        if (this.scrollableFrozenViewChild()) {
            (<any>scrollableViewChild).scrollTo(options);
        }
    }

    isEmpty() {
        let data = this.filteredNodes || this.value;
        return data == null || data.length == 0;
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    onColumnResizeBegin(event: MouseEvent) {
        let containerLeft = <any>getOffset(this.el?.nativeElement).left;
        this.lastResizerHelperX = event.pageX - containerLeft + this.el?.nativeElement.scrollLeft;
        event.preventDefault();
    }

    onColumnResize(event: MouseEvent) {
        let containerLeft = <any>getOffset(this.el?.nativeElement).left;
        this.el?.nativeElement.setAttribute('data-p-unselectable-text', 'true');
        !this.$unstyled() && addStyle(this.el.nativeElement, { 'user-select': 'none' });
        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.height = this.el?.nativeElement.offsetHeight + 'px';
        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.top = 0 + 'px';
        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.left = event.pageX - containerLeft + this.el?.nativeElement.scrollLeft + 'px';

        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.display = 'block';
    }

    onColumnResizeEnd(event: MouseEvent, column: any) {
        let delta = (<ElementRef>this.resizeHelperViewChild()).nativeElement.offsetLeft - <number>this.lastResizerHelperX;
        let columnWidth = column.offsetWidth;
        let newColumnWidth = columnWidth + delta;
        let minWidth = column.style.minWidth || 15;

        if (columnWidth + delta > parseInt(minWidth)) {
            const columnResizeMode = this.columnResizeMode();
            if (columnResizeMode === 'fit') {
                let nextColumn = column.nextElementSibling;
                while (!nextColumn.offsetParent) {
                    nextColumn = nextColumn.nextElementSibling;
                }

                if (nextColumn) {
                    let nextColumnWidth = nextColumn.offsetWidth - delta;
                    let nextColumnMinWidth = nextColumn.style.minWidth || 15;

                    if (newColumnWidth > 15 && nextColumnWidth > parseInt(nextColumnMinWidth)) {
                        if (this.scrollable()) {
                            let scrollableView = this.findParentScrollableView(column);
                            let scrollableBodyTable = <any>findSingle(scrollableView, '[data-pc-section="scrollablebody"] table') || findSingle(scrollableView, '[data-pc-name="virtualscroller"] table');
                            let scrollableHeaderTable = <any>findSingle(scrollableView, '[data-pc-section="scrollableheadertable"]');
                            let scrollableFooterTable = <any>findSingle(scrollableView, '[data-pc-section="scrollablefootertable"]');
                            let resizeColumnIndex = getIndex(column);

                            this.resizeColGroup(scrollableHeaderTable, resizeColumnIndex, newColumnWidth, nextColumnWidth);
                            this.resizeColGroup(scrollableBodyTable, resizeColumnIndex, newColumnWidth, nextColumnWidth);
                            this.resizeColGroup(scrollableFooterTable, resizeColumnIndex, newColumnWidth, nextColumnWidth);
                        } else {
                            column.style.width = newColumnWidth + 'px';
                            if (nextColumn) {
                                nextColumn.style.width = nextColumnWidth + 'px';
                            }
                        }
                    }
                }
            } else if (columnResizeMode === 'expand') {
                if (this.scrollable()) {
                    let scrollableView = this.findParentScrollableView(column);
                    let scrollableBody = <any>findSingle(scrollableView, '[data-pc-section="scrollablebody"]') || findSingle(scrollableView, '[data-pc-name="virtualscroller"]');
                    let scrollableHeader = <any>findSingle(scrollableView, '[data-pc-section="scrollableheader"]');
                    let scrollableFooter = <any>findSingle(scrollableView, '[data-pc-section="scrollablefooter"]');
                    let scrollableBodyTable = <any>findSingle(scrollableView, '[data-pc-section="scrollablebody"] table') || findSingle(scrollableView, '[data-pc-name="virtualscroller"] table');
                    let scrollableHeaderTable = <any>findSingle(scrollableView, '[data-pc-section="scrollableheadertable"]');
                    let scrollableFooterTable = <any>findSingle(scrollableView, '[data-pc-section="scrollablefootertable"]');
                    scrollableBodyTable.style.width = scrollableBodyTable.offsetWidth + delta + 'px';
                    scrollableHeaderTable.style.width = scrollableHeaderTable.offsetWidth + delta + 'px';
                    if (scrollableFooterTable) {
                        scrollableFooterTable.style.width = scrollableFooterTable.offsetWidth + delta + 'px';
                    }
                    let resizeColumnIndex = getIndex(column);

                    const scrollableBodyTableWidth = column ? scrollableBodyTable.offsetWidth + delta : newColumnWidth;
                    const scrollableHeaderTableWidth = column ? scrollableHeaderTable.offsetWidth + delta : newColumnWidth;
                    const isContainerInViewport = this.el?.nativeElement.offsetWidth >= scrollableBodyTableWidth;

                    let setWidth = (container: HTMLElement, table: HTMLElement, width: number, isContainerInViewport: boolean) => {
                        if (container && table) {
                            container.style.width = isContainerInViewport ? width + calculateScrollbarWidth(scrollableBody) + 'px' : 'auto';
                            table.style.width = width + 'px';
                        }
                    };

                    setWidth(scrollableBody, scrollableBodyTable, scrollableBodyTableWidth, isContainerInViewport);
                    setWidth(scrollableHeader, scrollableHeaderTable, scrollableHeaderTableWidth, isContainerInViewport);
                    setWidth(scrollableFooter, scrollableFooterTable, scrollableHeaderTableWidth, isContainerInViewport);

                    this.resizeColGroup(scrollableHeaderTable, resizeColumnIndex, newColumnWidth, null);
                    this.resizeColGroup(scrollableBodyTable, resizeColumnIndex, newColumnWidth, null);
                    this.resizeColGroup(scrollableFooterTable, resizeColumnIndex, newColumnWidth, null);
                } else {
                    const tableViewChild = this.tableViewChild();
                    (<ElementRef>this.tableViewChild()).nativeElement.style.width = tableViewChild?.nativeElement.offsetWidth + delta + 'px';
                    column.style.width = newColumnWidth + 'px';
                    let containerWidth = tableViewChild?.nativeElement.style.width;
                    (<ElementRef>this.el).nativeElement.style.width = containerWidth + 'px';
                }
            }

            this.onColResize.emit({
                element: column,
                delta: delta
            });
        }

        (this.resizeHelperViewChild() as ElementRef).nativeElement.style.display = 'none';

        this.el.nativeElement.removeAttribute('data-p-unselectable-text');
        !this.$unstyled() && (this.el.nativeElement.style['user-select'] = '');
    }

    findParentScrollableView(column: any) {
        if (column) {
            let parent = column.parentElement;
            while (parent && !findSingle(parent, '[data-pc-section="scrollableview"]')) {
                parent = parent.parentElement;
            }

            return parent;
        } else {
            return null;
        }
    }

    resizeColGroup(table: Nullable<HTMLElement>, resizeColumnIndex: Nullable<number>, newColumnWidth: Nullable<number>, nextColumnWidth: Nullable<number>) {
        if (table) {
            let colGroup = table.children[0].nodeName === 'COLGROUP' ? table.children[0] : null;

            if (colGroup) {
                let col = colGroup.children[<number>resizeColumnIndex];
                let nextCol = col.nextElementSibling;
                (<HTMLElement>col).style.width = newColumnWidth + 'px';

                if (nextCol && nextColumnWidth) {
                    (<HTMLElement>nextCol).style.width = nextColumnWidth + 'px';
                }
            } else {
                throw 'Scrollable tables require a colgroup to support resizable columns';
            }
        }
    }

    onColumnDragStart(event: DragEvent, columnElement: any) {
        this.reorderIconWidth = getHiddenElementOuterWidth(this.reorderIndicatorUpViewChild()?.nativeElement);
        this.reorderIconHeight = getHiddenElementOuterHeight(this.reorderIndicatorDownViewChild()?.nativeElement);
        this.draggedColumn = columnElement;
        (<any>event).dataTransfer.setData('text', 'b'); // For firefox
    }

    onColumnDragEnter(event: DragEvent, dropHeader: any) {
        if (this.reorderableColumns() && this.draggedColumn && dropHeader) {
            event.preventDefault();
            let containerOffset = <any>getOffset(this.el?.nativeElement);
            let dropHeaderOffset = <any>getOffset(dropHeader);

            if (this.draggedColumn != dropHeader) {
                let targetLeft = dropHeaderOffset.left - containerOffset.left;
                let targetTop = containerOffset.top - dropHeaderOffset.top;
                let columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;

                (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.top = dropHeaderOffset.top - containerOffset.top - (<number>this.reorderIconHeight - 1) + 'px';
                (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.top = dropHeaderOffset.top - containerOffset.top + dropHeader.offsetHeight + 'px';

                if (event.pageX > columnCenter) {
                    (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(<number>this.reorderIconWidth / 2) + 'px';
                    (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.left = targetLeft + dropHeader.offsetWidth - Math.ceil(<number>this.reorderIconWidth / 2) + 'px';
                    this.dropPosition = 1;
                } else {
                    (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.left = targetLeft - Math.ceil(<number>this.reorderIconWidth / 2) + 'px';
                    (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.left = targetLeft - Math.ceil(<number>this.reorderIconWidth / 2) + 'px';
                    this.dropPosition = -1;
                }

                (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.display = 'block';
                (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.display = 'block';
            } else {
                (<any>event).dataTransfer.dropEffect = 'none';
            }
        }
    }

    onColumnDragLeave(event: DragEvent) {
        if (this.reorderableColumns() && this.draggedColumn) {
            event.preventDefault();
            (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.display = 'none';
            (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.display = 'none';
        }
    }

    onColumnDrop(event: DragEvent, dropColumn: any) {
        event.preventDefault();
        if (this.draggedColumn) {
            let dragIndex = DomHandler.indexWithinGroup(this.draggedColumn, 'ttreorderablecolumn');
            let dropIndex = DomHandler.indexWithinGroup(dropColumn, 'ttreorderablecolumn');
            let allowDrop = dragIndex != dropIndex;
            if (allowDrop && ((dropIndex - dragIndex == 1 && this.dropPosition === -1) || (dragIndex - dropIndex == 1 && this.dropPosition === 1))) {
                allowDrop = false;
            }

            if (allowDrop && dropIndex < dragIndex && this.dropPosition === 1) {
                dropIndex = dropIndex + 1;
            }

            if (allowDrop && dropIndex > dragIndex && this.dropPosition === -1) {
                dropIndex = dropIndex - 1;
            }

            if (allowDrop) {
                const columns = this.columns();
                reorderArray(<any[]>columns, dragIndex, dropIndex);

                this.onColReorder.emit({
                    dragIndex: dragIndex,
                    dropIndex: dropIndex,
                    columns: columns
                });
            }

            (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.display = 'none';
            (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.display = 'none';
            (this.draggedColumn as any).draggable = false;
            this.draggedColumn = null;
            this.dropPosition = null;
        }
    }

    handleRowClick(event: any) {
        let targetNode = (<HTMLElement>event.originalEvent.target).nodeName;
        if (targetNode == 'INPUT' || targetNode == 'BUTTON' || targetNode == 'A' || isClickable(event.originalEvent.target)) {
            return;
        }

        const selectionMode = this.selectionMode();
        if (selectionMode) {
            this.preventSelectionSetterPropagation = true;
            let rowNode = event.rowNode;
            let selected = this.isSelected((<any>rowNode).node);
            let metaSelection = this.rowTouched ? false : this.metaKeySelection();
            const dataKey = this.dataKey();
            let dataKeyValue = dataKey ? String(resolveFieldData((<TreeTableNode>rowNode.node).data, dataKey)) : null;

            if (metaSelection) {
                let keyboardEvent = <KeyboardEvent>event.originalEvent;
                let metaKey = keyboardEvent.metaKey || keyboardEvent.ctrlKey;

                if (selected && metaKey) {
                    if (this.isSingleSelectionMode()) {
                        this._selection = null;
                        this.selectedKeys = {};
                        this.selectionChange.emit(null);
                    } else {
                        let selectionIndex = this.findIndexInSelection(rowNode.node);
                        this._selection = this.selection.filter((val: TreeTableNode, i: number) => i != selectionIndex);
                        this.selectionChange.emit(this.selection);
                        if (dataKeyValue) {
                            delete this.selectedKeys[dataKeyValue];
                        }
                    }

                    this.onNodeUnselect.emit({
                        originalEvent: event.originalEvent,
                        node: <TreeTableNode>rowNode.node,
                        type: 'row'
                    });
                } else {
                    if (this.isSingleSelectionMode()) {
                        this._selection = rowNode.node;
                        this.selectionChange.emit(rowNode.node);
                        if (dataKeyValue) {
                            this.selectedKeys = {};
                            this.selectedKeys[dataKeyValue] = 1;
                        }
                    } else if (this.isMultipleSelectionMode()) {
                        if (metaKey) {
                            this._selection = this.selection || [];
                        } else {
                            this._selection = [];
                            this.selectedKeys = {};
                        }

                        this._selection = [...this.selection, rowNode.node];
                        this.selectionChange.emit(this.selection);
                        if (dataKeyValue) {
                            this.selectedKeys[dataKeyValue] = 1;
                        }
                    }

                    this.onNodeSelect.emit({
                        originalEvent: event.originalEvent,
                        node: rowNode.node,
                        type: 'row',
                        index: (<any>event).rowIndex
                    });
                }
            } else {
                if (selectionMode === 'single') {
                    if (selected) {
                        this._selection = null;
                        this.selectedKeys = {};
                        this.selectionChange.emit(this.selection);
                        this.onNodeUnselect.emit({
                            originalEvent: event.originalEvent,
                            node: <TreeTableNode>rowNode.node,
                            type: 'row'
                        });
                    } else {
                        this._selection = rowNode.node;
                        this.selectionChange.emit(this.selection);
                        this.onNodeSelect.emit({
                            originalEvent: event.originalEvent,
                            node: rowNode.node,
                            type: 'row',
                            index: event.rowIndex
                        });
                        if (dataKeyValue) {
                            this.selectedKeys = {};
                            this.selectedKeys[dataKeyValue] = 1;
                        }
                    }
                } else if (selectionMode === 'multiple') {
                    if (selected) {
                        let selectionIndex = this.findIndexInSelection(rowNode.node);
                        this._selection = this.selection.filter((val: TreeTableNode, i: number) => i != selectionIndex);
                        this.selectionChange.emit(this.selection);
                        this.onNodeUnselect.emit({
                            originalEvent: event.originalEvent,
                            node: rowNode.node,
                            type: 'row'
                        });
                        if (dataKeyValue) {
                            delete this.selectedKeys[dataKeyValue];
                        }
                    } else {
                        this._selection = this.selection ? [...this.selection, rowNode.node] : [rowNode.node];
                        this.selectionChange.emit(this.selection);
                        this.onNodeSelect.emit({
                            originalEvent: event.originalEvent,
                            node: rowNode.node,
                            type: 'row',
                            index: event.rowIndex
                        });
                        if (dataKeyValue) {
                            this.selectedKeys[dataKeyValue] = 1;
                        }
                    }
                }
            }

            this.tableService.onSelectionChange();
        }

        this.rowTouched = false;
    }

    handleRowTouchEnd(event: Event) {
        this.rowTouched = true;
    }

    handleRowRightClick(event: any) {
        if (this.contextMenu()) {
            const node = event.rowNode.node;

            const showContextMenu = () => {
                this.contextMenu().show(event.originalEvent);
                this.contextMenu().hideCallback = () => {
                    this.contextMenuSelection = null;
                    this.contextMenuSelectionChange.emit(null!);
                    this.tableService.onContextMenu(null);
                };
            };

            const contextMenuSelectionMode = this.contextMenuSelectionMode();
            if (contextMenuSelectionMode === 'separate') {
                this.contextMenuSelection = node;
                this.contextMenuSelectionChange.emit(node);
                this.tableService.onContextMenu(node);
                showContextMenu();
                this.onContextMenuSelect.emit({ originalEvent: event.originalEvent, node: node });
            } else if (contextMenuSelectionMode === 'joint') {
                this.preventSelectionSetterPropagation = true;
                let selected = this.isSelected(node);
                const dataKey = this.dataKey();
                let dataKeyValue = dataKey ? String(resolveFieldData(node.data, dataKey)) : null;

                if (!selected) {
                    if (this.isSingleSelectionMode()) {
                        this.selection = node;
                        this.selectionChange.emit(node);
                    } else if (this.isMultipleSelectionMode()) {
                        this.selection = [node];
                        this.selectionChange.emit(this.selection);
                    }

                    if (dataKeyValue) {
                        this.selectedKeys[dataKeyValue] = 1;
                    }
                }

                this.contextMenuSelection = node;
                this.contextMenuSelectionChange.emit(node);
                this.tableService.onContextMenu(node);

                showContextMenu();
                this.onContextMenuSelect.emit({ originalEvent: event.originalEvent, node: node });
            }
        }
    }

    toggleNodeWithCheckbox(event: any) {
        // legacy selection support, will be removed in v18
        this.selection = this.selection || [];
        this.preventSelectionSetterPropagation = true;
        let node = event.rowNode.node;
        let selected = this.isSelected(node);

        if (selected) {
            this.propagateSelectionDown(node, false);
            if (event.rowNode.parent) {
                this.propagateSelectionUp(node.parent, false);
            }
            this.selectionChange.emit(this.selection);
            this.onNodeUnselect.emit({ originalEvent: event, node: node });
        } else {
            this.propagateSelectionDown(node, true);
            if (event.rowNode.parent) {
                this.propagateSelectionUp(node.parent, true);
            }
            this.selectionChange.emit(this.selection);
            this.onNodeSelect.emit({ originalEvent: event, node: node });
        }

        this.tableService.onSelectionChange();
    }

    toggleNodesWithCheckbox(event: Event, check: boolean) {
        // legacy selection support, will be removed in v18
        let data = this.filteredNodes || this.value;
        this._selection = check && data ? data.slice() : [];

        this.toggleAll(check);

        if (!check) {
            this._selection = [];
            this.selectedKeys = {};
        }

        this.preventSelectionSetterPropagation = true;
        this.selectionChange.emit(this._selection);
        this.tableService.onSelectionChange();

        this.onHeaderCheckboxToggle.emit({ originalEvent: event, checked: check });
    }

    toggleAll(checked: boolean) {
        let data = this.filteredNodes || this.value;

        if (!this.selectionKeys) {
            if (data && data.length) {
                for (let node of data) {
                    this.propagateSelectionDown(node, checked);
                }
            }
        } else {
            // legacy selection support, will be removed in v18
            if (data && data.length) {
                for (let node of data) {
                    this.propagateDown(node, checked);
                }
                this.selectionKeysChange.emit(this.selectionKeys);
            }
        }
    }

    propagateSelectionUp(node: TreeTableNode, select: boolean) {
        // legacy selection support, will be removed in v18
        if (node.children && node.children.length) {
            let selectedChildCount: number = 0;
            let childPartialSelected: boolean = false;
            const dataKey = this.dataKey();
            let dataKeyValue = dataKey ? String(resolveFieldData(node.data, dataKey)) : null;

            for (let child of node.children) {
                if (this.isSelected(child)) selectedChildCount++;
                else if (child.partialSelected) childPartialSelected = true;
            }

            if (select && selectedChildCount == node.children.length) {
                this._selection = [...(this.selection || []), node];
                node.partialSelected = false;
                if (dataKeyValue) {
                    this.selectedKeys[dataKeyValue] = 1;
                }
            } else {
                if (!select) {
                    let index = this.findIndexInSelection(node);
                    if (index >= 0) {
                        this._selection = this.selection.filter((val: any, i: number) => i != index);

                        if (dataKeyValue) {
                            delete this.selectedKeys[dataKeyValue];
                        }
                    }
                }

                if (childPartialSelected || (selectedChildCount > 0 && selectedChildCount != node.children.length)) node.partialSelected = true;
                else node.partialSelected = false;
            }
        }

        let parent = node.parent;
        node.checked = select;
        if (parent) {
            this.propagateSelectionUp(parent, select);
        }
    }

    propagateSelectionDown(node: TreeTableNode, select: boolean) {
        // legacy selection support, will be removed in v18
        let index = this.findIndexInSelection(node);
        const dataKey = this.dataKey();
        let dataKeyValue = dataKey ? String(resolveFieldData(node.data, dataKey)) : null;

        if (select && index == -1) {
            this._selection = [...(this.selection || []), node];
            if (dataKeyValue) {
                this.selectedKeys[dataKeyValue] = 1;
            }
        } else if (!select && index > -1) {
            this._selection = this.selection.filter((val: any, i: number) => i != index);
            if (dataKeyValue) {
                delete this.selectedKeys[dataKeyValue];
            }
        }

        node.partialSelected = false;
        node.checked = select;

        if (node.children && node.children.length) {
            for (let child of node.children) {
                this.propagateSelectionDown(child, select);
            }
        }
    }

    isSelected(node: TreeTableNode) {
        // legacy selection support, will be removed in v18
        if (node && this.selection) {
            const dataKey = this.dataKey();
            if (dataKey) {
                if (node.hasOwnProperty('checked')) {
                    return node['checked'];
                } else {
                    return this.selectedKeys[resolveFieldData(node.data, dataKey)] !== undefined;
                }
            } else {
                if (Array.isArray(this.selection)) return this.findIndexInSelection(node) > -1;
                else return this.equals(node, this.selection);
            }
        }

        return false;
    }

    isNodeSelected(node) {
        return this.selectionMode() && this.selectionKeys ? this.selectionKeys[this.nodeKey(node)]?.checked === true : false;
    }

    isNodePartialSelected(node) {
        return this.selectionMode() && this.selectionKeys ? this.selectionKeys[this.nodeKey(node)]?.partialChecked === true : false;
    }

    nodeKey(node) {
        const dataKey = this.dataKey();
        return resolveFieldData(node, dataKey) || resolveFieldData(node?.data, dataKey);
    }

    toggleCheckbox(event) {
        let { rowNode, check, originalEvent } = event;
        let node = rowNode.node;
        if (this.selectionKeys) {
            this.propagateDown(node, check);
            if (node.parent) {
                this.propagateUp(node.parent, check);
            }

            this.selectionKeysChange.emit(this.selectionKeys);
        } else {
            this.toggleNodeWithCheckbox({ originalEvent, rowNode });
        }

        this.tableService.onSelectionChange();
    }

    propagateDown(node, check) {
        if (check) {
            this.selectionKeys[this.nodeKey(node)] = { checked: true, partialChecked: false };
        } else {
            delete this.selectionKeys[this.nodeKey(node)];
        }

        if (node.children && node.children.length) {
            for (let child of node.children) {
                this.propagateDown(child, check);
            }
        }
    }

    propagateUp(node, check) {
        let checkedChildCount = 0;
        let childPartialSelected = false;

        for (let child of node.children) {
            if (this.selectionKeys[this.nodeKey(child)] && this.selectionKeys[this.nodeKey(child)].checked) checkedChildCount++;
            else if (this.selectionKeys[this.nodeKey(child)] && this.selectionKeys[this.nodeKey(child)].partialChecked) childPartialSelected = true;
        }

        if (check && checkedChildCount === node.children.length) {
            this.selectionKeys[this.nodeKey(node)] = { checked: true, partialChecked: false };
        } else {
            if (!check) {
                delete this.selectionKeys[this.nodeKey(node)];
            }

            if (childPartialSelected || (checkedChildCount > 0 && checkedChildCount !== node.children.length)) this.selectionKeys[this.nodeKey(node)] = { checked: false, partialChecked: true };
            else this.selectionKeys[this.nodeKey(node)] = { checked: false, partialChecked: false };
        }

        let parent = node.parent;
        if (parent) {
            this.propagateUp(parent, check);
        }
    }

    findIndexInSelection(node: any) {
        let index: number = -1;
        if (this.selection && this.selection.length) {
            for (let i = 0; i < this.selection.length; i++) {
                if (this.equals(node, this.selection[i])) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    isSingleSelectionMode() {
        return this.selectionMode() === 'single';
    }

    isMultipleSelectionMode() {
        return this.selectionMode() === 'multiple';
    }

    equals(node1: TreeTableNode, node2: TreeTableNode) {
        return this.compareSelectionBy() === 'equals' ? equals(node1, node2) : equals(node1.data, node2.data, this.dataKey());
    }

    filter(value: string | string[], field: string, matchMode: string) {
        if (this.filterTimeout) {
            clearTimeout(this.filterTimeout);
        }

        if (!this.isFilterBlank(value)) {
            this.filters[field] = { value: value, matchMode: matchMode };
        } else if (this.filters[field]) {
            delete this.filters[field];
        }

        this.filterTimeout = setTimeout(() => {
            this._filter();
            this.filterTimeout = null;
        }, this.filterDelay());
    }

    filterGlobal(value: string, matchMode: string) {
        this.filter(value, 'global', matchMode);
    }

    isFilterBlank(filter: any): boolean {
        if (filter !== null && filter !== undefined) {
            if ((typeof filter === 'string' && filter.trim().length == 0) || (Array.isArray(filter) && filter.length == 0)) return true;
            else return false;
        }
        return true;
    }

    _filter() {
        if (this.lazy()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        } else {
            if (!this.value) {
                return;
            }

            if (!this.hasFilter()) {
                this.filteredNodes = null;
                if (this.paginator()) {
                    this.totalRecords = this.value ? this.value.length : 0;
                }
            } else {
                let globalFilterFieldsArray;
                if (this.filters['global']) {
                    const columns = this.columns();
                    const globalFilterFields = this.globalFilterFields();
                    if (!columns && !globalFilterFields) throw new Error('Global filtering requires dynamic columns or globalFilterFields to be defined.');
                    else globalFilterFieldsArray = globalFilterFields || columns;
                }

                this.filteredNodes = [];
                const isStrictMode = this.filterMode() === 'strict';
                let isValueChanged = false;

                for (let node of this.value) {
                    let copyNode = { ...node };
                    let localMatch = true;
                    let globalMatch = false;
                    let paramsWithoutNode;

                    for (let prop in this.filters) {
                        if (this.filters.hasOwnProperty(prop) && prop !== 'global') {
                            let filterMeta = <FilterMetadata>this.filters[prop];
                            let filterField = prop;
                            let filterValue = filterMeta.value;
                            let filterMatchMode = filterMeta.matchMode || 'startsWith';
                            let filterConstraint = (<any>this.filterService).filters[filterMatchMode];
                            paramsWithoutNode = { filterField, filterValue, filterConstraint, isStrictMode };
                            if (
                                (isStrictMode && !(this.findFilteredNodes(copyNode, paramsWithoutNode) || this.isFilterMatched(copyNode, paramsWithoutNode))) ||
                                (!isStrictMode && !(this.isFilterMatched(copyNode, paramsWithoutNode) || this.findFilteredNodes(copyNode, paramsWithoutNode)))
                            ) {
                                localMatch = false;
                            }

                            if (!localMatch) {
                                break;
                            }
                        }
                    }

                    if (this.filters['global'] && !globalMatch && globalFilterFieldsArray) {
                        let copyNodeForGlobal = { ...copyNode };
                        let filterField = undefined;
                        let filterValue = this.filters['global'].value;
                        let filterConstraint = (<any>this.filterService).filters[(<any>this.filters)['global'].matchMode];
                        paramsWithoutNode = {
                            filterField,
                            filterValue,
                            filterConstraint,
                            isStrictMode,
                            globalFilterFieldsArray
                        };

                        if (
                            (isStrictMode && (this.findFilteredNodes(copyNodeForGlobal, paramsWithoutNode) || this.isFilterMatched(copyNodeForGlobal, paramsWithoutNode))) ||
                            (!isStrictMode && (this.isFilterMatched(copyNodeForGlobal, paramsWithoutNode) || this.findFilteredNodes(copyNodeForGlobal, paramsWithoutNode)))
                        ) {
                            globalMatch = true;
                            copyNode = copyNodeForGlobal;
                        }
                    }

                    let matches = localMatch;
                    if (this.filters['global']) {
                        matches = localMatch && globalMatch;
                    }

                    if (matches) {
                        this.filteredNodes.push(copyNode);
                    }

                    isValueChanged = isValueChanged || !localMatch || globalMatch || (localMatch && this.filteredNodes.length > 0) || (!globalMatch && this.filteredNodes.length === 0);
                }

                if (!isValueChanged) {
                    this.filteredNodes = null;
                }

                if (this.paginator()) {
                    this.totalRecords = this.filteredNodes ? this.filteredNodes.length : this.value ? this.value.length : 0;
                }
            }
            this.cd.markForCheck();
        }

        this.first = 0;

        const filteredValue = this.filteredNodes || this.value;

        this.onFilter.emit({
            filters: this.filters,
            filteredValue: filteredValue
        });

        this.tableService.onUIUpdate(filteredValue);
        this.updateSerializedValue();

        if (this.scrollable()) {
            this.resetScrollTop();
        }
    }

    findFilteredNodes(node: TreeTableNode, paramsWithoutNode: any) {
        if (node) {
            let matched = false;
            if (node.children) {
                let childNodes = [...node.children];
                node.children = [];
                for (let childNode of childNodes) {
                    let copyChildNode = { ...childNode };
                    if (this.isFilterMatched(copyChildNode, paramsWithoutNode)) {
                        matched = true;
                        node.children.push(copyChildNode);
                    }
                }
            }

            if (matched) {
                return true;
            }
        }
    }

    isFilterMatched(node: TreeTableNode, filterOptions: TreeTableFilterOptions) {
        let { filterField, filterValue, filterConstraint, isStrictMode, globalFilterFieldsArray } = <any>filterOptions;
        let matched = false;
        const isMatched = (field: string) => filterConstraint(resolveFieldData(node.data, field), filterValue, <string>this.filterLocale());

        matched = globalFilterFieldsArray?.length ? globalFilterFieldsArray.some((globalFilterField) => isMatched(globalFilterField.field || globalFilterField)) : isMatched(filterField);

        if (!matched || (isStrictMode && !this.isNodeLeaf(node))) {
            matched =
                this.findFilteredNodes(node, {
                    filterField,
                    filterValue,
                    filterConstraint,
                    isStrictMode,
                    globalFilterFieldsArray
                }) || matched;
        }

        return matched;
    }

    isNodeLeaf(node: TreeTableNode) {
        return node.leaf === false ? false : !(node.children && node.children.length);
    }

    hasFilter() {
        let empty = true;
        for (let prop in this.filters) {
            if (this.filters.hasOwnProperty(prop)) {
                empty = false;
                break;
            }
        }

        return !empty;
    }
    /**
     * Clears the sort and paginator state.
     * @group Method
     */
    public reset() {
        this._sortField = null;
        this._sortOrder = 1;
        this._multiSortMeta = null;
        this.tableService.onSort(null);

        this.filteredNodes = null;
        this.filters = {};

        this.first = 0;

        if (this.lazy()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        } else {
            this.totalRecords = this._value ? this._value.length : 0;
        }
    }

    updateEditingCell(cell: any, data: any, field: string) {
        this.editingCell = cell;
        this.editingCellData = data;
        this.editingCellField = field;
        this.bindDocumentEditListener();
    }

    isEditingCellValid() {
        return this.editingCell && find(this.editingCell, '.ng-invalid.ng-dirty').length === 0;
    }

    bindDocumentEditListener() {
        if (!this.documentEditListener) {
            this.documentEditListener = this.renderer.listen(this.document, 'click', (event) => {
                if (this.editingCell && !this.editingCellClick && this.isEditingCellValid()) {
                    !this.$unstyled() && removeClass(this.editingCell, 'p-cell-editing');
                    this.editingCell = null;
                    this.onEditComplete.emit({ field: this.editingCellField, data: this.editingCellData });
                    this.editingCellField = null;
                    this.editingCellData = null;
                    this.unbindDocumentEditListener();
                }

                this.editingCellClick = false;
            });
        }
    }

    unbindDocumentEditListener() {
        if (this.documentEditListener) {
            this.documentEditListener();
            this.documentEditListener = null;
        }
    }

    onDestroy() {
        this.unbindDocumentEditListener();
        this.editingCell = null;
        this.editingCellField = null;
        this.editingCellData = null;
        this.initialized = null;
    }

    get dataP() {
        return this.cn({
            scrollable: this.scrollable(),
            'flex-scrollable': this.scrollable() && this.scrollHeight() === 'flex',
            loading: this.loading(),
            empty: this.isEmpty()
        });
    }
}

@Component({
    selector: '[hTreeTableBody]',
    standalone: false,
    templateUrl: './ttbody.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    host: {
        '[attr.data-p]': 'dataP'
    }
})
export class TTBody extends BaseComponent {
    readonly columns = input<any[]>(undefined, { alias: "hTreeTableBody" });

    readonly template = input<Nullable<TemplateRef<any>>>(undefined, { alias: "pTreeTableBodyTemplate" });

    readonly frozen = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    readonly serializedNodes = input<any>();

    readonly scrollerOptions = input<any>();

    subscription: Subscription;

    constructor(
        public tt: TreeTable,
        public treeTableService: TreeTableService
    ) {
        super();
        this.subscription = this.tt.tableService.uiUpdateSource$.subscribe(() => {
            if (this.tt.virtualScroll()) {
                this.cd.detectChanges();
            }
        });
    }

    getScrollerOption(option: any, options?: any) {
        if (this.tt.virtualScroll()) {
            options = options || this.scrollerOptions();
            return options ? options[option] : null;
        }

        return null;
    }

    getRowIndex(rowIndex: number) {
        const getItemOptions = this.getScrollerOption('getItemOptions');
        return getItemOptions ? getItemOptions(rowIndex).index : rowIndex;
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    get dataP() {
        return this.cn({
            hoverable: this.tt.rowHover() || this.tt.selectionMode(),
            frozen: this.frozen()
        });
    }
}

@Component({
    selector: '[ttScrollableView]',
    standalone: false,
    templateUrl: './ttscrollableview.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    providers: [TreeTableStyle]
})
export class TTScrollableView extends BaseComponent {
    hostName = 'TreeTable';

    readonly columns = input<any[]>(undefined, { alias: "ttScrollableView" });

    readonly frozen = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    readonly scrollHeaderViewChild = viewChild<Nullable<ElementRef>>('scrollHeader');

    readonly scrollHeaderBoxViewChild = viewChild<Nullable<ElementRef>>('scrollHeaderBox');

    readonly scrollBodyViewChild = viewChild<Nullable<ElementRef>>('scrollBody');

    readonly scrollTableViewChild = viewChild<Nullable<ElementRef>>('scrollTable');

    readonly scrollLoadingTableViewChild = viewChild<Nullable<ElementRef>>('loadingTable');

    readonly scrollFooterViewChild = viewChild<Nullable<ElementRef>>('scrollFooter');

    readonly scrollFooterBoxViewChild = viewChild<Nullable<ElementRef>>('scrollFooterBox');

    readonly scrollableAlignerViewChild = viewChild<Nullable<ElementRef>>('scrollableAligner');

    readonly scroller = viewChild<Nullable<Scroller>>('scroller');

    headerScrollListener: VoidListener;

    bodyScrollListener: VoidListener;

    footerScrollListener: VoidListener;

    frozenSiblingBody: Nullable<Element>;

    totalRecordsSubscription: Nullable<Subscription>;

    _scrollHeight: string | undefined | null;

    preventBodyScrollPropagation: boolean | undefined;

    _componentStyle = inject(TreeTableStyle);

    // TODO: Skipped for migration because:
    //  Accessor inputs cannot be migrated as they are too complex.
    @Input() get scrollHeight(): string | undefined | null {
        return this._scrollHeight;
    }
    set scrollHeight(val: string | undefined | null) {
        this._scrollHeight = val;
        if (val != null && (val.includes('%') || val.includes('calc'))) {
            console.log('Percentage scroll height calculation is removed in favor of the more performant CSS based flex mode, use scrollHeight="flex" instead.');
        }
    }

    constructor(
        public tt: TreeTable,
        public zone: NgZone
    ) {
        super();
    }

    onAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.frozen()) {
                if (this.tt.frozenColumns || this.tt.frozenBodyTemplate || this.tt._frozenBodyTemplate()) {
                    addClass(this.el.nativeElement, 'p-treetable-unfrozen-view');
                }

                let frozenView = this.el.nativeElement.previousElementSibling;
                if (frozenView) {
                    if (this.tt.virtualScroll()) this.frozenSiblingBody = findSingle(frozenView, '[data-pc-name="virtualscroller"]');
                    else this.frozenSiblingBody = findSingle(frozenView, '[data-pc-section="scrollablebody"]');
                }

                if (this.scrollHeight) {
                    let scrollBarWidth = calculateScrollbarWidth();
                    const scrollHeaderBoxViewChild = this.scrollHeaderBoxViewChild();
                    if (scrollHeaderBoxViewChild?.nativeElement) {
                        scrollHeaderBoxViewChild.nativeElement.style.paddingRight = scrollBarWidth + 'px';
                    }

                    const scrollFooterBoxViewChild = this.scrollFooterBoxViewChild();
                    if (scrollFooterBoxViewChild && scrollFooterBoxViewChild.nativeElement) {
                        scrollFooterBoxViewChild.nativeElement.style.paddingRight = scrollBarWidth + 'px';
                    }
                }
            } else {
                const scrollableAlignerViewChild = this.scrollableAlignerViewChild();
                if (scrollableAlignerViewChild && scrollableAlignerViewChild.nativeElement) {
                    scrollableAlignerViewChild.nativeElement.style.height = calculateScrollbarHeight() + 'px';
                }
            }

            this.bindEvents();
        }
    }

    bindEvents() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                const scrollHeaderViewChild = this.scrollHeaderViewChild();
                if (scrollHeaderViewChild && scrollHeaderViewChild.nativeElement) {
                    this.headerScrollListener = this.renderer.listen(this.scrollHeaderBoxViewChild()?.nativeElement, 'scroll', this.onHeaderScroll.bind(this));
                }

                const scrollFooterViewChild = this.scrollFooterViewChild();
                if (scrollFooterViewChild && scrollFooterViewChild.nativeElement) {
                    this.footerScrollListener = this.renderer.listen(scrollFooterViewChild.nativeElement, 'scroll', this.onFooterScroll.bind(this));
                }

                if (!this.frozen()) {
                    if (this.tt.virtualScroll()) {
                        this.bodyScrollListener = this.renderer.listen((this.scroller()?.getElementRef() as ElementRef).nativeElement, 'scroll', this.onBodyScroll.bind(this));
                    } else {
                        this.bodyScrollListener = this.renderer.listen(this.scrollBodyViewChild()?.nativeElement, 'scroll', this.onBodyScroll.bind(this));
                    }
                }
            });
        }
    }

    unbindEvents() {
        if (isPlatformBrowser(this.platformId)) {
            const scrollHeaderViewChild = this.scrollHeaderViewChild();
            if (scrollHeaderViewChild && scrollHeaderViewChild.nativeElement) {
                if (this.headerScrollListener) {
                    this.headerScrollListener();
                    this.headerScrollListener = null;
                }
            }

            const scrollFooterViewChild = this.scrollFooterViewChild();
            if (scrollFooterViewChild && scrollFooterViewChild.nativeElement) {
                if (this.footerScrollListener) {
                    this.footerScrollListener();
                    this.footerScrollListener = null;
                }
            }

            const scrollBodyViewChild = this.scrollBodyViewChild();
            if (scrollBodyViewChild && scrollBodyViewChild.nativeElement) {
                if (this.bodyScrollListener) {
                    this.bodyScrollListener();
                    this.bodyScrollListener = null;
                }
            }

            const scroller = this.scroller();
            if (scroller && scroller.getElementRef()) {
                if (this.bodyScrollListener) {
                    this.bodyScrollListener();
                    this.bodyScrollListener = null;
                }
            }
        }
    }

    onHeaderScroll() {
        const scrollLeft = this.scrollHeaderViewChild()?.nativeElement.scrollLeft;

        (this.scrollBodyViewChild() as ElementRef).nativeElement.scrollLeft = scrollLeft;

        const scrollFooterViewChild = this.scrollFooterViewChild();
        if (scrollFooterViewChild && scrollFooterViewChild.nativeElement) {
            scrollFooterViewChild.nativeElement.scrollLeft = scrollLeft;
        }

        this.preventBodyScrollPropagation = true;
    }

    onFooterScroll() {
        const scrollLeft = this.scrollFooterViewChild()?.nativeElement.scrollLeft;
        (this.scrollBodyViewChild() as ElementRef).nativeElement.scrollLeft = scrollLeft;

        const scrollHeaderViewChild = this.scrollHeaderViewChild();
        if (scrollHeaderViewChild && scrollHeaderViewChild.nativeElement) {
            scrollHeaderViewChild.nativeElement.scrollLeft = scrollLeft;
        }

        this.preventBodyScrollPropagation = true;
    }

    onBodyScroll(event: any) {
        if (this.preventBodyScrollPropagation) {
            this.preventBodyScrollPropagation = false;
            return;
        }

        const scrollHeaderViewChild = this.scrollHeaderViewChild();
        if (scrollHeaderViewChild && scrollHeaderViewChild.nativeElement) {
            (this.scrollHeaderBoxViewChild() as ElementRef).nativeElement.style.marginLeft = -1 * event.target.scrollLeft + 'px';
        }

        const scrollFooterViewChild = this.scrollFooterViewChild();
        if (scrollFooterViewChild && scrollFooterViewChild.nativeElement) {
            (this.scrollFooterBoxViewChild() as ElementRef).nativeElement.style.marginLeft = -1 * event.target.scrollLeft + 'px';
        }

        if (this.frozenSiblingBody) {
            this.frozenSiblingBody.scrollTop = event.target.scrollTop;
        }
    }

    scrollToVirtualIndex(index: number): void {
        const scroller = this.scroller();
        if (scroller) {
            scroller.scrollToIndex(index);
        }
    }

    scrollTo(options: ScrollToOptions): void {
        const scroller = this.scroller();
        if (scroller) {
            scroller.scrollTo(options);
        } else {
            const scrollBodyViewChild = this.scrollBodyViewChild();
            if (scrollBodyViewChild?.nativeElement.scrollTo) {
                scrollBodyViewChild.nativeElement.scrollTo(options);
            } else {
                (scrollBodyViewChild as ElementRef).nativeElement.scrollLeft = options.left;
                (scrollBodyViewChild as ElementRef).nativeElement.scrollTop = options.top;
            }
        }
    }

    onDestroy() {
        this.unbindEvents();

        this.frozenSiblingBody = null;
    }
}

@Directive({
    selector: '[ttSortableColumn]',
    standalone: false,
    host: {
        '[class]': 'cx("sortableColumn")',
        '[tabindex]': 'isEnabled() ? "0" : null',
        role: 'columnheader',
        '[attr.aria-sort]': 'ariaSorted'
    },
    providers: [TreeTableStyle],
    hostDirectives: [Bind]
})
export class TTSortableColumn extends BaseComponent {
    hostName = 'TreeTable ';

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('sortableColumn', { context: { sorted: this.sorted } }));
    }

    readonly field = input<string>(undefined, { alias: "ttSortableColumn" });

    readonly ttSortableColumnDisabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    sorted: boolean | undefined;

    subscription: Subscription | undefined;

    _componentStyle = inject(TreeTableStyle);

    get ariaSorted() {
        if (this.sorted && this.tt.sortOrder < 0) return 'descending';
        else if (this.sorted && this.tt.sortOrder > 0) return 'ascending';
        else return 'none';
    }

    constructor(public tt: TreeTable) {
        super();
        if (this.isEnabled()) {
            this.subscription = this.tt.tableService.sortSource$.subscribe((sortMeta) => {
                this.updateSortState();
            });
        }
    }

    onInit() {
        if (this.isEnabled()) {
            this.updateSortState();
        }
    }

    updateSortState() {
        this.sorted = this.tt.isSorted(<string>this.field()) as boolean;
    }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        if (this.isEnabled()) {
            this.updateSortState();
            this.tt.sort({
                originalEvent: event,
                field: this.field()
            });

            clearSelection();
        }
    }

    @HostListener('keydown.enter', ['$event'])
    onEnterKey(event: MouseEvent) {
        this.onClick(event);
    }

    isEnabled() {
        return this.ttSortableColumnDisabled() !== true;
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

@Component({
    selector: 'h-treeTableSortIcon, h-treetable-sort-icon, h-tree-table-sort-icon',
    standalone: false,
    templateUrl: './ttsorticon.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TreeTableStyle]
})
export class TTSortIcon extends BaseComponent {
    hostName = 'TreeTable';

    readonly field = input<string>();

    readonly ariaLabelDesc = input<string>();

    readonly ariaLabelAsc = input<string>();

    subscription: Subscription | undefined;

    sortOrder: number | undefined;

    _componentStyle = inject(TreeTableStyle);

    constructor(
        public tt: TreeTable,
        public cd: ChangeDetectorRef
    ) {
        super();
        this.subscription = this.tt.tableService.sortSource$.subscribe((sortMeta) => {
            this.updateSortState();
            this.cd.markForCheck();
        });
    }

    onInit() {
        this.updateSortState();
    }

    onClick(event: Event) {
        event.preventDefault();
    }

    getMultiSortMetaIndex() {
        let multiSortMeta = this.tt._multiSortMeta;
        let index = -1;

        if (multiSortMeta && this.tt.sortMode() === 'multiple' && multiSortMeta.length > 1) {
            for (let i = 0; i < multiSortMeta.length; i++) {
                let meta = multiSortMeta[i];
                const field = this.field();
                if (meta.field === field || meta.field === field) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    updateSortState() {
        const sortMode = this.tt.sortMode();
        if (sortMode === 'single') {
            this.sortOrder = this.tt.isSorted(<string>this.field()) ? this.tt.sortOrder : 0;
        } else if (sortMode === 'multiple') {
            let sortMeta = this.tt.getSortMeta(<string>this.field());
            this.sortOrder = sortMeta ? sortMeta.order : 0;
        }
    }

    getBadgeValue() {
        return this.getMultiSortMetaIndex() + 1;
    }

    isMultiSorted() {
        return this.tt.sortMode() === 'multiple' && this.getMultiSortMetaIndex() > -1;
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

@Directive({
    selector: '[ttResizableColumn]',
    standalone: false
})
export class TTResizableColumn extends BaseComponent {
    hostName = 'TreeTable';

    readonly ttResizableColumnDisabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    resizer: HTMLSpanElement | undefined;

    resizerMouseDownListener: VoidListener;

    documentMouseMoveListener: VoidListener;

    documentMouseUpListener: VoidListener;

    constructor(
        public tt: TreeTable,
        public zone: NgZone
    ) {
        super();
    }

    onAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.isEnabled()) {
                addClass(this.el.nativeElement, 'p-resizable-column');
                this.resizer = this.renderer.createElement('span');
                !this.$unstyled() && this.renderer.addClass(this.resizer, 'p-column-resizer');
                (this.resizer as HTMLElement).setAttribute('data-pc-section', 'columnresizer');
                this.renderer.appendChild(this.el.nativeElement, this.resizer);

                this.zone.runOutsideAngular(() => {
                    this.resizerMouseDownListener = this.renderer.listen(this.resizer, 'mousedown', this.onMouseDown.bind(this));
                });
            }
        }
    }

    bindDocumentEvents() {
        this.zone.runOutsideAngular(() => {
            this.documentMouseMoveListener = this.renderer.listen(this.document, 'mousemove', this.onDocumentMouseMove.bind(this));
            this.documentMouseUpListener = this.renderer.listen(this.document, 'mouseup', this.onDocumentMouseUp.bind(this));
        });
    }

    unbindDocumentEvents() {
        if (this.documentMouseMoveListener) {
            this.documentMouseMoveListener();
            this.documentMouseMoveListener = null;
        }

        if (this.documentMouseUpListener) {
            this.documentMouseUpListener();
            this.documentMouseUpListener = null;
        }
    }

    onMouseDown(event: MouseEvent) {
        this.tt.onColumnResizeBegin(event);
        this.bindDocumentEvents();
    }

    onDocumentMouseMove(event: MouseEvent) {
        this.tt.onColumnResize(event);
    }

    onDocumentMouseUp(event: MouseEvent) {
        this.tt.onColumnResizeEnd(event, this.el.nativeElement);
        this.unbindDocumentEvents();
    }

    isEnabled() {
        return this.ttResizableColumnDisabled() !== true;
    }

    onDestroy() {
        if (this.resizerMouseDownListener) {
            this.resizerMouseDownListener();
            this.resizerMouseDownListener = null;
        }

        this.unbindDocumentEvents();
    }
}

@Directive({
    selector: '[ttReorderableColumn]',
    standalone: false
})
export class TTReorderableColumn extends BaseComponent {
    hostName = 'TreeTable';

    readonly ttReorderableColumnDisabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    dragStartListener: VoidListener;

    dragOverListener: VoidListener;

    dragEnterListener: VoidListener;

    dragLeaveListener: VoidListener;

    mouseDownListener: VoidListener;

    constructor(
        public tt: TreeTable,
        public zone: NgZone
    ) {
        super();
    }

    onAfterViewInit() {
        if (this.isEnabled()) {
            this.bindEvents();
        }
    }

    bindEvents() {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                this.mouseDownListener = this.renderer.listen(this.el.nativeElement, 'mousedown', this.onMouseDown.bind(this));
                this.dragStartListener = this.renderer.listen(this.el.nativeElement, 'dragstart', this.onDragStart.bind(this));
                this.dragOverListener = this.renderer.listen(this.el.nativeElement, 'dragover', this.onDragEnter.bind(this));
                this.dragEnterListener = this.renderer.listen(this.el.nativeElement, 'dragenter', this.onDragEnter.bind(this));
                this.dragLeaveListener = this.renderer.listen(this.el.nativeElement, 'dragleave', this.onDragLeave.bind(this));
            });
        }
    }

    unbindEvents() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.mouseDownListener) {
                this.mouseDownListener();
                this.mouseDownListener = null;
            }

            if (this.dragOverListener) {
                this.dragOverListener();
                this.dragOverListener = null;
            }

            if (this.dragEnterListener) {
                this.dragEnterListener();
                this.dragEnterListener = null;
            }

            if (this.dragLeaveListener) {
                this.dragLeaveListener();
                this.dragLeaveListener = null;
            }
        }
    }

    onMouseDown(event: any) {
        if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'TEXTAREA' || findSingle(event.target, '[data-pc-section="columnresizer"]')) this.el.nativeElement.draggable = false;
        else this.el.nativeElement.draggable = true;
    }

    onDragStart(event: DragEvent) {
        this.tt.onColumnDragStart(event, this.el.nativeElement);
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
    }

    onDragEnter(event: DragEvent) {
        this.tt.onColumnDragEnter(event, this.el.nativeElement);
    }

    onDragLeave(event: DragEvent) {
        this.tt.onColumnDragLeave(event);
    }

    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
        if (this.isEnabled()) {
            this.tt.onColumnDrop(event, this.el.nativeElement);
        }
    }

    isEnabled() {
        return this.ttReorderableColumnDisabled() !== true;
    }

    onDestroy() {
        this.unbindEvents();
    }
}

@Directive({
    selector: '[ttSelectableRow]',
    standalone: false,
    host: {
        '[class]': 'cx("row")',
        '[attr.aria-selected]': 'selected'
    },
    providers: [TreeTableStyle]
})
export class TTSelectableRow extends BaseComponent {
    readonly rowNode = input<any>(undefined, { alias: "ttSelectableRow" });

    readonly ttSelectableRowDisabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    selected: boolean | undefined;

    subscription: Subscription | undefined;

    _componentStyle = inject(TreeTableStyle);

    constructor(
        public tt: TreeTable,
        public tableService: TreeTableService
    ) {
        super();
        if (this.isEnabled()) {
            this.subscription = this.tt.tableService.selectionSource$.subscribe(() => {
                this.selected = this.tt.isSelected(this.rowNode().node);
            });
        }
    }

    onInit() {
        if (this.isEnabled()) {
            this.selected = this.tt.isSelected(this.rowNode().node);
        }
    }

    @HostListener('click', ['$event'])
    onClick(event: Event) {
        if (this.isEnabled()) {
            this.tt.handleRowClick({
                originalEvent: event,
                rowNode: this.rowNode()
            });
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'Enter':
            case 'Space':
                this.onEnterKey(event);
                break;

            default:
                break;
        }
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(event: Event) {
        if (this.isEnabled()) {
            this.tt.handleRowTouchEnd(event);
        }
    }

    onEnterKey(event) {
        if (this.tt.selectionMode() === 'checkbox') {
            this.tt.toggleNodeWithCheckbox({
                originalEvent: event,
                rowNode: this.rowNode()
            });
        } else {
            this.onClick(event);
        }
        event.preventDefault();
    }

    isEnabled() {
        return this.ttSelectableRowDisabled() !== true;
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

@Directive({
    selector: '[ttSelectableRowDblClick]',
    standalone: false,
    host: {
        '[class]': 'cx("row")'
    },
    providers: [TreeTableStyle]
})
export class TTSelectableRowDblClick extends BaseComponent {
    readonly rowNode = input<any>(undefined, { alias: "ttSelectableRowDblClick" });

    readonly ttSelectableRowDisabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    selected: boolean | undefined;

    subscription: Subscription | undefined;

    _componentStyle = inject(TreeTableStyle);

    constructor(
        public tt: TreeTable,
        public tableService: TreeTableService
    ) {
        super();
        if (this.isEnabled()) {
            this.subscription = this.tt.tableService.selectionSource$.subscribe(() => {
                this.selected = this.tt.isSelected(this.rowNode().node);
            });
        }
    }

    onInit() {
        if (this.isEnabled()) {
            this.selected = this.tt.isSelected(this.rowNode().node);
        }
    }

    @HostListener('dblclick', ['$event'])
    onClick(event: Event) {
        if (this.isEnabled()) {
            this.tt.handleRowClick({
                originalEvent: event,
                rowNode: this.rowNode()
            });
        }
    }

    isEnabled() {
        return this.ttSelectableRowDisabled() !== true;
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

@Directive({
    selector: '[ttContextMenuRow]',
    standalone: false,
    host: {
        '[class]': 'cx("contextMenuRow")',
        '[tabindex]': 'isEnabled() ? 0 : undefined'
    },
    providers: [TreeTableStyle]
})
export class TTContextMenuRow extends BaseComponent {
    readonly rowNode = input<any>(undefined, { alias: "ttContextMenuRow" });

    readonly ttContextMenuRowDisabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    selected: boolean | undefined;

    subscription: Subscription | undefined;

    _componentStyle = inject(TreeTableStyle);

    constructor(
        public tt: TreeTable,
        public tableService: TreeTableService
    ) {
        super();
        if (this.isEnabled()) {
            this.subscription = this.tt.tableService.contextMenuSource$.subscribe((node) => {
                this.selected = node ? this.tt.equals(this.rowNode().node, node) : false;
            });
        }
    }

    @HostListener('contextmenu', ['$event'])
    onContextMenu(event: Event) {
        if (this.isEnabled()) {
            this.tt.handleRowRightClick({
                originalEvent: event,
                rowNode: this.rowNode()
            });

            this.el.nativeElement.focus();

            event.preventDefault();
        }
    }

    isEnabled() {
        return this.ttContextMenuRowDisabled() !== true;
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

@Component({
    selector: 'h-treeTableCheckbox, h-treetable-checkbox, h-tree-table-checkbox',
    standalone: false,
    template: `
        <h-checkbox [ngModel]="checked" [pt]="ptm('pcRowCheckbox')" (onChange)="onClick($event)" [binary]="true" [disabled]="disabled()" [indeterminate]="partialChecked" [styleClass]="cx('pcNodeCheckbox')" [tabIndex]="-1" [unstyled]="unstyled()">
          @if (tt.checkboxIconTemplate || tt._checkboxIconTemplate) {
            <ng-template hTemplate="icon">
              <ng-template *ngTemplateOutlet="tt.checkboxIconTemplate || tt._checkboxIconTemplate; context: { $implicit: checked, partialSelected: partialChecked }"></ng-template>
            </ng-template>
          }
        </h-checkbox>
        `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TreeTableStyle]
})
export class TTCheckbox extends BaseComponent {
    hostName = 'TreeTable';

    readonly disabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    readonly rowNode = input<any>(undefined, { alias: "value" });

    checked: boolean | undefined;

    partialChecked: boolean | undefined;

    focused: boolean | undefined;

    subscription: Subscription | undefined;

    _componentStyle = inject(TreeTableStyle);

    constructor(
        public tt: TreeTable,
        public tableService: TreeTableService,
        public cd: ChangeDetectorRef
    ) {
        super();
        this.subscription = this.tt.tableService.selectionSource$.subscribe(() => {
            if (this.tt.selectionKeys) {
                this.checked = this.tt.isNodeSelected(this.rowNode().node);
                this.partialChecked = this.tt.isNodePartialSelected(this.rowNode().node);
            } else {
                this.checked = this.tt.isSelected(this.rowNode().node);
                this.partialChecked = this.rowNode().node.partialSelected;
            }
            this.cd.markForCheck();
        });
    }

    onInit() {
        if (this.tt.selectionKeys) {
            this.checked = this.tt.isNodeSelected(this.rowNode().node);
            this.partialChecked = this.tt.isNodePartialSelected(this.rowNode().node);
        } else {
            // for backward compatibility
            this.checked = this.tt.isSelected(this.rowNode().node);
            this.partialChecked = this.rowNode().node.partialSelected;
        }
    }

    onClick(event: Event) {
        if (!this.disabled()) {
            if (this.tt.selectionKeys) {
                const _check = !this.checked;
                this.tt.toggleCheckbox({
                    originalEvent: event,
                    check: _check,
                    rowNode: this.rowNode()
                });
            } else {
                this.tt.toggleNodeWithCheckbox({
                    originalEvent: event,
                    rowNode: this.rowNode()
                });
            }
        }
        clearSelection();
    }

    onFocus() {
        this.focused = true;
    }

    onBlur() {
        this.focused = false;
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

@Component({
    selector: 'h-treeTableHeaderCheckbox',
    standalone: false,
    template: `
        <h-checkbox [ngModel]="checked" [pt]="ptm('pcHeaderCheckbox')" (onChange)="onClick($event)" [binary]="true" [disabled]="!tt.value || tt.value.length === 0" [unstyled]="unstyled()">
          @if (tt.headerCheckboxIconTemplate || tt._headerCheckboxIconTemplate) {
            <ng-template hTemplate="icon">
              <ng-template *ngTemplateOutlet="tt.headerCheckboxIconTemplate || tt._headerCheckboxIconTemplate; context: { $implicit: checked }"></ng-template>
            </ng-template>
          }
        </h-checkbox>
        `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TTHeaderCheckbox extends BaseComponent {
    checked: boolean | undefined;

    disabled: boolean | undefined;

    selectionChangeSubscription: Subscription;

    valueChangeSubscription: Subscription;

    constructor(
        public tt: TreeTable,
        public tableService: TreeTableService
    ) {
        super();
        this.valueChangeSubscription = this.tt.tableService.uiUpdateSource$.subscribe(() => {
            this.checked = this.updateCheckedState();
        });

        this.selectionChangeSubscription = this.tt.tableService.selectionSource$.subscribe(() => {
            this.checked = this.updateCheckedState();
        });
    }

    onInit() {
        this.checked = this.updateCheckedState();
    }

    onClick(event: Event) {
        if ((this.tt?.value || this.tt?.filteredNodes) && ((this.tt?.value && this.tt.value.length > 0) || (this.tt?.filteredNodes && this.tt.filteredNodes.length > 0))) {
            this.tt?.toggleNodesWithCheckbox(event, !this.checked);
        }

        clearSelection();
    }

    onDestroy() {
        if (this.selectionChangeSubscription) {
            this.selectionChangeSubscription.unsubscribe();
        }

        if (this.valueChangeSubscription) {
            this.valueChangeSubscription.unsubscribe();
        }
    }

    updateCheckedState() {
        this.cd.markForCheck();
        let checked!: boolean;
        const data = this.tt.filteredNodes || this.tt.value;

        if (data) {
            if (this.tt.selectionKeys) {
                for (let node of data) {
                    if (this.tt.isNodeSelected(node)) {
                        checked = true;
                    } else {
                        checked = false;
                        break;
                    }
                }
            }
            if (!this.tt.selectionKeys) {
                // legacy selection support, will be removed in v18
                for (let node of data) {
                    if (this.tt.isSelected(node)) {
                        checked = true;
                    } else {
                        checked = false;
                        break;
                    }
                }
            }
        } else {
            checked = false;
        }

        return checked;
    }
}

@Directive({
    selector: '[ttEditableColumn]',
    standalone: false
})
export class TTEditableColumn extends BaseComponent {
    readonly data = input<any>(undefined, { alias: "ttEditableColumn" });

    readonly field = input<any>(undefined, { alias: "ttEditableColumnField" });

    readonly ttEditableColumnDisabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    constructor(
        public tt: TreeTable,
        public zone: NgZone
    ) {
        super();
    }

    onAfterViewInit() {
        if (this.isEnabled()) {
            !this.$unstyled() && addClass(this.el.nativeElement, 'p-editable-column');
            this.el?.nativeElement.setAttribute('data-p-editable-column', 'true');
        }
    }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        if (this.isEnabled()) {
            this.tt.editingCellClick = true;

            if (this.tt.editingCell) {
                if (this.tt.editingCell !== this.el.nativeElement) {
                    if (!this.tt.isEditingCellValid()) {
                        return;
                    }

                    if (this.tt.editingCell) !this.$unstyled() && removeClass(this.tt.editingCell, 'p-cell-editing');
                    this.openCell();
                }
            } else {
                this.openCell();
            }
        }
    }

    openCell() {
        const data = this.data();
        const field = this.field();
        this.tt.updateEditingCell(this.el.nativeElement, data, field);
        !this.$unstyled() && addClass(this.el.nativeElement, 'p-cell-editing');
        this.el?.nativeElement.setAttribute('data-p-cell-editing', 'true');
        this.tt.onEditInit.emit({ field: field, data: data });
        this.tt.editingCellClick = true;
        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                let focusable = <any>findSingle(this.el.nativeElement, 'input, textarea');
                if (focusable) {
                    focusable.focus();
                }
            }, 50);
        });
    }

    closeEditingCell() {
        if (this.tt.editingCell) !this.$unstyled() && removeClass(this.tt.editingCell, 'p-checkbox-icon');
        this.tt.editingCell = null;
        this.tt.unbindDocumentEditListener();
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (this.isEnabled()) {
            //enter
            if (event.keyCode == 13 && !event.shiftKey) {
                if (this.tt.isEditingCellValid()) {
                    if (this.tt.editingCell) {
                        !this.$unstyled() && removeClass(this.tt.editingCell, 'p-cell-editing');
                        this.el?.nativeElement.setAttribute('data-p-cell-editing', 'false');
                    }
                    this.closeEditingCell();
                    this.tt.onEditComplete.emit({ field: this.field(), data: this.data() });
                }

                event.preventDefault();
            }

            //escape
            else if (event.keyCode == 27) {
                if (this.tt.isEditingCellValid()) {
                    if (this.tt.editingCell) {
                        !this.$unstyled() && removeClass(this.tt.editingCell, 'p-cell-editing');
                        this.el?.nativeElement.setAttribute('data-p-cell-editing', 'false');
                    }
                    this.closeEditingCell();
                    this.tt.onEditCancel.emit({ field: this.field(), data: this.data() });
                }

                event.preventDefault();
            }

            //tab
            else if (event.keyCode == 9) {
                this.tt.onEditComplete.emit({ field: this.field(), data: this.data() });

                if (event.shiftKey) this.moveToPreviousCell(event);
                else this.moveToNextCell(event);
            }
        }
    }

    findCell(element: any) {
        if (element) {
            let cell = element;
            while (cell && !findSingle(cell, '[data-p-cell-editing="true"]')) {
                cell = cell.parentElement;
            }

            return cell;
        } else {
            return null;
        }
    }

    moveToPreviousCell(event: KeyboardEvent) {
        let currentCell = this.findCell(event.target);
        let row = currentCell.parentElement;
        let targetCell = this.findPreviousEditableColumn(currentCell);

        if (targetCell) {
            // @ts-ignore
            invokeElementMethod(targetCell as HTMLElement, 'click', undefined);
            event.preventDefault();
        }
    }

    moveToNextCell(event: KeyboardEvent) {
        let currentCell = this.findCell(event.target);
        let row = currentCell.parentElement;
        let targetCell = this.findNextEditableColumn(currentCell);

        if (targetCell) {
            // @ts-ignore
            invokeElementMethod(targetCell, 'click', undefined);
            event.preventDefault();
        }
    }

    findPreviousEditableColumn(cell: any): Element | null {
        let prevCell = cell.previousElementSibling;

        if (!prevCell) {
            let previousRow = cell.parentElement ? cell.parentElement.previousElementSibling : null;
            if (previousRow) {
                prevCell = previousRow.lastElementChild;
            }
        }

        if (prevCell) {
            if (findSingle(prevCell, '[data-p-editable-column="true"]')) return prevCell;
            else return this.findPreviousEditableColumn(prevCell);
        } else {
            return null;
        }
    }

    findNextEditableColumn(cell: Element): Element | null {
        let nextCell = cell.nextElementSibling;

        if (!nextCell) {
            let nextRow = cell.parentElement ? cell.parentElement.nextElementSibling : null;
            if (nextRow) {
                nextCell = nextRow.firstElementChild;
            }
        }

        if (nextCell) {
            if (findSingle(nextCell, '[data-p-editable-column="true"]')) return nextCell;
            else return this.findNextEditableColumn(nextCell);
        } else {
            return null;
        }
    }

    isEnabled() {
        return this.ttEditableColumnDisabled() !== true;
    }
}

@Component({
    selector: 'h-treeTableCellEditor, h-treetablecelleditor, h-treetable-cell-editor',
    standalone: false,
    template: `
        @if (tt.editingCell === editableColumn.el.nativeElement) {
          <ng-container *ngTemplateOutlet="inputTemplate"></ng-container>
        }
        @if (!tt.editingCell || tt.editingCell !== editableColumn.el.nativeElement) {
          <ng-container *ngTemplateOutlet="outputTemplate"></ng-container>
        }
        `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    hostDirectives: [Bind]
})
export class TreeTableCellEditor extends BaseComponent {
    hostName = 'TreeTable';

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('cellEditor'));
    }

    readonly templates = contentChildren(PrimeTemplate);

    inputTemplate: Nullable<TemplateRef<any>>;

    outputTemplate: Nullable<TemplateRef<any>>;

    constructor(
        public tt: TreeTable,
        public editableColumn: TTEditableColumn
    ) {
        super();
    }

    onAfterContentInit() {
        this.templates().forEach((item) => {
            switch (item.getType()) {
                case 'input':
                    this.inputTemplate = item.template;
                    break;

                case 'output':
                    this.outputTemplate = item.template;
                    break;
            }
        });
    }
}

@Directive({
    selector: '[ttRow]',
    standalone: false,
    host: {
        '[class]': `'p-element ' + styleClass`,
        '[tabindex]': "'0'",
        '[attr.aria-expanded]': 'expanded',
        '[attr.aria-level]': 'level',
        role: 'row'
    },
    providers: [TreeTableStyle],
    hostDirectives: [Bind]
})
export class TTRow extends BaseComponent {
    hostName = 'TreeTable';

    bindDirectiveInstance = inject(Bind, { self: true });

    treeTable = inject(TreeTable);

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('row', this.ptmOptions()));
    }

    get level() {
        return this.rowNode()?.['level'] + 1;
    }

    get styleClass() {
        return this.rowNode()?.node['styleClass'] || '';
    }

    get expanded() {
        return this.rowNode()?.node['expanded'];
    }

    readonly rowNode = input<any>(undefined, { alias: "ttRow" });

    _componentStyle = inject(TreeTableStyle);

    constructor(
        public tt: TreeTable,
        public el: ElementRef,
        public zone: NgZone
    ) {
        super();
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowDown':
                this.onArrowDownKey(event);
                break;

            case 'ArrowUp':
                this.onArrowUpKey(event);
                break;

            case 'ArrowRight':
                this.onArrowRightKey(event);
                break;

            case 'ArrowLeft':
                this.onArrowLeftKey(event);
                break;

            case 'Tab':
                this.onTabKey(event);
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

    onArrowDownKey(event: KeyboardEvent) {
        let nextRow = this.el?.nativeElement?.nextElementSibling;
        if (nextRow) {
            this.focusRowChange(<HTMLElement>event.currentTarget, nextRow);
        }

        event.preventDefault();
    }

    onArrowUpKey(event: KeyboardEvent) {
        let prevRow = this.el?.nativeElement?.previousElementSibling;
        if (prevRow) {
            this.focusRowChange(<HTMLElement>event.currentTarget, prevRow);
        }

        event.preventDefault();
    }

    onArrowRightKey(event: KeyboardEvent) {
        const currentTarget = <HTMLElement>event.currentTarget;
        const isHiddenIcon = (findSingle(currentTarget, 'button') as any).style.visibility === 'hidden';

        if (!isHiddenIcon && !this.expanded && this.rowNode().node['children']) {
            this.expand(event);

            currentTarget.tabIndex = -1;
        }
        event.preventDefault();
    }

    onArrowLeftKey(event: KeyboardEvent) {
        const container = this.tt.el?.nativeElement;
        const expandedRows = find(container, '[aria-expanded="true"]');
        const lastExpandedRow = expandedRows[expandedRows.length - 1];

        if (this.expanded) {
            this.collapse(event);
        }
        if (lastExpandedRow) {
            this.tt.toggleRowIndex = getIndex(lastExpandedRow as any);
        }
        this.restoreFocus();
        event.preventDefault();
    }

    onHomeKey(event: KeyboardEvent) {
        const firstElement = <any>findSingle(this.tt.el?.nativeElement, `tr[aria-level="${this.level}"]`);
        firstElement && focus(firstElement);
        event.preventDefault();
    }

    onEndKey(event: KeyboardEvent) {
        const nodes = <any>find(this.tt.el?.nativeElement, `tr[aria-level="${this.level}"]`);
        const lastElement = nodes[nodes.length - 1];
        focus(lastElement);
        event.preventDefault();
    }

    onTabKey(event: KeyboardEvent) {
        const rows = this.el.nativeElement ? [...find(this.el.nativeElement.parentNode, 'tr')] : undefined;

        if (rows && isNotEmpty(rows)) {
            const hasSelectedRow = rows.some((row) => getAttribute(row, 'data-p-highlight') || row.getAttribute('aria-selected') === 'true');
            rows.forEach((row: any) => {
                row.tabIndex = -1;
            });

            if (hasSelectedRow) {
                const selectedNodes = rows.filter((node) => getAttribute(node, 'data-p-highlight') || node.getAttribute('aria-selected') === 'true');
                (selectedNodes[0] as any).tabIndex = 0;

                return;
            }

            (rows[0] as any).tabIndex = 0;
        }
    }

    expand(event: Event) {
        this.tt.toggleRowIndex = getIndex(this.el.nativeElement);
        const node = this.rowNode()?.node;
        if (node) node['expanded'] = true;

        this.tt.updateSerializedValue();
        this.tt.tableService.onUIUpdate(this.tt.value);
        node?.['children'] ? this.restoreFocus(this.tt.toggleRowIndex + 1) : this.restoreFocus();

        this.tt.onNodeExpand.emit({
            originalEvent: event,
            node
        });
    }

    collapse(event: Event) {
        const node = this.rowNode()?.node;
        if (node) node['expanded'] = false;

        this.tt.updateSerializedValue();
        this.tt.tableService.onUIUpdate(this.tt.value);

        this.tt.onNodeCollapse.emit({ originalEvent: event, node });
    }

    focusRowChange(firstFocusableRow, currentFocusedRow, lastVisibleDescendant?) {
        firstFocusableRow.tabIndex = '-1';
        currentFocusedRow.tabIndex = '0';

        focus(currentFocusedRow);
    }

    restoreFocus(index?) {
        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                const container = this.tt.el?.nativeElement;
                const tbody = findSingle(container, '[data-pc-section="tbody"]');
                const row = tbody?.children?.[<number>index || this.tt.toggleRowIndex || 0];
                const rows = [...find(container, 'tr')];

                rows &&
                    rows.forEach((r: any) => {
                        if (row && !row.isSameNode(r)) {
                            r.tabIndex = -1;
                        }
                    });

                if (row) {
                    (row as HTMLElement).tabIndex = 0;
                    (row as HTMLElement).focus();
                }
            }, 25);
        });
    }

    ptmOptions() {
        return {
            context: {
                selectable: this.treeTable?.rowHover() || this.treeTable.selectionMode() === 'row',
                selected: this.treeTable.isSelected((<any>this.rowNode())?.node),
                scrollable: this.treeTable?.scrollable(),
                rowNode: this.rowNode()
            }
        };
    }
}

@Component({
    selector: 'h-treeTableToggler, h-treetabletoggler, h-treetable-toggler',
    standalone: false,
    templateUrl: './treetabletoggler.html',
    encapsulation: ViewEncapsulation.None,
    providers: [TreeTableStyle],
    changeDetection: ChangeDetectionStrategy.Eager,
    hostDirectives: [Bind]
})
export class TreeTableToggler extends BaseComponent {
    hostName = 'TreeTable';

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('toggler'));
    }

    readonly rowNode = input<any>();

    _componentStyle = inject(TreeTableStyle);

    constructor(public tt: TreeTable) {
        super();
    }

    get toggleButtonAriaLabel() {
        return this.config.translation ? (this.rowNode().expanded ? this.config.translation?.aria?.collapseRow : this.config.translation?.aria?.expandRow) : undefined;
    }

    onClick(event: Event) {
        const node = this.rowNode();
        node.node.expanded = !node.node.expanded;

        if (node.node.expanded) {
            this.tt.onNodeExpand.emit({
                originalEvent: event,
                node: node.node
            });
        } else {
            this.tt.onNodeCollapse.emit({
                originalEvent: event,
                node: node.node
            });
        }

        this.tt.updateSerializedValue();
        this.tt.tableService.onUIUpdate(this.tt.value);

        event.preventDefault();
    }
}

@NgModule({
    imports: [
        CommonModule,
        PaginatorModule,
        Ripple,
        Scroller,
        SpinnerIcon,
        ArrowDownIcon,
        ArrowUpIcon,
        SortAltIcon,
        SortAmountUpAltIcon,
        SortAmountDownIcon,
        BadgeModule,
        CheckIcon,
        ChevronDownIcon,
        ChevronRightIcon,
        Checkbox,
        SharedModule,
        FormsModule,
        BindModule
    ],
    exports: [
        TreeTable,
        SharedModule,
        TreeTableToggler,
        TTSortableColumn,
        TTSortIcon,
        TTResizableColumn,
        TTRow,
        TTReorderableColumn,
        TTSelectableRow,
        TTSelectableRowDblClick,
        TTContextMenuRow,
        TTCheckbox,
        TTHeaderCheckbox,
        TTEditableColumn,
        TreeTableCellEditor,
        Scroller
    ],
    declarations: [
        TreeTable,
        TreeTableToggler,
        TTScrollableView,
        TTBody,
        TTSortableColumn,
        TTSortIcon,
        TTResizableColumn,
        TTRow,
        TTReorderableColumn,
        TTSelectableRow,
        TTSelectableRowDblClick,
        TTContextMenuRow,
        TTCheckbox,
        TTHeaderCheckbox,
        TTEditableColumn,
        TreeTableCellEditor
    ]
})
export class TreeTableModule {}
