import { Injectable } from '@angular/core';
import { style } from './menu.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const inlineStyles = {
    root: ({ instance }) => ({ position: instance.popup() ? 'absolute' : 'relative' })
};

const classes = {
    root: ({ instance }) => [
        'h-menu h-component',
        {
            'h-menu-overlay': instance.popup()
        }
    ],
    start: 'h-menu-start',
    list: 'h-menu-list',
    submenuLabel: 'h-menu-submenu-label',
    separator: 'h-menu-separator',
    end: 'h-menu-end',
    item: ({ instance, item, id }) => [
        'h-menu-item',
        {
            'h-focus': instance.focusedOptionId() && id === instance.focusedOptionId(),
            'h-disabled': instance.disabled(item.disabled)
        },
        item.styleClass
    ],
    itemContent: 'h-menu-item-content',
    itemLink: 'h-menu-item-link',
    itemIcon: ({ item }) => ['h-menu-item-icon', item.icon, item.iconClass],
    itemLabel: 'h-menu-item-label'
};

@Injectable()
export class MenuStyle extends BaseStyle {
    name = 'menu';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * Menu is a navigation / command component that supports dynamic and static positioning.
 *
 * [Live Demo](https://www.primeng.org/menu/)
 *
 * @module menustyle
 *
 */

export enum MenuClasses {
    /**
     * Class name of the root element
     */
    root = 'h-menu',
    /**
     * Class name of the start element
     */
    start = 'h-menu-start',
    /**
     * Class name of the list element
     */
    list = 'h-menu-list',
    /**
     * Class name of the submenu item element
     */
    submenuItem = 'h-menu-submenu-item',
    /**
     * Class name of the separator element
     */
    separator = 'h-menu-separator',
    /**
     * Class name of the end element
     */
    end = 'h-menu-end',
    /**
     * Class name of the item element
     */
    item = 'h-menu-item',
    /**
     * Class name of the item content element
     */
    itemContent = 'h-menu-item-content',
    /**
     * Class name of the item link element
     */
    itemLink = 'h-menu-item-link',
    /**
     * Class name of the item icon element
     */
    itemIcon = 'h-menu-item-icon',
    /**
     * Class name of the item label element
     */
    itemLabel = 'h-menu-item-label'
}

export interface MenuStyle extends BaseStyle {}
