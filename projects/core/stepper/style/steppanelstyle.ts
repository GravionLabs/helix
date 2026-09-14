import { Injectable } from '@angular/core';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-steppanel',
        {
            'h-steppanel-active': instance.isVertical() && instance.active()
        }
    ],
    contentWrapper: 'h-steppanel-content-wrapper',
    content: 'h-steppanel-content'
};

@Injectable()
export class StepPanelStyle extends BaseStyle {
    name = 'steppanel';

    classes = classes;
}

/**
 *
 * StepPanel is a helper component for Stepper component.
 *
 * [Live Demo](https://www.primeng.org/stepper/)
 *
 * @module steppanelstyle
 *
 */
export enum StepPanelClasses {
    /**
     * Class name of the root element
     */
    root = 'h-steppanel',

    /**
     * Class name of the content wrapper element
     */
    contentWrapper = 'h-steppanel-content-wrapper',

    /**
     * Class name of the content element
     */
    content = 'h-steppanel-content'
}

export interface StepPanelStyle extends BaseStyle {}
