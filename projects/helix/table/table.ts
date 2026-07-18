import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  contentChildren,
  Directive,
  ElementRef,
  inject,
  Injectable,
  InjectionToken,
  input,
  model,
  NgModule,
  NgZone,
  numberAttribute,
  Optional,
  output,
  QueryList,
  signal,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  viewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MotionEvent, MotionOptions } from '@primeuix/motion';
import { absolutePosition, addStyle, appendChild, find, findSingle, getAttribute, isClickable, setAttribute } from '@primeuix/utils';
import { BlockableUI, FilterMatchMode, FilterMetadata, FilterOperator, FilterService, LazyLoadMeta, OverlayService, PrimeTemplate, ScrollerOptions, SelectItem, SharedModule, SortMeta, TableState, TranslationKeys } from '@gravionlabs/helix/api';
import { BadgeModule } from '@gravionlabs/helix/badge';
import { BaseComponent, PARENT_INSTANCE } from '@gravionlabs/helix/basecomponent';
import { Bind, BindModule } from '@gravionlabs/helix/bind';
import { Button, ButtonModule } from '@gravionlabs/helix/button';
import { CheckboxChangeEvent, CheckboxModule } from '@gravionlabs/helix/checkbox';
import { DatePickerModule } from '@gravionlabs/helix/datepicker';
import { ConnectedOverlayScrollHandler, DomHandler } from '@gravionlabs/helix/dom';
import { ArrowDownIcon } from '@gravionlabs/helix/icons/arrowdown';
import { ArrowUpIcon } from '@gravionlabs/helix/icons/arrowup';
import { FilterIcon } from '@gravionlabs/helix/icons/filter';
import { FilterFillIcon } from '@gravionlabs/helix/icons/filterfill';
import { FilterSlashIcon } from '@gravionlabs/helix/icons/filterslash';
import { PlusIcon } from '@gravionlabs/helix/icons/plus';
import { SortAltIcon } from '@gravionlabs/helix/icons/sortalt';
import { SortAmountDownIcon } from '@gravionlabs/helix/icons/sortamountdown';
import { SortAmountUpAltIcon } from '@gravionlabs/helix/icons/sortamountupalt';
import { SpinnerIcon } from '@gravionlabs/helix/icons/spinner';
import { TrashIcon } from '@gravionlabs/helix/icons/trash';
import { InputNumberModule } from '@gravionlabs/helix/inputnumber';
import { InputTextModule } from '@gravionlabs/helix/inputtext';
import { MotionModule } from '@gravionlabs/helix/motion';
import { PaginatorModule } from '@gravionlabs/helix/paginator';
import { RadioButton, RadioButtonClickEvent, RadioButtonModule } from '@gravionlabs/helix/radiobutton';
import { Scroller, ScrollerModule } from '@gravionlabs/helix/scroller';
import { SelectModule } from '@gravionlabs/helix/select';
import { SelectButtonModule } from '@gravionlabs/helix/selectbutton';
import { Nullable, VoidListener } from '@gravionlabs/helix/ts-helpers';
import {
    ColumnFilterPassThrough,
    ExportCSVOptions,
    TableColResizeEvent,
    TableColumnReorderEvent,
    TableContextMenuSelectEvent,
    TableEditCancelEvent,
    TableEditCompleteEvent,
    TableEditInitEvent,
    TableFilterButtonPropsOptions,
    TableFilterEvent,
    TableHeaderCheckboxToggleEvent,
    TableLazyLoadEvent,
    TablePageEvent,
    TablePassThrough,
    TableRowCollapseEvent,
    TableRowExpandEvent,
    TableRowReorderEvent,
    TableRowSelectEvent,
    TableRowUnSelectEvent
} from '@gravionlabs/helix/types/table';
import { ObjectUtils, UniqueComponentId, ZIndexUtils } from '@gravionlabs/helix/utils';
import { Subject, Subscription } from 'rxjs';
import { TableStyle } from './style/tablestyle';

const TABLE_INSTANCE = new InjectionToken<Table>('TABLE_INSTANCE');

@Injectable()
export class TableService {
    private sortSource = new Subject<SortMeta | SortMeta[] | null>();
    private selectionSource = new Subject();
    private contextMenuSource = new Subject<any>();
    private valueSource = new Subject<any>();
    private columnsSource = new Subject();

    sortSource$ = this.sortSource.asObservable();
    selectionSource$ = this.selectionSource.asObservable();
    contextMenuSource$ = this.contextMenuSource.asObservable();
    valueSource$ = this.valueSource.asObservable();
    columnsSource$ = this.columnsSource.asObservable();

    onSort(sortMeta: SortMeta | SortMeta[] | null) {
        this.sortSource.next(sortMeta);
    }

    onSelectionChange() {
        this.selectionSource.next(null);
    }

    onContextMenu(data: any) {
        this.contextMenuSource.next(data);
    }

    onValueChange(value: any) {
        this.valueSource.next(value);
    }

    onColumnsChange(columns: any[]) {
        this.columnsSource.next(columns);
    }
}
/**
 * Table displays data in tabular format.
 * @group Components
 */
@Component({
    selector: 'h-table',
    standalone: false,
    templateUrl: './table.html',
    providers: [TableService, TableStyle, { provide: TABLE_INSTANCE, useExisting: Table }, { provide: PARENT_INSTANCE, useExisting: Table }],
    changeDetection: ChangeDetectionStrategy.Eager,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': "cn(cx('root'), styleClass())",
        '[attr.data-p]': 'dataP'
    },
    hostDirectives: [Bind]
})
export class Table<RowData = any> extends BaseComponent<TablePassThrough> implements BlockableUI {
    componentName = 'DataTable';
    /**
     * An array of objects to represent dynamic columns that are frozen.
     * @group Props
     */
    readonly frozenColumns = input<any[]>();
    /**
     * An array of objects to display as frozen.
     * @group Props
     */
    readonly frozenValue = input<any[] | undefined>(undefined);
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
     * When specified as true, enables the pagination.
     * @group Props
     */
    readonly paginator = input<boolean, unknown>(undefined, { transform: booleanAttribute });
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
     * Position of the paginator, options are "top", "bottom" or "both".
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
     * Paginator dropdown height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value.
     * @group Props
     */
    readonly paginatorDropdownScrollHeight = input<string>('200px');
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
     * Whether to display a input to navigate to any page.
     * @group Props
     */
    readonly showJumpToPageInput = input<boolean, unknown>(undefined, { transform: booleanAttribute });
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
     * When true, resets paginator to first page after sorting. Available only when sortMode is set to single.
     * @group Props
     */
    readonly resetPageOnSort = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Specifies the selection mode, valid values are "single" and "multiple".
     * @group Props
     */
    readonly selectionMode = input<'single' | 'multiple' | null>();
    /**
     * When enabled with paginator and checkbox selection mode, the select all checkbox in the header will select all rows on the current page.
     * @group Props
     */
    readonly selectionPageOnly = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Selected row with a context menu.
     * @group Props
     */
    readonly contextMenuSelection = model<any>(undefined);
    /**
     *  Defines the behavior of context menu selection, in "separate" mode context menu updates contextMenuSelection property whereas in joint mode selection property is used instead so that when row selection is enabled, both row selection and context menu selection use the same property.
     * @group Props
     */
    readonly contextMenuSelectionMode = input<string>('separate');
    /**
     * A property to uniquely identify a record in data.
     * @group Props
     */
    readonly dataKey = input<string>();
    /**
     * Defines whether metaKey should be considered for the selection. On touch enabled devices, metaKeySelection is turned off automatically.
     * @group Props
     */
    readonly metaKeySelection = input<boolean | undefined, unknown>(false, { transform: booleanAttribute });
    /**
     * Defines if the row is selectable.
     * @group Props
     */
    readonly rowSelectable = input<(row: {
    data: any;
    index: number;
}) => boolean | undefined>(undefined!);
    /**
     * Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity.
     * @group Props
     */
    readonly rowTrackBy = input<Function>((index: number, item: any) => item);
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
     * Algorithm to define if a row is selected, valid values are "equals" that compares by reference and "deepEquals" that compares all fields.
     * @group Props
     */
    readonly compareSelectionBy = input<'equals' | 'deepEquals'>('deepEquals');
    /**
     * Character to use as the csv separator.
     * @group Props
     */
    readonly csvSeparator = input<string>(',');
    /**
     * Name of the exported file.
     * @group Props
     */
    readonly exportFilename = input<string>('download');
    /**
     * An array of FilterMetadata objects to provide external filters.
     * @group Props
     */
    readonly filters = input<{ [s: string]: FilterMetadata | FilterMetadata[] }>({});
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
     * Locale to use in filtering. The default locale is the host environment's current locale.
     * @group Props
     */
    readonly filterLocale = input<string>();
    /**
     * Map instance to keep the expanded rows where key of the map is the data key of the row.
     * @group Props
     */
    readonly expandedRowKeys = input<{ [s: string]: boolean }>({});
    /**
     * Map instance to keep the rows being edited where key of the map is the data key of the row.
     * @group Props
     */
    readonly editingRowKeys = input<{
    [s: string]: boolean;
}>({});
    /**
     * Whether multiple rows can be expanded at any time. Valid values are "multiple" and "single".
     * @group Props
     */
    readonly rowExpandMode = input<'multiple' | 'single'>('multiple');
    /**
     * Enables scrollable tables.
     * @group Props
     */
    readonly scrollable = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Type of the row grouping, valid values are "subheader" and "rowspan".
     * @group Props
     */
    readonly rowGroupMode = input<'subheader' | 'rowspan'>();
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
     * Threshold in milliseconds to delay lazy loading during scrolling.
     * @group Props
     */
    readonly virtualScrollDelay = input<number, unknown>(250, { transform: numberAttribute });
    /**
     * Width of the frozen columns container.
     * @group Props
     */
    readonly frozenWidth = input<string>();
    /**
     * Local ng-template varilable of a ContextMenu.
     * @group Props
     */
    readonly contextMenu = input<any>();
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
     * Displays a loader to indicate data load is in progress.
     * @group Props
     */
    readonly loading = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * The icon to show while indicating data load is in progress.
     * @group Props
     */
    readonly loadingIcon = input<string | undefined>(undefined);
    /**
     * Whether to show the loading mask when loading property is true.
     * @group Props
     */
    readonly showLoader = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Adds hover effect to rows without the need for selectionMode. Note that tr elements that can be hovered need to have "p-selectable-row" class for rowHover to work.
     * @group Props
     */
    readonly rowHover = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether to use the default sorting or a custom one using sortFunction.
     * @group Props
     */
    readonly customSort = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether to use the initial sort badge or not.
     * @group Props
     */
    readonly showInitialSortBadge = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Export function.
     * @group Props
     */
    readonly exportFunction = input<Function>();
    /**
     * Custom export header of the column to be exported as CSV.
     * @group Props
     */
    readonly exportHeader = input<string>();
    /**
     * Unique identifier of a stateful table to use in state storage.
     * @group Props
     */
    readonly stateKey = input<string | undefined>(undefined);
    /**
     * Defines where a stateful table keeps its state, valid values are "session" for sessionStorage and "local" for localStorage.
     * @group Props
     */
    readonly stateStorage = input<'session' | 'local'>('session');
    /**
     * Defines the editing mode, valid values are "cell" and "row".
     * @group Props
     */
    readonly editMode = input<'cell' | 'row'>('cell');
    /**
     * Field name to use in row grouping.
     * @group Props
     */
    readonly groupRowsBy = input<any>();
    /**
     * Defines the size of the table.
     * @group Props
     */
    readonly size = input<'small' | 'large'>();
    /**
     * Whether to show grid lines between cells.
     * @group Props
     */
    readonly showGridlines = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Whether to display rows with alternating colors.
     * @group Props
     */
    readonly stripedRows = input<boolean, unknown>(undefined, { transform: booleanAttribute });
    /**
     * Order to sort when default row grouping is enabled.
     * @group Props
     */
    readonly groupRowsByOrder = input<number, unknown>(1, { transform: numberAttribute });
    /**
     * Defines the responsive mode, valid options are "stack" and "scroll".
     * @deprecated since v20.0.0, always defaults to scroll, stack mode needs custom implementation
     * @group Props
     */
    readonly responsiveLayout = input<string>('scroll');
    /**
     * The breakpoint to define the maximum width boundary when using stack responsive layout.
     * @group Props
     */
    readonly breakpoint = input<string>('960px');
    /**
     * Locale to be used in paginator formatting.
     * @group Props
     */
    readonly paginatorLocale = input<string>();
    /**
     * An array of objects to display.
     * @group Props
     */
    readonly value = model<RowData[]>([]);
    /**
     * An array of objects to represent dynamic columns.
     * @group Props
     */
    readonly columns = model<any[] | undefined>(undefined);
    /**
     * Index of the first row to be displayed.
     * @group Props
     */
    readonly first = model<number | null | undefined>(0);
    /**
     * Number of rows to display per page.
     * @group Props
     */
    readonly rows = model<number | undefined>(undefined);
    /**
     * Number of total records, defaults to length of value when not defined.
     * @group Props
     */
    readonly totalRecords = model<number>(0);

    /**
     * Name of the field to sort data by default.
     * @group Props
     */
    readonly sortField = model<string | undefined | null>(undefined);
    /**
     * Order to sort when default sorting is enabled.
     * @group Props
     */
    readonly sortOrder = model<number>(1);
    /**
     * An array of SortMeta objects to sort the data by default in multiple sort mode.
     * @group Props
     */
    readonly multiSortMeta = model<SortMeta[] | undefined | null>(undefined);
    /**
     * Selected row in single mode or an array of values in multiple mode.
     * @group Props
     */
    readonly selection = model<any>(undefined);
    /**
     * Whether all data is selected.
     * @group Props
     */
    readonly selectAll = model<boolean | null>(null);
    /**
     * Callback to invoke when a row is selected.
     * @param {TableRowSelectEvent} event - custom select event.
     * @group Emits
     */
    readonly onRowSelect = output<TableRowSelectEvent<RowData>>();
    /**
     * Callback to invoke when a row is unselected.
     * @param {TableRowUnSelectEvent} event - custom unselect event.
     * @group Emits
     */
    readonly onRowUnselect = output<TableRowUnSelectEvent<RowData>>();
    /**
     * Callback to invoke when pagination occurs.
     * @param {TablePageEvent} event - custom pagination event.
     * @group Emits
     */
    readonly onPage = output<TablePageEvent>();
    /**
     * Callback to invoke when a column gets sorted.
     * @param {Object} object - sort meta.
     * @group Emits
     */
    readonly onSort = output<{
    multisortmeta: SortMeta[];
} | any>();
    /**
     * Callback to invoke when data is filtered.
     * @param {TableFilterEvent} event - custom filtering event.
     * @group Emits
     */
    readonly onFilter = output<TableFilterEvent>();
    /**
     * Callback to invoke when paging, sorting or filtering happens in lazy mode.
     * @param {TableLazyLoadEvent} event - custom lazy loading event.
     * @group Emits
     */
    readonly onLazyLoad = output<TableLazyLoadEvent>();
    /**
     * Callback to invoke when a row is expanded.
     * @param {TableRowExpandEvent} event - custom row expand event.
     * @group Emits
     */
    readonly onRowExpand = output<TableRowExpandEvent<RowData>>();
    /**
     * Callback to invoke when a row is collapsed.
     * @param {TableRowCollapseEvent} event - custom row collapse event.
     * @group Emits
     */
    readonly onRowCollapse = output<TableRowCollapseEvent>();
    /**
     * Callback to invoke when a row is selected with right click.
     * @param {TableContextMenuSelectEvent} event - custom context menu select event.
     * @group Emits
     */
    readonly onContextMenuSelect = output<TableContextMenuSelectEvent<RowData>>();
    /**
     * Callback to invoke when a column is resized.
     * @param {TableColResizeEvent} event - custom column resize event.
     * @group Emits
     */
    readonly onColResize = output<TableColResizeEvent>();
    /**
     * Callback to invoke when a column is reordered.
     * @param {TableColumnReorderEvent} event - custom column reorder event.
     * @group Emits
     */
    readonly onColReorder = output<TableColumnReorderEvent>();
    /**
     * Callback to invoke when a row is reordered.
     * @param {TableRowReorderEvent} event - custom row reorder event.
     * @group Emits
     */
    readonly onRowReorder = output<TableRowReorderEvent>();
    /**
     * Callback to invoke when a cell switches to edit mode.
     * @param {TableEditInitEvent} event - custom edit init event.
     * @group Emits
     */
    readonly onEditInit = output<TableEditInitEvent>();
    /**
     * Callback to invoke when cell edit is completed.
     * @param {TableEditCompleteEvent} event - custom edit complete event.
     * @group Emits
     */
    readonly onEditComplete = output<TableEditCompleteEvent>();
    /**
     * Callback to invoke when cell edit is cancelled with escape key.
     * @param {TableEditCancelEvent} event - custom edit cancel event.
     * @group Emits
     */
    readonly onEditCancel = output<TableEditCancelEvent>();
    /**
     * Callback to invoke when state of header checkbox changes.
     * @param {TableHeaderCheckboxToggleEvent} event - custom header checkbox event.
     * @group Emits
     */
    readonly onHeaderCheckboxToggle = output<TableHeaderCheckboxToggleEvent>();
    /**
     * A function to implement custom sorting, refer to sorting section for details.
     * @param {any} any - sort meta.
     * @group Emits
     */
    readonly sortFunction = output<any>();
    /**
     * Callback to invoke table state is saved.
     * @param {TableState} object - table state.
     * @group Emits
     */
    readonly onStateSave = output<TableState>();
    /**
     * Callback to invoke table state is restored.
     * @param {TableState} object - table state.
     * @group Emits
     */
    readonly onStateRestore = output<TableState>();

    readonly resizeHelperViewChild = viewChild<Nullable<ElementRef>>('resizeHelper');

    readonly reorderIndicatorUpViewChild = viewChild<Nullable<ElementRef>>('reorderIndicatorUp');

    readonly reorderIndicatorDownViewChild = viewChild<Nullable<ElementRef>>('reorderIndicatorDown');

    readonly wrapperViewChild = viewChild<Nullable<ElementRef>>('wrapper');

    readonly tableViewChild = viewChild<Nullable<ElementRef>>('table');

    readonly tableHeaderViewChild = viewChild<Nullable<ElementRef>>('thead');

    readonly tableFooterViewChild = viewChild<Nullable<ElementRef>>('tfoot');

    readonly scroller = viewChild<Nullable<Scroller>>('scroller');

    readonly _templates = contentChildren(PrimeTemplate);

    filteredValue: any[] | undefined | null;

    // @todo will be refactored later
    readonly _headerTemplate = contentChild.required<TemplateRef<any>>('header', { descendants: false });
    headerTemplate: Nullable<TemplateRef<any>>;

    readonly _headerGroupedTemplate = contentChild.required<TemplateRef<any>>('headergrouped', { descendants: false });
    headerGroupedTemplate: Nullable<TemplateRef<any>>;

    readonly _bodyTemplate = contentChild.required<TemplateRef<any>>('body', { descendants: false });
    bodyTemplate: Nullable<TemplateRef<any>>;

    readonly _loadingBodyTemplate = contentChild.required<TemplateRef<any>>('loadingbody', { descendants: false });
    loadingBodyTemplate: Nullable<TemplateRef<any>>;

    readonly _captionTemplateSignal = contentChild<TemplateRef<any>>('caption', { descendants: false });
    get _captionTemplate(): TemplateRef<any> | undefined { return this._captionTemplateSignal(); }
    captionTemplate: Nullable<TemplateRef<any>>;

    private _footerTemplateSignal_val: TemplateRef<any> | undefined;
    readonly _footerTemplateSignal = contentChild<TemplateRef<any>>('footer', { descendants: false });
    get _footerTemplate(): TemplateRef<any> | undefined { return this._footerTemplateSignal_val ?? this._footerTemplateSignal(); }
    set _footerTemplate(val: TemplateRef<any> | undefined) { this._footerTemplateSignal_val = val; }
    footerTemplate: Nullable<TemplateRef<any>>;

