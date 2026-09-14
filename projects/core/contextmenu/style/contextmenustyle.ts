import { Injectable } from '@angular/core';
import { style } from './contextmenu.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const inlineStyles = {
    root: { position: 'absolute' }
};

const classes = {
    root: () => ['h-contextmenu h-component'],
    rootList: 'h-contextmenu-root-list',
    item: ({ instance, processedItem }) => [
        'h-contextmenu-item',
        {
            'h-contextmenu-item-active': instance.isItemActive(processedItem),
            'h-focus': instance.isItemFocused(processedItem),
            'h-disabled': instance.isItemDisabled(processedItem),
            'h-contextmenu-mobile': instance.queryMatches()
        }
    ],
    itemContent: 'h-contextmenu-item-content',
    itemLink: 'h-contextmenu-item-link',
    itemIcon: 'h-contextmenu-item-icon',
    itemLabel: 'h-contextmenu-item-label',
    submenuIcon: 'h-contextmenu-submenu-icon',
    submenu: 'h-contextmenu-submenu',
    separator: 'h-contextmenu-separator'
};

@Injectable()
export class ContextMenuStyle extends BaseStyle {
    name = 'contextmenu';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * ContextMenu displays an overlay menu on right click of its target. Note that components like DataTable has special integration with ContextMenu.
 * Refer to documentation of the individual documentation of the with context menu support.
 *
 * [Live Demo](https://www.primeng.org/contextmenu/)
 *
 * @module contextmenustyle
 *
 */
export enum ContextMenuClasses {
    /**
     * Class name of the root element
     */
    root = 'h-contextmenu',
    /**
     * Class name of the root list element
     */
    rootList = 'h-contextmenu-root-list',
    /**
     * Class name of the item element
     */
    item = 'h-contextmenu-item',
    /**
     * Class name of the item content element
     */
    itemContent = 'h-contextmenu-item-content',
    /**
     * Class name of the item link element
     */
    itemLink = 'h-contextmenu-item-link',
    /**
     * Class name of the item icon element
     */
    itemIcon = 'h-contextmenu-item-icon',
    /**
     * Class name of the item label element
     */
    itemLabel = 'h-contextmenu-item-label',
    /**
     * Class name of the submenu icon element
     */
    submenuIcon = 'h-contextmenu-submenu-icon',
    /**
     * Class name of the submenu element
     */
    submenu = 'h-contextmenu-submenu',
    /**
     * Class name of the separator element
     */
    separator = 'h-contextmenu-separator'
}

export interface ContextMenuStyle extends BaseStyle {}
