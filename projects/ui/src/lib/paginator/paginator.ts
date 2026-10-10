import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  numberAttribute,
  output,
} from '@angular/core';
import { HxSelect } from '../select/select';

/** What `pageChange` carries. */
export interface HxPageEvent {
  /** Index of the first record of the page (0-based). */
  first: number;
  /** Records per page. */
  rows: number;
  /** The page, 0-based. */
  page: number;
  pageCount: number;
}

/**
 * Page navigation for a list or table: first, previous, page links, next, last, and a rows-per-page select.
 *
 * ```html
 * <hx-paginator [rows]="10" [totalRecords]="120" [(first)]="first" [rowsPerPageOptions]="[10, 20, 50]"
 *   showCurrentPageReport (pageChange)="load($event)" />
 * ```
 *
 * `first` is the index of the first record shown, so the page is `first / rows`. A change of the rows per page keeps
 * the first record on screen. The paginator is a `nav`; the current page link has `aria-current="page"`. Labels are
 * inputs, for translation.
 */
@Component({
  selector: 'hx-paginator',
  imports: [HxSelect],
  templateUrl: './paginator.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hx-paginator' },
})
export class HxPaginator {
  /** Records per page. */
  readonly rows = model(10);
  readonly totalRecords = input(0, { transform: numberAttribute });
  /** Index of the first record shown. */
  readonly first = model(0);
  /** Offers a rows-per-page select when given. */
  readonly rowsPerPageOptions = input<readonly number[]>();
  /** Page links shown at most (the current page stays in the middle). */
  readonly pageLinkSize = input(5, { transform: numberAttribute });
  readonly showCurrentPageReport = input(false, { transform: booleanAttribute });
  /** `{first}`, `{last}`, `{totalRecords}`, `{page}` and `{pageCount}` are replaced. */
  readonly currentPageReportTemplate = input('{first} - {last} of {totalRecords}');
  readonly showFirstLastButtons = input(true, { transform: booleanAttribute });

  readonly ariaLabel = input('Pagination');
  readonly firstPageLabel = input('First page');
  readonly previousPageLabel = input('Previous page');
  readonly nextPageLabel = input('Next page');
  readonly lastPageLabel = input('Last page');
  /** `{page}` is replaced by the page number (1-based). */
  readonly pageLabelTemplate = input('Page {page}');
  readonly rowsPerPageLabel = input('Rows per page');

  readonly pageChange = output<HxPageEvent>();

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.totalRecords() / Math.max(1, this.rows()))),
  );
  protected readonly page = computed(() =>
    Math.min(this.pageCount() - 1, Math.floor(this.first() / Math.max(1, this.rows()))),
  );
  protected readonly isFirst = computed(() => this.page() === 0);
  protected readonly isLast = computed(() => this.page() >= this.pageCount() - 1);

  /** The page numbers (0-based) of the links: a window of `pageLinkSize` around the current page. */
  protected readonly links = computed(() => {
    const count = this.pageCount();
    const size = Math.max(1, Math.min(this.pageLinkSize(), count));
    let start = Math.max(0, this.page() - Math.floor(size / 2));
    start = Math.min(start, count - size);
    return Array.from({ length: size }, (_, i) => start + i);
  });

  protected readonly rowsOptions = computed(() =>
    (this.rowsPerPageOptions() ?? []).map((n) => ({ label: String(n), value: n })),
  );

  protected readonly report = computed(() => {
    const total = this.totalRecords();
    const first = total === 0 ? 0 : this.page() * this.rows() + 1;
    const last = Math.min(total, (this.page() + 1) * this.rows());
    return this.currentPageReportTemplate()
      .replace('{first}', String(first))
      .replace('{last}', String(last))
      .replace('{totalRecords}', String(total))
      .replace('{page}', String(this.page() + 1))
      .replace('{pageCount}', String(this.pageCount()));
  });

  protected pageLabel(page: number): string {
    return this.pageLabelTemplate().replace('{page}', String(page + 1));
  }

  /** Goes to a page (0-based); an out-of-range page is clamped. */
  goTo(page: number): void {
    const target = Math.min(this.pageCount() - 1, Math.max(0, page));
    if (target === this.page() && this.first() === target * this.rows()) return;
    this.first.set(target * this.rows());
    this.emit();
  }

  protected setRows(value: unknown): void {
    const rows = Number(value);
    if (!rows || rows === this.rows()) return;
    this.rows.set(rows);
    // keep the first record of the page on screen
    this.first.set(Math.floor(this.first() / rows) * rows);
    this.emit();
  }

  private emit(): void {
    this.pageChange.emit({
      first: this.first(),
      rows: this.rows(),
      page: this.page(),
      pageCount: this.pageCount(),
    });
  }
}
