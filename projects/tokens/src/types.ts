// The shape of every token module: nested records whose leaves are CSS values or `{path}` references to
// other tokens (`{primary.600}`). Data only: no functions, no imports of any styling engine.
export interface TokenTree {
  [key: string]: string | number | TokenTree;
}
