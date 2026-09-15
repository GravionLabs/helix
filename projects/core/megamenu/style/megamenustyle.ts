import { Injectable } from '@angular/core';
import { style } from './megamenu.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const inlineStyles = {
    rootList: ({ instance }) => ({ 'max-height': instance.scrollHeight(), overflow: 'auto' })
};

const classes = {
    root: ({ instance }) => [
        'h-megamenu h-component',
        {
            'h-megamenu-mobile': instance.queryMatches(),
            'h-megamenu-mobile-active': instance.mobileActive,
            'h-megamenu-horizontal': instance.orientation() === 'horizontal',
            'h-megamenu-vertical': instance.orientation() === 'vertical'
        }
    ],
    start: 'h-megamenu-start',
    button: 'h-megamenu-button',
    rootList: 'h-megamenu-root-list',
    submenuLabel: ({ instance, processedItem }) => [
        'h-megamenu-submenu-label',
        {
            'h-disabled': instance.isItemDisabled(processedItem)
        }
    ],
    item: ({ instance, processedItem }) => [
        'h-megamenu-item',
        instance.getItemProp(processedItem, 'styleClass'),
        instance.getItemProp(processedItem, 'class'),
        {
            'h-megamenu-item-active': instance.isItemActive(processedItem),
            'h-focus': instance.isItemFocused(processedItem),
            'h-disabled': instance.isItemDisabled(processedItem)
        }
    ],
    itemContent: 'h-megamenu-item-content',
    itemLink: 'h-megamenu-item-link',
    itemIcon: 'h-megamenu-item-icon',
    itemLabel: 'h-megamenu-item-label',
    submenuIcon: 'h-megamenu-submenu-icon',
    overlay: 'h-megamenu-overlay',
    grid: 'h-megamenu-grid',
    column: ({ instance, processedItem }) => {
        let length = instance.isItemGroup(processedItem) ? processedItem.items.length : 0;
        let columnClass;

        if (instance.megaMenu.queryMatches()) columnClass = 'h-megamenu-col-12';
        else {
            switch (length) {
                case 2:
                    columnClass = 'h-megamenu-col-6';
                    break;

                case 3:
                    columnClass = 'h-megamenu-col-4';
                    break;

                case 4:
                    columnClass = 'h-megamenu-col-3';
                    break;

                case 6:
                    columnClass = 'h-megamenu-col-2';
                    break;

                default:
                    columnClass = 'h-megamenu-col-12';
                    break;
            }
        }

        return columnClass;
    },
    submenu: 'h-megamenu-submenu',
    separator: 'h-megamenu-separator',
    end: 'h-megamenu-end'
};

@Injectable()
export class MegaMenuStyle extends BaseStyle {
    name = 'megamenu';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * MegaMenu is navigation component that displays submenus together.
 *
 * [Live Demo](https://www.primeng.org/megamenu/)
 *
 * @module megamenustyle
 *
 */

export enum MegaMenuClasses {
    /**
     * Class name of the root element
     */
    root = 'h-megamenu',
    /**
     * Class name of the start element
     */
    start = 'h-megamenu-start',
    /**
     * Class name of the button element
     */
    button = 'h-megamenu-button',
    /**
     * Class name of the root list element
     */
    rootList = 'h-megamenu-root-list',
    /**
     * Class name of the submenu item element
     */
    submenuItem = 'h-megamenu-submenu-item',
    /**
     * Class name of the item element
     */
    item = 'h-megamenu-item',
    /**
     * Class name of the item content element
     */
    itemContent = 'h-megamenu-item-content',
    /**
     * Class name of the item link element
     */
    itemLink = 'h-megamenu-item-link',
    /**
     * Class name of the item icon element
     */
    itemIcon = 'h-megamenu-item-icon',
    /**
     * Class name of the item label element
     */
    itemLabel = 'h-megamenu-item-label',
    /**
     * Class name of the submenu icon element
     */
    submenuIcon = 'h-megamenu-submenu-icon',
    /**
     * Class name of the panel element
     */
    panel = 'h-megamenu-panel',
    /**
     * Class name of the grid element
     */
    grid = 'h-megamenu-grid',
    /**
     * Class name of the submenu element
     */
    submenu = 'h-megamenu-submenu',
    /**
     * Class name of the submenu item label element
     */
    submenuItemLabel = 'h-megamenu-submenu-item-label',
    /**
     * Class name of the separator element
     */
    separator = 'h-megamenu-separator',
    /**
     * Class name of the end element
     */
    end = 'h-megamenu-end'
}

export interface MegaMenuStyle extends BaseStyle {}
