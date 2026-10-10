import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  compareValues,
  HxCell,
  type HxColumn,
  HxDataTable,
  type HxLazyLoadEvent,
  HxRowExpansion,
  type HxSortMeta,
  HxTableBody,
  HxTableCaption,
  HxTableFooter,
  HxTableHeader,
  resolveField,
} from './data-table';

interface Row {
  id: number;
  name: string;
  price: number;
  address: { city: string };
}

const rows = (): Row[] => [
  { id: 1, name: 'Bamboo Watch', price: 65, address: { city: 'Berlin' } },
  { id: 2, name: 'Black Watch', price: 72, address: { city: 'Rome' } },
  { id: 3, name: 'Blue Band', price: 79, address: { city: 'Oslo' } },
];

@Component({
  imports: [HxDataTable, HxCell],
  template: `
    <hx-data-table [value]="value()" [columns]="columns" dataKey="id" [caption]="caption()" [ariaLabel]="label()" [loading]="loading()" [size]="size()" [stripedRows]="striped()" [showGridlines]="grid()" [scrollHeight]="height()" emptyMessage="Nothing here">
      <ng-template hxCell="price" let-row let-value="value"><b class="price">{{ value }} EUR</b></ng-template>
    </hx-data-table>
  `,
})
class Host {
  value = signal<Row[]>(rows());
  caption = signal<string | undefined>('Products');
  label = signal<string | undefined>(undefined);
  loading = signal(false);
  size = signal<'small' | 'medium' | 'large'>('medium');
  striped = signal(false);
  grid = signal(false);
  height = signal<string | undefined>(undefined);
  columns: HxColumn[] = [
    { field: 'name', header: 'Name', width: '12rem' },
    { field: 'address.city', header: 'City' },
    { field: 'price', header: 'Price', align: 'right' },
  ];
}

@Component({
  imports: [HxDataTable, HxTableHeader, HxTableBody, HxTableFooter, HxTableCaption],
  template: `
    <hx-data-table [value]="value" [columns]="columns">
      <ng-template hxTableCaption><em class="cap">Custom caption</em></ng-template>
      <ng-template hxTableHeader let-columns><th scope="col" class="h">{{ columns.length }} columns</th></ng-template>
      <ng-template hxTableBody let-row let-index="index"><td class="b">{{ index }}: {{ row.name }}</td></ng-template>
      <ng-template hxTableFooter><td class="f">Total</td></ng-template>
    </hx-data-table>
  `,
})
class TemplatesHost {
  value = rows();
  columns: HxColumn[] = [{ field: 'name', header: 'Name' }];
}

