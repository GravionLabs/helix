import { Injectable } from '@angular/core';
import { style as checkbox_style } from './checkbox.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${checkbox_style}

    /* For Helix */
    h-checkBox.ng-invalid.ng-dirty .h-checkbox-box,
    h-check-box.ng-invalid.ng-dirty .h-checkbox-box,
    h-checkbox.ng-invalid.ng-dirty .h-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }
`;

const classes = {
    root: ({ instance }) => [
        'h-checkbox h-component',
        {
            'h-checkbox-checked h-highlight': instance.checked,
            'h-disabled': instance.$disabled(),
            'h-invalid': instance.invalid(),
            'h-variant-filled': instance.$variant() === 'filled',
            'h-checkbox-sm h-inputfield-sm': instance.size() === 'small',
            'h-checkbox-lg h-inputfield-lg': instance.size() === 'large'
        }
    ],
    box: 'h-checkbox-box',
    input: 'h-checkbox-input',
    icon: 'h-checkbox-icon'
};

@Injectable()
export class CheckboxStyle extends BaseStyle {
    name = 'checkbox';

    style = style;

    classes = classes;
}

/**
 *
 * Checkbox is an extension to standard checkbox element with theming.
 *
 * [Live Demo](https://www.primeng.org/checkbox/)
 *
 * @module checkboxstyle
 *
 */
export enum CheckboxClasses {
    /**
     * Class name of the root element
     */
    root = 'h-checkbox',
    /**
     * Class name of the box element
     */
    box = 'h-checkbox-box',
    /**
     * Class name of the input element
     */
    input = 'h-checkbox-input',
    /**
     * Class name of the icon element
     */
    icon = 'h-checkbox-icon'
}

export interface CheckboxStyle extends BaseStyle {}
