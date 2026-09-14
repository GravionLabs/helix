import { Injectable } from '@angular/core';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    /* For Helix */
    h-inputmask {
        position: relative;
    }

    .h-inputmask-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        inset-inline-end: dt('form.field.padding.x');
        color: dt('form.field.icon.color');
    }

    h-inputMask:has(.h-inputtext-fluid),
    h-input-mask:has(.h-inputtext-fluid),
    h-inputmask:has(.h-inputtext-fluid) {
        width: 100%;
    }

    h-inputMask.ng-invalid.ng-dirty > .h-inputtext,
    h-input-mask.ng-invalid.ng-dirty > .h-inputtext,
    h-inputmask.ng-invalid.ng-dirty > .h-inputtext {
        border-color: dt('inputtext.invalid.border.color');
    }

    h-inputMask.ng-invalid.ng-dirty > .h-inputtext:enabled:focus,
    h-input-mask.ng-invalid.ng-dirty > .h-inputtext:enabled:focus,
    h-inputmask.ng-invalid.ng-dirty > .h-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
    }

    h-inputMask.ng-invalid.ng-dirty > .h-inputtext::placeholder,
    h-input-mask.ng-invalid.ng-dirty > .h-inputtext::placeholder,
    h-inputmask.ng-invalid.ng-dirty > .h-inputtext::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }
`;

const classes = {
    root: ({ instance }) => [
        'h-inputmask h-component h-inputwrapper',
        {
            'h-variant-filled': instance.$variant() === 'filled'
        }
    ],
    clearIcon: 'h-inputmask-clear-icon'
};

@Injectable()
export class InputMaskStyle extends BaseStyle {
    name = 'inputmask';

    style = style;

    classes = classes;
}

/**
 *
 * InputMask component is used to enter input in a certain format such as numeric, date, currency, email and phone.
 *
 * [Live Demo](https://www.primeng.org/inputmask/)
 *
 * @module inputmaskstyle
 *
 */

export enum InputMaskClasses {
    /**
     * Class name of the root element
     */
    root = 'h-inputmask',
    /**
     * Class name of the clear icon element
     */
    clearIcon = 'h-inputmask-clear-icon'
}

export interface InputMaskStyle extends BaseStyle {}
