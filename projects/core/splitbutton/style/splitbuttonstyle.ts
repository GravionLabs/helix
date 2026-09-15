import { Injectable } from '@angular/core';
import { style } from './splitbutton.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-splitbutton h-component',
        {
            'h-splitbutton-raised': instance.raised(),
            'h-splitbutton-rounded': instance.rounded(),
            'h-splitbutton-outlined': instance.outlined(),
            'h-splitbutton-text': instance.text(),
            [`h-splitbutton-${instance.size() === 'small' ? 'sm' : 'lg'}`]: instance.size()
        }
    ],
    pcButton: 'h-splitbutton-button',
    pcDropdown: 'h-splitbutton-dropdown h-button-icon-only'
};

@Injectable()
export class SplitButtonStyle extends BaseStyle {
    name = 'splitbutton';

    style = style;

    classes = classes;
}

/**
 *
 * SplitButton groups a set of commands in an overlay with a default command.
 *
 * [Live Demo](https://www.primeng.org/splitbutton/)
 *
 * @module splitbuttonstyle
 *
 */
export enum SplitButtonClasses {
    /**
     * Class name of the root element
     */
    root = 'h-splitbutton',
    /**
     * Class name of the button element
     */
    pcButton = 'h-splitbutton-button',
    /**
     * Class name of the dropdown element
     */
    pcDropdown = 'h-splitbutton-dropdown'
}

export interface SplitButtonStyle extends BaseStyle {}
