import { Injectable } from '@angular/core';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const css = /*css*/ `
.h-virtualscroller {
    position: relative;
    overflow: auto;
    contain: strict;
    transform: translateZ(0);
    will-change: scroll-position;
    outline: 0 none;
}

.h-virtualscroller-content {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 100%;
    min-width: 100%;
    will-change: transform;
}

.h-virtualscroller-spacer {
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 1px;
    transform-origin: 0 0;
    pointer-events: none;
}

.h-virtualscroller-loader {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: dt('virtualscroller.loader.mask.background');
    color: dt('virtualscroller.loader.mask.color');
}

.h-virtualscroller-loader-mask {
    display: flex;
    align-items: center;
    justify-content: center;
}

.h-virtualscroller-loading-icon {
    font-size: dt('virtualscroller.loader.icon.size');
    width: dt('virtualscroller.loader.icon.size');
    height: dt('virtualscroller.loader.icon.size');
}

.h-virtualscroller-horizontal > .h-virtualscroller-content {
    display: flex;
}

.h-virtualscroller-inline .h-virtualscroller-content {
    position: static;
}
`;

const classes = {
    root: ({ instance }) => [
        'h-virtualscroller',
        {
            'h-virtualscroller-inline': instance.inline,
            'h-virtualscroller-both h-both-scroll': instance.both,
            'h-virtualscroller-horizontal h-horizontal-scroll': instance.horizontal
        }
    ],
    content: 'h-virtualscroller-content',
    spacer: 'h-virtualscroller-spacer',
    loader: ({ instance }) => [
        'h-virtualscroller-loader',
        {
            'h-virtualscroller-loader-mask': !instance.loaderTemplate
        }
    ],
    loadingIcon: 'h-virtualscroller-loading-icon'
};

@Injectable()
export class ScrollerStyle extends BaseStyle {
    name = 'virtualscroller';

    css = css;

    classes = classes;
}

/**
 *
 * VirtualScroller is a performant approach to handle huge data efficiently.
 *
 * [Live Demo](https://www.primeng.org/scroller/)
 *
 * @module scrollerstyle
 *
 */
export enum ScrollerClasses {
    /**
     * Class name of the root element
     */
    root = 'h-virtualscroller',
    /**
     * Class name of the content element
     */
    content = 'h-virtualscroller-content',
    /**
     * Class name of the spacer element
     */
    spacer = 'h-virtualscroller-spacer',
    /**
     * Class name of the loader element
     */
    loader = 'h-virtualscroller-loader',
    /**
     * Class name of the loading icon element
     */
    loadingIcon = 'h-virtualscroller-loading-icon'
}

export interface ScrollerStyle extends BaseStyle {}
