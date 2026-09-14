import { Injectable } from '@angular/core';
import { style } from './tabs.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-tabs h-component',
        {
            'h-tabs-scrollable': instance.scrollable()
        }
    ]
};

@Injectable()
export class TabsStyle extends BaseStyle {
    name = 'tabs';

    style = style;

    classes = classes;
}

/**
 *
 * Tabs facilitates seamless switching between different views.
 *
 * [Live Demo](https://www.primeng.org/tabs/)
 *
 * @module tabsstyle
 *
 */

export enum TabsClasses {
    /**
     * Class name of the root element
     */
    root = 'h-tabs',
    /**
     * Class name of the wrapper element
     */
    list = 'h-tablist',
    /**
     * Class name of the content element
     */
    content = 'h-tablist-content',
    /**
     * Class name of the tab list element
     */
    tablist = 'h-tablist-tab-list',
    /**
     * Class name of the tab list element
     */
    tab = 'h-tab',
    /**
     * Class name of the inkbar element
     */
    inkbar = 'h-tablist-active-bar',
    /**
     * Class name of the navigation buttons
     */
    button = 'h-tablist-nav-button',
    /**
     * Class name of the tab panels wrapper
     */
    tabpanels = 'h-tabpanels',
    /**
     * Class name of the tab panel element
     */
    tabpanel = 'h-tabs-panel'
}

export interface TabsStyle extends BaseStyle {}