    readonly _footerGroupedTemplateSignal = contentChild<TemplateRef<any>>('footergrouped', { descendants: false });
    get _footerGroupedTemplate(): TemplateRef<any> | undefined { return this._footerGroupedTemplateSignal(); }
    footerGroupedTemplate: Nullable<TemplateRef<any>>;

    readonly _summaryTemplateSignal = contentChild<TemplateRef<any>>('summary', { descendants: false });
    get _summaryTemplate(): TemplateRef<any> | undefined { return this._summaryTemplateSignal(); }
    summaryTemplate: Nullable<TemplateRef<any>>;

    readonly _colGroupTemplate = contentChild.required<TemplateRef<any>>('colgroup', { descendants: false });
    colGroupTemplate: Nullable<TemplateRef<any>>;

    readonly _expandedRowTemplateSignal = contentChild<TemplateRef<any>>('expandedrow', { descendants: false });
    get _expandedRowTemplate(): TemplateRef<any> | undefined { return this._expandedRowTemplateSignal(); }
    expandedRowTemplate: Nullable<TemplateRef<any>>;

    readonly _groupHeaderTemplateSignal = contentChild<TemplateRef<any>>('groupheader', { descendants: false });
    get _groupHeaderTemplate(): TemplateRef<any> | undefined { return this._groupHeaderTemplateSignal(); }
    groupHeaderTemplate: Nullable<TemplateRef<any>>;

    readonly _groupFooterTemplateSignal = contentChild<TemplateRef<any>>('groupfooter', { descendants: false });
    get _groupFooterTemplate(): TemplateRef<any> | undefined { return this._groupFooterTemplateSignal(); }
    groupFooterTemplate: Nullable<TemplateRef<any>>;

    readonly _frozenExpandedRowTemplateSignal = contentChild<TemplateRef<any>>('frozenexpandedrow', { descendants: false });
    get _frozenExpandedRowTemplate(): TemplateRef<any> | undefined { return this._frozenExpandedRowTemplateSignal(); }
    frozenExpandedRowTemplate: Nullable<TemplateRef<any>>;

    readonly _frozenHeaderTemplate = contentChild.required<TemplateRef<any>>('frozenheader', { descendants: false });
    frozenHeaderTemplate: Nullable<TemplateRef<any>>;

    readonly _frozenBodyTemplateSignal = contentChild<TemplateRef<any>>('frozenbody', { descendants: false });
    get _frozenBodyTemplate(): TemplateRef<any> | undefined { return this._frozenBodyTemplateSignal(); }
    frozenBodyTemplate: Nullable<TemplateRef<any>>;

    readonly _frozenFooterTemplate = contentChild.required<TemplateRef<any>>('frozenfooter', { descendants: false });
    frozenFooterTemplate: Nullable<TemplateRef<any>>;

    readonly _frozenColGroupTemplate = contentChild.required<TemplateRef<any>>('frozencolgroup', { descendants: false });
    frozenColGroupTemplate: Nullable<TemplateRef<any>>;

    readonly _emptyMessageTemplate = contentChild.required<TemplateRef<any>>('emptymessage', { descendants: false });
    emptyMessageTemplate: Nullable<TemplateRef<any>>;

    readonly _paginatorLeftTemplate = contentChild.required<TemplateRef<any>>('paginatorleft', { descendants: false });
    paginatorLeftTemplate: Nullable<TemplateRef<any>>;

    readonly _paginatorRightTemplate = contentChild.required<TemplateRef<any>>('paginatorright', { descendants: false });
    paginatorRightTemplate: Nullable<TemplateRef<any>>;

    readonly _paginatorDropdownItemTemplate = contentChild.required<TemplateRef<any>>('paginatordropdownitem', { descendants: false });
    paginatorDropdownItemTemplate: Nullable<TemplateRef<any>>;

    readonly _loadingIconTemplateSignal = contentChild<TemplateRef<any>>('loadingicon', { descendants: false });
    get _loadingIconTemplate(): TemplateRef<any> | undefined { return this._loadingIconTemplateSignal(); }
    loadingIconTemplate: Nullable<TemplateRef<any>>;

    readonly _reorderIndicatorUpIconTemplate = contentChild.required<TemplateRef<any>>('reorderindicatorupicon', { descendants: false });
    reorderIndicatorUpIconTemplate: Nullable<TemplateRef<any>>;

    readonly _reorderIndicatorDownIconTemplate = contentChild.required<TemplateRef<any>>('reorderindicatordownicon', { descendants: false });
    reorderIndicatorDownIconTemplate: Nullable<TemplateRef<any>>;

    readonly _sortIconTemplateSignal = contentChild<TemplateRef<any>>('sorticon', { descendants: false });
    get _sortIconTemplate(): TemplateRef<any> | undefined { return this._sortIconTemplateSignal(); }
    sortIconTemplate: Nullable<TemplateRef<any>>;

    readonly _checkboxIconTemplate = contentChild.required<TemplateRef<any>>('checkboxicon', { descendants: false });
    checkboxIconTemplate: Nullable<TemplateRef<any>>;

    readonly _headerCheckboxIconTemplate = contentChild.required<TemplateRef<any>>('headercheckboxicon', { descendants: false });
    headerCheckboxIconTemplate: Nullable<TemplateRef<any>>;

    readonly _paginatorDropdownIconTemplateSignal = contentChild<TemplateRef<any>>('paginatordropdownicon', { descendants: false });
    get _paginatorDropdownIconTemplate(): TemplateRef<any> | undefined { return this._paginatorDropdownIconTemplateSignal(); }
    paginatorDropdownIconTemplate: Nullable<TemplateRef<any>>;

    readonly _paginatorFirstPageLinkIconTemplateSignal = contentChild<TemplateRef<any>>('paginatorfirstpagelinkicon', { descendants: false });
    get _paginatorFirstPageLinkIconTemplate(): TemplateRef<any> | undefined { return this._paginatorFirstPageLinkIconTemplateSignal(); }
    paginatorFirstPageLinkIconTemplate: Nullable<TemplateRef<any>>;

    readonly _paginatorLastPageLinkIconTemplateSignal = contentChild<TemplateRef<any>>('paginatorlastpagelinkicon', { descendants: false });
    get _paginatorLastPageLinkIconTemplate(): TemplateRef<any> | undefined { return this._paginatorLastPageLinkIconTemplateSignal(); }
    paginatorLastPageLinkIconTemplate: Nullable<TemplateRef<any>>;

    readonly _paginatorPreviousPageLinkIconTemplateSignal = contentChild<TemplateRef<any>>('paginatorpreviouspagelinkicon', { descendants: false });
    get _paginatorPreviousPageLinkIconTemplate(): TemplateRef<any> | undefined { return this._paginatorPreviousPageLinkIconTemplateSignal(); }
    paginatorPreviousPageLinkIconTemplate: Nullable<TemplateRef<any>>;

    readonly _paginatorNextPageLinkIconTemplateSignal = contentChild<TemplateRef<any>>('paginatornextpagelinkicon', { descendants: false });
    get _paginatorNextPageLinkIconTemplate(): TemplateRef<any> | undefined { return this._paginatorNextPageLinkIconTemplateSignal(); }
    paginatorNextPageLinkIconTemplate: Nullable<TemplateRef<any>>;

    selectionKeys: any = {};

    lastResizerHelperX: number | undefined;

    reorderIconWidth: number | undefined;

    reorderIconHeight: number | undefined;

    draggedColumn: any;

    draggedRowIndex: number | undefined | null;

    droppedRowIndex: number | undefined | null;

    rowDragging: boolean | undefined | null;

    dropPosition: number | undefined | null;

    editingCell: Element | undefined | null;

    editingCellData: any;

    editingCellField: any;

    editingCellRowIndex: number | undefined | null;

    selfClick: boolean | undefined | null;

    documentEditListener: any;

    preventSelectionSetterPropagation: boolean | undefined;

    anchorRowIndex: number | undefined | null;

    rangeRowIndex: number | undefined;

    filterTimeout: any;

    initialized: boolean | undefined | null;

    rowTouched: boolean | undefined;

    restoringSort: boolean | undefined;

    restoringFilter: boolean | undefined;

    stateRestored: boolean | undefined;

    columnOrderStateRestored: boolean | undefined;

    columnWidthsState: string | undefined;

    tableWidthState: string | undefined;

    overlaySubscription: Subscription | undefined;

    resizeColumnElement: HTMLElement;

    columnResizing: boolean = false;

    rowGroupHeaderStyleObject: any = {};

    id: string = UniqueComponentId();

    styleElement: any;

    responsiveStyleElement: any;

    overlayService = inject(OverlayService);

    filterService = inject(FilterService);

    tableService = inject(TableService);

    zone = inject(NgZone);

    _componentStyle = inject(TableStyle);

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    onInit() {
        if (this.lazy() && this.lazyLoadOnInit()) {
            if (!this.virtualScroll()) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            }

            if (this.restoringFilter) {
                this.restoringFilter = false;
            }
        }

        if (this.responsiveLayout() === 'stack') {
            this.createResponsiveStyle();
        }

