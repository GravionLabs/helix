import { TestBed } from '@angular/core/testing';
import type { ICellRendererParams } from 'ag-grid-community';
import { ActionsCell } from './cells/cells-demo';
import { ActionCell } from './overview/table-cells';

/** A button inside an AG Grid cell sits on the text baseline unless its renderer centres itself. */
describe.each([
  ['overview ActionCell', ActionCell],
  ['cells ActionsCell', ActionsCell],
])('%s', (_name, cell) => {
  it('is a flex container that centres its buttons over the full row height', () => {
    const fixture = TestBed.createComponent(cell as typeof ActionCell);
    fixture.componentInstance.agInit({ data: undefined } as ICellRendererParams);
    fixture.detectChanges();
    const style = (fixture.nativeElement as HTMLElement).style;
    expect(style.display).toBe('flex');
    expect(style.alignItems).toBe('center');
    expect(style.height).toBe('100%');
  });
});
