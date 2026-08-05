import type { CellClassParams, CellStyle } from 'ag-grid-community';

/**
 * AG Grid `cellStyle` callback that right-aligns numeric cells and colours
 * truthy (non-zero, non-null, non-undefined) values with the helix success
 * colour (`--p-green-500`).
 *
 * @example
 * ```ts
 * columnDefs = [{ field: 'amount', cellStyle: numberCellStyle }];
 * ```
 */
export function numberCellStyle(params: CellClassParams): CellStyle {
  return params.value
    ? { textAlign: 'right', color: 'var(--p-green-500)' }
    : { textAlign: 'right' };
}
