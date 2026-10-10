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
  model,
  type OnInit,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { HxCheckbox } from '../checkbox/checkbox';
import { HxInput } from '../input/input';
import { type HxPageEvent, HxPaginator } from '../paginator/paginator';
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
  /** The header is a button that sorts by the column. */
  sortable?: boolean;
  /** The column gets a text filter in the filter row (`filterDisplay="row"`). */
  filter?: boolean;
}

/** One sorted column: `order` 1 is ascending, -1 descending. */
export interface HxSortMeta {
  field: string;
  order: 1 | -1;
}

export type HxSortMode = 'single' | 'multiple';

/** What `lazyLoad` carries: the state the data has to be loaded for. */
export interface HxLazyLoadEvent {
  first: number;
  rows: number;
  sortField: string | null;
  sortOrder: 1 | -1;
  multiSortMeta: HxSortMeta[];
  /** The text of each column filter, by field (empty filters are left out). */
  filters: Record<string, string>;
  /** The text of the global filter. */
  globalFilter: string;
}

/** Replaces the client-side sort: gets the rows and the sort state, returns the sorted rows. */
export type HxSortFunction = (
  rows: readonly unknown[],
  meta: readonly HxSortMeta[],
) => readonly unknown[];

/** The default order of two values: empty values last, numbers and dates by value, text by locale. */
export function compareValues(a: unknown, b: unknown): number {
  const aEmpty = a === null || a === undefined || a === '';
  const bEmpty = b === null || b === undefined || b === '';
  if (aEmpty || bEmpty) return aEmpty && bEmpty ? 0 : aEmpty ? 1 : -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
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

/** The content of the row that opens below a row: `<ng-template hxRowExpansion let-row>`. */
@Directive({ selector: 'ng-template[hxRowExpansion]' })
export class HxRowExpansion {
  readonly template = inject<TemplateRef<HxTableRowContext>>(TemplateRef);
}

export type HxSelectionMode = 'single' | 'multiple';

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
  imports: [NgTemplateOutlet, HxProgressSpinner, HxPaginator, HxCheckbox, HxInput],
  templateUrl: './data-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-data-table' },
})
export class HxDataTable implements OnInit {
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

  /** `single`: one sorted column; `multiple`: a click adds the column to the sort order. */
  readonly sortMode = input<HxSortMode>('single');
  /** The sorted column in `single` mode. */
  readonly sortField = model<string | null>(null);
  /** 1 ascending, -1 descending (`single` mode). */
  readonly sortOrder = model<1 | -1>(1);
  /** The sorted columns in `multiple` mode, most important first. */
  readonly multiSortMeta = model<HxSortMeta[]>([]);
  /** Replaces the client-side sort. */
  readonly sortFunction = input<HxSortFunction>();

  /** Shows a paginator below the table. */
  readonly paginator = input(false, { transform: booleanAttribute });
  readonly rows = model(10);
  readonly first = model(0);
  readonly rowsPerPageOptions = input<readonly number[]>();
  readonly showCurrentPageReport = input(true, { transform: booleanAttribute });
  /** The rows are paged and sorted elsewhere: the table only shows `value` and emits `lazyLoad`. */
  readonly lazy = input(false, { transform: booleanAttribute });
  /** The number of all records when `lazy` (otherwise the length of `value`). */
  readonly totalRecords = input<number>();
  /** Emits `lazyLoad` once on init (default on). */
  readonly lazyLoadOnInit = input(true, { transform: booleanAttribute });

  /** Sort, page or rows-per-page changed while `lazy`: load the data for this state. */
  readonly lazyLoad = output<HxLazyLoadEvent>();

  /** `single`: a click selects a row; `multiple`: a checkbox column (or, with `metaKeySelection`, Ctrl/Cmd+click). */
  readonly selectionMode = input<HxSelectionMode>();
  /** The selected row (`single`) or rows (`multiple`). Rows are compared by `dataKey` when set. */
  readonly selection = model<unknown>(null);
  /** `multiple`: no checkbox column; a click selects only that row, Ctrl/Cmd+click adds or removes one. */
  readonly metaKeySelection = input(false, { transform: booleanAttribute });
  readonly selectAllLabel = input('Select all rows');
  /** `{row}` is replaced by the row number (1-based). */
  readonly selectRowLabel = input('Select row {row}');

  /** The properties of a row the global filter looks in (`filterGlobal`). */
  readonly globalFilterFields = input<readonly string[]>([]);
  /** `row`: a filter row with a text input under the headers of columns with `filter: true`. */
  readonly filterDisplay = input<'row'>();
  /** The text of the column filters, by field. */
  readonly filters = model<Record<string, string>>({});
  readonly filterLabel = input('Filter {header}');

  /** The rows that are open (by `dataKey`, or the row index without one); needs a `hxRowExpansion` template. */
  readonly expandedRowKeys = model<Record<string, boolean>>({});
  readonly expandLabel = input('Expand row');
  readonly collapseLabel = input('Collapse row');