        this.initialized = true;
    }

    onAfterContentInit() {
        this._templates().forEach((item) => {
            switch (item.getType()) {
                case 'caption':
                    this.captionTemplate = item.template;
                    break;

                case 'header':
                    this.headerTemplate = item.template;
                    break;

                case 'headergrouped':
                    this.headerGroupedTemplate = item.template;
                    break;

                case 'body':
                    this.bodyTemplate = item.template;
                    break;

                case 'loadingbody':
                    this.loadingBodyTemplate = item.template;
                    break;

                case 'footer':
                    this.footerTemplate = item.template;
                    break;

                case 'footergrouped':
                    this.footerGroupedTemplate = item.template;
                    break;

                case 'summary':
                    this.summaryTemplate = item.template;
                    break;

                case 'colgroup':
                    this.colGroupTemplate = item.template;
                    break;

                case 'expandedrow':
                    this.expandedRowTemplate = item.template;
                    break;

                case 'groupheader':
                    this.groupHeaderTemplate = item.template;
                    break;

                case 'groupfooter':
                    this.groupFooterTemplate = item.template;
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

                case 'frozenexpandedrow':
                    this.frozenExpandedRowTemplate = item.template;
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

                case 'paginatordropdownicon':
                    this.paginatorDropdownIconTemplate = item.template;
                    break;

                case 'paginatordropdownitem':
                    this.paginatorDropdownItemTemplate = item.template;
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
            }
        });
    }

    onAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.isStateful() && this.resizableColumns()) {
                this.restoreColumnWidths();
            }
        }
    }

    get processedData() {
        return this.filteredValue || this.value() || [];
    }

    private _initialColWidths: number[];

    dataToRender(data: any) {
        const _data = data || this.processedData;

        if (_data && this.paginator()) {
            const first = this.lazy() ? 0 : this.first();
            return _data.slice(first, <number>first + <number>this.rows());
        }

        return _data;
    }

    updateSelectionKeys() {
        const dataKey = this.dataKey();
        if (dataKey && this.selection()) {
            this.selectionKeys = {};
            if (Array.isArray(this.selection())) {
                for (let data of this.selection()) {
                    this.selectionKeys[String(ObjectUtils.resolveFieldData(data, dataKey))] = 1;
                }
            } else {
                this.selectionKeys[String(ObjectUtils.resolveFieldData(this.selection(), dataKey))] = 1;
            }
        }
    }

    onPageChange(event: TablePageEvent) {
        this.first.set(event.first);
        this.rows.set(event.rows);

        this.onPage.emit({
            first: this.first() ?? 0,
            rows: <number>this.rows()
        });

        if (this.lazy()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        }

        this.tableService.onValueChange(this.value());

        if (this.isStateful()) {
            this.saveState();
        }

        this.anchorRowIndex = null;

        if (this.scrollable()) {
            this.resetScrollTop();
        }
    }

    sort(event: any) {
        let originalEvent = event.originalEvent;

        const sortMode = this.sortMode();
        const resetPageOnSort = this.resetPageOnSort();
        if (sortMode === 'single') {
            this.sortOrder.set(this.sortField() === event.field ? this.sortOrder() * -1 : this.defaultSortOrder());
            this.sortField.set(event.field);

            if (resetPageOnSort) {
                this.first.set(0);

                if (this.scrollable()) {
                    this.resetScrollTop();
                }
            }

            this.sortSingle();
        }
        if (sortMode === 'multiple') {
            let metaKey = (<KeyboardEvent>originalEvent).metaKey || (<KeyboardEvent>originalEvent).ctrlKey;
            let sortMeta = this.getSortMeta(<string>event.field);

            if (sortMeta) {
                if (!metaKey) {
                    this.multiSortMeta.set([
                        {
                            field: <string>event.field,
                            order: sortMeta.order * -1
                        }
                    ]);

                    if (resetPageOnSort) {
                        this.first.set(0);

                        if (this.scrollable()) {
                            this.resetScrollTop();
                        }
                    }
                } else {
                    sortMeta.order = sortMeta.order * -1;
                }
            } else {
                if (!metaKey || !this.multiSortMeta()) {
                    this.multiSortMeta.set([]);

                    if (resetPageOnSort) {
                        this.first.set(0);
                    }
                }
                const multiSortMeta = this.multiSortMeta() || [];
                multiSortMeta.push({
                    field: <string>event.field,
                    order: this.defaultSortOrder()
                });
                this.multiSortMeta.set(multiSortMeta);
            }

            this.sortMultiple();
        }

        if (this.isStateful()) {
            this.saveState();
        }

        this.anchorRowIndex = null;
    }

    sortSingle() {
        let field = this.sortField() || this.groupRowsBy();
        let order = this.sortField() ? this.sortOrder() : this.groupRowsByOrder();
        const groupRowsBy = this.groupRowsBy();
        if (groupRowsBy && this.sortField() && groupRowsBy !== this.sortField()) {
            this.multiSortMeta.set([this.getGroupRowsMeta(), { field: this.sortField(), order: this.sortOrder() }]);
            this.sortMultiple();
            return;
        }

        if (field && order) {
            if (this.restoringSort) {
                this.restoringSort = false;
            }

            if (this.lazy()) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            } else if (this.value()) {
                if (this.customSort()) {
                    this.sortFunction.emit({
                        data: this.value(),
                        mode: this.sortMode(),
                        field: field,
                        order: order
                    });
                } else {
                    this.value().sort((data1, data2) => {
                        let value1 = ObjectUtils.resolveFieldData(data1, field);
                        let value2 = ObjectUtils.resolveFieldData(data2, field);
                        let result: any = null;

                        if (value1 == null && value2 != null) result = -1;
                        else if (value1 != null && value2 == null) result = 1;
                        else if (value1 == null && value2 == null) result = 0;
                        else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
                        else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

                        return order * (result || 0);
                    });

                    this.value.set([...this.value()]);
                }

                if (this.hasFilter()) {
                    this._filter();
                }
            }

            let sortMeta: SortMeta = {
                field: field,
                order: order
            };

            this.onSort.emit(sortMeta);
            this.tableService.onSort(sortMeta);
        }
    }

    sortMultiple() {
        const groupRowsBy = this.groupRowsBy();
        if (groupRowsBy) {
            if (!this.multiSortMeta()) this.multiSortMeta.set([this.getGroupRowsMeta()]);
            else if ((<SortMeta[]>this.multiSortMeta())[0].field !== groupRowsBy) this.multiSortMeta.set([this.getGroupRowsMeta(), ...(<SortMeta[]>this.multiSortMeta())]);
        }

        if (this.multiSortMeta()) {
            if (this.lazy()) {
                this.onLazyLoad.emit(this.createLazyLoadMetadata());
            } else if (this.value()) {
                if (this.customSort()) {
                    this.sortFunction.emit({
                        data: this.value(),
                        mode: this.sortMode(),
                        multiSortMeta: this.multiSortMeta()
                    });
                } else {
                    this.value().sort((data1, data2) => {
                        return this.multisortField(data1, data2, <SortMeta[]>this.multiSortMeta(), 0);
                    });

                    this.value.set([...this.value()]);
                }

                if (this.hasFilter()) {
                    this._filter();
                }
            }

            this.onSort.emit({
                multisortmeta: <SortMeta[]>this.multiSortMeta()
            });
            this.tableService.onSort(this.multiSortMeta() ?? null);
        }
    }

    multisortField(data1: any, data2: any, multiSortMeta: SortMeta[], index: number): any {
        const value1 = ObjectUtils.resolveFieldData(data1, multiSortMeta[index].field);
        const value2 = ObjectUtils.resolveFieldData(data2, multiSortMeta[index].field);
        if (ObjectUtils.compare(value1, value2, this.filterLocale()) === 0) {
            return multiSortMeta.length - 1 > index ? this.multisortField(data1, data2, multiSortMeta, index + 1) : 0;
        }
        return this.compareValuesOnSort(value1, value2, multiSortMeta[index].order);
    }

    compareValuesOnSort(value1: any, value2: any, order: any) {
        return ObjectUtils.sort(value1, value2, order, this.filterLocale(), this.sortOrder());
    }

    getSortMeta(field: string) {
        if (this.multiSortMeta() && this.multiSortMeta()!.length) {
            for (let i = 0; i < this.multiSortMeta()!.length; i++) {
                if (this.multiSortMeta()![i].field === field) {
                    return this.multiSortMeta()![i];
                }
            }
        }

        return null;
    }

    isSorted(field: string) {
        const sortMode = this.sortMode();
        if (sortMode === 'single') {
            return this.sortField() && this.sortField() === field;
        } else if (sortMode === 'multiple') {
            let sorted = false;
            if (this.multiSortMeta()) {
                for (let i = 0; i < this.multiSortMeta()!.length; i++) {
                    if (this.multiSortMeta()![i].field == field) {
                        sorted = true;
                        break;
                    }
                }
            }
            return sorted;
        }
    }

    handleRowClick(event: any) {
        let target = <HTMLElement>event.originalEvent.target;
        let targetNode = target.nodeName;
        let parentNode = target.parentElement && target.parentElement.nodeName;
        if (targetNode == 'INPUT' || targetNode == 'BUTTON' || targetNode == 'A' || parentNode == 'INPUT' || parentNode == 'BUTTON' || parentNode == 'A' || isClickable(event.originalEvent.target)) {
            return;
        }

        const selectionMode = this.selectionMode();
        if (selectionMode) {
            let rowData = event.rowData;
            let rowIndex = event.rowIndex;

            this.preventSelectionSetterPropagation = true;
            if (this.isMultipleSelectionMode() && event.originalEvent.shiftKey && this.anchorRowIndex != null) {
                DomHandler.clearSelection();
                if (this.rangeRowIndex != null) {
                    this.clearSelectionRange(event.originalEvent);
                }

                this.rangeRowIndex = rowIndex;
                this.selectRange(event.originalEvent, rowIndex);
            } else {
                let selected = this.isSelected(rowData);

                if (!selected && !this.isRowSelectable(rowData, rowIndex)) {
                    return;
                }

                let metaSelection = this.rowTouched ? false : this.metaKeySelection();
                const dataKey = this.dataKey();
                let dataKeyValue = dataKey ? String(ObjectUtils.resolveFieldData(rowData, dataKey)) : null;
                this.anchorRowIndex = rowIndex;
                this.rangeRowIndex = rowIndex;

                if (metaSelection) {
                    let metaKey = event.originalEvent.metaKey || event.originalEvent.ctrlKey;

                    if (selected && metaKey) {
                        if (this.isSingleSelectionMode()) {
                            this.selection.set(null);
                            this.selectionKeys = {};
                        } else {
                            let selectionIndex = this.findIndexInSelection(rowData);
                            this.selection.set(this.selection().filter((val: any, i: number) => i != selectionIndex));
                            if (dataKeyValue) {
                                delete this.selectionKeys[dataKeyValue];
                            }
                        }

                        this.onRowUnselect.emit({
                            originalEvent: event.originalEvent,
                            data: rowData,
                            type: 'row'
                        });
                    } else {
                        if (this.isSingleSelectionMode()) {
                            this.selection.set(rowData);
                            if (dataKeyValue) {
                                this.selectionKeys = {};
                                this.selectionKeys[dataKeyValue] = 1;
                            }
                        } else if (this.isMultipleSelectionMode()) {
                            if (metaKey) {
                                this.selection.set(this.selection() || []);
                            } else {
                                this.selection.set([]);
                                this.selectionKeys = {};
                            }

                            this.selection.set([...this.selection(), rowData]);
                            if (dataKeyValue) {
                                this.selectionKeys[dataKeyValue] = 1;
                            }
                        }

                        this.onRowSelect.emit({
                            originalEvent: event.originalEvent,
                            data: rowData,
                            type: 'row',
                            index: rowIndex
                        });
                    }
                } else {
                    if (selectionMode === 'single') {
                        if (selected) {
                            this.selection.set(null);
                            this.selectionKeys = {};
                            this.onRowUnselect.emit({
                                originalEvent: event.originalEvent,
                                data: rowData,
                                type: 'row',
                                index: rowIndex
                            });
                        } else {
                            this.selection.set(rowData);
                            this.onRowSelect.emit({
                                originalEvent: event.originalEvent,
                                data: rowData,
                                type: 'row',
                                index: rowIndex
                            });
                            if (dataKeyValue) {
                                this.selectionKeys = {};
                                this.selectionKeys[dataKeyValue] = 1;
                            }
                        }
                    } else if (selectionMode === 'multiple') {
                        if (selected) {
                            let selectionIndex = this.findIndexInSelection(rowData);
                            this.selection.set(this.selection().filter((val: any, i: number) => i != selectionIndex));
                            this.onRowUnselect.emit({
                                originalEvent: event.originalEvent,
                                data: rowData,
                                type: 'row',
                                index: rowIndex
                            });
                            if (dataKeyValue) {
                                delete this.selectionKeys[dataKeyValue];
                            }
                        } else {
                            this.selection.set(this.selection() ? [...this.selection(), rowData] : [rowData]);
                            this.onRowSelect.emit({
                                originalEvent: event.originalEvent,
                                data: rowData,
                                type: 'row',
                                index: rowIndex
                            });
                            if (dataKeyValue) {
                                this.selectionKeys[dataKeyValue] = 1;
                            }
                        }
                    }
                }
            }

            this.tableService.onSelectionChange();

            if (this.isStateful()) {
                this.saveState();
            }
        }

        this.rowTouched = false;
    }

    handleRowTouchEnd(event: Event) {
        this.rowTouched = true;
    }

    handleRowRightClick(event: any) {
        if (this.contextMenu()) {
            const rowData = event.rowData;
            const rowIndex = event.rowIndex;

            const showContextMenu = () => {
                this.contextMenu().show(event.originalEvent);
                this.contextMenu().hideCallback = () => {
                    this.contextMenuSelection.set(null);
                    this.tableService.onContextMenu(null);
                };
            };

            const contextMenuSelectionMode = this.contextMenuSelectionMode();
            if (contextMenuSelectionMode === 'separate') {
                this.contextMenuSelection.set(rowData);
                this.tableService.onContextMenu(rowData);
                showContextMenu();
                this.onContextMenuSelect.emit({
                    originalEvent: event.originalEvent,
                    data: rowData,
                    index: event.rowIndex
                });
            } else if (contextMenuSelectionMode === 'joint') {
                this.preventSelectionSetterPropagation = true;
                let selected = this.isSelected(rowData);
                const dataKey = this.dataKey();
                let dataKeyValue = dataKey ? String(ObjectUtils.resolveFieldData(rowData, dataKey)) : null;

                if (!selected) {
                    if (!this.isRowSelectable(rowData, rowIndex)) {
                        return;
                    }

                    if (this.isSingleSelectionMode()) {
                        this.selection.set(rowData);

                        if (dataKeyValue) {
                            this.selectionKeys = {};
                            this.selectionKeys[dataKeyValue] = 1;
                        }
                    } else if (this.isMultipleSelectionMode()) {
                        this.selection.set(this.selection() ? [...this.selection(), rowData] : [rowData]);

                        if (dataKeyValue) {
                            this.selectionKeys[dataKeyValue] = 1;
                        }
                    }
                }

                // Also update contextMenuSelection in joint mode
                this.contextMenuSelection.set(rowData);
                this.tableService.onContextMenu(rowData);

                this.tableService.onSelectionChange();
                showContextMenu();
                this.onContextMenuSelect.emit({
                    originalEvent: event,
                    data: rowData,
                    index: event.rowIndex
                });
            }
        }
    }

    selectRange(event: MouseEvent | KeyboardEvent, rowIndex: number, isMetaKeySelection?: boolean | undefined) {
        let rangeStart, rangeEnd;

        if (<number>this.anchorRowIndex > rowIndex) {
            rangeStart = rowIndex;
            rangeEnd = this.anchorRowIndex;
        } else if (<number>this.anchorRowIndex < rowIndex) {
            rangeStart = this.anchorRowIndex;
            rangeEnd = rowIndex;
        } else {
            rangeStart = rowIndex;
            rangeEnd = rowIndex;
        }

        if (this.lazy() && this.paginator()) {
            (rangeStart as number) -= <number>this.first();
            (rangeEnd as number) -= <number>this.first();
        }

        let rangeRowsData: RowData[] = [];
        let newSelection = this.selection() ? [...this.selection()] : [];
        for (let i = <number>rangeStart; i <= <number>rangeEnd; i++) {
            let rangeRowData = this.filteredValue ? this.filteredValue[i] : this.value()[i];
            if (!this.isSelected(rangeRowData) && !isMetaKeySelection) {
                if (!this.isRowSelectable(rangeRowData, rowIndex)) {
                    continue;
                }

                rangeRowsData.push(rangeRowData);
                newSelection = [...newSelection, rangeRowData];
                const dataKey = this.dataKey();
                let dataKeyValue = dataKey ? String(ObjectUtils.resolveFieldData(rangeRowData, dataKey)) : null;
                if (dataKeyValue) {
                    this.selectionKeys[dataKeyValue] = 1;
                }
            }
        }
        this.selection.set(newSelection);
        this.onRowSelect.emit({
            originalEvent: event,
            data: rangeRowsData,
            type: 'row'
        });
    }

    clearSelectionRange(event: MouseEvent | KeyboardEvent) {
        let rangeStart, rangeEnd;
        let rangeRowIndex = <number>this.rangeRowIndex;
        let anchorRowIndex = <number>this.anchorRowIndex;

        if (rangeRowIndex > anchorRowIndex) {
            rangeStart = this.anchorRowIndex;
            rangeEnd = this.rangeRowIndex;
        } else if (rangeRowIndex < anchorRowIndex) {
            rangeStart = this.rangeRowIndex;
            rangeEnd = this.anchorRowIndex;
        } else {
            rangeStart = this.rangeRowIndex;
            rangeEnd = this.rangeRowIndex;
        }

        let newSelection = this.selection() ? [...this.selection()] : [];
        for (let i = <number>rangeStart; i <= <number>rangeEnd; i++) {
            let rangeRowData = this.value()[i];
            let selectionIndex = this.findIndexInSelection(rangeRowData);
            newSelection = newSelection.filter((val: any, j: number) => j != selectionIndex);
            const dataKey = this.dataKey();
            let dataKeyValue = dataKey ? String(ObjectUtils.resolveFieldData(rangeRowData, dataKey)) : null;
            if (dataKeyValue) {
                delete this.selectionKeys[dataKeyValue];
            }
            this.onRowUnselect.emit({
                originalEvent: event,
                data: rangeRowData,
                type: 'row'
            });
        }
        this.selection.set(newSelection);
    }

    isSelected(rowData: any) {
        if (rowData && this.selection()) {
            const dataKey = this.dataKey();
            if (dataKey) {
                return this.selectionKeys[ObjectUtils.resolveFieldData(rowData, dataKey)] !== undefined;
            } else {
                if (Array.isArray(this.selection())) return this.findIndexInSelection(rowData) > -1;
                else return this.equals(rowData, this.selection());
            }
        }

        return false;
    }

    findIndexInSelection(rowData: any) {
        let index: number = -1;
        if (this.selection() && this.selection().length) {
            for (let i = 0; i < this.selection().length; i++) {
                if (this.equals(rowData, this.selection()[i])) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    isRowSelectable(data: any, index: number) {
        const rowSelectable = this.rowSelectable();
        if (rowSelectable && !rowSelectable({ data, index })) {
            return false;
        }

        return true;
    }

    toggleRowWithRadio(event: any, rowData: any) {
        this.preventSelectionSetterPropagation = true;

        if (this.selection() != rowData) {
            if (!this.isRowSelectable(rowData, event.rowIndex)) {
                return;
            }

            this.selection.set(rowData);
            this.onRowSelect.emit({
                originalEvent: event.originalEvent,
                index: event.rowIndex,
                data: rowData,
                type: 'radiobutton'
            });

            const dataKey = this.dataKey();
            if (dataKey) {
                this.selectionKeys = {};
                this.selectionKeys[String(ObjectUtils.resolveFieldData(rowData, dataKey))] = 1;
            }
        } else {
            this.selection.set(null);
            this.onRowUnselect.emit({
                originalEvent: event.originalEvent,
                index: event.rowIndex,
                data: rowData,
                type: 'radiobutton'
            });
        }

        this.tableService.onSelectionChange();

        if (this.isStateful()) {
            this.saveState();
        }
    }

    toggleRowWithCheckbox(event: { originalEvent: Event; rowIndex: number }, rowData: any) {
        this.selection.set(this.selection() || []);
        let selected = this.isSelected(rowData);
        const dataKey = this.dataKey();
        let dataKeyValue = dataKey ? String(ObjectUtils.resolveFieldData(rowData, dataKey)) : null;
        this.preventSelectionSetterPropagation = true;

        if (selected) {
            let selectionIndex = this.findIndexInSelection(rowData);
            this.selection.set(this.selection().filter((val: any, i: number) => i != selectionIndex));
            this.onRowUnselect.emit({
                originalEvent: event.originalEvent,
                index: event.rowIndex,
                data: rowData,
                type: 'checkbox'
            });
            if (dataKeyValue) {
                delete this.selectionKeys[dataKeyValue];
            }
        } else {
            if (!this.isRowSelectable(rowData, event.rowIndex)) {
                return;
            }

            this.selection.set(this.selection() ? [...this.selection(), rowData] : [rowData]);
            this.onRowSelect.emit({
                originalEvent: event.originalEvent,
                index: event.rowIndex,
                data: rowData,
                type: 'checkbox'
            });
            if (dataKeyValue) {
                this.selectionKeys[dataKeyValue] = 1;
            }
        }

        this.tableService.onSelectionChange();

        if (this.isStateful()) {
            this.saveState();
        }
    }

    toggleRowsWithCheckbox({ originalEvent }: CheckboxChangeEvent, check: boolean) {
        if (this.selectAll() !== null) {
            this.selectAll.set(check);
        } else {
            const data = this.selectionPageOnly() ? this.dataToRender(this.processedData) : this.processedData;
            let selection = this.selectionPageOnly() && this.selection() ? this.selection().filter((s: any) => !data.some((d: any) => this.equals(s, d))) : [];

            if (check) {
                selection = this.frozenValue() ? [...selection, ...(<any[]>this.frozenValue()), ...data] : [...selection, ...data];
                selection = this.rowSelectable() ? selection.filter((data: any, index: number) => this.rowSelectable()({ data, index })) : selection;
            }

            this.selection.set(selection);
            this.preventSelectionSetterPropagation = true;
            this.updateSelectionKeys();
            this.tableService.onSelectionChange();
            this.onHeaderCheckboxToggle.emit({
                originalEvent: originalEvent!,
                checked: check
            });

            if (this.isStateful()) {
                this.saveState();
            }
        }
    }

    equals(data1: any, data2: any) {
        return this.compareSelectionBy() === 'equals' ? data1 === data2 : ObjectUtils.equals(data1, data2, this.dataKey());
    }

    /* Legacy Filtering for custom elements */
    filter(value: any, field: string, matchMode: string) {
        if (this.filterTimeout) {
            clearTimeout(this.filterTimeout);
        }
        if (!this.isFilterBlank(value)) {
            this.filters()[field] = { value: value, matchMode: matchMode };
        } else if (this.filters()[field]) {
            delete this.filters()[field];
        }

        this.filterTimeout = setTimeout(() => {
            this._filter();
            this.filterTimeout = null;
        }, this.filterDelay());

        this.anchorRowIndex = null;
    }

    filterGlobal(value: any, matchMode: string) {
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
        if (!this.restoringFilter) {
            this.first.set(0);
        }

        if (this.lazy()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        } else {
            if (!this.value()) {
                return;
            }
            if (!this.hasFilter()) {
                this.filteredValue = null;
                if (this.paginator()) {
                    this.totalRecords.set(this.totalRecords() === 0 && this.value().length ? this.value().length : this.totalRecords());
                }
            } else {
                let globalFilterFieldsArray;
                if (this.filters()['global']) {
                    const globalFilterFields = this.globalFilterFields();
                    if (!this.columns() && !globalFilterFields) throw new Error('Global filtering requires dynamic columns or globalFilterFields to be defined.');
                    else globalFilterFieldsArray = globalFilterFields || this.columns();
                }

                this.filteredValue = [];

                for (let i = 0; i < this.value().length; i++) {
                    let localMatch = true;
                    let globalMatch = false;
                    let localFiltered = false;

                    for (let prop in this.filters()) {
                        if (this.filters().hasOwnProperty(prop) && prop !== 'global') {
                            localFiltered = true;
                            let filterField = prop;
                            let filterMeta = this.filters()[filterField];

                            if (Array.isArray(filterMeta)) {
                                for (let meta of filterMeta) {
                                    localMatch = this.executeLocalFilter(filterField, this.value()[i], meta);

                                    if ((meta.operator === FilterOperator.OR && localMatch) || (meta.operator === FilterOperator.AND && !localMatch)) {
                                        break;
                                    }
                                }
                            } else {
                                localMatch = this.executeLocalFilter(filterField, this.value()[i], <any>filterMeta);
                            }

                            if (!localMatch) {
                                break;
                            }
                        }
                    }

                    if (this.filters()['global'] && !globalMatch && globalFilterFieldsArray) {
                        for (let j = 0; j < globalFilterFieldsArray.length; j++) {
                            let globalFilterField = globalFilterFieldsArray[j].field || globalFilterFieldsArray[j];
                            globalMatch = (<any>this.filterService).filters[(<any>this.filters()['global']).matchMode](ObjectUtils.resolveFieldData(this.value()[i], globalFilterField), (<FilterMetadata>this.filters()['global']).value, this.filterLocale());

                            if (globalMatch) {
                                break;
                            }
                        }
                    }

                    let matches: boolean;
                    if (this.filters()['global']) {
                        matches = localFiltered ? localFiltered && localMatch && globalMatch : globalMatch;
                    } else {
                        matches = localFiltered && localMatch;
                    }

                    if (matches) {
                        this.filteredValue.push(this.value()[i]);
                    }
                }

                if (this.filteredValue.length === this.value().length) {
                    this.filteredValue = null;
                }

                if (this.paginator()) {
                    this.totalRecords.set(this.filteredValue ? this.filteredValue.length : this.totalRecords() === 0 && this.value().length ? this.value().length : this.totalRecords());
                }
            }
        }

        this.onFilter.emit({
            filters: <{ [s: string]: FilterMetadata | undefined }>this.filters(),
            filteredValue: this.filteredValue || this.value()
        });

        this.tableService.onValueChange(this.value());

        if (this.isStateful() && !this.restoringFilter) {
            this.saveState();
        }

        if (this.restoringFilter) {
            this.restoringFilter = false;
        }

        this.cd.markForCheck();

        if (this.scrollable()) {
            this.resetScrollTop();
        }
    }

    executeLocalFilter(field: string, rowData: any, filterMeta: FilterMetadata): boolean {
        let filterValue = filterMeta.value;
        let filterMatchMode = filterMeta.matchMode || FilterMatchMode.STARTS_WITH;
        let dataFieldValue = ObjectUtils.resolveFieldData(rowData, field);
        let filterConstraint = (<any>this.filterService).filters[filterMatchMode];

        return filterConstraint(dataFieldValue, filterValue, this.filterLocale());
    }

    hasFilter() {
        let empty = true;
        for (let prop in this.filters()) {
            if (this.filters().hasOwnProperty(prop)) {
                empty = false;
                break;
            }
        }

        return !empty;
    }

    createLazyLoadMetadata(): any {
        return {
            first: this.first() ?? 0,
            rows: this.rows(),
            sortField: this.sortField(),
            sortOrder: this.sortOrder(),
            filters: this.filters(),
            globalFilter: this.filters() && this.filters()['global'] ? (<FilterMetadata>this.filters()['global']).value : null,
            multiSortMeta: this.multiSortMeta(),
            forceUpdate: () => this.cd.detectChanges()
        };
    }

    public clear() {
        this.sortField.set(null);
        this.sortOrder.set(this.defaultSortOrder());
        this.multiSortMeta.set(null);
        this.tableService.onSort(null);

        this.clearFilterValues();

        this.filteredValue = null;

        this.first.set(0);

        if (this.lazy()) {
            this.onLazyLoad.emit(this.createLazyLoadMetadata());
        } else {
            this.totalRecords.set(this.totalRecords() === 0 && this.value().length ? this.value().length : this.totalRecords());
        }
    }

    clearFilterValues() {
        for (const [, filterMetadata] of Object.entries(this.filters())) {
            if (Array.isArray(filterMetadata)) {
                for (let filter of filterMetadata) {
                    filter.value = null;
                }
            } else if (filterMetadata) {
                filterMetadata.value = null;
            }
        }
    }

    reset() {
        this.clear();
    }

    getExportHeader(column: any) {
        return column[<string>this.exportHeader()] || column.header || column.field;
    }
    /**
     * Data export method.
     * @param {ExportCSVOptions} object - Export options.
     * @group Method
     */
    public exportCSV(options?: ExportCSVOptions) {
        let data;
        let csv = '';
        let columns = this.columns();

        if (options && options.selectionOnly) {
            data = this.selection() || [];
        } else if (options && options.allValues) {
            data = this.value() || [];
        } else {
            data = this.filteredValue || this.value();

            if (this.frozenValue()) {
                data = data ? [...(<any[]>this.frozenValue()), ...data] : this.frozenValue();
            }
        }

        const exportableColumns: any[] = (<any[]>columns).filter((column) => column.exportable !== false && column.field);

        //headers
        csv += exportableColumns.map((column) => '"' + this.getExportHeader(column) + '"').join(this.csvSeparator());

        //body
        const body = data
            .map((record: any) =>
                exportableColumns
                    .map((column) => {
                        let cellData = ObjectUtils.resolveFieldData(record, column.field);

                        if (cellData != null) {
                            const exportFunction = this.exportFunction();
                            if (exportFunction) {
                                cellData = exportFunction({
                                    data: cellData,
                                    field: column.field
                                });
                            } else cellData = String(cellData).replace(/"/g, '""');
                        } else cellData = '';

                        return '"' + cellData + '"';
                    })
                    .join(this.csvSeparator())
            )
            .join('\n');

        if (body.length) {
            csv += '\n' + body;
        }

        let blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], {
            type: 'text/csv;charset=utf-8;'
        });

        let link = this.renderer.createElement('a');
        link.style.display = 'none';
        this.renderer.appendChild(this.document.body, link);
        if (link.download !== undefined) {
            link.setAttribute('href', URL.createObjectURL(blob));
            link.setAttribute('download', this.exportFilename() + '.csv');
            link.click();
        } else {
            csv = 'data:text/csv;charset=utf-8,' + csv;
            this.document.defaultView?.open(encodeURI(csv));
        }
        this.renderer.removeChild(this.document.body, link);
    }

    onLazyItemLoad(event: LazyLoadMeta) {
        this.onLazyLoad.emit({
            ...this.createLazyLoadMetadata(),
            ...event,
            rows: <number>event.last - <number>event.first
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
        const scrollable = this.scroller();
        scrollable && scrollable.scrollToIndex(index);
    }
    /**
     * Scrolls to given index.
     * @param {ScrollToOptions} options - scroll options.
     * @group Method
     */
    public scrollTo(options: any) {
        const wrapperViewChild = this.wrapperViewChild();
        if (this.virtualScroll()) {
            this.scroller()?.scrollTo(options);
        } else if (wrapperViewChild && wrapperViewChild.nativeElement) {
            if (wrapperViewChild.nativeElement.scrollTo) {
                wrapperViewChild.nativeElement.scrollTo(options);
            } else {
                wrapperViewChild.nativeElement.scrollLeft = options.left;
                wrapperViewChild.nativeElement.scrollTop = options.top;
            }
        }
    }

    updateEditingCell(cell: any, data: any, field: string, index: number) {
        this.editingCell = cell;
        this.editingCellData = data;
        this.editingCellField = field;
        this.editingCellRowIndex = index;
        this.bindDocumentEditListener();
    }

    isEditingCellValid() {
        return this.editingCell && DomHandler.find(this.editingCell, '.ng-invalid.ng-dirty').length === 0;
    }

    bindDocumentEditListener() {
        if (!this.documentEditListener) {
            this.documentEditListener = this.renderer.listen(this.document, 'click', (event) => {
                if (this.editingCell && !this.selfClick && this.isEditingCellValid()) {
                    !this.$unstyled() && DomHandler.removeClass(this.editingCell, 'p-cell-editing');
                    setAttribute(this.editingCell as HTMLElement, 'data-p-cell-editing', 'false');
                    this.editingCell = null;
                    this.onEditComplete.emit({
                        field: this.editingCellField,
                        data: this.editingCellData,
                        originalEvent: event,
                        index: <number>this.editingCellRowIndex
                    });
                    this.editingCellField = null;
                    this.editingCellData = null;
                    this.editingCellRowIndex = null;
                    this.unbindDocumentEditListener();
                    this.cd.markForCheck();

                    if (this.overlaySubscription) {
                        this.overlaySubscription.unsubscribe();
                    }
                }

                this.selfClick = false;
            });
        }
    }

    unbindDocumentEditListener() {
        if (this.documentEditListener) {
            this.documentEditListener();
            this.documentEditListener = null;
        }
    }

    initRowEdit(rowData: any) {
        let dataKeyValue = String(ObjectUtils.resolveFieldData(rowData, this.dataKey()));
        this.editingRowKeys()[dataKeyValue] = true;
    }

    saveRowEdit(rowData: any, rowElement: HTMLTableRowElement) {
        if (DomHandler.find(rowElement, '.ng-invalid.ng-dirty').length === 0) {
            let dataKeyValue = String(ObjectUtils.resolveFieldData(rowData, this.dataKey()));
            delete this.editingRowKeys()[dataKeyValue];
        }
    }

    cancelRowEdit(rowData: any) {
        let dataKeyValue = String(ObjectUtils.resolveFieldData(rowData, this.dataKey()));
        delete this.editingRowKeys()[dataKeyValue];
    }

    toggleRow(rowData: any, event?: Event) {
        const groupRowsBy = this.groupRowsBy();
        const dataKey = this.dataKey();
        if (!dataKey && !groupRowsBy) {
            throw new Error('dataKey or groupRowsBy must be defined to use row expansion');
        }

        let dataKeyValue = groupRowsBy ? String(ObjectUtils.resolveFieldData(rowData, groupRowsBy)) : String(ObjectUtils.resolveFieldData(rowData, dataKey));

        if (this.expandedRowKeys()[dataKeyValue] != null) {
            delete this.expandedRowKeys()[dataKeyValue];
            this.onRowCollapse.emit({
                originalEvent: <Event>event,
                data: rowData
            });
        } else {
            if (this.rowExpandMode() === 'single') {
                Object.keys(this.expandedRowKeys()).forEach(k => delete this.expandedRowKeys()[k]);
            }

            this.expandedRowKeys()[dataKeyValue] = true;
            this.onRowExpand.emit({
                originalEvent: <Event>event,
                data: rowData
            });
        }

        if (event) {
            event.preventDefault();
        }

        if (this.isStateful()) {
            this.saveState();
        }
    }

    isRowExpanded(rowData: any): boolean {
        const groupRowsBy = this.groupRowsBy();
        return groupRowsBy ? this.expandedRowKeys()[String(ObjectUtils.resolveFieldData(rowData, groupRowsBy))] === true : this.expandedRowKeys()[String(ObjectUtils.resolveFieldData(rowData, this.dataKey()))] === true;
    }

    isRowEditing(rowData: any): boolean {
        return this.editingRowKeys()[String(ObjectUtils.resolveFieldData(rowData, this.dataKey()))] === true;
    }

    isSingleSelectionMode() {
        return this.selectionMode() === 'single';
    }

    isMultipleSelectionMode() {
        return this.selectionMode() === 'multiple';
    }

    onColumnResizeBegin(event: any) {
        let containerLeft = DomHandler.getOffset(this.el?.nativeElement).left;
        this.resizeColumnElement = event.target.closest('th');
        this.columnResizing = true;
        if (event.type == 'touchstart') {
            this.lastResizerHelperX = event.changedTouches[0].clientX - containerLeft + this.el?.nativeElement.scrollLeft;
        } else {
            this.lastResizerHelperX = event.pageX - containerLeft + this.el?.nativeElement.scrollLeft;
        }
        this.onColumnResize(event);
        event.preventDefault();
    }

    onColumnResize(event: any) {
        let containerLeft = DomHandler.getOffset(this.el?.nativeElement).left;
        !this.$unstyled() && DomHandler.addClass(this.el?.nativeElement, 'p-unselectable-text');
        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.height = this.el?.nativeElement.offsetHeight + 'px';
        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.top = 0 + 'px';
        if (event.type == 'touchmove') {
            (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.left = event.changedTouches[0].clientX - containerLeft + this.el?.nativeElement.scrollLeft + 'px';
        } else {
            (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.left = event.pageX - containerLeft + this.el?.nativeElement.scrollLeft + 'px';
        }
        (<ElementRef>this.resizeHelperViewChild()).nativeElement.style.display = 'block';
    }

    onColumnResizeEnd() {
        const isRTL = getComputedStyle(this.el?.nativeElement ?? document.documentElement).direction === 'rtl';
        const resizeHelperViewChild = this.resizeHelperViewChild();
        const rawDelta = resizeHelperViewChild?.nativeElement.offsetLeft - <number>this.lastResizerHelperX;
        const delta = isRTL ? -rawDelta : rawDelta;
        const columnWidth = this.resizeColumnElement.offsetWidth;
        const newColumnWidth = columnWidth + delta;
        const elementMinWidth = this.resizeColumnElement.style.minWidth.replace(/[^\d.]/g, '');
        const minWidth = elementMinWidth ? parseFloat(elementMinWidth) : 15;

        if (newColumnWidth >= minWidth) {
            const columnResizeMode = this.columnResizeMode();
            if (columnResizeMode === 'fit') {
                const nextColumn = this.resizeColumnElement.nextElementSibling as HTMLElement;
                const nextColumnWidth = nextColumn.offsetWidth - delta;

                if (newColumnWidth > 15 && nextColumnWidth > 15) {
                    this.resizeTableCells(newColumnWidth, nextColumnWidth);
                }
            } else if (columnResizeMode === 'expand') {
                this._initialColWidths = this._totalTableWidth();
                const tableWidth = this.tableViewChild()?.nativeElement.offsetWidth + delta;

                this.setResizeTableWidth(tableWidth + 'px');
                this.resizeTableCells(newColumnWidth, null);
            }

            this.onColResize.emit({
                element: this.resizeColumnElement,
                delta: delta
            });

            if (this.isStateful()) {
                this.saveState();
            }
        }

        (<ElementRef>resizeHelperViewChild).nativeElement.style.display = 'none';
        DomHandler.removeClass(this.el?.nativeElement, 'p-unselectable-text');
    }

    private _totalTableWidth(): number[] {
        let widths = [];
        const tableHead = DomHandler.findSingle(this.el.nativeElement, '[data-pc-section="thead"]');
        let headers = DomHandler.find(tableHead, 'tr > th');
        headers.forEach((header) => (widths as any[]).push(DomHandler.getOuterWidth(header)));

        return widths;
    }

    onColumnDragStart(event: any, columnElement: any) {
        this.reorderIconWidth = DomHandler.getHiddenElementOuterWidth(this.reorderIndicatorUpViewChild()?.nativeElement);
        this.reorderIconHeight = DomHandler.getHiddenElementOuterHeight(this.reorderIndicatorDownViewChild()?.nativeElement);
        this.draggedColumn = columnElement;
        event.dataTransfer.setData('text', 'b'); // For firefox
    }

    onColumnDragEnter(event: any, dropHeader: any) {
        if (this.reorderableColumns() && this.draggedColumn && dropHeader) {
            event.preventDefault();
            let containerOffset = DomHandler.getOffset(this.el?.nativeElement);
            let dropHeaderOffset = DomHandler.getOffset(dropHeader);

            if (this.draggedColumn != dropHeader) {
                let dragIndex = DomHandler.indexWithinGroup(this.draggedColumn, 'preorderablecolumn');
                let dropIndex = DomHandler.indexWithinGroup(dropHeader, 'preorderablecolumn');
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
                event.dataTransfer.dropEffect = 'none';
            }
        }
    }

    onColumnDragLeave(event: Event) {
        if (this.reorderableColumns() && this.draggedColumn) {
            event.preventDefault();
        }
    }

    onColumnDrop(event: Event, dropColumn: any) {
        event.preventDefault();
        if (this.draggedColumn) {
            let dragIndex = DomHandler.indexWithinGroup(this.draggedColumn, 'preorderablecolumn');
            let dropIndex = DomHandler.indexWithinGroup(dropColumn, 'preorderablecolumn');
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
                ObjectUtils.reorderArray(<any[]>this.columns(), dragIndex, dropIndex);

                this.onColReorder.emit({
                    dragIndex: dragIndex,
                    dropIndex: dropIndex,
                    columns: this.columns()
                });

                if (this.isStateful()) {
                    this.zone.runOutsideAngular(() => {
                        setTimeout(() => {
                            this.saveState();
                        });
                    });
                }
            }

            if (this.resizableColumns() && this.resizeColumnElement) {
                let width = this.columnResizeMode() === 'expand' ? this._initialColWidths : this._totalTableWidth();
                ObjectUtils.reorderArray(width, dragIndex + 1, dropIndex + 1);
                this.updateStyleElement(width, dragIndex, 0, 0);
            }

            (<ElementRef>this.reorderIndicatorUpViewChild()).nativeElement.style.display = 'none';
            (<ElementRef>this.reorderIndicatorDownViewChild()).nativeElement.style.display = 'none';
            this.draggedColumn.draggable = false;
            this.draggedColumn = null;
            this.dropPosition = null;
        }
    }

    resizeTableCells(newColumnWidth: number, nextColumnWidth: number | null) {
        let colIndex = DomHandler.index(this.resizeColumnElement);
        let width = this.columnResizeMode() === 'expand' ? this._initialColWidths : this._totalTableWidth();
        this.updateStyleElement(width, colIndex, newColumnWidth, nextColumnWidth);
    }

    updateStyleElement(width: number[], colIndex: number, newColumnWidth: number, nextColumnWidth: number | null) {
        this.destroyStyleElement();
        this.createStyleElement();

        let innerHTML = '';
        width.forEach((width, index) => {
            let colWidth = index === colIndex ? newColumnWidth : nextColumnWidth && index === colIndex + 1 ? nextColumnWidth : width;
            let style = `width: ${colWidth}px !important; max-width: ${colWidth}px !important;`;
            innerHTML += `
                #${this.id}-table > .p-datatable-thead > tr > th:nth-child(${index + 1}),
                #${this.id}-table > .p-datatable-tbody > tr > td:nth-child(${index + 1}),
                #${this.id}-table > .p-datatable-tfoot > tr > td:nth-child(${index + 1}) {
                    ${style}
                }
            `;
        });
        this.renderer.setProperty(this.styleElement, 'innerHTML', innerHTML);
    }

    onRowDragStart(event: any, index: number) {
        this.rowDragging = true;
        this.draggedRowIndex = index;
        event.dataTransfer.setData('text', 'b'); // For firefox
    }

    onRowDragOver(event: MouseEvent, index: number, rowElement: any) {
        if (this.rowDragging && this.draggedRowIndex !== index) {
            let rowY = DomHandler.getOffset(rowElement).top;
            let pageY = event.pageY;
            let rowMidY = rowY + DomHandler.getOuterHeight(rowElement) / 2;
            let prevRowElement = rowElement.previousElementSibling;

            if (pageY < rowMidY) {
                DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-bottom');

                this.droppedRowIndex = index;
                if (prevRowElement && !this.$unstyled()) DomHandler.addClass(prevRowElement, 'p-datatable-dragpoint-bottom');
                else !this.$unstyled() && DomHandler.addClass(rowElement, 'p-datatable-dragpoint-top');
            } else {
                if (prevRowElement && !this.$unstyled()) DomHandler.removeClass(prevRowElement, 'p-datatable-dragpoint-bottom');
                else !this.$unstyled() && DomHandler.addClass(rowElement, 'p-datatable-dragpoint-top');

                this.droppedRowIndex = index + 1;
                !this.$unstyled() && DomHandler.addClass(rowElement, 'p-datatable-dragpoint-bottom');
            }
        }
    }

    onRowDragLeave(event: Event, rowElement: any) {
        let prevRowElement = rowElement.previousElementSibling;
        if (prevRowElement) {
            !this.$unstyled() && DomHandler.removeClass(prevRowElement, 'p-datatable-dragpoint-bottom');
        }

        !this.$unstyled() && DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-bottom');
        !this.$unstyled() && DomHandler.removeClass(rowElement, 'p-datatable-dragpoint-top');
    }

    onRowDragEnd(event: Event) {
        this.rowDragging = false;
        this.draggedRowIndex = null;
        this.droppedRowIndex = null;
    }

    onRowDrop(event: Event, rowElement: any) {
        if (this.droppedRowIndex != null) {
            let dropIndex = <number>this.draggedRowIndex > this.droppedRowIndex ? this.droppedRowIndex : this.droppedRowIndex === 0 ? 0 : this.droppedRowIndex - 1;
            ObjectUtils.reorderArray(this.value(), <number>this.draggedRowIndex, dropIndex);

            if (this.virtualScroll()) {
                // TODO: Check
                this.value.set([...this.value()]);
            }

            this.onRowReorder.emit({
                dragIndex: <number>this.draggedRowIndex,
                dropIndex: dropIndex
            });
        }
        //cleanup
        this.onRowDragLeave(event, rowElement);
        this.onRowDragEnd(event);
    }

    isEmpty() {
        let data = this.filteredValue || this.value();
        return data == null || data.length == 0;
    }

    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }

    getStorage() {
        if (isPlatformBrowser(this.platformId)) {
            const stateStorage = this.stateStorage();
            switch (stateStorage) {
                case 'local':
                    return window.localStorage;

                case 'session':
                    return window.sessionStorage;

                default:
                    throw new Error(stateStorage + ' is not a valid value for the state storage, supported values are "local" and "session".');
            }
        } else {
            throw new Error('Browser storage is not available in the server side.');
        }
    }

    isStateful() {
        return this.stateKey() != null;
    }

    saveState() {
        const storage = this.getStorage();
        let state: TableState = {};

            if (this.paginator()) {
                state.first = <number>this.first();
                state.rows = this.rows();
            }

            if (this.sortField()) {
                state.sortField = <string | undefined>this.sortField();
                state.sortOrder = this.sortOrder();
            }

            if (this.multiSortMeta()) {
                state.multiSortMeta = <SortMeta[] | undefined>this.multiSortMeta();
            }

            if (this.hasFilter()) {
                state.filters = this.filters();
            }

            if (this.resizableColumns()) {
                this.saveColumnWidths(state);
            }

            if (this.reorderableColumns()) {
                this.saveColumnOrder(state);
            }

            if (this.selection()) {
                state.selection = this.selection();
            }

            if (Object.keys(this.expandedRowKeys()).length) {
                state.expandedRowKeys = this.expandedRowKeys();
            }

            storage.setItem(<string>this.stateKey(), JSON.stringify(state));
            this.onStateSave.emit(state);
        }

        clearState() {
            const storage = this.getStorage();

            if (this.stateKey()) {
                storage.removeItem(<string>this.stateKey());
            }
        }

        restoreState() {
            const storage = this.getStorage();
            const stateString = storage.getItem(<string>this.stateKey());
            const dateFormat = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
            const reviver = function (key: any, value: any) {
                if (typeof value === 'string' && dateFormat.test(value)) {
                    return new Date(value);
                }

                return value;
            };

            if (stateString) {
                let state: TableState = JSON.parse(stateString, reviver);

                if (this.paginator()) {
                    if (this.first() !== undefined) {
                        this.first.set(state.first);
                    }

                    if (this.rows() !== undefined) {
                        this.rows.set(state.rows);
                    }
                }

                if (state.sortField) {
                    this.restoringSort = true;
                    this.sortField.set(state.sortField);
                    this.sortOrder.set(<number>state.sortOrder);
                }

                if (state.multiSortMeta) {
                    this.restoringSort = true;
                    this.multiSortMeta.set(state.multiSortMeta);
                }

            if (state.filters) {
                this.restoringFilter = true;
                Object.assign(this.filters(), state.filters);
            }

            if (this.resizableColumns()) {
                this.columnWidthsState = state.columnWidths;
                this.tableWidthState = state.tableWidth;
            }

            // if (this.reorderableColumns) {
            //     this.restoreColumnOrder();
            // }

            if (state.expandedRowKeys) {
                Object.assign(this.expandedRowKeys(), state.expandedRowKeys);
            }

            if (state.selection) {
                Promise.resolve(null).then(() => this.selection.set(state.selection));
            }

            this.stateRestored = true;

            this.onStateRestore.emit(state);
        }
    }

    saveColumnWidths(state: any) {
        let widths: any[] = [];
        let headers: any[] = [];

        const container = this.el?.nativeElement;

        if (container) {
            headers = DomHandler.find(container, '[data-pc-section="thead"] > tr > th');
        }

        headers.forEach((header) => (widths as any[]).push(DomHandler.getOuterWidth(header)));
        state.columnWidths = widths.join(',');

        const tableViewChild = this.tableViewChild();
        if (this.columnResizeMode() === 'expand' && tableViewChild) {
            state.tableWidth = DomHandler.getOuterWidth(tableViewChild.nativeElement);
        }
    }

    setResizeTableWidth(width: string) {
        (<ElementRef>this.tableViewChild()).nativeElement.style.width = width;
        (<ElementRef>this.tableViewChild()).nativeElement.style.minWidth = width;
    }

    restoreColumnWidths() {
        if (this.columnWidthsState) {
            let widths = this.columnWidthsState.split(',');

            if (this.columnResizeMode() === 'expand' && this.tableWidthState) {
                this.setResizeTableWidth(this.tableWidthState + 'px');
            }

            if (ObjectUtils.isNotEmpty(widths)) {
                this.createStyleElement();

                let innerHTML = '';
                widths.forEach((width, index) => {
                    let style = `width: ${width}px !important; max-width: ${width}px !important`;

                    innerHTML += `
                        #${this.id}-table > .p-datatable-thead > tr > th:nth-child(${index + 1}),
                        #${this.id}-table > .p-datatable-tbody > tr > td:nth-child(${index + 1}),
                        #${this.id}-table > .p-datatable-tfoot > tr > td:nth-child(${index + 1}) {
                            ${style}
                        }
                    `;
                });

                this.styleElement.innerHTML = innerHTML;
            }
        }
    }

    saveColumnOrder(state: any) {
        if (this.columns()) {
            let columnOrder: string[] = [];
            (<any[]>this.columns()).map((column) => {
                columnOrder.push(column.field || column.key);
            });

            state.columnOrder = columnOrder;
        }
    }

    restoreColumnOrder() {
        const storage = this.getStorage();
        const stateString = storage.getItem(<string>this.stateKey());
        if (stateString) {
            let state: TableState = JSON.parse(stateString);
            let columnOrder = state.columnOrder;

            if (columnOrder) {
                let reorderedColumns: any[] = [];

                columnOrder.map((key) => {
                    let col = this.findColumnByKey(key);
                    if (col) {
                        reorderedColumns.push(col);
                    }
                });
                this.columnOrderStateRestored = true;
                this.columns.set(reorderedColumns);
            }
        }
    }

    findColumnByKey(key: any) {
        if (this.columns()) {
            for (let col of <any[]>this.columns()) {
                if (col.key === key || col.field === key) return col;
                else continue;
            }
        } else {
            return null;
        }
    }

    createStyleElement() {
        this.styleElement = this.renderer.createElement('style');
        this.styleElement.type = 'text/css';
        DomHandler.setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
        this.renderer.appendChild(this.document.head, this.styleElement);
        DomHandler.setAttribute(this.styleElement, 'nonce', this.config?.csp()?.nonce);
    }

    getGroupRowsMeta() {
        return { field: this.groupRowsBy(), order: this.groupRowsByOrder() };
    }

    createResponsiveStyle() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.responsiveStyleElement) {
                this.responsiveStyleElement = this.renderer.createElement('style');
                this.responsiveStyleElement.type = 'text/css';
                DomHandler.setAttribute(this.responsiveStyleElement, 'nonce', this.config?.csp()?.nonce);
                this.renderer.appendChild(this.document.head, this.responsiveStyleElement);

                let innerHTML = `
    @media screen and (max-width: ${this.breakpoint()}) {
        #${this.id}-table > .p-datatable-thead > tr > th,
        #${this.id}-table > .p-datatable-tfoot > tr > td {
            display: none !important;
        }

        #${this.id}-table > .p-datatable-tbody > tr > td {
            display: flex;
            width: 100% !important;
            align-items: center;
            justify-content: space-between;
        }

        #${this.id}-table > .p-datatable-tbody > tr > td:not(:last-child) {
            border: 0 none;
        }

        #${this.id}.p-datatable-gridlines > .p-datatable-table-container > .p-datatable-table > .p-datatable-tbody > tr > td:last-child {
            border-top: 0;
            border-right: 0;
            border-left: 0;
        }

        #${this.id}-table > .p-datatable-tbody > tr > td > .p-datatable-column-title {
            display: block;
        }
    }
    `;
                this.renderer.setProperty(this.responsiveStyleElement, 'innerHTML', innerHTML);
                DomHandler.setAttribute(this.responsiveStyleElement, 'nonce', this.config?.csp()?.nonce);
            }
        }
    }

    destroyResponsiveStyle() {
        if (this.responsiveStyleElement) {
            this.renderer.removeChild(this.document.head, this.responsiveStyleElement);
            this.responsiveStyleElement = null;
        }
    }

    destroyStyleElement() {
        if (this.styleElement) {
            this.renderer.removeChild(this.document.head, this.styleElement);
            this.styleElement = null;
        }
    }

    ngAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptms(['host', 'root']));
    }

    onDestroy() {
        this.unbindDocumentEditListener();
        this.editingCell = null;
        this.initialized = null;

        this.destroyStyleElement();
        this.destroyResponsiveStyle();
    }

    get dataP() {
        return this.cn({
            scrollable: this.scrollable(),
            'flex-scrollable': this.scrollable() && this.scrollHeight() === 'flex',
            [this.size() as string]: this.size(),
            loading: this.loading(),
            empty: this.isEmpty()
        });
    }
}

