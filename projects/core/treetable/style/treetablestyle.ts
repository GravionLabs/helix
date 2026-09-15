import { Injectable } from '@angular/core';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
/* For Helix */
.h-treetable {
    position: relative;
}

.h-treetable table {
    border-collapse: collapse;
    width: 100%;
    table-layout: fixed;
}

.h-treetable .h-sortable-column {
    cursor: pointer;
    user-select: none;
}

.h-treetable .h-sortable-column .h-column-title,
.h-treetable .h-sortable-column .h-sortable-column-icon,
.h-treetable .h-sortable-column .h-sortable-column-badge {
    vertical-align: middle;
}

.h-treetable-sort-icon {
    color: dt('treetable.sort.icon.color');
    font-size: dt('treetable.sort.icon.size');
    width: dt('treetable.sort.icon.size');
    height: dt('treetable.sort.icon.size');
    transition: color dt('treetable.transition.duration');
}

.h-treetable .h-sortable-column .h-sortable-column-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.h-treetable-auto-layout>.h-treetable-wrapper {
    overflow-x: auto;
}

.h-treetable-auto-layout>.h-treetable-wrapper>table {
    table-layout: auto;
}

.h-treetable-hoverable-rows .h-treetable-tbody>tr {
    cursor: pointer;
}

.h-treetable-toggler {
    cursor: pointer;
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    overflow: hidden;
    position: relative;
}


/* Scrollable */
.h-treetable-scrollable-wrapper {
    position: relative;
}

.h-treetable-scrollable-header,
.h-treetable-scrollable-footer {
    overflow: hidden;
    flex-shrink: 0;
}

.h-treetable-scrollable-body {
    overflow: auto;
    position: relative;
}

.h-treetable-virtual-table {
    position: absolute;
}

/* Frozen Columns */
.h-treetable-frozen-view .h-treetable-scrollable-body {
    overflow: hidden;
}

.h-treetable-frozen-view>.h-treetable-scrollable-body>table>.h-treetable-tbody>tr>td:last-child {
    border-right: 0 none;
}

.h-treetable-unfrozen-view {
    position: absolute;
    top: 0;
}

/* Flex Scrollable */
.h-treetable-flex-scrollable {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
}

.h-treetable-flex-scrollable .h-treetable-scrollable-wrapper,
.h-treetable-flex-scrollable .h-treetable-scrollable-view {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
}

.h-treetable-flex-scrollable .h-treetable-virtual-scrollable-body {
    flex: 1;
}

/* Resizable */
.h-treetable-resizable>.h-treetable-wrapper {
    overflow-x: auto;
}

.h-treetable-resizable .h-treetable-thead>tr>th,
.h-treetable-resizable .h-treetable-tfoot>tr>td,
.h-treetable-resizable .h-treetable-tbody>tr>td {
    overflow: hidden;
}

.h-treetable-resizable .h-resizable-column {
    background-clip: padding-box;
    position: relative;
}

.h-treetable-resizable-fit .h-resizable-column:last-child .h-column-resizer {
    display: none;
}

.h-treetable .h-column-resizer {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    width: dt('treetable.column.resizer.width');
    height: 100%;
    padding: 0px;
    cursor: col-resize;
    border: 1px solid transparent;
}

.h-treetable .h-column-resizer-helper {
    width: dt('treetable.resize.indicator.width');
    position: absolute;
    z-index: 10;
    display: none;
    background: dt('treetable.resize.indicator.color');
}

.h-treetable .h-row-editor-init,
.h-treetable .h-row-editor-save,
.h-treetable .h-row-editor-cancel {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
}


/* Reorder */
.h-treetable-reorder-indicator-up,
.h-treetable-reorder-indicator-down {
    position: absolute;
    display: none;
}

[ttReorderableColumn] {
    cursor: move;
}

/* Loader */
.h-treetable-mask {
    position: absolute !important;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
}

