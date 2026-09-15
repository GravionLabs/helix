import { Injectable } from '@angular/core';
import { style as selectbutton_style } from './selectbutton.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${selectbutton_style}

    /* For Helix */
    .h-selectbutton.ng-invalid.ng-dirty {
        outline: 1px solid dt('selectbutton.invalid.border.color');
        outline-offset: 0;
    }
`;

const classes = {
    root: ({ instance }) => [
        'h-selectbutton h-component',
        {
            'h-invalid': instance.invalid(),
            'h-selectbutton-fluid': instance.fluid()
        }
    ]
};

@Injectable()
export class SelectButtonStyle extends BaseStyle {
    name = 'selectbutton';

    style = style;

    classes = classes;
}

/**
 *
 * SelectButton is used to choose single or multiple items from a list using buttons.
 *
 * [Live Demo](https://www.primeng.org/selectbutton/)
 *
 * @module selectbuttonstyle
 *
 */
export enum SelectButtonClasses {
    /**
     * Class name of the root element
     */
    root = 'h-selectbutton'
}

export interface SelectButtonStyle extends BaseStyle {}
