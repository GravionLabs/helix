import type { TemplateRef } from '@angular/core';

/** Where a view opens: in the sidebar or as a tab (ADR 0005). */
export type HelixViewPlacement = 'sidebar' | 'tab';

/** The end of the activity bar a view sits at. */
export type HelixViewPosition = 'top' | 'bottom';

/**
 * One view of the app, declared once for the desktop and the mobile shell (ADR 0005). The content is
 * supplied by the app for the `id`.
 */
export interface HelixView {
  readonly id: string;
  readonly label: string;
  /** An inline SVG template, or an icon name the app resolves through its own icon registry. */
  readonly icon: TemplateRef<unknown> | string;
  readonly placement: HelixViewPlacement;
  readonly position: HelixViewPosition;
}
