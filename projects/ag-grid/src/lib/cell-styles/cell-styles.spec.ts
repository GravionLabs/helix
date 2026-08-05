import type { CellClassParams } from 'ag-grid-community';
import { describe, expect, it } from 'vitest';
import { numberCellStyle } from './cell-styles';

function params(value: unknown): CellClassParams {
  return { value } as CellClassParams;
}

describe('numberCellStyle', () => {
  it('right-aligns a zero value without colour', () => {
    expect(numberCellStyle(params(0))).toEqual({ textAlign: 'right' });
  });

  it('right-aligns a null value without colour', () => {
    expect(numberCellStyle(params(null))).toEqual({ textAlign: 'right' });
  });

  it('right-aligns an undefined value without colour', () => {
    expect(numberCellStyle(params(undefined))).toEqual({ textAlign: 'right' });
  });

  it('right-aligns a positive number with green colour', () => {
    expect(numberCellStyle(params(42))).toEqual({
      textAlign: 'right',
      color: 'var(--p-green-500)',
    });
  });

  it('right-aligns a negative number with green colour (truthy)', () => {
    expect(numberCellStyle(params(-1))).toEqual({
      textAlign: 'right',
      color: 'var(--p-green-500)',
    });
  });

  it('right-aligns a non-empty string with green colour', () => {
    expect(numberCellStyle(params('hello'))).toEqual({
      textAlign: 'right',
      color: 'var(--p-green-500)',
    });
  });
});
