import { Injectable } from '@angular/core';
import { style as accordion_style } from './accordion.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
${accordion_style}

/* For Helix */
.h-accordionheader-toggle-icon.icon-start {
    order: -1;
}

.h-accordionheader:has(.h-accordionheader-toggle-icon.icon-start) {
    justify-content: flex-start;
    gap: dt('accordion.header.padding');
}

.h-accordionheader.h-ripple {
    overflow: hidden;
    position: relative;
}

.h-accordioncontent .h-motion {
    display: grid;
    grid-template-rows: 1fr;
}
`;

const classes = {
    root: 'h-accordion h-component',
    panel: ({ instance }) => [
        'h-accordionpanel',
        {
            'h-accordionpanel-active': instance.active(),
            'h-disabled': instance.disabled()
        }
    ],
    header: 'h-accordionheader',
    toggleicon: 'h-accordionheader-toggle-icon',
    contentContainer: 'h-accordioncontent',
    contentWrapper: 'h-accordioncontent-wrapper',
    content: 'h-accordioncontent-content'
};

@Injectable()
export class AccordionStyle extends BaseStyle {
    name = 'accordion';

    style = style;

    classes = classes;
}

/**
 *
 * Accordion groups a collection of contents in tabs.
 *
 * [Live Demo](https://www.primeng.org/accordion/)
 *
 * @module accordionstyle
 *
 */
export enum AccordionClasses {
    /**
     * Class name of the root element
     */
    root = 'h-accordion',
    /**
     * Class name of the content wrapper
     */
    contentwrapper = 'h-accordioncontent',
    /**
     * Class name of the content
     */
    content = 'h-accordioncontent-content',
    /**
     * Class name of the header
     */
    header = 'h-accordionheader',
    /**
     * Class name of the toggle icon
     */
    toggleicon = 'h-accordionheader-toggle-icon',
    /**
     * Class name of the panel
     */
    panel = 'h-accordionpanel'
}

export interface AccordionStyle extends BaseStyle {}
