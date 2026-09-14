import { Injectable } from '@angular/core';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-tab',
        {
            'h-tab-active': instance.active(),
            'h-disabled': instance.disabled()
        }
    ]
};

@Injectable()
export class TabStyle extends BaseStyle {
    name = 'tab';

    classes = classes;
}

/**
 *
 * Tabs facilitates seamless switching between different views.
 *
 * [Live Demo](https://www.primeng.org/tabs/)
 *
 * @module tabsstyle
 *
 */

export enum TabClasses {
    /**
     * Class name of the tab list element
     */
    tab = 'h-tab'
}

export interface TabStyle extends BaseStyle {}
