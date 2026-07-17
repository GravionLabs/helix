# Table

> Table displays data in tabular format.

## Import

```ts
import { Table, TableBody, RowGroupHeader } from '@gravionlabs/helix/table';
```

## Components

### Table

Selector: `h-table`

Table displays data in tabular format.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `frozenColumns` | `any[] \| undefined` | — | An array of objects to represent dynamic columns that are frozen. |
| `frozenValue` | `any[] \| undefined` | — | An array of objects to display as frozen. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `tableStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the table. |
| `tableStyleClass` | `string \| undefined` | — | Style class of the table. |
| `paginator` | `boolean \| undefined` | — | When specified as true, enables the pagination. |
| `pageLinks` | `number` | `5` | Number of page links to display in paginator. |
| `rowsPerPageOptions` | `any[] \| undefined` | — | Array of integer/object values to display inside rows per page dropdown of paginator |
| `alwaysShowPaginator` | `boolean` | `true` | Whether to show it even there is only one page. |
| `paginatorPosition` | `'top' \| 'bottom' \| 'both'` | `'bottom'` | Position of the paginator, options are "top", "bottom" or "both". |
| `paginatorStyleClass` | `string \| undefined` | — | Custom style class for paginator |
| `paginatorDropdownAppendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| string \| null \| undefined \| any` | — | Target element to attach the paginator dropdown overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `paginatorDropdownScrollHeight` | `string` | `'200px'` | Paginator dropdown height of the viewport in pixels, a scrollbar is defined if height of list exceeds this value. |
| `currentPageReportTemplate` | `string` | `'{currentPage} of {totalPages}'` | Template of the current page report element. Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords} |
| `showCurrentPageReport` | `boolean \| undefined` | — | Whether to display current page report. |
| `showJumpToPageDropdown` | `boolean \| undefined` | — | Whether to display a dropdown to navigate to any page. |
| `showJumpToPageInput` | `boolean \| undefined` | — | Whether to display a input to navigate to any page. |
| `showFirstLastIcon` | `boolean` | `true` | When enabled, icons are displayed on paginator to go first and last page. |
| `showPageLinks` | `boolean` | `true` | Whether to show page links. |
| `defaultSortOrder` | `number` | `1` | Sort order to use when an unsorted column gets sorted by user interaction. |
| `sortMode` | `'single' \| 'multiple'` | `'single'` | Defines whether sorting works on single column or on multiple columns. |
| `resetPageOnSort` | `boolean` | `true` | When true, resets paginator to first page after sorting. Available only when sortMode is set to single. |
| `selectionMode` | `'single' \| 'multiple' \| undefined \| null` | — | Specifies the selection mode, valid values are "single" and "multiple". |
| `selectionPageOnly` | `boolean \| undefined` | — | When enabled with paginator and checkbox selection mode, the select all checkbox in the header will select all rows on the current page. |
| `contextMenuSelection` | `any` | — | Selected row with a context menu. |
| `contextMenuSelectionMode` | `string` | `'separate'` | Defines the behavior of context menu selection, in "separate" mode context menu updates contextMenuSelection property whereas in joint mode selection property is used instead so that when row selection is enabled, both row selection and context menu selection use the same property. |
| `dataKey` | `string \| undefined` | — | A property to uniquely identify a record in data. |
| `metaKeySelection` | `boolean \| undefined` | `false` | Defines whether metaKey should be considered for the selection. On touch enabled devices, metaKeySelection is turned off automatically. |
| `rowSelectable` | `(row: { data: any; index: number }) =&gt; boolean \| undefined` | — | Defines if the row is selectable. |
| `rowTrackBy` | `Function` | `(index: number, item: any) =&gt; item` | Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity. |
| `lazy` | `boolean` | `false` | Defines if data is loaded and interacted with in lazy manner. |
| `lazyLoadOnInit` | `boolean` | `true` | Whether to call lazy loading on initialization. |
| `compareSelectionBy` | `'equals' \| 'deepEquals'` | `'deepEquals'` | Algorithm to define if a row is selected, valid values are "equals" that compares by reference and "deepEquals" that compares all fields. |
| `csvSeparator` | `string` | `','` | Character to use as the csv separator. |
| `exportFilename` | `string` | `'download'` | Name of the exported file. |
| `filters` | `{ [s: string]: FilterMetadata \| FilterMetadata[] }` | `{}` | An array of FilterMetadata objects to provide external filters. |
| `globalFilterFields` | `string[] \| undefined` | — | An array of fields as string to use in global filtering. |
| `filterDelay` | `number` | `300` | Delay in milliseconds before filtering the data. |
| `filterLocale` | `string \| undefined` | — | Locale to use in filtering. The default locale is the host environment's current locale. |
| `expandedRowKeys` | `{ [s: string]: boolean }` | `{}` | Map instance to keep the expanded rows where key of the map is the data key of the row. |
| `editingRowKeys` | `{ [s: string]: boolean }` | `{}` | Map instance to keep the rows being edited where key of the map is the data key of the row. |
| `rowExpandMode` | `'multiple' \| 'single'` | `'multiple'` | Whether multiple rows can be expanded at any time. Valid values are "multiple" and "single". |
| `scrollable` | `boolean \| undefined` | — | Enables scrollable tables. |
| `rowGroupMode` | `'subheader' \| 'rowspan' \| undefined` | — | Type of the row grouping, valid values are "subheader" and "rowspan". |
| `scrollHeight` | `string \| undefined` | — | Height of the scroll viewport in fixed pixels or the "flex" keyword for a dynamic size. |
| `virtualScroll` | `boolean \| undefined` | — | Whether the data should be loaded on demand during scroll. |
| `virtualScrollItemSize` | `number \| undefined` | — | Height of a row to use in calculations of virtual scrolling. |
| `virtualScrollOptions` | `ScrollerOptions \| undefined` | — | Whether to use the scroller feature. The properties of scroller component can be used like an object in it. |
| `virtualScrollDelay` | `number` | `250` | Threshold in milliseconds to delay lazy loading during scrolling. |
| `frozenWidth` | `string \| undefined` | — | Width of the frozen columns container. |
| `contextMenu` | `any` | — | Local ng-template varilable of a ContextMenu. |
| `resizableColumns` | `boolean \| undefined` | — | When enabled, columns can be resized using drag and drop. |
| `columnResizeMode` | `string` | `'fit'` | Defines whether the overall table width should change on column resize, valid values are "fit" and "expand". |
| `reorderableColumns` | `boolean \| undefined` | — | When enabled, columns can be reordered using drag and drop. |
| `loading` | `boolean \| undefined` | — | Displays a loader to indicate data load is in progress. |
| `loadingIcon` | `string \| undefined` | — | The icon to show while indicating data load is in progress. |
| `showLoader` | `boolean` | `true` | Whether to show the loading mask when loading property is true. |
| `rowHover` | `boolean \| undefined` | — | Adds hover effect to rows without the need for selectionMode. Note that tr elements that can be hovered need to have "p-selectable-row" class for rowHover to work. |
| `customSort` | `boolean \| undefined` | — | Whether to use the default sorting or a custom one using sortFunction. |
| `showInitialSortBadge` | `boolean` | `true` | Whether to use the initial sort badge or not. |
| `exportFunction` | `Function \| undefined` | — | Export function. |
| `exportHeader` | `string \| undefined` | — | Custom export header of the column to be exported as CSV. |
| `stateKey` | `string \| undefined` | — | Unique identifier of a stateful table to use in state storage. |
| `stateStorage` | `'session' \| 'local'` | `'session'` | Defines where a stateful table keeps its state, valid values are "session" for sessionStorage and "local" for localStorage. |
| `editMode` | `'cell' \| 'row'` | `'cell'` | Defines the editing mode, valid values are "cell" and "row". |
| `groupRowsBy` | `any` | — | Field name to use in row grouping. |
| `size` | `'small' \| 'large' \| undefined` | — | Defines the size of the table. |
| `showGridlines` | `boolean \| undefined` | — | Whether to show grid lines between cells. |
| `stripedRows` | `boolean \| undefined` | — | Whether to display rows with alternating colors. |
| `groupRowsByOrder` | `number` | `1` | Order to sort when default row grouping is enabled. |
| `responsiveLayout` | `string` | `'scroll'` | Defines the responsive mode, valid options are "stack" and "scroll". |
| `breakpoint` | `string` | `'960px'` | The breakpoint to define the maximum width boundary when using stack responsive layout. |
| `paginatorLocale` | `string \| undefined` | — | Locale to be used in paginator formatting. |
| `totalRecords` | `number` | `0` | Number of total records, defaults to length of value when not defined. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `contextMenuSelectionChange` | `EventEmitter&lt;any&gt;` | Callback to invoke on context menu selection change. |
| `selectAllChange` | `EventEmitter&lt;TableSelectAllChangeEvent&gt;` | Emits when the all of the items selected or unselected. |
| `selectionChange` | `EventEmitter&lt;any \| null&gt;` | Callback to invoke on selection changed. |
| `onRowSelect` | `EventEmitter&lt;TableRowSelectEvent&lt;RowData&gt;&gt;` | Callback to invoke when a row is selected. |
| `onRowUnselect` | `EventEmitter&lt;TableRowUnSelectEvent&lt;RowData&gt;&gt;` | Callback to invoke when a row is unselected. |
| `onPage` | `EventEmitter&lt;TablePageEvent&gt;` | Callback to invoke when pagination occurs. |
| `onSort` | `EventEmitter&lt;{ multisortmeta: SortMeta[] } \| any&gt;` | Callback to invoke when a column gets sorted. |
| `onFilter` | `EventEmitter&lt;TableFilterEvent&gt;` | Callback to invoke when data is filtered. |
| `onLazyLoad` | `EventEmitter&lt;TableLazyLoadEvent&gt;` | Callback to invoke when paging, sorting or filtering happens in lazy mode. |
| `onRowExpand` | `EventEmitter&lt;TableRowExpandEvent&lt;RowData&gt;&gt;` | Callback to invoke when a row is expanded. |
| `onRowCollapse` | `EventEmitter&lt;TableRowCollapseEvent&gt;` | Callback to invoke when a row is collapsed. |
| `onContextMenuSelect` | `EventEmitter&lt;TableContextMenuSelectEvent&lt;RowData&gt;&gt;` | Callback to invoke when a row is selected with right click. |
| `onColResize` | `EventEmitter&lt;TableColResizeEvent&gt;` | Callback to invoke when a column is resized. |
| `onColReorder` | `EventEmitter&lt;TableColumnReorderEvent&gt;` | Callback to invoke when a column is reordered. |
| `onRowReorder` | `EventEmitter&lt;TableRowReorderEvent&gt;` | Callback to invoke when a row is reordered. |
| `onEditInit` | `EventEmitter&lt;TableEditInitEvent&gt;` | Callback to invoke when a cell switches to edit mode. |
| `onEditComplete` | `EventEmitter&lt;TableEditCompleteEvent&gt;` | Callback to invoke when cell edit is completed. |
| `onEditCancel` | `EventEmitter&lt;TableEditCancelEvent&gt;` | Callback to invoke when cell edit is cancelled with escape key. |
| `onHeaderCheckboxToggle` | `EventEmitter&lt;TableHeaderCheckboxToggleEvent&gt;` | Callback to invoke when state of header checkbox changes. |
| `sortFunction` | `EventEmitter&lt;any&gt;` | A function to implement custom sorting, refer to sorting section for details. |
| `firstChange` | `EventEmitter&lt;number&gt;` | Callback to invoke on pagination. |
| `rowsChange` | `EventEmitter&lt;number&gt;` | Callback to invoke on rows change. |
| `onStateSave` | `EventEmitter&lt;TableState&gt;` | Callback to invoke table state is saved. |
| `onStateRestore` | `EventEmitter&lt;TableState&gt;` | Callback to invoke table state is restored. |

### TableBody

Selector: `[hTableBody]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `any[] \| undefined` | — | — |
| `template` | `Nullable&lt;TemplateRef&lt;any&gt;&gt;` | — | — |
| `frozen` | `boolean \| undefined` | — | — |
| `frozenRows` | `boolean \| undefined` | — | — |
| `scrollerOptions` | `any` | — | — |

