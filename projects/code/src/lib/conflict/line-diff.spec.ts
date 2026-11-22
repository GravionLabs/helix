import { describe, expect, it } from 'vitest';

import { hxDiffLines, hxDiffStat, hxMergeParts, hxMergeText, hxWordDiff } from './line-diff';

describe('line breaks', () => {
  it('reads CRLF as LF and carries no line break in rows', () => {
    const rows = hxDiffLines('a\r\nb\r\n', 'a\nb\n');
    expect(rows.map((r) => [r.kind, r.text])).toEqual([
      ['same', 'a'],
      ['same', 'b'],
    ]);
    expect(hxDiffLines('a\r\nb', 'a\nc').map((r) => r.text)).toEqual(['a', 'b', 'c']);
  });

  it('treats a text without a final newline as equal to the same text with one', () => {
    expect(hxDiffLines('x\n', 'x')).toEqual([{ kind: 'same', text: 'x' }]);
    expect(hxDiffStat(hxDiffLines('x\ny\n', 'x\ny'))).toEqual({ added: 0, removed: 0 });
  });

  it('gives no rows for two empty texts; a lone line break is one empty line', () => {
    expect(hxDiffLines('', '')).toEqual([]);
    expect(hxDiffLines('\n', '\n')).toEqual([{ kind: 'same', text: '' }]);
  });
});

describe('hxDiffLines', () => {
  it('marks no change as same', () => {
    expect(hxDiffLines('a\nb', 'a\nb').map((r) => r.kind)).toEqual(['same', 'same']);
  });

  it('finds added and removed lines', () => {
    const rows = hxDiffLines('a\nb\nc', 'a\nc\nd');
    expect(rows.map((r) => [r.kind, r.text])).toEqual([
      ['same', 'a'],
      ['del', 'b'],
      ['same', 'c'],
      ['add', 'd'],
    ]);
    expect(hxDiffStat(rows)).toEqual({ added: 1, removed: 1 });
  });

  it('shows a created and a deleted note as all added / all removed', () => {
    expect(hxDiffLines('', 'x\ny').map((r) => r.kind)).toEqual(['add', 'add']);
    expect(hxDiffLines('x\ny', '').map((r) => r.kind)).toEqual(['del', 'del']);
    expect(hxDiffLines('', '')).toEqual([]);
  });

  it('highlights the words of a changed line', () => {
    const rows = hxDiffLines('the quick fox', 'the slow fox');
    expect(rows.map((r) => r.kind)).toEqual(['del', 'add']);
    expect(rows[0].segments).toEqual([
      { text: 'the ', changed: false },
      { text: 'quick', changed: true },
      { text: ' fox', changed: false },
    ]);
    expect(rows[1].segments?.filter((s) => s.changed).map((s) => s.text)).toEqual(['slow']);
  });

  it('pairs removed and added lines in order; surplus lines have no segments', () => {
    const rows = hxDiffLines('one\ntwo', 'uno');
    expect(rows.map((r) => [r.kind, r.segments !== undefined])).toEqual([
      ['del', true],
      ['del', false],
      ['add', true],
    ]);
  });

  it('rebuilds both texts from the rows', () => {
    const a = 'x\ny\nz\nw';
    const b = 'x\nq\nz\nw\nv';
    const rows = hxDiffLines(a, b);
    expect(
      rows
        .filter((r) => r.kind !== 'add')
        .map((r) => r.text)
        .join('\n'),
    ).toBe(a);
    expect(
      rows
        .filter((r) => r.kind !== 'del')
        .map((r) => r.text)
        .join('\n'),
    ).toBe(b);
  });

  it('copes with a large change without a table', () => {
    const a = Array.from({ length: 3000 }, (_, i) => `a${i}`).join('\n');
    const b = Array.from({ length: 3000 }, (_, i) => `b${i}`).join('\n');
    expect(hxDiffStat(hxDiffLines(a, b))).toEqual({ added: 3000, removed: 3000 });
  });

  it('diffs two texts of 5,000 lines in under 1 s (middle below the cell limit)', () => {
    const a = Array.from({ length: 5000 }, (_, i) => `line ${i}`);
    const b = [...a];
    for (let i = 2000; i < 3800; i += 100) b[i] = `changed ${i}`;
    const start = performance.now();
    const rows = hxDiffLines(a.join('\n'), b.join('\n'));
    expect(performance.now() - start).toBeLessThan(1000);
    expect(hxDiffStat(rows)).toEqual({ added: 18, removed: 18 });
  });

  it('falls back to all deleted, then all added for a middle over 4,000,000 cells', () => {
    // 5,000 x 5,000 = 25M cells
    const a = Array.from({ length: 5000 }, (_, i) => `a${i}`);
    const b = Array.from({ length: 5000 }, (_, i) => `b${i}`);
    const rows = hxDiffLines(['head', ...a, 'tail'].join('\n'), ['head', ...b, 'tail'].join('\n'));
    expect(rows.map((r) => r.kind)).toEqual([
      'same',
      ...Array<'del'>(5000).fill('del'),
      ...Array<'add'>(5000).fill('add'),
      'same',
    ]);
    expect(rows[1].text).toBe('a0');
    expect(rows[5001].text).toBe('b0');
  });

  it('does not match common lines inside a middle over the limit', () => {
    const a = Array.from({ length: 3000 }, (_, i) => `a${i}`);
    const b = Array.from({ length: 3000 }, (_, i) => (i === 1500 ? 'a1500' : `b${i}`));
    const rows = hxDiffLines(['x', ...a, 'y'].join('\n'), ['x', ...b, 'z'].join('\n'));
    expect(hxDiffStat(rows)).toEqual({ added: 3001, removed: 3001 });
  });
});

describe('hxWordDiff', () => {
  it('keeps a line whole across its segments', () => {
    const line = 'Hello, wörld  [[link]] 42';
    expect(hxWordDiff(line, line).old).toEqual([{ text: line, changed: false }]);
  });

  it('marks everything on a side that has nothing in common', () => {
    const w = hxWordDiff('abc', 'xyz');
    expect(w.old).toEqual([{ text: 'abc', changed: true }]);
    expect(w.new).toEqual([{ text: 'xyz', changed: true }]);
  });
});

describe('hxMergeParts and hxMergeText', () => {
  const a = 'one\nmine\nthree\n';
  const b = 'one\ntheirs\nthree\nextra\n';

  it('splits into shared runs and hunks', () => {
    expect(hxMergeParts(a, b)).toEqual([
      { kind: 'same', lines: ['one'] },
      { kind: 'hunk', index: 0, mine: ['mine'], theirs: ['theirs'] },
      { kind: 'same', lines: ['three'] },
      { kind: 'hunk', index: 1, mine: [], theirs: ['extra'] },
    ]);
  });

  it('builds the text from the choices', () => {
    const parts = hxMergeParts(a, b);
    expect(hxMergeText(parts, {}, true)).toBe(a);
    expect(hxMergeText(parts, { 0: 'theirs', 1: 'theirs' }, true)).toBe(b);
    expect(hxMergeText(parts, { 0: 'both' }, true)).toBe('one\nmine\ntheirs\nthree\n');
    expect(hxMergeText(parts, { 0: 'both' }, false)).toBe('one\nmine\ntheirs\nthree');
  });

  it('has no hunk for equal texts', () => {
    expect(hxMergeParts('x\n', 'x\n')).toEqual([{ kind: 'same', lines: ['x'] }]);
    expect(hxMergeText([], {}, true)).toBe('');
  });
});