.h-treetable-loading-icon {
    font-size: dt('treetable.loading.icon.size');
    width: dt('treetable.loading.icon.size');
    height: dt('treetable.loading.icon.size');
}

/* Virtual Scroll */
.h-treetable .h-scroller-loading {
    transform: none !important;
    min-height: 0;
    position: sticky;
    top: 0;
    left: 0;
}

.h-treetable .h-paginator-top {
    border-color: dt('treetable.paginator.top.border.color');
    border-style: solid;
    border-width: dt('treetable.paginator.top.border.width');
}

.h-treetable .h-paginator-bottom {
    border-color: dt('treetable.paginator.bottom.border.color');
    border-style: solid;
    border-width: dt('treetable.paginator.bottom.border.width');
}

.h-treetable .h-treetable-header {
    background: dt('treetable.header.background');
    color: dt('treetable.header.color');
    border-color: dt('treetable.header.border.color');
    border-style: solid;
    border-width: dt('treetable.header.border.width');
    padding: dt('treetable.header.padding');
    font-weight: dt('treetable.column.title.font.weight');
}

.h-treetable .h-treetable-footer {
    background: dt('treetable.footer.background');
    color: dt('treetable.footer.color');
    border-color: dt('treetable.footer.border.color');
    border-style: solid;
    border-width: dt('treetable.footer.border.width');
    padding: dt('treetable.footer.padding');
    font-weight: dt('treetable.column.footer.font.weight');
}

.h-treetable .h-treetable-thead>tr>th {
    padding: dt('treetable.header.cell.padding');
    background: dt('treetable.header.cell.background');
    border-color: dt('treetable.header.cell.border.color');
    border-style: solid;
    border-width: 0 0 1px 0;
    color: dt('treetable.header.cell.color');
    font-weight: dt('treetable.column.title.font.weight');
    text-align: start;
    transition: background dt('treetable.transition.duration'), color dt('treetable.transition.duration'), border-color dt('treetable.transition.duration'),
            outline-color dt('treetable.transition.duration'), box-shadow dt('treetable.transition.duration');
}

.h-treetable .h-treetable-tfoot>tr>td {
    text-align: start;
    padding: dt('treetable.footer.cell.padding');
    border-color: dt('treetable.footer.cell.border.color');
    border-style: solid;
    border-width: 0 0 1px 0;
    color: dt('treetable.footer.cell.color');
    background: dt('treetable.footer.cell.background');
    font-weight: dt('treetable.column.footer.font.weight');
}

.h-treetable .h-sortable-column {
    cursor: pointer;
    user-select: none;
    outline-color: transparent;
    vertical-align: middle;
}

.h-treetable .h-sortable-column .h-sortable-column-icon {
    color: dt('treetable.sort.icon.color');
    transition: color dt('treetable.transition.duration');
}


.h-treetable .h-sortable-column:not(.h-treetable-column-sorted):hover {
    background: dt('treetable.header.cell.hover.background');
    color: dt('treetable.header.cell.hover.color');
}

.h-treetable .h-sortable-column:not(.h-treetable-column-sorted):hover .h-treetable-sort-icon {
    color: dt('treetable.sort.icon.hover.color');
}

.h-treetable .h-sortable-column.h-treetable-column-sorted {
    background: dt('treetable.header.cell.selected.background');
    color: dt('treetable.header.cell.selected.color');
}

.h-treetable .h-sortable-column.h-treetable-column-sorted .h-treetable-sort-icon {
    color: dt('treetable.header.cell.selected.color');
}

.h-treetable .h-sortable-column:focus-visible {
    box-shadow: dt('treetable.header.cell.focus.ring.shadow');
    outline: dt('treetable.header.cell.focus.ring.width') dt('treetable.header.cell.focus.ring.style') dt('treetable.header.cell.focus.ring.color');
    outline-offset: dt('treetable.header.cell.focus.ring.offset');
}

.h-treetable-hoverable .h-treetable-selectable-row {
    cursor: pointer;
}

