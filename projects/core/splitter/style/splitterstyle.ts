import { Injectable } from '@angular/core';
import { style } from './splitter.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => ['h-splitter h-component', 'h-splitter-' + instance.layout()],
    panel: ({ instance }) => ['h-splitterpanel', { 'h-splitterpanel-nested': instance.nestedState() }],
    gutter: 'h-splitter-gutter',
    gutterHandle: 'h-splitter-gutter-handle'
};

const inlineStyles = {
    root: ({ instance }) => [{ display: 'flex', 'flex-wrap': 'nowrap' }, instance.layout() === 'vertical' ? { 'flex-direction': 'column' } : '']
};

@Injectable()
export class SplitterStyle extends BaseStyle {
    name = 'splitter';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * Splitter is utilized to separate and resize panels.
 *
 * [Live Demo](https://www.primeng.org/splitter/)
 *
 * @module splitterstyle
 *
 */
export enum SplitterClasses {
    /**
     * Class name of the root element
     */
    root = 'h-splitter',
    /**
     * Class name of the gutter element
     */
    gutter = 'h-splitter-gutter',
    /**
     * Class name of the gutter handle element
     */
    gutterHandle = 'h-splitter-gutter-handle'
}

export interface SplitterStyle extends BaseStyle {}
