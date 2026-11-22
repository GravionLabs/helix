/** A piece of a changed line; `changed` pieces are the words that differ from the paired line. */
export interface HxSegment {
  text: string;
  changed: boolean;
}

export interface HxDiffRow {
  kind: 'same' | 'add' | 'del';
  /** The line without its line break. */
  text: string;
  /** Word-level pieces of a line that has a partner on the other side; absent otherwise. */
  segments?: HxSegment[];
}

/** Longest common subsequence as index pairs; the common head and tail are matched first. */
function lcs<T>(a: readonly T[], b: readonly T[]): [number, number][] {
  let head = 0;
  while (head < a.length && head < b.length && a[head] === b[head]) head++;
  let tail = 0;
  while (
    tail < a.length - head &&
    tail < b.length - head &&
    a[a.length - 1 - tail] === b[b.length - 1 - tail]
  )
    tail++;
  const pairs: [number, number][] = [];
  for (let i = 0; i < head; i++) pairs.push([i, i]);
  const n = a.length - head - tail;
  const m = b.length - head - tail;
  if (n > 0 && m > 0) {
    // A very large middle falls back to 'all replaced' instead of an O(n*m) table.
    if (n * m <= 4_000_000) {
      const w = m + 1;
      const t = new Uint32Array((n + 1) * w);
      for (let i = n - 1; i >= 0; i--) {
        for (let j = m - 1; j >= 0; j--) {
          t[i * w + j] =
            a[head + i] === b[head + j]
              ? t[(i + 1) * w + j + 1] + 1
              : Math.max(t[(i + 1) * w + j], t[i * w + j + 1]);
        }
      }
      let i = 0;
      let j = 0;
      while (i < n && j < m) {
        if (a[head + i] === b[head + j]) {
          pairs.push([head + i, head + j]);
          i++;
          j++;
        } else if (t[(i + 1) * w + j] >= t[i * w + j + 1]) i++;
        else j++;
      }
    }
  }
  for (let k = tail; k > 0; k--) pairs.push([a.length - k, b.length - k]);
  return pairs;
}

/** Splits into words, whitespace runs and single punctuation marks; joining gives the input back. */
function tokenize(line: string): string[] {
  return line.match(/\s+|[\p{L}\p{N}_]+|[^\s\p{L}\p{N}_]/gu) ?? [];
}

/** Word-level difference of two lines: the pieces of each side, marking what the other lacks. */
export function hxWordDiff(
  oldLine: string,
  newLine: string,
): { old: HxSegment[]; new: HxSegment[] } {
  const a = tokenize(oldLine);
  const b = tokenize(newLine);
  const pairs = lcs(a, b);
  const keptA = new Set(pairs.map((p) => p[0]));
  const keptB = new Set(pairs.map((p) => p[1]));
  const build = (tokens: string[], kept: Set<number>): HxSegment[] => {
    const out: HxSegment[] = [];
    tokens.forEach((text, i) => {
      const changed = !kept.has(i);
      const last = out[out.length - 1];
      if (last?.changed === changed) last.text += text;
      else out.push({ text, changed });
    });
    return out;
  };
  return { old: build(a, keptA), new: build(b, keptB) };
}

/** Lines of a text; a trailing line break does not add an empty line, an empty text has none. */
function splitLines(text: string): string[] {
  if (text === '') return [];
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines;
}

/**
 * Line-based diff of two texts (longest common subsequence over lines, after the common head and
 * tail are trimmed). Where a run of removed lines is followed by a run of added lines, the lines
 * are paired in order and get word-level `segments`; surplus lines get none.
 *
 * CRLF is read as LF, and a final line break does not add a line, so `'x\n'` and `'x'` give no
 * rows. If the differing middle has more than 4,000,000 cells (n*m), it falls back to
 * "all deleted, then all added" instead of building the table.
 */
export function hxDiffLines(oldText: string, newText: string): HxDiffRow[] {
  const a = splitLines(oldText);
  const b = splitLines(newText);
  const pairs = lcs(a, b);
  const rows: HxDiffRow[] = [];
  let i = 0;
  let j = 0;
  const flush = (ai: number, bj: number): void => {
    const removed = a.slice(i, ai);
    const added = b.slice(j, bj);
    const paired = Math.min(removed.length, added.length);
    const delRows: HxDiffRow[] = removed.map((text) => ({ kind: 'del', text }));
    const addRows: HxDiffRow[] = added.map((text) => ({ kind: 'add', text }));
    for (let k = 0; k < paired; k++) {
      const w = hxWordDiff(removed[k], added[k]);
      delRows[k].segments = w.old;
      addRows[k].segments = w.new;
    }
    rows.push(...delRows, ...addRows);
  };
  for (const [pi, pj] of pairs) {
    flush(pi, pj);
    rows.push({ kind: 'same', text: a[pi] });
    i = pi + 1;
    j = pj + 1;
  }
  flush(a.length, b.length);
  return rows;
}

/** Number of added and removed lines. */
export function hxDiffStat(rows: readonly HxDiffRow[]): { added: number; removed: number } {
  return {
    added: rows.filter((r) => r.kind === 'add').length,
    removed: rows.filter((r) => r.kind === 'del').length,
  };
}

/** A run of lines both versions share, or a hunk where they differ. */
export type HxMergePart =
  | { kind: 'same'; lines: string[] }
  | { kind: 'hunk'; index: number; mine: string[]; theirs: string[] };

/** Which side of a hunk goes into the merged note. */
export type HxMergeChoice = 'mine' | 'theirs' | 'both';

/** Splits the difference of two texts into shared runs and hunks (`mine` is `a`, `theirs` is `b`). */
export function hxMergeParts(a: string, b: string): HxMergePart[] {
  const parts: HxMergePart[] = [];
  let hunks = 0;
  for (const row of hxDiffLines(a, b)) {
    const last = parts[parts.length - 1];
    if (row.kind === 'same') {
      if (last?.kind === 'same') last.lines.push(row.text);
      else parts.push({ kind: 'same', lines: [row.text] });
    } else {
      let hunk = last?.kind === 'hunk' ? last : null;
      if (!hunk) {
        hunk = { kind: 'hunk', index: hunks++, mine: [], theirs: [] };
        parts.push(hunk);
      }
      (row.kind === 'del' ? hunk.mine : hunk.theirs).push(row.text);
    }
  }
  return parts;
}

/** The merged text; a hunk without a choice takes `'mine'`. It ends with a line break when `endsWithBreak` is true and it has lines. */
export function hxMergeText(
  parts: readonly HxMergePart[],
  choices: Readonly<Record<number, HxMergeChoice>>,
  endsWithBreak: boolean,
): string {
  const lines: string[] = [];
  for (const part of parts) {
    if (part.kind === 'same') lines.push(...part.lines);
    else {
      const choice = choices[part.index] ?? 'mine';
      if (choice !== 'theirs') lines.push(...part.mine);
      if (choice !== 'mine') lines.push(...part.theirs);
    }
  }
  return lines.length > 0 && endsWithBreak ? `${lines.join('\n')}\n` : lines.join('\n');
}
