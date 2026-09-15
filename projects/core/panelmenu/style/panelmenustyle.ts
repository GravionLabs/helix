import { Injectable } from '@angular/core';
import { style as panelmenu_style } from './panelmenu.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${panelmenu_style}
    /*For Helix*/


    .h-panelmenu-root-list,
    .h-panelmenu-submenu,
    .h-panelmenu-item-link {
        outline: 0 none;
    }
`;

const classes = {
    root: () => ['h-panelmenu h-component'],
    panel: 'h-panelmenu-panel',
    header: ({ instance, item }) => [
        'h-panelmenu-header',
        {
            'h-panelmenu-header-active': instance.isItemActive(item) && !!item.items,
            'h-disabled': instance.isItemDisabled(item)
        }
    ],
    headerContent: 'h-panelmenu-header-content',
    headerLink: 'h-panelmenu-header-link',
    headerIcon: 'h-panelmenu-header-icon',
    headerLabel: 'h-panelmenu-header-label',
    contentContainer: ({ instance, processedItem }) => ['h-panelmenu-content-container', { 'h-panelmenu-expanded': instance.isItemActive(processedItem) }],
    contentWrapper: 'h-panelmenu-content-wrapper',
    content: 'h-panelmenu-content',
    rootList: 'h-panelmenu-root-list',
    item: ({ instance, processedItem }) => [
        'h-panelmenu-item',
        {
            'h-focus': instance.isItemFocused(processedItem) && !instance.isItemDisabled(processedItem),
            'h-disabled': instance.isItemDisabled(processedItem)
        }
    ],
    itemContent: 'h-panelmenu-item-content',
    itemLink: 'h-panelmenu-item-link',
    itemIcon: 'h-panelmenu-item-icon',
    itemLabel: 'h-panelmenu-item-label',
    submenuIcon: 'h-panelmenu-submenu-icon',
    submenu: 'h-panelmenu-submenu',
    separator: 'h-menuitem-separator',
    badge: 'h-menuitem-badge'
};

@Injectable()
export class PanelMenuStyle extends BaseStyle {
    name = 'panelmenu';

    style = style;

    classes = classes;
}

/**
 *
 * PanelMenu is a hybrid of Accordion and Tree components.
 *
 * [Live Demo](https://www.primeng.org/panelmenu/)
 *
 * @module panelmenustyle
 *
 */
export enum PanelMenuClasses {
    /**
     * Class name of the root element
     */
    root = 'h-panelmenu',
    /**
     * Class name of the panel element
     */
    panel = 'h-panelmenu-panel',
    /**
     * Class name of the header element
     */
    header = 'h-panelmenu-header',
    /**
     * Class name of the header content element
     */
    headerContent = 'h-panelmenu-header-content',
    /**
     * Class name of the header link element
     */
    headerLink = 'h-panelmenu-header-link',
    /**
     * Class name of the header icon element
     */
    headerIcon = 'h-panelmenu-header-icon',
    /**
     * Class name of the header label element
     */
    headerLabel = 'h-panelmenu-header-label',
    /**
     * Class name of the content container element
     */
    contentContainer = 'h-panelmenu-content-container',
    /**
     * Class name of the content element
     */
    content = 'h-panelmenu-content',
    /**
     * Class name of the root list element
     */
    rootList = 'h-panelmenu-root-list',
    /**
     * Class name of the item element
     */
    item = 'h-panelmenu-item',
    /**
     * Class name of the item content element
     */
    itemContent = 'h-panelmenu-item-content',
    /**
     * Class name of the item link element
     */
    itemLink = 'h-panelmenu-item-link',
    /**
     * Class name of the item icon element
     */
    itemIcon = 'h-panelmenu-item-icon',
    /**
     * Class name of the item label element
     */
    itemLabel = 'h-panelmenu-item-label',
    /**
     * Class name of the submenu icon element
     */
    submenuIcon = 'h-panelmenu-submenu-icon',
    /**
     * Class name of the submenu element
     */
    submenu = 'h-panelmenu-submenu',
    separator = 'h-menuitem-separator'
}

export interface PanelMenuStyle extends BaseStyle {}
