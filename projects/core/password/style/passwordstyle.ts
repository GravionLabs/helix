import { Injectable } from '@angular/core';
import { style as password_style } from './password.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
${password_style}

/* For Helix */
.h-password-overlay {
    min-width: 100%;
}

h-password.ng-invalid.ng-dirty .h-inputtext {
    border-color: dt('inputtext.invalid.border.color');
}

h-password.ng-invalid.ng-dirty .h-inputtext:enabled:focus {
    border-color: dt('inputtext.focus.border.color');
}

h-password.ng-invalid.ng-dirty .h-inputtext::placeholder {
    color: dt('inputtext.invalid.placeholder.color');
}

.h-password-fluid-directive {
    width: 100%;
}

/* Animations */
.h-password-enter {
    animation: h-animate-password-enter 300ms cubic-bezier(.19,1,.22,1);
}

.h-password-leave {
    animation: h-animate-password-leave 300ms cubic-bezier(.19,1,.22,1);
}

@keyframes h-animate-password-enter {
    from {
        opacity: 0;
        transform: scale(0.93);
    }
}

@keyframes h-animate-password-leave {
    to {
        opacity: 0;
        transform: scale(0.93);
    }
}
`;

const inlineStyles = {
    root: ({ instance }) => ({ position: instance.$appendTo() === 'self' ? 'relative' : undefined }),
    overlay: { position: 'absolute' }
};

const classes = {
    root: ({ instance }) => [
        'h-password h-component h-inputwrapper',
        {
            'h-inputwrapper-filled': instance.$filled(),
            'h-variant-filled': instance.$variant() === 'filled',
            'h-inputwrapper-focus': instance.focused,
            'h-password-fluid': instance.hasFluid
        }
    ],
    rootDirective: ({ instance }) => [
        'h-password h-inputtext h-component h-inputwrapper',
        {
            'h-inputwrapper-filled': instance.$filled(),
            'h-variant-filled': instance.$variant() === 'filled',
            'h-password-fluid-directive': instance.hasFluid
        }
    ],
    pcInputText: 'h-password-input',
    maskIcon: 'h-password-toggle-mask-icon h-password-mask-icon',
    unmaskIcon: 'h-password-toggle-mask-icon h-password-unmask-icon',
    overlay: 'h-password-overlay h-component',
    content: 'h-password-content',
    meter: 'h-password-meter',
    meterLabel: ({ instance }) => `h-password-meter-label ${instance.meter ? 'h-password-meter-' + instance.meter.strength : ''}`,
    meterText: 'h-password-meter-text',
    clearIcon: 'h-password-clear-icon'
};

@Injectable()
export class PasswordStyle extends BaseStyle {
    name = 'password';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * Password displays strength indicator for password fields.
 *
 * [Live Demo](https://www.primeng.org/password/)
 *
 * @module passwordstyle
 *
 */

export enum PasswordClasses {
    /**
     * Class name of the root element
     */
    root = 'h-password',
    /**
     * Class name of the pt input element
     */
    pcInputText = 'h-password-input',
    /**
     * Class name of the mask icon element
     */
    maskIcon = 'h-password-mask-icon',
    /**
     * Class name of the unmask icon element
     */
    unmaskIcon = 'h-password-unmask-icon',
    /**
     * Class name of the overlay element
     */
    overlay = 'h-password-overlay',
    /**
     * Class name of the meter element
     */
    meter = 'h-password-meter',
    /**
     * Class name of the meter label element
     */
    meterLabel = 'h-password-meter-label',
    /**
     * Class name of the meter text element
     */
    meterText = 'h-password-meter-text',
    /**
     * Class name of the clear icon
     */
    clearIcon = 'h-password-clear-icon'
}

export interface PasswordStyle extends BaseStyle {}