### RowGroupHeader

Selector: `[hRowGroupHeader]`

### FrozenColumn

Selector: `[hFrozenColumn]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `alignFrozen` | `string` | `'left'` | — |

### SortableColumn

Selector: `[hSortableColumn]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `field` | `string \| undefined` | — | — |
| `pSortableColumnDisabled` | `boolean \| undefined` | — | — |

### SortIcon

Selector: `h-sortIcon`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `field` | `string \| undefined` | — | — |

### SelectableRow

Selector: `[hSelectableRow]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `any` | — | — |
| `index` | `number \| undefined` | — | — |
| `pSelectableRowDisabled` | `boolean \| undefined` | — | — |

### SelectableRowDblClick

Selector: `[hSelectableRowDblClick]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `any` | — | — |
| `index` | `number \| undefined` | — | — |
| `pSelectableRowDisabled` | `boolean \| undefined` | — | — |

### ContextMenuRow

Selector: `[hContextMenuRow]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `any` | — | — |
| `index` | `number \| undefined` | — | — |
| `pContextMenuRowDisabled` | `boolean \| undefined` | — | — |

### RowToggler

Selector: `[hRowToggler]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `any` | — | — |
| `pRowTogglerDisabled` | `boolean \| undefined` | — | — |

### ResizableColumn

