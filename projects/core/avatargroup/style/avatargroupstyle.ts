import { Injectable } from '@angular/core';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const classes = {
    root: 'h-avatar-group h-component'
};

@Injectable()
export class AvatarGroupStyle extends BaseStyle {
    name = 'avatargroup';

    classes = classes;
}

/**
 *
 * A set of Avatars can be displayed together using the AvatarGroup component.
 *
 * [Live Demo](https://www.primeng.org/avatar/)
 *
 * @module avatargroupstyle
 *
 */
export enum AvatarGroupClasses {
    root = 'h-avatar-group'
}

export interface AvatarGroupStyle extends BaseStyle {}
