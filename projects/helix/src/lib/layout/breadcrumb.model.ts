import { InjectionToken } from '@angular/core';

export interface HelixBreadcrumb {
  label: string;
  route?: string;
}

export const HELIX_BREADCRUMB = new InjectionToken<HelixBreadcrumb[]>('HELIX_BREADCRUMB', {
  factory: () => [],
});
