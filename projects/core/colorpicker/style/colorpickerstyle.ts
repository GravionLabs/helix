import { Injectable } from '@angular/core';
import { style } from './colorpicker.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => ['h-colorpicker h-component', { 'h-colorpicker-overlay': !instance.inline(), 'h-colorpicker-dragging': instance.colorDragging || instance.hueDragging }],
    preview: ({ instance }) => ['h-colorpicker-preview', { 'h-disabled': instance.$disabled() }],
    panel: ({ instance }) => [
        'h-colorpicker-panel',
        {
            'h-colorpicker-panel-inline': instance.inline(),
            'h-disabled': instance.$disabled()
        }
    ],
    content: 'h-colorpicker-content',
    colorSelector: 'h-colorpicker-color-selector',
    colorBackground: 'h-colorpicker-color-background',
    colorHandle: 'h-colorpicker-color-handle',
    hue: 'h-colorpicker-hue',
    hueHandle: 'h-colorpicker-hue-handle'
};

@Injectable()
export class ColorPickerStyle extends BaseStyle {
    name = 'colorpicker';

    style = style;

    classes = classes;
}

/**
 *
 * ColorPicker groups a collection of contents in tabs.
 *
 * [Live Demo](https://www.primeng.org/colorpicker/)
 *
 * @module colorpickerstyle
 *
 */
export enum ColorPickerClasses {
    /**
     * Class name of the root element
     */
    root = 'h-colorpicker',
    /**
     * Class name of the preview element
     */
    preview = 'h-colorpicker-preview',
    /**
     * Class name of the panel element
     */
    panel = 'h-colorpicker-panel',
    /**
     * Class name of the color selector element
     */
    colorSelector = 'h-colorpicker-color-selector',
    /**
     * Class name of the color background element
     */
    colorBackground = 'h-colorpicker-color-background',
    /**
     * Class name of the color handle element
     */
    colorHandle = 'h-colorpicker-color-handle',
    /**
     * Class name of the hue element
     */
    hue = 'h-colorpicker-hue',
    /**
     * Class name of the hue handle element
     */
    hueHandle = 'h-colorpicker-hue-handle'
}

export interface ColorPickerStyle extends BaseStyle {}
