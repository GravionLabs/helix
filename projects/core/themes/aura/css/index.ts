import { ExtendedCSS } from '@gravionlabs/helix-core/themes/types';

const css = /*css*/ `
    li.h-autocomplete-option,
    div.h-cascadeselect-option-content,
    li.h-listbox-option,
    li.h-multiselect-option,
    li.h-select-option,
    li.h-listbox-option,
    div.h-tree-node-content,
    li.h-datatable-filter-constraint,
    .h-datatable .h-datatable-tbody > tr,
    .h-treetable .h-treetable-tbody > tr,
    div.h-menu-item-content,
    div.h-tieredmenu-item-content,
    div.h-contextmenu-item-content,
    div.h-menubar-item-content,
    div.h-megamenu-item-content,
    div.h-panelmenu-header-content,
    div.h-panelmenu-item-content,
    th.h-datatable-header-cell,
    th.h-treetable-header-cell,
    thead.h-datatable-thead > tr > th,
    .h-treetable thead.h-treetable-thead>tr>th {
        transition: none;
    }
`;

export default css satisfies ExtendedCSS;