describe('HxDataTable', () => {
  let fixture: ComponentFixture<Host>;
  let host: Host;
  const root = () =>
    fixture.debugElement.query(By.css('hx-data-table')).nativeElement as HTMLElement;
  const q = <T extends HTMLElement>(sel: string) => root().querySelector<T>(sel);
  const qa = (sel: string) => [...root().querySelectorAll<HTMLElement>(sel)];
  const text = (sel: string) => qa(sel).map((e) => e.textContent?.trim());
  const update = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host, TemplatesHost] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    host = fixture.componentInstance;
    await update();
  });

  it('draws a native table with column headers and rows', () => {
    expect(q('table.hx-table')).toBeTruthy();
    expect(text('thead th')).toEqual(['Name', 'City', 'Price']);
    expect(qa('thead th').every((th) => th.getAttribute('scope') === 'col')).toBe(true);
    expect(qa('tbody tr')).toHaveLength(3);
    expect(text('tbody tr:first-child td')[0]).toBe('Bamboo Watch');
  });

  it('reads nested fields and uses the cell template of a column', () => {
    expect(text('tbody tr:first-child td')[1]).toBe('Berlin');
    expect(text('.price')).toEqual(['65 EUR', '72 EUR', '79 EUR']);
  });

  it('applies the width and alignment of a column', () => {
    expect(qa('thead th')[0].style.width).toBe('12rem');
    expect(qa('thead th')[2].classList.contains('hx-data-table-align-right')).toBe(true);
    expect(qa('tbody tr:first-child td')[2].classList.contains('hx-data-table-align-right')).toBe(
      true,
    );
  });

  it('shows the caption, and hides it visually when only an ariaLabel is given', async () => {
    expect(q('caption')?.textContent?.trim()).toBe('Products');
    expect(q('caption')?.classList.contains('hx-data-table-caption-hidden')).toBe(false);
    host.caption.set(undefined);
    host.label.set('Product list');
    await update();
    expect(q('caption')?.textContent?.trim()).toBe('Product list');
    expect(q('caption')?.classList.contains('hx-data-table-caption-hidden')).toBe(true);
    host.label.set(undefined);
    await update();
    expect(q('caption')).toBeNull();
  });

  it('shows the empty message in one cell across all columns', async () => {
    host.value.set([]);
    await update();
    const cell = q('.hx-data-table-empty td');
    expect(cell?.textContent?.trim()).toBe('Nothing here');
    expect(cell?.getAttribute('colspan')).toBe('3');
  });

  it('covers the table with a spinner and sets aria-busy while loading', async () => {
    expect(q('.hx-data-table-loading')).toBeNull();
    expect(q('.hx-data-table-frame')?.getAttribute('aria-busy')).toBeNull();
    host.loading.set(true);
    await update();
    expect(q('.hx-data-table-loading hx-progress-spinner')).toBeTruthy();
    expect(q('.hx-data-table-frame')?.getAttribute('aria-busy')).toBe('true');
  });

  it('maps size, stripes and gridlines onto the table classes', async () => {
    host.size.set('small');
    host.striped.set(true);
    host.grid.set(true);
    await update();
    const table = q('table') as HTMLElement;
    for (const c of ['hx-table-sm', 'hx-table-striped', 'hx-table-gridlines', 'hx-table-hoverable'])
      expect(table.classList.contains(c), c).toBe(true);
    host.size.set('large');
    await update();
    expect(table.classList.contains('hx-table-lg')).toBe(true);
  });

  it('scrolls in a labelled, focusable region with a sticky header when given a height', async () => {
    expect(q('.hx-data-table-scroll')?.getAttribute('role')).toBeNull();
    host.height.set('200px');
    await update();
    const scroll = q('.hx-data-table-scroll') as HTMLElement;
    expect(scroll.getAttribute('role')).toBe('region');
    expect(scroll.getAttribute('aria-label')).toBe('Products');
    expect(scroll.getAttribute('tabindex')).toBe('0');
    expect(scroll.style.maxHeight).toBe('200px');
    expect(q('table')?.classList.contains('hx-table-sticky')).toBe(true);
  });

  it('keeps the row elements of a dataKey when the rows are replaced', async () => {
    const before = qa('tbody tr');
    host.value.set(rows());
    await update();
    expect(qa('tbody tr')).toEqual(before);
  });

  it('resolves nested fields', () => {
    expect(resolveField({ a: { b: 3 } }, 'a.b')).toBe(3);
    expect(resolveField({ a: null }, 'a.b')).toBeUndefined();
    expect(resolveField(undefined, 'a')).toBeUndefined();
  });

  it('lets header, body, footer and caption templates take over', async () => {
    const f = TestBed.createComponent(TemplatesHost);
    f.detectChanges();
    await f.whenStable();
    f.detectChanges();
    const el = f.nativeElement as HTMLElement;
    expect(el.querySelector('.cap')?.textContent).toBe('Custom caption');
    expect(el.querySelector('th.h')?.textContent).toBe('1 columns');
    expect([...el.querySelectorAll('td.b')].map((e) => e.textContent)).toEqual([
      '0: Bamboo Watch',
      '1: Black Watch',
      '2: Blue Band',
    ]);
    expect(el.querySelector('tfoot td.f')?.textContent).toBe('Total');
  });
});

const many = (n: number): Row[] =>
  Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: `Item ${String(i + 1).padStart(2, '0')}`,
    price: (i * 37) % 100,
    address: { city: ['Rome', 'Berlin', 'Oslo'][i % 3] },
  }));

