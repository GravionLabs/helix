import { Injectable } from '@angular/core';
import { style } from './tree.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-tree h-component',
        {
            'h-tree-selectable': instance.selectionMode != null,
            'h-tree-loading': instance.loading,
            'h-tree-flex-scrollable': instance.scrollHeight === 'flex',
            'h-tree-node-dragover': instance.dragHover
        }
    ],
    mask: 'h-tree-mask h-overlay-mask',
    loadingIcon: 'h-tree-loading-icon',
    pcFilterInput: 'h-tree-filter-input',
    wrapper: 'h-tree-root',
    rootChildren: 'h-tree-root-children',
    node: ({ instance }) => ({ 'h-tree-node': true, 'h-tree-node-leaf': instance.isLeaf() }),
    nodeContent: ({ instance }) => ({
        'h-tree-node-content': true,
        'h-tree-node-selectable': instance.selectable,
        'h-tree-node-dragover': instance.isNodeDropActive(),
        'h-tree-node-selected': instance.selectionMode === 'checkbox' && instance.tree.highlightOnSelect ? instance.checked : instance.selected,
        'h-tree-node-contextmenu-selected': instance.isContextMenuSelected()
    }),
    nodeToggleButton: 'h-tree-node-toggle-button',
    nodeToggleIcon: 'h-tree-node-toggle-icon',
    nodeCheckbox: 'h-tree-node-checkbox',
    nodeIcon: 'h-tree-node-icon',
    nodeLabel: 'h-tree-node-label',
    nodeChildren: 'h-tree-node-children',
    emptyMessage: 'h-tree-empty-message',
    dropPoint: 'h-tree-node-drop-point'
};

@Injectable()
export class TreeStyle extends BaseStyle {
    name = 'tree';

    style = style;

    classes = classes;
}

/**
 *
 * Tree is used to display hierarchical data.
 *
 * [Live Demo](https://www.primeng.org/tree/)
 *
 * @module treestyle
 *
 */
export enum TreeClasses {
    /**
     * Class name of the root element
     */
    root = 'h-tree',
    /**
     * Class name of the mask element
     */
    mask = 'h-tree-mask',
    /**
     * Class name of the loading icon element
     */
    loadingIcon = 'h-tree-loading-icon',
    /**
     * Class name of the filter input element
     */
    pcFilterInput = 'h-tree-filter-input',
    /**
     * Class name of the wrapper element
     */
    wrapper = 'h-tree-root',
    /**
     * Class name of the root children element
     */
    rootChildren = 'h-tree-root-children',
    /**
     * Class name of the node element
     */
    node = 'h-tree-node',
    /**
     * Class name of the node content element
     */
    nodeContent = 'h-tree-node-content',
    /**
     * Class name of the node toggle button element
     */
    nodeToggleButton = 'h-tree-node-toggle-button',
    /**
     * Class name of the node toggle icon element
     */
    nodeToggleIcon = 'h-tree-node-toggle-icon',
    /**
     * Class name of the node checkbox element
     */
    nodeCheckbox = 'h-tree-node-checkbox',
    /**
     * Class name of the node icon element
     */
    nodeIcon = 'h-tree-node-icon',
    /**
     * Class name of the node label element
     */
    nodeLabel = 'h-tree-node-label',
    /**
     * Class name of the node children element
     */
    nodeChildren = 'h-tree-node-children',
    /**
     * Class name of the empty message element
     */
    emptyMessage = 'h-tree-empty-message',
    /**
     * Class name of the drop point element
     */
    dropPoint = 'h-tree-node-droppoint'
}

export interface TreeStyle extends BaseStyle {}
