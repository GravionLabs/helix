import { Injectable } from '@angular/core';
import { style as card_style } from './card.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${card_style}

    .h-card {
        display: block;
    }
`;

const classes = {
    root: 'h-card h-component',
    header: 'h-card-header',
    body: 'h-card-body',
    caption: 'h-card-caption',
    title: 'h-card-title',
    subtitle: 'h-card-subtitle',
    content: 'h-card-content',
    footer: 'h-card-footer'
};

@Injectable()
export class CardStyle extends BaseStyle {
    name = 'card';

    style = style;

    classes = classes;
}

/**
 *
 * Card is a flexible container component.
 *
 * [Live Demo](https://www.primeng.org/card/)
 *
 * @module cardstyle
 *
 */
export enum CardClasses {
    /**
     * Class name of the root element
     */
    root = 'h-card',
    /**
     * Class name of the header element
     */
    header = 'h-card-header',
    /**
     * Class name of the body element
     */
    body = 'h-card-body',
    /**
     * Class name of the caption element
     */
    caption = 'h-card-caption',
    /**
     * Class name of the title element
     */
    title = 'h-card-title',
    /**
     * Class name of the subtitle element
     */
    subtitle = 'h-card-subtitle',
    /**
     * Class name of the content element
     */
    content = 'h-card-content',
    /**
     * Class name of the footer element
     */
    footer = 'h-card-footer'
}

export interface CardStyle extends BaseStyle {}
