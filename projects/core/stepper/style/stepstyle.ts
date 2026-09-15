import { Injectable } from '@angular/core';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-step',
        {
            'h-step-active': instance.active(),
            'h-disabled': instance.isStepDisabled()
        }
    ],
    header: 'h-step-header',
    number: 'h-step-number',
    title: 'h-step-title'
};

@Injectable()
export class StepStyle extends BaseStyle {
    name = 'step';

    classes = classes;
}

/**
 *
 * Stepper is a component that streamlines a wizard-like workflow, organizing content into coherent steps and visually guiding users through a numbered progression in a multi-step process.
 *
 * [Live Demo](https://www.primeng.org/stepper/)
 *
 * @module stepstyle
 *
 */
export enum StepClasses {
    /**
     * Class name of the root element
     */
    root = 'h-step',
    /**
     * Class name of the header element
     */
    header = 'h-step-header',
    /**
     * Class name of the number element
     */
    number = 'h-step-number',
    /**
     * Class name of the title element
     */
    title = 'h-step-title'
}

export interface StepStyle extends BaseStyle {}