@Component({
    selector: '[hTableBody]',
    standalone: false,
    templateUrl: './tablebody.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[attr.data-p]': 'dataP'
    }
})
export class TableBody extends BaseComponent {
    hostName = 'Table';

    readonly columns = input<any[]>(undefined, { alias: "hTableBody" });

    readonly template = input<Nullable<TemplateRef<any>>>(undefined, { alias: "pTableBodyTemplate" });

    readonly value = input<any[]>([]);

    readonly frozen = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    readonly frozenRows = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    readonly scrollerOptions = input<any>();

    subscription: Subscription;

    onAfterViewInit() {
        if (this.frozenRows()) {
            this.updateFrozenRowStickyPosition();
        }

        if (this.dataTable.scrollable() && this.dataTable.rowGroupMode() === 'subheader') {
            this.updateFrozenRowGroupHeaderStickyPosition();
        }
    }

    constructor(
        public dataTable: Table,
        public tableService: TableService
    ) {
        super();
        this.subscription = this.dataTable.tableService.valueSource$.subscribe(() => {
            if (this.dataTable.virtualScroll()) {
                this.cd.detectChanges();
            }
        });
    }

    shouldRenderRowGroupHeader(value: any, rowData: any, i: number) {
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.dataTable?.groupRowsBy() || '');
        let prevRowData = value[i - (this.dataTable?.first() || 0) - 1];
        if (prevRowData) {
            let previousRowFieldData = ObjectUtils.resolveFieldData(prevRowData, this.dataTable?.groupRowsBy() || '');
            return currentRowFieldData !== previousRowFieldData;
        } else {
            return true;
        }
    }

    shouldRenderRowGroupFooter(value: any, rowData: any, i: number) {
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, this.dataTable?.groupRowsBy() || '');
        let nextRowData = value[i - (this.dataTable?.first() || 0) + 1];
        if (nextRowData) {
            let nextRowFieldData = ObjectUtils.resolveFieldData(nextRowData, this.dataTable?.groupRowsBy() || '');
            return currentRowFieldData !== nextRowFieldData;
        } else {
            return true;
        }
    }

    shouldRenderRowspan(value: any, rowData: any, i: number) {
        const groupRowsBy = this.dataTable?.groupRowsBy();
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, groupRowsBy!);
        let prevRowData = value[i - 1];
        if (prevRowData) {
            let previousRowFieldData = ObjectUtils.resolveFieldData(prevRowData, groupRowsBy || '');
            return currentRowFieldData !== previousRowFieldData;
        } else {
            return true;
        }
    }

    calculateRowGroupSize(value: any, rowData: any, index: number) {
        const groupRowsBy = this.dataTable?.groupRowsBy();
        let currentRowFieldData = ObjectUtils.resolveFieldData(rowData, groupRowsBy!);
        let nextRowFieldData = currentRowFieldData;
        let groupRowSpan = 0;

        while (currentRowFieldData === nextRowFieldData) {
            groupRowSpan++;
            let nextRowData = value[++index];
            if (nextRowData) {
                nextRowFieldData = ObjectUtils.resolveFieldData(nextRowData, groupRowsBy || '');
            } else {
                break;
            }
        }

        return groupRowSpan === 1 ? null : groupRowSpan;
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    updateFrozenRowStickyPosition() {
        this.el.nativeElement.style.top = DomHandler.getOuterHeight(this.el.nativeElement.previousElementSibling) + 'px';
    }

    updateFrozenRowGroupHeaderStickyPosition() {
        if (this.el.nativeElement.previousElementSibling) {
            let tableHeaderHeight = DomHandler.getOuterHeight(this.el.nativeElement.previousElementSibling);
            this.dataTable.rowGroupHeaderStyleObject.top = tableHeaderHeight + 'px';
        }
    }

    getScrollerOption(option: any, options?: any) {
        if (this.dataTable.virtualScroll()) {
            options = options || this.scrollerOptions();
            return options ? options[option] : null;
        }

        return null;
    }

    getRowIndex(rowIndex: number) {
        const index = this.dataTable.paginator() ? (this.dataTable.first() || 0) + rowIndex : rowIndex;
        const getItemOptions = this.getScrollerOption('getItemOptions');
        return getItemOptions ? getItemOptions(index).index : index;
    }

    get dataP() {
        return this.cn({
            hoverable: this.dataTable.rowHover() || this.dataTable.selectionMode(),
            frozen: this.frozen()
        });
    }
}

