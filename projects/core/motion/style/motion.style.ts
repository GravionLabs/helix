import { Injectable } from '@angular/core';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    .h-motion {
        display: block;
    }
`;

const classes = {
    root: 'h-motion'
};

@Injectable()
export class MotionStyle extends BaseStyle {
    name = 'motion';

    style = style;

    classes = classes;
}

/**
 *
 * Motion and MotionDirective provide an easy way to add motion effects to Angular applications.
 *
 * [Live Demo](https://www.primeng.org/motion)
 *
 * @module motionstyle
 *
 */
export enum MotionClasses {
    /**
     * Class name of the root element
     */
    root = 'h-motion'
}

export interface MotionStyle extends BaseStyle {}
