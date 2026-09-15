import { Injectable } from '@angular/core';
import { style as toggleswitch_style } from './toggleswitch.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${toggleswitch_style}

    h-toggleswitch.ng-invalid.ng-dirty > .h-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }
`;

const inlineStyles = {
    root: { position: 'relative' }
};

const classes = {
    root: ({ instance }) => [
        'h-toggleswitch h-component',
        {
            'h-toggleswitch h-component': true,
            'h-toggleswitch-checked': instance.checked(),
            'h-disabled': instance.$disabled(),
            'h-invalid': instance.invalid()
        }
    ],

    input: 'h-toggleswitch-input',
    slider: 'h-toggleswitch-slider',
    handle: 'h-toggleswitch-handle'
};

@Injectable()
export class ToggleSwitchStyle extends BaseStyle {
    name = 'toggleswitch';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * ToggleSwitch is used to select a boolean value.
 *
 * [Live Demo](https://www.primeng.org/toggleswitch/)
 *
 * @module toggleswitchstyle
 *
 */
export enum ToggleSwitchClasses {
    /**
     * Class name of the root element
     */
    root = 'h-toggleswitch',
    /**
     * Class name of the input element
     */
    input = 'h-toggleswitch-input',
    /**
     * Class name of the slider element
     */
    slider = 'h-toggleswitch-slider'
}

export interface ToggleSwitchStyle extends BaseStyle {}
