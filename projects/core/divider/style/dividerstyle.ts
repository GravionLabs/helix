import { Injectable } from '@angular/core';
import { style } from './divider.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

/* Position */
const inlineStyles = {
    root: ({ instance }) => ({
        justifyContent: instance.layout() === 'horizontal' ? (instance.align() === 'center' || instance.align() == null ? 'center' : instance.align() === 'left' ? 'flex-start' : instance.align() === 'right' ? 'flex-end' : null) : null,
        alignItems: instance.layout() === 'vertical' ? (instance.align() === 'center' || instance.align() == null ? 'center' : instance.align() === 'top' ? 'flex-start' : instance.align() === 'bottom' ? 'flex-end' : null) : null
    })
};

const classes = {
    root: ({ instance }) => [
        'h-divider h-component',
        'h-divider-' + instance.layout(),
        'h-divider-' + instance.type(),
        { 'h-divider-left': instance.layout() === 'horizontal' && (!instance.align() || instance.align() === 'left') },
        { 'h-divider-center': instance.layout() === 'horizontal' && instance.align() === 'center' },
        { 'h-divider-right': instance.layout() === 'horizontal' && instance.align() === 'right' },
        { 'h-divider-top': instance.layout() === 'vertical' && instance.align() === 'top' },
        { 'h-divider-center': instance.layout() === 'vertical' && (!instance.align() || instance.align() === 'center') },
        { 'h-divider-bottom': instance.layout() === 'vertical' && instance.align() === 'bottom' }
    ],
    content: 'h-divider-content'
};

@Injectable()
export class DividerStyle extends BaseStyle {
    name = 'divider';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * Divider is used to separate contents.
 *
 * [Live Demo](https://primeng.org/divider)
 *
 * @module dividerstyle
 *
 */
export enum DividerClasses {
    /**
     * Class name of the root element
     */
    root = 'h-divider',
    /**
     * Class name of the content element
     */
    content = 'h-divider-content'
}

export interface DividerStyle extends BaseStyle {}
