import { Injectable } from '@angular/core';
import { style as textarea_style } from './textarea.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${textarea_style}

    /* For Helix */
    .h-textarea.ng-invalid.ng-dirty {
        border-color: dt('textarea.invalid.border.color');
    }
    .h-textarea.ng-invalid.ng-dirty::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }
`;

const classes = {
    root: ({ instance }) => [
        'h-textarea h-component',
        {
            'h-filled': instance.$filled(),
            'h-textarea-resizable ': instance.autoResize,
            'h-variant-filled': instance.$variant() === 'filled',
            'h-textarea-fluid': instance.hasFluid,
            'h-inputfield-sm h-textarea-sm': instance.pSize === 'small',
            'h-textarea-lg h-inputfield-lg': instance.pSize === 'large',
            'h-invalid': instance.invalid()
        }
    ]
};

@Injectable()
export class TextareaStyle extends BaseStyle {
    name = 'textarea';

    style = style;

    classes = classes;
}

/**
 *
 * Textarea is a multi-line text input element.
 *
 * [Live Demo](https://www.primeng.org/textarea/)
 *
 * @module textareastyle
 *
 */
export enum TextareaClasses {
    /**
     * Class name of the root element
     */
    root = 'h-textarea'
}

export interface TextareaStyle extends BaseStyle {}
