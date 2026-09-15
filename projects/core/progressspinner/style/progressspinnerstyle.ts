import { Injectable } from '@angular/core';
import { style } from './progressspinner.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: () => ['h-progressspinner'],
    spin: 'h-progressspinner-spin',
    circle: 'h-progressspinner-circle'
};

@Injectable()
export class ProgressSpinnerStyle extends BaseStyle {
    name = 'progressspinner';

    style = style;

    classes = classes;
}

/**
 *
 * ProgressSpinner is a process status indicator.
 *
 * [Live Demo](https://www.primeng.org/progressspinner)
 *
 * @module progressspinnerstyle
 *
 */
export enum ProgressSpinnerClasses {
    /**
     * Class name of the root element
     */
    root = 'h-progressspinner',
    /**
     * Class name of the spin element
     */
    spin = 'h-progressspinner-spin',
    /**
     * Class name of the circle element
     */
    circle = 'h-progressspinner-circle'
}

export interface ProgressSpinnerStyle extends BaseStyle {}
