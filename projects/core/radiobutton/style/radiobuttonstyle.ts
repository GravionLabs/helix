import { Injectable } from '@angular/core';
import { style as radiobutton_style } from './radiobutton.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${radiobutton_style}

    /* For Helix */
    h-radioButton.ng-invalid.ng-dirty .h-radiobutton-box,
    h-radio-button.ng-invalid.ng-dirty .h-radiobutton-box,
    h-radiobutton.ng-invalid.ng-dirty .h-radiobutton-box {
        border-color: dt('radiobutton.invalid.border.color');
    }
`;

const classes = {
    root: ({ instance }) => [
        'h-radiobutton h-component',
        {
            'h-radiobutton-checked': instance.checked,
            'h-disabled': instance.$disabled(),
            'h-invalid': instance.invalid(),
            'h-variant-filled': instance.$variant() === 'filled',
            'h-radiobutton-sm h-inputfield-sm': instance.size() === 'small',
            'h-radiobutton-lg h-inputfield-lg': instance.size() === 'large'
        }
    ],
    box: 'h-radiobutton-box',
    input: 'h-radiobutton-input',
    icon: 'h-radiobutton-icon'
};

@Injectable()
export class RadioButtonStyle extends BaseStyle {
    name = 'radiobutton';

    style = style;

    classes = classes;
}

/**
 *
 * RadioButton is an extension to standard radio button element with theming.
 *
 * [Live Demo](https://www.primeng.org/radiobutton/)
 *
 * @module radiobuttonstyle
 *
 */
export enum RadioButtonClasses {
    /**
     * Class name of the root element
     */
    root = 'h-radiobutton',
    /**
     * Class name of the box element
     */
    box = 'h-radiobutton-box',
    /**
     * Class name of the input element
     */
    input = 'h-radiobutton-input',
    /**
     * Class name of the icon element
     */
    icon = 'h-radiobutton-icon'
}

export interface RadioButtonStyle extends BaseStyle {}