.h-treetable .h-treetable-tbody > tr {
    outline-color: transparent;
    background: dt('treetable.row.background');
    color: dt('treetable.row.color');
}

.h-treetable .h-treetable-tbody>tr>td {
    text-align: start;
    border-color: dt('treetable.body.cell.border.color');
    border-style: solid;
    border-width: 0 0 1px 0;
    padding: dt('treetable.body.cell.padding');
}

.h-treetable .h-treetable-tbody>tr>td .h-treetable-toggler {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    width: dt('treetable.node.toggle.button.size');
    height: dt('treetable.node.toggle.button.size');
    color: dt('treetable.node.toggle.button.color');
    border: 0 none;
    background: transparent;
    cursor: pointer;
    border-radius: dt('treetable.node.toggle.button.border.radius');
    transition: background dt('treetable.transition.duration'), color dt('treetable.transition.duration'), border-color dt('treetable.transition.duration'),
            outline-color dt('treetable.transition.duration'), box-shadow dt('treetable.transition.duration');
    outline-color: transparent;
    user-select: none;
}

.h-treetable .h-treetable-tbody>tr>td .h-treetable-toggler:enabled:hover {
    color: dt('treetable.node.toggle.button.hover.color');
    background: dt('treetable.node.toggle.button.hover.background');
}

.h-treetable .h-treetable-tbody>tr>tr.treetable-row-selected .h-treetable-toggler:hover {
    background: dt('treetable.node.toggle.button.selected.hover.background');
    color: dt('treetable.node.toggle.button.selected.hover.color');
}

.h-treetable .h-treetable-tbody>tr>td .h-treetable-toggler:focus-visible {
    box-shadow: dt('treetable.node.toggle.button.focus.ring.shadow');
    outline: dt('treetable.node.toggle.button.focus.ring.width') dt('treetable.node.toggle.button.focus.ring.style') dt('treetable.node.toggle.button.focus.ring.color');
    outline-offset: dt('treetable.node.toggle.button.focus.ring.offset');
}


.h-treetable .h-treetable-tbody>tr.h-treetable-row-selected {
    background: dt('treetable.row.selected.background');
    color: dt('treetable.row.selected.color');
}

.h-treetable-tbody > tr:focus-visible,
.h-treetable-tbody > tr.h-treetable-contextmenu-row-selected {
    box-shadow: dt('treetable.row.focus.ring.shadow');
    outline: dt('treetable.row.focus.ring.width') dt('treetable.row.focus.ring.style') dt('treetable.row.focus.ring.color');
    outline-offset: dt('treetable.row.focus.ring.offset');
}

.h-treetable .h-treetable-tbody>tr.h-treetable-row-selected .h-treetable-toggler {
    color: inherit;
}

.h-treetable .h-treetable-tbody>tr.h-treetable-row-selected .h-treetable-toggler:hover {
    background: dt('treetable.node.toggle.button.selected.hover.background');
    color: dt('treetable.node.toggle.button.selected.hover.color');
}

.h-treetable.h-treetable-hoverable-rows .h-treetable-tbody>tr:not(.h-treetable-row-selected):hover {
    background: dt('treetable.row.hover.background');
    color: dt('treetable.row.hover.color');
}

.h-treetable-gridlines .h-treetable-header {
    border-width: 1px 1px 0 1px;
}

.h-treetable-gridlines .h-treetable-footer {
    border-width: 0 1px 1px 1px;
}

.h-treetable-gridlines .h-treetable-paginator-top {
    border-width: 1px 1px 0 1px;
}

.h-treetable-gridlines .h-treetable-paginator-bottom {
    border-width: 0 1px 1px 1px;
}

.h-treetable-gridlines .h-treetable-thead > tr > th {
    border-width: 1px 0 1px 1px;
}

.h-treetable-gridlines .h-treetable-thead > tr > th:last-child {
    border-width: 1px;
}

