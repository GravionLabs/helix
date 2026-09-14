import { Injectable } from '@angular/core';
import { style as inputtext_style } from './inputtext.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${inputtext_style}

    /* For Helix */
   .h-inputtext.ng-invalid.ng-dirty {
        border-color: dt('inputtext.invalid.border.color');
    }

    .h-inputtext.ng-invalid.ng-dirty::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }
`;

const classes = {
    root: ({ instance }) => [
        'h-inputtext h-component',
        {
            'h-filled': instance.$filled(),
            'h-inputtext-sm': instance.pSize === 'small',
            'h-inputtext-lg': instance.pSize === 'large',
            'h-invalid': instance.invalid(),
            'h-variant-filled': instance.$variant() === 'filled',
            'h-inputtext-fluid': instance.hasFluid
        }
    ]
};

@Injectable()
export class InputTextStyle extends BaseStyle {
    name = 'inputtext';

    style = style;

    classes = classes;
}

/**
 *
 * InputText renders a text field to enter data.
 *
 * [Live Demo](https://www.primeng.org/inputtext/)
 *
 * @module inputtextstyle
 *
 */
export enum InputTextClasses {
    /**
     * The class of root element
     */
    root = 'h-inputtext'
}

export interface InputTextStyle extends BaseStyle {}
