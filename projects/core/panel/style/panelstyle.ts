import { Injectable } from '@angular/core';
import { style } from './panel.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: ({ instance }) => [
        'h-panel h-component',
        {
            'h-panel-toggleable': instance.toggleable(),
            'h-panel-expanded': !instance.collapsed() && instance.toggleable(),
            'h-panel-collapsed': instance.collapsed() && instance.toggleable()
        }
    ],
    header: 'h-panel-header',
    title: 'h-panel-title',
    headerActions: ({ instance }) => [
        'h-panel-header-actions',
        {
            'h-panel-icons-start': instance.iconPos() === 'start',
            'h-panel-icons-end': instance.iconPos() === 'end',
            'h-panel-icons-center': instance.iconPos() === 'center'
        }
    ],
    pcToggleButton: 'h-panel-toggle-button',
    contentContainer: 'h-panel-content-container',
    contentWrapper: 'h-panel-content-wrapper',
    content: 'h-panel-content',
    footer: 'h-panel-footer'
};
@Injectable()
export class PanelStyle extends BaseStyle {
    name = 'panel';

    style = style;

    classes = classes;
}

/**
 *
 * Panel is a container with the optional content toggle feature.
 *
 * [Live Demo](https://www.primeng.org/panel/)
 *
 * @module panelstyle
 *
 */
export enum PanelClasses {
    /**
     * Class name of the root element
     */
    root = 'h-panel',
    /**
     * Class name of the header element
     */
    header = 'h-panel-header',
    /**
     * Class name of the title element
     */
    title = 'h-panel-title',
    /**
     * Class name of the header actions element
     */
    headerActions = 'h-panel-header-actions',
    /**
     * Class name of the toggle button element
     */
    pcToggleButton = 'h-panel-toggle-button',
    /**
     * Class name of the content container element
     */
    contentContainer = 'h-panel-content-container',
    /**
     * Class name of the content wrapper element
     */
    contentWrapper = 'h-panel-content-wrapper',
    /**
     * Class name of the content element
     */
    content = 'h-panel-content',
    /**
     * Class name of the footer element
     */
    footer = 'h-panel-footer'
}
