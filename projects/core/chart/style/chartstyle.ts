import { Injectable } from '@angular/core';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const inlineStyles = {
    root: ({ instance }) => ({ display: 'block', position: 'relative', width: instance.width(), height: instance.height() })
};

const classes = {
    root: 'h-chart'
};

@Injectable()
export class ChartStyle extends BaseStyle {
    name = 'chart';

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * Chart groups a collection of contents in tabs.
 *
 * [Live Demo](https://www.primeng.org/chart/)
 *
 * @module chartstyle
 *
 */
export enum ChartClasses {
    /**
     * Class name of the root element
     */
    root = 'h-chart'
}

export interface ChartStyle extends BaseStyle {}