@Directive({
    selector: '[hRowGroupHeader]',
    standalone: false,
    host: {
        '[class]': 'cx("rowGroupHeader")',
        '[style]': 'sx("rowGroupHeader")'
    },
    providers: [TableStyle]
})
export class RowGroupHeader extends BaseComponent {
    constructor(public dataTable: Table) {
        super();
    }

    _componentStyle = inject(TableStyle);

    get getFrozenRowGroupHeaderStickyPosition() {
        return this.dataTable.rowGroupHeaderStyleObject ? this.dataTable.rowGroupHeaderStyleObject.top : '';
    }
}

@Directive({
    selector: '[hFrozenColumn]',
    standalone: false,
    host: {
        '[class]': 'cx("frozenColumn")'
    },
    providers: [TableStyle]
})
export class FrozenColumn extends BaseComponent {
    readonly frozen = input<boolean>(true);

    readonly alignFrozen = input<string>('left');

    resizeListener: VoidListener;

    private resizeObserver?: ResizeObserver;

    _componentStyle = inject(TableStyle);

    onAfterViewInit() {
        this.bindResizeListener();
        this.observeChanges();
    }

    bindResizeListener() {
        if (isPlatformBrowser(this.platformId)) {
            if (!this.resizeListener) {
                this.resizeListener = this.renderer.listen(this.document.defaultView, 'resize', () => {
                    this.recalculateColumns();
                });
            }
        }
    }

    unbindResizeListener() {
        if (this.resizeListener) {
            this.resizeListener();
            this.resizeListener = null;
        }
    }

    observeChanges() {
        if (isPlatformBrowser(this.platformId)) {
            const resizeObserver = new ResizeObserver(() => {
                this.recalculateColumns();
            });

            resizeObserver.observe(this.el.nativeElement);
            this.resizeObserver = resizeObserver;
        }
    }

    recalculateColumns() {
        const siblings = DomHandler.siblings(this.el.nativeElement);
        const index = DomHandler.index(this.el.nativeElement);
        const time = (siblings.length - index + 1) * 50;

        setTimeout(() => {
            this.updateStickyPosition();
        }, time);
    }

    updateStickyPosition() {
        if (this.frozen()) {
            if (this.alignFrozen() === 'right') {
                let right = 0;
                let sibling = this.el.nativeElement.nextElementSibling;
                while (sibling) {
                    right += DomHandler.getOuterWidth(sibling);
                    sibling = sibling.nextElementSibling;
                }
                this.el.nativeElement.style.right = right + 'px';
            } else {
                let left = 0;
                let sibling = this.el.nativeElement.previousElementSibling;
                while (sibling) {
                    left += DomHandler.getOuterWidth(sibling);
                    sibling = sibling.previousElementSibling;
                }
                this.el.nativeElement.style.left = left + 'px';
            }

            const filterRow = this.el.nativeElement?.parentElement?.nextElementSibling;
            if (filterRow) {
                let index = DomHandler.index(this.el.nativeElement);
                if (filterRow.children && filterRow.children[index]) {
                    filterRow.children[index].style.left = this.el.nativeElement.style.left;
                    filterRow.children[index].style.right = this.el.nativeElement.style.right;
                }
            }
        }
    }

    onDestroy() {
        this.unbindResizeListener();
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }
}
@Directive({
    selector: '[hSortableColumn]',
    standalone: false,
    host: {
        '[class]': "cx('sortableColumn')",
        '[tabindex]': 'isEnabled() ? "0" : null',
        role: 'columnheader',
        '[attr.aria-sort]': 'sortOrder',
        '(click)': 'onClick($event)',
        '(keydown.space)': 'onEnterKey($event)',
        '(keydown.enter)': 'onEnterKey($event)'
    },
    providers: [TableStyle]
})
export class SortableColumn extends BaseComponent {
    readonly field = input<string>(undefined, { alias: "hSortableColumn" });

    readonly pSortableColumnDisabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    role = this.el.nativeElement?.tagName !== 'TH' ? 'columnheader' : null;

    sorted: boolean | undefined;

    sortOrder: string | undefined;

    subscription: Subscription | undefined;

    _componentStyle = inject(TableStyle);

