import { InjectionToken } from '@angular/core';
import type { MenuItem } from 'primeng/api';

export const HELIX_MENU_MODEL = new InjectionToken<MenuItem[]>('HELIX_MENU_MODEL', {
  factory: () => [],
});
