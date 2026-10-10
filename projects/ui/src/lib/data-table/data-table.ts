import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  Directive,
  inject,
  input,
  TemplateRef,
} from '@angular/core';
import { HxProgressSpinner } from '../progress/progress';
import type { HxTableSize } from '../table/table';

export type HxColumnAlign = 'left' | 'center' | 'right';

/** One column of an `hx-data-table`. */
export interface HxColumn {
  /** The property of the row shown in the column; a path (`address.city`) reads nested properties. */
  field: string;
  /** The header text. */
  header: string;
  /** CSS width of the column (`8rem`, `20%`). */
  width?: string;
  /** Horizontal alignment of header and cells (the start edge by default). */
  align?: HxColumnAlign;
}

/** The value of a (nested) property of a row. */
export function resolveField(row: unknown, field: string): unknown {
  let value: unknown = row;
  for (const key of field.split('.')) {
    if (value === null || value === undefined) return undefined;
    value = (value as Record<string, unknown>)[key];
  }
  return value;
}

/**
 * The template of the cells of one column: `<ng-template hxCell="price" let-row let-value="value">`. The context
 * has the row (`$implicit`), the `value` of the column's field and the `index` of the row.
 */
@Directive({ selector: 'ng-template[hxCell]' })
export class HxCell {
  /** The `field` of the column. */
  readonly field = input.required<string>({ alias: 'hxCell' });
  readonly template = inject<TemplateRef<HxCellContext>>(TemplateRef);
}

export interface HxCellContext {
  $implicit: unknown;
  value: unknown;
  index: number;
}

/** Cells of the header row, replacing the generated headers: `<ng-template hxTableHeader let-columns>…<th>`. */
@Directive({ selector: 'ng-template[hxTableHeader]' })
export class HxTableHeader {
  readonly template = inject<TemplateRef<HxTableColumnsContext>>(TemplateRef);
}

/** Cells of every body row, replacing the generated cells: `<ng-template hxTableBody let-row>…<td>`. */
@Directive({ selector: 'ng-template[hxTableBody]' })
export class HxTableBody {
  readonly template = inject<TemplateRef<HxTableRowContext>>(TemplateRef);
}

/** Cells of the footer row: `<ng-template hxTableFooter let-columns>…<td>`; without it there is no footer. */
@Directive({ selector: 'ng-template[hxTableFooter]' })
export class HxTableFooter {
  readonly template = inject<TemplateRef<HxTableColumnsContext>>(TemplateRef);
}

/** The content of the table's caption (the visible header above the table). */
@Directive({ selector: 'ng-template[hxTableCaption]' })
export class HxTableCaption {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

export interface HxTableColumnsContext {
  $implicit: readonly HxColumn[];
}

export interface HxTableRowContext {
  $implicit: unknown;
  index: number;
  columns: readonly HxColumn[];
}

/**
 * A data table on a native `<table>`: a column model, cell templates, caption, empty and loading state, striped
 * rows, gridlines, sizes and a scrolling body with a sticky header. It draws with the CSS of `table[hx-table]`.
 *
 * ```html
 * <hx-data-table [value]="invoices" [columns]="columns" dataKey="id" caption="Invoices" stripedRows>
 *   <ng-template hxCell="amount" let-value>{{ value | currency: 'EUR' }}</ng-template>
 * </hx-data-table>
 * ```
 *
 * The table keeps the native semantics: a `<caption>` (drawn as the table header; visually hidden when only
 * `ariaLabel` is set), `<th scope="col">` cells and `aria-busy` while `loading`. A scrolling table is a labelled,
 * focusable `region`.
 */
@Component({
  selector: 'hx-data-table',
  imports: [NgTemplateOutlet, HxProgressSpinner],
  templateUrl: './data-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-data-table' },
})
export class HxDataTable {
  /** The rows. */
  readonly value = input<readonly unknown[]>([]);
  readonly columns = input<readonly HxColumn[]>([]);
  /** The property that identifies a row (keeps the DOM of a row when the rows change). */
  readonly dataKey = input<string>();
  readonly size = input<HxTableSize>('medium');
  readonly stripedRows = input(false, { transform: booleanAttribute });
  readonly showGridlines = input(false, { transform: booleanAttribute });
  /** Rows change colour under the pointer (default on). */
  readonly hoverRows = input(true, { transform: booleanAttribute });
  readonly emptyMessage = input('No records found');
  /** Covers the table with a spinner and sets `aria-busy`. */
  readonly loading = input(false, { transform: booleanAttribute });
  /** Visible caption text above the table. */
  readonly caption = input<string>();
  /** The accessible name of the table; with no `caption` it becomes a visually hidden caption. */
  readonly ariaLabel = input<string>();
  /** The body scrolls inside this height (`300px`, `50vh`) and the header stays in view. */
  readonly scrollHeight = input<string>();
  /** A wide table scrolls horizontally instead of overflowing. */
  readonly scrollable = input(false, { transform: booleanAttribute });

  protected readonly cellTemplates = contentChildren(HxCell);
  protected readonly headerTemplate = contentChild(HxTableHeader);
  protected readonly bodyTemplate = contentChild(HxTableBody);
  protected readonly footerTemplate = contentChild(HxTableFooter);
  protected readonly captionTemplate = contentChild(HxTableCaption);

  /** The rows the table draws. */
  protected readonly rows = computed(() => this.value());
  protected readonly cells = computed(
    () => new Map(this.cellTemplates().map((cell) => [cell.field(), cell.template])),
  );
  protected readonly scrolls = computed(() => this.scrollable() || !!this.scrollHeight());
  protected readonly hasCaption = computed(
    () => !!this.caption() || !!this.captionTemplate() || !!this.ariaLabel(),
  );
  protected readonly captionHidden = computed(() => !this.caption() && !this.captionTemplate());
  protected readonly colspan = computed(() => Math.max(1, this.columns().length));

  protected trackRow(row: unknown, index: number): unknown {
    const key = this.dataKey();
    return key ? (resolveField(row, key) ?? index) : index;
  }

  protected valueOf(row: unknown, column: HxColumn): unknown {
    return resolveField(row, column.field);
  }
}