.h-treetable-gridlines .h-treetable-tbody > tr > td {
    border-width: 1px 0 0 1px;
}

.h-treetable-gridlines .h-treetable-tbody > tr > td:last-child {
    border-width: 1px 1px 0 1px;
}

.h-treetable-gridlines .h-treetable-tbody > tr:last-child > td {
    border-width: 1px 0 1px 1px;
}

.h-treetable-gridlines .h-treetable-tbody > tr:last-child > td:last-child {
    border-width: 1px;
}

.h-treetable-gridlines .h-treetable-tfoot > tr > td {
    border-width: 1px 0 1px 1px;
}

.h-treetable-gridlines .h-treetable-tfoot > tr > td:last-child {
    border-width: 1px 1px 1px 1px;
}

.h-treetable.h-treetable-gridlines .h-treetable-thead + .h-treetable-tfoot > tr > td {
    border-width: 0 0 1px 1px;
}

.h-treetable.h-treetable-gridlines .h-treetable-thead + .h-treetable-tfoot > tr > td:last-child {
    border-width: 0 1px 1px 1px;
}

.h-treetable.h-treetable-gridlines:has(.h-treetable-thead):has(.h-treetable-tbody) .h-treetable-tbody > tr > td {
    border-width: 0 0 1px 1px;
}

.h-treetable.h-treetable-gridlines:has(.h-treetable-thead):has(.h-treetable-tbody) .h-treetable-tbody > tr > td:last-child {
    border-width: 0 1px 1px 1px;
}

.h-treetable.h-treetable-gridlines:has(.h-treetable-tbody):has(.h-treetable-tfoot) .h-treetable-tbody > tr:last-child > td {
    border-width: 0 0 0 1px;
}

.h-treetable.h-treetable-gridlines:has(.h-treetable-tbody):has(.h-treetable-tfoot) .h-treetable-tbody > tr:last-child > td:last-child {
    border-width: 0 1px 0 1px;
}

.h-treetable.h-treetable-sm .h-treetable-header {
    padding: 0.65625rem 0.875rem;
}

.h-treetable.h-treetable-sm .h-treetable-thead>tr>th {
    padding: 0.375rem 0.5rem;
}

.h-treetable.h-treetable-sm .h-treetable-tbody>tr>td {
    padding: 0.375rem 0.5rem;
}

.h-treetable.h-treetable-sm .h-treetable-tfoot>tr>td {
    padding: 0.375rem 0.5rem;
}

.h-treetable.h-treetable-sm .h-treetable-footer {
    padding: 0.375rem 0.5rem;
}

.h-treetable.h-treetable-lg .h-treetable-header {
    padding: 0.9375rem 1.25rem;
}

.h-treetable.h-treetable-lg .h-treetable-thead>tr>th {
    padding: 0.9375rem 1.25rem;
}

.h-treetable.h-treetable-lg .h-treetable-tbody>tr>td {
    padding: 0.9375rem 1.25rem;
}

.h-treetable.h-treetable-lg .h-treetable-tfoot>tr>td {
    padding: 0.9375rem 1.25rem;
}

.h-treetable.h-treetable-lg .h-treetable-footer {
    padding: 0.9375rem 1.25rem;
}

h-treetabletoggler + h-treetablecheckbox .h-checkbox,
h-treetable-toggler + h-treetable-checkbox .h-checkbox,
h-tree-table-toggler + h-tree-table-checkbox .h-checkbox {
    vertical-align: middle;
}

h-treetabletoggler + h-treetablecheckbox + span,
h-treetable-toggler + h-treetable-checkbox + span,
h-tree-table-toggler + h-tree-table-checkbox + span {
    vertical-align: middle;
}

