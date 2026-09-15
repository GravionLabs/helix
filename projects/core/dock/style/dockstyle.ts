import { Injectable } from '@angular/core';
import { style } from './dock.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-dock h-component',
        `h-dock-${instance.position()}`,
        {
            'h-dock-mobile': instance.queryMatches()
        }
    ],
    listContainer: 'h-dock-list-container',
    list: 'h-dock-list',
    item: ({ instance, item, id }) => [
        'h-dock-item',
        {
            'h-focus': instance.isItemActive(id),
            'h-disabled': instance.disabled(item)
        }
    ],
    itemContent: 'h-dock-item-content',
    itemLink: 'h-dock-item-link',
    itemIcon: 'h-dock-item-icon'
};

@Injectable()
export class DockStyle extends BaseStyle {
    name = 'dock';

    style = style;

    classes = classes;
}

/**
 *
 * Dock is a navigation component consisting of menuitems.
 *
 * [Live Demo](https://www.primeng.org/dock/)
 *
 * @module dockstyle
 *
 */
export enum DockClasses {
    /**
     * Class name of the root element
     */
    root = 'h-dock',
    /**
     * Class name of the list container element
     */
    listContainer = 'h-dock-list-container',
    /**
     * Class name of the list element
     */
    list = 'h-dock-list',
    /**
     * Class name of the item element
     */
    item = 'h-dock-item',
    /**
     * Class name of the item content element
     */
    itemContent = 'h-dock-item-content',
    /**
     * Class name of the item link element
     */
    itemLink = 'h-dock-item-link',
    /**
     * Class name of the item icon element
     */
    itemIcon = 'h-dock-item-icon'
}

export interface DockStyle extends BaseStyle {}
