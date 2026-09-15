import { Injectable } from '@angular/core';
import { style } from './steps.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => ['h-steps h-component', { 'h-readonly': instance.readonly }],
    list: 'h-steps-list',
    item: ({ instance, item, index }) => [
        'h-steps-item',
        {
            'h-steps-item-active': instance.isActive(item, index),
            'h-disabled': instance.isItemDisabled(item, index)
        }
    ],
    itemLink: 'h-steps-item-link',
    itemNumber: 'h-steps-item-number',
    itemLabel: 'h-steps-item-label'
};
@Injectable()
export class StepsStyle extends BaseStyle {
    name = 'steps';

    style = style;

    classes = classes;
}

/**
 *
 * Steps components is an indicator for the steps in a wizard workflow. Example below uses nested routes with Steps.
 *
 * [Live Demo](https://www.primeng.org/steps/)
 *
 * @module stepsstyle
 *
 */
export enum StepsClasses {
    /**
     * Class name of the root element
     */
    root = 'h-steps',
    /**
     * Class name of the list element
     */
    list = 'h-steps-list',
    /**
     * Class name of the item element
     */
    item = 'h-steps-item',
    /**
     * Class name of the item link element
     */
    itemLink = 'h-steps-item-link',
    /**
     * Class name of the item number element
     */
    itemNumber = 'h-steps-item-number',
    /**
     * Class name of the item label element
     */
    itemLabel = 'h-steps-item-label'
}

export interface StepsStyle extends BaseStyle {}
