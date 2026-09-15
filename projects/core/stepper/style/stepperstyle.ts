import { Injectable } from '@angular/core';
import { style as stepper_style } from './stepper.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
${stepper_style}

.h-steppanel .h-motion {
    display: grid;
    grid-template-rows: 1fr;
}
`;

const classes = {
    root: ({ instance }) => [
        'h-stepper h-component',
        {
            'h-readonly': instance.linear()
        }
    ],
    separator: 'h-stepper-separator'
};

@Injectable()
export class StepperStyle extends BaseStyle {
    name = 'stepper';

    style = style;

    classes = classes;
}

/**
 *
 * Stepper is a component that streamlines a wizard-like workflow, organizing content into coherent steps and visually guiding users through a numbered progression in a multi-step process.
 *
 * [Live Demo](https://www.primeng.org/stepper/)
 *
 * @module stepperstyle
 *
 */
export enum StepperClasses {
    /**
     * Class name of the root element
     */
    root = 'h-stepper',
    /**
     * Class name of the separator element
     */
    separator = 'h-stepper-separator'
}

export interface StepperStyle extends BaseStyle {}