@Component({
  imports: [HxDataTable],
  template: `
    <hx-data-table [value]="value()" [columns]="columns" dataKey="id" [sortMode]="mode()" [(sortField)]="field" [(sortOrder)]="order" [(multiSortMeta)]="meta" [paginator]="true" [(first)]="first" [(rows)]="rows" [rowsPerPageOptions]="[5, 10]" [lazy]="lazy()" [totalRecords]="total()" (lazyLoad)="events.push($event)" ariaLabel="Items" />
  `,
})
class SortHost {
  value = signal<Row[]>(many(12));
  mode = signal<'single' | 'multiple'>('single');
  field = signal<string | null>(null);
  order = signal<1 | -1>(1);
  meta = signal<HxSortMeta[]>([]);
  first = signal(0);
  rows = signal(5);
  lazy = signal(false);
  total = signal<number | undefined>(undefined);
  events: HxLazyLoadEvent[] = [];
  columns: HxColumn[] = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'address.city', header: 'City', sortable: true },
    { field: 'price', header: 'Price', sortable: true, align: 'right' },
    { field: 'id', header: 'Id' },
  ];
}

describe('HxDataTable sorting and paging', () => {
  let fixture: ComponentFixture<SortHost>;
  let host: SortHost;
  const root = () => fixture.nativeElement as HTMLElement;
  const th = (i: number) => root().querySelectorAll<HTMLElement>('thead th')[i];
  const sortButton = (i: number) => th(i).querySelector('button') as HTMLButtonElement;
  const names = () =>
    [...root().querySelectorAll('tbody tr td:first-child')].map((e) => e.textContent?.trim());
  const update = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const click = async (el: HTMLElement) => {
    el.click();
    await update();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SortHost] }).compileComponents();
    fixture = TestBed.createComponent(SortHost);
    host = fixture.componentInstance;
    await update();
  });

  it('puts a button in sortable headers only, with aria-sort', () => {
    expect(sortButton(0)).toBeTruthy();
    expect(th(3).querySelector('button')).toBeNull();
    expect(th(3).getAttribute('aria-sort')).toBeNull();
    expect(th(0).getAttribute('aria-sort')).toBe('none');
  });

  it('cycles ascending, descending, off and announces it', async () => {
    await click(sortButton(2));
    expect(th(2).getAttribute('aria-sort')).toBe('ascending');
    expect(host.field()).toBe('price');
    expect(host.order()).toBe(1);
    expect(root().querySelector('[aria-live="polite"]:not(hx-paginator *)')?.textContent).toContain(
      'Sorted by Price, ascending',
    );
    await click(sortButton(2));
    expect(th(2).getAttribute('aria-sort')).toBe('descending');
    expect(host.order()).toBe(-1);
    await click(sortButton(2));
    expect(th(2).getAttribute('aria-sort')).toBe('none');
    expect(host.field()).toBeNull();
  });

  it('sorts the rows by value, numbers numerically', async () => {
    await click(sortButton(2));
    const prices = [...root().querySelectorAll('tbody tr td:nth-child(3)')].map((e) =>
      Number(e.textContent),
    );
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    await click(sortButton(2));
    const desc = [...root().querySelectorAll('tbody tr td:nth-child(3)')].map((e) =>
      Number(e.textContent),
    );
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  it('pages the rows and goes back to the first page when the sort changes', async () => {
    expect(names()).toEqual(['Item 01', 'Item 02', 'Item 03', 'Item 04', 'Item 05']);
    (root().querySelector('.hx-paginator-next') as HTMLElement).click();
    await update();
    expect(names()[0]).toBe('Item 06');
    expect(host.first()).toBe(5);
    await click(sortButton(0));
    expect(host.first()).toBe(0);
  });

  it('sorts several columns in multiple mode, most important first', async () => {
    host.mode.set('multiple');
    await update();
    await click(sortButton(1));
    await click(sortButton(2));
    expect(host.meta()).toEqual([
      { field: 'address.city', order: 1 },
      { field: 'price', order: 1 },
    ]);
    expect(th(1).querySelector('.hx-data-table-sort-rank')?.textContent).toBe('1');
    expect(th(2).querySelector('.hx-data-table-sort-rank')?.textContent).toBe('2');
    const rows = [...root().querySelectorAll('tbody tr')].map((tr) => [
      tr.children[1].textContent?.trim(),
      Number(tr.children[2].textContent),
    ]);
    for (let i = 1; i < rows.length; i++) {
      const [c0, p0] = rows[i - 1] as [string, number];
      const [c1, p1] = rows[i] as [string, number];
      expect(c0 < c1 || (c0 === c1 && p0 <= p1)).toBe(true);
    }
    await click(sortButton(1));
    expect(host.meta()[0]).toEqual({ field: 'address.city', order: -1 }); // keeps its place, flips the order
    await click(sortButton(1));
    expect(host.meta()).toEqual([{ field: 'price', order: 1 }]); // third click removes it
  });

  it('does not sort or page itself when lazy: it emits lazyLoad', async () => {
    host.lazy.set(true);
    host.total.set(100);
    await update();
    host.events.length = 0;
    expect(names()).toHaveLength(12);
    await click(sortButton(0));
    expect(host.events.at(-1)).toEqual({
      first: 0,
      rows: 5,
      sortField: 'name',
      sortOrder: 1,
      multiSortMeta: [{ field: 'name', order: 1 }],
      filters: {},
      globalFilter: '',
    });
    (root().querySelector('.hx-paginator-next') as HTMLElement).click();
    await update();
    expect(host.events.at(-1)?.first).toBe(5);
    expect(root().querySelector('.hx-paginator-report')?.textContent).toBe('6 - 10 of 100');
  });

  it('orders values with empty ones last', () => {
    expect(compareValues(2, 10)).toBeLessThan(0);
    expect(compareValues('Item 2', 'Item 10')).toBeLessThan(0);
    expect(compareValues(null, 1)).toBeGreaterThan(0);
    expect(compareValues(new Date(2026, 0, 1), new Date(2026, 5, 1))).toBeLessThan(0);
  });
});

