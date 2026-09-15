export const style = /*css*/ `
    .h-datatable {
        position: relative;
        display: block;
    }

    .h-datatable-table {
        border-spacing: 0;
        border-collapse: separate;
        width: 100%;
    }

    .h-datatable-scrollable > .h-datatable-table-container {
        position: relative;
    }

    .h-datatable-scrollable-table > .h-datatable-thead {
        inset-block-start: 0;
        z-index: 1;
    }

    .h-datatable-scrollable-table > .h-datatable-frozen-tbody {
        position: sticky;
        z-index: 1;
    }

    .h-datatable-scrollable-table > .h-datatable-tfoot {
        inset-block-end: 0;
        z-index: 1;
    }

    .h-datatable-scrollable .h-datatable-frozen-column {
        position: sticky;
    }

    .h-datatable-scrollable th.h-datatable-frozen-column {
        z-index: 1;
    }

    .h-datatable-scrollable td.h-datatable-frozen-column {
        background: inherit;
    }

    .h-datatable-scrollable > .h-datatable-table-container > .h-datatable-table > .h-datatable-thead,
    .h-datatable-scrollable > .h-datatable-table-container > .h-virtualscroller > .h-datatable-table > .h-datatable-thead {
        background: dt('datatable.header.cell.background');
    }

    .h-datatable-scrollable > .h-datatable-table-container > .h-datatable-table > .h-datatable-tfoot,
    .h-datatable-scrollable > .h-datatable-table-container > .h-virtualscroller > .h-datatable-table > .h-datatable-tfoot {
        background: dt('datatable.footer.cell.background');
    }

    .h-datatable-flex-scrollable {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .h-datatable-flex-scrollable > .h-datatable-table-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100%;
    }

    .h-datatable-scrollable-table > .h-datatable-tbody > .h-datatable-row-group-header {
        position: sticky;
        z-index: 1;
    }

    .h-datatable-resizable-table > .h-datatable-thead > tr > th,
    .h-datatable-resizable-table > .h-datatable-tfoot > tr > td,
    .h-datatable-resizable-table > .h-datatable-tbody > tr > td {
        overflow: hidden;
        white-space: nowrap;
    }

    .h-datatable-resizable-table > .h-datatable-thead > tr > th.h-datatable-resizable-column:not(.h-datatable-frozen-column) {
        background-clip: padding-box;
        position: relative;
    }

    .h-datatable-resizable-table-fit > .h-datatable-thead > tr > th.h-datatable-resizable-column:last-child .h-datatable-column-resizer {
        display: none;
    }

    .h-datatable-column-resizer {
        display: block;
        position: absolute;
        inset-block-start: 0;
        inset-inline-end: 0;
        margin: 0;
        width: dt('datatable.column.resizer.width');
        height: 100%;
        padding: 0;
        cursor: col-resize;
        border: 1px solid transparent;
    }

    .h-datatable-column-header-content {
        display: flex;
        align-items: center;
        gap: dt('datatable.header.cell.gap');
    }

    .h-datatable-column-resize-indicator {
        width: dt('datatable.resize.indicator.width');
        position: absolute;
        z-index: 10;
        display: none;
        background: dt('datatable.resize.indicator.color');
    }

    .h-datatable-row-reorder-indicator-up,
    .h-datatable-row-reorder-indicator-down {
        position: absolute;
        display: none;
    }

    .h-datatable-reorderable-column,
    .h-datatable-reorderable-row-handle {
        cursor: move;
    }

    .h-datatable-mask {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
    }

    .h-datatable-inline-filter {
        display: flex;
        align-items: center;
        width: 100%;
        gap: dt('datatable.filter.inline.gap');
    }

    .h-datatable-inline-filter .h-datatable-filter-element-container {
        flex: 1 1 auto;
        width: 1%;
    }

    .h-datatable-filter-overlay {
        background: dt('datatable.filter.overlay.select.background');
        color: dt('datatable.filter.overlay.select.color');
        border: 1px solid dt('datatable.filter.overlay.select.border.color');
        border-radius: dt('datatable.filter.overlay.select.border.radius');
        box-shadow: dt('datatable.filter.overlay.select.shadow');
        min-width: 12.5rem;
    }

    .h-datatable-filter-constraint-list {
        margin: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        padding: dt('datatable.filter.constraint.list.padding');
        gap: dt('datatable.filter.constraint.list.gap');
    }

    .h-datatable-filter-constraint {
        padding: dt('datatable.filter.constraint.padding');
        color: dt('datatable.filter.constraint.color');
        border-radius: dt('datatable.filter.constraint.border.radius');
        cursor: pointer;
        transition:
            background dt('datatable.transition.duration'),
            color dt('datatable.transition.duration'),
            border-color dt('datatable.transition.duration'),
            box-shadow dt('datatable.transition.duration');
    }

    .h-datatable-filter-constraint-selected {
        background: dt('datatable.filter.constraint.selected.background');
        color: dt('datatable.filter.constraint.selected.color');
    }

    .h-datatable-filter-constraint:not(.h-datatable-filter-constraint-selected):not(.h-disabled):hover {
        background: dt('datatable.filter.constraint.focus.background');
        color: dt('datatable.filter.constraint.focus.color');
    }

    .h-datatable-filter-constraint:focus-visible {
        outline: 0 none;
        background: dt('datatable.filter.constraint.focus.background');
        color: dt('datatable.filter.constraint.focus.color');
    }

    .h-datatable-filter-constraint-selected:focus-visible {
        outline: 0 none;
        background: dt('datatable.filter.constraint.selected.focus.background');
        color: dt('datatable.filter.constraint.selected.focus.color');
    }

    .h-datatable-filter-constraint-separator {
        border-block-start: 1px solid dt('datatable.filter.constraint.separator.border.color');
    }

    .h-datatable-popover-filter {
        display: inline-flex;
        margin-inline-start: auto;
    }

    .h-datatable-filter-overlay-popover {
        background: dt('datatable.filter.overlay.popover.background');
        color: dt('datatable.filter.overlay.popover.color');
        border: 1px solid dt('datatable.filter.overlay.popover.border.color');
        border-radius: dt('datatable.filter.overlay.popover.border.radius');
        box-shadow: dt('datatable.filter.overlay.popover.shadow');
        min-width: 12.5rem;
        padding: dt('datatable.filter.overlay.popover.padding');
        display: flex;
        flex-direction: column;
        gap: dt('datatable.filter.overlay.popover.gap');
    }

    .h-datatable-filter-operator-dropdown {
        width: 100%;
    }

    .h-datatable-filter-rule-list,
    .h-datatable-filter-rule {
        display: flex;
        flex-direction: column;
        gap: dt('datatable.filter.overlay.popover.gap');
    }

    .h-datatable-filter-rule {
        border-block-end: 1px solid dt('datatable.filter.rule.border.color');
        padding-bottom: dt('datatable.filter.overlay.popover.gap');
    }

    .h-datatable-filter-rule:last-child {
        border-block-end: 0 none;
        padding-bottom: 0;
    }

    .h-datatable-filter-add-rule-button {
        width: 100%;
    }

    .h-datatable-filter-remove-rule-button {
        width: 100%;
    }

    .h-datatable-filter-buttonbar {
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .h-datatable-virtualscroller-spacer {
        display: flex;
    }

    .h-datatable .h-virtualscroller .h-virtualscroller-loading {
        transform: none !important;
        min-height: 0;
        position: sticky;
        inset-block-start: 0;
        inset-inline-start: 0;
    }

    .h-datatable-paginator-top {
        border-color: dt('datatable.paginator.top.border.color');
        border-style: solid;
        border-width: dt('datatable.paginator.top.border.width');
    }

    .h-datatable-paginator-bottom {
        border-color: dt('datatable.paginator.bottom.border.color');
        border-style: solid;
        border-width: dt('datatable.paginator.bottom.border.width');
    }

    .h-datatable-header {
        background: dt('datatable.header.background');
        color: dt('datatable.header.color');
        border-color: dt('datatable.header.border.color');
        border-style: solid;
        border-width: dt('datatable.header.border.width');
        padding: dt('datatable.header.padding');
    }

    .h-datatable-footer {
        background: dt('datatable.footer.background');
        color: dt('datatable.footer.color');
        border-color: dt('datatable.footer.border.color');
        border-style: solid;
        border-width: dt('datatable.footer.border.width');
        padding: dt('datatable.footer.padding');
    }

    .h-datatable-header-cell {
        padding: dt('datatable.header.cell.padding');
        background: dt('datatable.header.cell.background');
        border-color: dt('datatable.header.cell.border.color');
        border-style: solid;
        border-width: 0 0 1px 0;
        color: dt('datatable.header.cell.color');
        font-weight: normal;
        text-align: start;
        transition:
            background dt('datatable.transition.duration'),
            color dt('datatable.transition.duration'),
            border-color dt('datatable.transition.duration'),
            outline-color dt('datatable.transition.duration'),
            box-shadow dt('datatable.transition.duration');
    }

    .h-datatable-column-title {
        font-weight: dt('datatable.column.title.font.weight');
    }

    .h-datatable-tbody > tr {
        outline-color: transparent;
        background: dt('datatable.row.background');
        color: dt('datatable.row.color');
        transition:
            background dt('datatable.transition.duration'),
            color dt('datatable.transition.duration'),
            border-color dt('datatable.transition.duration'),
            outline-color dt('datatable.transition.duration'),
            box-shadow dt('datatable.transition.duration');
    }

    .h-datatable-tbody > tr > td {
        text-align: start;
        border-color: dt('datatable.body.cell.border.color');
        border-style: solid;
        border-width: 0 0 1px 0;
        padding: dt('datatable.body.cell.padding');
    }

    .h-datatable-hoverable .h-datatable-tbody > tr:not(.h-datatable-row-selected):hover {
        background: dt('datatable.row.hover.background');
        color: dt('datatable.row.hover.color');
    }

    .h-datatable-tbody > tr.h-datatable-row-selected {
        background: dt('datatable.row.selected.background');
        color: dt('datatable.row.selected.color');
    }

    .h-datatable-tbody > tr:has(+ .h-datatable-row-selected) > td {
        border-block-end-color: dt('datatable.body.cell.selected.border.color');
    }

    .h-datatable-tbody > tr.h-datatable-row-selected > td {
        border-block-end-color: dt('datatable.body.cell.selected.border.color');
    }

    .h-datatable-tbody > tr:focus-visible,
    .h-datatable-tbody > tr.h-datatable-contextmenu-row-selected {
        box-shadow: dt('datatable.row.focus.ring.shadow');
        outline: dt('datatable.row.focus.ring.width') dt('datatable.row.focus.ring.style') dt('datatable.row.focus.ring.color');
        outline-offset: dt('datatable.row.focus.ring.offset');
    }

    .h-datatable-tfoot > tr > td {
        text-align: start;
        padding: dt('datatable.footer.cell.padding');
        border-color: dt('datatable.footer.cell.border.color');
        border-style: solid;
        border-width: 0 0 1px 0;
        color: dt('datatable.footer.cell.color');
        background: dt('datatable.footer.cell.background');
    }

    .h-datatable-column-footer {
        font-weight: dt('datatable.column.footer.font.weight');
    }

    .h-datatable-sortable-column {
        cursor: pointer;
        user-select: none;
        outline-color: transparent;
    }

    .h-datatable-column-title,
    .h-datatable-sort-icon,
    .h-datatable-sort-badge {
        vertical-align: middle;
    }

    .h-datatable-sort-icon {
        color: dt('datatable.sort.icon.color');
        font-size: dt('datatable.sort.icon.size');
        width: dt('datatable.sort.icon.size');
        height: dt('datatable.sort.icon.size');
        transition: color dt('datatable.transition.duration');
    }

    .h-datatable-sortable-column:not(.h-datatable-column-sorted):hover {
        background: dt('datatable.header.cell.hover.background');
        color: dt('datatable.header.cell.hover.color');
    }

    .h-datatable-sortable-column:not(.h-datatable-column-sorted):hover .h-datatable-sort-icon {
        color: dt('datatable.sort.icon.hover.color');
    }

    .h-datatable-column-sorted {
        background: dt('datatable.header.cell.selected.background');
        color: dt('datatable.header.cell.selected.color');
    }

    .h-datatable-column-sorted .h-datatable-sort-icon {
        color: dt('datatable.header.cell.selected.color');
    }

    .h-datatable-sortable-column:focus-visible {
        box-shadow: dt('datatable.header.cell.focus.ring.shadow');
        outline: dt('datatable.header.cell.focus.ring.width') dt('datatable.header.cell.focus.ring.style') dt('datatable.header.cell.focus.ring.color');
        outline-offset: dt('datatable.header.cell.focus.ring.offset');
    }

    .h-datatable-hoverable .h-datatable-selectable-row {
        cursor: pointer;
    }

    .h-datatable-tbody > tr.h-datatable-dragpoint-top > td {
        box-shadow: inset 0 2px 0 0 dt('datatable.drop.point.color');
    }

    .h-datatable-tbody > tr.h-datatable-dragpoint-bottom > td {
        box-shadow: inset 0 -2px 0 0 dt('datatable.drop.point.color');
    }

    .h-datatable-loading-icon {
        font-size: dt('datatable.loading.icon.size');
        width: dt('datatable.loading.icon.size');
        height: dt('datatable.loading.icon.size');
    }

    .h-datatable-gridlines .h-datatable-header {
        border-width: 1px 1px 0 1px;
    }

    .h-datatable-gridlines .h-datatable-footer {
        border-width: 0 1px 1px 1px;
    }

    .h-datatable-gridlines .h-datatable-paginator-top {
        border-width: 1px 1px 0 1px;
    }

    .h-datatable-gridlines .h-datatable-paginator-bottom {
        border-width: 0 1px 1px 1px;
    }

    .h-datatable-gridlines .h-datatable-thead > tr > th {
        border-width: 1px 0 1px 1px;
    }

    .h-datatable-gridlines .h-datatable-thead > tr > th:last-child {
        border-width: 1px;
    }

    .h-datatable-gridlines .h-datatable-tbody > tr > td {
        border-width: 1px 0 0 1px;
    }

    .h-datatable-gridlines .h-datatable-tbody > tr > td:last-child {
        border-width: 1px 1px 0 1px;
    }

    .h-datatable-gridlines .h-datatable-tbody > tr:last-child > td {
        border-width: 1px 0 1px 1px;
    }

    .h-datatable-gridlines .h-datatable-tbody > tr:last-child > td:last-child {
        border-width: 1px;
    }

    .h-datatable-gridlines .h-datatable-tfoot > tr > td {
        border-width: 1px 0 1px 1px;
    }

    .h-datatable-gridlines .h-datatable-tfoot > tr > td:last-child {
        border-width: 1px 1px 1px 1px;
    }

    .h-datatable.h-datatable-gridlines .h-datatable-thead + .h-datatable-tfoot > tr > td {
        border-width: 0 0 1px 1px;
    }

    .h-datatable.h-datatable-gridlines .h-datatable-thead + .h-datatable-tfoot > tr > td:last-child {
        border-width: 0 1px 1px 1px;
    }

    .h-datatable.h-datatable-gridlines:has(.h-datatable-thead):has(.h-datatable-tbody) .h-datatable-tbody > tr > td {
        border-width: 0 0 1px 1px;
    }

    .h-datatable.h-datatable-gridlines:has(.h-datatable-thead):has(.h-datatable-tbody) .h-datatable-tbody > tr > td:last-child {
        border-width: 0 1px 1px 1px;
    }

    .h-datatable.h-datatable-gridlines:has(.h-datatable-tbody):has(.h-datatable-tfoot) .h-datatable-tbody > tr:last-child > td {
        border-width: 0 0 0 1px;
    }

    .h-datatable.h-datatable-gridlines:has(.h-datatable-tbody):has(.h-datatable-tfoot) .h-datatable-tbody > tr:last-child > td:last-child {
        border-width: 0 1px 0 1px;
    }

    .h-datatable.h-datatable-striped .h-datatable-tbody > tr.h-row-odd {
        background: dt('datatable.row.striped.background');
    }

    .h-datatable.h-datatable-striped .h-datatable-tbody > tr.h-row-odd.h-datatable-row-selected {
        background: dt('datatable.row.selected.background');
        color: dt('datatable.row.selected.color');
    }

    .h-datatable-striped.h-datatable-hoverable .h-datatable-tbody > tr:not(.h-datatable-row-selected):hover {
        background: dt('datatable.row.hover.background');
        color: dt('datatable.row.hover.color');
    }

    .h-datatable.h-datatable-sm .h-datatable-header {
        padding: dt('datatable.header.sm.padding');
    }

    .h-datatable.h-datatable-sm .h-datatable-thead > tr > th {
        padding: dt('datatable.header.cell.sm.padding');
    }

    .h-datatable.h-datatable-sm .h-datatable-tbody > tr > td {
        padding: dt('datatable.body.cell.sm.padding');
    }

    .h-datatable.h-datatable-sm .h-datatable-tfoot > tr > td {
        padding: dt('datatable.footer.cell.sm.padding');
    }

    .h-datatable.h-datatable-sm .h-datatable-footer {
        padding: dt('datatable.footer.sm.padding');
    }

    .h-datatable.h-datatable-lg .h-datatable-header {
        padding: dt('datatable.header.lg.padding');
    }

    .h-datatable.h-datatable-lg .h-datatable-thead > tr > th {
        padding: dt('datatable.header.cell.lg.padding');
    }

    .h-datatable.h-datatable-lg .h-datatable-tbody > tr > td {
        padding: dt('datatable.body.cell.lg.padding');
    }

    .h-datatable.h-datatable-lg .h-datatable-tfoot > tr > td {
        padding: dt('datatable.footer.cell.lg.padding');
    }

    .h-datatable.h-datatable-lg .h-datatable-footer {
        padding: dt('datatable.footer.lg.padding');
    }

    .h-datatable-row-toggle-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        width: dt('datatable.row.toggle.button.size');
        height: dt('datatable.row.toggle.button.size');
        color: dt('datatable.row.toggle.button.color');
        border: 0 none;
        background: transparent;
        cursor: pointer;
        border-radius: dt('datatable.row.toggle.button.border.radius');
        transition:
            background dt('datatable.transition.duration'),
            color dt('datatable.transition.duration'),
            border-color dt('datatable.transition.duration'),
            outline-color dt('datatable.transition.duration'),
            box-shadow dt('datatable.transition.duration');
        outline-color: transparent;
        user-select: none;
    }

    .h-datatable-row-toggle-button:enabled:hover {
        color: dt('datatable.row.toggle.button.hover.color');
        background: dt('datatable.row.toggle.button.hover.background');
    }

    .h-datatable-tbody > tr.h-datatable-row-selected .h-datatable-row-toggle-button:hover {
        background: dt('datatable.row.toggle.button.selected.hover.background');
        color: dt('datatable.row.toggle.button.selected.hover.color');
    }

    .h-datatable-row-toggle-button:focus-visible {
        box-shadow: dt('datatable.row.toggle.button.focus.ring.shadow');
        outline: dt('datatable.row.toggle.button.focus.ring.width') dt('datatable.row.toggle.button.focus.ring.style') dt('datatable.row.toggle.button.focus.ring.color');
        outline-offset: dt('datatable.row.toggle.button.focus.ring.offset');
    }

    .h-datatable-row-toggle-icon:dir(rtl) {
        transform: rotate(180deg);
    }
`;