  protected readonly announcement = signal('');
  private readonly globalText = signal('');

  protected readonly cellTemplates = contentChildren(HxCell);
  protected readonly headerTemplate = contentChild(HxTableHeader);
  protected readonly bodyTemplate = contentChild(HxTableBody);
  protected readonly footerTemplate = contentChild(HxTableFooter);
  protected readonly captionTemplate = contentChild(HxTableCaption);
  protected readonly expansionTemplate = contentChild(HxRowExpansion);

  /** The sort state as a list, whichever the mode. */
  protected readonly sortMeta = computed<HxSortMeta[]>(() =>
    this.sortMode() === 'multiple'
      ? this.multiSortMeta()
      : this.sortField()
        ? [{ field: this.sortField() as string, order: this.sortOrder() }]
        : [],
  );

  private readonly filtered = computed(() => {
    const value = this.value();
    if (this.lazy()) return value;
    const global = this.globalText().trim().toLowerCase();
    const fields = this.globalFilterFields();
    const columnFilters = Object.entries(this.filters()).filter(([, text]) => text.trim());
    if (!global && !columnFilters.length) return value;
    const has = (row: unknown, field: string, text: string) =>
      String(resolveField(row, field) ?? '')
        .toLowerCase()
        .includes(text);
    return value.filter(
      (row) =>
        (!global || fields.some((field) => has(row, field, global))) &&
        columnFilters.every(([field, text]) => has(row, field, text.trim().toLowerCase())),
    );
  });

  private readonly sorted = computed(() => {
    const value = this.filtered();
    const meta = this.sortMeta();
    if (this.lazy() || !meta.length) return value;
    const custom = this.sortFunction();
    if (custom) return custom(value, meta);
    return [...value].sort((a, b) => {
      for (const { field, order } of meta) {
        const result = compareValues(resolveField(a, field), resolveField(b, field));
        if (result) return result * order;
      }
      return 0;
    });
  });

  /** The number of records the paginator pages over. */
  protected readonly total = computed(() =>
    this.lazy() ? (this.totalRecords() ?? this.value().length) : this.sorted().length,
  );

  /** The rows the table draws: sorted, then the current page. */
  protected readonly visibleRows = computed(() => {
    const rows = this.sorted();
    if (!this.paginator() || this.lazy()) return rows;
    return rows.slice(this.first(), this.first() + this.rows());
  });
  protected readonly cells = computed(
    () => new Map(this.cellTemplates().map((cell) => [cell.field(), cell.template])),
  );
  protected readonly scrolls = computed(() => this.scrollable() || !!this.scrollHeight());
  protected readonly hasCaption = computed(
    () => !!this.caption() || !!this.captionTemplate() || !!this.ariaLabel(),
  );
  protected readonly captionHidden = computed(() => !this.caption() && !this.captionTemplate());
  protected readonly checkboxColumn = computed(
    () => this.selectionMode() === 'multiple' && !this.metaKeySelection(),
  );
  protected readonly expanderColumn = computed(() => !!this.expansionTemplate());
  protected readonly selectable = computed(() => !!this.selectionMode() && !this.checkboxColumn());
  protected readonly filterRow = computed(
    () => this.filterDisplay() === 'row' && this.columns().some((c) => c.filter),
  );
  protected readonly colspan = computed(
    () =>
      Math.max(1, this.columns().length) +
      (this.checkboxColumn() ? 1 : 0) +
      (this.expanderColumn() ? 1 : 0),
  );

  private selectedRows(): unknown[] {
    const selection = this.selection();
    if (this.selectionMode() === 'multiple') return Array.isArray(selection) ? selection : [];
    return selection === null || selection === undefined ? [] : [selection];
  }

  private keyOf(row: unknown): unknown {
    const key = this.dataKey();
    return key ? resolveField(row, key) : row;
  }

  protected isSelected(row: unknown): boolean {
    const key = this.keyOf(row);
    return this.selectedRows().some((selected) => this.keyOf(selected) === key);
  }

  /** All filtered rows (of every page) are selected / some are. */
  protected readonly allSelected = computed(() => {
    const rows = this.filtered();
    return rows.length > 0 && rows.every((row) => this.isSelected(row));
  });
  protected readonly someSelected = computed(
    () => !this.allSelected() && this.filtered().some((row) => this.isSelected(row)),
  );

  protected toggleSelectAll(checked: boolean): void {
    const rows = this.filtered();
    const keys = new Set(rows.map((row) => this.keyOf(row)));
    const rest = this.selectedRows().filter((row) => !keys.has(this.keyOf(row)));
    this.selection.set(checked ? [...rest, ...rows] : rest);
  }

  protected toggleRowCheckbox(row: unknown, checked: boolean): void {
    const rest = this.selectedRows().filter((r) => this.keyOf(r) !== this.keyOf(row));
    this.selection.set(checked ? [...rest, row] : rest);
  }

