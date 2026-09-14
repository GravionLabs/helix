import { Injectable } from '@angular/core';
import { style } from './inputotp.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: 'h-inputotp h-component',
    pcInputText: 'h-inputotp-input'
};

@Injectable()
export class InputOtpStyle extends BaseStyle {
    name = 'inputotp';

    style = style;

    classes = classes;
}

/**
 *
 * InputOtp is used to enter one time passwords.
 *
 * [Live Demo](https://www.primeng.org/inputotp/)
 *
 * @module inputotpstyle
 *
 */

export enum InputOtpClasses {
    /**
     * Class name of the root element
     */
    root = 'h-inputotp',
    /**
     * Class name of the input element
     */
    pcInputText = 'h-inputotp-input'
}

export interface InputOtpStyle extends BaseStyle {}
