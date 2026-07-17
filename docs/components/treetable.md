# TreeTable

> TreeTable is used to display hierarchical data in tabular format.

## Import

```ts
import { TreeTable, TTBody, TTScrollableView } from '@gravionlabs/helix/treetable';
```

## Components

### TreeTable

Selector: `h-treeTable, h-treetable, h-tree-table`

TreeTable is used to display hierarchical data in tabular format.

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `any[] \| undefined` | — | An array of objects to represent dynamic columns. |
| `styleClass` | `string \| undefined` | — | Style class of the component. |
| `tableStyle` | `{ [klass: string]: any } \| null \| undefined` | — | Inline style of the table. |
| `tableStyleClass` | `string \| undefined` | — | Style class of the table. |
| `autoLayout` | `boolean \| undefined` | — | Whether the cell widths scale according to their content or not. |
| `lazy` | `boolean` | `false` | Defines if data is loaded and interacted with in lazy manner. |
| `lazyLoadOnInit` | `boolean` | `true` | Whether to call lazy loading on initialization. |
| `paginator` | `boolean \| undefined` | — | When specified as true, enables the pagination. |
| `rows` | `number \| undefined` | — | Number of rows to display per page. |
| `first` | `number` | `0` | Index of the first row to be displayed. |
| `pageLinks` | `number` | `5` | Number of page links to display in paginator. |
| `rowsPerPageOptions` | `any[] \| undefined` | — | Array of integer/object values to display inside rows per page dropdown of paginator |
| `alwaysShowPaginator` | `boolean` | `true` | Whether to show it even there is only one page. |
| `paginatorPosition` | `'top' \| 'bottom' \| 'both'` | `'bottom'` | Position of the paginator. |
| `paginatorStyleClass` | `string \| undefined` | — | Custom style class for paginator |
| `paginatorDropdownAppendTo` | `HTMLElement \| ElementRef \| TemplateRef&lt;any&gt; \| string \| null \| undefined \| any` | — | Target element to attach the paginator dropdown overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name). |
| `currentPageReportTemplate` | `string` | `'{currentPage} of {totalPages}'` | Template of the current page report element. Available placeholders are {currentPage},{totalPages},{rows},{first},{last} and {totalRecords} |
| `showCurrentPageReport` | `boolean \| undefined` | — | Whether to display current page report. |
| `showJumpToPageDropdown` | `boolean \| undefined` | — | Whether to display a dropdown to navigate to any page. |
| `showFirstLastIcon` | `boolean` | `true` | When enabled, icons are displayed on paginator to go first and last page. |
| `showPageLinks` | `boolean` | `true` | Whether to show page links. |
| `defaultSortOrder` | `number` | `1` | Sort order to use when an unsorted column gets sorted by user interaction. |
| `sortMode` | `'single' \| 'multiple'` | `'single'` | Defines whether sorting works on single column or on multiple columns. |
| `resetPageOnSort` | `boolean` | `true` | When true, resets paginator to first page after sorting. |
| `customSort` | `boolean \| undefined` | — | Whether to use the default sorting or a custom one using sortFunction. |
| `selectionMode` | `string \| undefined` | — | Specifies the selection mode, valid values are "single" and "multiple". |
| `contextMenuSelection` | `any` | — | Selected row with a context menu. |
| `contextMenuSelectionMode` | `string` | `'separate'` | Mode of the contet menu selection. |
| `dataKey` | `string \| undefined` | — | A property to uniquely identify a record in data. |
| `metaKeySelection` | `boolean \| undefined` | `false` | Defines whether metaKey is should be considered for the selection. On touch enabled devices, metaKeySelection is turned off automatically. |
| `compareSelectionBy` | `string` | `'deepEquals'` | Algorithm to define if a row is selected, valid values are "equals" that compares by reference and "deepEquals" that compares all fields. |
| `rowHover` | `boolean \| undefined` | — | Adds hover effect to rows without the need for selectionMode. |
| `loading` | `boolean \| undefined` | — | Displays a loader to indicate data load is in progress. |
| `loadingIcon` | `string \| undefined` | — | The icon to show while indicating data load is in progress. |
| `showLoader` | `boolean` | `true` | Whether to show the loading mask when loading property is true. |
| `scrollable` | `boolean \| undefined` | — | When specified, enables horizontal and/or vertical scrolling. |
| `scrollHeight` | `string \| undefined` | — | Height of the scroll viewport in fixed pixels or the "flex" keyword for a dynamic size. |
| `virtualScroll` | `boolean \| undefined` | — | Whether the data should be loaded on demand during scroll. |
| `virtualScrollItemSize` | `number \| undefined` | — | Height of a row to use in calculations of virtual scrolling. |
| `virtualScrollOptions` | `ScrollerOptions \| undefined` | — | Whether to use the scroller feature. The properties of scroller component can be used like an object in it. |
| `virtualScrollDelay` | `number` | `150` | The delay (in milliseconds) before triggering the virtual scroll. This determines the time gap between the user's scroll action and the actual rendering of the next set of items in the virtual scroll. |
| `frozenWidth` | `string \| undefined` | — | Width of the frozen columns container. |
| `frozenColumns` | `{ [klass: string]: any } \| null \| undefined` | — | An array of objects to represent dynamic columns that are frozen. |
| `resizableColumns` | `boolean \| undefined` | — | When enabled, columns can be resized using drag and drop. |
| `columnResizeMode` | `string` | `'fit'` | Defines whether the overall table width should change on column resize, valid values are "fit" and "expand". |
| `reorderableColumns` | `boolean \| undefined` | — | When enabled, columns can be reordered using drag and drop. |
| `contextMenu` | `any` | — | Local ng-template varilable of a ContextMenu. |
| `rowTrackBy` | `Function` | `(index: number, item: any) =&gt; item` | Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity. |
| `filters` | `{ [s: string]: FilterMetadata \| undefined }` | `{}` | An array of FilterMetadata objects to provide external filters. |
| `globalFilterFields` | `string[] \| undefined` | — | An array of fields as string to use in global filtering. |
| `filterDelay` | `number` | `300` | Delay in milliseconds before filtering the data. |
| `filterMode` | `string` | `'lenient'` | Mode for filtering valid values are "lenient" and "strict". Default is lenient. |
| `filterLocale` | `string \| undefined` | — | Locale to use in filtering. The default locale is the host environment's current locale. |
| `paginatorLocale` | `string \| undefined` | — | Locale to be used in paginator formatting. |
| `showGridlines` | `boolean` | `false` | Whether to show grid lines between cells. |

#### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `selectionChange` | `EventEmitter&lt;TreeTableNode&lt;any&gt; \| TreeTableNode&lt;any&gt;[] \| null&gt;` | Callback to invoke on selected node change. |
| `contextMenuSelectionChange` | `EventEmitter&lt;TreeTableNode&gt;` | Callback to invoke on context menu selection change. |
| `onFilter` | `EventEmitter&lt;TreeTableFilterEvent&gt;` | Callback to invoke when data is filtered. |
| `onNodeExpand` | `EventEmitter&lt;TreeTableNodeExpandEvent&gt;` | Callback to invoke when a node is expanded. |
| `onNodeCollapse` | `EventEmitter&lt;TreeTableNodeCollapseEvent&gt;` | Callback to invoke when a node is collapsed. |
| `onPage` | `EventEmitter&lt;TreeTablePaginatorState&gt;` | Callback to invoke when pagination occurs. |
| `onSort` | `EventEmitter&lt;any&gt;` | Callback to invoke when a column gets sorted. |
| `onLazyLoad` | `EventEmitter&lt;TreeTableLazyLoadEvent&gt;` | Callback to invoke when paging, sorting or filtering happens in lazy mode. |
| `sortFunction` | `EventEmitter&lt;TreeTableSortEvent&gt;` | An event emitter to invoke on custom sorting, refer to sorting section for details. |
| `onColResize` | `EventEmitter&lt;TreeTableColResizeEvent&gt;` | Callback to invoke when a column is resized. |
| `onColReorder` | `EventEmitter&lt;TreeTableColumnReorderEvent&gt;` | Callback to invoke when a column is reordered. |
| `onNodeSelect` | `EventEmitter&lt;TreeTableNode&gt;` | Callback to invoke when a node is selected. |
| `onNodeUnselect` | `EventEmitter&lt;TreeTableNodeUnSelectEvent&gt;` | Callback to invoke when a node is unselected. |
| `onContextMenuSelect` | `EventEmitter&lt;TreeTableContextMenuSelectEvent&gt;` | Callback to invoke when a node is selected with right click. |
| `onHeaderCheckboxToggle` | `EventEmitter&lt;TreeTableHeaderCheckboxToggleEvent&gt;` | Callback to invoke when state of header checkbox changes. |
| `onEditInit` | `EventEmitter&lt;TreeTableEditEvent&gt;` | Callback to invoke when a cell switches to edit mode. |
| `onEditComplete` | `EventEmitter&lt;TreeTableEditEvent&gt;` | Callback to invoke when cell edit is completed. |
| `onEditCancel` | `EventEmitter&lt;TreeTableEditEvent&gt;` | Callback to invoke when cell edit is cancelled with escape key. |
| `selectionKeysChange` | `EventEmitter&lt;any&gt;` | Callback to invoke when selectionKeys are changed. |

