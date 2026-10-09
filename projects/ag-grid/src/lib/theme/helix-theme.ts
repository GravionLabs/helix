import { themeQuartz } from 'ag-grid-community';

/**
 * The AG Grid theme of Helix: Quartz with its parameters pointed at the Helix design tokens.
 *
 * ```ts
 * import { helixGridTheme } from '@gravionlabs/helix-ag-grid';
 * // <ag-grid-angular [theme]="theme" …>   theme = helixGridTheme;
 * ```
 *
 * Every colour is a `var(--h-*)` reference, so the grid follows dark mode (`.app-dark`) and a primary colour that
 * changes at runtime without any code, and it needs no stylesheet. This is the AG Grid 33+ Theming API; the CSS
 * `.helix-ag-grid` class of `styles.css` is only for grids that still use a legacy theme (`theme="legacy"`).
 */
export const helixGridTheme = themeQuartz.withParams({
  backgroundColor: 'var(--h-content-background)',
  foregroundColor: 'var(--h-text-color)',
  accentColor: 'var(--h-primary-color)',
  borderColor: 'var(--h-content-border-color)',
  invalidColor: 'var(--h-form-field-invalid-border-color)',
  chromeBackgroundColor: 'var(--h-content-background)',
  headerBackgroundColor: 'var(--h-content-background)',
  headerTextColor: 'var(--h-text-color)',
  headerFontWeight: 600,
  oddRowBackgroundColor: 'color-mix(in srgb, var(--h-content-border-color) 25%, transparent)',
  rowHoverColor: 'var(--h-content-hover-background)',
  selectedRowBackgroundColor: 'var(--h-highlight-background)',
  inputBackgroundColor: 'var(--h-form-field-background)',
  fontFamily: 'inherit',
  wrapperBorderRadius: 'var(--h-content-border-radius)',
});
