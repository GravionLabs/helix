import { Injectable } from '@angular/core';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: 'h-fluid'
};

@Injectable()
export class FluidStyle extends BaseStyle {
    name = 'fluid';

    classes = classes;
}

/**
 *
 * Fluid is a layout component to make descendant components span full width of their container.
 *
 * [Live Demo](https://www.primeng.org/fluid/)
 *
 * @module fluidstyle
 *
 */
export enum FluidClasses {
    /**
     * Class name of the root element
     */
    root = 'h-fluid'
}

export interface FluidStyle extends BaseStyle {}