h-treetable-sort-icon {
    display: inline-flex;
    align-items: center;
    gap: dt('treetable.header.cell.gap');
}
`;

const classes = {
    root: ({ instance }) => [
        'h-treetable h-component',
        {
            'h-treetable-gridlines': instance.showGridlines,
            'h-treetable-hoverable-rows': instance.rowHover || instance.selectionMode === 'single' || instance.selectionMode === 'multiple',
            'h-treetable-auto-layout': instance.autoLayout,
            'h-treetable-resizable': instance.resizableColumns,
            'h-treetable-resizable-fit': instance.resizableColumns && instance.columnResizeMode === 'fit',
            'h-treetable-flex-scrollable': instance.scrollable && instance.scrollHeight === 'flex'
        }
    ],
    loading: 'h-treetable-loading',
    mask: 'h-treetable-mask h-overlay-mask',
    loadingIcon: 'h-treetable-loading-icon',
    header: 'h-treetable-header',
    pcPaginator: ({ instance }) => ['h-treetable-paginator-' + instance.paginatorPosition, instance.paginatorStyleClass],
    tableContainer: 'h-treetable-table-container',
    table: ({ instance }) => ({
        'h-treetable-table': true,
        'h-treetable-scrollable-table': instance.scrollable,
        'h-treetable-resizable-table': instance.resizableColumns,
        'h-treetable-resizable-table-fit': instance.resizableColumns && instance.columnResizeMode === 'fit'
    }),
    thead: 'h-treetable-thead',
    sortableColumn: ({ instance }) => ({
        'h-sortable-column': instance.isEnabled(),
        'h-treetable-column-sorted': instance.sorted
    }),
    sortableColumnIcon: 'h-treetable-sort-icon',
    sortableColumnBadge: 'h-sortable-column-badge',
    columnResizer: 'h-treetable-column-resizer',
    columnHeaderContent: 'h-treetable-column-header-content',
    columnTitle: 'h-treetable-column-title',
    sortIcon: 'h-treetable-sort-icon',
    pcSortBadge: 'h-treetable-sort-badge',
    tbody: 'h-treetable-tbody',
    row: ({ instance }) => ({
        'h-treetable-row-selected': instance.selected
    }),
    contextMenuRow: ({ instance }) => ({
        'h-treetable-contextmenu-row-selected': instance.selected
    }),
    toggler: 'h-treetable-toggler',
    nodeToggleButton: 'h-treetable-node-toggle-button',
    nodeToggleIcon: 'h-treetable-node-toggle-icon',
    pcNodeCheckbox: 'h-treetable-node-checkbox',
    tfoot: 'h-treetable-tfoot',
    footerCell: ({ instance }) => ({
        'h-treetable-frozen-column': instance.columnProp('frozen')
    }),
    footer: 'h-treetable-footer',
    columnResizeIndicator: 'h-treetable-column-resize-indicator',
    wrapper: 'h-treetable-wrapper',
    scrollableWrapper: 'h-treetable-scrollable-wrapper',
    scrollableView: 'h-treetable-scrollable-view',
    frozenView: 'h-treetable-frozen-view',
    columnResizerHelper: 'h-column-resizer-helper',
    reorderIndicatorUp: 'h-treetable-reorder-indicator-up',
    reorderIndicatorDown: 'h-treetable-reorder-indicator-down',
    scrollableHeader: 'h-treetable-scrollable-header',
    scrollableHeaderBox: 'h-treetable-scrollable-header-box',
    scrollableHeaderTable: 'h-treetable-scrollable-header-table',
    scrollableBody: 'h-treetable-scrollable-body',
    scrollableFooter: 'h-treetable-scrollable-footer',
    scrollableFooterBox: 'h-treetable-scrollable-footer-box',
    scrollableFooterTable: 'h-treetable-scrollable-footer-table'
};

@Injectable()
export class TreeTableStyle extends BaseStyle {
    name = 'treetable';

    style = style;

    classes = classes;
}

/**
 *
 * TreeTable is used to display hierarchical data in tabular format.
 *
 * [Live Demo](https://www.primeng.org/treetable/)
 *
 * @module treetablestyle
 *
 */
export enum TreeTableClasses {
    /**
     * Class name of the root element
     */
    root = 'h-treetable',
    /**
     * Class name of the loading element
     */
    loading = 'h-treetable-loading',
    /**
     * Class name of the mask element
     */
    mask = 'h-treetable-mask',
    /**
     * Class name of the loading icon element
     */
    loadingIcon = 'h-treetable-loading-icon',
    /**
     * Class name of the header element
     */
    header = 'h-treetable-header',
    /**
     * Class name of the paginator element
     */
    pcPaginator = 'h-treetable-paginator-[position]',
    /**
     * Class name of the table container element
     */
    tableContainer = 'h-treetable-table-container',
    /**
     * Class name of the table element
     */
    table = 'h-treetable-table',
    /**
     * Class name of the thead element
     */
    thead = 'h-treetable-thead',
    /**
     * Class name of the column resizer element
     */
    columnResizer = 'h-treetable-column-resizer',
    /**
     * Class name of the column title element
     */
    columnTitle = 'h-treetable-column-title',
    /**
     * Class name of the sort icon element
     */
    sortIcon = 'h-treetable-sort-icon',
    /**
     * Class name of the sort badge element
     */
    pcSortBadge = 'h-treetable-sort-badge',
    /**
     * Class name of the tbody element
     */
    tbody = 'h-treetable-tbody',
    /**
     * Class name of the node toggle button element
     */
    nodeToggleButton = 'h-treetable-node-toggle-button',
    /**
     * Class name of the node toggle icon element
     */
    nodeToggleIcon = 'h-treetable-node-toggle-icon',
    /**
     * Class name of the node checkbox element
     */
    pcNodeCheckbox = 'h-treetable-node-checkbox',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'h-treetable-empty-message',
    /**
     * Class name of the tfoot element
     */
    tfoot = 'h-treetable-tfoot',
    /**
     * Class name of the footer element
     */
    footer = 'h-treetable-footer',
    /**
     * Class name of the column resize indicator element
     */
    columnResizeIndicator = 'h-treetable-column-resize-indicator',
    /**
     * Class name of the wrapper element
     */
    wrapper = 'h-treetable-wrapper',
    /**
     * Class name of the scrollable wrapper element
     */
    scrollableWrapper = 'h-treetable-scrollable-wrapper',
    /**
     * Class name of the scrollable view element
     */
    scrollableView = 'h-treetable-scrollable-view',
    /**
     * Class name of the frozen view element
     */
    frozenView = 'h-treetable-frozen-view',
    /**
     * Class name of the column resizer helper element
     */
    columnResizerHelper = 'h-treetable-column-resizer-helper',
    /**
     * Class name of the reorder indicator up element
     */
    reorderIndicatorUp = 'h-treetable-reorder-indicator-up',
    /**
     * Class name of the reorder indicator down element
     */
    reorderIndicatorDown = 'h-treetable-reorder-indicator-down',
    /**
     * Class name of the scrollable header element
     */
    scrollableHeader = 'h-treetable-scrollable-header',
    /**
     * Class name of the scrollable header box element
     */
    scrollableHeaderBox = 'h-treetable-scrollable-header-box',
    /**
     * Class name of the scrollable header table element
     */
    scrollableHeaderTable = 'h-treetable-scrollable-header-table',
    /**
     * Class name of the scrollable body element
     */
    scrollableBody = 'h-treetable-scrollable-body',
    /**
     * Class name of the scrollable footer element
     */
    scrollableFooter = 'h-treetable-scrollable-footer',
    /**
     * Class name of the scrollable footer box element
     */
    scrollableFooterBox = 'h-treetable-scrollable-footer-box',
    /**
     * Class name of the scrollable footer table element
     */
    scrollableFooterTable = 'h-treetable-scrollable-footer-table',
    /**
     * Class name of the sortable column icon element
     */
    sortableColumnIcon = 'h-sortable-column-icon'
}

export interface TreeTableStyle extends BaseStyle {}
