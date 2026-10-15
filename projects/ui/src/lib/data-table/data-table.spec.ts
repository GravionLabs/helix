import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HxPaginator } from '../paginator/paginator';
import {
  compareValues,
  HxCell,
  type HxColumn,
  HxColumnHeader,
  HxDataTable,
  type HxLazyLoadEvent,
  type HxRowClass,
  HxRowExpansion,
  type HxSortMeta,
  HxTableBody,
  HxTableCaption,
  HxTableEmpty,
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
  imports: [HxDataTable, HxTableHeader, HxTableBody, HxTableFooter, HxTableCaption, HxTableEmpty],
  template: `
    <hx-data-table id="empty" [value]="[]" [columns]="columns"><ng-template hxTableEmpty><em class="e">Nothing</em></ng-template></hx-data-table>
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
    expect(el.querySelector('#empty .hx-data-table-empty em.e')?.textContent).toBe('Nothing');
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

@Component({
  imports: [HxDataTable, HxColumnHeader],
  template: `
    <hx-data-table [value]="value" [columns]="columns" ariaLabel="Products">
      <ng-template hxColumnHeader="price" let-column><a class="info" href="#p">About {{ column.header }}</a></ng-template>
      <ng-template hxColumnHeader="id"><i class="plain">i</i></ng-template>
    </hx-data-table>
  `,
})
class HeaderHost {
  value = rows();
  columns: HxColumn[] = [
    { field: 'name', header: 'Name', sortable: true, title: 'The product name' },
    { field: 'price', header: 'Price', sortable: true },
    { field: 'id', header: 'Id' },
    { field: 'address.city', header: 'City' },
  ];
}

describe('HxDataTable column header title and template', () => {
  let fixture: ComponentFixture<HeaderHost>;
  const root = () => fixture.nativeElement as HTMLElement;
  const th = (i: number) => root().querySelectorAll<HTMLElement>('thead th')[i];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HeaderHost] }).compileComponents();
    fixture = TestBed.createComponent(HeaderHost);
    fixture.detectChanges();
  });

  it('sets the title attribute on the header only for columns with a title', () => {
    expect(th(0).getAttribute('title')).toBe('The product name');
    expect(th(0).hasAttribute('aria-describedby')).toBe(false);
    expect(th(1).hasAttribute('title')).toBe(false);
  });

  it('renders the template beside the sort button, not inside it', () => {
    const link = th(1).querySelector('a.info') as HTMLAnchorElement;
    expect(link.textContent).toBe('About Price');
    expect(link.closest('button')).toBeNull();
    expect(th(1).querySelectorAll('button').length).toBe(1);
  });

  it('keeps sorting and aria-sort of the column', () => {
    expect(th(1).getAttribute('aria-sort')).toBe('none');
    th(1).querySelector('button')?.click();
    fixture.detectChanges();
    expect(th(1).getAttribute('aria-sort')).toBe('ascending');
  });

  it('adds the template to a column that is not sortable', () => {
    expect(th(2).querySelector('i.plain')).toBeTruthy();
    expect(th(2).querySelector('button')).toBeNull();
    expect(th(2).textContent).toContain('Id');
    expect(th(2).hasAttribute('aria-sort')).toBe(false);
  });

  it('leaves other headers without extra content', () => {
    expect(th(0).querySelector('.hx-data-table-header-content')).toBeNull();
    expect(th(3).querySelector('.hx-data-table-header-content')).toBeNull();
  });
});

@Component({
  imports: [HxDataTable, HxColumnHeader],
  template: `
    <hx-data-table [value]="value" [columns]="columns" ariaLabel="Products">
      <ng-template hxColumnHeader="name" let-column><a class="link" href="#n" (click)="seen.push(column); $event.preventDefault()">Info</a></ng-template>
      <ng-template hxColumnHeader="price"><i class="r">r</i></ng-template>
      <ng-template hxColumnHeader="id"><i class="c">c</i></ng-template>
      <ng-template hxColumnHeader="missing"><i class="ghost">x</i></ng-template>
    </hx-data-table>
  `,
})
class ExtraHost {
  value = rows();
  seen: unknown[] = [];
  columns: HxColumn[] = [
    { field: 'name', header: 'Name', sortable: true, title: 'The product name' },
    { field: 'price', header: 'Price', sortable: true, align: 'right' },
    { field: 'id', header: 'Id', align: 'center' },
  ];
}

@Component({
  imports: [HxDataTable, HxColumnHeader, HxTableHeader],
  template: `
    <hx-data-table [value]="value" [columns]="columns" ariaLabel="Products">
      <ng-template hxColumnHeader="name"><i class="extra">x</i></ng-template>
      <ng-template hxTableHeader let-columns><th scope="col" class="own">Own</th></ng-template>
    </hx-data-table>
  `,
})
class ReplacedHost {
  value = rows();
  columns: HxColumn[] = [{ field: 'name', header: 'Name', title: 'Hint' }];
}

@Component({
  imports: [HxDataTable, HxColumnHeader],
  template: `
    <hx-data-table [value]="value" [columns]="columns" ariaLabel="Products">
      <ng-template hxColumnHeader="name"><i>a</i></ng-template>
      <ng-template hxColumnHeader="name"><i>b</i></ng-template>
    </hx-data-table>
  `,
})
class DuplicateHost {
  value = rows();
  columns: HxColumn[] = [{ field: 'name', header: 'Name' }];
}

describe('HxDataTable column header template details', () => {
  const setup = async <T>(type: new () => T) => {
    await TestBed.configureTestingModule({ imports: [type] }).compileComponents();
    const fixture = TestBed.createComponent(type);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  };
  const ths = (f: ComponentFixture<unknown>) => [
    ...(f.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('thead th'),
  ];

  it('keeps the title on a header that also has a template', async () => {
    const f = await setup(ExtraHost);
    expect(ths(f)[0].getAttribute('title')).toBe('The product name');
    expect(ths(f)[0].querySelector('a.link')).toBeTruthy();
  });

  it('puts the label or sort button before the extra content', async () => {
    const f = await setup(ExtraHost);
    const th = ths(f)[0];
    const button = th.querySelector('button') as HTMLElement;
    const link = th.querySelector('a.link') as HTMLElement;
    expect(button.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const plain = ths(f)[2];
    expect(plain.textContent?.indexOf('Id')).toBeLessThan(plain.textContent?.indexOf('c') ?? -1);
  });

  it('passes the column object as context and a click on the link does not sort', async () => {
    const f = await setup(ExtraHost);
    const th = ths(f)[0];
    (th.querySelector('a.link') as HTMLElement).click();
    f.detectChanges();
    expect(f.componentInstance.seen[0]).toBe(f.componentInstance.columns[0]);
    expect(th.getAttribute('aria-sort')).toBe('none');
  });

  it('sorts through the native button and cycles aria-sort with a template', async () => {
    const f = await setup(ExtraHost);
    const th = ths(f)[0];
    const button = th.querySelector('button') as HTMLButtonElement;
    expect(button.tagName).toBe('BUTTON');
    expect(button.type).toBe('button');
    for (const expected of ['ascending', 'descending', 'none']) {
      button.click();
      f.detectChanges();
      expect(th.getAttribute('aria-sort')).toBe(expected);
    }
  });

  it('keeps the alignment of the header with a template', async () => {
    const f = await setup(ExtraHost);
    const [, right, center] = ths(f);
    expect(right.classList.contains('hx-data-table-align-right')).toBe(true);
    expect(right.querySelector('i.r')).toBeTruthy();
    expect(center.classList.contains('hx-data-table-align-center')).toBe(true);
    expect(center.querySelector('i.c')).toBeTruthy();
  });

  it('renders nothing for a template of an unknown field', async () => {
    const f = await setup(ExtraHost);
    expect((f.nativeElement as HTMLElement).querySelector('i.ghost')).toBeNull();
  });

  it('ignores the template and title when hxTableHeader replaces the headers', async () => {
    const f = await setup(ReplacedHost);
    const all = ths(f);
    expect(all.length).toBe(1);
    expect(all[0].classList.contains('own')).toBe(true);
    expect(all[0].hasAttribute('title')).toBe(false);
    expect((f.nativeElement as HTMLElement).querySelector('i.extra')).toBeNull();
  });

  it('warns once in development about two templates for one field', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const f = await setup(DuplicateHost);
    f.detectChanges();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('"name"');
    warn.mockRestore();
  });
});

@Component({
  imports: [HxDataTable, HxCell],
  template: `
    <hx-data-table [value]="value()" [columns]="columns" [rowClass]="rowClass()" [emptyValue]="empty()" [sortFirstOrder]="first()" [sortMode]="mode()" [selectionMode]="selectionMode()" [paginator]="paging()" [(rows)]="rows" [rowsPerPageOptions]="options()" [allLabel]="allLabel()" [lazy]="lazy()" [totalRecords]="total()" [(filters)]="filters" (lazyLoad)="events.push($event)">
      <ng-template hxCell="note" let-value="value"><i class="note">[{{ value === null ? 'null' : value }}]</i></ng-template>
    </hx-data-table>
  `,
})
class OptionsHost {
  value = signal<Row[]>(many(12));
  empty = signal('');
  first = signal<'asc' | 'desc'>('asc');
  mode = signal<'single' | 'multiple'>('single');
  selectionMode = signal<'single' | undefined>(undefined);
  paging = signal(false);
  lazy = signal(false);
  rows = signal(5);
  total = signal<number | undefined>(12);
  options = signal<(number | 'all')[]>([5, 'all']);
  allLabel = signal('All');
  filters = signal<Record<string, string>>({});
  events: HxLazyLoadEvent[] = [];
  rowClass = signal<((row: Row) => HxRowClass) | undefined>((row: Row) =>
    row.price > 90
      ? 'expensive'
      : row.price === 0
        ? ['free']
        : { odd: row.id % 2 === 1, even: row.id % 2 === 0 && false },
  );
  columns: HxColumn[] = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'price', header: 'Price', sortable: true, sortFirstOrder: 'desc' },
    { field: 'note', header: 'Note' },
    { field: 'address.zip', header: 'Zip' },
    { field: 'id', header: 'Id', sortable: true, filter: true },
  ];
}

describe('HxDataTable row class, empty value, show-all paging and first sort order', () => {
  let fixture: ComponentFixture<OptionsHost>;
  let host: OptionsHost;
  const root = () => fixture.nativeElement as HTMLElement;
  const update = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const trs = () => [...root().querySelectorAll<HTMLElement>('tbody tr')];
  const th = (i: number) => root().querySelectorAll<HTMLElement>('thead th')[i];
  const sortBtn = (i: number) => th(i).querySelector('button') as HTMLElement;
  const click = async (el: HTMLElement) => {
    el.click();
    await update();
  };
  const names = () => trs().map((tr) => tr.children[0].textContent?.trim());
  const paginator = () => fixture.debugElement.query(By.directive(HxPaginator)).componentInstance;
  const selectEl = () => root().querySelector('hx-paginator hx-select') as HTMLElement;
  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((c) => {
      c.innerHTML = '';
    });
  });
  const live = () => root().querySelector('.hx-data-table-caption-hidden')?.textContent ?? '';

  beforeEach(async () => {
    // jsdom has no layout: the CDK listbox scrolls the active option into view
    Element.prototype.scrollIntoView = () => {};
    await TestBed.configureTestingModule({ imports: [OptionsHost] }).compileComponents();
    fixture = TestBed.createComponent(OptionsHost);
    host = fixture.componentInstance;
    await update();
  });

  // prices: id1 0, id2 37, id3 74, id4 11, id5 48, id6 85, id7 22, id8 59, id9 96, id10 33, id11 70, id12 4
  describe('rowClass', () => {
    it('applies a string, an array and the truthy keys of an object', () => {
      expect(trs()[0].classList.contains('free')).toBe(true);
      expect(trs()[2].classList.contains('odd')).toBe(true);
      expect(trs()[8].classList.contains('expensive')).toBe(true);
    });

    it('gives a row that matches nothing no classes of its own and drops falsy keys', () => {
      expect(trs()[1].classList.contains('odd')).toBe(false);
      expect(trs()[1].classList.contains('even')).toBe(false);
      expect(trs()[1].className.trim()).toBe('');
    });

    it('handles null, undefined and no function', async () => {
      host.rowClass.set(() => null);
      await update();
      expect(trs()[0].className.trim()).toBe('');
      host.rowClass.set(() => undefined);
      await update();
      expect(trs()[0].className.trim()).toBe('');
      host.rowClass.set(undefined);
      await update();
      expect(trs()[0].className.trim()).toBe('');
    });

    it('coexists with the selectable row class', async () => {
      host.selectionMode.set('single');
      await update();
      expect(trs()[8].classList.contains('hx-data-table-selectable')).toBe(true);
      expect(trs()[8].classList.contains('expensive')).toBe(true);
    });

    it('follows the value of the row', async () => {
      host.value.update((rows) => rows.map((r) => (r.id === 2 ? { ...r, price: 99 } : r)));
      await update();
      expect(trs()[1].classList.contains('expensive')).toBe(true);
    });
  });

  describe('emptyValue', () => {
    const withNotes = async () => {
      host.value.set([
        { id: 1, name: 'A', price: 0, address: { city: 'x' }, note: null },
        { id: 2, name: 'B', price: 5, address: { city: 'x' } },
        { id: 3, name: 'C', price: 5, address: { city: 'x' }, note: false },
        { id: 4, name: 'D', price: 5, address: { city: 'x' }, note: '' },
      ] as unknown as Row[]);
      await update();
    };

    it('replaces null and undefined, also nested, but not 0, false or an empty string', async () => {
      host.empty.set('n/a');
      await withNotes();
      expect(trs().map((tr) => tr.children[3].textContent?.trim())).toEqual([
        'n/a',
        'n/a',
        'n/a',
        'n/a',
      ]);
      expect(trs().map((tr) => tr.children[1].textContent?.trim())).toEqual(['0', '5', '5', '5']);
    });

    it('leaves the cell empty by default and for an empty string', async () => {
      await withNotes();
      expect(trs()[0].children[3].textContent?.trim()).toBe('');
      host.empty.set('n/a');
      await update();
      expect(trs()[3].children[3].textContent?.trim()).toBe('n/a');
    });

    it('does not show false or an empty string as empty (default cells)', async () => {
      fixture = TestBed.createComponent(OptionsHost);
      fixture.componentInstance.columns = [{ field: 'flag', header: 'Flag' }];
      fixture.componentInstance.empty.set('n/a');
      fixture.componentInstance.value.set([
        { flag: false },
        { flag: '' },
        { flag: 0 },
      ] as unknown as Row[]);
      await update();
      expect(trs().map((tr) => tr.children[0].textContent?.trim())).toEqual(['false', '', '0']);
    });

    it('hands the raw value to an hxCell template', async () => {
      fixture = TestBed.createComponent(OptionsHost);
      fixture.componentInstance.columns = [{ field: 'note', header: 'Note' }];
      fixture.componentInstance.empty.set('n/a');
      fixture.componentInstance.value.set([{ note: null }] as unknown as Row[]);
      await update();
      expect(root().querySelector('.note')?.textContent).toBe('[null]');
    });
  });

  describe('sortFirstOrder', () => {
    it('starts a column with its own first order, then the opposite, then off, announcing each step', async () => {
      await click(sortBtn(1));
      expect(th(1).getAttribute('aria-sort')).toBe('descending');
      expect(live()).toContain('Sorted by Price, descending');
      expect(trs()[0].children[1].textContent?.trim()).toBe('96');
      await click(sortBtn(1));
      expect(th(1).getAttribute('aria-sort')).toBe('ascending');
      expect(live()).toContain('Sorted by Price, ascending');
      expect(trs()[0].children[1].textContent?.trim()).toBe('0');
      await click(sortBtn(1));
      expect(th(1).getAttribute('aria-sort')).toBe('none');
      expect(live()).toContain('Sorting by Price removed');
    });

    it('falls back to ascending, and to the table input when set', async () => {
      await click(sortBtn(0));
      expect(th(0).getAttribute('aria-sort')).toBe('ascending');
      expect(names()[0]).toBe('Item 01');
      await click(sortBtn(0));
      expect(th(0).getAttribute('aria-sort')).toBe('descending');
      await click(sortBtn(0));
      expect(th(0).getAttribute('aria-sort')).toBe('none');
    });

    it('uses the table order for a column without its own', async () => {
      host.first.set('desc');
      await update();
      await click(sortBtn(0));
      expect(th(0).getAttribute('aria-sort')).toBe('descending');
      expect(names()[0]).toBe('Item 12');
    });

    it('lets a column ascending win over a descending table, and the reverse', async () => {
      const columns = host.columns.map((c) =>
        c.field === 'price' ? { ...c, sortFirstOrder: 'asc' as const } : c,
      );
      fixture = TestBed.createComponent(OptionsHost);
      fixture.componentInstance.first.set('desc');
      fixture.componentInstance.columns = columns;
      host = fixture.componentInstance;
      await update();
      await click(sortBtn(1));
      expect(th(1).getAttribute('aria-sort')).toBe('ascending');
      expect(trs()[0].children[1].textContent?.trim()).toBe('0');
    });

    it('applies in multiple mode', async () => {
      host.mode.set('multiple');
      await update();
      await click(sortBtn(1));
      expect(th(1).getAttribute('aria-sort')).toBe('descending');
      await click(sortBtn(0));
      expect(th(0).getAttribute('aria-sort')).toBe('ascending');
      expect(trs()[0].children[1].textContent?.trim()).toBe('96');
      await click(sortBtn(1));
      expect(th(1).getAttribute('aria-sort')).toBe('ascending');
      await click(sortBtn(1));
      expect(th(1).getAttribute('aria-sort')).toBe('none');
    });
  });

  describe('show all', () => {
    beforeEach(async () => {
      host.paging.set(true);
      await update();
    });

    const pick = async (label: string) => {
      selectEl().querySelector<HTMLElement>('button.hx-select-trigger')?.click();
      await update();
      const option = [...document.querySelectorAll<HTMLElement>('.hx-select-option')].find(
        (o) => o.textContent?.trim() === label,
      );
      option?.click();
      await update();
    };

    it('offers the All label in the real select, shows every row, then pages again', async () => {
      expect(trs().length).toBe(5);
      await pick('All');
      expect(trs().length).toBe(12);
      expect(selectEl().textContent).toContain('All');
      expect(host.rows()).toBe(5);
      await pick('5');
      expect(trs().length).toBe(5);
    });

    it('uses a custom allLabel', async () => {
      host.allLabel.set('Everything');
      await update();
      await pick('Everything');
      expect(trs().length).toBe(12);
      expect(selectEl().textContent).toContain('Everything');
    });

    it('keeps showing every row when the data grows or filters change', async () => {
      paginator().setRows('all');
      host.value.set(many(20));
      await update();
      expect(trs().length).toBe(20);
      host.filters.set({ id: '1' });
      await update();
      expect(trs().length).toBe(11);
    });

    it('ends when rows is set from outside or when all leaves the options', async () => {
      paginator().setRows('all');
      await update();
      host.rows.set(10);
      await update();
      expect(trs().length).toBe(10);
      paginator().setRows('all');
      await update();
      expect(trs().length).toBe(12);
      host.options.set([5, 10]);
      await update();
      expect(trs().length).toBe(10);
    });

    it('survives a recreated paginator', async () => {
      paginator().setRows('all');
      await update();
      host.paging.set(false);
      await update();
      host.paging.set(true);
      await update();
      expect(trs().length).toBe(12);
      expect(selectEl().textContent).toContain('All');
    });

    it('emits all records as rows to a lazy load, and keeps them for a following sort', async () => {
      host.lazy.set(true);
      await update();
      paginator().setRows('all');
      await update();
      expect(host.events.at(-1)?.rows).toBe(12);
      expect(host.events.at(-1)?.first).toBe(0);
      await click(sortBtn(0));
      expect(host.events.at(-1)?.rows).toBe(12);
      expect(host.events.at(-1)?.sortField).toBe('name');
    });

    it('does not request one row from a lazy table with an unknown total', async () => {
      host.lazy.set(true);
      host.total.set(0);
      await update();
      paginator().setRows('all');
      await update();
      expect(host.events.at(-1)?.rows).toBe(5);
    });
  });
});

@Component({
  imports: [HxDataTable, HxColumnHeader],
  template: `
    <hx-data-table [value]="value" [columns]="columns" [filterDisplay]="display()" [(filters)]="filters" [paginator]="true" [rows]="2" [lazy]="lazy()" [totalRecords]="6" (lazyLoad)="events.push($event)" [(first)]="first" ariaLabel="Rows">
      <ng-template hxColumnHeader="address.city"><i class="extra">i</i></ng-template>
    </hx-data-table>
  `,
})
class FilterMenuHost {
  value = many(6);
  display = signal<'row' | 'menu'>('menu');
  lazy = signal(false);
  first = signal(0);
  events: HxLazyLoadEvent[] = [];
  filters = signal<Record<string, string>>({});
  columns: HxColumn[] = [
    { field: 'name', header: 'Name', filter: true, sortable: true },
    { field: 'address.city', header: 'City', filter: true },
    { field: 'price', header: 'Price' },
  ];
}

describe('HxDataTable header filter menu', () => {
  let fixture: ComponentFixture<FilterMenuHost>;
  let host: FilterMenuHost;
  const root = () => fixture.nativeElement as HTMLElement;
  const rowEls = () => [...root().querySelectorAll<HTMLElement>('tbody tr')];
  const buttons = () => [
    ...root().querySelectorAll<HTMLButtonElement>('.hx-data-table-filter-button'),
  ];
  const dialog = () =>
    document.querySelector<HTMLElement>('.cdk-overlay-container [role="dialog"]');
  const popoverInput = () =>
    dialog()?.querySelector<HTMLInputElement>('.hx-data-table-filter-menu input') ?? null;
  const update = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const open = async (index: number) => {
    buttons()[index].click();
    await update();
    await update();
  };
  const type = async (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await update();
  };
  const key = async (target: Element | null, name: string) => {
    target?.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }));
    await update();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FilterMenuHost] }).compileComponents();
    fixture = TestBed.createComponent(FilterMenuHost);
    host = fixture.componentInstance;
    await update();
  });

  afterEach(() => {
    fixture.destroy();
    document.querySelector('.cdk-overlay-container')?.replaceChildren();
  });

  it('renders a labelled filter button per filter column and no filter row', () => {
    expect(buttons()).toHaveLength(2);
    expect(buttons()[0].getAttribute('aria-label')).toBe('Filter Name');
    expect(buttons()[1].getAttribute('aria-label')).toBe('Filter City');
    expect(buttons()[0].getAttribute('aria-haspopup')).toBe('dialog');
    expect(buttons()[0].getAttribute('aria-expanded')).toBe('false');
    expect(root().querySelector('.hx-data-table-filter-row')).toBeNull();
  });

  it('renders no popover and no filter button in row mode', async () => {
    host.display.set('row');
    await update();
    expect(buttons()).toHaveLength(0);
    expect(root().querySelector('hx-popover')).toBeNull();
    expect(root().querySelectorAll('.hx-data-table-filter-row input')).toHaveLength(2);
  });

  it('opens a popover with the input and focuses it', async () => {
    await open(1);
    expect(popoverInput()).not.toBeNull();
    expect(popoverInput()?.getAttribute('aria-label')).toBe('Filter City');
    expect(dialog()?.getAttribute('aria-label')).toBe('Filter City');
    expect(buttons()[1].getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(popoverInput());
  });

  it('closes when the same button is clicked again', async () => {
    await open(0);
    buttons()[0].click();
    await update();
    expect(dialog()).toBeNull();
    expect(buttons()[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('switches to another column with its own content and the focus in the input', async () => {
    host.filters.set({ 'address.city': 'osl' });
    await update();
    await open(0);
    expect(popoverInput()?.value).toBe('');
    await open(1);
    await update();
    expect(popoverInput()?.getAttribute('aria-label')).toBe('Filter City');
    expect(popoverInput()?.value).toBe('osl');
    expect(buttons()[0].getAttribute('aria-expanded')).toBe('false');
    expect(buttons()[1].getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(popoverInput());
  });

  it('filters the rows live and writes the text to the filters model', async () => {
    await open(1);
    await type(popoverInput() as HTMLInputElement, 'osl');
    expect(host.filters()).toEqual({ 'address.city': 'osl' });
    expect(root().querySelector('.hx-paginator-report')?.textContent).toBe('1 - 2 of 2');
  });

  it('goes back to the first page when the filter changes', async () => {
    (root().querySelector('.hx-paginator-next') as HTMLElement).click();
    await update();
    expect(host.first()).toBe(2);
    await open(1);
    await type(popoverInput() as HTMLInputElement, 'o');
    expect(host.first()).toBe(0);
  });

  it('puts the filter into lazyLoad and leaves the rows alone when lazy', async () => {
    host.lazy.set(true);
    await update();
    await open(0);
    await type(popoverInput() as HTMLInputElement, 'item 0');
    expect(host.events.at(-1)?.filters).toEqual({ name: 'item 0' });
    expect(rowEls()).toHaveLength(6);
  });

  it('clears the filter and closes with the Clear button', async () => {
    host.filters.set({ name: 'item 0' });
    await update();
    await open(0);
    expect(popoverInput()?.value).toBe('item 0');
    dialog()?.querySelector<HTMLElement>('.hx-data-table-filter-clear')?.click();
    await update();
    expect(host.filters()).toEqual({});
    expect(dialog()).toBeNull();
  });

  it('closes on Escape and returns the focus to the button', async () => {
    await open(0);
    await key(popoverInput(), 'Escape');
    expect(dialog()).toBeNull();
    expect(document.activeElement).toBe(buttons()[0]);
    expect(buttons()[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('closes on Enter in the input and keeps the filter', async () => {
    await open(0);
    await type(popoverInput() as HTMLInputElement, 'item 01');
    await key(popoverInput(), 'Enter');
    expect(dialog()).toBeNull();
    expect(host.filters()).toEqual({ name: 'item 01' });
  });

  it('is a native button in the tab order that the keyboard can open and close', async () => {
    const button = buttons()[0];
    expect(button.tagName).toBe('BUTTON');
    expect(button.type).toBe('button');
    expect(button.tabIndex).toBe(0);
    button.focus();
    expect(document.activeElement).toBe(button);
    // a native button turns Enter/Space into a click
    button.click();
    await update();
    await update();
    expect(document.activeElement).toBe(popoverInput());
    await key(popoverInput(), 'Escape');
    expect(document.activeElement).toBe(button);
  });

  it('does not sort when the filter button of a sortable column is clicked', async () => {
    await open(0);
    expect(root().querySelector('th')?.getAttribute('aria-sort')).toBe('none');
    expect(host.events).toHaveLength(0);
  });

  it('renders a column header template and the filter button side by side in the wrapper', () => {
    const wrapper = root()
      .querySelectorAll('thead th')[1]
      .querySelector('.hx-data-table-header-content');
    expect(wrapper?.querySelector('i.extra')).not.toBeNull();
    expect(wrapper?.querySelector('.hx-data-table-filter-button')).not.toBeNull();
    const sortable = root()
      .querySelectorAll('thead th')[0]
      .querySelector('.hx-data-table-header-content');
    expect(sortable?.querySelector('.hx-data-table-sort')).not.toBeNull();
    expect(sortable?.querySelector('.hx-data-table-filter-button')).not.toBeNull();
  });

  it('marks the button of a filtered column, also when the model is set from outside', async () => {
    expect(root().querySelector('.hx-data-table-filter-active')).toBeNull();
    host.filters.set({ 'address.city': 'osl' });
    await update();
    expect(buttons()[0].classList).not.toContain('hx-data-table-filter-active');
    expect(buttons()[1].classList).toContain('hx-data-table-filter-active');
    host.filters.set({});
    await update();
    expect(root().querySelector('.hx-data-table-filter-active')).toBeNull();
  });
});
