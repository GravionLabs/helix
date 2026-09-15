import { Injectable } from '@angular/core';
import { style } from './tieredmenu.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const inlineStyles = {
    submenu: ({ instance, processedItem }) => ({ display: instance.isItemActive(processedItem) ? 'flex' : 'none' })
};

const classes = {
    root: ({ instance }) => [
        'h-tieredmenu h-component',
        {
            'h-tieredmenu-overlay': instance.popup,
            'h-tieredmenu-mobile': instance.queryMatches()
        }
    ],
    start: 'h-tieredmenu-start',
    rootList: 'h-tieredmenu-root-list',
    item: ({ instance, processedItem }) => [
        'h-tieredmenu-item',
        {
            'h-tieredmenu-item-active': instance.isItemActive(processedItem),
            'h-focus': instance.isItemFocused(processedItem),
            'h-disabled': instance.isItemDisabled(processedItem)
        }
    ],
    itemContent: 'h-tieredmenu-item-content',
    itemLink: 'h-tieredmenu-item-link',
    itemIcon: 'h-tieredmenu-item-icon',
    itemLabel: 'h-tieredmenu-item-label',
    itemBadge: 'h-menuitem-badge',
    submenuIcon: 'h-tieredmenu-submenu-icon',
    submenu: 'h-tieredmenu-submenu',
    separator: 'h-tieredmenu-separator',
    end: 'h-tieredmenu-end'
};

@Injectable()
export class TieredMenuStyle extends BaseStyle {
    name = 'tieredmenu';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * TieredMenu displays submenus in nested overlays.
 *
 * [Live Demo](https://www.primeng.org/menu/)
 *
 * @module tieredmenustyle
 *
 */
export enum TieredMenuClasses {
    /**
     * Class name of the root element
     */
    root = 'h-tieredmenu',
    /**
     * Class name of the start element
     */
    start = 'h-tieredmenu-start',
    /**
     * Class name of the root list element
     */
    rootList = 'h-tieredmenu-root-list',
    /**
     * Class name of the item element
     */
    item = 'h-tieredmenu-item',
    /**
     * Class name of the item content element
     */
    itemContent = 'h-tieredmenu-item-content',
    /**
     * Class name of the item link element
     */
    itemLink = 'h-tieredmenu-item-link',
    /**
     * Class name of the item icon element
     */
    itemIcon = 'h-tieredmenu-item-icon',
    /**
     * Class name of the item label element
     */
    itemLabel = 'h-tieredmenu-item-label',
    /**
     * Class name of the submenu icon element
     */
    submenuIcon = 'h-tieredmenu-submenu-icon',
    /**
     * Class name of the submenu element
     */
    submenu = 'h-tieredmenu-submenu',
    /**
     * Class name of the separator element
     */
    separator = 'h-tieredmenu-separator',
    /**
     * Class name of the end element
     */
    end = 'h-tieredmenu-end'
}

export interface TieredMenuStyle extends BaseStyle {}
