import { Injectable } from '@angular/core';
import { style } from './button.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const unwrap = (value: any) => (typeof value === 'function' ? value() : value);

const classes = {
    root: ({ instance }) => {
        const label = unwrap(instance.label);
        const icon = unwrap(instance.icon);
        const loading = unwrap(instance.loading);
        const severity = unwrap(instance.severity);
        const iconPos = unwrap(instance.iconPos);
        const size = unwrap(instance.size);
        const variant = unwrap(instance.variant);
        const badge = unwrap(instance.badge);
        const buttonProps = unwrap(instance.buttonProps);
        return [
            'h-button h-component',
            {
                'h-button-icon-only': instance.hasIcon && !label && !buttonProps?.label && !badge,
                'h-button-vertical': (iconPos === 'top' || iconPos === 'bottom') && label,
                'h-button-loading': loading || buttonProps?.loading,
                'h-button-link': unwrap(instance.link) || buttonProps?.link,
                [`h-button-${severity || buttonProps?.severity}`]: severity || buttonProps?.severity,
                'h-button-raised': unwrap(instance.raised) || buttonProps?.raised,
                'h-button-rounded': unwrap(instance.rounded) || buttonProps?.rounded,
                'h-button-text': unwrap(instance.text) || variant === 'text' || buttonProps?.text || buttonProps?.variant === 'text',
                'h-button-outlined': unwrap(instance.outlined) || variant === 'outlined' || buttonProps?.outlined || buttonProps?.variant === 'outlined',
                'h-button-sm': size === 'small' || buttonProps?.size === 'small',
                'h-button-lg': size === 'large' || buttonProps?.size === 'large',
                'h-button-plain': unwrap(instance.plain) || buttonProps?.plain,
                'h-button-fluid': instance.hasFluid
            }
        ];
    },
    loadingIcon: 'h-button-loading-icon',
    icon: ({ instance }) => {
        const label = unwrap(instance.label);
        const iconPos = unwrap(instance.iconPos);
        const buttonProps = unwrap(instance.buttonProps);
        return [
            'h-button-icon',
            {
                [`h-button-icon-${iconPos || buttonProps?.iconPos}`]: label || buttonProps?.label,
                'h-button-icon-left': ((iconPos === 'left' || buttonProps?.iconPos === 'left') && label) || buttonProps?.label,
                'h-button-icon-right': ((iconPos === 'right' || buttonProps?.iconPos === 'right') && label) || buttonProps?.label,
                'h-button-icon-top': ((iconPos === 'top' || buttonProps?.iconPos === 'top') && label) || buttonProps?.label,
                'h-button-icon-bottom': ((iconPos === 'bottom' || buttonProps?.iconPos === 'bottom') && label) || buttonProps?.label
            },
            unwrap(instance.icon),
            buttonProps?.icon
        ];
    },
    spinnerIcon: ({ instance }) => {
        return Object.entries(instance.cx('icon'))
            .filter(([, value]) => !!value)
            .reduce((acc, [key]) => acc + ` ${key}`, 'h-button-loading-icon');
    },
    label: 'h-button-label'
};

@Injectable()
export class ButtonStyle extends BaseStyle {
    name = 'button';

    style = style;

    classes = classes;
}

/**
 *
 * Button is an extension to standard button element with icons and theming.
 *
 * [Live Demo](https://www.primeng.org/button/)
 *
 * @module buttonstyle
 *
 */
export enum ButtonClasses {
    /**
     * Class name of the root element
     */
    root = 'h-button',
    /**
     * Class name of the loading icon element
     */
    loadingIcon = 'h-button-loading-icon',
    /**
     * Class name of the icon element
     */
    icon = 'h-button-icon',
    /**
     * Class name of the label element
     */
    label = 'h-button-label'
}

export interface ButtonStyle extends BaseStyle {}
