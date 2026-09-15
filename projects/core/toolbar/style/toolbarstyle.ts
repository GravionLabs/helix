import { Injectable } from '@angular/core';
import { style } from './toolbar.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: () => ['h-toolbar h-component'],
    start: 'h-toolbar-start',
    center: 'h-toolbar-center',
    end: 'h-toolbar-end'
};

@Injectable()
export class ToolbarStyle extends BaseStyle {
    name = 'toolbar';

    style = style;

    classes = classes;
}

/**
 *
 * Toolbar is a grouping component for buttons and other content.
 *
 * [Live Demo](https://www.primeng.org/toolbar/)
 *
 * @module toolbarstyle
 *
 */
export enum ToolbarClasses {
    /**
     * Class name of the root element
     */
    root = 'h-toolbar',
    /**
     * Class name of the start element
     */
    start = 'h-toolbar-start',
    /**
     * Class name of the center element
     */
    center = 'h-toolbar-center',
    /**
     * Class name of the end element
     */
    end = 'h-toolbar-end'
}

export interface ToolbarStyle extends BaseStyle {}
