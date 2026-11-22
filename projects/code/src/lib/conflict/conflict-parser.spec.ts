import { hxParseConflicts } from './conflict-parser';

describe('hxParseConflicts', () => {
  it('returns nothing for text without markers', () => {
    expect(hxParseConflicts('')).toEqual([]);
    expect(hxParseConflicts('a\nb\nc')).toEqual([]);
  });

  it('parses a two-way conflict with labels and 0-based lines', () => {
    const text = ['a', '<<<<<<< HEAD', 'mine', '=======', 'theirs', '>>>>>>> feature/x', 'z'].join(
      '\n',
    );
    expect(hxParseConflicts(text)).toEqual([
      {
        start: 1,
        end: 5,
        ours: { from: 1, to: 3 },
        theirs: { from: 3, to: 5 },
        oursLabel: 'HEAD',
        theirsLabel: 'feature/x',
      },
    ]);
  });

  it('parses a diff3 conflict with a base', () => {
    const text = [
      '<<<<<<< ours',
      'o',
      '||||||| merged common ancestors',
      'b',
      '=======',
      't',
      '>>>>>>> theirs',
    ].join('\n');
    const [c] = hxParseConflicts(text);
    expect(c.ours).toEqual({ from: 0, to: 2 });
    expect(c.base).toEqual({ from: 2, to: 4 });
    expect(c.theirs).toEqual({ from: 4, to: 6 });
    expect(c.baseLabel).toBe('merged common ancestors');
  });

  it('parses several conflicts and CRLF text', () => {
    const one = ['<<<<<<< a', 'x', '=======', 'y', '>>>>>>> b'];
    const text = [...one, 'mid', ...one].join('\r\n');
    const found = hxParseConflicts(text);
    expect(found.map((c) => [c.start, c.end])).toEqual([
      [0, 4],
      [6, 10],
    ]);
    expect(found[0].theirsLabel).toBe('b');
  });

  it('accepts empty labels and sides', () => {
    const [c] = hxParseConflicts('<<<<<<<\n=======\n>>>>>>>');
    expect(c).toMatchObject({ oursLabel: '', theirsLabel: '', ours: { from: 0, to: 1 } });
  });

  it('leaves a conflict without an end as plain text', () => {
    expect(hxParseConflicts('<<<<<<< a\nx\n=======\ny')).toEqual([]);
    expect(hxParseConflicts('<<<<<<< a\nx\ny')).toEqual([]);
  });

  it('leaves stray markers alone', () => {
    expect(hxParseConflicts('=======\n>>>>>>> b\n||||||| c')).toEqual([]);
    expect(hxParseConflicts('<<<<<<< a\n>>>>>>> b')).toEqual([]);
  });

  it('drops an outer start when another start follows, keeps the inner conflict', () => {
    const text = ['<<<<<<< a', 'x', '<<<<<<< b', 'y', '=======', 'z', '>>>>>>> c'].join('\n');
    const found = hxParseConflicts(text);
    expect(found).toHaveLength(1);
    expect(found[0].start).toBe(2);
    expect(found[0].oursLabel).toBe('b');
  });

  it('drops a conflict with a repeated separator or base', () => {
    expect(hxParseConflicts('<<<<<<< a\n=======\n=======\n>>>>>>> b')).toEqual([]);
    expect(hxParseConflicts('<<<<<<< a\n=======\n||||||| x\n>>>>>>> b')).toEqual([]);
  });

  it('does not take longer or glued runs or arrow text as markers', () => {
    expect(hxParseConflicts('<<<<<<<<\n=======\n>>>>>>>')).toEqual([]);
    expect(hxParseConflicts('<<<<<<<a\n=======\n>>>>>>>')).toEqual([]);
    expect(hxParseConflicts('<<<<<<< a\n======= x\n>>>>>>> b')).toEqual([]);
  });
});
