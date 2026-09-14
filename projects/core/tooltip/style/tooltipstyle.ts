import { Injectable } from '@angular/core';
import { style } from './tooltip.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: 'h-tooltip h-component',
    arrow: 'h-tooltip-arrow',
    text: 'h-tooltip-text'
};

@Injectable()
export class TooltipStyle extends BaseStyle {
    name = 'tooltip';

    style = style;

    classes = classes;
}

/**
 *
 * Tooltip directive provides advisory information for a component.
 *
 * [Live Demo](https://www.primeng.org/tooltip)
 *
 * @module tooltipstyle
 *
 */
export enum TooltipClasses {
    /**
     * Class name of the root element
     */
    root = 'h-tooltip',
    /**
     * Class name of the arrow element
     */
    arrow = 'h-tooltip-arrow',
    /**
     * Class name of the text element
     */
    text = 'h-tooltip-text'
}

export interface TooltipStyle extends BaseStyle {}
