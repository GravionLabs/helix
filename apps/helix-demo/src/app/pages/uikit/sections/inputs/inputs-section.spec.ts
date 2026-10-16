import { TestBed } from '@angular/core/testing';
import { HxInputsSection } from './inputs-section';

describe('HxInputsSection', () => {
  const NOW = new Date(2026, 9, 14, 15, 30, 20);

  beforeEach(() => vi.useFakeTimers({ now: NOW, toFake: ['Date'] }));
  afterEach(() => vi.useRealTimers());

  /** The row under the quick select: the expression and its dates resolved against the current time. */
  const expressionRow = (el: HTMLElement) =>
    [...el.querySelectorAll<HTMLElement>('.row')].find(
      (row) => row.querySelector('.label')?.textContent?.trim() === 'expression',
    );

  it('shows the quick select expression resolved again against the current time', () => {
    const fixture = TestBed.createComponent(HxInputsSection);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(expressionRow(el)?.querySelector('code')?.textContent).toBe('none (absolute)');

    fixture.componentInstance.quickExpression.set({ from: 'now/d', to: 'now/d' });
    fixture.detectChanges();
    const row = expressionRow(el)!;
    expect(row.querySelector('code')?.textContent).toBe('now/d to now/d');
    expect(row.querySelector('span:not(.label)')?.textContent).toBe(
      `${new Date(2026, 9, 14).toLocaleString()} - ${new Date(2026, 9, 14, 23, 59, 59, 999).toLocaleString()}`,
    );
  });
});