@Component({
  imports: [HxDataTable, HxRowExpansion],
  template: `
    <hx-data-table #table [value]="value()" [columns]="columns" dataKey="id" [selectionMode]="mode()" [(selection)]="selection" [metaKeySelection]="meta()" [globalFilterFields]="['name', 'address.city']" filterDisplay="row" [(filters)]="filters" [(expandedRowKeys)]="expanded" [lazy]="lazy()" (lazyLoad)="events.push($event)" ariaLabel="Rows">
      @if (expandable()) {
        <ng-template hxRowExpansion let-row><p class="details">Details of {{ row.name }}</p></ng-template>
      }
    </hx-data-table>
    <button class="global" (click)="table.filterGlobal(text())">filter</button>
  `,
})
class SelectHost {
  value = signal<Row[]>(many(6));
  mode = signal<'single' | 'multiple' | undefined>('multiple');
  selection = signal<unknown>([]);
  meta = signal(false);
  filters = signal<Record<string, string>>({});
  expanded = signal<Record<string, boolean>>({});
  expandable = signal(false);
  lazy = signal(false);
  text = signal('');
  events: HxLazyLoadEvent[] = [];
  columns: HxColumn[] = [
    { field: 'name', header: 'Name', filter: true },
    { field: 'address.city', header: 'City', filter: true },
    { field: 'price', header: 'Price' },
  ];
}

