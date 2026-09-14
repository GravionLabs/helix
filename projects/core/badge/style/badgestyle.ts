import { Injectable } from '@angular/core';
import { style as badge_style } from './badge.css';
import { isEmpty, isNotEmpty } from '@gravionlabs/helix-core/uix/utils';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
    ${badge_style}

    /* For Helix (directive)*/
    .h-overlay-badge {
        position: relative;
    }

    .h-overlay-badge > .h-badge {
        position: absolute;
        top: 0;
        inset-inline-end: 0;
        transform: translate(50%, -50%);
        transform-origin: 100% 0;
        margin: 0;
    }
`;

const classes = {
    root: ({ instance }) => {
        const value = typeof instance.value === 'function' ? instance.value() : instance.value;
        const size = typeof instance.size === 'function' ? instance.size() : instance.size;
        const badgeSize = typeof instance.badgeSize === 'function' ? instance.badgeSize() : instance.badgeSize;
        const severity = typeof instance.severity === 'function' ? instance.severity() : instance.severity;

        return [
            'h-badge h-component',
            {
                'h-badge-circle': isNotEmpty(value) && String(value).length === 1,
                'h-badge-dot': isEmpty(value),
                'h-badge-sm': size === 'small' || badgeSize === 'small',
                'h-badge-lg': size === 'large' || badgeSize === 'large',
                'h-badge-xl': size === 'xlarge' || badgeSize === 'xlarge',
                'h-badge-info': severity === 'info',
                'h-badge-success': severity === 'success',
                'h-badge-warn': severity === 'warn',
                'h-badge-danger': severity === 'danger',
                'h-badge-secondary': severity === 'secondary',
                'h-badge-contrast': severity === 'contrast'
            }
        ];
    }
};

@Injectable()
export class BadgeStyle extends BaseStyle {
    name = 'badge';

    style = style;

    classes = classes;
}

/**
 *
 * Badge represents people using icons, labels and images.
 *
 * [Live Demo](https://www.primeng.org/badge)
 *
 * @module badgestyle
 *
 */
export enum BadgeClasses {
    /**
     * Class name of the root element
     */
    root = 'h-badge'
}

export interface BadgeStyle extends BaseStyle {}
