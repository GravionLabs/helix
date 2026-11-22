import { type HxCommit, type HxGraphSegment, hxLayoutCommits } from './commit-layout';

function c(id: string, ...parents: string[]): HxCommit {
  return { id, parents, message: id, author: 'a', time: 0 };
}

function seg(
  kind: HxGraphSegment['kind'],
  fromLane: number,
  toLane: number,
  color: number,
): HxGraphSegment {
  return { kind, fromLane, toLane, color };
}

function shape(commits: HxCommit[]) {
  return hxLayoutCommits(commits).rows.map((r) => ({ lane: r.lane, segments: r.segments }));
}

describe('hxLayoutCommits', () => {
  it('lays out a linear history on lane 0', () => {
    const { rows, state } = hxLayoutCommits([c('a', 'b'), c('b', 'c'), c('c')]);
    expect(rows.map((r) => r.lane)).toEqual([0, 0, 0]);
    expect(rows[0].segments).toEqual([seg('pass-through', 0, 0, 0)]);
    expect(rows[1].segments).toEqual([seg('pass-through', 0, 0, 0)]);
    expect(rows.map((r) => r.hasIncoming)).toEqual([false, true, true]);
    expect(rows[2].segments).toEqual([]);
    expect(state.lanes).toEqual([]);
  });

  it('lays out one branch and merge', () => {
    // m merges a (main) and b (side); both lead to base
    expect(shape([c('m', 'a', 'b'), c('a', 'base'), c('b', 'base'), c('base')])).toEqual([
      { lane: 0, segments: [seg('pass-through', 0, 0, 0), seg('branch-out', 0, 1, 1)] },
      { lane: 0, segments: [seg('pass-through', 1, 1, 1), seg('pass-through', 0, 0, 0)] },
      {
        lane: 1,
        segments: [seg('pass-through', 0, 0, 0), seg('pass-through', 1, 1, 1)],
      },
      { lane: 0, segments: [seg('merge-in', 1, 0, 1)] },
    ]);
  });

  it('merges lanes that expect the same commit', () => {
    const rows = shape([c('a', 'base'), c('b', 'base'), c('base')]);
    // a on lane 0, b is a new tip on lane 1; base takes lane 0 and merge-in from lane 1
    expect(rows[1].lane).toBe(1);
    expect(rows[2]).toEqual({ lane: 0, segments: [seg('merge-in', 1, 0, 1)] });
  });

  it('lays out an octopus merge on lanes 0, 1, 2', () => {
    const rows = shape([c('o', 'p', 'q', 'r')]);
    expect(rows[0]).toEqual({
      lane: 0,
      segments: [
        seg('pass-through', 0, 0, 0),
        seg('branch-out', 0, 1, 1),
        seg('branch-out', 0, 2, 2),
      ],
    });
  });

  it('keeps two roots apart', () => {
    const { rows, state } = hxLayoutCommits([c('a', 'a0'), c('b', 'b0'), c('a0'), c('b0')]);
    expect(rows.map((r) => r.lane)).toEqual([0, 1, 0, 1]);
    expect(rows.map((r) => r.color)).toEqual([0, 1, 0, 1]);
    expect(rows[2].segments).toEqual([seg('pass-through', 1, 1, 1)]);
    expect(rows[3].segments).toEqual([]);
    expect(state.lanes).toEqual([]);
  });

  it('keeps a line open when the parent is outside the list', () => {
    const { rows, state } = hxLayoutCommits([c('a', 'x')]);
    expect(rows[0].segments).toEqual([seg('pass-through', 0, 0, 0)]);
    expect(state.lanes).toEqual([{ id: 'x', color: 0 }]);
  });

  it('handles criss-cross merges', () => {
    // m1 = merge(a1, b1), m2 = merge(b1, a1) ... each with the other's commit as 2nd parent
    const commits = [
      c('m1', 'a1', 'b1'),
      c('m2', 'b1', 'a1'),
      c('a1', 'base'),
      c('b1', 'base'),
      c('base'),
    ];
    const { rows, state } = hxLayoutCommits(commits);
    expect(rows.map((r) => r.lane)).toEqual([0, 2, 0, 1, 0]);
    expect(rows[0].segments).toEqual([seg('pass-through', 0, 0, 0), seg('branch-out', 0, 1, 1)]);
    expect(rows[1].segments).toEqual([
      seg('pass-through', 0, 0, 0),
      seg('pass-through', 1, 1, 1),
      seg('pass-through', 2, 2, 2),
      seg('branch-out', 2, 0, 0),
    ]);
    expect(rows[2].segments).toEqual([
      seg('pass-through', 1, 1, 1),
      seg('pass-through', 2, 2, 2),
      seg('pass-through', 0, 0, 0),
    ]);
    expect(rows[3].segments).toEqual([
      seg('pass-through', 0, 0, 0),
      seg('merge-in', 2, 1, 2),
      seg('pass-through', 1, 1, 1),
    ]);
    expect(state.lanes).toEqual([]);
    // every lane that opened is closed again
    expect(rows[4].segments.every((s) => s.kind === 'merge-in')).toBe(true);
  });

  it('uses at most 2 lanes for 20 short branches in a row', () => {
    const commits: HxCommit[] = [];
    for (let i = 0; i < 20; i++) {
      commits.push(c(`m${i}`, `m${i + 1}`, `t${i}`));
      commits.push(c(`t${i}`, `m${i + 1}`));
    }
    commits.push(c('m20'));
    const { rows } = hxLayoutCommits(commits);
    expect(Math.max(...rows.map((r) => r.lane))).toBe(1);
    for (const r of rows) {
      for (const s of r.segments) {
        expect(Math.max(s.fromLane, s.toLane)).toBeLessThanOrEqual(1);
      }
    }
  });

  it('cycles colors mod 8 and keeps the color with the line', () => {
    const commits: HxCommit[] = [];
    for (let i = 0; i < 10; i++) commits.push(c(`t${i}`, 'root'));
    commits.push(c('root'));
    const { rows } = hxLayoutCommits(commits);
    expect(rows.slice(0, 10).map((r) => r.color)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 0, 1]);
    // the root sits on the line of its leftmost lane
    expect(rows[10].color).toBe(0);
  });

  it('reuses a freed lane', () => {
    const rows = hxLayoutCommits([
      c('a', 'base'),
      c('b', 'base'),
      c('base', 'z'),
      c('t', 'z'),
    ]).rows;
    // t is a new tip after lane 1 was freed: takes lane 1 again
    expect(rows[3].lane).toBe(1);
  });

  it('continues a layout in pages with the same rows', () => {
    const commits: HxCommit[] = [];
    for (let i = 0; i < 30; i++) {
      commits.push(c(`m${i}`, `m${i + 1}`, ...(i % 3 === 0 ? [`t${i}`] : [])));
      if (i % 3 === 0) commits.push(c(`t${i}`, `m${i + 2}`));
    }
    const all = hxLayoutCommits(commits);
    for (const cut of [1, 7, 20]) {
      const first = hxLayoutCommits(commits.slice(0, cut));
      const second = hxLayoutCommits(commits.slice(cut), first.state);
      expect([...first.rows, ...second.rows]).toEqual(all.rows);
      expect(second.state).toEqual(all.state);
    }
  });

  it('does not change the previous state', () => {
    const first = hxLayoutCommits([c('a', 'x')]);
    const copy = structuredClone(first.state);
    hxLayoutCommits([c('x')], first.state);
    expect(first.state).toEqual(copy);
  });

  it('lays out 10,000 commits within 1 s', () => {
    const commits: HxCommit[] = [];
    for (let i = 0; i < 10_000; i++) {
      const parents = [`c${i + 1}`];
      if (i % 5 === 0) parents.push(`c${i + 3}`);
      commits.push(c(`c${i}`, ...parents));
    }
    const start = performance.now();
    const { rows } = hxLayoutCommits(commits);
    const ms = performance.now() - start;
    console.info(`hxLayoutCommits: 10,000 commits in ${ms.toFixed(1)} ms (target 200 ms)`);
    expect(rows.length).toBe(10_000);
    expect(ms).toBeLessThan(1000);
  });
});