describe('HxDataTable selection, filters and expansion', () => {
  let fixture: ComponentFixture<SelectHost>;
  let host: SelectHost;
  const root = () => fixture.nativeElement as HTMLElement;
  const rowEls = () => [
    ...root().querySelectorAll<HTMLElement>('tbody tr:not(.hx-data-table-expansion)'),
  ];
  const update = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const check = async (box: HTMLInputElement, checked: boolean) => {
    box.checked = checked;
    box.dispatchEvent(new Event('change', { bubbles: true }));
    await update();
  };
  const type = async (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await update();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SelectHost] }).compileComponents();
    fixture = TestBed.createComponent(SelectHost);
    host = fixture.componentInstance;
    await update();
  });

  it('adds a checkbox column with a labelled select-all box in multiple mode', async () => {
    const boxes = root().querySelectorAll<HTMLInputElement>('input[type=checkbox]');
    expect(boxes).toHaveLength(7);
    expect(boxes[0].getAttribute('aria-label')).toBe('Select all rows');
    expect(boxes[1].getAttribute('aria-label')).toBe('Select row 1');
    expect(rowEls()[0].getAttribute('aria-selected')).toBe('false');
    await check(boxes[1], true);
    expect(host.selection()).toEqual([expect.objectContaining({ id: 1 })]);
    expect(rowEls()[0].getAttribute('aria-selected')).toBe('true');
    expect(boxes[0].indeterminate).toBe(true);
  });

  it('selects and unselects all rows with the header checkbox', async () => {
    const all = root().querySelector('thead input[type=checkbox]') as HTMLInputElement;
    await check(all, true);
    expect((host.selection() as Row[]).length).toBe(6);
    expect(all.checked).toBe(true);
    expect(all.indeterminate).toBe(false);
    await check(all, false);
    expect(host.selection()).toEqual([]);
  });

  it('selects one row by click in single mode and unselects it by a second click', async () => {
    host.mode.set('single');
    host.selection.set(null);
    await update();
    expect(root().querySelector('input[type=checkbox]')).toBeNull();
    rowEls()[2].click();
    await update();
    expect((host.selection() as Row).id).toBe(3);
    expect(rowEls()[2].getAttribute('aria-selected')).toBe('true');
    rowEls()[2].click();
    await update();
    expect(host.selection()).toBeNull();
  });

  it('selects with Enter and Space on a focusable row', async () => {
    host.mode.set('single');
    host.selection.set(null);
    await update();
    expect(rowEls()[1].getAttribute('tabindex')).toBe('0');
    rowEls()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await update();
    expect((host.selection() as Row).id).toBe(2);
  });

  it('with metaKeySelection a plain click replaces the selection and Ctrl+click adds', async () => {
    host.meta.set(true);
    host.selection.set([]);
    await update();
    expect(root().querySelector('input[type=checkbox]')).toBeNull();
    rowEls()[0].click();
    rowEls()[1].dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }));
    await update();
    expect((host.selection() as Row[]).map((r) => r.id)).toEqual([1, 2]);
    rowEls()[3].click();
    await update();
    expect((host.selection() as Row[]).map((r) => r.id)).toEqual([4]);
  });

  it('filters with the global filter over the given fields', async () => {
    host.text.set('rome');
    (root().querySelector('button.global') as HTMLElement).click();
    await update();
    expect(rowEls().map((r) => r.children[1].textContent?.trim())).toEqual(['Item 01', 'Item 04']);
  });

  it('filters by column with the labelled inputs of the filter row', async () => {
    const inputs = root().querySelectorAll<HTMLInputElement>('.hx-data-table-filter-row input');
    expect(inputs).toHaveLength(2);
    expect(inputs[0].getAttribute('aria-label')).toBe('Filter Name');
    await type(inputs[1], 'osl');
    expect(host.filters()).toEqual({ 'address.city': 'osl' });
    expect(rowEls()).toHaveLength(2);
    await type(inputs[1], '');
    expect(host.filters()).toEqual({});
    expect(rowEls()).toHaveLength(6);
  });

  it('select-all covers the filtered rows only', async () => {
    const inputs = root().querySelectorAll<HTMLInputElement>('.hx-data-table-filter-row input');
    await type(inputs[1], 'osl');
    await check(root().querySelector('thead input[type=checkbox]') as HTMLInputElement, true);
    expect((host.selection() as Row[]).map((r) => r.id)).toEqual([3, 6]);
  });

  it('puts the filters into lazyLoad and leaves the rows alone when lazy', async () => {
    host.lazy.set(true);
    await update();
    host.events.length = 0;
    const inputs = root().querySelectorAll<HTMLInputElement>('.hx-data-table-filter-row input');
    await type(inputs[0], 'item 0');
    expect(host.events.at(-1)?.filters).toEqual({ name: 'item 0' });
    expect(rowEls()).toHaveLength(6);
    host.text.set('x');
    (root().querySelector('button.global') as HTMLElement).click();
    await update();
    expect(host.events.at(-1)?.globalFilter).toBe('x');
  });

  it('opens and closes a row below the row with an expander button', async () => {
    host.expandable.set(true);
    await update();
    const button = root().querySelector('.hx-data-table-expander') as HTMLButtonElement;
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-label')).toBe('Expand row');
    button.click();
    await update();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(root().querySelector('.hx-data-table-expansion .details')?.textContent).toBe(
      'Details of Item 01',
    );
    expect(host.expanded()).toEqual({ '1': true });
    expect(root().querySelector('.hx-data-table-expansion td')?.getAttribute('colspan')).toBe('5');
    button.click();
    await update();
    expect(root().querySelector('.hx-data-table-expansion')).toBeNull();
  });
});
