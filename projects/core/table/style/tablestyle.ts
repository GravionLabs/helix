import { Injectable } from '@angular/core';
import { style as datatable_style } from './datatable.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
${datatable_style}

/* For Helix */
.h-datatable-scrollable-table > .h-datatable-thead {
    top: 0;
    z-index: 2;
}

.h-datatable-scrollable-table > .h-datatable-frozen-tbody {
    position: sticky;
    z-index: 2;
}

.h-datatable-scrollable-table > .h-datatable-frozen-tbody + .h-datatable-frozen-tbody {
    z-index: 1;
}

.h-datatable-mask.h-overlay-mask {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
}

.h-datatable-filter-overlay {
    position: absolute;
    background: dt('datatable.filter.overlay.select.background');
    color: dt('datatable.filter.overlay.select.color');
    border: 1px solid dt('datatable.filter.overlay.select.border.color');
    border-radius: dt('datatable.filter.overlay.select.border.radius');
    box-shadow: dt('datatable.filter.overlay.select.shadow');
    min-width: 12.5rem;
}

.h-datatable-filter-rule {
    border-bottom: 1px solid dt('datatable.filter.rule.border.color');
}

.h-datatable-filter-rule:last-child {
    border-bottom: 0 none;
}

.h-datatable-filter-add-rule-button,
.h-datatable-filter-remove-rule-button {
    width: 100%;
}

.h-datatable-filter-remove-button {
    width: 100%;
}

.h-datatable-thead > tr > th {
    padding: dt('datatable.header.cell.padding');
    background: dt('datatable.header.cell.background');
    border-color: dt('datatable.header.cell.border.color');
    border-style: solid;
    border-width: 0 0 1px 0;
    color: dt('datatable.header.cell.color');
    font-weight: dt('datatable.column.title.font.weight');
    text-align: start;
    transition:
        background dt('datatable.transition.duration'),
        color dt('datatable.transition.duration'),
        border-color dt('datatable.transition.duration'),
        outline-color dt('datatable.transition.duration'),
        box-shadow dt('datatable.transition.duration');
}

.h-datatable-thead > tr > th h-columnfilter {
    font-weight: normal;
}

.h-datatable-thead > tr > th,
.h-datatable-sort-icon,
.h-datatable-sort-badge {
    vertical-align: middle;
}

.h-datatable-thead > tr > th.h-datatable-column-sorted {
    background: dt('datatable.header.cell.selected.background');
    color: dt('datatable.header.cell.selected.color');
}

.h-datatable-thead > tr > th.h-datatable-column-sorted .h-datatable-sort-icon {
    color: dt('datatable.header.cell.selected.color');
}

.h-datatable.h-datatable-striped .h-datatable-tbody > tr:nth-child(odd) {
    background: dt('datatable.row.striped.background');
}

.h-datatable.h-datatable-striped .h-datatable-tbody > tr:nth-child(odd).h-datatable-row-selected {
    background: dt('datatable.row.selected.background');
    color: dt('datatable.row.selected.color');
}

h-sortIcon, h-sort-icon, h-sorticon {
    display: inline-flex;
    align-items: center;
    gap: dt('datatable.header.cell.gap');
}

.h-datatable .h-editable-column.h-cell-editing {
    padding: 0;
}

