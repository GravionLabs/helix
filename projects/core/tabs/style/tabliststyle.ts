import { Injectable } from '@angular/core';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: 'h-tablist',
    content: 'h-tablist-content h-tablist-viewport',
    tabList: 'h-tablist-tab-list',
    activeBar: 'h-tablist-active-bar',
    prevButton: 'h-tablist-prev-button h-tablist-nav-button',
    nextButton: 'h-tablist-next-button h-tablist-nav-button'
};

@Injectable()
export class TabListStyle extends BaseStyle {
    name = 'tablist';

    classes = classes;
}

/**
 *
 * Tabs facilitates seamless switching between different views.
 *
 * [Live Demo](https://www.primeng.org/tabs/)
 *
 * @module tabliststyle
 *
 */

export enum TabListClasses {
    /**
     * Class name of the root element
     */
    root = 'h-tablist',
    /**
     * Class name of the content element
     */
    content = 'h-tablist-content',
    /**
     * Class name of the tabs element
     */
    tabList = 'h-tablist-tab-list',
    /**
     * Class name of the activebar element
     */
    activeBar = 'h-tablist-active-bar',
    /**
     * Class name of the previous button element
     */
    prevButton = 'h-tablist-prev-button',
    /**
     * Class name of the next button element
     */
    nextButton = 'h-tablist-next-button'
}

export interface TabListStyle extends BaseStyle {}