Selector: `[hResizableColumn]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `pResizableColumnDisabled` | `boolean \| undefined` | — | — |

### ReorderableColumn

Selector: `[hReorderableColumn]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `pReorderableColumnDisabled` | `boolean \| undefined` | — | — |

### EditableColumn

Selector: `[hEditableColumn]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `any` | — | — |
| `field` | `any` | — | — |
| `rowIndex` | `number \| undefined` | — | — |
| `pEditableColumnDisabled` | `boolean \| undefined` | — | — |
| `pFocusCellSelector` | `string \| undefined` | — | — |

### EditableRow

Selector: `[hEditableRow]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `any` | — | — |
| `pEditableRowDisabled` | `boolean \| undefined` | — | — |

### InitEditableRow

Selector: `[hInitEditableRow]`

### SaveEditableRow

Selector: `[hSaveEditableRow]`

### CancelEditableRow

Selector: `[hCancelEditableRow]`

### CellEditor

Selector: `h-cellEditor`

### TableRadioButton

Selector: `h-tableRadioButton`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `any` | — | — |
| `disabled` | `boolean \| undefined` | `undefined` | — |
| `index` | `number \| undefined` | `undefined` | — |
| `inputId` | `string \| undefined` | — | — |
| `name` | `string \| undefined` | — | — |
| `ariaLabel` | `string \| undefined` | — | — |

