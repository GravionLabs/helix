import { Injectable } from '@angular/core';
import { style as floatlabel_style } from './floatlabel.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${floatlabel_style}

    /* For Helix */
    .h-floatlabel:has(.ng-invalid.ng-dirty) label {
        color: dt('floatlabel.invalid.color');
    }
`;

const classes = {
    root: ({ instance }) => [
        'h-floatlabel',
        {
            'h-floatlabel-over': instance.variant() === 'over',
            'h-floatlabel-on': instance.variant() === 'on',
            'h-floatlabel-in': instance.variant() === 'in'
        }
    ]
};

@Injectable()
export class FloatLabelStyle extends BaseStyle {
    name = 'floatlabel';

    style = style;

    classes = classes;
}

/**
 *
 * FloatLabel visually integrates a label with its form element.
 *
 * [Live Demo](https://www.primeng.org/floatlabel/)
 *
 * @module floatlabelstyle
 *
 */
export enum FloatLabelClasses {
    /**
     * Class name of the root element
     */
    root = 'h-floatlabel'
}

export interface FloatLabelStyle extends BaseStyle {}
