import { Injectable } from '@angular/core';
import { style as scrollpanel_style } from './scrollpanel.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${scrollpanel_style}

    .h-scrollpanel {
        display: block;
    }
`;

const classes = {
    root: 'h-scrollpanel h-component',
    contentContainer: 'h-scrollpanel-content-container',
    content: 'h-scrollpanel-content',
    barX: 'h-scrollpanel-bar h-scrollpanel-bar-x',
    barY: 'h-scrollpanel-bar h-scrollpanel-bar-y'
};

@Injectable()
export class ScrollPanelStyle extends BaseStyle {
    name = 'scrollpanel';

    style = style;

    classes = classes;
}

/**
 *
 * ScrollPanel is a cross browser, lightweight and themable alternative to native browser scrollbar.
 *
 * [Live Demo](https://www.primeng.org/scrollpanel/)
 *
 * @module scrollpanelstyle
 *
 */
export enum ScrollPanelClasses {
    /**
     * Class name of the root element
     */
    root = 'h-scrollpanel',
    /**
     * Class name of the content container element
     */
    contentContainer = 'h-scrollpanel-content-container',
    /**
     * Class name of the content element
     */
    content = 'h-scrollpanel-content',
    /**
     * Class name of the bar x element
     */
    barX = 'h-scrollpanel-bar-x',
    /**
     * Class name of the bar y element
     */
    barY = 'h-scrollpanel-bar-y'
}

export interface ScrollPanelStyle extends BaseStyle {}
