import { Injectable } from '@angular/core';
import { style as inputnumber_style } from './inputnumber.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${inputnumber_style}

    /* For Helix */
    h-inputNumber.ng-invalid.ng-dirty > .h-inputtext,
    h-input-number.ng-invalid.ng-dirty > .h-inputtext,
    h-inputnumber.ng-invalid.ng-dirty > .h-inputtext {
        border-color: dt('inputtext.invalid.border.color');
    }

    h-inputNumber.ng-invalid.ng-dirty > .h-inputtext:enabled:focus,
    h-input-number.ng-invalid.ng-dirty > .h-inputtext:enabled:focus,
    h-inputnumber.ng-invalid.ng-dirty > .h-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
    }

    h-inputNumber.ng-invalid.ng-dirty > .h-inputtext::placeholder,
    h-input-number.ng-invalid.ng-dirty > .h-inputtext::placeholder,
    h-inputnumber.ng-invalid.ng-dirty > .h-inputtext::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }
`;

const classes = {
    root: ({ instance }) => [
        'h-inputnumber h-component h-inputwrapper',
        {
            'h-inputwrapper-filled': instance.$filled() || instance.allowEmpty() === false,
            'h-inputwrapper-focus': instance.focused,
            'h-inputnumber-stacked': instance.showButtons() && instance.buttonLayout() === 'stacked',
            'h-inputnumber-horizontal': instance.showButtons() && instance.buttonLayout() === 'horizontal',
            'h-inputnumber-vertical': instance.showButtons() && instance.buttonLayout() === 'vertical',
            'h-inputnumber-fluid': instance.hasFluid,
            'h-invalid': instance.invalid()
        }
    ],
    pcInputText: 'h-inputnumber-input',
    buttonGroup: 'h-inputnumber-button-group',
    incrementButton: ({ instance }) => [
        'h-inputnumber-button h-inputnumber-increment-button',
        {
            'h-disabled': instance.showButtons() && instance.max() != null && instance.maxlength()
        }
    ],
    decrementButton: ({ instance }) => [
        'h-inputnumber-button h-inputnumber-decrement-button',
        {
            'h-disabled': instance.showButtons() && instance.min() != null && instance.minlength()
        }
    ],
    clearIcon: 'h-inputnumber-clear-icon'
};

@Injectable()
export class InputNumberStyle extends BaseStyle {
    name = 'inputnumber';

    style = style;

    classes = classes;
}

/**
 *
 * InputNumber is an input component to provide numerical input.
 *
 * [Live Demo](https://www.primeng.org/inputnumber/)
 *
 * @module inputnumberstyle
 *
 */

export enum InputNumberClasses {
    /**
     * Class name of the root element
     */
    root = 'h-inputnumber',
    /**
     * Class name of the input element
     */
    pcInputText = 'h-inputnumber-input',
    /**
     * Class name of the button group element
     */
    buttonGroup = 'h-inputnumber-button-group',
    /**
     * Class name of the increment button element
     */
    incrementButton = 'h-inputnumber-increment-button',
    /**
     * Class name of the decrement button element
     */
    decrementButton = 'h-inputnumber-decrement-button',
    /**
     * Class name of the clear icon
     */
    clearIcon = 'h-autocomplete-clear-icon'
}

export interface InputNumberStyle extends BaseStyle {}
