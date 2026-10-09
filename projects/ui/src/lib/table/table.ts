import { booleanAttribute, Directive, input } from '@angular/core';

export type HxTableSize = 'small' | 'medium' | 'large';

/**
 * A native `<table>` drawn as a Helix table (CSS only): header, body and footer rows, hover, stripes and gridlines
 * from the `--h-datatable-*` tokens. For small static tables; there is no sorting, paging or selection here: data grids
 * use AG Grid through `helix-ag-grid`.
 *
 * ```html
 * <div class="hx-table-scroll">
 *   <table hx-table striped hoverable>
 *     <caption>Invoices</caption>
 *     <thead><tr><th scope="col">No.</th><th scope="col">Amount</th></tr></thead>
 *     <tbody><tr><th scope="row">1001</th><td>€ 120</td></tr></tbody>
 *   </table>
 * </div>
 * ```
 *
 * The table keeps its native semantics: nothing is added to the roles. Give it a `<caption>` (it is drawn as the table
 * header), mark header cells with `<th scope="col">` / `<th scope="row">`, and mark a selected row with
 * `aria-selected="true"`, which is also what is styled. Wrap a wide table in `.hx-table-scroll` for horizontal
 * scrolling; with `stickyHeader` and a `max-height` on the wrapper the header stays in view. The wrapper is a scroll
 * container, so give it `tabindex="0"` and a name (`role="region"` with `aria-label`) when it scrolls.
 */
@Directive({
  selector: 'table[hx-table]',
  host: {
    class: 'hx-table',
    '[class.hx-table-sm]': "size() === 'small'",
    '[class.hx-table-lg]': "size() === 'large'",
    '[class.hx-table-striped]': 'striped()',
    '[class.hx-table-gridlines]': 'gridlines()',
    '[class.hx-table-hoverable]': 'hoverable()',
    '[class.hx-table-sticky]': 'stickyHeader()',
  },
})
export class HxTable {
  readonly size = input<HxTableSize>('medium');
  /** Alternate rows get a background. */
  readonly striped = input(false, { transform: booleanAttribute });
  /** Borders around every cell. */
  readonly gridlines = input(false, { transform: booleanAttribute });
  /** Rows of the body change colour under the pointer. */
  readonly hoverable = input(false, { transform: booleanAttribute });
  /** The header stays at the top of its scroll container (`.hx-table-scroll` with a `max-height`). */
  readonly stickyHeader = input(false, { transform: booleanAttribute });
}
