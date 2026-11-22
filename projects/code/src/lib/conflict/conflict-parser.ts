/** A line range of a conflict, 0-based, both ends inclusive and both marker lines. */
export interface HxConflictRange {
  from: number;
  to: number;
}

/**
 * A Git conflict in a text. Line numbers are 0-based.
 *
 * Each range runs from the line of its own marker to the line of the next marker, so the content
 * of a side is the lines strictly between `from` and `to`:
 *
 * - `ours`: `<<<<<<<` to `|||||||` (diff3 style) or to `=======`
 * - `base` (diff3 style only): `|||||||` to `=======`
 * - `theirs`: `=======` to `>>>>>>>`
 *
 * `start` is the `<<<<<<<` line, `end` the `>>>>>>>` line. The labels are the text after the markers.
 */
export interface HxConflict {
  start: number;
  end: number;
  ours: HxConflictRange;
  base?: HxConflictRange;
  theirs: HxConflictRange;
  oursLabel: string;
  baseLabel?: string;
  theirsLabel: string;
}

type Marker = '<' | '|' | '=' | '>';

/** The kind of conflict marker a line is, or `null`: seven characters, then nothing or a blank. */
export function hxConflictMarker(line: string): Marker | null {
  if (line.length < 7) return null;
  const c = line[0];
  if (c !== '<' && c !== '|' && c !== '=' && c !== '>') return null;
  for (let i = 1; i < 7; i++) if (line[i] !== c) return null;
  if (line.length > 7 && line[7] !== ' ' && line[7] !== '\t' && line[7] !== '\r') return null;
  // `=======` takes no label.
  if (c === '=' && line.slice(7).trim() !== '') return null;
  return c;
}

const labelOf = (line: string): string => line.slice(7).trim();

/**
 * Finds the conflicts of `text`. Malformed markers (no end, a start inside a conflict, markers in
 * the wrong order) are left as plain text; this never throws.
 */
export function hxParseConflicts(text: string): HxConflict[] {
  return hxParseConflictLines(text.split('\n'));
}

/** {@link hxParseConflicts} for lines that are already split. */
export function hxParseConflictLines(lines: readonly string[]): HxConflict[] {
  const found: HxConflict[] = [];
  let start = -1;
  let base = -1;
  let sep = -1;
  for (let i = 0; i < lines.length; i++) {
    const marker = hxConflictMarker(lines[i]);
    if (marker === null) continue;
    if (marker === '<') {
      // A start inside a conflict: the earlier one stays plain text, this one begins anew.
      start = i;
      base = -1;
      sep = -1;
    } else if (start < 0) {
      continue;
    } else if (marker === '|') {
      if (base >= 0 || sep >= 0) start = -1;
      else base = i;
    } else if (marker === '=') {
      if (sep >= 0) start = -1;
      else sep = i;
    } else {
      if (sep >= 0) {
        found.push({
          start,
          end: i,
          ours: { from: start, to: base >= 0 ? base : sep },
          ...(base >= 0 ? { base: { from: base, to: sep } } : {}),
          theirs: { from: sep, to: i },
          oursLabel: labelOf(lines[start]),
          ...(base >= 0 ? { baseLabel: labelOf(lines[base]) } : {}),
          theirsLabel: labelOf(lines[i]),
        });
      }
      start = -1;
    }
    if (start < 0) {
      base = -1;
      sep = -1;
    }
  }
  return found;
}
