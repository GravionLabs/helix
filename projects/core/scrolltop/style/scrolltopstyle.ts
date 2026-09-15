import { Injectable } from '@angular/core';
import { style } from './scrolltop.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => ['h-scrolltop', { 'h-scrolltop-sticky': instance.target !== 'window' }],
    icon: 'h-scrolltop-icon'
};

@Injectable()
export class ScrollTopStyle extends BaseStyle {
    name = 'scrolltop';

    style = style;

    classes = classes;
}

/**
 *
 * ScrollTop gets displayed after a certain scroll position and used to navigates to the top of the page quickly.
 *
 * [Live Demo](https://www.primeng.org/scrolltop/)
 *
 * @module scrolltopstyle
 *
 */
export enum ScrollTopClasses {
    /**
     * Class name of the root element
     */
    root = 'h-scrolltop',
    /**
     * Class name of the icon element
     */
    icon = 'h-scrolltop-icon'
}

export interface ScrollTopStyle extends BaseStyle {}
