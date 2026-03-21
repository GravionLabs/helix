import { InjectionToken } from '@angular/core';
import { MenuItem } from 'primeng/api';

export const GV_MENU_MODEL = new InjectionToken<MenuItem[]>('GV_MENU_MODEL', {
    factory: () => []
});
