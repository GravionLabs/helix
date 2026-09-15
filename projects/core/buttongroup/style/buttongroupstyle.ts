import { Injectable } from '@angular/core';
import { style as buttongroup_style } from './buttongroup.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${buttongroup_style}

    /* For Helix */
    .h-buttongroup h-button:focus .h-button {
        position: relative;
        z-index: 1;
    }

    .h-buttongroup h-button:not(:last-child) .h-button,
    .h-buttongroup h-button:not(:last-child) .h-button:hover {
        border-right: 0 none;
    }

    .h-buttongroup h-button:not(:first-of-type):not(:last-of-type) .h-button {
        border-radius: 0;
    }

    .h-buttongroup h-button:first-of-type:not(:only-of-type) .h-button {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .h-buttongroup h-button:last-of-type:not(:only-of-type) .h-button {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
    }
`;

const classes = {
    root: 'h-buttongroup h-component'
};

@Injectable()
export class ButtonGroupStyle extends BaseStyle {
    name = 'buttongroup';

    style = style;

    classes = classes;
}

/**
 *
 * A set of Buttons can be displayed together using the ButtonGroup component.
 *
 * [Live Demo](https://www.primeng.org/button/)
 *
 * @module buttongroupstyle
 *
 */
export enum ButtonGroupClasses {
    /**
     * Class name of the root element
     */
    root = 'h-buttongroup'
}

export interface ButtonGroupStyle extends BaseStyle {}
