// The shape of every token module: nested records whose leaves are CSS values or `{path}` references to
// other tokens (`{primary.600}`). Data only: no functions, no imports of any styling engine.
export interface TokenTree {
  [key: string]: string | number | TokenTree;
}

/** The steps of the type scale (`--h-font-size-*`, ADR 0009). */
export type FontSizeStep = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

/** The steps of the spacing scale (`--h-space-*`, ADR 0009): multiples of 0.25rem. */
export type SpaceStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type FontSizeScale = Record<FontSizeStep, string>;

export type SpaceScale = Record<SpaceStep, string>;
