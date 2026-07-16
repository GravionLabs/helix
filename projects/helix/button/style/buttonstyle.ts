import { Injectable } from '@angular/core';
import { style } from '@primeuix/styles/button';
import { BaseStyle } from '@gravionlabs/helix/base';

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
            'p-button p-component',
            {
                'p-button-icon-only': instance.hasIcon && !label && !buttonProps?.label && !badge,
                'p-button-vertical': (iconPos === 'top' || iconPos === 'bottom') && label,
                'p-button-loading': loading || buttonProps?.loading,
                'p-button-link': unwrap(instance.link) || buttonProps?.link,
                [`p-button-${severity || buttonProps?.severity}`]: severity || buttonProps?.severity,
                'p-button-raised': unwrap(instance.raised) || buttonProps?.raised,
                'p-button-rounded': unwrap(instance.rounded) || buttonProps?.rounded,
                'p-button-text': unwrap(instance.text) || variant === 'text' || buttonProps?.text || buttonProps?.variant === 'text',
                'p-button-outlined': unwrap(instance.outlined) || variant === 'outlined' || buttonProps?.outlined || buttonProps?.variant === 'outlined',
                'p-button-sm': size === 'small' || buttonProps?.size === 'small',
                'p-button-lg': size === 'large' || buttonProps?.size === 'large',
                'p-button-plain': unwrap(instance.plain) || buttonProps?.plain,
                'p-button-fluid': instance.hasFluid
            }
        ];
    },
    loadingIcon: 'p-button-loading-icon',
    icon: ({ instance }) => {
        const label = unwrap(instance.label);
        const iconPos = unwrap(instance.iconPos);
        const buttonProps = unwrap(instance.buttonProps);
        return [
            'p-button-icon',
            {
                [`p-button-icon-${iconPos || buttonProps?.iconPos}`]: label || buttonProps?.label,
                'p-button-icon-left': ((iconPos === 'left' || buttonProps?.iconPos === 'left') && label) || buttonProps?.label,
                'p-button-icon-right': ((iconPos === 'right' || buttonProps?.iconPos === 'right') && label) || buttonProps?.label,
                'p-button-icon-top': ((iconPos === 'top' || buttonProps?.iconPos === 'top') && label) || buttonProps?.label,
                'p-button-icon-bottom': ((iconPos === 'bottom' || buttonProps?.iconPos === 'bottom') && label) || buttonProps?.label
            },
            unwrap(instance.icon),
            buttonProps?.icon
        ];
    },
    spinnerIcon: ({ instance }) => {
        return Object.entries(instance.cx('icon'))
            .filter(([, value]) => !!value)
            .reduce((acc, [key]) => acc + ` ${key}`, 'p-button-loading-icon');
    },
    label: 'p-button-label'
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
    root = 'p-button',
    /**
     * Class name of the loading icon element
     */
    loadingIcon = 'p-button-loading-icon',
    /**
     * Class name of the icon element
     */
    icon = 'p-button-icon',
    /**
     * Class name of the label element
     */
    label = 'p-button-label'
}

export interface ButtonStyle extends BaseStyle {}