### TTBody

Selector: `[hTreeTableBody]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `any[] \| undefined` | — | — |
| `template` | `Nullable&lt;TemplateRef&lt;any&gt;&gt;` | — | — |
| `frozen` | `boolean \| undefined` | — | — |
| `serializedNodes` | `any` | — | — |
| `scrollerOptions` | `any` | — | — |

### TTScrollableView

Selector: `[ttScrollableView]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `any[] \| undefined` | — | — |
| `frozen` | `boolean \| undefined` | — | — |

### TTSortableColumn

Selector: `[ttSortableColumn]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `field` | `string \| undefined` | — | — |
| `ttSortableColumnDisabled` | `boolean \| undefined` | — | — |

### TTSortIcon

Selector: `h-treeTableSortIcon, h-treetable-sort-icon, h-tree-table-sort-icon`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `field` | `string \| undefined` | — | — |
| `ariaLabelDesc` | `string \| undefined` | — | — |
| `ariaLabelAsc` | `string \| undefined` | — | — |

### TTResizableColumn

Selector: `[ttResizableColumn]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `ttResizableColumnDisabled` | `boolean \| undefined` | — | — |

### TTReorderableColumn

Selector: `[ttReorderableColumn]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `ttReorderableColumnDisabled` | `boolean \| undefined` | — | — |

### TTSelectableRow

Selector: `[ttSelectableRow]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `rowNode` | `any` | — | — |
| `ttSelectableRowDisabled` | `boolean \| undefined` | — | — |

### TTSelectableRowDblClick

Selector: `[ttSelectableRowDblClick]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `rowNode` | `any` | — | — |
| `ttSelectableRowDisabled` | `boolean \| undefined` | — | — |

### TTContextMenuRow

Selector: `[ttContextMenuRow]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `rowNode` | `any \| undefined` | — | — |
| `ttContextMenuRowDisabled` | `boolean \| undefined` | — | — |

### TTCheckbox

Selector: `h-treeTableCheckbox, h-treetable-checkbox, h-tree-table-checkbox`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean \| undefined` | — | — |
| `rowNode` | `any` | — | — |

### TTHeaderCheckbox

Selector: `h-treeTableHeaderCheckbox`

### TTEditableColumn

Selector: `[ttEditableColumn]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `any` | — | — |
| `field` | `any` | — | — |
| `ttEditableColumnDisabled` | `boolean \| undefined` | — | — |

### TreeTableCellEditor

Selector: `h-treeTableCellEditor, h-treetablecelleditor, h-treetable-cell-editor`

### TTRow

Selector: `[ttRow]`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `rowNode` | `any` | — | — |

### TreeTableToggler

Selector: `h-treeTableToggler, h-treetabletoggler, h-treetable-toggler`

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `rowNode` | `any` | — | — |

## Services

### TreeTableService

## Source

[`projects/helix/treetable`](../../projects/helix/treetable)
