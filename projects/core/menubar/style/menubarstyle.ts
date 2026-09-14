import { Injectable } from '@angular/core';
import { style } from './menubar.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const inlineStyles = {
    submenu: ({ instance, processedItem }) => ({ display: instance.isItemActive(processedItem) ? 'flex' : 'none' })
};

const classes = {
    root: ({ instance }) => [
        'h-menubar h-component',
        {
            'h-menubar-mobile': instance.queryMatches(),
            'h-menubar-mobile-active': instance.mobileActive
        }
    ],
    start: 'h-menubar-start',
    button: 'h-menubar-button',
    rootList: 'h-menubar-root-list',
    item: ({ instance, processedItem }) => [
        'h-menubar-item',
        {
            'h-menubar-item-active': instance.isItemActive(processedItem),
            'h-focus': instance.isItemFocused(processedItem),
            'h-disabled': instance.isItemDisabled(processedItem)
        }
    ],
    itemContent: 'h-menubar-item-content',
    itemLink: 'h-menubar-item-link',
    itemIcon: 'h-menubar-item-icon',
    itemLabel: 'h-menubar-item-label',
    submenuIcon: 'h-menubar-submenu-icon',
    submenu: 'h-menubar-submenu',
    separator: 'h-menubar-separator',
    end: 'h-menubar-end'
};

@Injectable()
export class MenuBarStyle extends BaseStyle {
    name = 'menubar';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * Menubar is a horizontal menu component.
 *
 * [Live Demo](https://www.primeng.org/menubar/)
 *
 * @module menubarstyle
 *
 */
export enum MenubarClasses {
    /**
     * Class name of the root element
     */
    root = 'h-menubar',
    /**
     * Class name of the start element
     */
    start = 'h-menubar-start',
    /**
     * Class name of the button element
     */
    button = 'h-menubar-button',
    /**
     * Class name of the root list element
     */
    rootList = 'h-menubar-root-list',
    /**
     * Class name of the item element
     */
    item = 'h-menubar-item',
    /**
     * Class name of the item content element
     */
    itemContent = 'h-menubar-item-content',
    /**
     * Class name of the item link element
     */
    itemLink = 'h-menubar-item-link',
    /**
     * Class name of the item icon element
     */
    itemIcon = 'h-menubar-item-icon',
    /**
     * Class name of the item label element
     */
    itemLabel = 'h-menubar-item-label',
    /**
     * Class name of the submenu icon element
     */
    submenuIcon = 'h-menubar-submenu-icon',
    /**
     * Class name of the submenu element
     */
    submenu = 'h-menubar-submenu',
    /**
     * Class name of the separator element
     */
    separator = 'h-menubar-separator',
    /**
     * Class name of the end element
     */
    end = 'h-menubar-end'
}

export interface MenubarStyle extends BaseStyle {}
