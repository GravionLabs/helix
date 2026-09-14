import { Injectable } from '@angular/core';
import { style as ripple_style } from './ripple.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${ripple_style}

    /* For Helix */
    .h-ripple {
        overflow: hidden;
        position: relative;
    }

    .h-ripple-disabled .h-ink {
        display: none !important;
    }

    @keyframes ripple {
        100% {
            opacity: 0;
            transform: scale(2.5);
        }
    }
`;

const classes = {
    root: 'h-ink'
};

@Injectable()
export class RippleStyle extends BaseStyle {
    name = 'ripple';

    style = style;

    classes = classes;
}

/**
 *
 * Ripple directive adds ripple effect to the host element.
 *
 * [Live Demo](https://www.primeng.org/ripple)
 *
 * @module ripplestyle
 *
 */

export enum RippleClasses {
    /**
     * Class name of the root element
     */
    root = 'h-ink'
}

export interface RippleStyle extends BaseStyle {}
