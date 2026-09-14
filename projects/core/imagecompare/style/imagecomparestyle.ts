import { Injectable } from '@angular/core';
import { style } from './imagecompare.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: 'h-imagecompare',
    slider: 'h-imagecompare-slider'
};

@Injectable()
export class ImageCompareStyle extends BaseStyle {
    name = 'imagecompare';

    style = style;

    classes = classes;
}

/**
 *
 * ImageCompare compares two images side by side with a slider.
 *
 * [Live Demo](https://www.primeng.org/imagecompare/)
 *
 * @module imagecomparestyle
 *
 */
export enum ImageCompareClasses {
    /**
     * Class name of the root element
     */
    root = 'h-imagecompare',
    /**
     * Class name of the slider element
     */
    slider = 'h-imagecompare-slider'
}
export interface ImageCompareStyle extends BaseStyle {}