  /** A click or Enter/Space on a row selects it (single mode, or multiple with `metaKeySelection`). */
  protected selectRow(row: unknown, event: Event): void {
    if (!this.selectable()) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, input, a, select, textarea')) return;
    const selected = this.isSelected(row);
    if (this.selectionMode() === 'single') {
      this.selection.set(selected ? null : row);
      return;
    }
    const additive =
      (event as MouseEvent).ctrlKey || (event as MouseEvent).metaKey || event.type === 'keydown';
    if (additive) this.toggleRowCheckbox(row, !selected);
    else this.selection.set([row]);
  }

  protected onRowKey(row: unknown, event: Event): void {
    event.preventDefault();
    this.selectRow(row, event);
  }

  /** Filters every column in `globalFilterFields` for a text (case-insensitive, contains). */
  filterGlobal(text: string): void {
    this.globalText.set(text);
    this.first.set(0);
    if (this.lazy()) this.emitLazy();
  }

  protected setFilter(column: HxColumn, text: string): void {
    const next = { ...this.filters() };
    if (text) next[column.field] = text;
    else delete next[column.field];
    this.filters.set(next);
    this.first.set(0);
    if (this.lazy()) this.emitLazy();
  }

  protected rowKey(row: unknown, index: number): string {
    return String(this.dataKey() ? (resolveField(row, this.dataKey() as string) ?? index) : index);
  }

  protected isExpanded(row: unknown, index: number): boolean {
    return !!this.expandedRowKeys()[this.rowKey(row, index)];
  }

  protected toggleExpansion(row: unknown, index: number): void {
    const key = this.rowKey(row, index);
    const next = { ...this.expandedRowKeys() };
    if (next[key]) delete next[key];
    else next[key] = true;
    this.expandedRowKeys.set(next);
  }

  ngOnInit(): void {
    if (this.lazy() && this.lazyLoadOnInit()) this.emitLazy();
  }

  /** The order of a column (1, -1) or 0 when it is not sorted. */
  protected orderOf(column: HxColumn): 0 | 1 | -1 {
    return this.sortMeta().find((m) => m.field === column.field)?.order ?? 0;
  }

  protected ariaSort(column: HxColumn): 'ascending' | 'descending' | 'none' | null {
    if (!column.sortable) return null;
    const order = this.orderOf(column);
    return order === 1 ? 'ascending' : order === -1 ? 'descending' : 'none';
  }

  /** The position (1-based) of a column in a multi-column sort, when more than one column is sorted. */
  protected sortRank(column: HxColumn): number | null {
    const meta = this.sortMeta();
    if (this.sortMode() !== 'multiple' || meta.length < 2) return null;
    const index = meta.findIndex((m) => m.field === column.field);
    return index < 0 ? null : index + 1;
  }

  /** Sorts by a column: ascending, then descending, then not at all. */
  sort(column: HxColumn): void {
    const order = this.orderOf(column);
    const next: 0 | 1 | -1 = order === 0 ? 1 : order === 1 ? -1 : 0;
    if (this.sortMode() === 'multiple') {
      const rest = this.multiSortMeta().filter((m) => m.field !== column.field);
      this.multiSortMeta.set(
        next === 0
          ? rest
          : order === 0
            ? [...rest, { field: column.field, order: next }]
            : this.multiSortMeta().map((m) =>
                m.field === column.field ? { ...m, order: next as 1 | -1 } : m,
              ),
      );
    } else {
      this.sortField.set(next === 0 ? null : column.field);
      this.sortOrder.set(next === 0 ? 1 : next);
    }
    this.announcement.set(
      next === 0
        ? `Sorting by ${column.header} removed`
        : `Sorted by ${column.header}, ${next === 1 ? 'ascending' : 'descending'}`,
    );
    this.first.set(0);
    if (this.lazy()) this.emitLazy();
  }

  protected onPage(event: HxPageEvent): void {
    this.first.set(event.first);
    this.rows.set(event.rows);
    if (this.lazy()) this.emitLazy();
  }

  private emitLazy(): void {
    this.lazyLoad.emit({
      first: this.first(),
      rows: this.rows(),
      sortField:
        this.sortMode() === 'multiple'
          ? (this.multiSortMeta()[0]?.field ?? null)
          : this.sortField(),
      sortOrder:
        this.sortMode() === 'multiple' ? (this.multiSortMeta()[0]?.order ?? 1) : this.sortOrder(),
      multiSortMeta: this.sortMode() === 'multiple' ? this.multiSortMeta() : this.sortMeta(),
      filters: this.filters(),
      globalFilter: this.globalText(),
    });
  }

  protected trackRow(row: unknown, index: number): unknown {
    const key = this.dataKey();
    return key ? (resolveField(row, key) ?? index) : index;
  }

  protected valueOf(row: unknown, column: HxColumn): unknown {
    return resolveField(row, column.field);
  }
}
