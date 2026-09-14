import { Injectable } from '@angular/core';
import { style } from './slider.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const inlineStyles = {
    handle: { position: 'absolute' },
    range: { position: 'absolute' }
};

const classes = {
    root: ({ instance }) => [
        'h-slider h-component',
        {
            'h-disabled': instance.$disabled(),
            'h-invalid': instance.invalid(),
            'h-slider-horizontal': instance.orientation() === 'horizontal',
            'h-slider-vertical': instance.orientation() === 'vertical',
            'h-slider-animate': instance.animate()
        }
    ],
    range: 'h-slider-range',
    handle: 'h-slider-handle'
};

@Injectable()
export class SliderStyle extends BaseStyle {
    name = 'slider';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * Slider is a component to provide input with a drag handle.
 *
 * [Live Demo](https://www.primeng.org/slider/)
 *
 * @module sliderstyle
 *
 */
export enum SliderClasses {
    /**
     * Class name of the root element
     */
    root = 'h-slider',
    /**
     * Class name of the range element
     */
    range = 'h-slider-range',
    /**
     * Class name of the handle element
     */
    handle = 'h-slider-handle'
}

export interface SliderStyle extends BaseStyle {}