    constructor(public dataTable: Table) {
        super();
        if (this.isEnabled()) {
            this.subscription = this.dataTable.tableService.sortSource$.subscribe((sortMeta) => {
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
        let sorted = false;
        let sortOrder = 0;

        const sortMode = this.dataTable.sortMode();
        if (sortMode === 'single') {
            sorted = this.dataTable.isSorted(<string>this.field()) as boolean;
            sortOrder = this.dataTable.sortOrder();
        } else if (sortMode === 'multiple') {
            const sortMeta = this.dataTable.getSortMeta(<string>this.field());
            sorted = !!sortMeta;
            sortOrder = sortMeta ? sortMeta.order : 0;
        }

        this.sorted = sorted;
        this.sortOrder = sorted ? (sortOrder === 1 ? 'ascending' : 'descending') : 'none';
    }

    onClick(event: MouseEvent) {
        if (this.isEnabled() && !this.isFilterElement(<HTMLElement>event.target)) {
            this.updateSortState();
            this.dataTable.sort({
                originalEvent: event,
                field: this.field()
            });

            DomHandler.clearSelection();
        }
    }

    onEnterKey(event: MouseEvent) {
        this.onClick(event);

        event.preventDefault();
    }

    isEnabled() {
        return this.pSortableColumnDisabled() !== true;
    }

    isFilterElement(element: HTMLElement) {
        return this.isFilterElementIconOrButton(element) || this.isFilterElementIconOrButton(element?.parentElement?.parentElement!);
    }

    private isFilterElementIconOrButton(element: HTMLElement) {
        return getAttribute(element, '[data-pc-name="pccolumnfilterbutton"]') || getAttribute(element, '[data-pc-section="columnfilterbuttonicon"]');
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

@Component({
    selector: 'h-sortIcon',
    standalone: false,
    templateUrl: './sorticon.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [TableStyle]
})
export class SortIcon extends BaseComponent {
    readonly field = input<string>();

    subscription: Subscription | undefined;

    sortOrder: number | undefined;

    _componentStyle = inject(TableStyle);

    constructor(
        public dataTable: Table,
        public cd: ChangeDetectorRef
    ) {
        super();
        this.subscription = this.dataTable.tableService.sortSource$.subscribe((sortMeta) => {
            this.updateSortState();
        });
    }

    onInit() {
        this.updateSortState();
    }

    onClick(event: Event) {
        event.preventDefault();
    }

    updateSortState() {
        const sortMode = this.dataTable.sortMode();
        if (sortMode === 'single') {
            this.sortOrder = this.dataTable.isSorted(<string>this.field()) ? this.dataTable.sortOrder() : 0;
        } else if (sortMode === 'multiple') {
            let sortMeta = this.dataTable.getSortMeta(<string>this.field());
            this.sortOrder = sortMeta ? sortMeta.order : 0;
        }

        this.cd.markForCheck();
    }

    getMultiSortMetaIndex() {
        let multiSortMeta = this.dataTable.multiSortMeta();
        let index = -1;

        if (multiSortMeta && this.dataTable.sortMode() === 'multiple' && this.dataTable.showInitialSortBadge() && multiSortMeta.length > 1) {
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

    getBadgeValue() {
        let index = this.getMultiSortMetaIndex();

        return (this.dataTable?.groupRowsBy() || '') && index > -1 ? index : index + 1;
    }

    isMultiSorted() {
        return this.dataTable.sortMode() === 'multiple' && this.getMultiSortMetaIndex() > -1;
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

@Directive({
    selector: '[hSelectableRow]',
    standalone: false,
    host: {
        '[class]': "cx('selectableRow')",
        '[tabindex]': 'setRowTabIndex()',
        '[attr.data-p-selectable-row]': 'true',
        '(click)': 'onClick($event)',
        '(touchend)': 'onTouchEnd($event)',
        '(keydown)': 'onKeyDown($event)'
    },
    providers: [TableStyle]
})
export class SelectableRow extends BaseComponent {
    readonly data = input<any>(undefined, { alias: "hSelectableRow" });

    readonly index = input<number>(undefined, { alias: "pSelectableRowIndex" });

    readonly pSelectableRowDisabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    selected: boolean | undefined;

    subscription: Subscription | undefined;

    _componentStyle = inject(TableStyle);

    constructor(
        public dataTable: Table,
        public tableService: TableService
    ) {
        super();
        if (this.isEnabled()) {
            this.subscription = this.dataTable.tableService.selectionSource$.subscribe(() => {
                this.selected = this.dataTable.isSelected(this.data());
            });
        }
    }

    setRowTabIndex() {
        const selectionMode = this.dataTable.selectionMode();
        if (selectionMode === 'single' || selectionMode === 'multiple') {
            return !this.dataTable.selection() ? 0 : this.dataTable.anchorRowIndex === this.index() ? 0 : -1;
        }
    }

    onInit() {
        if (this.isEnabled()) {
            this.selected = this.dataTable.isSelected(this.data());
        }
    }

    onClick(event: Event) {
        if (this.isEnabled()) {
            this.dataTable.handleRowClick({
                originalEvent: event,
                rowData: this.data(),
                rowIndex: this.index()
            });
        }
    }

    onTouchEnd(event: Event) {
        if (this.isEnabled()) {
            this.dataTable.handleRowTouchEnd(event);
        }
    }

    onKeyDown(event: KeyboardEvent) {
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

            case 'Space':
                this.onSpaceKey(event);
                break;

            case 'Enter':
                this.onEnterKey(event);
                break;

            default:
                if (event.code === 'KeyA' && (event.metaKey || event.ctrlKey) && this.dataTable.selectionMode() === 'multiple') {
                    const data = this.dataTable.dataToRender(this.dataTable.processedData);
                    this.dataTable.selection.set([...data]);
                    this.dataTable.selectRange(event, data.length - 1, true);

                    event.preventDefault();
                }
                break;
        }
    }

    onArrowDownKey(event: KeyboardEvent) {
        if (!this.isEnabled()) {
            return;
        }

        const row = <HTMLTableRowElement>event.currentTarget;
        const nextRow = this.findNextSelectableRow(row);

        if (nextRow) {
            nextRow.focus();
        }

        event.preventDefault();
    }

    onArrowUpKey(event: KeyboardEvent) {
        if (!this.isEnabled()) {
            return;
        }

        const row = <HTMLTableRowElement>event.currentTarget;
        const prevRow = this.findPrevSelectableRow(row);

        if (prevRow) {
            prevRow.focus();
        }

        event.preventDefault();
    }

    onEnterKey(event: KeyboardEvent) {
        if (!this.isEnabled()) {
            return;
        }

        this.dataTable.handleRowClick({
            originalEvent: event,
            rowData: this.data(),
            rowIndex: this.index()
        });
    }

    onEndKey(event: KeyboardEvent) {
        const lastRow = this.findLastSelectableRow();
        lastRow && this.focusRowChange(this.el.nativeElement, lastRow);

        if (event.ctrlKey && event.shiftKey) {
            const data = this.dataTable.dataToRender(this.dataTable.rows);
            const lastSelectableRowIndex = DomHandler.getAttribute(lastRow, 'index');

            this.dataTable.anchorRowIndex = lastSelectableRowIndex;
            this.dataTable.selection.set(data.slice(this.index() || 0, data.length));
            this.dataTable.selectRange(event, this.index() || 0);
        }
        event.preventDefault();
    }

    onHomeKey(event: KeyboardEvent) {
        const firstRow = this.findFirstSelectableRow();

        firstRow && this.focusRowChange(this.el.nativeElement, firstRow);

        if (event.ctrlKey && event.shiftKey) {
            const data = this.dataTable.dataToRender(this.dataTable.rows);
            const firstSelectableRowIndex = DomHandler.getAttribute(firstRow, 'index');

            this.dataTable.anchorRowIndex = this.dataTable.anchorRowIndex || firstSelectableRowIndex || 0;
            this.dataTable.selection.set(data.slice(0, (this.index() || 0) + 1));
            this.dataTable.selectRange(event, this.index() || 0);
        }
        event.preventDefault();
    }

    onSpaceKey(event) {
        const isInput = event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement;
        if (isInput) {
            return;
        } else {
            this.onEnterKey(event);

            if (event.shiftKey && this.dataTable.selection() !== null) {
                const data = this.dataTable.dataToRender(this.dataTable.rows);
                let index;

                const selection = this.dataTable.selection();
                if (ObjectUtils.isNotEmpty(selection) && selection.length > 0) {
                    let firstSelectedRowIndex, lastSelectedRowIndex;
                    firstSelectedRowIndex = ObjectUtils.findIndexInList(selection[0], data);
                    lastSelectedRowIndex = ObjectUtils.findIndexInList(selection[selection.length - 1], data);

                    index = (this.index() || 0) <= firstSelectedRowIndex ? lastSelectedRowIndex : firstSelectedRowIndex;
                } else {
                    index = ObjectUtils.findIndexInList(selection, data);
                }

                this.dataTable.anchorRowIndex = index || 0;
                const indexValue = this.index();
                this.dataTable.selection.set(index !== indexValue ? data.slice(Math.min(index || 0, indexValue || 0), Math.max(index || 0, indexValue || 0) + 1) : [this.data()]);
                this.dataTable.selectRange(event, this.index() || 0);
            }

            event.preventDefault();
        }
    }

    focusRowChange(firstFocusableRow, currentFocusedRow) {
        firstFocusableRow.tabIndex = '-1';
        currentFocusedRow.tabIndex = '0';
        DomHandler.focus(currentFocusedRow);
    }

    findLastSelectableRow() {
        const rows = DomHandler.find(this.dataTable.el.nativeElement, '[data-p-selectable-row="true"]');

        return rows ? rows[rows.length - 1] : null;
    }

    findFirstSelectableRow() {
        const firstRow = DomHandler.findSingle(this.dataTable.el.nativeElement, '[data-p-selectable-row="true"]');

        return firstRow;
    }

    findNextSelectableRow(row: HTMLTableRowElement): HTMLTableRowElement | null {
        let nextRow = <HTMLTableRowElement>row.nextElementSibling;

        if (nextRow) {
            if (find(nextRow, '[data-p-selectable-row="true"]')) return nextRow;
            else return this.findNextSelectableRow(nextRow);
        } else {
            return null;
        }
    }

    findPrevSelectableRow(row: HTMLTableRowElement): HTMLTableRowElement | null {
        let prevRow = <HTMLTableRowElement>row.previousElementSibling;
        if (prevRow) {
            if (find(prevRow, '[data-p-selectable-row="true"]')) return prevRow;
            else return this.findPrevSelectableRow(prevRow);
        } else {
            return null;
        }
    }

    isEnabled() {
        return this.pSelectableRowDisabled() !== true;
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

@Directive({
    selector: '[hSelectableRowDblClick]',
    standalone: false,
    host: {
        '[class]': 'cx("selectableRow")',
        '(dblclick)': 'onClick($event)'
    },
    providers: [TableStyle]
})
export class SelectableRowDblClick extends BaseComponent {
    readonly data = input<any>(undefined, { alias: "hSelectableRowDblClick" });

    readonly index = input<number>(undefined, { alias: "pSelectableRowIndex" });

    readonly pSelectableRowDisabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    selected: boolean | undefined;

    subscription: Subscription | undefined;

    _componentStyle = inject(TableStyle);

    constructor(
        public dataTable: Table,
        public tableService: TableService
    ) {
        super();
        if (this.isEnabled()) {
            this.subscription = this.dataTable.tableService.selectionSource$.subscribe(() => {
                this.selected = this.dataTable.isSelected(this.data());
            });
        }
    }

    onInit() {
        if (this.isEnabled()) {
            this.selected = this.dataTable.isSelected(this.data());
        }
    }

    onClick(event: Event) {
        if (this.isEnabled()) {
            this.dataTable.handleRowClick({
                originalEvent: event,
                rowData: this.data(),
                rowIndex: this.index()
            });
        }
    }

    isEnabled() {
        return this.pSelectableRowDisabled() !== true;
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

@Directive({
    selector: '[hContextMenuRow]',
    standalone: false,
    host: {
        '[class]': 'cx("contextMenuRowSelected")',
        '[attr.tabindex]': 'isEnabled() ? 0 : undefined',
        '(contextmenu)': 'onContextMenu($event)'
    },
    providers: [TableStyle]
})
export class ContextMenuRow extends BaseComponent {
    readonly data = input<any>(undefined, { alias: "hContextMenuRow" });

    readonly index = input<number>(undefined, { alias: "pContextMenuRowIndex" });

    readonly pContextMenuRowDisabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    selected: boolean | undefined;

    subscription: Subscription | undefined;

    _componentStyle = inject(TableStyle);

    constructor(
        public dataTable: Table,
        public tableService: TableService
    ) {
        super();
        if (this.isEnabled()) {
            this.subscription = this.dataTable.tableService.contextMenuSource$.subscribe((data) => {
                this.selected = data ? this.dataTable.equals(this.data(), data) : false;
            });
        }
    }

    onContextMenu(event: Event) {
        if (this.isEnabled()) {
            this.dataTable.handleRowRightClick({
                originalEvent: event,
                rowData: this.data(),
                rowIndex: this.index()
            });

            this.el.nativeElement.focus();
            event.preventDefault();
        }
    }

    isEnabled() {
        return this.pContextMenuRowDisabled() !== true;
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

@Directive({
    selector: '[hRowToggler]',
    standalone: false,
    host: {
        '(click)': 'onClick($event)'
    }
})
export class RowToggler extends BaseComponent {
    readonly data = input<any>(undefined, { alias: "hRowToggler" });

    readonly pRowTogglerDisabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    constructor(public dataTable: Table) {
        super();
    }

    onClick(event: Event) {
        if (this.isEnabled()) {
            this.dataTable.toggleRow(this.data(), event);
            event.preventDefault();
        }
    }

    isEnabled() {
        return this.pRowTogglerDisabled() !== true;
    }
}

@Directive({
    selector: '[hResizableColumn]',
    standalone: false,
    host: {
        '[class]': "cx('resizableColumn')"
    },
    providers: [TableStyle]
})
export class ResizableColumn extends BaseComponent {
    readonly pResizableColumnDisabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    resizer: HTMLSpanElement | undefined;

    resizerMouseDownListener: VoidListener;

    resizerTouchStartListener: VoidListener;

    resizerTouchMoveListener: VoidListener;

    resizerTouchEndListener: VoidListener;

    documentMouseMoveListener: VoidListener;

    documentMouseUpListener: VoidListener;

    _componentStyle = inject(TableStyle);

    constructor(
        public dataTable: Table,
        public zone: NgZone
    ) {
        super();
    }

    onAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.isEnabled()) {
                this.resizer = this.renderer.createElement('span');
                setAttribute(this.resizer as HTMLElement, 'data-pc-column-resizer', 'true');
                !this.$unstyled() && this.renderer.addClass(this.resizer, 'p-datatable-column-resizer');
                this.renderer.appendChild(this.el.nativeElement, this.resizer);

                this.zone.runOutsideAngular(() => {
                    this.resizerMouseDownListener = this.renderer.listen(this.resizer, 'mousedown', this.onMouseDown.bind(this));
                    this.resizerTouchStartListener = this.renderer.listen(this.resizer, 'touchstart', this.onTouchStart.bind(this));
                });
            }
        }
    }

    bindDocumentEvents() {
        this.zone.runOutsideAngular(() => {
            this.documentMouseMoveListener = this.renderer.listen(this.document, 'mousemove', this.onDocumentMouseMove.bind(this));
            this.documentMouseUpListener = this.renderer.listen(this.document, 'mouseup', this.onDocumentMouseUp.bind(this));
            this.resizerTouchMoveListener = this.renderer.listen(this.resizer, 'touchmove', this.onTouchMove.bind(this));
            this.resizerTouchEndListener = this.renderer.listen(this.resizer, 'touchend', this.onTouchEnd.bind(this));
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
        if (this.resizerTouchMoveListener) {
            this.resizerTouchMoveListener();
            this.resizerTouchMoveListener = null;
        }

        if (this.resizerTouchEndListener) {
            this.resizerTouchEndListener();
            this.resizerTouchEndListener = null;
        }
    }

    onMouseDown(event: MouseEvent) {
        this.dataTable.onColumnResizeBegin(event);
        this.bindDocumentEvents();
    }

    onTouchStart(event: TouchEvent) {
        this.dataTable.onColumnResizeBegin(event);
        this.bindDocumentEvents();
    }

    onTouchMove(event: TouchEvent) {
        this.dataTable.onColumnResize(event);
    }
    onDocumentMouseMove(event: MouseEvent) {
        this.dataTable.onColumnResize(event);
    }

    onDocumentMouseUp(event: MouseEvent) {
        this.dataTable.onColumnResizeEnd();
        this.unbindDocumentEvents();
    }

    onTouchEnd(event: TouchEvent) {
        this.dataTable.onColumnResizeEnd();
        this.unbindDocumentEvents();
    }

    isEnabled() {
        return this.pResizableColumnDisabled() !== true;
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
    selector: '[hReorderableColumn]',
    standalone: false,
    host: {
        '[class]': "cx('reorderableColumn')",
        '(drop)': 'onDrop($event)'
    },
    providers: [TableStyle]
})
export class ReorderableColumn extends BaseComponent {
    readonly pReorderableColumnDisabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    dragStartListener: VoidListener;

    dragOverListener: VoidListener;

    dragEnterListener: VoidListener;

    dragLeaveListener: VoidListener;

    mouseDownListener: VoidListener;

    _componentStyle = inject(TableStyle);

    constructor(
        public dataTable: Table,
        public el: ElementRef,
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

                this.dragOverListener = this.renderer.listen(this.el.nativeElement, 'dragover', this.onDragOver.bind(this));

                this.dragEnterListener = this.renderer.listen(this.el.nativeElement, 'dragenter', this.onDragEnter.bind(this));

                this.dragLeaveListener = this.renderer.listen(this.el.nativeElement, 'dragleave', this.onDragLeave.bind(this));
            });
        }
    }

    unbindEvents() {
        if (this.mouseDownListener) {
            this.mouseDownListener();
            this.mouseDownListener = null;
        }

        if (this.dragStartListener) {
            this.dragStartListener();
            this.dragStartListener = null;
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

    onMouseDown(event: any) {
        if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'TEXTAREA' || findSingle(event.target, '[data-pc-column-resizer="true"]')) this.el.nativeElement.draggable = false;
        else this.el.nativeElement.draggable = true;
    }

    onDragStart(event: any) {
        this.dataTable.onColumnDragStart(event, this.el.nativeElement);
    }

    onDragOver(event: any) {
        event.preventDefault();
    }

    onDragEnter(event: any) {
        this.dataTable.onColumnDragEnter(event, this.el.nativeElement);
    }

    onDragLeave(event: any) {
        this.dataTable.onColumnDragLeave(event);
    }

    onDrop(event: any) {
        if (this.isEnabled()) {
            this.dataTable.onColumnDrop(event, this.el.nativeElement);
        }
    }

    isEnabled() {
        return this.pReorderableColumnDisabled() !== true;
    }

    onDestroy() {
        this.unbindEvents();
    }
}

@Directive({
    selector: '[hEditableColumn]',
    standalone: false,
    host: {
        '[attr.data-p-editable-column]': 'true',
        '(click)': 'onClick($event)',
        '(keydown.enter)': 'onEnterKeyDown($event)',
        '(keydown.tab)': 'onShiftKeyDown($event)',
        '(keydown.shift.tab)': 'onShiftKeyDown($event)',
        '(keydown.meta.tab)': 'onShiftKeyDown($event)',
        '(keydown.escape)': 'onEscapeKeyDown($event)',
        '(keydown.arrowdown)': 'onArrowDown($event)',
        '(keydown.arrowup)': 'onArrowUp($event)',
        '(keydown.arrowleft)': 'onArrowLeft($event)',
        '(keydown.arrowright)': 'onArrowRight($event)'
    }
})
export class EditableColumn extends BaseComponent {
    readonly data = input<any>(undefined, { alias: "hEditableColumn" });

    readonly field = input<any>(undefined, { alias: "pEditableColumnField" });

    readonly rowIndex = input<number>(undefined, { alias: "pEditableColumnRowIndex" });

    readonly pEditableColumnDisabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    readonly pFocusCellSelector = input<string>();

    overlayEventListener: any;

    constructor(
        public dataTable: Table,
        public zone: NgZone
    ) {
        super();
    }

    public onChanges(changes: SimpleChanges): void {
        if (this.el.nativeElement && !changes.data?.firstChange) {
            this.dataTable.updateEditingCell(this.el.nativeElement, this.data(), this.field(), <number>this.rowIndex());
        }
    }

    onAfterViewInit() {
        if (this.isEnabled()) {
            !this.$unstyled() && DomHandler.addClass(this.el.nativeElement, 'p-editable-column');
        }
    }

    onClick(event: MouseEvent) {
        if (this.isEnabled()) {
            this.dataTable.selfClick = true;

            if (this.dataTable.editingCell) {
                if (this.dataTable.editingCell !== this.el.nativeElement) {
                    if (!this.dataTable.isEditingCellValid()) {
                        return;
                    }

                    this.closeEditingCell(true, event);
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
        const rowIndex = this.rowIndex();
        this.dataTable.updateEditingCell(this.el.nativeElement, data, field, <number>rowIndex);
        !this.$unstyled() && DomHandler.addClass(this.el.nativeElement, 'p-cell-editing');
        setAttribute(this.el.nativeElement, 'data-p-cell-editing', 'true');

        this.dataTable.onEditInit.emit({
            field: field,
            data: data,
            index: <number>rowIndex
        });
        this.zone.runOutsideAngular(() => {
            setTimeout(() => {
                let focusCellSelector = this.pFocusCellSelector() || 'input, textarea, select';
                let focusableElement = DomHandler.findSingle(this.el.nativeElement, focusCellSelector);

                if (focusableElement) {
                    focusableElement.focus();
                }
            }, 50);
        });

        this.overlayEventListener = (e: any) => {
            if (this.el && this.el.nativeElement.contains(e.target)) {
                this.dataTable.selfClick = true;
            }
        };

        this.dataTable.overlaySubscription = this.dataTable.overlayService.clickObservable.subscribe(this.overlayEventListener);
    }

    closeEditingCell(completed: any, event: Event) {
        const eventData = {
            field: <string>this.dataTable.editingCellField,
            data: <any>this.dataTable.editingCellData,
            originalEvent: <Event>event,
            index: <number>this.dataTable.editingCellRowIndex
        };

        if (completed) {
            this.dataTable.onEditComplete.emit(eventData);
        } else {
            this.dataTable.onEditCancel.emit(eventData);

            this.dataTable.value().forEach((element) => {
                if (element[this.dataTable.editingCellField] === this.data()) {
                    element[this.dataTable.editingCellField] = this.dataTable.editingCellData;
                }
            });
        }

        !this.$unstyled() && DomHandler.removeClass(this.dataTable.editingCell, 'p-cell-editing');
        setAttribute(this.el.nativeElement, 'data-p-cell-editing', 'false');
        this.dataTable.editingCell = null;
        this.dataTable.editingCellData = null;
        this.dataTable.editingCellField = null;
        this.dataTable.unbindDocumentEditListener();

        if (this.dataTable.overlaySubscription) {
            this.dataTable.overlaySubscription.unsubscribe();
        }
    }

    onEnterKeyDown(event: KeyboardEvent) {
        if (this.isEnabled() && !event.shiftKey) {
            if (this.dataTable.isEditingCellValid()) {
                this.closeEditingCell(true, event);
            }

            event.preventDefault();
        }
    }

    onTabKeyDown(event: KeyboardEvent) {
        if (this.isEnabled()) {
            if (this.dataTable.isEditingCellValid()) {
                this.closeEditingCell(true, event);
            }

            event.preventDefault();
        }
    }

    onEscapeKeyDown(event: KeyboardEvent) {
        if (this.isEnabled()) {
            if (this.dataTable.isEditingCellValid()) {
                this.closeEditingCell(false, event);
            }

            event.preventDefault();
        }
    }

    onShiftKeyDown(event: KeyboardEvent) {
        if (this.isEnabled()) {
            if (event.shiftKey) this.moveToPreviousCell(event);
            else {
                this.moveToNextCell(event);
            }
        }
    }
    onArrowDown(event: KeyboardEvent) {
        if (this.isEnabled()) {
            let currentCell = this.findCell(event.target);
            if (currentCell) {
                let cellIndex = DomHandler.index(currentCell);
                let targetCell = this.findNextEditableColumnByIndex(currentCell, cellIndex);

                if (targetCell) {
                    if (this.dataTable.isEditingCellValid()) {
                        this.closeEditingCell(true, event);
                    }

                    DomHandler.invokeElementMethod(event.target, 'blur');
                    DomHandler.invokeElementMethod(targetCell, 'click');
                }

                event.preventDefault();
            }
        }
    }

    onArrowUp(event: KeyboardEvent) {
        if (this.isEnabled()) {
            let currentCell = this.findCell(event.target);
            if (currentCell) {
                let cellIndex = DomHandler.index(currentCell);
                let targetCell = this.findPrevEditableColumnByIndex(currentCell, cellIndex);

                if (targetCell) {
                    if (this.dataTable.isEditingCellValid()) {
                        this.closeEditingCell(true, event);
                    }

                    DomHandler.invokeElementMethod(event.target, 'blur');
                    DomHandler.invokeElementMethod(targetCell, 'click');
                }

                event.preventDefault();
            }
        }
    }

    onArrowLeft(event: KeyboardEvent) {
        if (this.isEnabled()) {
            this.moveToPreviousCell(event);
        }
    }

    onArrowRight(event: KeyboardEvent) {
        if (this.isEnabled()) {
            this.moveToNextCell(event);
        }
    }

    findCell(element: any) {
        if (element) {
            let cell = element;
            while (cell && !findSingle(cell as HTMLElement, '[data-p-cell-editing="true"]')) {
                cell = cell.parentElement;
            }

            return cell;
        } else {
            return null;
        }
    }

    moveToPreviousCell(event: KeyboardEvent) {
        let currentCell = this.findCell(event.target);
        if (currentCell) {
            let targetCell = this.findPreviousEditableColumn(currentCell);

            if (targetCell) {
                if (this.dataTable.isEditingCellValid()) {
                    this.closeEditingCell(true, event);
                }

                DomHandler.invokeElementMethod(event.target, 'blur');
                DomHandler.invokeElementMethod(targetCell, 'click');
                event.preventDefault();
            }
        }
    }

    moveToNextCell(event: KeyboardEvent) {
        let currentCell = this.findCell(event.target);
        if (currentCell) {
            let targetCell = this.findNextEditableColumn(currentCell);

            if (targetCell) {
                if (this.dataTable.isEditingCellValid()) {
                    this.closeEditingCell(true, event);
                }

                DomHandler.invokeElementMethod(event.target, 'blur');
                DomHandler.invokeElementMethod(targetCell, 'click');
                event.preventDefault();
            } else {
                if (this.dataTable.isEditingCellValid()) {
                    this.closeEditingCell(true, event);
                }
            }
        }
    }

    findPreviousEditableColumn(cell: any): HTMLTableCellElement | null {
        let prevCell = cell.previousElementSibling;

        if (!prevCell) {
            let previousRow = cell.parentElement?.previousElementSibling;
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

    findNextEditableColumn(cell: any): HTMLTableCellElement | null {
        let nextCell = cell.nextElementSibling;

        if (!nextCell) {
            let nextRow = cell.parentElement?.nextElementSibling;
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

    findNextEditableColumnByIndex(cell: Element, index: number) {
        let nextRow = cell.parentElement?.nextElementSibling;

        if (nextRow) {
            let nextCell = nextRow.children[index];

            if (nextCell && findSingle(nextCell, '[data-p-editable-column="true"]')) {
                return nextCell;
            }

            return null;
        } else {
            return null;
        }
    }

    findPrevEditableColumnByIndex(cell: Element, index: number) {
        let prevRow = cell.parentElement?.previousElementSibling;

        if (prevRow) {
            let prevCell = prevRow.children[index];

            if (prevCell && findSingle(prevCell, '[data-p-editable-column="true"]')) {
                return prevCell;
            }

            return null;
        } else {
            return null;
        }
    }

    isEnabled() {
        return this.pEditableColumnDisabled() !== true;
    }

    onDestroy() {
        if (this.dataTable.overlaySubscription) {
            this.dataTable.overlaySubscription.unsubscribe();
        }
    }
}

@Directive({
    selector: '[hEditableRow]',
    standalone: false
})
export class EditableRow extends BaseComponent {
    readonly data = input<any>(undefined, { alias: "hEditableRow" });

    readonly pEditableRowDisabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    isEnabled() {
        return this.pEditableRowDisabled() !== true;
    }
}

@Directive({
    selector: '[hInitEditableRow]',
    standalone: false,
    host: {
        class: 'p-datatable-row-editor-init',
        '(click)': 'onClick($event)'
    }
})
export class InitEditableRow extends BaseComponent {
    constructor(
        public dataTable: Table,
        public editableRow: EditableRow
    ) {
        super();
    }

    onClick(event: Event) {
        this.dataTable.initRowEdit(this.editableRow.data());
        event.preventDefault();
    }
}

@Directive({
    selector: '[hSaveEditableRow]',
    standalone: false,
    host: {
        class: 'p-datatable-row-editor-save',
        '(click)': 'onClick($event)'
    }
})
export class SaveEditableRow extends BaseComponent {
    constructor(
        public dataTable: Table,
        public editableRow: EditableRow
    ) {
        super();
    }

    onClick(event: Event) {
        this.dataTable.saveRowEdit(this.editableRow.data(), this.editableRow.el.nativeElement);
        event.preventDefault();
    }
}

@Directive({
    selector: '[hCancelEditableRow]',
    standalone: false,
    host: {
        '[class]': "cx('rowEditorCancel')",
        '(click)': 'onClick($event)'
    },
    providers: [TableStyle]
})
export class CancelEditableRow extends BaseComponent {
    constructor(
        public dataTable: Table,
        public editableRow: EditableRow
    ) {
        super();
    }
    _componentStyle = inject(TableStyle);
    onClick(event: Event) {
        this.dataTable.cancelRowEdit(this.editableRow.data());
        event.preventDefault();
    }
}

@Component({
    selector: 'h-cellEditor',
    standalone: false,
    template: `
        @if (editing) {
          <ng-container *ngTemplateOutlet="inputTemplate || _inputTemplate()"></ng-container>
        }
        @if (!editing) {
          <ng-container *ngTemplateOutlet="outputTemplate || _outputTemplate()"></ng-container>
        }
        `,
    changeDetection: ChangeDetectionStrategy.Eager,
    encapsulation: ViewEncapsulation.None
})
export class CellEditor extends BaseComponent {
    readonly _templates = contentChildren(PrimeTemplate);

    readonly _inputTemplate = contentChild.required<TemplateRef<any>>('input');

    readonly _outputTemplate = contentChild.required<TemplateRef<any>>('output');

    inputTemplate: Nullable<TemplateRef<any>>;

    outputTemplate: Nullable<TemplateRef<any>>;

    constructor(
        public dataTable: Table,
        @Optional() public editableColumn: EditableColumn,
        @Optional() public editableRow: EditableRow
    ) {
        super();
    }

    onAfterContentInit() {
        this._templates().forEach((item) => {
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

    get editing(): boolean {
        return (
            (this.dataTable.editingCell && this.editableColumn && this.dataTable.editingCell === this.editableColumn.el.nativeElement) || (this.editableRow && this.dataTable.editMode() === 'row' && this.dataTable.isRowEditing(this.editableRow.data()))
        );
    }
}

@Component({
    selector: 'h-tableRadioButton',
    standalone: false,
    template: `<h-radioButton #rb [(ngModel)]="checked" [disabled]="disabled()" [inputId]="inputId()" [name]="name()" [ariaLabel]="ariaLabel()" [binary]="true" [value]="value()" (onClick)="onClick($event)" [unstyled]="unstyled()" /> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class TableRadioButton extends BaseComponent {
    readonly value = input<any>();

    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    readonly index = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    readonly inputId = input<string | undefined>();
    readonly name = input<string | undefined>();

    readonly ariaLabel = model<string | undefined>(undefined);

    readonly inputViewChild = viewChild<Nullable<RadioButton>>('rb');

    checked: boolean | undefined;

    subscription: Subscription;

    constructor(
        public dataTable: Table,
        public cd: ChangeDetectorRef
    ) {
        super();
        this.subscription = this.dataTable.tableService.selectionSource$.subscribe(() => {
            this.checked = this.dataTable.isSelected(this.value());

            this.ariaLabel.set(this.ariaLabel() || (this.dataTable.config.translation.aria ? (this.checked ? this.dataTable.config.translation.aria.selectRow : this.dataTable.config.translation.aria.unselectRow) : undefined));
            this.cd.markForCheck();
        });
    }

    onInit() {
        this.checked = this.dataTable.isSelected(this.value());
    }

    onClick(event: RadioButtonClickEvent) {
        if (!this.disabled()) {
            this.dataTable.toggleRowWithRadio(
                {
                    originalEvent: event.originalEvent,
                    rowIndex: this.index()
                },
                this.value()
            );

            this.inputViewChild()?.inputViewChild().nativeElement?.focus();
        }
        DomHandler.clearSelection();
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

@Component({
    selector: 'h-tableCheckbox',
    standalone: false,
    template: `
        <h-checkbox [(ngModel)]="checked" [binary]="true" (onChange)="onClick($event)" [required]="required()" [disabled]="disabled()" [inputId]="inputId()" [name]="name()" [ariaLabel]="ariaLabel()" [unstyled]="unstyled()">
            @if (dataTable.checkboxIconTemplate || dataTable._checkboxIconTemplate(); as template) {
                <ng-template hTemplate="icon">
                    <ng-template *ngTemplateOutlet="template; context: { $implicit: checked }" />
                </ng-template>
            }
        </h-checkbox>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class TableCheckbox extends BaseComponent {
    readonly value = input<any>();

    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    readonly required = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    readonly index = input<number | undefined, unknown>(undefined, { transform: numberAttribute });
    readonly inputId = input<string | undefined>();
    readonly name = input<string | undefined>();

    readonly ariaLabel = model<string | undefined>(undefined);

    checked: boolean | undefined;

    subscription: Subscription;

    constructor(
        public dataTable: Table,
        public tableService: TableService
    ) {
        super();
        this.subscription = this.dataTable.tableService.selectionSource$.subscribe(() => {
            this.checked = this.dataTable.isSelected(this.value());
            this.ariaLabel.set(this.ariaLabel() || (this.dataTable.config.translation.aria ? (this.checked ? this.dataTable.config.translation.aria.selectRow : this.dataTable.config.translation.aria.unselectRow) : undefined));
            this.cd.markForCheck();
        });
    }

    onInit() {
        this.checked = this.dataTable.isSelected(this.value());
    }

    onClick({ originalEvent }: CheckboxChangeEvent) {
        if (!this.disabled()) {
            this.dataTable.toggleRowWithCheckbox(
                {
                    originalEvent: originalEvent!,
                    rowIndex: this.index() || 0
                },
                this.value()
            );
        }
        DomHandler.clearSelection();
    }

    onDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

@Component({
    selector: 'h-tableHeaderCheckbox',
    standalone: false,
    template: `
        <h-checkbox [pt]="ptm('pcCheckbox')" [(ngModel)]="checked" (onChange)="onClick($event)" [binary]="true" [disabled]="isDisabled()" [inputId]="inputId()" [name]="name()" [ariaLabel]="ariaLabel()" [unstyled]="unstyled()">
            @if (dataTable.headerCheckboxIconTemplate || dataTable._headerCheckboxIconTemplate(); as template) {
                <ng-template hTemplate="icon">
                    <ng-template *ngTemplateOutlet="template; context: { $implicit: checked }" />
                </ng-template>
            }
        </h-checkbox>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    hostDirectives: [Bind]
})
export class TableHeaderCheckbox extends BaseComponent {
    hostName = 'Table';

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('headerCheckbox'));
    }

    readonly disabled = input<boolean | undefined, unknown>(undefined, { transform: booleanAttribute });
    readonly inputId = input<string | undefined>();
    readonly name = input<string | undefined>();

    readonly ariaLabel = model<string | undefined>(undefined);

    checked: boolean | undefined;

    selectionChangeSubscription: Subscription;

    valueChangeSubscription: Subscription;

    constructor(
        public dataTable: Table,
        public tableService: TableService
    ) {
        super();
        this.valueChangeSubscription = this.dataTable.tableService.valueSource$.subscribe(() => {
            this.checked = this.updateCheckedState();
            this.ariaLabel.set(this.ariaLabel() || (this.dataTable.config.translation.aria ? (this.checked ? this.dataTable.config.translation.aria.selectAll : this.dataTable.config.translation.aria.unselectAll) : undefined));
        });

        this.selectionChangeSubscription = this.dataTable.tableService.selectionSource$.subscribe(() => {
            this.checked = this.updateCheckedState();
        });
    }

    onInit() {
        this.checked = this.updateCheckedState();
    }

    onClick(event: CheckboxChangeEvent) {
        if (!this.disabled()) {
                if (this.dataTable.value() && this.dataTable.value().length > 0) {
                this.dataTable.toggleRowsWithCheckbox(event, this.checked || false);
            }
        }

        DomHandler.clearSelection();
    }

    isDisabled() {
        return this.disabled() || !this.dataTable.value() || !this.dataTable.value().length;
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

        if (this.dataTable.selectAll() !== null) {
            return this.dataTable.selectAll();
        } else {
            const data = this.dataTable.selectionPageOnly() ? this.dataTable.dataToRender(this.dataTable.processedData) : this.dataTable.processedData;
            const frozenVal = this.dataTable.frozenValue();
            const val = frozenVal ? [...frozenVal, ...data] : data;
            const selection = this.dataTable.selection();
            const selectableVal = this.dataTable.rowSelectable() ? val.filter((data: any, index: number) => this.dataTable.rowSelectable()({ data, index })) : val;

            return ObjectUtils.isNotEmpty(selectableVal) && ObjectUtils.isNotEmpty(selection) && selectableVal.every((v: any) => selection.some((s: any) => this.dataTable.equals(v, s)));
        }
    }
}

@Directive({
    selector: '[hReorderableRowHandle]',
    standalone: false,
    host: {
        '[class]': "cx('reorderableRowHandle')"
    },
    providers: [TableStyle],
    hostDirectives: [Bind]
})
export class ReorderableRowHandle extends BaseComponent {
    hostName = 'Table';

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('reorderableRowHandle'));
    }

    _componentStyle = inject(TableStyle);

    constructor(public el: ElementRef) {
        super();
    }

    onAfterViewInit() {
        // DomHandler.addClass(this.el.nativeElement, 'p-datatable-reorderable-row-handle');
    }
}

@Directive({
    selector: '[hReorderableRow]',
    standalone: false,
    host: {
        '(drop)': 'onDrop($event)'
    },
    hostDirectives: [Bind]
})
export class ReorderableRow extends BaseComponent {
    hostName = 'Table';

    bindDirectiveInstance = inject(Bind, { self: true });

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('reorderableRow'));
    }

    readonly index = input<number>(undefined, { alias: "hReorderableRow" });

    readonly pReorderableRowDisabled = input<boolean, unknown>(undefined, { transform: booleanAttribute });

    mouseDownListener: VoidListener;

    dragStartListener: VoidListener;

    dragEndListener: VoidListener;

    dragOverListener: VoidListener;

    dragLeaveListener: VoidListener;

    dropListener: VoidListener;

    constructor(
        public dataTable: Table,
        public zone: NgZone
    ) {
        super();
    }

    onAfterViewInit() {
        if (this.isEnabled()) {
            this.el.nativeElement.droppable = true;
            this.bindEvents();
        }
    }

    bindEvents() {
        this.zone.runOutsideAngular(() => {
            this.mouseDownListener = this.renderer.listen(this.el.nativeElement, 'mousedown', this.onMouseDown.bind(this));

            this.dragStartListener = this.renderer.listen(this.el.nativeElement, 'dragstart', this.onDragStart.bind(this));

            this.dragEndListener = this.renderer.listen(this.el.nativeElement, 'dragend', this.onDragEnd.bind(this));

            this.dragOverListener = this.renderer.listen(this.el.nativeElement, 'dragover', this.onDragOver.bind(this));

            this.dragLeaveListener = this.renderer.listen(this.el.nativeElement, 'dragleave', this.onDragLeave.bind(this));
        });
    }

    unbindEvents() {
        if (this.mouseDownListener) {
            this.mouseDownListener();
            this.mouseDownListener = null;
        }

        if (this.dragStartListener) {
            this.dragStartListener();
            this.dragStartListener = null;
        }

        if (this.dragEndListener) {
            this.dragEndListener();
            this.dragEndListener = null;
        }

        if (this.dragOverListener) {
            this.dragOverListener();
            this.dragOverListener = null;
        }

        if (this.dragLeaveListener) {
            this.dragLeaveListener();
            this.dragLeaveListener = null;
        }
    }

    onMouseDown(event: Event) {
        const targetElement = event.target as HTMLElement;
        const isHandleClicked = this.isHandleElement(targetElement);
        this.el.nativeElement.draggable = isHandleClicked;
    }

    isHandleElement(element: HTMLElement): boolean {
        if (element?.classList.contains('p-datatable-reorderable-row-handle')) {
            return true;
        }

        if (element?.parentElement && !['TD', 'TR'].includes(element?.parentElement?.tagName)) {
            return this.isHandleElement(element?.parentElement);
        }

        return false;
    }

    onDragStart(event: DragEvent) {
        this.dataTable.onRowDragStart(event, <number>this.index());
    }

    onDragEnd(event: DragEvent) {
        this.dataTable.onRowDragEnd(event);
        this.el.nativeElement.draggable = false;
    }

    onDragOver(event: DragEvent) {
        this.dataTable.onRowDragOver(event, <number>this.index(), this.el.nativeElement);
        event.preventDefault();
    }

    onDragLeave(event: DragEvent) {
        this.dataTable.onRowDragLeave(event, this.el.nativeElement);
    }

    isEnabled() {
        return this.pReorderableRowDisabled() !== true;
    }

    onDrop(event: DragEvent) {
        if (this.isEnabled() && this.dataTable.rowDragging) {
            this.dataTable.onRowDrop(event, this.el.nativeElement);
        }

        event.preventDefault();
    }

    onDestroy() {
        this.unbindEvents();
    }
}
/**
 * Column Filter Component.
 * @group Components
 */
@Component({
    selector: 'h-columnFilter, h-column-filter, h-columnfilter',
    standalone: false,
    templateUrl: './columnfilter.html',
    providers: [TableStyle],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    hostDirectives: [Bind]
})
export class ColumnFilter extends BaseComponent {
    hostName = 'Table';

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TableStyle);

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('columnFilter'));
    }

    ptmFilterConstraintOptions(matchMode) {
        return {
            context: {
                highlighted: matchMode && this.isRowMatchModeSelected(matchMode.value)
            }
        };
    }
    /**
     * Property represented by the column.
     * @group Props
     */
    readonly field = input<string>();
    /**
     * Type of the input.
     * @group Props
     */
    readonly type = input<string>('text');
    /**
     * Filter display.
     * @group Props
     */
    readonly display = input<string>('row');
    /**
     * Decides whether to display filter menu popup.
     * @group Props
     */
    readonly showMenu = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Filter match mode.
     * @group Props
     */
    readonly matchMode = input<string>();
    /**
     * Filter operator.
     * @defaultValue 'AND'
     * @group Props
     */
    readonly operator = model<string>(FilterOperator.AND);
    /**
     * Decides whether to display filter operator.
     * @group Props
     */
    readonly showOperator = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Decides whether to display clear filter button when display is menu.
     * @defaultValue true
     * @group Props
     */
    readonly showClearButton = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Decides whether to display apply filter button when display is menu.
     * @group Props
     */
    readonly showApplyButton = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Decides whether to display filter match modes when display is menu.
     * @group Props
     */
    readonly showMatchModes = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Decides whether to display add filter button when display is menu.
     * @group Props
     */
    readonly showAddButton = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Decides whether to close popup on clear button click.
     * @group Props
     */
    readonly hideOnClear = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Filter placeholder.
     * @group Props
     */
    readonly placeholder = input<string>();
    /**
     * Filter match mode options.
     * @group Props
     */
    readonly matchModeOptions = input<SelectItem[]>();
    /**
     * Defines maximum amount of constraints.
     * @group Props
     */
    readonly maxConstraints = input<number, unknown>(2, { transform: numberAttribute });
    /**
     * Defines minimum fraction of digits.
     * @group Props
     */
    readonly minFractionDigits = input<number, unknown>(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });
    /**
     * Defines maximum fraction of digits.
     * @group Props
     */
    readonly maxFractionDigits = input<number, unknown>(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });
    /**
     * Defines prefix of the filter.
     * @group Props
     */
    readonly prefix = input<string>();
    /**
     * Defines suffix of the filter.
     * @group Props
     */
    readonly suffix = input<string>();
    /**
     * Defines filter locale.
     * @group Props
     */
    readonly locale = input<string>();
    /**
     * Defines filter locale matcher.
     * @group Props
     */
    readonly localeMatcher = input<string>();
    /**
     * Enables currency input.
     * @group Props
     */
    readonly currency = input<string>();
    /**
     * Defines the display of the currency input.
     * @group Props
     */
    readonly currencyDisplay = input<string>();
    /**
     * Default trigger to run filtering on built-in text and numeric filters, valid values are 'enter' and 'input'.
     * @defaultValue enter
     * @group Props
     */
    readonly filterOn = input<string | undefined>('enter');
    /**
     * Defines if filter grouping will be enabled.
     * @group Props
     */
    readonly useGrouping = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Defines the visibility of buttons.
     * @group Props
     */
    readonly showButtons = input<boolean, unknown>(true, { transform: booleanAttribute });
    /**
     * Defines the aria-label of the form element.
     * @group Props
     */
    readonly ariaLabel = input<string>();
    /**
     * Used to pass all filter button property object
     * @defaultValue {
     filter: { severity: 'secondary', text: true, rounded: true },
     inline: {
        clear: { severity: 'secondary', text: true, rounded: true }
     },
     popover: {
         addRule: { severity: 'info', text: true, size: 'small' },
         removeRule: { severity: 'danger', text: true, size: 'small' },
         apply: { size: 'small' },
         clear: { outlined: true, size: 'small' }
        }
     }
     @group Props
     */
    readonly filterButtonProps = input<TableFilterButtonPropsOptions>({
    filter: { severity: 'secondary', text: true, rounded: true },
    inline: {
        clear: { severity: 'secondary', text: true, rounded: true }
    },
    popover: {
        addRule: { severity: 'info', text: true, size: 'small' },
        removeRule: { severity: 'danger', text: true, size: 'small' },
        apply: { size: 'small' },
        clear: { outlined: true, size: 'small' }
    }
});
    motionOptions = input<MotionOptions | undefined>(undefined);

    computedMotionOptions = computed<MotionOptions>(() => {
        return {
            ...this.ptm('motion'),
            ...this.motionOptions()
        };
    });
    /**
     * Callback to invoke on overlay is shown.
     * @param {AnimationEvent} originalEvent - animation event.
     * @group Emits
     */
    readonly onShow = output<{
    originalEvent: AnimationEvent;
}>();
    /**
     * Callback to invoke on overlay is hidden.
     * @param {AnimationEvent} originalEvent - animation event.
     * @group Emits
     */
    readonly onHide = output<{
    originalEvent: AnimationEvent;
}>();

    readonly icon = viewChild(Button, { read: ElementRef });

    readonly clearButtonViewChild = viewChild<Nullable<ElementRef>>('clearBtn');

    readonly _templates = contentChildren(PrimeTemplate);

    overlaySubscription: Subscription | undefined;

    renderOverlay = signal<boolean>(false);

    /**
     * Custom header template.
     * @group Templates
     */
    readonly headerTemplate = contentChild.required<TemplateRef<any>>('header', { descendants: false });
    _headerTemplate: Nullable<TemplateRef<any>>;

    /**
     * Custom filter template.
     * @group Templates
     */
    readonly filterTemplate = contentChild.required<TemplateRef<any>>('filter', { descendants: false });
    _filterTemplate: Nullable<TemplateRef<any>>;

    /**
     * Custom footer template.
     * @group Templates
     */
    readonly footerTemplate = contentChild.required<TemplateRef<any>>('footer', { descendants: false });
    _footerTemplate: Nullable<TemplateRef<any>>;
    /**
     * Custom filter icon template.
     * @group Templates
     */
    readonly filterIconTemplate = contentChild<TemplateRef<any>>('filtericon', { descendants: false });
    _filterIconTemplate: Nullable<TemplateRef<any>>;

    /**
     * Custom remove rule button icon template.
     * @group Templates
     */
    readonly removeRuleIconTemplate = contentChild.required<TemplateRef<any>>('removeruleicon', { descendants: false });
    _removeRuleIconTemplate: Nullable<TemplateRef<any>>;

    /**
     * Custom add rule button icon template.
     * @group Templates
     */
    readonly addRuleIconTemplate = contentChild.required<TemplateRef<any>>('addruleicon', { descendants: false });
    _addRuleIconTemplate: Nullable<TemplateRef<any>>;

    readonly clearFilterIconTemplate = contentChild.required<TemplateRef<any>>('clearfiltericon', { descendants: false });
    _clearFilterIconTemplate: Nullable<TemplateRef<any>>;

    operatorOptions: any[] | undefined;

    overlayVisible: boolean | undefined;

    overlay: HTMLElement | undefined | null;

    scrollHandler: ConnectedOverlayScrollHandler | null | undefined;

    documentClickListener: VoidListener;

    documentResizeListener: VoidListener;

    matchModes: SelectItem[] | undefined;

    translationSubscription: Subscription | undefined;

    resetSubscription: Subscription | undefined;

    selfClick: boolean | undefined;

    overlayEventListener: any;

    overlayId: any;

    get fieldConstraints(): FilterMetadata[] | undefined | null {
        return this.dataTable.filters ? <FilterMetadata[]>this.dataTable.filters[<string>this.field()] : null;
    }

    get showRemoveIcon(): boolean {
        return this.fieldConstraints ? this.fieldConstraints.length > 1 : false;
    }

    get showMenuButton(): boolean {
        return this.showMenu() && (this.display() === 'row' ? this.type() !== 'boolean' : true);
    }

    get isShowOperator(): boolean {
        return this.showOperator() && this.type() !== 'boolean';
    }

    get isShowAddConstraint(): boolean | undefined | null {
        return this.showAddButton() && this.type() !== 'boolean' && this.fieldConstraints && this.fieldConstraints.length < this.maxConstraints();
    }

    get showMenuButtonLabel() {
        return this.config.getTranslation(TranslationKeys.SHOW_FILTER_MENU);
    }

    get applyButtonLabel(): string {
        return this.config.getTranslation(TranslationKeys.APPLY);
    }

    get clearButtonLabel(): string {
        return this.config.getTranslation(TranslationKeys.CLEAR);
    }

    get addRuleButtonLabel(): string {
        return this.config.getTranslation(TranslationKeys.ADD_RULE);
    }

    get removeRuleButtonLabel(): string {
        return this.config.getTranslation(TranslationKeys.REMOVE_RULE);
    }

    get noFilterLabel(): string {
        return this.config.getTranslation(TranslationKeys.NO_FILTER);
    }

    get filterMenuButtonAriaLabel() {
        return this.config?.translation ? (this.overlayVisible ? this.config?.translation?.aria?.hideFilterMenu : this.config?.translation?.aria?.showFilterMenu) : undefined;
    }

    get removeRuleButtonAriaLabel() {
        return this.config?.translation ? this.config?.translation?.removeRule : undefined;
    }

    get filterOperatorAriaLabel() {
        return this.config?.translation ? this.config?.translation?.aria?.filterOperator : undefined;
    }

    get filterConstraintAriaLabel() {
        return this.config?.translation ? this.config?.translation?.aria?.filterConstraint : undefined;
    }

    dataTable = inject(Table);

    overlayService = inject(OverlayService);

    onInit() {
        this.overlayId = UniqueComponentId();
        if (!this.dataTable.filters[<string>this.field()]) {
            this.initFieldFilterConstraint();
        }

        this.translationSubscription = this.config.translationObserver.subscribe(() => {
            this.generateMatchModeOptions();
            this.generateOperatorOptions();
        });

        this.generateMatchModeOptions();
        this.generateOperatorOptions();
    }

    generateMatchModeOptions() {
        this.matchModes =
            this.matchModeOptions() ||
            (this.config as any).filterMatchModeOptions[this.type()]?.map((key: any) => {
                return {
                    label: this.config.getTranslation(key),
                    value: key
                };
            });
    }

    generateOperatorOptions() {
        this.operatorOptions = [
            {
                label: this.config.getTranslation(TranslationKeys.MATCH_ALL),
                value: FilterOperator.AND
            },
            {
                label: this.config.getTranslation(TranslationKeys.MATCH_ANY),
                value: FilterOperator.OR
            }
        ];
    }

    onAfterContentInit() {
        this._templates().forEach((item) => {
            switch (item.getType()) {
                case 'header':
                    this._headerTemplate = item.template;
                    break;

                case 'filter':
                    this._filterTemplate = item.template;
                    break;

                case 'footer':
                    this._footerTemplate = item.template;
                    break;

                case 'filtericon':
                    this._filterIconTemplate = item.template;
                    break;

                case 'clearfiltericon':
                    this._clearFilterIconTemplate = item.template;
                    break;

                case 'removeruleicon':
                    this._removeRuleIconTemplate = item.template;
                    break;

                case 'addruleicon':
                    this._addRuleIconTemplate = item.template;
                    break;

                default:
                    this._filterTemplate = item.template;
                    break;
            }
        });
    }

    initFieldFilterConstraint() {
        let defaultMatchMode = this.getDefaultMatchMode();
        this.dataTable.filters[<string>this.field()] =
            this.display() == 'row'
                ? { value: null, matchMode: defaultMatchMode }
                : [
                      {
                          value: null,
                          matchMode: defaultMatchMode,
                          operator: this.operator()
                      }
                  ];
    }

    onMenuMatchModeChange(value: any, filterMeta: FilterMetadata) {
        filterMeta.matchMode = value;

        if (!this.showApplyButton()) {
            this.dataTable._filter();
        }
    }

    onRowMatchModeChange(matchMode: string) {
        const fieldFilter = <FilterMetadata>this.dataTable.filters[<string>this.field()];
        fieldFilter.matchMode = matchMode;

        if (fieldFilter.value) {
            this.dataTable._filter();
        }

        this.hide();
    }

    onRowMatchModeKeyDown(event: KeyboardEvent) {
        let item = <HTMLLIElement>event.target;

        switch (event.key) {
            case 'ArrowDown':
                var nextItem = this.findNextItem(item);
                if (nextItem) {
                    item.removeAttribute('tabindex');
                    nextItem.tabIndex = '0';
                    nextItem.focus();
                }

                event.preventDefault();
                break;

            case 'ArrowUp':
                var prevItem = this.findPrevItem(item);
                if (prevItem) {
                    item.removeAttribute('tabindex');
                    prevItem.tabIndex = '0';
                    prevItem.focus();
                }

                event.preventDefault();
                break;
        }
    }

    onRowClearItemClick() {
        this.clearFilter();
        this.hide();
    }

    isRowMatchModeSelected(matchMode: string) {
        return (<FilterMetadata>this.dataTable.filters[<string>this.field()]).matchMode === matchMode;
    }

    addConstraint() {
        (<FilterMetadata[]>this.dataTable.filters[<string>this.field()]).push({
            value: null,
            matchMode: this.getDefaultMatchMode(),
            operator: this.getDefaultOperator()
        });
        DomHandler.focus(this.clearButtonViewChild()?.nativeElement);
    }

    removeConstraint(filterMeta: FilterMetadata) {
        this.dataTable.filters[<string>this.field()] = (<FilterMetadata[]>this.dataTable.filters[<string>this.field()]).filter((meta) => meta !== filterMeta);
        if (!this.showApplyButton()) {
            this.dataTable._filter();
        }
        DomHandler.focus(this.clearButtonViewChild()?.nativeElement);
    }

    onOperatorChange(value: any) {
        (<FilterMetadata[]>this.dataTable.filters[<string>this.field()]).forEach((filterMeta) => {
            filterMeta.operator = value;
            this.operator.set(value);
        });

        if (!this.showApplyButton()) {
            this.dataTable._filter();
        }
    }

    toggleMenu(event: Event) {
        this.overlayVisible = !this.overlayVisible;
        this.renderOverlay.set(!this.renderOverlay());
        event.stopPropagation();
    }

    onToggleButtonKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Escape':
            case 'Tab':
                this.overlayVisible = false;
                break;

            case 'ArrowDown':
                if (this.overlayVisible) {
                    let focusable = DomHandler.getFocusableElements(<HTMLElement>this.overlay);
                    if (focusable) {
                        focusable[0].focus();
                    }
                    event.preventDefault();
                } else if (event.altKey) {
                    this.overlayVisible = true;
                    event.preventDefault();
                }
                break;
            case 'Enter':
                this.toggleMenu(event);
                event.preventDefault();
                break;
        }
    }

    onEscape() {
        this.overlayVisible = false;
        this.icon()?.nativeElement.focus();
    }

    findNextItem(item: HTMLLIElement): any {
        let nextItem = <HTMLLIElement>item.nextElementSibling;

        if (nextItem) return find(nextItem, '[data-pc-section="filterconstraintseparator"]') ? this.findNextItem(nextItem) : nextItem;
        else return item.parentElement?.firstElementChild;
    }

    findPrevItem(item: HTMLLIElement): any {
        let prevItem = <HTMLLIElement>item.previousElementSibling;

        if (prevItem) return find(prevItem, '[data-pc-section="filterconstraintseparator"]') ? this.findPrevItem(prevItem) : prevItem;
        else return item.parentElement?.lastElementChild;
    }

    onContentClick() {
        this.selfClick = true;
    }

    onOverlayBeforeEnter(event: MotionEvent) {
        this.overlay = event.element as HTMLElement;
        if (this.overlay && this.overlay.parentElement !== this.document.body) {
            const buttonEl = <HTMLButtonElement>findSingle(this.el.nativeElement, '[data-pc-name="pccolumnfilterbutton"]');
            appendChild(this.document.body, this.overlay);
            addStyle(this.overlay!, { position: 'absolute', top: '0' });
            absolutePosition(this.overlay, buttonEl);
            ZIndexUtils.set('overlay', this.overlay, this.config.zIndex.overlay);
        }

        this.bindDocumentClickListener();
        this.bindDocumentResizeListener();
        this.bindScrollListener();

        this.overlayEventListener = (e: any) => {
            if (this.overlay && this.overlay.contains(e.target)) {
                this.selfClick = true;
            }
        };

        this.overlaySubscription = this.overlayService.clickObservable.subscribe(this.overlayEventListener);

        this.onShow.emit({ originalEvent: event as any });
        this.focusOnFirstElement();
    }

    onOverlayAnimationAfterLeave(event: MotionEvent) {
        this.restoreOverlayAppend();
        this.onOverlayHide();
        this.renderOverlay.set(false);
        if (this.overlaySubscription) {
            this.overlaySubscription.unsubscribe();
        }
        ZIndexUtils.clear(this.overlay);

        this.onHide.emit({ originalEvent: event as any });
    }

    restoreOverlayAppend() {
        if (this.overlay) {
            this.el.nativeElement.appendChild(this.overlay!);
        }
    }

    focusOnFirstElement() {
        if (this.overlay) {
            DomHandler.focus(DomHandler.getFirstFocusableElement(this.overlay, ''));
        }
    }

    getDefaultMatchMode(): string {
        const matchMode = this.matchMode();
        if (matchMode) {
            return matchMode;
        } else {
            const type = this.type();
            if (type === 'text') return FilterMatchMode.STARTS_WITH;
            else if (type === 'numeric') return FilterMatchMode.EQUALS;
            else if (type === 'date') return FilterMatchMode.DATE_IS;
            else return FilterMatchMode.CONTAINS;
        }
    }

    getDefaultOperator(): string | undefined {
        return this.dataTable.filters ? (<FilterMetadata[]>this.dataTable.filters[<string>(<string>this.field())])[0].operator : this.operator();
    }

    hasRowFilter() {
        return this.dataTable.filters[<string>this.field()] && !this.dataTable.isFilterBlank((<FilterMetadata>this.dataTable.filters[<string>this.field()]).value);
    }

    get hasFilter(): boolean {
        let fieldFilter = this.dataTable.filters[<string>this.field()];
        if (fieldFilter) {
            if (Array.isArray(fieldFilter)) return !this.dataTable.isFilterBlank((<FilterMetadata[]>fieldFilter)[0].value);
            else return !this.dataTable.isFilterBlank(fieldFilter.value);
        }

        return false;
    }

    isOutsideClicked(event: any): boolean {
        const icon = this.icon();
        return !(
            findSingle((this.overlay as HTMLElement).nextElementSibling!, '[data-pc-section="filteroverlay"]') ||
            findSingle((this.overlay as HTMLElement).nextElementSibling!, '[data-pc-name="popover"]') ||
            this.overlay?.isSameNode(event.target) ||
            this.overlay?.contains(event.target) ||
            icon?.nativeElement.isSameNode(event.target) ||
            icon?.nativeElement.contains(event.target) ||
            findSingle(event.target, '[data-pc-name="pcaddrulebuttonlabel"]') ||
            findSingle(event.target.parentElement, '[data-pc-name="pcaddrulebuttonlabel"]') ||
            findSingle(event.target, '[data-pc-name="pcfilterremoverulebutton"]') ||
            findSingle(event.target.parentElement, '[data-pc-name="pcfilterremoverulebutton"]')
        );
    }

    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            const documentTarget: any = this.el ? this.el.nativeElement.ownerDocument : 'document';

            this.documentClickListener = this.renderer.listen(documentTarget, 'mousedown', (event) => {
                const dialogElements = document.querySelectorAll('[role="dialog"]');
                const targetIsColumnFilterMenuButton = event.target.closest('[data-pc-name="pccolumnfilterbutton"]');
                if (this.overlayVisible && this.isOutsideClicked(event) && (targetIsColumnFilterMenuButton || dialogElements?.length <= 1)) {
                    this.hide();
                }

                this.selfClick = false;
            });
        }
    }

    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
            this.selfClick = false;
        }
    }

    bindDocumentResizeListener() {
        if (!this.documentResizeListener) {
            this.documentResizeListener = this.renderer.listen(this.document.defaultView, 'resize', (event) => {
                if (this.overlayVisible && !DomHandler.isTouchDevice()) {
                    this.hide();
                }
            });
        }
    }

    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }

    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.icon()?.nativeElement, () => {
                if (this.overlayVisible) {
                    this.hide();
                }
            });
        }

        this.scrollHandler.bindScrollListener();
    }

    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }

    hide() {
        this.overlayVisible = false;
        this.cd.markForCheck();
    }

    onOverlayHide() {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
        this.overlay = null;
    }

    clearFilter() {
        this.initFieldFilterConstraint();
        this.dataTable._filter();
        if (this.hideOnClear()) this.hide();
    }

    applyFilter() {
        this.dataTable._filter();
        this.hide();
    }

    onDestroy() {
        if (this.overlay) {
            this.restoreOverlayAppend();
            ZIndexUtils.clear(this.overlay);
            this.onOverlayHide();
        }

        if (this.translationSubscription) {
            this.translationSubscription.unsubscribe();
        }

        if (this.resetSubscription) {
            this.resetSubscription.unsubscribe();
        }

        if (this.overlaySubscription) {
            this.overlaySubscription.unsubscribe();
        }
    }
}

@Component({
    selector: 'h-columnFilterFormElement',
    standalone: false,
    templateUrl: './columnfilterformelement.html',
    providers: [TableStyle],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    hostDirectives: [Bind]
})
export class ColumnFilterFormElement extends BaseComponent<ColumnFilterPassThrough> {
    hostName = 'Table';

    bindDirectiveInstance = inject(Bind, { self: true });

    _componentStyle = inject(TableStyle);

    onAfterViewChecked(): void {
        this.bindDirectiveInstance.setAttrs(this.ptm('columnFilterFormElement'));
    }

    readonly field = input<string>();

    readonly type = input<string>();

    readonly filterConstraint = input<FilterMetadata>();

    readonly filterTemplate = input<Nullable<TemplateRef<any>>>(undefined);

    readonly placeholder = input<string>();

    readonly minFractionDigits = input<number, unknown>(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });

    readonly maxFractionDigits = input<number, unknown>(undefined, { transform: (value: unknown) => numberAttribute(value, undefined) });

    readonly prefix = input<string>();

    readonly suffix = input<string>();

    readonly locale = input<string>();

    readonly localeMatcher = input<string>();

    readonly currency = input<string>();

    readonly currencyDisplay = input<string>();

    readonly useGrouping = input<boolean, unknown>(true, { transform: booleanAttribute });

    readonly ariaLabel = input<string>();

    readonly filterOn = input<string>();

    get showButtons(): boolean {
        return this.colFilter.showButtons();
    }

    filterCallback: any;

    constructor(
        public dataTable: Table,
        private colFilter: ColumnFilter
    ) {
        super();
    }

    onInit() {
        this.filterCallback = (value: any) => {
            (<any>this.filterConstraint()).value = value;
            this.dataTable._filter();
        };
    }

    onModelChange(value: any) {
        (<any>this.filterConstraint()).value = value;

        const type = this.type();
        if (type === 'date' || type === 'boolean' || ((type === 'text' || type === 'numeric') && this.filterOn() === 'input') || !value) {
            this.dataTable._filter();
        }
    }

    onTextInputEnterKeyDown(event: KeyboardEvent) {
        this.dataTable._filter();
        event.preventDefault();
    }

    onNumericInputKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.dataTable._filter();
            event.preventDefault();
        }
    }
}

@NgModule({
    imports: [
        CommonModule,
        PaginatorModule,
        InputTextModule,
        SelectModule,
        FormsModule,
        ButtonModule,
        SelectButtonModule,
        DatePickerModule,
        InputNumberModule,
        BadgeModule,
        CheckboxModule,
        ScrollerModule,
        ArrowDownIcon,
        ArrowUpIcon,
        SpinnerIcon,
        SortAltIcon,
        SortAmountUpAltIcon,
        SortAmountDownIcon,
        FilterIcon,
        FilterFillIcon,
        FilterSlashIcon,
        PlusIcon,
        TrashIcon,
        RadioButtonModule,
        BindModule,
        MotionModule
    ],
    exports: [
        Table,
        SharedModule,
        SortableColumn,
        FrozenColumn,
        RowGroupHeader,
        SelectableRow,
        RowToggler,
        ContextMenuRow,
        ResizableColumn,
        ReorderableColumn,
        EditableColumn,
        CellEditor,
        SortIcon,
        TableRadioButton,
        TableCheckbox,
        TableHeaderCheckbox,
        ReorderableRowHandle,
        ReorderableRow,
        SelectableRowDblClick,
        EditableRow,
        InitEditableRow,
        SaveEditableRow,
        CancelEditableRow,
        ColumnFilter,
        ColumnFilterFormElement,
        ScrollerModule
    ],
    declarations: [
        Table,
        SortableColumn,
        FrozenColumn,
        RowGroupHeader,
        SelectableRow,
        RowToggler,
        ContextMenuRow,
        ResizableColumn,
        ReorderableColumn,
        EditableColumn,
        CellEditor,
        TableBody,
        SortIcon,
        TableRadioButton,
        TableCheckbox,
        TableHeaderCheckbox,
        ReorderableRowHandle,
        ReorderableRow,
        SelectableRowDblClick,
        EditableRow,
        InitEditableRow,
        SaveEditableRow,
        CancelEditableRow,
        ColumnFilter,
        ColumnFilterFormElement
    ],
    providers: [TableStyle]
})
export class TableModule {}
