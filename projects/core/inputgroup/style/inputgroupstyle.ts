import { Injectable } from '@angular/core';
import { style as inputgroup_style } from './inputgroup.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${inputgroup_style}

    /*For Helix*/

    .h-inputgroup > .h-component,
    .h-inputgroup > .h-inputwrapper > .h-component,
    .h-inputgroup:first-child > h-button > .h-button,
    .h-inputgroup > .h-floatlabel > .h-component,
    .h-inputgroup > .h-floatlabel > .h-inputwrapper > .h-component,
    .h-inputgroup > .h-iftalabel > .h-component,
    .h-inputgroup > .h-iftalabel > .h-inputwrapper > .h-component {
        border-radius: 0;
        margin: 0;
    }

    .h-inputgroup h-button:first-child,
    .h-inputgroup h-button:last-child {
        display: inline-flex;
    }

    .h-inputgroup:has(> h-button:first-child) .h-button {
        border-start-start-radius: dt('inputgroup.addon.border.radius');
        border-end-start-radius: dt('inputgroup.addon.border.radius');
    }

    .h-inputgroup:has(> h-button:last-child) .h-button {
        border-start-end-radius: dt('inputgroup.addon.border.radius');
        border-end-end-radius: dt('inputgroup.addon.border.radius');
    }

    .h-inputgroup > h-inputmask > .h-inputtext {
        width: 100%;
    }
`;

const classes = {
    root: ({ instance }) => [
        'h-inputgroup',
        {
            'h-inputgroup-fluid': instance.fluid
        }
    ]
};

@Injectable()
export class InputGroupStyle extends BaseStyle {
    name = 'inputgroup';

    style = style;

    classes = classes;
}

/**
 *
 * InputGroup displays text, icon, buttons and other content can be grouped next to an input.
 *
 * [Live Demo](https://www.primeng.org/inputgroup/)
 *
 * @module inputgroupstyle
 *
 */

export enum InputGroupClasses {
    /**
     * Class name of the root element
     */
    root = 'h-inputgroup'
}

export interface InputGroupStyle extends BaseStyle {}
