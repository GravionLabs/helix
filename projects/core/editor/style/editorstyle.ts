import { Injectable } from '@angular/core';
import { style } from './editor.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-editor',
        {
            'h-invalid': instance.invalid()
        }
    ],
    toolbar: 'h-editor-toolbar',
    content: 'h-editor-content'
};

@Injectable()
export class EditorStyle extends BaseStyle {
    name = 'editor';

    style = style;

    classes = classes;
}

/**
 *
 * Editor groups a collection of contents in tabs.
 *
 * [Live Demo](https://www.primeng.org/editor/)
 *
 * @module editorstyle
 *
 */
export enum EditorClasses {
    /**
     * Class name of the root element
     */
    root = 'h-editor',
    /**
     * Class name of the toolbar element
     */
    toolbar = 'h-editor-toolbar',
    /**
     * Class name of the content element
     */
    content = 'h-editor-content'
}

export interface EditorStyle extends BaseStyle {}
