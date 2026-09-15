import { Injectable } from '@angular/core';
import { style } from './progressbar.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-progressbar h-component',
        {
            'h-progressbar-determinate': instance.mode() == 'determinate',
            'h-progressbar-indeterminate': instance.mode() == 'indeterminate'
        }
    ],
    value: 'h-progressbar-value',
    label: 'h-progressbar-label'
};

@Injectable()
export class ProgressBarStyle extends BaseStyle {
    name = 'progressbar';

    style = style;

    classes = classes;
}

/**
 *
 * ProgressBar is a process status indicator.
 *
 * [Live Demo](https://www.primeng.org/progressbar)
 *
 * @module progressbarstyle
 *
 */
export enum ProgressBarClasses {
    /**
     * Class name of the root element
     */
    root = 'h-progressbar',
    /**
     * Class name of the value element
     */
    value = 'h-progressbar-value',
    /**
     * Class name of the label element
     */
    label = 'h-progressbar-label'
}

export interface ProgressBarStyle extends BaseStyle {}
