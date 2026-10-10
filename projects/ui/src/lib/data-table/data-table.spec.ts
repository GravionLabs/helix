import { Component, signal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  HxCell,
  type HxColumn,
  HxDataTable,
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
