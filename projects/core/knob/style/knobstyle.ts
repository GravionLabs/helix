import { Injectable } from '@angular/core';
import { style } from './knob.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => ['h-knob h-component', { 'h-disabled': instance.$disabled() }],
    range: 'h-knob-range',
    value: 'h-knob-value',
    text: 'h-knob-text'
};

@Injectable()
export class KnobStyle extends BaseStyle {
    name = 'knob';

    style = style;

    classes = classes;
}

/**
 *
 * Knob is a form component to define number inputs with a dial.
 *
 * [Live Demo](https://www.primeng.org/knob/)
 *
 * @module knobstyle
 *
 */
export enum KnobClasses {
    /**
     * Class name of the root element
     */
    root = 'h-knob',
    /**
     * Class name of the range element
     */
    range = 'h-knob-range',
    /**
     * Class name of the value element
     */
    value = 'h-knob-value',
    /**
     * Class name of the text element
     */
    text = 'h-knob-text'
}

export interface KnobStyle extends BaseStyle {}