.h-datatable .h-editable-column.h-cell-editing h-celleditor {
    display: block;
    width: 100%;
}
`;

const classes = {
    root: ({ instance }) => [
        'h-datatable h-component',
        {
            'h-datatable-hoverable': instance.rowHover || instance.selectionMode,
            'h-datatable-resizable': instance.resizableColumns,
            'h-datatable-resizable-fit': instance.resizableColumns && instance.columnResizeMode === 'fit',
            'h-datatable-scrollable': instance.scrollable,
            'h-datatable-flex-scrollable': instance.scrollable && instance.scrollHeight === 'flex',
            'h-datatable-striped': instance.stripedRows,
            'h-datatable-gridlines': instance.showGridlines,
            'h-datatable-sm': instance.size === 'small',
            'h-datatable-lg': instance.size === 'large'
        }
    ],
    mask: 'h-datatable-mask h-overlay-mask',
    loadingIcon: 'h-datatable-loading-icon',
    header: 'h-datatable-header',
    pcPaginator: ({ instance }) => 'h-datatable-paginator-' + instance.paginatorPosition,
    tableContainer: 'h-datatable-table-container',
    table: ({ instance }) => [
        'h-datatable-table',
        {
            'h-datatable-scrollable-table': instance.scrollable,
            'h-datatable-resizable-table': instance.resizableColumns,
            'h-datatable-resizable-table-fit': instance.resizableColumns && instance.columnResizeMode === 'fit'
        }
    ],
    thead: 'h-datatable-thead',
    columnResizer: 'h-datatable-column-resizer',
    columnHeaderContent: 'h-datatable-column-header-content',
    columnTitle: 'h-datatable-column-title',
    columnFooter: 'h-datatable-column-footer',
    sortIcon: 'h-datatable-sort-icon',
    pcSortBadge: 'h-datatable-sort-badge',
    filter: ({ instance }) => ({
        'h-datatable-filter': true,
        'h-datatable-inline-filter': instance.display === 'row',
        'h-datatable-popover-filter': instance.display === 'menu'
    }),
    filterElementContainer: 'h-datatable-filter-element-container',
    pcColumnFilterButton: 'h-datatable-column-filter-button',
    pcColumnFilterClearButton: 'h-datatable-column-filter-clear-button',
    filterOverlay: ({ instance }) => ({
        'h-datatable-filter-overlay h-component': true,
        'h-datatable-filter-overlay-popover': instance.display === 'menu'
    }),
    filterConstraintList: 'h-datatable-filter-constraint-list',

    filterConstraint: ({ selected }) => ({
        'h-datatable-filter-constraint': true,
        'h-datatable-filter-constraint-selected': selected
    }),
    filterConstraintSeparator: 'h-datatable-filter-constraint-separator',
    filterOperator: 'h-datatable-filter-operator',
    pcFilterOperatorDropdown: 'h-datatable-filter-operator-dropdown',
    filterRuleList: 'h-datatable-filter-rule-list',
    filterRule: 'h-datatable-filter-rule',
    pcFilterConstraintDropdown: 'h-datatable-filter-constraint-dropdown',
    pcFilterRemoveRuleButton: 'h-datatable-filter-remove-rule-button',
    pcFilterAddRuleButton: 'h-datatable-filter-add-rule-button',
    filterButtonbar: 'h-datatable-filter-buttonbar',
    pcFilterClearButton: 'h-datatable-filter-clear-button',
    pcFilterApplyButton: 'h-datatable-filter-apply-button',
    tbody: ({ instance }) => ({
        'h-datatable-tbody': true,
        'h-datatable-frozen-tbody': instance.frozenValue || instance.frozenBodyTemplate,
        'h-virtualscroller-content': instance.virtualScroll
    }),
    rowGroupHeader: 'h-datatable-row-group-header',
    rowToggleButton: 'h-datatable-row-toggle-button',
    rowToggleIcon: 'h-datatable-row-toggle-icon',
    rowExpansion: 'h-datatable-row-expansion',
    rowGroupFooter: 'h-datatable-row-group-footer',
    emptyMessage: 'h-datatable-empty-message',
    bodyCell: ({ instance }) => ({
        'h-datatable-frozen-column': instance.columnProp('frozen')
    }),
    reorderableRowHandle: 'h-datatable-reorderable-row-handle',
    pcRowEditorInit: 'h-datatable-row-editor-init',
    pcRowEditorSave: 'h-datatable-row-editor-save',
    pcRowEditorCancel: 'h-datatable-row-editor-cancel',
    tfoot: 'h-datatable-tfoot',
    footerCell: ({ instance }) => ({
        'h-datatable-frozen-column': instance.columnProp('frozen')
    }),
    virtualScrollerSpacer: 'h-datatable-virtualscroller-spacer',
    footer: 'h-datatable-tfoot',
    columnResizeIndicator: 'h-datatable-column-resize-indicator',
    rowReorderIndicatorUp: 'h-datatable-row-reorder-indicator-up',
    rowReorderIndicatorDown: 'h-datatable-row-reorder-indicator-down',
    sortableColumn: ({ instance }) => ({
        'h-datatable-sortable-column': instance.isEnabled(),
        ' h-datatable-column-sorted': instance.sorted
    }),
    sortableColumnIcon: 'h-datatable-sort-icon',
    sortableColumnBadge: 'h-sortable-column-badge',
    selectableRow: ({ instance }) => ({
        'h-datatable-selectable-row': instance.isEnabled(),
        'h-datatable-row-selected': instance.selected
    }),
    resizableColumn: 'h-datatable-resizable-column',
    reorderableColumn: 'h-datatable-reorderable-column',
    rowEditorCancel: 'h-datatable-row-editor-cancel',
    frozenColumn: ({ instance }) => ({
        'h-datatable-frozen-column': instance.frozen,
        'h-datatable-frozen-column-left': instance.alignFrozenLeft === 'left'
    }),
    contextMenuRowSelected: ({ instance }) => ({
        'h-datatable-contextmenu-row-selected': instance.selected
    })
};

const inlineStyles = {
    tableContainer: ({ instance }) => ({
        'max-height': instance.virtualScroll ? '' : instance.scrollHeight,
        overflow: 'auto'
    }),
    thead: { position: 'sticky' },
    tfoot: { position: 'sticky' },
    rowGroupHeader: ({ instance }) => ({
        top: instance.getFrozenRowGroupHeaderStickyPosition
    })
};

@Injectable()
export class TableStyle extends BaseStyle {
    name = 'datatable';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * DataTable displays data in tabular format.
 *
 * [Live Demo](https://www.primeng.org/table/)
 *
 * @module tablestyle
 *
 */
export enum TableClasses {
    /**
     * Class name of the root element
     */
    root = 'h-datatable',
    /**
     * Class name of the mask element
     */
    mask = 'h-datatable-mask',
    /**
     * Class name of the loading icon element
     */
    loadingIcon = 'h-datatable-loading-icon',
    /**
     * Class name of the header element
     */
    header = 'h-datatable-header',
    /**
     * Class name of the paginator element
     */
    pcPaginator = 'h-datatable-paginator-[position]',
    /**
     * Class name of the table container element
     */
    tableContainer = 'h-datatable-table-container',
    /**
     * Class name of the table element
     */
    table = 'h-datatable-table',
    /**
     * Class name of the thead element
     */
    thead = 'h-datatable-thead',
    /**
     * Class name of the column resizer element
     */
    columnResizer = 'h-datatable-column-resizer',
    /**
     * Class name of the column header content element
     */
    columnHeaderContent = 'h-datatable-column-header-content',
    /**
     * Class name of the column title element
     */
    columnTitle = 'h-datatable-column-title',
    /**
     * Class name of the sort icon element
     */
    sortIcon = 'h-datatable-sort-icon',
    /**
     * Class name of the sort badge element
     */
    pcSortBadge = 'h-datatable-sort-badge',
    /**
     * Class name of the filter element
     */
    filter = 'h-datatable-filter',
    /**
     * Class name of the filter element container element
     */
    filterElementContainer = 'h-datatable-filter-element-container',
    /**
     * Class name of the column filter button element
     */
    pcColumnFilterButton = 'h-datatable-column-filter-button',
    /**
     * Class name of the column filter clear button element
     */
    pcColumnFilterClearButton = 'h-datatable-column-filter-clear-button',
    /**
     * Class name of the filter overlay element
     */
    filterOverlay = 'h-datatable-filter-overlay',
    /**
     * Class name of the filter constraint list element
     */
    filterConstraintList = 'h-datatable-filter-constraint-list',
    /**
     * Class name of the filter constraint element
     */
    filterConstraint = 'h-datatable-filter-constraint',
    /**
     * Class name of the filter constraint separator element
     */
    filterConstraintSeparator = 'h-datatable-filter-constraint-separator',
    /**
     * Class name of the filter operator element
     */
    filterOperator = 'h-datatable-filter-operator',
    /**
     * Class name of the filter operator dropdown element
     */
    pcFilterOperatorDropdown = 'h-datatable-filter-operator-dropdown',
    /**
     * Class name of the filter rule list element
     */
    filterRuleList = 'h-datatable-filter-rule-list',
    /**
     * Class name of the filter rule element
     */
    filterRule = 'h-datatable-filter-rule',
    /**
     * Class name of the filter constraint dropdown element
     */
    pcFilterConstraintDropdown = 'h-datatable-filter-constraint-dropdown',
    /**
     * Class name of the filter remove rule button element
     */
    pcFilterRemoveRuleButton = 'h-datatable-filter-remove-rule-button',
    /**
     * Class name of the filter add rule button element
     */
    pcFilterAddRuleButton = 'h-datatable-filter-add-rule-button',
    /**
     * Class name of the filter buttonbar element
     */
    filterButtonbar = 'h-datatable-filter-buttonbar',
    /**
     * Class name of the filter clear button element
     */
    pcFilterClearButton = 'h-datatable-filter-clear-button',
    /**
     * Class name of the filter apply button element
     */
    pcFilterApplyButton = 'h-datatable-filter-apply-button',
    /**
     * Class name of the tbody element
     */
    tbody = 'h-datatable-tbody',
    /**
     * Class name of the row group header element
     */
    rowGroupHeader = 'h-datatable-row-group-header',
    /**
     * Class name of the row toggle button element
     */
    rowToggleButton = 'h-datatable-row-toggle-button',
    /**
     * Class name of the row toggle icon element
     */
    rowToggleIcon = 'h-datatable-row-toggle-icon',
    /**
     * Class name of the row expansion element
     */
    rowExpansion = 'h-datatable-row-expansion',
    /**
     * Class name of the row group footer element
     */
    rowGroupFooter = 'h-datatable-row-group-footer',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'h-datatable-empty-message',
    /**
     * Class name of the reorderable row handle element
     */
    reorderableRowHandle = 'h-datatable-reorderable-row-handle',
    /**
     * Class name of the row editor init element
     */
    pcRowEditorInit = 'h-datatable-row-editor-init',
    /**
     * Class name of the row editor save element
     */
    pcRowEditorSave = 'h-datatable-row-editor-save',
    /**
     * Class name of the row editor cancel element
     */
    pcRowEditorCancel = 'h-datatable-row-editor-cancel',
    /**
     * Class name of the tfoot element
     */
    tfoot = 'h-datatable-tfoot',
    /**
     * Class name of the virtual scroller spacer element
     */
    virtualScrollerSpacer = 'h-datatable-virtualscroller-spacer',
    /**
     * Class name of the footer element
     */
    footer = 'h-datatable-footer',
    /**
     * Class name of the column resize indicator element
     */
    columnResizeIndicator = 'h-datatable-column-resize-indicator',
    /**
     * Class name of the row reorder indicator up element
     */
    rowReorderIndicatorUp = 'h-datatable-row-reorder-indicator-up',
    /**
     * Class name of the row reorder indicator down element
     */
    rowReorderIndicatorDown = 'h-datatable-row-reorder-indicator-down',
    /**
     * Class name of the sortable column element
     */
    sortableColumn = 'h-datatable-sortable-column',
    /**
     * Class name of the sortable column icon element
     */
    sortableColumnIcon = 'h-sortable-column-icon',
    /**
     * Class name of the sortable column badge element
     */
    sortableColumnBadge = 'h-sortable-column-badge',
    /**
     * Class name of the selectable row element
     */
    selectableRow = 'h-datatable-selectable-row',
    /**
     * Class name of the resizable column element
     */
    resizableColumn = 'h-datatable-resizable-column',
    /**
     * Class name of the row editor cancel element
     */
    rowEditorCancel = 'h-datatable-row-editor-cancel',
    /**
     * Class name of the frozen column element
     */
    frozenColumn = 'h-datatable-frozen-column',
    /**
     * Class name of the contextmenu row selected element
     */
    contextMenuRowSelected = 'h-datatable-contextmenu-row-selected'
}
