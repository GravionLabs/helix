import { Injectable } from '@angular/core';
import { style } from './inplace.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: () => ['h-inplace h-component'],
    display: ({ instance }) => ['h-inplace-display', { 'h-disabled': instance.disabled() }],
    content: 'h-inplace-content'
};

@Injectable()
export class InplaceStyle extends BaseStyle {
    name = 'inplace';

    style = style;

    classes = classes;
}

/**
 *
 * Inplace provides an easy to do editing and display at the same time where clicking the output displays the actual content.
 *
 * [Live Demo](https://www.primeng.org/inplace)
 *
 * @module inplacestyle
 *
 */
export enum InplaceClasses {
    /**
     * Class name of the root element
     */
    root = 'h-inplace',
    /**
     * Class name of the display element
     */
    display = 'h-inplace-display',
    /**
     * Class name of the content element
     */
    content = 'h-inplace-content'
}

export interface InplaceStyle extends BaseStyle {}
