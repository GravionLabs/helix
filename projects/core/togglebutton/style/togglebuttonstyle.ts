import { Injectable } from '@angular/core';
import { style as togglebutton_style } from './togglebutton.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${togglebutton_style}

    /* For Helix (iconPos) */
    .h-togglebutton-icon-right {
        order: 1;
    }

    .h-togglebutton.ng-invalid.ng-dirty {
        border-color: dt('togglebutton.invalid.border.color');
    }
`;

const classes = {
    root: ({ instance }) => [
        'h-togglebutton h-component',
        {
            'h-togglebutton-checked': instance.checked,
            'h-invalid': instance.invalid(),
            'h-disabled': instance.$disabled(),
            'h-togglebutton-sm h-inputfield-sm': instance.size === 'small',
            'h-togglebutton-lg h-inputfield-lg': instance.size === 'large',
            'h-togglebutton-fluid': instance.fluid()
        }
    ],
    content: 'h-togglebutton-content',
    icon: 'h-togglebutton-icon',
    iconLeft: 'h-togglebutton-icon-left',
    iconRight: 'h-togglebutton-icon-right',
    label: 'h-togglebutton-label'
};

@Injectable()
export class ToggleButtonStyle extends BaseStyle {
    name = 'togglebutton';

    style = style;

    classes = classes;
}

/**
 *
 * ToggleButton is used to select a boolean value using a button.
 *
 * [Live Demo](https://www.primeng.org/togglebutton/)
 *
 * @module togglebuttonstyle
 *
 */
export enum ToggleButtonClasses {
    /**
     * Class name of the root element
     */
    root = 'h-togglebutton',
    /**
     * Class name of the icon element
     */
    icon = 'h-togglebutton-icon',
    /**
     * Class name of the left icon
     */
    iconLeft = 'h-togglebutton-icon-left',
    /**
     * Class name of the right icon
     */
    iconRight = 'h-togglebutton-icon-right',
    /**
     * Class name of the label element
     */
    label = 'h-togglebutton-label'
}

export interface ToggleButtonStyle extends BaseStyle {}
