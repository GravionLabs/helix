import { Injectable } from '@angular/core';
import { BaseStyle } from '@gravionlabs/helix-core/base';

@Injectable({ providedIn: 'root' })
export class BaseComponentStyle extends BaseStyle {
    name = 'common';
}
