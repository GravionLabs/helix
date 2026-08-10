import { Injectable } from '@angular/core';
import { BaseStyle } from '@helix-ui/core/base';

@Injectable({ providedIn: 'root' })
export class BaseComponentStyle extends BaseStyle {
    name = 'common';
}