### TableCheckbox

Selector: `h-tableCheckbox`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `any` | — | — |
| `disabled` | `boolean \| undefined` | `undefined` | — |
| `required` | `boolean \| undefined` | `undefined` | — |
| `index` | `number \| undefined` | `undefined` | — |
| `inputId` | `string \| undefined` | — | — |
| `name` | `string \| undefined` | — | — |
| `ariaLabel` | `string \| undefined` | — | — |

### TableHeaderCheckbox

Selector: `h-tableHeaderCheckbox`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean \| undefined` | `undefined` | — |
| `inputId` | `string \| undefined` | — | — |
| `name` | `string \| undefined` | — | — |
| `ariaLabel` | `string \| undefined` | — | — |

### ReorderableRowHandle

Selector: `[hReorderableRowHandle]`

### ReorderableRow

Selector: `[hReorderableRow]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number \| undefined` | — | — |
| `pReorderableRowDisabled` | `boolean \| undefined` | — | — |

### ColumnFilter

Selector: `h-columnFilter, h-column-filter, h-columnfilter`

Column Filter Component.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `field` | `string \| undefined` | — | Property represented by the column. |
| `type` | `string` | `'text'` | Type of the input. |
| `display` | `string` | `'row'` | Filter display. |
| `showMenu` | `boolean` | `true` | Decides whether to display filter menu popup. |
| `matchMode` | `string \| undefined` | — | Filter match mode. |
| `operator` | `string` | `FilterOperator.AND` | Filter operator. |
| `showOperator` | `boolean` | `true` | Decides whether to display filter operator. |
| `showClearButton` | `boolean` | `true` | Decides whether to display clear filter button when display is menu. |
| `showApplyButton` | `boolean` | `true` | Decides whether to display apply filter button when display is menu. |
| `showMatchModes` | `boolean` | `true` | Decides whether to display filter match modes when display is menu. |
| `showAddButton` | `boolean` | `true` | Decides whether to display add filter button when display is menu. |
| `hideOnClear` | `boolean` | `true` | Decides whether to close popup on clear button click. |
| `placeholder` | `string \| undefined` | — | Filter placeholder. |
| `matchModeOptions` | `SelectItem[] \| undefined` | — | Filter match mode options. |
| `maxConstraints` | `number` | `2` | Defines maximum amount of constraints. |
| `minFractionDigits` | `number \| undefined` | — | Defines minimum fraction of digits. |
| `maxFractionDigits` | `number \| undefined` | — | Defines maximum fraction of digits. |
| `prefix` | `string \| undefined` | — | Defines prefix of the filter. |
| `suffix` | `string \| undefined` | — | Defines suffix of the filter. |
| `locale` | `string \| undefined` | — | Defines filter locale. |
| `localeMatcher` | `string \| undefined` | — | Defines filter locale matcher. |
| `currency` | `string \| undefined` | — | Enables currency input. |
| `currencyDisplay` | `string \| undefined` | — | Defines the display of the currency input. |
| `filterOn` | `string \| undefined` | `'enter'` | Default trigger to run filtering on built-in text and numeric filters, valid values are 'enter' and 'input'. |
| `useGrouping` | `boolean` | `true` | Defines if filter grouping will be enabled. |
| `showButtons` | `boolean` | `true` | Defines the visibility of buttons. |
| `ariaLabel` | `string \| undefined` | — | Defines the aria-label of the form element. |
| `filterButtonProps` | `TableFilterButtonPropsOptions` | `{ filter: { severity: 'secondary', text: true, rounded: true }, inline: { clear: { severity: 'secondary', text: true, rounded: true } }, popover: { addRule: { severity: 'info', text: true, size: 'small' }, removeRule: { severity: 'danger', text: true, size: 'small' }, apply: { size: 'small' }, clear: { outlined: true, size: 'small' } } }` | Used to pass all filter button property object filter: { severity: 'secondary', text: true, rounded: true }, inline: { clear: { severity: 'secondary', text: true, rounded: true } }, popover: { addRule: { severity: 'info', text: true, size: 'small' }, removeRule: { severity: 'danger', text: true, size: 'small' }, apply: { size: 'small' }, clear: { outlined: true, size: 'small' } } } |
| `motionOptions` | `MotionOptions \| undefined` | `undefined` | — |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `onShow` | `EventEmitter&lt;{ originalEvent: AnimationEvent }&gt;` | Callback to invoke on overlay is shown. |
| `onHide` | `EventEmitter&lt;{ originalEvent: AnimationEvent }&gt;` | Callback to invoke on overlay is hidden. |

### ColumnFilterFormElement

Selector: `h-columnFilterFormElement`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `field` | `string \| undefined` | — | — |
| `type` | `string \| undefined` | — | — |
| `filterConstraint` | `FilterMetadata \| undefined` | — | — |
| `filterTemplate` | `Nullable&lt;TemplateRef&lt;any&gt;&gt;` | — | — |
| `placeholder` | `string \| undefined` | — | — |
| `minFractionDigits` | `number \| undefined` | — | — |
| `maxFractionDigits` | `number \| undefined` | — | — |
| `prefix` | `string \| undefined` | — | — |
| `suffix` | `string \| undefined` | — | — |
| `locale` | `string \| undefined` | — | — |
| `localeMatcher` | `string \| undefined` | — | — |
| `currency` | `string \| undefined` | — | — |
| `currencyDisplay` | `string \| undefined` | — | — |
| `useGrouping` | `boolean` | `true` | — |
| `ariaLabel` | `string \| undefined` | — | — |
| `filterOn` | `string \| undefined` | — | — |

## Services

### TableService

## Source

[`projects/helix/table`](../../projects/helix/table)
